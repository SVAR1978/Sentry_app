import * as IORedisModule from "ioredis";

const url = (process.env.REDIS_URL ?? process.env.REDIS) || "redis://127.0.0.1:6379";

const opts: any = {
	maxRetriesPerRequest: null,
	connectTimeout: 10000,
	retryStrategy: (times: number) => Math.min(2000 * times, 30000),
};

if (url.startsWith("rediss://")) {
	opts.tls = {};
}

const IORedis: any = (IORedisModule as any).default ?? IORedisModule;

export const redis = new IORedis(url, opts);