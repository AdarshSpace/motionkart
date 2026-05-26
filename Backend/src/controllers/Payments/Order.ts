
import type { Request, Response } from "express";
import Razorpay from "razorpay";

import {prisma} from "../../lib/DB.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!, 
  key_secret: process.env.RAZORPAY_SECRET!,
});


export const createOrder = async (req: Request, res: Response) => {
  try {
    console.log("Body :", req.body)
    const { courseId } = req.body;
   
    const userId = req.user?.id as string
    const  RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID

    console.log("courseId : ", courseId, " userId : ", userId);
    console.log('Key ID : ', process.env.RAZORPAY_KEY_ID, '  SECERET KEY : ', process.env.RAZORPAY_SECRET);  

    // 1. validate course
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    console.log(course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. check already purchased
    const alreadyPurchased = await prisma.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    console.log(alreadyPurchased);

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "Course already purchased",
      });
    }

    // 3. create receipt
    const receipt = `rcpt_${Date.now()}`;

    console.log(receipt);

    // 4. create razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Number(course.price) * 100,
      currency: "INR",
      receipt,
    });

    console.log(razorpayOrder);

    // 5. create payment row
    const payment = await prisma.payment.create({
      data: {
        amount: Number(course.price),
        currency: "INR",
        provider: "RAZORPAY",
        receipt,
        orderId: razorpayOrder.id,
        status: "PENDING",

        userId,
        courseId,
      },
    });

    return res.status(201).json({
      success: true,
      paymentId: payment.id,
      RAZORPAY_KEY_ID: RAZORPAY_KEY_ID,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Create order failed",
    });
  }
};


