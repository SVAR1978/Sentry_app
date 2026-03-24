import axios from "axios";
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
const GEMINI_FALLBACK_MODEL = process.env.GEMINI_FALLBACK_MODEL ?? "gemini-1.5-flash";
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 45000);
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES ?? 2);
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class GeminiService {
    async generateReply(question) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is not configured");
        }
        const models = Array.from(new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL]));
        let lastError;
        for (const model of models) {
            for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES + 1; attempt++) {
                try {
                    return await this.callGemini(apiKey, model, question);
                }
                catch (err) {
                    lastError = err;
                    const status = err?.response?.status;
                    const code = err?.code;
                    const retryable = code === "ECONNABORTED" ||
                        code === "ETIMEDOUT" ||
                        status === 429 ||
                        status === undefined ||
                        status >= 500;
                    if (!retryable || attempt > GEMINI_MAX_RETRIES) {
                        break;
                    }
                    const delayMs = attempt * 1000;
                    await sleep(delayMs);
                }
            }
        }
        const errorMessage = lastError?.response?.data?.error?.message ??
            lastError?.message ??
            "Gemini request failed";
        throw new Error(errorMessage);
    }
    async callGemini(apiKey, model, question) {
        const url = `${GEMINI_BASE_URL}/models/${model}:generateContent`;
        const response = await axios.post(url, {
            contents: [
                {
                    role: "user",
                    parts: [{ text: question }],
                },
            ],
        }, {
            params: { key: apiKey },
            headers: { "Content-Type": "application/json" },
            timeout: GEMINI_TIMEOUT_MS,
        });
        const answer = response.data?.candidates?.[0]?.content?.parts
            ?.map((part) => part.text ?? "")
            .join("")
            .trim() ?? "";
        if (!answer) {
            throw new Error("Gemini returned an empty response");
        }
        return answer;
    }
}
export const geminiService = new GeminiService();
//# sourceMappingURL=geminiService.js.map