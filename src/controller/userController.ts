import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

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
});

// Set up Socket.IO
const setupWebSocket = (server: any) => {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

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

// Send notification to user and emit real-time notification
const sendNotification = async (userId: string, title: string, message: string, io: any) => {
  await prisma.notification.create({
    data: {
      title,
      message,
      userId,
    },
  });
  io.emit("notification", { userId, title, message });
};

// Activation Handler
export const activateUser = (io: any) => async (req: Request, res: Response) => {
  const { email, citizenshipNo } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email, citizenshipNo } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
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
    await sendNotification(user.id, "OTP Sent", "Your OTP for account activation has been sent to your email.", io);
    return res.status(200).json({ message: 'OTP sent to email for account activation.' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return res.status(500).json({ message: 'Error sending OTP', error: (err as Error).message });
  }
};

// Activation OTP Verification
export const verifyActivationOTP = (io: any) => async (req: Request, res: Response) => {
  const { email, citizenshipNo, otp } = req.body;
  try {
    const user = await prisma.user.findFirst({ where: { email, citizenshipNo } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
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
    await prisma.user.update({ where: { id: user.id }, data: { is_active: true } });
    await prisma.otp.deleteMany({ where: { userId: user.id } });
    await sendNotification(user.id, "Account Activated", "Your account has been activated successfully.", io);
    return res.status(200).json({ message: 'User activated successfully.' });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Error verifying OTP', error: (err as Error).message });
  }
};

// OTP-based Login Request
export const login = (io: any) => async (req: Request, res: Response) => {
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
    await sendNotification(user.id, "Login OTP Sent", "Your OTP for login has been sent to your email.", io);
    return res.status(200).json({ message: 'OTP sent to email for login.' });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ message: 'Error logging in', error: (err as Error).message });
  }
};

// OTP Verification for Login
export const verifyLoginOTP = (io: any) => async (req: Request, res: Response) => {
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
    // Only include scalar fields in the JWT payload (no relations)
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      fatherName: user.fatherName,
      motherName: user.motherName,
      citizenshipNo: user.citizenshipNo,
      issueDate: user.issueDate,
      dob: user.dob,
      panNumber: user.panNumber,
      panIssueDate: user.panIssueDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      is_active: user.is_active,
      salary: user.salary,
    };
    const token = jwt.sign(userPayload, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1h',
    });
    await sendNotification(user.id, "Login Successful", "You have logged in successfully.", io);
    return res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error verifying OTP:', err);
    return res.status(500).json({ message: 'Error verifying OTP', error: (err as Error).message });
  }
};

// Notification Route
export const getNotifications = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.status(200).json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({ message: 'Error fetching notifications', error: (err as Error).message });
  }
};

// Update user salary
export const updateSalary = async (req: Request, res: Response) => {
  const { userId, salary } = req.body;
  if (!userId || typeof salary !== 'number' || salary < 0) {
    return res.status(400).json({ message: 'Invalid userId or salary' });
  }
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { salary },
    });
    return res.status(200).json({ message: 'Salary updated', user });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating salary', error: (err as Error).message });
  }
};

export { setupWebSocket };