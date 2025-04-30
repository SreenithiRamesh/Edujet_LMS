import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";

/* 1. Get logged‑in user data                                         */

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

/* 2. Fetch user’s enrolled courses (lecture links populated)         */

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
/* 3. Purchase a course (Stripe checkout session)                     */

export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    /* --- fetch data ------------------------------------------------ */
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    /* --- guard clause --------------------------------------------- */
    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data Not Found" });
    } // <-- the brace that was missing

    /* --- create Purchase document --------------------------------- */
    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const newPurchase = await Purchase.create({
      courseId: courseData._id,
      userId,
      amount,
    });

    /* --- initialise Stripe checkout ------------------------------ */
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: { name: courseData.courseTitle },
          unit_amount: Math.floor(newPurchase.amount) * 100, // cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items,
      mode: "payment",
      metadata: { purchaseId: newPurchase._id.toString() },
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update User Course Progress
export const updateUserCourseProgress = async (req, res)=>{
  try {
  const userId = req.auth.userId
  const { courseId, lectureId } = req.body
  const progressData = await CourseProgress.findOne({userId, courseId })
  if (progressData) {
  if (progressData.lectureCompleted. includes (lectureId)){
  return res.json({success: true, message: 'Lecture Already Completed'})
  }
  progressData.lectureCompleted.push(lectureId)
  await progressData.save()
  }
  else{
  await CourseProgress.create({
  userId,
  courseId,
  lectureCompleted:[lectureId]
  })
  
  }
  res.json({success:true,message:'Progress Updated'})
  }
  catch(error){
  res.json({success:false,message:error.message})
  }
  }
  
  //get user course progress
  export const getUserCourseProgress =async(req,res)=>{
  try{
  const userId=req.auth.userId
  const {courseId}=req.body
  const progressData=await CourseProgress.findOne({userId,courseId})
  res.json({success:true,progressData})
  }catch(error){
  res.json({success:false,message:error.message})
  }
  
  }
  
  
  
  
  // Add User Ratings to Course
  export const addUserRating = async (req, res)=>{
  const userId = req.auth.userId;
  const {courseId, rating } = req.body;
  if(!courseId || !userId || !rating || rating < 1 || rating > 5){ 
  return res.json({ success: false, message: 'InValid Details' });
  }

  try {
  
  const course = await Course.findById(courseId);
  if(!course) {
  return res.json({ success: false, message: 'Course not found.' });
  }
  const user = await User.findById(userId);
  if(!user || !user.enrolledCourses.includes (courseId)) {
  return res.json({ success: false, message: 'User has not purchased this course.' }); I
  }
  
 
  const existingRatingIndex=course.courseRatings.findIndex(r => r.userId === userId)
  
  if(existingRatingIndex > -1){
  course.courseRatings [existingRatingIndex].rating = rating;
  }else{
  
  course.courseRatings.push({userId, rating});
  }
  await course.save();
  res.json({success:true,message:'Rating Added'})
  } catch (error) {
  return res.json({ success: false, message:error.message });
  }
  }
