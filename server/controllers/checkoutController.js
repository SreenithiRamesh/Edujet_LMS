import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Full Stack JavaScript',
            },
            unit_amount: 9000, // 9000 cents = $90
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/loading/my-enrollments`,
      cancel_url: `${YOUR_DOMAIN}/`,
      metadata: {
        purchaseId: '68091ac32997ab11493d91bf',
        userId: 'your_user_id_here',  // <-- you can add this from frontend dynamically later
        courseId: 'your_course_id_here'
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};
