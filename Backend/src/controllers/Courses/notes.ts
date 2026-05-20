import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";


export const GetNotes = async (req: Request, res: Response) => {
  const userId = req.user?.id as string; // from your auth middleware

  // fetch only courses the user has purchased
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      paid: true,
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          modules: {
            select: {
              title: true,
              videos: {
                where: { notesUrl: { not: null } },
                select: {
                  id: true,
                  title: true,
                  notesUrl: true,
                },
                orderBy: { position: "asc" },
              },
            },
            orderBy: { position: "asc" },
          },
        },
      },
    },
  });

  if (!purchases || purchases.length === 0) {
    return res.json({
      success: true,
      data: [],
    });
  }

  // shape the response — one entry per purchased course
  const data = purchases.map(({ course }) => ({
    courseId: course.id,
    courseTitle: course.title,
    notes: course.modules.flatMap((module) =>
      module.videos.map((video) => ({
        videoId: video.id,
        videoTitle: video.title,
        moduleTitle: module.title,
        notesUrl: video.notesUrl,
      }))
    ),
  }));

  console.log("DATA : ", data);

  res.json({
    success: true,
    data,
  });
};