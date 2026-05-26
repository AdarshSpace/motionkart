// routes/payment.routes.ts

import express from "express";
import { authentication } from "../middleware/authentication.js";
import { createOrder} from "../controllers/Payments/Order.js";
import { verifyPayment } from "../controllers/Payments/Verify_Payment.js";
import {webhookHandler} from "../controllers/Payments/Webhook.js"

const router = express.Router();

// IMPORTANT:
// raw body required for webhook signature verification
router.post("/webhook", express.raw({ type: "application/json" }), webhookHandler);

router.use(express.json());
router.use(authentication);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);



export default router;

