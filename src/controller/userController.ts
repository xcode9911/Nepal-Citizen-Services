import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});

// Generate a 5-digit OTP
const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Send OTP email
const sendOTPEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Nepal Citizen Services" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your OTP for Account Activation/Login",
      html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Activation Handler
export const activateUser = async (req: Request, res: Response) => {
  const { email, citizenshipNo } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        citizenshipNo,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User with given email and citizenship number not found.' });
    }

    const otp = generateOTP();

    await prisma.otp.create({
      data: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id,
      },
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to email for account activation.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ message: 'Error sending OTP', error: (err as Error).message });
  }
};

// Activation OTP Verification
export const verifyActivationOTP = async (req: Request, res: Response) => {
  const { email, citizenshipNo, otp } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        citizenshipNo,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided email and citizenship number.' });
    }

    const otpEntry = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: otp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { is_active: true },
    });

    await prisma.otp.deleteMany({ where: { userId: user.id } });

    return res.status(200).json({ message: 'User activated successfully.' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Error verifying OTP', error: (err as Error).message });
  }
};

// OTP-based Login Request
export const login = async (req: Request, res: Response) => {
  const { email, citizenshipNo } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        citizenshipNo,
        is_active: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found or account not activated' });
    }

    const otp = generateOTP();

    await prisma.otp.create({
      data: {
        code: otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        userId: user.id,
      },
    });

    await sendOTPEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent to email for login.' });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ message: 'Error logging in', error: (err as Error).message });
  }
};

// OTP Verification for Login
export const verifyLoginOTP = async (req: Request, res: Response) => {
  const { email, citizenshipNo, otp } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        citizenshipNo,
        is_active: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found or not activated.' });
    }

    const otpEntry = await prisma.otp.findFirst({
      where: {
        userId: user.id,
        code: otp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    await prisma.otp.deleteMany({ where: { userId: user.id } });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Error verifying OTP', error: (err as Error).message });
  }
};
