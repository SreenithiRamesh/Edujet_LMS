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

// Basic middleware
app.use(cors());
app.use(clerkMiddleware());

// Root route
app.get("/", (req, res) => {
  res.send("API Working :)");
});

// IMPORTANT: Handle Stripe webhooks BEFORE any JSON middleware
// This ensures the raw body is available for signature verification
app.post("/stripe", 
  express.raw({ type: 'application/json' }), 
  (req, res, next) => {
    // Debug middleware to check what's coming in
    console.log("Stripe webhook received:");
    console.log("- Body type:", typeof req.body);
    console.log("- Has signature:", !!req.headers["stripe-signature"]);
    next();
  },
  stripeWebhooks
);

// Apply JSON parsing for all other routes AFTER the Stripe webhook route
app.use(express.json());

// Other routes
app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

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