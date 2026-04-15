import { Worker } from "bullmq";
import { redis } from "../config/redis.js";
import { emailService } from "../services/emailService.js";

process.on("uncaughtException", (err) => {
  console.error("uncaughtException in emailWorker:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("unhandledRejection in emailWorker:", reason);
});

try {
  const worker = new Worker(
    "emailQueue",
    async (job) => {
      const { email, subject, htmlContent } = job.data;
      if (!email) {
        console.warn("emailWorker: job missing email", job.id);
        return;
      }
      await emailService.sendEmail(email, subject ?? "Notification", htmlContent ?? "");
    },
    { connection: redis }
  );

  worker.on("completed", (job) => {
    console.log("emailWorker: job completed", { jobId: job.id, name: job.name });
  });

  worker.on("failed", (job, err) => {
    console.error("emailWorker: job failed", {
      jobId: job?.id,
      name: job?.name,
      error: err?.message ?? err,
    });
  });

  worker.on("error", (err) => {
    console.error("emailWorker: worker error", err);
  });

  console.log("Email worker started");
} catch (err) {
  console.error("Failed to start email worker:", err);
}
