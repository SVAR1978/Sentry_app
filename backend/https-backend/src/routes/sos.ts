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
    const { userId, message, latitude, longitude, address, userName } = req.body;
    console.log("[SOS][CREATE] Request received", {
      userId,
      userName,
      hasLocation: Boolean(latitude && longitude),
    });

    if (!userId) {
      console.warn("[SOS][CREATE] Missing userId");
      return res.status(400).json({ message: "userId required" });
    }

    // 0. Fetch contacts first to snapshot them
    const contacts = await prisma.emergencyContact.findMany({ where: { userId } });
    console.log("[SOS][CREATE] Contacts fetched", { userId, count: contacts.length });

    // 1. Persist to database with contacts snapshot
    let alert;
    try {
      alert = await prisma.sOSAlert.create({
        data: {
          userId,
          status: "ACTIVE",
          latitude: latitude ? parseFloat(latitude.toString()) : null,
          longitude: longitude ? parseFloat(longitude.toString()) : null,
          address: address ?? null,
          emergencyContacts: contacts as any,
        },
      });
      console.log("[SOS][CREATE] Alert persisted to database", { alertId: alert.id });
    } catch (dbErr) {
      console.error("[SOS][CREATE] Failed to persist SOS alert:", dbErr);
      // Continue with email even if DB fails for safety
    }

    const alertId = alert?.id ?? "OFFLINE";
    const displayName = userName ?? userId;
    const hasCoordinates = typeof latitude === "number" && typeof longitude === "number";
    const mapsLink = hasCoordinates ? `https://www.google.com/maps?q=${latitude},${longitude}` : "";
    const locationStr = address || (hasCoordinates ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : "Location unavailable");

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #D93636; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">EMERGENCY SOS ALERT</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Immediate attention required</p>
        </div>
        <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
          <p style="font-size: 16px; margin: 0 0 16px;"><strong>${displayName}</strong> has triggered an emergency SOS alert.</p>
          ${message ? `<p style="background: #fff4f4; padding: 12px; border-left: 4px solid #D93636; margin: 16px 0;"><strong>Message:</strong> ${message}</p>` : ""}
          <table style="width: 100%; margin-bottom: 16px;">
            <tr><td style="padding: 8px 0; color: #666;">Alert ID</td><td style="padding: 8px 0; font-weight: bold;">${alertId}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0; font-weight: bold;">${locationStr}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0; font-weight: bold;">${new Date().toLocaleString("en-IN")}</td></tr>
          </table>
          ${mapsLink ? `<a href="${mapsLink}" style="display: inline-block; background: #D93636; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Location on Map</a>` : ""}
          <p style="margin-top: 20px; color: #888; font-size: 13px;">This alert was dispatched via the Sentry Emergency App. Please respond immediately or contact local emergency services.</p>
        </div>
      </div>
    `;

    let enqueued = 0;
    for (const c of contacts) {
      const to = (c as any).email as string | undefined;
      if (!to) continue;
      
      const subject = `EMERGENCY SOS ALERT — ${displayName} needs help`;

      try {
        await emailService.sendEmail(to, subject, htmlContent);
        console.log("[SOS][CREATE] Email sent directly", { userId, contactId: c.id, to });
      } catch (err) {
        try {
          await emailQueue.add("sendEmail", {
            email: to,
            subject,
            htmlContent,
            userId,
            contactId: c.id,
          });
          console.warn("[SOS][CREATE] Direct send failed; queued fallback email", {
            userId,
            contactId: c.id,
            to,
          });
        } catch (err2) {
          console.error("[SOS][CREATE] Direct send and queue fallback failed:", err2);
        }
      }
      enqueued++;
    }

    if (enqueued === 0 && contacts.length > 0) {
      console.warn("[SOS][CREATE] Contacts found but no emails available", { userId });
    }

    return res.json({ 
      success: true,
      message: "SOS alert dispatched", 
      alertId,
      notificationsSent: enqueued 
    });
  } catch (err) {
    console.error("[SOS][CREATE] Unexpected error", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
