import type { Request, Response } from "express";
import { prisma } from "../../lib/DB.js";
import { pdfQueue } from "../../lib/queue.js";
import { mux } from "../../lib/mux.js";



export const addVideo = async (req: Request, res: Response) => {

  try {
    const teacherId = req.user?.id;
    const courseId = req.params.courseId as string;

    console.log(courseId);

    const { id: moduleId, title: sectionTitle, videos } = req.body;

    const [videoData] = videos;

    const { title: videoTitle, description: videoDescription, uploadId,  notesUrl } = videoData;


    if (!courseId) {
       return res.status(400).json({
          success: false,
          message: "Course ID is required",
        });
    }

    if (!videoTitle || !uploadId) {
        return res.status(400).json({
          success: false,
          message: "Video title and uploadId are required",
        });
    }

    // STEP 1 → Retrieve upload
    const upload = await mux.video.uploads.retrieve(uploadId);

    if (!upload.asset_id) {
      return res.status(400).json({
        success: false,
        message: "Asset is not ready yet",
      });
    }

     // STEP 2 → Retrieve asset
     const asset = await mux.video.assets.retrieve(upload.asset_id);

    console.log('Asset : ',asset);

     const playbackId = asset.playback_ids?.[0]?.id;
 
     if (!playbackId) {
       return res.status(400).json({
         success: false,
         message: "Playback ID not found",
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
        muxUploadId: uploadId,
        muxAssetId: upload.asset_id,
        muxPlaybackId: playbackId,
        videoUrl:  `https://stream.mux.com/${playbackId}.m3u8`,
        duration: Math.floor(asset.duration || 0),
        notesUrl: notesUrl || null,

        moduleId: finalModuleId!,
        position: nextVideoPosition,
      },
    });

    console.log("Created Video : ", createdVideo)

    if(notesUrl){
      let ans = await pdfQueue.add("process-pdf", { teacherId, courseId, moduleId: finalModuleId, videoId: createdVideo.id, fileUrl: notesUrl,
       fileName: videoTitle});

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