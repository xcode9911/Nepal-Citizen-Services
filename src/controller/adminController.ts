import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility to generate random 10-digit citizenship number
const generateUniqueCitizenshipNo = async (): Promise<string> => {
  let unique = false;
  let generatedNo = '';

  while (!unique) {
    generatedNo = Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit number

    const existing = await prisma.user.findUnique({
      where: { citizenshipNo: generatedNo },
    });

    if (!existing) unique = true;
  }

  return generatedNo;
};

// Create User
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    address,
    fatherName,
    motherName,
    dob,
    issueDate,
  } = req.body;

  try {
    const citizenshipNo = await generateUniqueCitizenshipNo();

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        fatherName,
        motherName,
        citizenshipNo,
        dob: dob ? new Date(dob) : undefined,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        is_active: false,
      },
    });

    return res.status(201).json({ message: 'User created successfully.', user });
  } catch (err) {
    console.error('Error creating user:', err);
    if ((err as any)?.code === 'P2002') {
      return res.status(400).json({ message: 'Email already in use' });
    }
    return res.status(500).json({ message: 'Error creating user', error: (err as Error).message });
  }
};

// Admin login
export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (password !== admin.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.status(200).json({
      message: 'Login successful. Please verify OTP.',
      adminId: admin.id,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      message: 'Server error during login',
      error: (error as Error).message,
    });
  }
};

// Admin OTP verification
export const verifyAdminOtp = async (req: Request, res: Response) => {
  const { adminId, otp } = req.body;

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (otp !== admin.permanentOtp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    return res.status(200).json({ message: 'OTP verified successfully. Access granted.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({
      message: 'Server error during OTP verification',
      error: (error as Error).message,
    });
  }
};
