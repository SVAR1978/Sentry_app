import axios from "axios";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || "";
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
const FETCH_TIMEOUT = 8000;

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  precipitationMm: number;
  visibilityKm: number | null;
  city: string;
  country: string;
}

export const getWeatherByLocation = async (
  latitude: number,
  longitude: number
): Promise<WeatherData | null> => {
  if (!OPENWEATHER_API_KEY) {
    console.warn("OPENWEATHER_API_KEY is not configured on backend");
    return null;
  }

  try {
    const url = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await axios.get(url, { timeout: FETCH_TIMEOUT });
    const data = response.data;

    const rain1h = Number(data?.rain?.["1h"] ?? 0);
    const rain3h = Number(data?.rain?.["3h"] ?? 0);
    const snow1h = Number(data?.snow?.["1h"] ?? 0);
    const snow3h = Number(data?.snow?.["3h"] ?? 0);
    const precipitationMm = Math.max(rain1h, rain3h / 3, snow1h, snow3h / 3, 0);
    const visibilityKm =
      typeof data?.visibility === "number"
        ? Math.round((data.visibility / 1000) * 10) / 10
        : null;

    return {
      temperature: Math.round(data.main.temp),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: Math.round(data.main.humidity),
      windSpeed: Math.round(data.wind.speed * 10) / 10,
      feelsLike: Math.round(data.main.feels_like),
      precipitationMm,
      visibilityKm,
      city: data.name || "Current Location",
      country: data.sys?.country || "",
    };
  } catch (error: any) {
    console.warn("Weather fetch error on backend:", error.message);
    return null;
  }
};
