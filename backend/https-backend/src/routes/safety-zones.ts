import express from "express";
import type { Response, Request } from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { authenticateJWT, AuthenticatedRequest } from "../middleware.js";

const router = express.Router();
const prisma = new PrismaClient();

// ────────────────────────────────────────────────────────────
// GET /safety-zones — Public
// Query by lat/lng to find the zone the user is currently in
// Also returns nearest safe zone if current zone is moderate/avoid
// ────────────────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    // Return all zones if no coordinates provided
    const allZones = await prisma.safetyZone.findMany({
      orderBy: { safetyScore: "desc" },
    });

    if (isNaN(lat) || isNaN(lng)) {
      return res.json({ zones: allZones });
    }

    // Find the closest zone based on simple area name matching
    // In production, this would use PostGIS ST_Contains with polygon data
    // For now, we return the zone with highest safety score as default
    // and let the frontend match by name from reverse geocoding
    let currentZone = allZones.length > 0 ? allZones[0] : null;

    // Try to find a matching zone by proximity to known Delhi areas
    // This is a simplified approach — production would use PostGIS
    const delhiAreaCoords: Record<string, { lat: number; lng: number }> = {
      "Connaught Place": { lat: 28.6315, lng: 77.2167 },
      "Hauz Khas": { lat: 28.5494, lng: 77.2001 },
      "Chandni Chowk": { lat: 28.6506, lng: 77.2334 },
      "Paharganj": { lat: 28.6445, lng: 77.2100 },
      "Old Delhi Lanes": { lat: 28.6562, lng: 77.2410 },
    };

    let closestDistance = Infinity;
    for (const zone of allZones) {
      const knownCoords = delhiAreaCoords[zone.areaName];
      if (knownCoords) {
        const dx = (lat - knownCoords.lat) * 111000;
        const dy = (lng - knownCoords.lng) * 111000 * Math.cos((lat * Math.PI) / 180);
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < closestDistance) {
          closestDistance = distance;
          currentZone = zone;
        }
      }
    }

    // Find nearest safe zone if current is moderate/avoid
    let nearestSafeZone = null;
    if (currentZone && currentZone.zoneLevel !== "SAFE") {
      const safeZones = allZones.filter((z) => z.zoneLevel === "SAFE");
      let minSafeDist = Infinity;
      for (const sz of safeZones) {
        const szCoords = delhiAreaCoords[sz.areaName];
        if (szCoords) {
          const dx = (lat - szCoords.lat) * 111000;
          const dy = (lng - szCoords.lng) * 111000 * Math.cos((lat * Math.PI) / 180);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < minSafeDist) {
            minSafeDist = distance;
            nearestSafeZone = { ...sz, distanceMeters: Math.round(distance) };
          }
        }
      }
    }

    return res.json({
      currentZone,
      nearestSafeZone,
      allZones,
    });
  } catch (error) {
    console.error("[SafetyZones] GET / error:", error);
    return res.status(500).json({ message: "Failed to fetch safety zones" });
  }
});

// ────────────────────────────────────────────────────────────
// POST /safety-zones/seed — Admin only
// Seed initial Delhi safety zone data
// ────────────────────────────────────────────────────────────
router.post(
  "/seed",
  authenticateJWT as any,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user || user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin access required" });
      }

      // Check if already seeded
      const existing = await prisma.safetyZone.count();
      if (existing > 0) {
        return res.json({ message: "Safety zones already seeded", count: existing });
      }

      const seedData = [
        { areaName: "Connaught Place", safetyScore: 4.5, zoneLevel: "SAFE" as const },
        { areaName: "Hauz Khas", safetyScore: 4.3, zoneLevel: "SAFE" as const },
        { areaName: "Khan Market", safetyScore: 4.6, zoneLevel: "SAFE" as const },
        { areaName: "Lodhi Garden", safetyScore: 4.7, zoneLevel: "SAFE" as const },
        { areaName: "Chandni Chowk", safetyScore: 3.5, zoneLevel: "MODERATE" as const },
        { areaName: "Paharganj", safetyScore: 3.2, zoneLevel: "MODERATE" as const },
        { areaName: "Old Delhi Lanes", safetyScore: 3.0, zoneLevel: "MODERATE" as const },
        { areaName: "Karol Bagh", safetyScore: 3.8, zoneLevel: "MODERATE" as const },
        { areaName: "India Gate Area", safetyScore: 4.4, zoneLevel: "SAFE" as const },
        { areaName: "Saket", safetyScore: 4.2, zoneLevel: "SAFE" as const },
      ];

      const result = await prisma.safetyZone.createMany({ data: seedData });

      return res.status(201).json({
        message: "Safety zones seeded successfully",
        count: result.count,
      });
    } catch (error) {
      console.error("[SafetyZones] POST /seed error:", error);
      return res.status(500).json({ message: "Failed to seed safety zones" });
    }
  }
);

export default router;
