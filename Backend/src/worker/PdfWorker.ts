import { Worker } from "bullmq";
import { redis } from "../lib/redis.js";
import { processPdf } from "./Pdf/processing.js";
import { prisma } from "../lib/DB.js";


// JOB TYPE
interface PdfJobData {
  teacherId: string;

  courseId: string;
  moduleId: string;
  videoId: string;

  fileUrl: string;
  fileName: string;
}

// 1️⃣ Worker logic as a reusable function
export async function handlePdfJob(jobData: PdfJobData) {
   const { teacherId, courseId, moduleId, videoId, fileUrl, fileName} = jobData;

   try {
        await processPdf({ teacherId, courseId, moduleId, videoId, fileUrl, fileName, });
        console.log("✅ PDF processed successfully for document:", fileName);

        await prisma.video.update({
            where: { id: videoId, },
            data: { aiProcessingStatus: "ready", }
        });

      console.log('✅ Status update : ready');


  } catch (error) {
      await prisma.video.update({
        where: { id: videoId, },
        data: { aiProcessingStatus: "failed", },
    });
    console.error("Error processing PDF:", error);
    throw error;
  }
}

// 2️⃣ BullMQ worker
export const worker = new Worker(
  "pdf-processing",
  async (job) => {
    await handlePdfJob(job.data);
    console.log("✅ Job completed:", job.id);
  },
  {
    connection: redis,
    autorun: true, 
  }
);







// WORKER EVENTS
// ============================


// Worker Ready (waitUntilReady replaces the removed 'ready' event in BullMQ v4+)
worker.waitUntilReady().then(() => {
  console.log("✅ Worker is ready and waiting for jobs...");
}).catch((err) => {
  console.error("❌ Worker failed to connect:", err);
});


// Worker Error
worker.on("error", (error) => {
  console.error("❌ Worker error:", error);
});


// Job Active / Started
worker.on("active", (job) => {
  console.log(`🚀 Job Started: ${job.id}`);
});


// Job Progress
worker.on("progress", (job, progress) => {
  console.log(`📊 Job Progress ${job.id}:`, progress);
});


// Job Completed
worker.on("completed", (job) => {
  console.log(`✅ Job Completed: ${job.id}`);
});


// Job Failed
worker.on("failed", (job, error) => {

  console.log(`❌ Job Failed: ${job?.id}`);

  console.error("Failure Reason:", error.message);
});


// Job Stalled
worker.on("stalled", (jobId) => {
  console.log(`⚠️ Job Stalled: ${jobId}`);
});


// Worker Paused
worker.on("paused", () => {
  console.log("⏸️ Worker paused");
});


// Worker Resumed
worker.on("resumed", () => {
  console.log("▶️ Worker resumed");
});


// Worker Closing
worker.on("closing", () => {
  console.log("🛑 Worker shutting down...");
});


// Worker Closed
worker.on("closed", () => {
  console.log("🔴 Worker closed");
});


// Drained Queue
worker.on("drained", () => {
  console.log("📭 No more waiting jobs in queue");
});
