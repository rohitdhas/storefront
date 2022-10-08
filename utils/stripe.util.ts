import stripeClient from 'stripe';

const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY!,
  {
    stripeAccount: process.env.STRIPE_PUBLISHABLE_KEY!,
    apiVersion: "2022-08-01"
  });

async function createStripeOrder(lineItems: any) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/orders`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  return session;
};

export default createStripeOrder;