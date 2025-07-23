import { Request, Response } from 'express';
import prisma from '../models';
import { PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables. Please add it to your .env file.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

// TAX CALCULATION BASED ON SALARY
function calculateTax(salary: number): number {
  if (salary <= 500000) return salary * 0.01;
  else if (salary <= 700000) return 5000 + (salary - 500000) * 0.10;
  else if (salary <= 1000000) return 25000 + (salary - 700000) * 0.20;
  else if (salary <= 2000000) return 85000 + (salary - 1000000) * 0.30;
  else return 385000 + (salary - 2000000) * 0.36;
}

// CREATE PAYMENT INTENT
export const createPayment = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.salary == null) {
      return res.status(400).json({ message: 'User not found or salary not set' });
    }

    // Check if a payment for the current month already exists
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const existingPayment = await prisma.payment.findFirst({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment for this month already exists.' });
    }

    const amount = calculateTax(user.salary);
    
    // Convert to cents for Stripe (Stripe expects amounts in smallest currency unit)
    const amountInCents = Math.round(amount * 100);

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'npr', // Nepalese Rupee
      metadata: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      },
    });

    // Save payment to DB
    const payment = await prisma.payment.create({
      data: {
        amount,
        stripePaymentIntentId: paymentIntent.id,
        userId: user.id,
        status: PaymentStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      payment,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (err) {
    console.error('Error creating payment:', err);
    return res.status(500).json({ message: 'Error creating payment', error: (err as Error).message });
  }
};

// CREATE CHECKOUT SESSION (Alternative method)
export const createCheckoutSession = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.salary == null) {
      return res.status(400).json({ message: 'User not found or salary not set' });
    }

    const amount = calculateTax(user.salary);
    const amountInCents = Math.round(amount * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
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
    const payment = await prisma.payment.create({
      data: {
        amount,
        stripeSessionId: session.id,
        userId: user.id,
        status: PaymentStatus.PENDING,
      },
    });

    return res.status(201).json({
      success: true,
      payment,
      sessionId: session.id,
      sessionUrl: session.url,
    });

  } catch (err) {
    console.error('Error creating checkout session:', err);
    return res.status(500).json({ message: 'Error creating checkout session', error: (err as Error).message });
  }
};

// WEBHOOK HANDLER FOR STRIPE EVENTS
export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    return res.status(400).json({ message: 'Webhook secret not configured' });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig as string, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      case 'checkout.session.completed':
        await handleCheckoutSuccess(event.data.object as Stripe.Checkout.Session);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook:', err);
    return res.status(500).json({ message: 'Error handling webhook' });
  }
};

// Handle successful payment intent
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        verifiedAt: new Date(),
      },
    });
  }
}

// Handle failed payment intent
async function handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
  const payment = await prisma.payment.findFirst({
    where: { stripePaymentIntentId: paymentIntent.id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.REJECTED,
        verifiedAt: new Date(),
      },
    });
  }
}

// Handle successful checkout session
async function handleCheckoutSuccess(session: Stripe.Checkout.Session) {
  const payment = await prisma.payment.findFirst({
    where: { stripeSessionId: session.id },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.COMPLETED,
        verifiedAt: new Date(),
      },
    });
  }
}

// CONFIRM PAYMENT (for manual confirmation)
export const confirmPayment = async (req: Request, res: Response) => {
  const { paymentIntentId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      const payment = await prisma.payment.findFirst({
        where: { stripePaymentIntentId: paymentIntentId },
      });

      if (payment) {
        const updatedPayment = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.COMPLETED,
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
  } catch (err) {
    console.error('Error confirming payment:', err);
    return res.status(500).json({ message: 'Error confirming payment', error: (err as Error).message });
  }
};

// GET PAYMENTS OF A USER
export const getUserPayments = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  try {
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching payments', error: (err as Error).message });
  }
};

// VERIFY OR REJECT PAYMENT BY ADMIN
export const verifyPayment = async (req: Request, res: Response) => {
  const { paymentId, adminId, action } = req.body;

  if (!['COMPLETED', 'REJECTED'].includes(action)) {
    return res.status(400).json({ message: 'Invalid action' });
  }

  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: action,
        verifiedBy: { connect: { id: adminId } },
        verifiedAt: new Date(),
      },
    });
    return res.status(200).json(payment);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating payment', error: (err as Error).message });
  }
};

// ADMIN - GET ALL PAYMENTS
export const getAllPayments = async (_req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: true, verifiedBy: true },
    });
    return res.status(200).json(payments);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching all payments', error: (err as Error).message });
  }
};
