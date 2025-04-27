import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import "./configs/cloudinary.js";
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import Stripe from "stripe";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// Routes with global express.json() for parsed JSON (except /stripe)
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API Working :)");
});

app.post("/clerk", express.json(), clerkWebhooks);
app.use("/api/educator", express.json(), educatorRouter);
app.use("/api/course", express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);

// Webhook route with raw body
app.post("/stripe", express.raw({ type: "application/json" }), async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  } catch (err) {
    console.error(`Webhook verification error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      console.log(`Processing payment_intent.succeeded for ${paymentIntentId}`);

      try {
        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });
        if (!session.data[0]) {
          console.error(`No session found for ${paymentIntentId}`);
          return response.status(404).json({ error: "Checkout session not found" });
        }
        const { purchaseId } = session.data[0].metadata;
        if (!purchaseId) {
          console.error(`No purchaseId in metadata for ${paymentIntentId}`);
          return response.status(400).json({ error: "purchaseId missing" });
        }

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(`Purchase not found for ${purchaseId}`);
          return response.status(404).json({ error: "Purchase not found" });
        }

        purchaseData.status = "completed";
        await purchaseData.save();
        console.log(`Updated status to completed for ${purchaseId}`);
      } catch (error) {
        console.error(`Error in payment_intent.succeeded: ${error.message}`);
        return response.status(500).json({ error: "Failed to process payment" });
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();