import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";
import { pdfQueue } from "../../lib/queue.js";
import { title } from "node:process";



export const addVideo = async (req: Request, res: Response) => {

  try {
    const teacherId = req.user?.id;
    const courseId = req.params.courseId as string;

    const { id: moduleId, title: sectionTitle, videos } = req.body;

    const [videoData] = videos;

    const { title: videoTitle, description: videoDescription, videoUrl,  videoPath, videoDuration, notesUrl } = videoData;


    if (!courseId) {
       return res.status(400).json({
          success: false,
          message: "Course ID is required",
        });
    }

    if (!videoTitle && !videoUrl) {
        return res.status(400).json({
          success: false,
          message: "Video data is incomplete",
        });
    }

    let finalModuleId = moduleId;


    // MODULE DOES NOT EXIST
    // =========================

    if (!moduleId) {

      // Find last module position
      const lastModule = await prisma.module.findFirst({
        where: { courseId },
        orderBy: { position: "desc" },
      });

      const nextModulePosition =
        lastModule ? lastModule.position + 1 : 1;

      // Create new module
      const newModule = await prisma.module.create({
        data: {
          title: sectionTitle,
          courseId,
          position: nextModulePosition,
        },
      });

      finalModuleId = newModule.id;
    }    


    // FIND VIDEO POSITION
    // =========================

    const lastVideo = await prisma.video.findFirst({
      where: {  moduleId: finalModuleId,  },
      orderBy: { position: "desc", },
    });

    const nextVideoPosition =
      lastVideo ? lastVideo.position + 1 : 1;

      
    // CREATE VIDEO
    // =========================

    const createdVideo = await prisma.video.create({
      data: {
        title: videoTitle,
        description: videoDescription,
        videoUrl: videoUrl,
        videoPath: videoPath,
        duration: videoDuration,
        notesUrl: notesUrl,

        moduleId: finalModuleId!,
        position: nextVideoPosition,
      },
    });

    console.log("Created Video : ",createdVideo)

    if(notesUrl){
      let ans = await pdfQueue.add("process-pdf", { teacherId, courseId, moduleId, videoId: createdVideo.id, fileUrl: notesUrl,
       fileName: title});

      console.error("=======================");
      console.log("Ans : ",ans)
    }
 
    return res.status(201).json({
      success: true,
      moduleId: finalModuleId,
      video: createdVideo,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to add video",
    });
  }
};