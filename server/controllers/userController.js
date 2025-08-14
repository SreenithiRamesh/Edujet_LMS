import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";

import PDFDocument from "pdfkit";
import fs from "fs";
import moment from "moment";


export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
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
      return res.status(404).json({ success: false, message: "Data Not Found" });
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
      return res.status(400).json({ success: false, message: "Lecture ID required" });
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

    const course = await Course.findById(courseId);

   
    const totalLectures = course.courseContent.reduce(
      (sum, chapter) => sum + (chapter.chapterContent?.length || 0),
      0
    );

    if (progress.lectureCompleted.length >= totalLectures) {
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
      return res.status(400).json({ success: false, message: "Invalid rating" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

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

export const getAllUserProgress = async (req, res) => {
  try {
    const userId = req.auth.userId.toString();
    const progressList = await CourseProgress.find({ userId });
    const user = await User.findById(userId).populate("enrolledCourses");

    res.json({
      success: true,
      progress: progressList,
      enrolledCourses: user?.enrolledCourses || [],
    });
  } catch (error) {
    console.error("Get All Progress Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch progress data",
    });
  }
};

export const generateCertificate = async (req, res) => {
  try {
    const { user } = req;
    const userId = req.auth.userId;
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    const progress = await CourseProgress.findOne({ userId, courseId });
    
    if (!user || !course || !progress || !progress.completed) {
      return res.status(403).json({ success: false, message: "Course not completed yet" });
    }
    
    const certPath = `certificates/${user.id}_${course._id}.pdf`;
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const stream = fs.createWriteStream(certPath);
    doc.pipe(stream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    const gradient = doc.linearGradient(0, 0, pageWidth, pageHeight);
    gradient.stop(0, '#1e3c72')  
           .stop(0.5, '#2a5298')   
           .stop(1, '#4a90e2'); 
    
    doc.rect(0, 0, pageWidth, pageHeight).fill(gradient);

    doc.strokeColor('#ffffff')
       .lineWidth(8)
       .rect(30, 30, pageWidth - 60, pageHeight - 60)
       .stroke();
    
 
    doc.strokeColor('#e6f3ff')
       .lineWidth(2)
       .rect(50, 50, pageWidth - 100, pageHeight - 100)
       .stroke();
    

    const cornerSize = 40;
    doc.fillColor('#ffffff')
       .opacity(0.3);

    doc.polygon([70, 70], [70 + cornerSize, 70], [70, 70 + cornerSize]).fill();
    

    doc.polygon([pageWidth - 70, 70], [pageWidth - 70 - cornerSize, 70], [pageWidth - 70, 70 + cornerSize]).fill();

    doc.polygon([70, pageHeight - 70], [70 + cornerSize, pageHeight - 70], [70, pageHeight - 70 - cornerSize]).fill();

    doc.polygon([pageWidth - 70, pageHeight - 70], [pageWidth - 70 - cornerSize, pageHeight - 70], [pageWidth - 70, pageHeight - 70 - cornerSize]).fill();
    

    doc.opacity(1);
 
    doc.fillColor('#ffffff')
       .opacity(0.1)
       .circle(pageWidth / 2, 150, 80)
       .fill()
       .opacity(1);

    doc.fillColor('#ffffff')
       .fontSize(32)
       .font('Helvetica-Bold')
       .text("CERTIFICATE", 0, 120, { align: "center" })
       .fontSize(18)
       .font('Helvetica')
       .text("OF COMPLETION", 0, 160, { align: "center" })
       .moveDown(3);
    

    const lineY = 200;
    doc.strokeColor('#ffffff')
       .lineWidth(2)
       .moveTo(pageWidth / 2 - 100, lineY)
       .lineTo(pageWidth / 2 + 100, lineY)
       .stroke();
    

    doc.fillColor('#e6f3ff')
       .fontSize(16)
       .font('Helvetica')
       .text("This is to certify that", 0, 250, { align: "center" })
       .moveDown(2);
 
    const studentName = user.firstName + " " + user.lastName || user.emailAddresses[0].emailAddress;
    doc.fillColor('#ffffff')
       .fontSize(28)
       .font('Helvetica-Bold')
       .text(studentName, 0, 300, { align: "center" });
    

    const nameWidth = doc.widthOfString(studentName, { fontSize: 28 });
    const nameUnderlineY = 335;
    doc.strokeColor('#ffffff')
       .lineWidth(2)
       .moveTo((pageWidth - nameWidth) / 2, nameUnderlineY)
       .lineTo((pageWidth + nameWidth) / 2, nameUnderlineY)
       .stroke();
    

    doc.fillColor('#e6f3ff')
       .fontSize(16)
       .font('Helvetica')
       .text("has successfully completed the course", 0, 360, { align: "center" })
       .moveDown(2);

    doc.fillColor('#ffffff')
       .opacity(0.15)
       .rect(80, 400, pageWidth - 160, 60)
       .fill()
       .opacity(1);
    
    doc.fillColor('#ffffff')
       .fontSize(22)
       .font('Helvetica-Bold')
       .text(course.courseTitle, 0, 420, { align: "center" });
    

    const dateY = pageHeight - 180;
    
    doc.fillColor('#ffffff')
       .opacity(0.1)
       .rect(100, dateY - 20, pageWidth - 200, 100)
       .fill()
       .opacity(1);

    doc.fillColor('#ffffff')
       .opacity(0.3)
       .rect(120, dateY - 10, 60, 3)
       .fill()
       .rect(pageWidth - 180, dateY - 10, 60, 3)
       .fill()
       .opacity(1);
    

    doc.fillColor('#ffffff')
       .fontSize(16)
       .font('Helvetica-Bold')
       .text("DATE OF COMPLETION", 0, dateY, { align: "center" });
    
    doc.fillColor('#e6f3ff')
       .fontSize(18)
       .font('Helvetica')
       .text(moment().format("MMMM Do, YYYY"), 0, dateY + 25, { align: "center" });
    

    doc.fillColor('#ffffff')
       .fontSize(20)
       .font('Helvetica-Bold')
       .text("EDUJET", 0, dateY + 60, { align: "center" });
    
    doc.fillColor('#e6f3ff')
       .fontSize(14)
       .font('Helvetica')
       .text("Learning Management System", 0, dateY + 80, { align: "center" });
    

    const diamondSize = 15;
    doc.fillColor('#ffffff')
       .opacity(0.4);
    
   
    doc.polygon([150, pageHeight - 60], [150 + diamondSize, pageHeight - 60 - diamondSize], 
                [150 + diamondSize * 2, pageHeight - 60], [150 + diamondSize, pageHeight - 60 + diamondSize]).fill();
    
 
    doc.polygon([pageWidth - 150 - diamondSize * 2, pageHeight - 60], [pageWidth - 150 - diamondSize, pageHeight - 60 - diamondSize], 
                [pageWidth - 150, pageHeight - 60], [pageWidth - 150 - diamondSize, pageHeight - 60 + diamondSize]).fill();
    
    doc.opacity(1);
    
    doc.fillColor('#ffffff')
       .opacity(0.05)
       .fontSize(60)
       .font('Helvetica-Bold')
       .text("CERTIFIED", 0, pageHeight / 2 - 30, { 
         align: "center",
         rotate: -15
       })
       .opacity(1);
    
    doc.end();
    
    stream.on("finish", () => {
      res.download(certPath, `${course.courseTitle}_certificate.pdf`, () => {
        fs.unlinkSync(certPath); // Delete after download
      });
    });
    
  } catch (err) {
    console.error("Certificate Error:", err);
    res.status(500).json({ success: false, message: "Failed to generate certificate" });
  }
};



export const switchUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.auth.userId;

    if (!["student", "educator"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role },
    });

    return res.json({ success: true, message: `Role switched to ${role}` });
  } catch (err) {
    console.error("Switch Role Error:", err);
    res.status(500).json({ success: false, message: "Failed to switch role" });
  }
};
