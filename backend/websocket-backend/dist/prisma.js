import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Redis from "ioredis";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { PrismaClient } from "./generated/prisma/index.js";
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
// ioredis typings sometimes present the module as a namespace in this TS config.
// Use a safe any-cast here so TypeScript accepts the constructor call.
const redis = new Redis(process.env.REDIS_URL || '');
redis.on("connect", () => {
    console.log("Connected to Redis successfully!");
});
redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});
export default redis;
//# sourceMappingURL=prisma.js.map