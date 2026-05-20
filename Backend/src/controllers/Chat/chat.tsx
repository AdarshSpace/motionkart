import type { Request, Response } from "express";

import { prisma } from "../../lib/DB.js";

import { retrieveAnswer } from "../../worker/Pdf/retriever.js";


export const askAi = async ( req: Request, res: Response) => {

  try {

    const userId = req.user?.id as string;

    const {question, courseId, videoId} = req.body;


    // STEP-1 : Find Existing Chat
    // =========================

    const existingChat = await prisma.chatMessage.findUnique({
      where: { userId_videoId: { userId, videoId, }, },
    });


    // STEP-2 : USER MESSAGE
    // =========================

    const userMessage = {
      role: "USER",
      text: question,
    };


    // STEP-3 : CREATE OR UPDATE CHAT
    // =========================

    if (!existingChat) {

      // CREATE NEW CHAT
      await prisma.chatMessage.create({
        data: { userId, courseId, videoId, content: [userMessage], },
      });

    } else {

      // APPEND USER MESSAGE
      const oldMessages = existingChat.content as any[];

      await prisma.chatMessage.update({
        where: { id: existingChat.id, },
        data: { content: [...oldMessages, userMessage], },
      });
    }


    // STEP-4 : RETRIEVER AND  AI MESSAGE
    // =========================

    const aiResult = await retrieveAnswer({ question, courseId, videoId});

    const aiMessage = {
      role: "ASSISTANT",
      text: aiResult.answer ?? "Sorry, I could not find an answer.",
    };


    // STEP-6 : SAVE AI RESPONSE
    // =========================

    const latestChat =  await prisma.chatMessage.findUnique({
        where: { userId_videoId: { userId, videoId, }, },
      });


    const latestMessages = latestChat?.content as any[];

    await prisma.chatMessage.update({
      where: { id: latestChat!.id, },
      data: { content: [...latestMessages, aiMessage], },
    });


    // =========================
    // STEP-7 : SEND RESPONSE
    // =========================

    return res.status(200).json({
      success: true,
      answer: aiResult.answer ?? "Sorry, I could not find an answer.",
      sources: aiResult.sources,
    });

  } catch (error) {

    console.log(
      "Ask AI Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};