const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createStripeOrder(lineItems: any) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/orders?success=true`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  return session;
};

export default createStripeOrder;