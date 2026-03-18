import { LocationCoordinate } from "./locationService";

const ENV_FETCH_TIMEOUT: number = Number(
  process.env.EXPO_PUBLIC_FETCH_TIMEOUT ?? 15000
);

// ============ API URLS (All Free) ============
const PHOTON_API = process.env.EXPO_PUBLIC_PHOTON_API ?? "https://photon.komoot.io";
const OSRM_API = process.env.EXPO_PUBLIC_OSRM_API ?? "https://router.project-osrm.org";
const OVERPASS_API = process.env.EXPO_PUBLIC_OVERPASS_API ?? "https://overpass-api.de/api/interpreter";
const FETCH_TIMEOUT = ENV_FETCH_TIMEOUT;

// India bounding box for Photon (lon_min,lat_min,lon_max,lat_max)
const INDIA_BBOX = "68.7,6.5,97.4,35.5";

// ============ HELPER ============

const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = FETCH_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timeout");
    }
    throw error;
  }
};

// ============ TYPES ============

export interface SearchResult {
  id: string;
  name: string;
  displayName: string;
  coordinate: LocationCoordinate;
  type: string;
  category: string;
  icon?: string;
}

export interface RouteStep {
  instruction: string;
  distance: number; // meters
  duration: number; // seconds
  maneuver: string;
  name: string;
}

export interface RouteInfo {
  coordinates: LocationCoordinate[]; // polyline points
  distance: number; // total meters
  duration: number; // total seconds
  steps: RouteStep[];
  summary: string;
}

// ============ PLACES SEARCH (Photon by Komoot - Free) ============

// Search places anywhere in India
export const searchPlaces = async (
  query: string,
  latitude?: number,
  longitude?: number
): Promise<SearchResult[]> => {
  try {
    // Use Delhi center as default proximity bias
    const lat = latitude ?? 28.6139;
    const lon = longitude ?? 77.209;

    const url =
      `${PHOTON_API}/api/?` +
      `q=${encodeURIComponent(query)}` +
      `&limit=15` +
      `&lang=en` +
      `&lat=${lat}` +
      `&lon=${lon}` +
      `&bbox=${INDIA_BBOX}`;

    console.log(`🔍 Photon search: "${query}"`);

    const response = await fetchWithTimeout(url, {}, FETCH_TIMEOUT);

    if (!response.ok) {
      console.warn(`Photon search failed (${response.status})`);
      return [];
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.log(`No results for "${query}"`);
      return [];
    }

    console.log(`✅ Found ${data.features.length} results for "${query}"`);

    return data.features.map((item: any) => {
      const props = item.properties || {};
      const coords = item.geometry?.coordinates || [0, 0];

      // Build a readable display name from Photon properties
      const nameParts = [
        props.name,
        props.street,
        props.city || props.district,
        props.state,
      ].filter(Boolean);

      return {
        id: `photon_${props.osm_id || Math.random()}`,
        name: props.name || props.city || query,
        displayName: nameParts.join(", "),
        coordinate: {
          latitude: coords[1],
          longitude: coords[0],
        },
        type: props.type || props.osm_value || "place",
        category: props.osm_key || "place",
        icon: mapPhotonCategoryToIcon(props.osm_key, props.osm_value),
      };
    });
  } catch (error: any) {
    if (error.message === "Request timeout") {
      console.warn("Search request timed out");
    } else if (error.message === "Network request failed") {
      console.warn("Network unavailable for search");
    } else {
      console.warn("Search error:", error.message || error);
    }
    return [];
  }
};

// Search specifically for tourist places near Delhi
export const searchTouristPlaces = async (
  query: string,
  latitude?: number,
  longitude?: number
): Promise<SearchResult[]> => {
  const [touristResults, generalResults] = await Promise.all([
    searchPlaces(`${query} tourist`, latitude, longitude),
    searchPlaces(query, latitude, longitude),
  ]);

  // Merge and deduplicate
  const allResults = [...touristResults];
  const ids = new Set(allResults.map((r) => r.id));
  for (const r of generalResults) {
    if (!ids.has(r.id)) {
      allResults.push(r);
      ids.add(r.id);
    }
  }

  return allResults.slice(0, 15);
};

// Search for nearby places using OpenStreetMap Overpass API (Free)
export const searchNearbyPlaces = async (
  location: LocationCoordinate,
  radius: number = 5000,
  types?: string[]
): Promise<SearchResult[]> => {
  try {
    const searchTypes = types || [
      "hospital",
      "police",
      "tourism",
      "attraction",
      "hotel",
      "restaurant",
    ];

    console.log(`🗺️ Searching OpenStreetMap for: ${searchTypes.join(", ")}`);
    console.log(
      `📍 Location: ${location.latitude}, ${location.longitude}, radius: ${radius}m`
    );

    const typeOSMMap: Record<string, string[]> = {
      hospital: ["amenity=hospital", "amenity=clinic", "amenity=doctors"],
      police: ["amenity=police"],
      tourism: ["tourism=museum", "tourism=attraction", "tourism=monument"],
      attraction: ["tourism=attraction", "historic=monument", "tourism=museum"],
      hotel: ["tourism=hotel", "tourism=guest_house"],
      restaurant: ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
    };

    const searchPromises = searchTypes.map(async (type) => {
      try {
        const osmTags = typeOSMMap[type] || [`tourism=${type}`];

        const queries = osmTags
          .map(
            (tag) =>
              `node[${tag}](around:${radius},${location.latitude},${location.longitude});`
          )
          .join("\n");
        const overpassQuery = `[out:json][timeout:10];(${queries});out body;>;out skel qt;`;

        const response = await fetchWithTimeout(
          OVERPASS_API,
          {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(overpassQuery)}`,
          },
          15000
        );

        if (!response.ok) {
          console.warn(`OSM ${type} search failed (${response.status})`);
          return [];
        }

        const data = await response.json();

        if (!data.elements || data.elements.length === 0) {
          console.log(`No ${type} results from OSM`);
          return [];
        }

        console.log(`✅ Found ${data.elements.length} ${type} from OSM`);

        return data.elements
          .filter((item: any) => item.lat && item.lon && item.tags?.name)
          .map((item: any) => ({
            id: `osm_${item.id}`,
            name: item.tags.name || type,
            displayName: [
              item.tags.name,
              item.tags["addr:street"],
              item.tags["addr:city"] || item.tags["addr:suburb"],
            ]
              .filter(Boolean)
              .join(", "),
            coordinate: {
              latitude: item.lat,
              longitude: item.lon,
            },
            type,
            category: item.tags.amenity || item.tags.tourism || type,
            icon: mapOSMCategoryToIcon(item.tags, type),
          }));
      } catch (err: any) {
        console.warn(`Error searching ${type} on OSM:`, err.message || err);
        return [];
      }
    });

    const results = await Promise.allSettled(searchPromises);
    const allPlaces = results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r: any) => r.value);

    // Deduplicate
    const uniquePlaces = Array.from(
      new Map(allPlaces.map((p: any) => [p.id, p])).values()
    );

    // Sort by distance
    const placesWithDistance = (uniquePlaces as SearchResult[])
      .map((place) => {
        const dx = (place.coordinate.latitude - location.latitude) * 111000;
        const dy =
          (place.coordinate.longitude - location.longitude) *
          111000 *
          Math.cos((location.latitude * Math.PI) / 180);
        const distance = Math.sqrt(dx * dx + dy * dy);
        return { ...place, distance };
      })
      .filter((p) => p.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    console.log(`📍 Returning ${placesWithDistance.length} nearby places`);
    return placesWithDistance.slice(0, 20);
  } catch (error: any) {
    console.error("❌ searchNearbyPlaces error:", error.message || error);
    return [];
  }
};

// ============ ICON MAPPERS ============

// Map Photon osm_key/osm_value to MaterialCommunityIcons
const mapPhotonCategoryToIcon = (
  osmKey: string | undefined,
  osmValue: string | undefined
): string => {
  const key = osmKey?.toLowerCase() || "";
  const value = osmValue?.toLowerCase() || "";

  if (key === "amenity") {
    if (value.includes("hospital") || value.includes("clinic") || value.includes("doctors"))
      return "hospital-building";
    if (value.includes("police")) return "police-badge";
    if (value.includes("restaurant") || value.includes("cafe") || value.includes("fast_food"))
      return "food";
    if (value.includes("pharmacy")) return "pill";
    if (value.includes("bank")) return "bank";
    if (value.includes("school") || value.includes("university")) return "school";
  }
  if (key === "tourism") {
    if (value.includes("hotel") || value.includes("guest_house")) return "bed";
    if (value.includes("museum") || value.includes("attraction") || value.includes("monument"))
      return "camera";
    if (value.includes("viewpoint")) return "binoculars";
  }
  if (key === "historic") return "monument";
  if (key === "leisure" && value.includes("park")) return "tree";
  if (key === "natural") return "terrain";
  if (key === "railway" || key === "public_transport") return "train";

  return "map-marker";
};

const mapOSMCategoryToIcon = (tags: any, placeType: string): string => {
  const amenity = tags?.amenity?.toLowerCase() || "";
  const tourism = tags?.tourism?.toLowerCase() || "";
  const historic = tags?.historic?.toLowerCase() || "";

  if (amenity.includes("hospital") || amenity.includes("clinic") || amenity.includes("doctors"))
    return "hospital-building";
  if (amenity.includes("police")) return "police-badge";
  if (amenity.includes("restaurant") || amenity.includes("cafe") || amenity.includes("fast_food"))
    return "food";
  if (amenity.includes("pharmacy")) return "pill";
  if (amenity.includes("bank")) return "bank";
  if (tourism.includes("hotel") || tourism.includes("guest_house")) return "bed";
  if (tourism.includes("museum") || tourism.includes("attraction") || tourism.includes("monument"))
    return "camera";
  if (tourism.includes("viewpoint")) return "binoculars";
  if (historic.includes("monument") || historic.includes("memorial")) return "monument";
  if (historic.includes("castle")) return "castle";

  if (placeType === "hospital") return "hospital-building";
  if (placeType === "police") return "police-badge";
  if (placeType === "restaurant") return "food";
  if (placeType === "hotel") return "bed";
  if (placeType === "tourism" || placeType === "attraction") return "camera";

  return "map-marker";
};

// ============ DIRECTIONS / ROUTING (OSRM - Free) ============

// Get directions between two points using OSRM
export const getDirections = async (
  origin: LocationCoordinate,
  destination: LocationCoordinate,
  profile: "driving" | "walking" | "cycling" = "driving"
): Promise<RouteInfo | null> => {
  try {
    const url =
      `${OSRM_API}/route/v1/${profile}/` +
      `${origin.longitude},${origin.latitude};` +
      `${destination.longitude},${destination.latitude}?` +
      `steps=true` +
      `&geometries=geojson` +
      `&overview=full` +
      `&annotations=false`;

    console.log(`🗺️ OSRM directions: ${profile}`);

    const response = await fetchWithTimeout(url, {}, 12000);

    if (!response.ok) {
      console.warn(`OSRM directions failed: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      console.warn("No routes found");
      return null;
    }

    const route = data.routes[0];

    // Decode GeoJSON coordinates
    const coordinates: LocationCoordinate[] = route.geometry.coordinates.map(
      (coord: number[]) => ({
        latitude: coord[1],
        longitude: coord[0],
      })
    );

    // Parse steps from OSRM
    const steps: RouteStep[] = route.legs[0].steps.map((step: any) => ({
      instruction:
        step.maneuver?.instruction ||
        formatOSRMInstruction(step.maneuver, step.name),
      distance: step.distance,
      duration: step.duration,
      maneuver: step.maneuver?.type || "straight",
      name: step.name || "Unknown Road",
    }));

    const distanceKm = (route.distance / 1000).toFixed(1);
    const durationMin = Math.round(route.duration / 60);

    return {
      coordinates,
      distance: route.distance,
      duration: route.duration,
      steps,
      summary: `${distanceKm} km · ${durationMin} min`,
    };
  } catch (error: any) {
    if (error.message === "Request timeout") {
      console.warn("Directions request timed out");
    } else if (error.message === "Network request failed") {
      console.warn("Network unavailable for directions");
    } else {
      console.warn("Directions error:", error.message || error);
    }
    return null;
  }
};

// Format OSRM maneuver into readable instruction
const formatOSRMInstruction = (maneuver: any, roadName: string): string => {
  if (!maneuver) return "Continue";
  const type = maneuver.type || "";
  const modifier = maneuver.modifier || "";
  const road = roadName ? `onto ${roadName}` : "";

  switch (type) {
    case "turn":
      return `Turn ${modifier} ${road}`.trim();
    case "depart":
      return `Head ${modifier} ${road}`.trim();
    case "arrive":
      return "You have arrived at your destination";
    case "merge":
      return `Merge ${modifier} ${road}`.trim();
    case "roundabout":
      return `Enter the roundabout ${road}`.trim();
    case "exit roundabout":
      return `Exit the roundabout ${road}`.trim();
    case "fork":
      return `Keep ${modifier} at the fork ${road}`.trim();
    case "end of road":
      return `Turn ${modifier} at the end of the road ${road}`.trim();
    default:
      return `Continue ${road}`.trim() || "Continue";
  }
};

// ============ UTILITIES ============

// Format duration for display
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
};

// Test Photon connection
export const testPhotonConnection = async (): Promise<boolean> => {
  try {
    console.log("🧪 Testing Photon connection...");

    const url = `${PHOTON_API}/api/?q=Delhi&limit=1&lang=en`;

    const response = await fetchWithTimeout(url, {}, 5000);

    if (!response.ok) {
      console.error("❌ Photon test failed:", response.status);
      return false;
    }

    const data = await response.json();
    if (data.features && data.features.length > 0) {
      console.log("✅ Photon connection successful!");
      console.log(`   Found: ${data.features[0].properties?.name}`);
      return true;
    }

    console.warn("⚠️ Photon responded but no results");
    return false;
  } catch (error: any) {
    console.error("❌ Photon test error:", error.message || error);
    return false;
  }
};

// Test OSRM connection
export const testOSRMConnection = async (): Promise<boolean> => {
  try {
    console.log("🧪 Testing OSRM connection...");

    // Test route: India Gate to Red Fort (Delhi)
    const url =
      `${OSRM_API}/route/v1/driving/` +
      `77.2295,28.6129;77.2410,28.6562` +
      `?overview=false`;

    const response = await fetchWithTimeout(url, {}, 5000);

    if (!response.ok) {
      console.error("❌ OSRM test failed:", response.status);
      return false;
    }

    const data = await response.json();
    if (data.routes && data.routes.length > 0) {
      console.log("✅ OSRM connection successful!");
      console.log(`   Route: ${(data.routes[0].distance / 1000).toFixed(1)}km`);
      return true;
    }

    console.warn("⚠️ OSRM responded but no routes");
    return false;
  } catch (error: any) {
    console.error("❌ OSRM test error:", error.message || error);
    return false;
  }
};