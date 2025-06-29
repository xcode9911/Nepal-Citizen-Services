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

// Admin user creation handler
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
    // Auto-generate unique citizenship number
    const citizenshipNo = await generateUniqueCitizenshipNo();

    // Create user in the database
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