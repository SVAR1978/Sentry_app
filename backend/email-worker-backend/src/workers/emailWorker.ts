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
  new Worker(
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

  console.log("Email worker started");
} catch (err) {
  console.error("Failed to start email worker:", err);
}