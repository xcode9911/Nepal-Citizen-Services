"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLoginOTP = exports.login = exports.verifyActivationOTP = exports.activateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// Nodemailer setup
const transporter = nodemailer_1.default.createTransport({
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
const sendOTPEmail = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
            from: `"Nepal Citizen Services" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Your OTP for Account Activation/Login",
            html: `<p>Your OTP is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
        });
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
// Activation Handler
const activateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, citizenshipNo } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email,
                citizenshipNo,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User with given email and citizenship number not found.' });
        }
        const otp = generateOTP();
        yield prisma.otp.create({
            data: {
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                userId: user.id,
            },
        });
        yield sendOTPEmail(email, otp);
        return res.status(200).json({ message: 'OTP sent to email for account activation.' });
    }
    catch (err) {
        console.error('Error sending OTP:', err);
        return res.status(500).json({ message: 'Error sending OTP', error: err.message });
    }
});
exports.activateUser = activateUser;
// Activation OTP Verification
const verifyActivationOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, citizenshipNo, otp } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email,
                citizenshipNo,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found with provided email and citizenship number.' });
        }
        const otpEntry = yield prisma.otp.findFirst({
            where: {
                userId: user.id,
                code: otp,
                expiresAt: { gte: new Date() },
            },
        });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        yield prisma.user.update({
            where: { id: user.id },
            data: { is_active: true },
        });
        yield prisma.otp.deleteMany({ where: { userId: user.id } });
        return res.status(200).json({ message: 'User activated successfully.' });
    }
    catch (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
});
exports.verifyActivationOTP = verifyActivationOTP;
// OTP-based Login Request
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, citizenshipNo } = req.body;
    try {
        const user = yield prisma.user.findFirst({
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
        yield prisma.otp.create({
            data: {
                code: otp,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000),
                userId: user.id,
            },
        });
        yield sendOTPEmail(email, otp);
        return res.status(200).json({ message: 'OTP sent to email for login.' });
    }
    catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});
exports.login = login;
// OTP Verification for Login
const verifyLoginOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, citizenshipNo, otp } = req.body;
    try {
        const user = yield prisma.user.findFirst({
            where: {
                email,
                citizenshipNo,
                is_active: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found or not activated.' });
        }
        const otpEntry = yield prisma.otp.findFirst({
            where: {
                userId: user.id,
                code: otp,
                expiresAt: { gte: new Date() },
            },
        });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }
        yield prisma.otp.deleteMany({ where: { userId: user.id } });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '1h',
        });
        return res.status(200).json({ message: 'Login successful', token });
    }
    catch (err) {
        console.error('Error verifying OTP:', err);
        return res.status(500).json({ message: 'Error verifying OTP', error: err.message });
    }
});
exports.verifyLoginOTP = verifyLoginOTP;
//# sourceMappingURL=userController.js.map