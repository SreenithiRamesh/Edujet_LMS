import Course from "../models/Course.js";

export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate("educator");

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseId = async (req, res) => {
  const { id } = req.params;
  try {
    const courseData = await Course.findById(id).populate("educator");

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    courseData.courseContent.forEach((chapter) => {
      chapter.chapterContent.forEach((lecture) => {
        if (!lecture.isPreviewFree) {
          lecture.lectureUrl = "";
        }
      });
    });

    res.json({ success: true, courseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to courseController.js
export const addCourse = async (req, res) => {
  try {
    const { title, description, price, discount, chapters } = req.body;
    const thumbnail = req.file; // This will be handled by multer

    // Validate required fields
    if (!title || !description || price === undefined || discount === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Create new course
    const newCourse = new Course({
      courseTitle: title,
      courseDescription: description,
      coursePrice: price,
      discount: discount,
      courseThumbnail: thumbnail ? thumbnail.path : null,
      courseContent: JSON.parse(chapters), // Parse the chapters string
      educator: req.auth.userId, // Assuming you're using Clerk for auth
      isPublished: true
    });

    await newCourse.save();

    res.status(201).json({ 
      success: true, 
      message: "Course created successfully",
      course: newCourse 
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};