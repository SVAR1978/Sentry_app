import Redis from "ioredis";

const url = (process.env.REDIS_URL ?? process.env.REDIS) || "redis://127.0.0.1:6379";

const opts: any = {
	maxRetriesPerRequest: null,
	connectTimeout: 10000,
	// exponential backoff capped
	retryStrategy: (times: number) => Math.min(2000 * times, 30000),
};

// If the URL uses rediss:// enable TLS options (use system CAs by default)
if (url.startsWith("rediss://")) {
	opts.tls = {};
}

export const redis = new Redis(url, opts);
