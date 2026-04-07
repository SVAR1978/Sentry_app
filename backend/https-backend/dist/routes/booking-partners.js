import { Router } from "express";
import { prisma } from "../prisma.js";
import { authenticateJWT } from "../middleware.js";
const router = Router();
// ============================================================
// In-memory rate limiter: 20 POST requests/min per user
// ============================================================
const visitRateMap = new Map();
const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60_000;
function isRateLimited(userId) {
    const now = Date.now();
    const entry = visitRateMap.get(userId);
    if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
        visitRateMap.set(userId, { count: 1, windowStart: now });
        return false;
    }
    if (entry.count >= RATE_LIMIT) {
        return true;
    }
    entry.count++;
    return false;
}
// ============================================================
// GET /booking-partners — Public (no auth required)
// Returns all active, whitelisted partners ordered by priority
// ============================================================
router.get("/", async (_req, res) => {
    try {
        console.log("[BOOKING_PARTNERS][LIST] Fetching active partners");
        const partners = await prisma.bookingPartner.findMany({
            where: { isActive: true },
            orderBy: { priority: "desc" },
            select: {
                id: true,
                name: true,
                description: true,
                url: true,
                logoUrl: true,
                category: true,
                isVerified: true,
                priority: true,
            },
        });
        // Security: Validate all URLs are HTTPS before sending to client
        const sanitizedPartners = partners.filter((p) => {
            if (!p.url.startsWith("https://")) {
                console.warn("[BOOKING_PARTNERS][SECURITY] Rejected non-HTTPS URL", {
                    partnerId: p.id,
                    url: p.url,
                });
                return false;
            }
            return true;
        });
        console.log("[BOOKING_PARTNERS][LIST] Returning partners", {
            total: sanitizedPartners.length,
        });
        return res.status(200).json({ partners: sanitizedPartners });
    }
    catch (error) {
        console.error("[BOOKING_PARTNERS][LIST] Failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// ============================================================
// GET /booking-partners/recently-visited — JWT required
// Returns last 3 genuinely visited partners (duration > 5s)
// ============================================================
router.get("/recently-visited", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("[BOOKING_PARTNERS][RECENT] Fetching for user", { userId });
        const recentVisits = await prisma.bookingVisit.findMany({
            where: {
                userId,
                durationMs: { gte: 5000 }, // Genuine visits only (>= 5 seconds)
            },
            orderBy: { visitedAt: "desc" },
            take: 3,
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        url: true,
                        logoUrl: true,
                        category: true,
                        isVerified: true,
                    },
                },
            },
        });
        // Deduplicate by partnerId (keep most recent)
        const seen = new Set();
        const unique = recentVisits.filter((v) => {
            if (seen.has(v.partnerId))
                return false;
            seen.add(v.partnerId);
            return true;
        });
        console.log("[BOOKING_PARTNERS][RECENT] Returning visits", {
            count: unique.length,
        });
        return res.status(200).json({
            recentPartners: unique.map((v) => ({
                ...v.partner,
                lastVisitedAt: v.visitedAt,
            })),
        });
    }
    catch (error) {
        console.error("[BOOKING_PARTNERS][RECENT] Failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// ============================================================
// POST /booking-partners/visits — JWT required, rate-limited
// Records user visit to a partner (with duration tracking)
// ============================================================
router.post("/visits", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Rate limit check
        if (isRateLimited(userId)) {
            console.warn("[BOOKING_PARTNERS][VISIT] Rate limited", { userId });
            return res
                .status(429)
                .json({ message: "Too many requests. Try again later." });
        }
        const { partnerId, durationMs } = req.body;
        if (!partnerId || typeof durationMs !== "number") {
            return res
                .status(400)
                .json({ message: "partnerId and durationMs are required" });
        }
        // Validate partner exists and is active in DB (never trust client-sent IDs blindly)
        const partner = await prisma.bookingPartner.findFirst({
            where: { id: partnerId, isActive: true },
        });
        if (!partner) {
            console.warn("[BOOKING_PARTNERS][VISIT] Invalid partner ID", {
                partnerId,
                userId,
            });
            return res.status(404).json({ message: "Partner not found" });
        }
        const visit = await prisma.bookingVisit.create({
            data: {
                userId,
                partnerId,
                durationMs,
            },
        });
        const isGenuine = durationMs >= 5000;
        console.log("[BOOKING_PARTNERS][VISIT] Recorded", {
            visitId: visit.id,
            userId,
            partnerId: partner.name,
            durationMs,
            isGenuine,
        });
        return res.status(201).json({
            message: "Visit recorded",
            visitId: visit.id,
            isGenuine,
        });
    }
    catch (error) {
        console.error("[BOOKING_PARTNERS][VISIT] Failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// ============================================================
// GET /booking-partners/my-tickets — JWT required
// Returns all genuine booking visits for ticket history
// ============================================================
router.get("/my-tickets", authenticateJWT, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("[BOOKING_PARTNERS][TICKETS] Fetching for user", { userId });
        const visits = await prisma.bookingVisit.findMany({
            where: {
                userId,
                durationMs: { gte: 5000 }, // Genuine visits only
            },
            orderBy: { visitedAt: "desc" },
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        url: true,
                        logoUrl: true,
                        category: true,
                        isVerified: true,
                    },
                },
            },
        });
        const tickets = visits.map((v) => ({
            id: v.id,
            partnerName: v.partner.name,
            partnerCategory: v.partner.category,
            partnerUrl: v.partner.url,
            partnerLogoUrl: v.partner.logoUrl,
            isVerified: v.partner.isVerified,
            durationMs: v.durationMs,
            visitedAt: v.visitedAt,
        }));
        console.log("[BOOKING_PARTNERS][TICKETS] Returning tickets", {
            count: tickets.length,
        });
        return res.status(200).json({ tickets });
    }
    catch (error) {
        console.error("[BOOKING_PARTNERS][TICKETS] Failed", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
export default router;
//# sourceMappingURL=booking-partners.js.map