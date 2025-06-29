import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Admin user creation handler
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    citizenshipNo,
    email,
    address,
    fatherName,
    motherName,
    dob,         
    issueDate,   
  } = req.body;

  try {
    // Check if citizenship number is already in use
    const existingUser = await prisma.user.findUnique({
      where: { citizenshipNo },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Citizenship number already in use' });
    }

    // Create user in the database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        fatherName,
        motherName,
        citizenshipNo,
        dob: dob ? new Date(dob) : undefined,             // ✅ safely parse DateTime
        issueDate: issueDate ? new Date(issueDate) : undefined,
        is_active: false, // Initially inactive
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