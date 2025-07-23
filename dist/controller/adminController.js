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
exports.getAllUsers = exports.verifyAdminOtp = exports.adminLogin = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// Utility to generate a random 10-digit citizenship number
const generateUniqueCitizenshipNo = () => __awaiter(void 0, void 0, void 0, function* () {
    let unique = false;
    let generatedNo = '';
    while (!unique) {
        generatedNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const existing = yield prisma.user.findUnique({
            where: { citizenshipNo: generatedNo },
        });
        if (!existing)
            unique = true;
    }
    return generatedNo;
});
// Utility to generate a Nepal-style PAN number: 7 letters + 5 digits
const generateUniquePanNumberNepal = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const existing = yield prisma.user.findUnique({
            where: { panNumber: pan },
        });
        if (!existing)
            unique = true;
    }
    return pan;
});
// Create User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, fatherName, motherName, dob, issueDate, panIssueDate, } = req.body;
    if (typeof name !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ message: 'Invalid input types' });
    }
    try {
        const citizenshipNo = yield generateUniqueCitizenshipNo();
        const panNumber = yield generateUniquePanNumberNepal();
        const user = yield prisma.user.create({
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
    }
    catch (err) {
        console.error('Error creating user:', err);
        if ((err === null || err === void 0 ? void 0 : err.code) === 'P2002') {
            return res.status(400).json({ message: 'Email or PAN number already in use' });
        }
        return res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});
exports.createUser = createUser;
// Admin login with JWT
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const admin = yield prisma.admin.findUnique({
            where: { email },
        });
        if (!admin || password !== admin.password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Create JWT payload
        const payload = {
            id: admin.id,
            email: admin.email,
            role: 'admin',
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h', // Token expires in 2 hours
        });
        return res.status(200).json({
            message: 'Login successful. Please verify OTP.',
            adminId: admin.id,
            token,
        });
    }
    catch (error) {
        console.error('Admin login error:', error);
        return res.status(500).json({
            message: 'Server error during login',
            error: error.message,
        });
    }
});
exports.adminLogin = adminLogin;
// Admin OTP verification
const verifyAdminOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { adminId, otp } = req.body;
    try {
        const admin = yield prisma.admin.findUnique({
            where: { id: adminId },
        });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        if (otp !== admin.permanentOtp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        return res.status(200).json({ message: 'OTP verified successfully. Access granted.' });
    }
    catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({
            message: 'Server error during OTP verification',
            error: error.message,
        });
    }
});
exports.verifyAdminOtp = verifyAdminOtp;
// Get all users without ordering
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Fetching users for:', req.body);
    try {
        const users = yield prisma.user.findMany();
        return res.status(200).json(users);
    }
    catch (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ message: 'Error fetching users', error: err.message });
    }
});
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=adminController.js.map