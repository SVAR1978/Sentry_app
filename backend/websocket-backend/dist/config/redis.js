import * as IORedisModule from "ioredis";
const url = (process.env.REDIS_URL ?? process.env.REDIS) || "redis://127.0.0.1:6379";
const opts = {
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
    // exponential backoff capped
    retryStrategy: (times) => Math.min(2000 * times, 30000),
};
// If the URL uses rediss:// enable TLS options (use system CAs by default)
if (url.startsWith("rediss://")) {
    opts.tls = {};
}
const IORedis = IORedisModule.default ?? IORedisModule;
export const redis = new IORedis(url, opts);
//# sourceMappingURL=redis.js.map