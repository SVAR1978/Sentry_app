import express from "express";
import type { Request, Response } from "express";
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { applyMultipliers, MultiplierWeatherData } from "../services/riskMultipliers.js";
import { getWeatherByLocation } from "../services/weatherService.js";

const router = express.Router();

const AWS_RISK_BASE_URL = (process.env.AWS_RISK_BASE_URL ?? "").replace(
  /[/.]+$/,
  ""
);

const AWS_RISK_TIMEOUT_MS = Number(process.env.AWS_RISK_TIMEOUT_MS ?? 5000);

interface AreaBaseScore {
  area_id: string;
  base_score: number;
  risk_category: string;
}

interface AreasScoreResponse {
  areas: AreaBaseScore[];
  total: number;
}

interface AreaBaseRiskResponse {
  area_id: string;
  base_risk: {
    score: number;
    category: string;
    source?: string;
  };
}

function forwardAxiosError(error: unknown, res: Response, fallbackMessage: string) {
  const maybeAxiosError = error as {
    response?: { status?: number; data?: unknown };
    message?: string;
  };

  const status = maybeAxiosError?.response?.status;
  const data = maybeAxiosError?.response?.data;

  if (typeof status === "number") {
    return res
      .status(status)
      .json(data || { message: fallbackMessage });
  }

  const message =
    error instanceof Error
      ? error.message
      : maybeAxiosError?.message || fallbackMessage;
  return res.status(502).json({ message });
}

// ── Local Fallback for ML Data ──
let featureStoreCache: Record<string, any> | null = null;
async function getFeatureStoreData() {
  if (featureStoreCache) return featureStoreCache;
  const filePath = path.resolve(process.cwd(), "../../ml/processed/feature_store.json");
  try {
    const rawData = await fs.readFile(filePath, "utf-8");
    const jsonStr = JSON.parse(rawData);
    // Convert array to index
    featureStoreCache = {};
    for (const item of jsonStr) {
      if (item.area_id) featureStoreCache[item.area_id] = item;
    }
  } catch (err) {
    console.warn(`[RiskScores] Local feature_store.json not found at ${filePath}. Make sure ML pipeline is built.`);
    featureStoreCache = {};
  }
  return featureStoreCache;
}

router.get("/areas", async (_req: Request, res: Response) => {
  if (!AWS_RISK_BASE_URL) {
    // Local processing fallback
    const store = await getFeatureStoreData();
    const areas = Object.values(store).map((v: any) => ({
      area_id: v.area_id,
      base_score: v.base_score,
      risk_category: v.risk_category,
    }));
    return res.json({ areas, total: areas.length });
  }

  try {
    const response = await axios.get<AreasScoreResponse>(
      `${AWS_RISK_BASE_URL}/areas/scores`,
      {
        timeout: AWS_RISK_TIMEOUT_MS,
      }
    );

    return res.json(response.data);
  } catch (error) {
    return forwardAxiosError(
      error,
      res,
      "Failed to fetch area base scores from AWS risk service"
    );
  }
});

router.post("/area", async (req: Request, res: Response) => {
  const areaId = req.body?.area_id;
  const latitude = req.body?.latitude;
  const longitude = req.body?.longitude;

  if (!areaId || typeof areaId !== "string") {
    return res.status(400).json({ message: "area_id is required" });
  }

  const normalizedAreaId = areaId.trim();
  if (!normalizedAreaId) {
    return res.status(400).json({ message: "area_id is required" });
  }

  try {
    let baseData: any;

    if (!AWS_RISK_BASE_URL) {
      // Local processing fallback
      const store = await getFeatureStoreData();
      const area = store![normalizedAreaId];
      if (!area) {
        return res.status(404).json({ message: "Area not found" });
      }
      baseData = {
        area_id: normalizedAreaId,
        base_risk: {
          score: area.base_score,
          category: area.risk_category,
          source: 'precomputed-local'
        }
      };
    } else {
      const response = await axios.post<AreaBaseRiskResponse>(
        `${AWS_RISK_BASE_URL}/score/area`,
        {
          area_id: normalizedAreaId,
        },
        {
          timeout: AWS_RISK_TIMEOUT_MS,
        }
      );
      baseData = response.data;
    }

    const baseScore = baseData.base_risk?.score ?? 0;

    let finalResult: any = baseData;

    if (typeof latitude === "number" && typeof longitude === "number") {
      const weather = await getWeatherByLocation(latitude, longitude);
      let weatherData: MultiplierWeatherData = {};
      
      if (weather) {
        weatherData = {
          humidity: weather.humidity,
          precipitation_mm: weather.precipitationMm,
          visibility_km: weather.visibilityKm,
        };
      }

      const appliedRisk = applyMultipliers(baseScore, new Date(), weatherData, null);
      
      finalResult = {
        ...baseData,
        base_score: appliedRisk.base_score,
        final_score: appliedRisk.final_score,
        risk_category: appliedRisk.risk_level,
        breakdown: appliedRisk.breakdown,
      };
    }

    return res.json(finalResult);
  } catch (error) {
    return forwardAxiosError(
      error,
      res,
      "Failed to fetch single-area base risk from AWS risk service"
    );
  }
});

export default router;
