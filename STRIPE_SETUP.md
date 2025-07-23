# Stripe Payment Integration Setup

This guide explains how to set up Stripe payments to replace the previous Esewa integration.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Base URL for success/cancel redirects
BASE_URL=http://localhost:3000
```

## Getting Stripe Keys

1. **Create a Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Get API Keys**: 
   - Go to Dashboard → Developers → API Keys
   - Copy your Publishable Key and Secret Key
   - Use test keys for development, live keys for production

## Setting Up Webhooks

1. **Create Webhook Endpoint**:
   - Go to Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - Set URL to: `https://your-domain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`

2. **Get Webhook Secret**:
   - After creating the webhook, click on it
   - Copy the "Signing secret" (starts with `whsec_`)

## Payment Methods

The integration supports two payment methods:

### 1. Payment Intents (Recommended)
- Use `/api/payments/create` endpoint
- Returns a `clientSecret` for frontend integration
- Better for custom payment forms

### 2. Checkout Sessions
- Use `/api/payments/create-checkout-session` endpoint
- Returns a `sessionUrl` for redirect-based payments
- Simpler integration, hosted by Stripe

## Frontend Integration

### Payment Intents (React/JavaScript)
```javascript
// Create payment intent
const response = await fetch('/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user-id' })
});
const { clientSecret } = await response.json();

// Confirm payment with Stripe.js
const { error } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: elements.getElement('card'),
    billing_details: { name: 'Customer Name' }
  }
});
```

### Checkout Sessions
```javascript
// Create checkout session
const response = await fetch('/api/payments/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'user-id' })
});
const { sessionUrl } = await response.json();

// Redirect to Stripe Checkout
window.location.href = sessionUrl;
```

## Database Changes

The payment model has been updated:
- Removed: `esewaRefId` field
- Added: `stripePaymentIntentId` and `stripeSessionId` fields

## Testing

Use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits

## Production Deployment

1. Switch to live Stripe keys
2. Update webhook URL to production domain
3. Ensure HTTPS is enabled (required for webhooks)
4. Test with small amounts first

## Security Notes

- Never expose your secret key in frontend code
- Always verify webhook signatures
- Use HTTPS in production
- Keep your webhook secret secure 