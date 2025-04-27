import express from 'express';
import { 
  getUserData, 
  purchaseCourse, 
  userEnrolledCourses 
} from '../controllers/userController.js';

const userRouter = express.Router();

// Get user data
userRouter.get('/data', getUserData);

// Get enrolled courses
userRouter.get('/enrolled-courses', userEnrolledCourses);

// Purchase a course
userRouter.post('/purchase', purchaseCourse);

export default userRouter;