import express from "express";
import type { Response, Request } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { authenticateJWT, AuthenticatedRequest } from "../middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────
// GET /alerts/active — Public (no auth required)
// Returns all active, non-expired alerts
// ────────────────────────────────────────────────────────────
router.get("/active", async (_req: Request, res: Response) => {
  try {
    const alerts = await prisma.safetyAlert.findMany({
      where: {
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: [
        { severity: "asc" }, // CRITICAL first (alphabetical: CAUTION < CRITICAL < INFO)
        { createdAt: "desc" },
      ],
    });

    // Re-sort: CRITICAL → CAUTION → INFO
    const severityOrder = { CRITICAL: 0, CAUTION: 1, INFO: 2 };
    alerts.sort(
      (a, b) =>
        (severityOrder[a.severity] ?? 3) - (severityOrder[b.severity] ?? 3)
    );

    return res.json({ alerts });
  } catch (error) {
    console.error("[Alerts] GET /active error:", error);
    return res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

// ────────────────────────────────────────────────────────────
// GET /alerts/:id — Public
// Returns a single alert by ID
// ────────────────────────────────────────────────────────────
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const alert = await prisma.safetyAlert.findUnique({
      where: { id: req.params.id },
    });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    return res.json({ alert });
  } catch (error) {
    console.error("[Alerts] GET /:id error:", error);
    return res.status(500).json({ message: "Failed to fetch alert" });
  }
});

// ────────────────────────────────────────────────────────────
// POST /alerts — Admin only (JWT + admin role check)
// Create a new safety alert
// ────────────────────────────────────────────────────────────
router.post(
  "/",
  authenticateJWT as any,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      // Check admin role
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { title, description, severity, affectedAreas, issuedBy, expiresAt } =
        req.body as {
          title: string;
          description: string;
          severity: "CRITICAL" | "CAUTION" | "INFO";
          affectedAreas: string[];
          issuedBy?: string;
          expiresAt?: string;
        };

      // Validation
      if (!title || !description || !severity) {
        return res.status(400).json({ message: "title, description, and severity are required" });
      }
      if (!["CRITICAL", "CAUTION", "INFO"].includes(severity)) {
        return res.status(400).json({ message: "severity must be CRITICAL, CAUTION, or INFO" });
      }

      // Sanitize
      const sanitize = (s: string) =>
        s.replace(/<[^>]*>/g, "").replace(/[<>]/g, "").trim();

      const alert = await prisma.safetyAlert.create({
        data: {
          title: sanitize(title).slice(0, 200),
          description: sanitize(description).slice(0, 5000),
          severity,
          affectedAreas: (affectedAreas || []).map((a: string) => sanitize(a)),
          issuedBy: issuedBy ? sanitize(issuedBy).slice(0, 100) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
        },
      });

      return res.status(201).json({ alert });
    } catch (error) {
      console.error("[Alerts] POST / error:", error);
      return res.status(500).json({ message: "Failed to create alert" });
    }
  }
);

// ────────────────────────────────────────────────────────────
// PATCH /alerts/:id/deactivate — Admin only
// Deactivate an alert
// ────────────────────────────────────────────────────────────
router.patch(
  "/:id/deactivate",
  authenticateJWT as any,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
      }

      const alert = await prisma.safetyAlert.update({
        where: { id: req.params.id },
        data: { isActive: false },
      });

      return res.json({ alert });
    } catch (error) {
      console.error("[Alerts] PATCH /deactivate error:", error);
      return res.status(500).json({ message: "Failed to deactivate alert" });
    }
  }
);

export default router;
