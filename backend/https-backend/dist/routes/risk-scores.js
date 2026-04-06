import express from "express";
import axios from "axios";
const router = express.Router();
const AWS_RISK_BASE_URL = (process.env.AWS_RISK_BASE_URL ?? "").replace(/[/.]+$/, "");
const AWS_RISK_TIMEOUT_MS = Number(process.env.AWS_RISK_TIMEOUT_MS ?? 5000);
function forwardAxiosError(error, res, fallbackMessage) {
    const maybeAxiosError = error;
    const status = maybeAxiosError?.response?.status;
    const data = maybeAxiosError?.response?.data;
    if (typeof status === "number") {
        return res
            .status(status)
            .json(data || { message: fallbackMessage });
    }
    const message = error instanceof Error
        ? error.message
        : maybeAxiosError?.message || fallbackMessage;
    return res.status(502).json({ message });
}
router.get("/areas", async (_req, res) => {
    try {
        const response = await axios.get(`${AWS_RISK_BASE_URL}/areas/scores`, {
            timeout: AWS_RISK_TIMEOUT_MS,
        });
        return res.json(response.data);
    }
    catch (error) {
        return forwardAxiosError(error, res, "Failed to fetch area base scores from AWS risk service");
    }
});
router.post("/area", async (req, res) => {
    const areaId = req.body?.area_id;
    if (!areaId || typeof areaId !== "string") {
        return res.status(400).json({ message: "area_id is required" });
    }
    const normalizedAreaId = areaId.trim();
    if (!normalizedAreaId) {
        return res.status(400).json({ message: "area_id is required" });
    }
    try {
        const response = await axios.post(`${AWS_RISK_BASE_URL}/score/area`, {
            area_id: normalizedAreaId,
        }, {
            timeout: AWS_RISK_TIMEOUT_MS,
        });
        return res.json(response.data);
    }
    catch (error) {
        return forwardAxiosError(error, res, "Failed to fetch single-area base risk from AWS risk service");
    }
});
export default router;
//# sourceMappingURL=risk-scores.js.map