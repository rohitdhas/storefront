import stripeClient from 'stripe';

interface CartItem {
  productId: string;
  productName: string;
  productImg: string;
  price: number;
  quantity: number;
}

const stripe = new stripeClient(process.env.STRIPE_SECRET_KEY!,
  {
    stripeAccount: process.env.STRIPE_PUBLISHABLE_KEY!,
    apiVersion: "2022-08-01"
  });

async function createStripeOrder(cartData: CartItem[]) {

  const transformedItems = cartData.map((item: CartItem) => {
    return {
      price_data: {
        currency: 'inr',
        product_data: {
          images: [item.productImg],
          name: item.productName,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: transformedItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/orders`,
    cancel_url: `${process.env.CLIENT_URL}/cart`,
  });

  return session;
};

export default createStripeOrder;