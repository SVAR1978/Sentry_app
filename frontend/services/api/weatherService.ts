import Constants from "expo-constants";

const OPENWEATHER_API_KEY: string =
  Constants.expoConfig?.extra?.openWeatherKey ?? "";

const OPENWEATHER_API_URL: string =
  "https://api.openweathermap.org/data/2.5/weather";

const WEATHER_FETCH_TIMEOUT: number =
  Number(Constants.expoConfig?.extra?.weatherFetchTimeout ?? 8000);



import { LocationCoordinate } from "../maps/locationService";

export interface WeatherData {
  temperature: number; // in Celsius
  condition: string; // e.g., "Sunny", "Cloudy", "Rainy"
  description: string; // e.g., "clear sky", "few clouds"
  icon: string; // weather icon name for MaterialCommunityIcons
  humidity: number; // percentage
  windSpeed: number; // m/s
  feelsLike: number; // in Celsius
  precipitationMm: number; // rain/snow in mm during latest hour bucket
  visibilityKm: number | null; // in km
  city: string;
  country: string;
}

// OpenWeatherMap API - now loaded from environment variables
const OPENWEATHER_API = OPENWEATHER_API_URL;
const OPENWEATHER_KEY = OPENWEATHER_API_KEY || "";
const FETCH_TIMEOUT = WEATHER_FETCH_TIMEOUT; // 8 seconds


// Helper function to fetch with timeout
const fetchWithTimeout = async (
  url: string,
  timeout: number = FETCH_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
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



// Map OpenWeatherMap icons to MaterialCommunityIcons
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: Record<string, string> = {
    "01d": "Sun",
    "01n": "Moon",
    "02d": "CloudSun",
    "02n": "CloudMoon",
    "03d": "Cloud",
    "03n": "Cloud",
    "04d": "Cloud",
    "04n": "Cloud",
    "09d": "CloudRain",
    "09n": "CloudRain",
    "10d": "CloudRain",
    "10n": "CloudRain",
    "11d": "CloudLightning",
    "11n": "CloudLightning",
    "13d": "Snowflake",
    "13n": "Snowflake",
    "50d": "CloudFog",
    "50n": "CloudFog",
  };
  return iconMap[iconCode] || "Cloud";
};

const getWeatherAdvice = (condition: string, temp: number): string => {
  const lowerCondition = condition.toLowerCase();

  if (lowerCondition.includes("clear") && temp >= 20 && temp <= 30)
    return "Perfect weather for sightseeing!";
  if (lowerCondition.includes("clear") && temp > 30)
    return "Hot & sunny - stay hydrated!";
  if (lowerCondition.includes("clear") && temp < 20)
    return "Cool & clear - enjoy your day!";
  if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle"))
    return "Rainy - carry an umbrella!";
  if (lowerCondition.includes("snow")) return "Snowy - dress warmly!";
  if (lowerCondition.includes("storm") || lowerCondition.includes("thunder"))
    return "Thunderstorm - stay indoors!";
  if (lowerCondition.includes("cloud")) return "Nice weather for exploring!";
  return "Check conditions before heading out!";
};

// Fetch weather using OpenWeatherMap
export const getWeatherByLocation = async (
  location: LocationCoordinate,
): Promise<WeatherData> => {
  try {
    const url = `${OPENWEATHER_API}?lat=${location.latitude}&lon=${location.longitude}&appid=${OPENWEATHER_KEY}&units=metric`;

    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      console.warn(`Weather API failed with status: ${response.status}`);
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();

    const rain1h = Number(data?.rain?.["1h"] ?? 0);
    const rain3h = Number(data?.rain?.["3h"] ?? 0);
    const snow1h = Number(data?.snow?.["1h"] ?? 0);
    const snow3h = Number(data?.snow?.["3h"] ?? 0);
    const precipitationMm = Math.max(rain1h, rain3h / 3, snow1h, snow3h / 3, 0);
    const visibilityKm =
      typeof data?.visibility === "number"
        ? Math.round((data.visibility / 1000) * 10) / 10
        : null;

    const weatherData: WeatherData = {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: getWeatherAdvice(data.weather[0].main, data.main.temp),
      icon: getWeatherIcon(data.weather[0].icon),
      humidity: Math.round(data.main.humidity),
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      feelsLike: Math.round(data.main.feels_like),
      precipitationMm,
      visibilityKm,
      city: data.name || "Current Location",
      country: data.sys?.country || "",
    };

    return weatherData;
  } catch (error: any) {
    // Silently handle errors and return fallback data
    if (error.message === "Request timeout") {
      console.warn("Weather request timed out");
    } else if (error.message === "Network request failed") {
      console.warn("Network unavailable for weather");
    } else {
      console.warn("Weather fetch warning:", error.message || error);
    }

    // Return default/fallback data
    return {
      temperature: 25,
      condition: "Partly Cloudy",
      description: "Weather data unavailable",
      icon: "CloudSun",
      humidity: 60,
      windSpeed: 5,
      feelsLike: 25,
      precipitationMm: 0,
      visibilityKm: null,
      city: "Current Location",
      country: "",
    };
  }
};

// Cache weather data to avoid excessive API calls
let weatherCache: {
  data: WeatherData | null;
  timestamp: number;
  location: LocationCoordinate | null;
} = {
  data: null,
  timestamp: 0,
  location: null,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const LOCATION_THRESHOLD = 1000; // 1km in meters

const calculateDistance = (
  loc1: LocationCoordinate,
  loc2: LocationCoordinate,
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const getCachedWeather = async (
  location: LocationCoordinate,
): Promise<WeatherData> => {
  const now = Date.now();
  const isCacheValid =
    weatherCache.data &&
    weatherCache.location &&
    now - weatherCache.timestamp < CACHE_DURATION &&
    calculateDistance(location, weatherCache.location) < LOCATION_THRESHOLD;

  if (isCacheValid) {
    return weatherCache.data!;
  }

  // Fetch new data
  const weatherData = await getWeatherByLocation(location);

  // Update cache
  weatherCache = {
    data: weatherData,
    timestamp: now,
    location,
  };

  return weatherData;
};
