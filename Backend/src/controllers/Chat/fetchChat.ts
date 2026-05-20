import type { Request, Response } from "express";

import { prisma } from "../../lib/DB.js";


// getChatController.ts
export const getChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { courseId, videoId } = req.params ;


    if(!videoId && !userId){
        return res.status(400).json({
            success: false,
            message: "Please provide userId and videoId",
        }); 
    }

    const chat = await prisma.chatMessage.findUnique({
      where: { userId_videoId: { userId: userId, videoId: videoId as string } },
    });

    return res.status(200).json({
      success: true,
      messages: chat?.content ?? [],
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};