import { Router } from "express";
import { Queue } from "bullmq";
import { redis } from "../config/redis.js";
import { prisma } from "../prisma.js";
import { emailService } from "../services/emailService.js";
import type { Request, Response } from "express";

const router = Router();
const emailQueue = new Queue("emailQueue", { connection: redis });

// POST /sos
// body: { userId: string, message?: string }
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, message } = req.body;
    if (!userId) return res.status(400).json({ message: "userId required" });

    const contacts = await prisma.emergencyContact.findMany({ where: { userId } });
    let enqueued = 0;
    for (const c of contacts) {
      const to = (c as any).email as string | undefined;
      if (!to) continue;
      try {
        await emailQueue.add("sendEmail", {
          email: to,
          subject: `SOS from user ${userId}`,
          htmlContent: `<p>SOS request from user ${userId}</p><p>${message ?? ""}</p>`,
          userId,
          contactId: c.id,
        });
      } catch (err) {
        console.warn("emailQueue.add failed in /sos, falling back to direct send:", (err as any)?.message ?? err);
        try {
          await emailService.sendEmail(to, `SOS from user ${userId}`, `<p>SOS request from user ${userId}</p><p>${message ?? ""}</p>`);
        } catch (err2) {
          console.error("Direct email send failed for /sos:", err2);
        }
      }
      enqueued++;
    }

    if (enqueued === 0) {
      return res.status(404).json({ message: "No emergency contact email found" });
    }

    return res.json({ message: "SOS enqueued", enqueued });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
