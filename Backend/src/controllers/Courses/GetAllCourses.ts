import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";



export const getCourses = async (req: Request, res: Response) => {

  try {
    const currentUserId = req.user?.id as string;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized", });
    }

    const courses = await prisma.course.findMany({
      // where: { isPublished: true,},
      select: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        price: true,
        oldPrice: true,
        rating: true,
        students: true,
        lessons: true,
        category: true,
        teacher: { 
            select: { name: true } 
        },
        purchases: {
            where: { userId: currentUserId }, select: { id: true, paid: true  },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
        ...course,
        paid: course.purchases.some((purchase) => purchase.paid),
      }));

    const userData = { 
      name: req.user?.name,
      email: req.user?.email,
      role: req.user?.role,
      id: req.user?.id,        
    }

      console.log("formattedCourses :",formattedCourses)
      console.log("User Data : ", userData)
     
    return res.status(200).json({
      success: true,
      data: formattedCourses,
      user: userData          
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};