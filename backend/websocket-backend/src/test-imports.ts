// Quick test script to diagnose import/startup errors
import { Worker } from "bullmq";
import { redis } from "./config/redis.js";

console.log('bullmq Worker imported:', typeof Worker === 'function');
console.log('redis instance type:', typeof redis, 'redis constructor:', redis?.constructor?.name);

process.exit(0);
