import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";

/* ------------------------------------------------------------------ */
/* 1. Get logged-in user data                                         */
/* ------------------------------------------------------------------ */
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ------------------------------------------------------------------ */
/* 2. Fetch user's enrolled courses (lecture links populated)         */
/* ------------------------------------------------------------------ */
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    return res.json({
      success: true,
      enrolledCourses: userData?.enrolledCourses || [],
    });
  } catch (error) {
    console.error(error);
    return res.json({ success: false, message: error.message });
  }
};

/* ------------------------------------------------------------------ */
/* 3. Purchase a course (Stripe checkout session)                     */
/* ------------------------------------------------------------------ */
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    // Validate origin URL
    if (!origin || !origin.startsWith('http')) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid origin URL" 
      });
    }

    // Fetch required data
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data Not Found" });
    }

    // Check if user already enrolled
    if (userData.enrolledCourses.includes(courseId)) {
      return res.json({ 
        success: false, 
        message: "User already enrolled in this course" 
      });
    }

    // Calculate final amount
    const amount = (
      courseData.coursePrice - 
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    // Create purchase record
    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
      status: "pending",
      createdAt: new Date()
    });

    // Initialize Stripe
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create checkout session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: process.env.CURRENCY.toLowerCase(),
          product_data: { 
            name: courseData.courseTitle,
            description: courseData.courseDescription.substring(0, 200),
            metadata: {
              courseId: courseData._id.toString()
            }
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/courses/${courseId}?canceled=true`,
      metadata: {
        purchaseId: newPurchase._id.toString(),
        userId: userId,
        courseId: courseId.toString()
      },
      customer_email: userData.email,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes expiry
    });

    // Update purchase with session ID
    newPurchase.sessionId = session.id;
    await newPurchase.save();

    return res.json({ 
      success: true, 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error("Purchase error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};