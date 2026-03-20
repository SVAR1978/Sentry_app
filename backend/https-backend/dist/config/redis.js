import { Redis } from "ioredis";
const url = (process.env.REDIS_URL ?? process.env.REDIS) || "redis://127.0.0.1:6379";
// Ensure `maxRetriesPerRequest` is explicitly null to avoid BullMQ deprecation warning
export const redis = new Redis(url, { maxRetriesPerRequest: null });
//# sourceMappingURL=redis.js.map