import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticateJWT, AuthenticatedRequest } from "../middleware.js";
import type { Response } from "express";

const router = Router();

// ============================================================
// In-memory rate limiter: 3 tickets per user per hour
// ============================================================
const ticketRateMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const entry = ticketRateMap.get(userId);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    ticketRateMap.set(userId, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

// ============================================================
// Input sanitizer — strip HTML/script tags
// ============================================================
function sanitize(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

// ============================================================
// Validation constants
// ============================================================
const VALID_SUBJECTS = [
  "General Inquiry",
  "Booking Issue",
  "Account Problem",
  "Safety Concern",
  "Bug Report",
  "Other",
];

// ============================================================
// POST /support/tickets — Submit a support ticket
// ============================================================
router.post(
  "/tickets",
  authenticateJWT,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Rate limit
      if (isRateLimited(userId)) {
        console.warn("[SUPPORT][TICKET] Rate limited", { userId });
        return res.status(429).json({
          success: false,
          message: "You can submit up to 3 tickets per hour. Please try again later.",
        });
      }

      const { name, email, subject, message } = req.body as {
        name?: string;
        email?: string;
        subject?: string;
        message?: string;
      };

      // ── Validation ────────────────────────────────────────
      const errors: Record<string, string> = {};

      if (!name || name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters";
      }

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "A valid email address is required";
      }

      if (!subject || !VALID_SUBJECTS.includes(subject)) {
        errors.subject = "Please select a valid subject";
      }

      if (!message || message.trim().length < 20) {
        errors.message = "Message must be at least 20 characters";
      }

      if (message && message.length > 1000) {
        errors.message = "Message must be at most 1000 characters";
      }

      if (Object.keys(errors).length > 0) {
        return res.status(422).json({ success: false, errors });
      }

      // ── Sanitize ──────────────────────────────────────────
      const cleanName = sanitize(name!);
      const cleanEmail = sanitize(email!);
      const cleanSubject = sanitize(subject!);
      const cleanMessage = sanitize(message!);

      // ── Create ticket ─────────────────────────────────────
      const ticket = await prisma.supportTicket.create({
        data: {
          userId,
          name: cleanName,
          email: cleanEmail,
          subject: cleanSubject,
          message: cleanMessage,
        },
      });

      const ticketRef = `TSA-${String(ticket.ticketNumber).padStart(5, "0")}`;

      console.log("[SUPPORT][TICKET] Created", {
        ticketRef,
        userId,
        subject: cleanSubject,
      });

      return res.status(201).json({
        success: true,
        ticketRef,
        message:
          "Your request has been received. We will respond within 48 hours.",
      });
    } catch (error) {
      console.error("[SUPPORT][TICKET] Failed", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

export default router;
