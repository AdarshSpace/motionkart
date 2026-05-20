import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";

export const deleteCourse = async (req: Request, res: Response) => {
    try {
      const { courseId } = req.params;
      //const teacherId = req.user.id as string;
  
      const existingCourse = await prisma.course.findFirst({
        where: {
          id: courseId as string,
          //teacherId,
        },
      });
  
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
  
      await prisma.course.delete({
        where: {
          id: courseId as string,
        },
      });
  
      return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete course",
      });
    }
  };