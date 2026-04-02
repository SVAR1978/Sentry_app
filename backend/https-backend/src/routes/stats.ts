import { Router } from "express";
import { prisma } from "../prisma.js";
import type { Request, Response } from "express";

const router = Router();

/**
 * GET /stats
 * Returns aggregate stats for the admin dashboard.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.user.count({
      where: { role: "USER" },
    });
    return res.json({ totalUsers });
  } catch (error) {
    console.error("[STATS] Failed to fetch stats:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /stats/recent-activity
 * Returns the most recent real activity events from the database:
 *   - Recent user signups (createdAt from User table)
 *   - Recent high-risk location alerts (riskScore >= 8 from LocationLog)
 * Combined, sorted by time descending, limited to 20.
 */
router.get("/recent-activity", async (req: Request, res: Response) => {
  try {
    // 1. Recent user signups (last 50 users created)
    const recentUsers = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      take: 15,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    const signupActivities = recentUsers.map((u) => ({
      id: `signup-${u.id}`,
      type: "SIGNUP" as const,
      action: "New user registered",
      user: u.name || u.email,
      userId: u.id,
      timestamp: u.createdAt.toISOString(),
    }));

    // 2. Recent high-risk alerts (riskScore >= 8)
    const recentAlerts = await prisma.locationLog.findMany({
      where: { riskScore: { gte: 8 } },
      orderBy: { timestamp: "desc" },
      take: 10,
      select: {
        id: true,
        userId: true,
        riskScore: true,
        latitude: true,
        longitude: true,
        timestamp: true,
        user: {
          select: { name: true, email: true },
        },
      },
    });

    const alertActivities = recentAlerts.map((a) => ({
      id: `alert-${a.id}`,
      type: "RISK_ALERT" as const,
      action: `High-risk zone detected (score: ${a.riskScore})`,
      user: a.user.name || a.user.email,
      userId: a.userId,
      timestamp: a.timestamp.toISOString(),
    }));

    // Combine and sort by timestamp desc
    const allActivities = [...signupActivities, ...alertActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    return res.json({ activities: allActivities });
  } catch (error) {
    console.error("[STATS] Failed to fetch recent activity:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * GET /stats/users
 * Returns all users with role USER for the admin user management page.
 * Excludes admins and sensitive fields (password, email).
 */
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return res.json({ users });
  } catch (error) {
    console.error("[STATS] Failed to fetch users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
