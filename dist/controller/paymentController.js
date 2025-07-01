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
exports.getAllPayments = exports.verifyPayment = exports.getUserPayments = exports.createPayment = void 0;
const models_1 = __importDefault(require("../models"));
const client_1 = require("@prisma/client");
const axios_1 = __importDefault(require("axios"));
const xml2js_1 = require("xml2js");
function calculateTax(salary) {
    if (salary <= 500000) {
        return salary * 0.01;
    }
    else if (salary <= 700000) {
        return 5000 + (salary - 500000) * 0.10;
    }
    else if (salary <= 1000000) {
        return 25000 + (salary - 700000) * 0.20;
    }
    else if (salary <= 2000000) {
        return 85000 + (salary - 1000000) * 0.30;
    }
    else {
        return 385000 + (salary - 2000000) * 0.36;
    }
}
function verifyEsewaPayment(_a) {
    return __awaiter(this, arguments, void 0, function* ({ amt, pid, rid }) {
        const merchantCode = process.env.ESEWA_MERCHANT_CODE;
        if (!merchantCode)
            throw new Error('ESEWA_MERCHANT_CODE not set in environment');
        const params = new URLSearchParams();
        params.append('amt', amt.toString());
        params.append('rid', rid); // reference id from eSewa
        params.append('pid', pid); // product id (your internal payment id)
        params.append('scd', merchantCode);
        const response = yield axios_1.default.post('https://uat.esewa.com.np/epay/transrec', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        const result = yield (0, xml2js_1.parseStringPromise)(response.data);
        // eSewa returns <response_code>Success</response_code> for success
        return result.response.response_code[0] === 'Success';
    });
}
// User: Create a payment (amount auto-calculated from salary)
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, esewaRefId } = req.body;
    try {
        const user = yield models_1.default.user.findUnique({ where: { id: userId } });
        if (!user || user.salary == null) {
            return res.status(400).json({ message: 'User not found or salary not set' });
        }
        const amount = calculateTax(user.salary); // Payable amount is tax based on salary
        // Create payment with PENDING status
        const payment = yield models_1.default.payment.create({
            data: {
                amount,
                esewaRefId,
                userId: user.id,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        // Verify with eSewa
        let verified = false;
        try {
            verified = yield verifyEsewaPayment({ amt: amount, pid: payment.id, rid: esewaRefId });
        }
        catch (e) {
            // Verification failed (network or other error)
            return res.status(201).json({ payment, verification: 'failed', error: e.message });
        }
        if (verified) {
            const updated = yield models_1.default.payment.update({
                where: { id: payment.id },
                data: { status: client_1.PaymentStatus.VERIFIED },
            });
            return res.status(201).json({ payment: updated, verification: 'success' });
        }
        else {
            return res.status(201).json({ payment, verification: 'failed' });
        }
    }
    catch (err) {
        return res.status(500).json({ message: 'Error creating payment', error: err.message });
    }
});
exports.createPayment = createPayment;
// User: Get their payments
const getUserPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.userId;
    try {
        const payments = yield models_1.default.payment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return res.status(200).json(payments);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching payments', error: err.message });
    }
});
exports.getUserPayments = getUserPayments;
// Admin: Verify or reject a payment
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, adminId, action } = req.body; // action: 'VERIFIED' or 'REJECTED'
    if (!['VERIFIED', 'REJECTED'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
    }
    try {
        const payment = yield models_1.default.payment.update({
            where: { id: paymentId },
            data: {
                status: action,
                verifiedBy: { connect: { id: adminId } },
                verifiedAt: new Date(),
            },
        });
        return res.status(200).json(payment);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error updating payment', error: err.message });
    }
});
exports.verifyPayment = verifyPayment;
// Admin: Get all payments
const getAllPayments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield models_1.default.payment.findMany({
            orderBy: { createdAt: 'desc' },
            include: { user: true, verifiedBy: true },
        });
        return res.status(200).json(payments);
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching all payments', error: err.message });
    }
});
exports.getAllPayments = getAllPayments;
//# sourceMappingURL=paymentController.js.map