import { Request, Response } from 'express';
import prisma from '../models';
import { PaymentStatus } from '@prisma/client';
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

function calculateTax(salary: number): number {
  if (salary <= 500000) {
    return salary * 0.01;
  } else if (salary <= 700000) {
    return 5000 + (salary - 500000) * 0.10;
  } else if (salary <= 1000000) {
    return 25000 + (salary - 700000) * 0.20;
  } else if (salary <= 2000000) {
    return 85000 + (salary - 1000000) * 0.30;
  } else {
    return 385000 + (salary - 2000000) * 0.36;
  }
}

async function verifyEsewaPayment({ amt, pid, rid }: { amt: number; pid: string; rid: string }) {
  const merchantCode = process.env.ESEWA_MERCHANT_CODE;
  if (!merchantCode) throw new Error('ESEWA_MERCHANT_CODE not set in environment');
  const params = new URLSearchParams();
  params.append('amt', amt.toString());
  params.append('rid', rid); // reference id from eSewa
  params.append('pid', pid); // product id (your internal payment id)
  params.append('scd', merchantCode);
  const response = await axios.post(
    'https://uat.esewa.com.np/epay/transrec',
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  const result = await parseStringPromise(response.data);
  // eSewa returns <response_code>Success</response_code> for success
  return result.response.response_code[0] === 'Success';
}

// User: Create a payment (amount auto-calculated from salary)
export const createPayment = async (req: Request, res: Response) => {
  const { userId, esewaRefId } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.salary == null) {
      return res.status(400).json({ message: 'User not found or salary not set' });
    }
    const amount = calculateTax(user.salary); // Payable amount is tax based on salary
    // Create payment with PENDING status
    const payment = await prisma.payment.create({
      data: {
        amount,
        esewaRefId,
        userId: user.id,
        status: PaymentStatus.PENDING,
      },
    });
    // Verify with eSewa
    let verified = false;
    try {
      verified = await verifyEsewaPayment({ amt: amount, pid: payment.id, rid: esewaRefId });
    } catch (e) {
      // Verification failed (network or other error)
      return res.status(201).json({ payment, verification: 'failed', error: (e as Error).message });
    }
    if (verified) {
      const updated = await prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.VERIFIED },
      });
      return res.status(201).json({ payment: updated, verification: 'success' });
    } else {
      return res.status(201).json({ payment, verification: 'failed' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error creating payment', error: (err as Error).message });
  }
};

// User: Get their payments
export const getUserPayments = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching payments', error: (err as Error).message });
  }
};

// Admin: Verify or reject a payment
export const verifyPayment = async (req: Request, res: Response) => {
  const { paymentId, adminId, action } = req.body; // action: 'VERIFIED' or 'REJECTED'
  if (!['VERIFIED', 'REJECTED'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }
  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: action,
        verifiedBy: { connect: { id: adminId } },
        verifiedAt: new Date(),
      },
    });
    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating payment', error: (err as Error).message });
  }
};

// Admin: Get all payments
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, verifiedBy: true },
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching all payments', error: (err as Error).message });
  }
};
