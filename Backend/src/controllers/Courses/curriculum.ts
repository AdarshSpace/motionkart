import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";

export const getCurriculum = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params as {courseId: string};
    console.log('courseId : ',courseId)
    
  
    const curriculum = await prisma.course.findUnique({
      where: { id: courseId, },

      include: {
        modules: {
          orderBy: { position: "asc", },

          include: {
            videos: { orderBy: { position: "asc", }  }
          },
        },
      },
    });

    console.log('curriculum : ', curriculum?.modules[0])

    if (!curriculum) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, data: curriculum });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch curriculum" });
  }
};

