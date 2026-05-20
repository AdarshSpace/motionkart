
import type { Request, Response } from "express";
import crypto from "crypto";

import {prisma} from "../../lib/DB.js";


export const webhookHandler = async ( req: Request, res: Response ) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  
      const signature = req.headers["x-razorpay-signature"] as string;
  
      // raw body
      const body = req.body;
  
      // verify webhook signature
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
  
      const isAuthentic = expectedSignature === signature;
  
      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: "Invalid webhook signature",
        });
      }
  
      // parse body
      const payload = JSON.parse(body.toString());
  
      const event = payload.event;
  
      const paymentEntity = payload.payload.payment.entity;
  
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
  
      // prevent duplicate webhook processing
      const existingWebhook = await prisma.payment.findFirst({
        where: {
          webhookEventId: payload.account_id,
        },
      });
  
      if (existingWebhook) {
        return res.status(200).json({
          success: true,
          message: "Webhook already processed",
        });
      }
  
      // payment captured
      if (event === "payment.captured") {
        const payment = await prisma.payment.findUnique({
          where: {
            orderId,
          },
        });
  
        if (!payment) {
          return res.status(404).json({
            success: false,
            message: "Payment not found",
          });
        }
  
        // update payment
        await prisma.payment.update({
          where: {
            id: payment.id,
          },
          data: {
            paymentId,
            webhookEventId: payload.account_id,
            event,
            status: "SUCCESS",
            paidAt: new Date(),
          },
        });
  
        // create purchase safely
        await prisma.purchase.upsert({
          where: {
            userId_courseId: {
              userId: payment.userId,
              courseId: payment.courseId,
            },
          },
          update: {},
          create: {
            userId: payment.userId,
            courseId: payment.courseId,
          },
        });
      }
  
      // payment failed
      if (event === "payment.failed") {
        await prisma.payment.updateMany({
          where: {
            orderId,
          },
          data: {
            status: "FAILED",
            failureReason:
              paymentEntity.error_description || "Payment failed",
            event,
          },
        });
      }
  
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        success: false,
        message: "Webhook failed",
      });
    }
  };