// routes/courseRouter.js
import express from "express";
import { getAllCourse, getCourseId } from "../controllers/courseController.js"; // ❗ fixed extra space

const courseRouter = express.Router();

courseRouter.get("/all", getAllCourse);
courseRouter.get("/:id", getCourseId);

export default courseRouter;
