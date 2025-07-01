import { Request, Response } from 'express';
import prisma from '../models';
import { PaymentStatus } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';

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

function generateEsewaSignature({ total_amount, transaction_uuid, product_code }: { total_amount: string, transaction_uuid: string, product_code: string }) {
  const secret = process.env.ESEWA_SECRET;
  if (!secret) throw new Error('ESEWA_SECRET not set in environment');
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  const hash = crypto.createHmac('sha256', secret).update(message).digest('base64');
  return hash;
}

async function verifyEsewaPayment({ total_amount, transaction_uuid, product_code, signature }: { total_amount: string, transaction_uuid: string, product_code: string, signature: string }) {
  const params = {
    total_amount,
    transaction_uuid,
    product_code,
    signature,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
  };
  const response = await axios.post(
    'https://rc-epay.esewa.com.np/api/epay/transaction/status/',
    params,
    { headers: { 'Content-Type': 'application/json' } }
  );
  // eSewa returns JSON with status: 'COMPLETE' for success
  return response.data.status === 'COMPLETE';
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
    const product_code = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';
    const total_amount = amount.toFixed(2);
    const transaction_uuid = esewaRefId;
    // Create payment with PENDING status
    const payment = await prisma.payment.create({
      data: {
        amount,
        esewaRefId,
        userId: user.id,
        status: PaymentStatus.PENDING,
      },
    });
    // Generate signature
    let signature = '';
    try {
      signature = generateEsewaSignature({ total_amount, transaction_uuid, product_code });
    } catch (e) {
      return res.status(500).json({ message: 'Error generating signature', error: (e as Error).message });
    }
    // Verify with eSewa
    let verified = false;
    try {
      verified = await verifyEsewaPayment({ total_amount, transaction_uuid, product_code, signature });
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
