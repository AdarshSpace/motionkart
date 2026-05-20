import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";

// ── Save a video ──
export const SaveVideo = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { videoId, courseId } = req.body;

  if (!videoId || !courseId)
    return res.status(400).json({ success: false, message: "videoId and courseId are required" });

  // check user purchased this course
  const purchase = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!purchase || !purchase.paid)
    return res.status(403).json({ success: false, message: "You have not purchased this course" });

  // upsert so hitting save twice doesn't throw
  const saved = await prisma.savedVideo.upsert({
    where: { userId_videoId: { userId, videoId } },
    create: { userId, videoId, courseId },
    update: {}, // already saved, do nothing
  });

  res.json({ success: true, data: saved });
};

// ── Unsave a video ──
export const UnsaveVideo = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { videoId } = req.params as { videoId: string };

  await prisma.savedVideo.deleteMany({
    where: { userId, videoId },
  });

  res.json({ success: true, message: "Video removed from saved" });
};

// ── Check if a video is saved (for the Save button state) ──
export const CheckSaved = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const { videoId } = req.params as { videoId: string };

  const saved = await prisma.savedVideo.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });

  res.json({ success: true, isSaved: !!saved });
};

// ── Get all saved videos for the user ──
export const GetSavedVideos = async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  const savedVideos = await prisma.savedVideo.findMany({
    where: { userId },
    orderBy: { savedAt: "desc" },
    select: {
      id: true,
      savedAt: true,
      course: {
        select: {
          id: true,
          title: true,
        },
      },
      video: {
        select: {
          id: true,
          title: true,
          videoUrl: true,
          duration: true,
          module: {
            select: {
              title: true,
            },
          },
        },
      },
    },
  });

  const data = savedVideos.map((s) => ({
    savedId: s.id,
    savedAt: s.savedAt,
    courseId: s.course.id,
    courseTitle: s.course.title,
    videoId: s.video.id,
    videoTitle: s.video.title,
    videoUrl: s.video.videoUrl,
    duration: s.video.duration,
    moduleTitle: s.video.module.title,
  }));

  res.json({ success: true, data });
};