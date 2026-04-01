import axios from "axios";
import { RiskZone, RiskCalculationResult } from "../types/riskZones.js";

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

export class RiskZoneService {
  private static cache: CacheEntry | null = null;

  /**
   * Fetch risk zones from ML backend with fallback
   */
  static async fetchZones(): Promise<RiskZone[]> {
    // Check cache first
    if (RiskZoneService.cache && Date.now() - RiskZoneService.cache.timestamp < CACHE_TTL_MS) {
      console.log("[RiskZoneService] Using cached zones");
      return RiskZoneService.cache.zones;
    }

    try {
      console.log(`[RiskZoneService] Fetching zones from ML backend: ${ML_BACKEND_URL}/zones`);
      const response = await axios.get<{ zones: RiskZone[] }>(`${ML_BACKEND_URL}/zones`, {
        timeout: 5000, // 5-second timeout
      });

      if (response.data && Array.isArray(response.data.zones)) {
        const zones = response.data.zones;
        console.log(`[RiskZoneService] Successfully fetched ${zones.length} zones from ML backend`);

        // Update cache
        RiskZoneService.cache = {
          zones,
          timestamp: Date.now(),
        };

        return zones;
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.warn(`[RiskZoneService] ML backend fetch failed: ${errorMsg}. Using fallback zones.`);
    }

    // Return fallback zones if ML backend fails
    console.log("[RiskZoneService] Using fallback zones");
    RiskZoneService.cache = {
      zones: FALLBACK_ZONES,
      timestamp: Date.now(),
    };

    return FALLBACK_ZONES;
  }

  /**
   * Point-in-polygon detection using ray-casting algorithm
   * Returns true if point (lat, lng) is inside the polygon
   */
  private static pointInPolygon(lat: number, lng: number, polygon: [number, number][]): boolean {
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [lat1, lng1] = polygon[i];
      const [lat2, lng2] = polygon[j];

      const isLngIntersect =
        (lng1 > lng) !== (lng2 > lng) &&
        lng < ((lng2 - lng1) * (lat - lat1)) / (lat2 - lat1) + lng1;

      if (isLngIntersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * Calculate risk score based on location
   */
  static async calculateRisk(lat: number, lng: number): Promise<RiskCalculationResult> {
    const zones = await RiskZoneService.fetchZones();

    // Check from highest to lowest risk
    const riskLevels: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
    const scoreMap = { high: 9, medium: 6, low: 2 };

    for (const level of riskLevels) {
      for (const zone of zones) {
        if (zone.level === level && RiskZoneService.pointInPolygon(lat, lng, zone.coordinates)) {
          const score = scoreMap[level];
          console.log(
            `[RiskZoneService] Risk detected at (${lat}, ${lng}): ${zone.name} (${level}) - score: ${score}`
          );
          return {
            score,
            level,
            zoneId: zone.id,
            zoneName: zone.name,
          };
        }
      }
    }

    console.log(`[RiskZoneService] No risk zone detected at (${lat}, ${lng})`);
    return {
      score: 2,
      level: "low",
    };
  }
}
