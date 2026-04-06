type Position = [number, number];
type LinearRing = Position[];
type PolygonCoordinates = LinearRing[];
type MultiPolygonCoordinates = PolygonCoordinates[];

interface BoundaryFeature {
  geometry?: {
    type?: "Polygon" | "MultiPolygon";
    coordinates?: PolygonCoordinates | MultiPolygonCoordinates;
  };
  properties?: {
    POL_STN_NM?: string;
    area_id?: string;
    DIST_NM?: string;
    [key: string]: unknown;
  };
}

interface BoundaryFeatureCollection {
  type: "FeatureCollection";
  features: BoundaryFeature[];
}

interface LocationFeature {
  geometry?: {
    type?: "Point";
    coordinates?: Position;
  };
  properties?: {
    NAME?: string;
    POL_STN_NM?: string;
    DISTRICT?: string;
    DIST_NM?: string;
    [key: string]: unknown;
  };
}

interface LocationFeatureCollection {
  type: "FeatureCollection";
  features: LocationFeature[];
}

interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

interface PreparedPolygon {
  id: string;
  areaId: string;
  rings: LinearRing;
  holes: LinearRing[];
  bbox: BoundingBox;
}

export interface AreaBoundaryPolygon {
  id: string;
  areaId: string;
  coordinates: { latitude: number; longitude: number }[];
}

export interface PoliceStationLocation {
  id: string;
  areaId: string;
  name: string;
  district: string | null;
  latitude: number;
  longitude: number;
}
const POLICE_STATION_LOCATION_URL =
  process.env.EXPO_PUBLIC_POLICE_STATION_LOCATION_URL;

const POLICE_STATION_BOUNDARY_URL =
  process.env.EXPO_PUBLIC_POLICE_STATION_BOUNDARY_URL;

const FETCH_TIMEOUT_MS = Number(process.env.EXPO_PUBLIC_FETCH_TIMEOUT ?? 15000);

let preparedPolygonsPromise: Promise<PreparedPolygon[]> | null = null;
let boundaryPolygonsPromise: Promise<AreaBoundaryPolygon[]> | null = null;
let stationLocationsPromise: Promise<PoliceStationLocation[]> | null = null;

export function normalizeAreaId(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, " ");
}

async function fetchJsonWithTimeout<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url} (status ${response.status})`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Timed out fetching ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function isFeatureCollection(value: unknown): value is { type: string; features: unknown[] } {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { type?: unknown }).type === "FeatureCollection" &&
    Array.isArray((value as { features?: unknown }).features)
  );
}

async function fetchBoundaryData(): Promise<BoundaryFeatureCollection> {
  const data = await fetchJsonWithTimeout<unknown>(POLICE_STATION_BOUNDARY_URL);
  if (!isFeatureCollection(data)) {
    throw new Error("Police boundary GeoJSON is invalid or not a FeatureCollection");
  }

  return data as BoundaryFeatureCollection;
}

async function fetchLocationData(): Promise<LocationFeatureCollection> {
  const data = await fetchJsonWithTimeout<unknown>(POLICE_STATION_LOCATION_URL);
  if (!isFeatureCollection(data)) {
    throw new Error("Police location GeoJSON is invalid or not a FeatureCollection");
  }

  return data as LocationFeatureCollection;
}

function getBoundingBox(ring: LinearRing): BoundingBox {
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;

  for (const [lon, lat] of ring) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
  }

  return { minLat, maxLat, minLon, maxLon };
}

function isInsideBoundingBox(lat: number, lon: number, bbox: BoundingBox): boolean {
  return (
    lat >= bbox.minLat &&
    lat <= bbox.maxLat &&
    lon >= bbox.minLon &&
    lon <= bbox.maxLon
  );
}

function pointInRing(lat: number, lon: number, ring: LinearRing): boolean {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersects =
      yi > lat !== yj > lat &&
      lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInPolygon(lat: number, lon: number, polygon: PreparedPolygon): boolean {
  if (!pointInRing(lat, lon, polygon.rings)) {
    return false;
  }

  for (const hole of polygon.holes) {
    if (pointInRing(lat, lon, hole)) {
      return false;
    }
  }

  return true;
}

function preparePolygons(boundaryData: BoundaryFeatureCollection): PreparedPolygon[] {
  const prepared: PreparedPolygon[] = [];
  const features = Array.isArray(boundaryData?.features) ? boundaryData.features : [];

  features.forEach((feature, featureIndex) => {
    const rawAreaId =
      typeof feature.properties?.POL_STN_NM === "string"
        ? feature.properties.POL_STN_NM
        : typeof feature.properties?.area_id === "string"
          ? feature.properties.area_id
          : "";

    if (!rawAreaId) {
      return;
    }

    const areaId = normalizeAreaId(rawAreaId);
    const geometryType = feature.geometry?.type;

    if (geometryType === "Polygon") {
      const coordinates = feature.geometry?.coordinates as PolygonCoordinates;
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return;
      }

      const outerRing = coordinates[0];
      if (!outerRing || outerRing.length < 3) {
        return;
      }

      prepared.push({
        id: `${areaId}-${featureIndex}-0`,
        areaId,
        rings: outerRing,
        holes: coordinates.slice(1),
        bbox: getBoundingBox(outerRing),
      });
      return;
    }

    if (geometryType === "MultiPolygon") {
      const coordinates = feature.geometry?.coordinates as MultiPolygonCoordinates;
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return;
      }

      coordinates.forEach((polygon, polygonIndex) => {
        if (!Array.isArray(polygon) || polygon.length === 0) {
          return;
        }

        const outerRing = polygon[0];
        if (!outerRing || outerRing.length < 3) {
          return;
        }

        prepared.push({
          id: `${areaId}-${featureIndex}-${polygonIndex}`,
          areaId,
          rings: outerRing,
          holes: polygon.slice(1),
          bbox: getBoundingBox(outerRing),
        });
      });
    }
  });

  return prepared;
}

function buildAreaBoundaryPolygons(preparedPolygons: PreparedPolygon[]): AreaBoundaryPolygon[] {
  return preparedPolygons.map((polygon) => ({
    id: polygon.id,
    areaId: polygon.areaId,
    coordinates: polygon.rings.map(([lon, lat]) => ({
      latitude: lat,
      longitude: lon,
    })),
  }));
}

function parsePoliceStationLocations(data: LocationFeatureCollection): PoliceStationLocation[] {
  const features = Array.isArray(data?.features) ? data.features : [];
  const stations: PoliceStationLocation[] = [];

  features.forEach((feature, index) => {
    if (feature.geometry?.type !== "Point") {
      return;
    }

    const coordinates = feature.geometry.coordinates;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return;
    }

    const [lon, lat] = coordinates;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      return;
    }

    const rawName =
      typeof feature.properties?.NAME === "string"
        ? feature.properties.NAME
        : typeof feature.properties?.POL_STN_NM === "string"
          ? feature.properties.POL_STN_NM
          : "";

    if (!rawName) {
      return;
    }

    const normalizedName = normalizeAreaId(rawName);
    const district =
      typeof feature.properties?.DISTRICT === "string"
        ? feature.properties.DISTRICT
        : typeof feature.properties?.DIST_NM === "string"
          ? feature.properties.DIST_NM
          : null;

    stations.push({
      id: `${normalizedName}-${index}`,
      areaId: normalizedName,
      name: rawName.trim(),
      district,
      latitude: lat,
      longitude: lon,
    });
  });

  return stations;
}

async function getPreparedPolygons(): Promise<PreparedPolygon[]> {
  if (!preparedPolygonsPromise) {
    preparedPolygonsPromise = fetchBoundaryData()
      .then((boundaryData) => preparePolygons(boundaryData))
      .catch((error) => {
        preparedPolygonsPromise = null;
        throw error;
      });
  }

  return preparedPolygonsPromise;
}

export async function getAreaId(
  userLat: number,
  userLon: number
): Promise<string | null> {
  const preparedPolygons = await getPreparedPolygons();

  for (const polygon of preparedPolygons) {
    if (!isInsideBoundingBox(userLat, userLon, polygon.bbox)) {
      continue;
    }

    if (pointInPolygon(userLat, userLon, polygon)) {
      return polygon.areaId;
    }
  }

  return null;
}

export async function getAreaBoundaryPolygons(): Promise<AreaBoundaryPolygon[]> {
  if (!boundaryPolygonsPromise) {
    boundaryPolygonsPromise = getPreparedPolygons()
      .then((preparedPolygons) => buildAreaBoundaryPolygons(preparedPolygons))
      .catch((error) => {
        boundaryPolygonsPromise = null;
        throw error;
      });
  }

  return boundaryPolygonsPromise;
}

export async function getPoliceStationLocations(): Promise<PoliceStationLocation[]> {
  if (!stationLocationsPromise) {
    stationLocationsPromise = fetchLocationData()
      .then((locationData) => parsePoliceStationLocations(locationData))
      .catch((error) => {
        stationLocationsPromise = null;
        throw error;
      });
  }

  return stationLocationsPromise;
}
