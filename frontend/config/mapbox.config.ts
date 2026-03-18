const DEFAULT_COUNTRY_CODE: string =
  process.env.EXPO_PUBLIC_DEFAULT_COUNTRY_CODE ?? "IN";

const DEFAULT_LATITUDE: number =
  Number(process.env.EXPO_PUBLIC_DEFAULT_LATITUDE);

const DEFAULT_LONGITUDE: number =
  Number(process.env.EXPO_PUBLIC_DEFAULT_LONGITUDE);

const MAPBOX_ACCESS_TOKEN: string =
  process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

const MAPBOX_API_URL: string =
  process.env.EXPO_PUBLIC_MAPBOX_API_URL ?? "https://api.mapbox.com";


export const MAPBOX_CONFIG = {
  // Access token from environment variable
  ACCESS_TOKEN: MAPBOX_ACCESS_TOKEN || "",

  // API endpoints
  GEOCODING_API: `${MAPBOX_API_URL || "https://api.mapbox.com"}/geocoding/v5`,
  DIRECTIONS_API: `${MAPBOX_API_URL || "https://api.mapbox.com"}/directions/v5`,

  // Default configuration from environment
  DEFAULT_PROXIMITY: `${DEFAULT_LONGITUDE},${DEFAULT_LATITUDE}`,
  DEFAULT_COUNTRY: DEFAULT_COUNTRY_CODE, // India
  MAX_RESULTS: 15,
};
console.log("TOKEN:", MAPBOX_ACCESS_TOKEN);
console.log("GEOCODING URL:", MAPBOX_CONFIG.GEOCODING_API);

// Validate if token is configured
export const isMapboxConfigured = (): boolean => {
  return (
    MAPBOX_CONFIG.ACCESS_TOKEN !== "" &&
    !MAPBOX_CONFIG.ACCESS_TOKEN.includes("example") &&
    MAPBOX_CONFIG.ACCESS_TOKEN.startsWith("pk.")
  );
};
