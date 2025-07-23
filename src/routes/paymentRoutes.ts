import express from 'express';
import { 
  createPayment, 
  createCheckoutSession, 
  handleStripeWebhook, 
  confirmPayment,
  getUserPayments, 
  verifyPayment, 
  getAllPayments 
} from '../controller/paymentController';
import catchAsync from '../utils/catchAsync';

const router = express.Router();

// User routes
router.post('/create', catchAsync(createPayment));
router.post('/create-checkout-session', catchAsync(createCheckoutSession));
router.post('/confirm', catchAsync(confirmPayment));
router.get('/user', catchAsync(getUserPayments));

// Stripe webhook
router.post('/webhook', catchAsync(handleStripeWebhook));

// Admin routes
router.post('/verify', catchAsync(verifyPayment));
router.get('/all', catchAsync(getAllPayments));

export default router;
