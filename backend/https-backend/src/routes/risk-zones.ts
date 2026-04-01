import { Router } from "express";
import axios from "axios";
import type { Request, Response } from "express";
import type { RiskZone, RiskZoneResponse } from "../types/riskZones.js";

const router = Router();

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:4141";
const CACHE_TTL_MS = 30000; // 30 seconds

// Fallback dummy zones
const FALLBACK_ZONES: RiskZone[] = [
  {
    id: "high_risk_1",
    name: "Downtown High-Risk Area",
    level: "high",
    coordinates: [
      [40.7128, -74.006],
      [40.7138, -74.006],
      [40.7138, -74.0050],
      [40.7128, -74.0050],
    ],
  },
  {
    id: "medium_risk_1",
    name: "Commerce District",
    level: "medium",
    coordinates: [
      [40.71, -74.01],
      [40.715, -74.01],
      [40.715, -74.005],
      [40.71, -74.005],
    ],
  },
  {
    id: "low_risk_1",
    name: "Residential Area",
    level: "low",
    coordinates: [
      [40.72, -74.02],
      [40.725, -74.02],
      [40.725, -74.015],
      [40.72, -74.015],
    ],
  },
];

interface CacheEntry {
  zones: RiskZone[];
  timestamp: number;
}

let cache: CacheEntry | null = null;

/**
 * GET /api/risk-zones
 * 
 * Fetch risk zones from ML backend with fallback
 * Returns cached zones if available (TTL: 30s)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    // Check cache first
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
      console.log("[RiskZoneAPI] Returning cached zones");
      return res.json({ zones: cache.zones });
    }

    try {
      console.log(`[RiskZoneAPI] Fetching zones from ML backend: ${ML_BACKEND_URL}/zones`);
      const response = await axios.get<RiskZoneResponse>(`${ML_BACKEND_URL}/zones`, {
        timeout: 5000, // 5-second timeout
      });

      if (response.data && Array.isArray(response.data.zones)) {
        const zones = response.data.zones;
        console.log(`[RiskZoneAPI] Successfully fetched ${zones.length} zones from ML backend`);

        // Update cache
        cache = {
          zones,
          timestamp: Date.now(),
        };

        return res.json({ zones });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[RiskZoneAPI] ML backend fetch failed: ${errorMsg}. Using fallback zones.`);
    }

    // Return fallback zones if ML backend fails
    console.log("[RiskZoneAPI] Using fallback zones");
    cache = {
      zones: FALLBACK_ZONES,
      timestamp: Date.now(),
    };

    return res.json({ zones: FALLBACK_ZONES });
  } catch (err) {
    console.error("[RiskZoneAPI] Unexpected error:", err);
    return res.status(500).json({
      message: "Internal server error while fetching risk zones",
      zones: FALLBACK_ZONES,
    });
  }
});

export default router;
