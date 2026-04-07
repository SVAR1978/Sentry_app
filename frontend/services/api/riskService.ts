const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const AWS_RISK_BASE_URL = (process.env.EXPO_PUBLIC_AWS_RISK_BASE_URL || "").replace(
  /[/.]+$/,
  ""
);

export interface AreaBaseScore {
  area_id: string;
  base_score: number;
  risk_category: string;
}

interface AreasResponse {
  areas: AreaBaseScore[];
  total: number;
}

interface SingleAreaResponse {
  area_id: string;
  base_risk?: {
    score?: number;
    category?: string;
  };
  base_score?: number;
  risk_category?: string;
}

function toMapRiskLevel(category: string): "safe" | "moderate" | "high" {
  const normalized = category.trim().toLowerCase();
  if (normalized === "high") return "high";
  if (normalized === "medium") return "moderate";
  return "safe";
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, init);
  const text = await response.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || `Risk API request failed with status ${response.status}`);
  }

  return data as T;
}

export async function fetchAllAreaBaseScores(): Promise<AreasResponse> {
  if (BACKEND_URL) {
    return requestJson<AreasResponse>(`${BACKEND_URL}/api/risk-scores/areas`);
  }

  if (AWS_RISK_BASE_URL) {
    return requestJson<AreasResponse>(`${AWS_RISK_BASE_URL}/areas/scores`);
  }

  throw new Error(
    "Neither EXPO_PUBLIC_BACKEND_URL nor EXPO_PUBLIC_AWS_RISK_BASE_URL is configured"
  );
}

export async function fetchAreaBaseScore(areaId: string): Promise<AreaBaseScore> {
  const endpoint = BACKEND_URL
    ? `${BACKEND_URL}/api/risk-scores/area`
    : AWS_RISK_BASE_URL
      ? `${AWS_RISK_BASE_URL}/score/area`
      : null;

  if (!endpoint) {
    throw new Error(
      "Neither EXPO_PUBLIC_BACKEND_URL nor EXPO_PUBLIC_AWS_RISK_BASE_URL is configured"
    );
  }

  const response = await requestJson<SingleAreaResponse>(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ area_id: areaId }),
  });

  const baseScore =
    typeof response.base_risk?.score === "number"
      ? response.base_risk.score
      : Number(response.base_score ?? 0);

  const riskCategory =
    typeof response.base_risk?.category === "string"
      ? response.base_risk.category
      : typeof response.risk_category === "string"
        ? response.risk_category
        : "Low";

  return {
    area_id: response.area_id || areaId,
    base_score: baseScore,
    risk_category: riskCategory,
  };
}

export { toMapRiskLevel };
