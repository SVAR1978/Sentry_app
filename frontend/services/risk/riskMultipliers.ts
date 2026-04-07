const FESTIVAL_BONUSES: Record<string, number> = {
  "10-24": 12,
  "3-25": 10,
  "12-31": 8,
  "1-26": 6,
  "8-15": 6,
};

export interface MultiplierWeatherData {
  humidity?: number | null;
  precipitation_mm?: number | null;
  visibility_km?: number | null;
  month?: number;
}

export interface AppliedRiskResult {
  base_score: number;
  final_score: number;
  risk_level: "Low" | "Medium" | "High";
  breakdown: {
    time: number;
    weather: number;
    aqi: number;
    festival: number;
    weekend: number;
    season: number;
  };
}

export function getTimeBonus(hour: number): number {
  if (hour >= 23 || hour < 4) return 20;
  if (hour < 7) return 10;
  if (hour < 16) return -5;
  if (hour < 20) return 5;
  return 15;
}

export function getWeatherBonus(weatherData: MultiplierWeatherData = {}): number {
  let bonus = 0;

  const humidity = Number(weatherData.humidity ?? 0);
  const precipitation = Number(weatherData.precipitation_mm ?? 0);
  const month = Number(weatherData.month ?? 0);
  const visibilityKm = Number(weatherData.visibility_km ?? Number.NaN);

  if ((month >= 12 || month <= 2) && humidity > 85) {
    bonus += 10;
  }

  if (precipitation > 10) {
    bonus += 8;
  } else if (precipitation > 2.5) {
    bonus += 4;
  }

  if (!Number.isNaN(visibilityKm) && visibilityKm > 0 && visibilityKm < 1.5) {
    bonus += 6;
  }

  return bonus;
}

export function getAqiBonus(aqi: number | null | undefined): number {
  const value = Number(aqi ?? 0);
  if (!Number.isFinite(value)) return 0;

  if (value > 300) return 15;
  if (value > 200) return 10;
  if (value > 150) return 5;
  return 0;
}

function clampScore(score: number): number {
  return Math.min(Math.max(score, 0), 100);
}

export function applyMultipliers(
  baseScore: number,
  datetime?: Date,
  weatherData: MultiplierWeatherData = {},
  aqi?: number | null
): AppliedRiskResult {
  const now = datetime || new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const timeBonus = getTimeBonus(hour);
  const weatherBonus = getWeatherBonus({ ...weatherData, month });
  const aqiBonus = getAqiBonus(aqi);
  const festivalKey = `${month}-${day}`;
  const festivalBonus = FESTIVAL_BONUSES[festivalKey] || 0;
  const weekendBonus = [0, 6].includes(now.getDay()) ? 5 : 0;
  const seasonBonus = [10, 11, 3].includes(month) ? 4 : 0;

  const totalBonus =
    timeBonus +
    weatherBonus +
    aqiBonus +
    festivalBonus +
    weekendBonus +
    seasonBonus;

  const finalScore = clampScore(baseScore + totalBonus);

  return {
    base_score: baseScore,
    final_score: Math.round(finalScore),
    risk_level: finalScore > 55 ? "High" : finalScore > 30 ? "Medium" : "Low",
    breakdown: {
      time: timeBonus,
      weather: weatherBonus,
      aqi: aqiBonus,
      festival: festivalBonus,
      weekend: weekendBonus,
      season: seasonBonus,
    },
  };
}
