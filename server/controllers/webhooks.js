import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// API controller function to manage Clerk user with DB
export const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url || "", // Fallback if imageUrl doesn't exist
        };
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url || "", // Fallback if imageUrl doesn't exist
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        res.status(400).json({ message: "Unhandled event type" });
        break;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  console.log("Received Stripe webhook request with signature:", sig);

  let event;

  try {
    console.log("Attempting to construct event...");
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
    console.log("Event constructed successfully:", event.type);
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  console.log("Processing event:", event.type);
  
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log(`Processing payment_intent.succeeded for ${paymentIntentId}`);

        // Get the checkout session associated with this payment intent
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });
        
        if (!sessions.data.length) {
          console.error(`No session found for payment intent ${paymentIntentId}`);
          throw new Error("Checkout session not found");
        }
        
        const session = sessions.data[0];
        const { purchaseId } = session.metadata;
        
        if (!purchaseId) {
          console.error(`No purchaseId in metadata for session ${session.id}`);
          throw new Error("Purchase ID missing in session metadata");
        }

        console.log(`Found purchase ID: ${purchaseId}`);
        
        // Find purchase data
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(`Purchase not found for ID ${purchaseId}`);
          throw new Error("Purchase record not found");
        }

        // Find user and course
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId);
        
        if (!userData) {
          console.error(`User not found: ${purchaseData.userId}`);
          throw new Error("User not found");
        }
        
        if (!courseData) {
          console.error(`Course not found: ${purchaseData.courseId}`);
          throw new Error("Course not found");
        }

        // Update course enrollment
        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
          console.log(`Added user ${userData._id} to course ${courseData._id}`);
        }

        // Update user enrollments
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
          console.log(`Added course ${courseData._id} to user ${userData._id}`);
        }

        // Update purchase status
        purchaseData.status = "completed";
        await purchaseData.save();
        console.log(`Updated purchase ${purchaseId} status to completed`);
        
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        console.log(`Processing payment_intent.payment_failed for ${paymentIntentId}`);

        // Get the checkout session associated with this payment intent
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });
        
        if (!sessions.data.length) {
          console.error(`No session found for payment intent ${paymentIntentId}`);
          throw new Error("Checkout session not found");
        }
        
        const session = sessions.data[0];
        const { purchaseId } = session.metadata;
        
        if (!purchaseId) {
          console.error(`No purchaseId in metadata for session ${session.id}`);
          throw new Error("Purchase ID missing in session metadata");
        }

        // Find and update purchase data
        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) {
          console.error(`Purchase not found for ID ${purchaseId}`);
          throw new Error("Purchase record not found");
        }

        purchaseData.status = "failed";
        await purchaseData.save();
        console.log(`Updated purchase ${purchaseId} status to failed`);
        
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Send success response for all properly handled events
    return response.json({ received: true });
    
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return response.status(500).json({ 
      error: error.message,
      received: false 
    });
  }
};