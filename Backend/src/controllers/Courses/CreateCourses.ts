import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";

export const createCourse = async (req: Request, res: Response) => {
  try {
    console.log("Request Body: ", req.body);
    console.log("Req User : ", req.user);
    const { title, description, thumbnail, price, oldPrice, rating, students, lessons, duration, category, } = req.body;

    const teacherId = req.user?.id as string; 
    console.log("Teacher ID: ", teacherId);

    // Validation
    if (!title || !description || !price || !oldPrice || !category || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const course = await prisma.course.create({
      data: {
        teacher: {
          connect: {
            id: teacherId,
          },
        },
        title,
        description,
        thumbnail,
        price: Number(price),
        oldPrice: Number(oldPrice),
        rating: rating ? Number(rating) : null,
        students: students ? Number(students) : null,
        lessons: lessons ? Number(lessons) : null,
        duration: duration ? Number(duration) : null,
        category,
        // teacherId,
      },
    });

    

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};