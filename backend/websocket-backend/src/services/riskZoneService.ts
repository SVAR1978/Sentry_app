import axios from "axios";
import { RiskCalculationResult } from "../types/riskZones.js";

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache for boundaries

interface Feature {
  type: string;
  properties: {
    POL_STN_NM: string;
    [key: string]: any;
  };
  geometry: {
    type: string;
    coordinates: number[][][]; // GeoJSON is [lng, lat]
  };
}

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

interface BoundaryZone {
  id: string; // POL_STN_NM
  name: string;
  polygonLatLon: [number, number][]; // [lat, lng]
}

export class RiskZoneService {
  private static cachedZones: BoundaryZone[] | null = null;
  private static lastCacheTime: number = 0;

  /**
   * Fetch police station boundaries from S3, transforming GeoJSON [lng, lat]
   * to our internal [lat, lng] array.
   */
  static async fetchZones(): Promise<BoundaryZone[]> {
    if (this.cachedZones && Date.now() - this.lastCacheTime < CACHE_TTL_MS) {
      return this.cachedZones;
    }

    try {
      const boundaryUrl = process.env.POLICE_STATION_BOUNDARY_URL;
      if (!boundaryUrl) {
        console.warn("[RiskZoneService] POLICE_STATION_BOUNDARY_URL not set in .env!");
        return [];
      }

      console.log(`[RiskZoneService] Fetching boundaries from S3: ${boundaryUrl}`);
      const response = await axios.get<FeatureCollection>(boundaryUrl, { timeout: 10000 });
      
      const zones: BoundaryZone[] = [];

      for (const feature of response.data.features) {
        if (feature.geometry.type === "Polygon" && feature.geometry.coordinates.length > 0) {
          const polyLngLat = feature.geometry.coordinates[0];
          // Transform to [lat, lng]
          const polyLatLon: [number, number][] = polyLngLat.map(([lng, lat]) => [lat, lng]);
          
          zones.push({
            id: feature.properties.POL_STN_NM,
            name: feature.properties.POL_STN_NM,
            polygonLatLon: polyLatLon
          });
        }
      }

      this.cachedZones = zones;
      this.lastCacheTime = Date.now();
      console.log(`[RiskZoneService] Successfully cached ${zones.length} boundaries.`);
      return zones;
    } catch (err) {
      console.warn(`[RiskZoneService] Failed to fetch boundaries:`, (err as any).message);
      return [];
    }
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
   * Fetch live risk from AWS
   */
  private static async fetchRiskFromAWS(areaId: string, lat: number, lng: number): Promise<RiskCalculationResult | null> {
    const awsUrl = process.env.AWS_RISK_BASE_URL;
    if (!awsUrl) {
      console.warn("[RiskZoneService] AWS_RISK_BASE_URL is not set.");
      return null;
    }

    try {
      const url = `${awsUrl}/score/area`;
      const response = await axios.post(url, {
        area_id: areaId,
        latitude: lat,
        longitude: lng
      }, { timeout: 4000 });

      const finalScore = response.data?.final_score ?? response.data?.base_risk?.score ?? response.data?.base_score ?? 0;
      
      let pLevel: "low" | "medium" | "high" = "low";
      let levelScore = 2; // Arbitrary numerical score for low

      if (finalScore > 55) {
        pLevel = "high";
        levelScore = 9;
      } else if (finalScore > 30) {
        pLevel = "medium";
        levelScore = 6;
      }

      return {
        score: levelScore,
        level: pLevel,
        zoneId: areaId,
        zoneName: areaId
      };
    } catch (err) {
      console.warn(`[RiskZoneService] Failed to fetch live risk for ${areaId}:`, (err as any).message);
      return null;
    }
  }

  /**
   * Detect polygon collision and fetch risk. If areaId is pre-supplied by frontend 
   * (via `getRealtimeRisk` proxy call), skip polygon detection and use it.
   */
  static async calculateRisk(lat: number, lng: number): Promise<RiskCalculationResult> {
    const zones = await this.fetchZones();

    for (const zone of zones) {
      if (this.pointInPolygon(lat, lng, zone.polygonLatLon)) {
        console.log(`[RiskZoneService] User at (${lat}, ${lng}) is inside ${zone.name}`);
        
        // Now fetch actual risk
        const risk = await this.fetchRiskFromAWS(zone.name, lat, lng);
        if (risk) {
          return risk;
        }

        // Fallback if AWS fails but we know they are in a zone
        return {
          score: 6,
          level: "medium", // assume medium if we fail to fetch
          zoneId: zone.id,
          zoneName: zone.name
        };
      }
    }

    // Default to low/safe if not in any boundary
    return {
      score: 2,
      level: "low",
    };
  }

  static async getRealtimeRisk(lat: number, lng: number, areaId?: string): Promise<RiskCalculationResult> {
    // If the frontend already knows what area they are in, skip polygon math
    if (areaId) {
      const risk = await this.fetchRiskFromAWS(areaId, lat, lng);
      if (risk) return risk;
    }
    
    // Otherwise fallback to point-in-poly check
    return this.calculateRisk(lat, lng);
  }
}
