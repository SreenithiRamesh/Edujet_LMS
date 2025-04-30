import express from 'express';
import { 
  getUserData, 
  purchaseCourse, 
  userEnrolledCourses,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating
} from '../controllers/userController.js';

const userRouter = express.Router();

// Get user data
userRouter.get('/data', getUserData);

// Get enrolled courses
userRouter.get('/enrolled-courses', userEnrolledCourses);

// Purchase a course
userRouter.post('/purchase', purchaseCourse);

userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getUserCourseProgress)
userRouter.post('/add-rating',addUserRating)

export default userRouter;