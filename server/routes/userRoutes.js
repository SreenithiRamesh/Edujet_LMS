import express from "express";
import {
  getAllUserProgress,
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
} from "../controllers/userController.js";

const userRouter = express.Router();

// ✅ Route for dashboard to fetch all progress and enrollments
userRouter.get("/all-progress", getAllUserProgress);

// ✅ Profile info
userRouter.get("/data", getUserData);

// ✅ Enrolled courses (used in dashboard or my-courses page)
userRouter.get("/enrolled-courses", userEnrolledCourses);

// ✅ Purchase course via Stripe
userRouter.post("/purchase", purchaseCourse);

// ✅ Update progress when user completes a lecture
userRouter.post("/update-course-progress", updateUserCourseProgress);

// ✅ Get progress for a specific course
userRouter.post("/get-course-progress", getUserCourseProgress);

// ✅ Add/update course rating
userRouter.post("/add-rating", addUserRating);

export default userRouter;
