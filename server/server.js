// server.js

import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";
import { clerkMiddleware } from "@clerk/express";
import "./configs/cloudinary.js";

// Routers
import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";
import checkoutRouter from "./routes/checkoutRoutes.js"; // 🆕 Import your new checkout routes

const app = express();

// Basic middleware
app.use(cors());
app.use(clerkMiddleware());

// Root route
app.get("/", (req, res) => {
  res.send("API Working :)");
});

// Stripe webhook route (must come BEFORE express.json)
app.post("/stripe", 
  express.raw({ type: "application/json" }),
  (req, res, next) => {
    req.rawBody = req.body.toString();
    next();
  },
  stripeWebhooks
);

// Parse JSON for other routes
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.post("/clerk", clerkWebhooks);
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);
app.use("/api/checkout", checkoutRouter); // 🆕 New checkout route connected

// Global Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Stripe webhook endpoint: http://localhost:${PORT}/stripe`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
