import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Utility to generate a random 10-digit citizenship number
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

// Utility to generate a Nepal-style PAN number: 7 letters + 5 digits
const generateUniquePanNumberNepal = async (): Promise<string> => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let pan = '';
  let unique = false;

  while (!unique) {
    let prefix = '';
    for (let i = 0; i < 7; i++) {
      prefix += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    const digits = Math.floor(10000 + Math.random() * 90000).toString();

    pan = prefix + digits;

    const existing = await prisma.user.findUnique({
      where: { panNumber: pan },
    });

    if (!existing) unique = true;
  }

  return pan;
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
    panIssueDate,
  } = req.body;

  // Validate inputs
  if (typeof name !== 'string' || typeof email !== 'string') {
    return res.status(400).json({ message: 'Invalid input types' });
  }

  try {
    const citizenshipNo = await generateUniqueCitizenshipNo();
    const panNumber = await generateUniquePanNumberNepal();

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
        panNumber,
        panIssueDate: panIssueDate ? new Date(panIssueDate) : undefined,
        is_active: false,
      },
    });

    return res.status(201).json({ message: 'User created successfully.', user });
  } catch (err) {
    console.error('Error creating user:', err);
    if ((err as any)?.code === 'P2002') {
      return res.status(400).json({ message: 'Email or PAN number already in use' });
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

// Get all users without ordering
export const getAllUsers = async (req: Request, res: Response) => {
  // Example: Logging the request
  console.log('Fetching users for:', req.body); // You can log any relevant info

  try {
    const users = await prisma.user.findMany(); // No orderBy

    return res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Error fetching users', error: (err as Error).message });
  }
};