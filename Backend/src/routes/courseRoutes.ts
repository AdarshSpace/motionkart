import { Router } from "express";
import { authentication } from "../middleware/authentication.js";
import { createCourse } from "../controllers/Courses/CreateCourses.js";
import { getCourses } from "../controllers/Courses/GetAllCourses.js";
import { deleteCourse } from "../controllers/Courses/DeleteCourses.js";
import { getCurriculum } from "../controllers/Courses/curriculum.js";
import { addVideo } from "../controllers/Courses/UpdateCourse.js";
import { GetNotes } from "../controllers/Courses/notes.js";


const router = Router();

// Apply authentication middleware to all routes below
router.use(authentication);

router.post("/create", createCourse);
router.get("/getAll", getCourses);
router.get("/notes", GetNotes);           // ← must be before /:courseId routes
router.get("/:courseId/curriculum", getCurriculum);
router.patch("/update/:courseId", addVideo);
router.delete("/delete/:courseId", deleteCourse);


export default router;