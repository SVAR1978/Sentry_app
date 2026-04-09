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
    console.log("[SOS][CREATE] Request received", {
      userId,
      hasMessage: Boolean(message),
    });

    if (!userId) {
      console.warn("[SOS][CREATE] Missing userId");
      return res.status(400).json({ message: "userId required" });
    }

    const contacts = await prisma.emergencyContact.findMany({ where: { userId } });
    console.log("[SOS][CREATE] Contacts fetched", { userId, count: contacts.length });
    let enqueued = 0;
    for (const c of contacts) {
      const to = (c as any).email as string | undefined;
      if (!to) continue;
      try {
        await emailService.sendEmail(
          to,
          `SOS from user ${userId}`,
          `<p>SOS request from user ${userId}</p><p>${message ?? ""}</p>`
        );
        console.log("[SOS][CREATE] Email sent directly", { userId, contactId: c.id, to });
      } catch (err) {
        try {
          await emailQueue.add("sendEmail", {
            email: to,
            subject: `SOS from user ${userId}`,
            htmlContent: `<p>SOS request from user ${userId}</p><p>${message ?? ""}</p>`,
            userId,
            contactId: c.id,
          });
          console.warn("[SOS][CREATE] Direct send failed; queued fallback email", {
            userId,
            contactId: c.id,
            to,
            error: (err as any)?.message ?? err,
          });
        } catch (err2) {
          console.error("[SOS][CREATE] Direct send and queue fallback failed:", err2);
        }
      }
      enqueued++;
    }

    if (enqueued === 0) {
      console.warn("[SOS][CREATE] No contact email available", { userId });
      return res.status(404).json({ message: "No emergency contact email found" });
    }

    console.log("[SOS][CREATE] SOS notifications enqueued", { userId, enqueued });

    return res.json({ message: "SOS enqueued", enqueued });
  } catch (err) {
    console.error("[SOS][CREATE] Unexpected error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
