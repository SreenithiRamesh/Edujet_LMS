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
    response.status(400).send(`Webhook Error: ${err.message}`);
    console.log("Exiting function due to verification failure");
    return; // Ensure the function exits
  }

  // Handle the event
  console.log("Processing event:", event.type);
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

        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());
        if (!userData || !courseData) {
          console.error(`User or Course not found for ${purchaseId}`);
          return response.status(404).json({ error: "User or Course not found" });
        }

        courseData.enrolledStudents.push(userData);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();
        console.log(`Updated status to completed for ${purchaseId}`);
      } catch (error) {
        console.error(`Error in payment_intent.succeeded: ${error.message}`);
        return response.status(500).json({ error: "Failed to process payment" });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      console.log(`Processing payment_intent.payment_failed for ${paymentIntentId}`);

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

        purchaseData.status = "failed";
        await purchaseData.save();
        console.log(`Updated status to failed for ${purchaseId}`);
      } catch (error) {
        console.error(`Error in payment_intent.payment_failed: ${error.message}`);
        return response.status(500).json({ error: "Failed to process payment" });
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
};