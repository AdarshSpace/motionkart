import { Queue } from "bullmq";
import { redis } from "./redis.js";

export const pdfQueue = new Queue("pdf-processing", {
  connection: redis
});