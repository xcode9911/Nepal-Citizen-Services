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
exports.getAllPayments = exports.verifyPayment = exports.getUserPayments = exports.confirmPayment = exports.handleStripeWebhook = exports.createCheckoutSession = exports.createPayment = void 0;
const models_1 = __importDefault(require("../models"));
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env file.');
}
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
});
// TAX CALCULATION BASED ON SALARY
function calculateTax(salary) {
    if (salary <= 500000)
        return salary * 0.01;
    else if (salary <= 700000)
        return 5000 + (salary - 500000) * 0.10;
    else if (salary <= 1000000)
        return 25000 + (salary - 700000) * 0.20;
    else if (salary <= 2000000)
        return 85000 + (salary - 1000000) * 0.30;
    else
        return 385000 + (salary - 2000000) * 0.36;
}
// CREATE PAYMENT INTENT
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const user = yield models_1.default.user.findUnique({ where: { id: userId } });
        if (!user || user.salary == null) {
            return res.status(400).json({ message: 'User not found or salary not set' });
        }
        const amount = calculateTax(user.salary);
        // Convert to cents for Stripe (Stripe expects amounts in smallest currency unit)
        const amountInCents = Math.round(amount * 100);
        // Create Stripe Payment Intent
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'npr', // Nepalese Rupee
            metadata: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
            },
        });
        // Save payment to DB
        const payment = yield models_1.default.payment.create({
            data: {
                amount,
                stripePaymentIntentId: paymentIntent.id,
                userId: user.id,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        return res.status(201).json({
            success: true,
            payment,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }
    catch (err) {
        console.error('Error creating payment:', err);
        return res.status(500).json({ message: 'Error creating payment', error: err.message });
    }
});
exports.createPayment = createPayment;
// CREATE CHECKOUT SESSION (Alternative method)
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    try {
        const user = yield models_1.default.user.findUnique({ where: { id: userId } });
        if (!user || user.salary == null) {
            return res.status(400).json({ message: 'User not found or salary not set' });
        }
        const amount = calculateTax(user.salary);
        const amountInCents = Math.round(amount * 100);
        // Create Stripe Checkout Session
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'npr',
                        product_data: {
                            name: 'Tax Payment',
                            description: `Tax payment for ${user.name}`,
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/payment/cancel`,
            metadata: {
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
            },
        });
        // Save payment to DB
        const payment = yield models_1.default.payment.create({
            data: {
                amount,
                stripeSessionId: session.id,
                userId: user.id,
                status: client_1.PaymentStatus.PENDING,
            },
        });
        return res.status(201).json({
            success: true,
            payment,
            sessionId: session.id,
            sessionUrl: session.url,
        });
    }
    catch (err) {
        console.error('Error creating checkout session:', err);
        return res.status(500).json({ message: 'Error creating checkout session', error: err.message });
    }
});
exports.createCheckoutSession = createCheckoutSession;
// WEBHOOK HANDLER FOR STRIPE EVENTS
const handleStripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
        return res.status(400).json({ message: 'Webhook secret not configured' });
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    }
    catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).json({ message: 'Webhook signature verification failed' });
    }
    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                yield handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                yield handlePaymentFailure(event.data.object);
                break;
            case 'checkout.session.completed':
                yield handleCheckoutSuccess(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
        return res.json({ received: true });
    }
    catch (err) {
        console.error('Error handling webhook:', err);
        return res.status(500).json({ message: 'Error handling webhook' });
    }
});
exports.handleStripeWebhook = handleStripeWebhook;
// Handle successful payment intent
function handlePaymentSuccess(paymentIntent) {
    return __awaiter(this, void 0, void 0, function* () {
        const payment = yield models_1.default.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            yield models_1.default.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.COMPLETED,
                    verifiedAt: new Date(),
                },
            });
        }
    });
}
// Handle failed payment intent
function handlePaymentFailure(paymentIntent) {
    return __awaiter(this, void 0, void 0, function* () {
        const payment = yield models_1.default.payment.findFirst({
            where: { stripePaymentIntentId: paymentIntent.id },
        });
        if (payment) {
            yield models_1.default.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.REJECTED,
                    verifiedAt: new Date(),
                },
            });
        }
    });
}
// Handle successful checkout session
function handleCheckoutSuccess(session) {
    return __awaiter(this, void 0, void 0, function* () {
        const payment = yield models_1.default.payment.findFirst({
            where: { stripeSessionId: session.id },
        });
        if (payment) {
            yield models_1.default.payment.update({
                where: { id: payment.id },
                data: {
                    status: client_1.PaymentStatus.COMPLETED,
                    verifiedAt: new Date(),
                },
            });
        }
    });
}
// CONFIRM PAYMENT (for manual confirmation)
const confirmPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentIntentId } = req.body;
    try {
        const paymentIntent = yield stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status === 'succeeded') {
            const payment = yield models_1.default.payment.findFirst({
                where: { stripePaymentIntentId: paymentIntentId },
            });
            if (payment) {
                const updatedPayment = yield models_1.default.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: client_1.PaymentStatus.COMPLETED,
                        verifiedAt: new Date(),
                    },
                });
                return res.status(200).json({
                    success: true,
                    payment: updatedPayment,
                    message: 'Payment confirmed successfully',
                });
            }
        }
        return res.status(400).json({ message: 'Payment not found or not successful' });
    }
    catch (err) {
        console.error('Error confirming payment:', err);
        return res.status(500).json({ message: 'Error confirming payment', error: err.message });
    }
});
exports.confirmPayment = confirmPayment;
// GET PAYMENTS OF A USER
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
// VERIFY OR REJECT PAYMENT BY ADMIN
const verifyPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paymentId, adminId, action } = req.body;
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
// ADMIN - GET ALL PAYMENTS
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