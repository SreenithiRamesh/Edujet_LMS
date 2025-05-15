import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  const YOUR_DOMAIN = process.env.YOUR_DOMAIN || "http://localhost:3000";

  try {
    const { purchaseId, userId, courseId } = req.body; // Added metadata fields

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Full Stack JavaScript",
            },
            unit_amount: 9000,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/loading/my-enrollments`,
      cancel_url: `${YOUR_DOMAIN}/`,
      metadata: {
        purchaseId,
        userId,
        courseId,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
};
