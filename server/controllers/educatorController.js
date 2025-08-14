import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import cloudinary from "../configs/cloudinary.js";
import { Purchase } from "../models/Purchase.js";
import User from "../models/User.js";


export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    return res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const addCourse = async (req, res) => {
  try {
    const imageFile = req.file;
    const { courseData } = req.body;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Thumbnail Not Attached" });
    }

    if (!courseData) {
      return res
        .status(400)
        .json({ success: false, message: "Course data is missing" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path);
    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    return res.json({
      success: true,
      message: "Course Added",
      course: newCourse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        "name imageUrl"
      );
      students.forEach((student) => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getEducatorCoursesWithEarnings = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const courses = await Course.find({ educator: educatorId });

    const courseData = await Promise.all(
      courses.map(async (course) => {
        const purchases = await Purchase.find({
          courseId: course._id,
          status: "completed",
        });

        const totalEarnings = purchases.reduce(
          (sum, p) => sum + parseFloat(p.amount),
          0
        );

        return {
          ...course.toObject(),
          totalEarnings,
        };
      })
    );

    res.json({ success: true, courses: courseData });
  } catch (error) {
    console.error("Earnings fetch error:", error);
    res.status(500).json({ success: false, message: "Failed to load courses" });
  }
};



export const educatorOnboard = async (req, res) => {
  try {
    const { displayName, bio, expertise } = req.body;
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
        onboarded: true,
        displayName,
        bio,
        expertise,
      },
    });

    return res.json({ success: true, message: "Onboarded successfully" });
  } catch (err) {
    console.error("Educator Onboarding Error:", err);
    res.status(500).json({ success: false, message: "Failed to onboard" });
  }
};
