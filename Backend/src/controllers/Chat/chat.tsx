import type { Request, Response } from "express";

import { prisma } from "../../lib/DB.js";

import { retrieveAnswer, rewriteQuestion } from "../../worker/Pdf/retriever.js";
import type { ChatMessage } from "../../worker/Pdf/retriever.js"


export const askAi = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id as string;
    const { question, courseId, videoId } = req.body;

    // STEP-1: Find Existing Chat
    const existingChat = await prisma.chatMessage.findUnique({
      where: { userId_videoId: { userId, videoId } },
    });

    const userMessage = { role: "USER", text: question };

    // STEP-2: Build updated messages array (don't re-fetch later)
    const oldMessages = (existingChat?.content as any[]) ?? [];
    const updatedMessages = [...oldMessages, userMessage];

    // STEP-3: Rewrite question using history (only if history exists)
    let reQuestion = question;

    if (oldMessages.length > 0) {
      const chatHistory: ChatMessage[] = oldMessages
        .slice(-5)
        .map((msg: any) => ({
          role: msg.role === "USER" ? "student" : "assistant",
          content: msg.text,
        }));

      reQuestion = await rewriteQuestion(chatHistory, question);
    }

    // STEP-4: Save user message (create or update)
    if (!existingChat) {
      await prisma.chatMessage.create({
        data: { userId, courseId, videoId, content: [userMessage] },
      });
    } else {
      await prisma.chatMessage.update({
        where: { id: existingChat.id },
        data: { content: updatedMessages },
      });
    }

    // STEP-5: Retrieve AI answer
    const aiResult = await retrieveAnswer({ reQuestion, courseId, videoId });

    const aiMessage = {
      role: "ASSISTANT",
      text: aiResult.answer ?? "Sorry, I could not find an answer.",
    };

    // STEP-6: Append AI message (reuse existing id — no second fetch)
    const chatRecord = await prisma.chatMessage.findUnique({
      where: { userId_videoId: { userId, videoId } },
    });

    await prisma.chatMessage.update({
      where: { id: chatRecord!.id },
      data: { content: [...updatedMessages, aiMessage] },
    });

    // STEP-7: Respond
    return res.status(200).json({
      success: true,
      answer: aiResult.answer ?? "Sorry, I could not find an answer.",
      sources: aiResult.sources,
    });

  } catch (error) {
    console.error("Ask AI Controller Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};