import Course from "../models/Course.js";
import cloudinary from "../configs/cloudinary.js";

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

export const addCourse = async (req, res) => {
  try {
    const { title, description, price, discount, chapters } = req.body;
    const file = req.file;

    if (!title || !description || !price || !discount || !chapters) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    let thumbnailUrl = null;

    // ✅ Upload to Cloudinary as a promise
    if (file) {
      const uploadPromise = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "Edujet_Thumbnails",
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(file.buffer);
        });

      thumbnailUrl = await uploadPromise();
    } else {
      return res.status(400).json({ success: false, message: "Thumbnail is required" });
    }

    // ✅ Create course
    const newCourse = new Course({
      courseTitle: title,
      courseDescription: description,
      coursePrice: price,
      discount,
      courseThumbnail: thumbnailUrl,
      courseContent: JSON.parse(chapters),
      educator: req.auth.userId,
      isPublished: true,
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
