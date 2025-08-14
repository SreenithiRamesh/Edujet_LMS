// server/routes/userRoutes.js
import express from "express";
import {
  getAllUserProgress,
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
  generateCertificate,
   switchUserRole , // ✅
} from "../controllers/userController.js";

import { requireSignIn } from "../middlewares/authMiddleware.js"; // ✅



const userRouter = express.Router();

userRouter.get("/all-progress", requireSignIn, getAllUserProgress);
userRouter.get("/data", requireSignIn, getUserData);
userRouter.get("/enrolled-courses", requireSignIn, userEnrolledCourses);
userRouter.post("/purchase", requireSignIn, purchaseCourse);
userRouter.post("/update-course-progress", requireSignIn, updateUserCourseProgress);
userRouter.post("/get-course-progress", requireSignIn, getUserCourseProgress);
userRouter.post("/add-rating", requireSignIn, addUserRating);
userRouter.post("/switch-role", requireSignIn, switchUserRole);
// ✅ Add this:
userRouter.post("/generate-certificate", requireSignIn, generateCertificate);

export default userRouter;
