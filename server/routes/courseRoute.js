import express from "express";
import {
  getAllCourse,
  getCourseId,
  addCourse,
} from "../controllers/courseController.js";
import upload from "../middlewares/upload.js";

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourse);
courseRouter.get("/:id", getCourseId);

// ✅ ONLY use this route to avoid conflict
courseRouter.post("/add", upload.single("thumbnail"), addCourse);

export default courseRouter;
