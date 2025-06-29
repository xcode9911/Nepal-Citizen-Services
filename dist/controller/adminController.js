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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper to generate a unique 10-digit citizenship number
const generateUniqueCitizenshipNo = () => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 0;
    const maxRetries = 10;
    while (retries < maxRetries) {
        const randomNum = Math.floor(1000000000 + Math.random() * 9000000000);
        const generatedNo = randomNum.toString(); // always a string
        // ✅ Use findFirst (NOT findUnique) to avoid errors with non-unique filters
        const existingUser = yield prisma.user.findFirst({
            where: { citizenshipNo: generatedNo },
        });
        if (!existingUser) {
            return generatedNo;
        }
        retries++;
    }
    throw new Error('Failed to generate unique citizenship number after multiple attempts.');
});
// Admin user creation handler
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, address, fatherName, motherName, dob, issueDate, } = req.body;
    try {
        const citizenshipNo = yield generateUniqueCitizenshipNo();
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
                is_active: false,
            },
        });
        return res.status(201).json({
            message: 'User created successfully.',
            user,
        });
    }
    catch (err) {
        console.error('Error creating user:', err);
        if ((err === null || err === void 0 ? void 0 : err.code) === 'P2002') {
            return res.status(400).json({ message: 'Email or citizenship number already in use' });
        }
        return res.status(500).json({
            message: 'Error creating user',
            error: err.message,
        });
    }
});
exports.createUser = createUser;
//# sourceMappingURL=adminController.js.map