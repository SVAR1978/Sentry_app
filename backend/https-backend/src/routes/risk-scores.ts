import express from "express";
import type { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

const AWS_RISK_BASE_URL = (
  process.env.AWS_RISK_BASE_URL
).replace(/[/.]+$/, "");

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

  if (
    maybeAxiosError?.response &&
    typeof maybeAxiosError.response.status === "number"
  ) {
    const response = maybeAxiosError.response;
    return res
      .status(response.status)
      .json(response.data || { message: fallbackMessage });
  }

  const message =
    error instanceof Error
      ? error.message
      : maybeAxiosError?.message || fallbackMessage;
  return res.status(502).json({ message });
}

router.get("/areas", async (_req: Request, res: Response) => {
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

  if (!areaId || typeof areaId !== "string") {
    return res.status(400).json({ message: "area_id is required" });
  }

  const normalizedAreaId = areaId.trim();
  if (!normalizedAreaId) {
    return res.status(400).json({ message: "area_id is required" });
  }

  try {
    const response = await axios.post<AreaBaseRiskResponse>(
      `${AWS_RISK_BASE_URL}/score/area`,
      {
        area_id: normalizedAreaId,
      },
      {
        timeout: AWS_RISK_TIMEOUT_MS,
      }
    );

    return res.json(response.data);
  } catch (error) {
    return forwardAxiosError(
      error,
      res,
      "Failed to fetch single-area base risk from AWS risk service"
    );
  }
});

export default router;
