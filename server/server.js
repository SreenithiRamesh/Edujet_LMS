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
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

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