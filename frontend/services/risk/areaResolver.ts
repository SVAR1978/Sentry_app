/**
 * areaResolver.ts
 *
 * Fallback area-identification service.
 * When the GeoJSON boundary data is unavailable (EXPO_PUBLIC_POLICE_STATION_BOUNDARY_URL
 * not configured), this module reverse-geocodes the user's lat/lon via Nominatim,
 * then fuzzy-matches the locality name against the 180 Delhi police-station area
 * names returned by the backend.
 */

import { fetchAllAreaBaseScores, type AreaBaseScore } from "../api/riskService";

// ── Cache ────────────────────────────────────────────────────────────
let cachedAreaList: AreaBaseScore[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 min

async function ensureAreaList(): Promise<AreaBaseScore[]> {
  if (cachedAreaList && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return cachedAreaList;
  }

  try {
    const response = await fetchAllAreaBaseScores();
    cachedAreaList = response.areas ?? [];
    cacheTimestamp = Date.now();
    return cachedAreaList;
  } catch (error) {
    console.warn("[AreaResolver] Failed to fetch area list:", error);
    return cachedAreaList ?? [];
  }
}

// ── String helpers ───────────────────────────────────────────────────
function normalize(s: string): string {
  return s
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function stripPsPrefix(areaId: string): string {
  return normalize(areaId).replace(/^PS\s+/, "");
}

// ── Fuzzy matching ───────────────────────────────────────────────────
function fuzzyMatchArea(
  query: string,
  areas: AreaBaseScore[]
): AreaBaseScore | null {
  const q = normalize(query);
  if (!q) return null;

  // 1. Exact match (after stripping "PS " prefix)
  for (const area of areas) {
    if (stripPsPrefix(area.area_id) === q) return area;
  }

  // 2. Substring match (either direction)
  for (const area of areas) {
    const stripped = stripPsPrefix(area.area_id);
    if (stripped.includes(q) || q.includes(stripped)) return area;
  }

  // 3. Word-overlap scoring
  const queryWords = q.split(" ").filter((w) => w.length > 2);
  if (queryWords.length === 0) return null;

  let bestMatch: AreaBaseScore | null = null;
  let bestScore = 0;

  for (const area of areas) {
    const areaWords = stripPsPrefix(area.area_id).split(" ");
    let score = 0;
    for (const qw of queryWords) {
      for (const aw of areaWords) {
        if (qw === aw) score += 2;
        else if (qw.includes(aw) || aw.includes(qw)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = area;
    }
  }

  // Require at least one strong word match
  return bestScore >= 2 ? bestMatch : null;
}

// ── Nominatim reverse-geocode ────────────────────────────────────────
interface NominatimAddress {
  suburb?: string;
  neighbourhood?: string;
  city_district?: string;
  village?: string;
  town?: string;
  county?: string;
  state_district?: string;
  residential?: string;
  [key: string]: unknown;
}

async function reverseGeocode(
  lat: number,
  lon: number
): Promise<NominatimAddress | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?lat=${lat}&lon=${lon}&format=json&zoom=16&addressdetails=1`;

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SentryApp/1.0 (safety-app)",
        Accept: "application/json",
      },
    });

    if (!response.ok) return null;
    const data = await response.json();
    return (data?.address as NominatimAddress) ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ── Public API ───────────────────────────────────────────────────────

// ── Main Resolver Cache ──
let lastResolvedLat = 0;
let lastResolvedLon = 0;
let lastResolvedAreaId: string | null = null;
let lastResolvedTime = 0;

// Haversine distance in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Attempts to determine the police-station area ID for a given lat/lon
 * by reverse-geocoding and fuzzy-matching against the backend area list.
 *
 * Returns the area_id string (e.g. "PS ADARSH NAGAR") or null.
 */
export async function resolveAreaFromLocation(
  latitude: number,
  longitude: number
): Promise<string | null> {
  // Return cached result if we've resolved a location within 500m in the last 15 minutes
  const now = Date.now();
  if (now - lastResolvedTime < 15 * 60 * 1000) {
    const dist = getDistanceMeters(latitude, longitude, lastResolvedLat, lastResolvedLon);
    if (dist < 500) {
      return lastResolvedAreaId;
    }
  }

  try {
    const areas = await ensureAreaList();
    if (areas.length === 0) {
      console.warn("[AreaResolver] Area list is empty — cannot resolve");
      return null;
    }

    // 1. Reverse geocode
    const address = await reverseGeocode(latitude, longitude);
    if (!address) {
      console.warn("[AreaResolver] Nominatim reverse geocode returned no data");
      return null;
    }

    // 2. Try locality components in priority order
    const candidates = [
      address.suburb,
      address.neighbourhood,
      address.residential,
      address.village,
      address.town,
      address.city_district,
      address.county,
      address.state_district,
    ].filter(Boolean) as string[];

    console.log(
      `[AreaResolver] Nominatim candidates for (${latitude.toFixed(4)}, ${longitude.toFixed(4)}):`,
      candidates
    );

    for (const candidate of candidates) {
      const match = fuzzyMatchArea(candidate, areas);
      if (match) {
        console.log(
          `[AreaResolver] Matched "${candidate}" → ${match.area_id} (score: ${match.base_score})`
        );
        
        lastResolvedLat = latitude;
        lastResolvedLon = longitude;
        lastResolvedAreaId = match.area_id;
        lastResolvedTime = Date.now();
        
        return match.area_id;
      }
    }

    console.warn(
      "[AreaResolver] No area match found for candidates:",
      candidates
    );
    
    lastResolvedLat = latitude;
    lastResolvedLon = longitude;
    lastResolvedAreaId = null;
    lastResolvedTime = Date.now();
    
    return null;
  } catch (error) {
    console.warn("[AreaResolver] resolveAreaFromLocation failed:", error);
    return null;
  }
}
