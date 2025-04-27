import { Webhook } from "svix";
import Stripe from "stripe";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// Clerk Webhooks
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
          imageUrl: data.image_url || "",
        };
        await User.create(userData);
        return res.json({});
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        return res.json({});
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        return res.json({});
      }

      default:
        return res.status(400).json({ message: "Unhandled event type" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Stripe Webhooks
import { buffer } from "micro"; // ⚡️ Required for webhook

export const stripeWebhooks = async (req, res) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET_KEY);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const purchaseId = session.metadata.purchaseId;

      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        console.error("Purchase not found");
        break;
      }

      // Update purchase status
      purchaseData.status = "completed";
      await purchaseData.save();

      const userData = await User.findById(purchaseData.userId);
      const courseData = await Course.findById(purchaseData.courseId.toString());

      if (userData && courseData) {
        // Add user to course
        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        // Add course to user
        userData.enrolledCourses.push(courseData._id);
        await userData.save();
      }
      break;
    }

    case "checkout.session.expired":
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      const purchaseId = session.metadata.purchaseId;

      const purchaseData = await Purchase.findById(purchaseId);
      if (purchaseData) {
        purchaseData.status = "failed";
        await purchaseData.save();
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
