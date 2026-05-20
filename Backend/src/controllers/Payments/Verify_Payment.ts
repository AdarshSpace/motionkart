
import type { Request, Response } from "express";
import crypto from "crypto";

import {prisma} from "../../lib/DB.js";


export const verifyPayment = async (req: Request, res: Response) => {
    try {
        console.log('secret Key : ', process.env.RAZORPAY_SECRET);
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      console.log( razorpay_order_id, razorpay_payment_id, razorpay_signature);
  
      // 1. create generated signature
      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      console.log(body)
  
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body)
        .digest("hex");

        console.log(generatedSignature)
  
      // 2. compare signature
      const isAuthentic =
        generatedSignature === razorpay_signature;

        console.log(isAuthentic)
  
      if (!isAuthentic) {
        return res.status(400).json({
          success: false,
          message: "Invalid signature",
        });
      }
  
      // 3. find payment
      const payment = await prisma.payment.findUnique({
        where: {
          orderId: razorpay_order_id,
        },
      });

      console.log(payment);
  
      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment not found",
        });
      }
  
      // 4. update payment
      await prisma.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          paymentId: razorpay_payment_id,
          status: "SUCCESS",
          paidAt: new Date(),
        },
      });
  
      // 5. create purchase (idempotent safe)
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
  
      return res.status(200).json({
        success: true,
        message: "Payment verified",
      });
    } catch (error) {
      console.log(error);
  
      return res.status(500).json({
        success: false,
        message: "Verification failed",
      });
    }
  };