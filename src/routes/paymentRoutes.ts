import express from 'express';
import { createPayment, getUserPayments, verifyPayment, getAllPayments } from '../controller/paymentController';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

// User routes
router.post('/create', catchAsync(createPayment));
router.get('/user', catchAsync(getUserPayments));

// Admin routes
router.post('/verify', catchAsync(verifyPayment));
router.get('/all', catchAsync(getAllPayments));

export default router;
