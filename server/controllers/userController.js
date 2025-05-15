import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate("enrolledCourses");

    return res.json({
      success: true,
      enrolledCourses: userData?.enrolledCourses || [],
    });
  } catch (error) {
    console.error("Enrolled Courses Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId, origin } = req.body;
    const userId = req.auth.userId;

    const [userData, courseData] = await Promise.all([
      User.findById(userId),
      Course.findById(courseId),
    ]);

    if (!userData || !courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Data Not Found" });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: courseData.courseTitle },
            unit_amount: Math.floor(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
        userId: userId.toString(),
        courseId: courseId.toString(),
      },
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Purchase Error:", error);
    return res.status(500).json({ success: false, message: "Payment Failed" });
  }
};

export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId.toString();
    const { courseId, lectureId } = req.body;

    if (!lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "Lecture ID required" });
    }

    let progress = await CourseProgress.findOne({ userId, courseId });

    if (progress) {
      if (progress.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Already completed" });
      }
      progress.lectureCompleted.push(lectureId);
    } else {
      progress = new CourseProgress({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    // Mark course as completed if all lectures are done
    const course = await Course.findById(courseId);
    if (course && progress.lectureCompleted.length === course.totalLectures) {
      progress.completed = true;
    }

    await progress.save();
    return res.json({ success: true, progress });
  } catch (error) {
    console.error("Progress Update Error:", error);
    return res.status(500).json({ success: false, message: "Update Failed" });
  }
};

export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId.toString();
    const { courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.json({
        success: true,
        progress: {
          completed: false,
          lectureCompleted: [],
        },
      });
    }

    return res.json({ success: true, progress });
  } catch (error) {
    console.error("Get Progress Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const addUserRating = async (req, res) => {
  try {
    const userId = req.auth.userId.toString();
    const { courseId, rating } = req.body;

    if (!courseId || !rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid rating" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if user is enrolled
    const isEnrolled = await CourseProgress.exists({ userId, courseId });
    if (!isEnrolled) {
      return res.status(403).json({ success: false, message: "Not enrolled" });
    }

    const ratingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId
    );

    if (ratingIndex >= 0) {
      course.courseRatings[ratingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    return res.json({ success: true, rating });
  } catch (error) {
    console.error("Rating Error:", error);
    return res.status(500).json({ success: false, message: "Rating Failed" });
  }
};
