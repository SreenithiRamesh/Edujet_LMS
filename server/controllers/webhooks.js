import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);


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
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url || "",
        };
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        break;
      }

      default:
        return res.status(400).json({ message: "Unhandled event type" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET_KEY
    );
  } catch (err) {
    console.error("Webhook verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (session.payment_status !== "paid") {
          console.log("Session not paid:", session.id);
          break;
        }

        const { purchaseId, userId, courseId } = session.metadata;

        if (!purchaseId || !userId || !courseId) {
          throw new Error("Missing metadata in session");
        }

        // Update purchase status
        await Purchase.findByIdAndUpdate(purchaseId, {
          status: "completed",
          paymentId: session.payment_intent,
          completedAt: new Date(),
        });

        // Update user enrollments
        await User.findByIdAndUpdate(userId, {
          $addToSet: { enrolledCourses: courseId },
        });

        // Update course enrollments
        await Course.findByIdAndUpdate(courseId, {
          $addToSet: { enrolledStudents: userId },
        });

        console.log(`Successfully processed purchase ${purchaseId}`);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        if (paymentIntent.status === "succeeded") {
          const sessions = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1,
          });

          if (sessions.data.length > 0) {
            const session = sessions.data[0];
            const { purchaseId, userId, courseId } = session.metadata;

            if (purchaseId) {
              await Purchase.findByIdAndUpdate(purchaseId, {
                status: "completed",
                paymentId: paymentIntent.id,
                completedAt: new Date(),
              });

              if (userId && courseId) {
                await User.findByIdAndUpdate(userId, {
                  $addToSet: { enrolledCourses: courseId },
                });

                await Course.findByIdAndUpdate(courseId, {
                  $addToSet: { enrolledStudents: userId },
                });
              }
            }
          }
        }
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
          limit: 1,
        });

        if (sessions.data.length > 0) {
          const { purchaseId } = sessions.data[0].metadata;
          if (purchaseId) {
            await Purchase.findByIdAndUpdate(purchaseId, {
              status: "failed",
              failedAt: new Date(),
            });
          }
        }
        break;
      }

      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        const { purchaseId, userId, courseId } = session.metadata;

        if (purchaseId) {
          await Purchase.findByIdAndUpdate(purchaseId, {
            status: "completed",
            paymentId: session.payment_intent,
            completedAt: new Date(),
          });

          if (userId && courseId) {
            await User.findByIdAndUpdate(userId, {
              $addToSet: { enrolledCourses: courseId },
            });

            await Course.findByIdAndUpdate(courseId, {
              $addToSet: { enrolledStudents: userId },
            });
          }
        }
        break;
      }

      case "checkout.session.async_payment_failed": {
        const session = event.data.object;
        const { purchaseId } = session.metadata;

        if (purchaseId) {
          await Purchase.findByIdAndUpdate(purchaseId, {
            status: "failed",
            failedAt: new Date(),
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};
