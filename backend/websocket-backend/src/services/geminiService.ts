import axios from "axios";

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";
const GEMINI_FALLBACK_MODEL =
  process.env.GEMINI_FALLBACK_MODEL ?? "gemini-1.5-flash";
const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 45000);
const GEMINI_MAX_RETRIES = Number(process.env.GEMINI_MAX_RETRIES ?? 2);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class GeminiService {
  async generateReply(question: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const models = Array.from(new Set([GEMINI_MODEL, GEMINI_FALLBACK_MODEL]));
    let lastError: unknown;

    for (const model of models) {
      for (let attempt = 1; attempt <= GEMINI_MAX_RETRIES + 1; attempt++) {
        try {
          return await this.callGemini(apiKey, model, question);
        } catch (err: any) {
          lastError = err;

          const status = err?.response?.status as number | undefined;
          const code = err?.code as string | undefined;
          const retryable =
            code === "ECONNABORTED" ||
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

    const errorMessage =
      (lastError as any)?.response?.data?.error?.message ??
      (lastError as any)?.message ??
      "Gemini request failed";

    throw new Error(errorMessage);
  }

  private async callGemini(
    apiKey: string,
    model: string,
    question: string
  ): Promise<string> {
    const url = `${GEMINI_BASE_URL}/models/${model}:generateContent`;

    const response = await axios.post(
      url,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: question }],
          },
        ],
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
        timeout: GEMINI_TIMEOUT_MS,
      }
    );

    const answer =
      response.data?.candidates?.[0]?.content?.parts
        ?.map((part: { text?: string }) => part.text ?? "")
        .join("")
        .trim() ?? "";

    if (!answer) {
      throw new Error("Gemini returned an empty response");
    }

    return answer;
  }
}

export const geminiService = new GeminiService();
