import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ClientManager } from "./ClientManager.js";
import { redis } from "./config/redis.js";
import {
  broadcastUserSessionToAdmins,
  UserSessionPayload,
} from "./services/adminRealtimeService.js";

dotenv.config();

const runEmailWorkerInThisService =
  (process.env.RUN_EMAIL_WORKER ?? "false").toLowerCase() === "true";

if (runEmailWorkerInThisService) {
  // Start BullMQ email worker in the same process to avoid a separate worker service.
  await import("./workers/emailWorker.js");
  console.log("Email worker enabled in websocket service");
}

const JWT_SECRET = process.env.JWT_SECRET || "123123";

type Role = "USER" | "ADMIN";

interface DecodedToken {
    userId: string;
    role?: string;
}

const port = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port });
console.log(`WebSocket backend is up on port ${port}`);

// ============================================================
// Redis Pub/Sub Setup for USER_SESSION Events
// ============================================================
const redisSubscriber = redis.duplicate();

redisSubscriber.subscribe("user-session-events", (err: Error | null, count: number) => {
  if (err) {
    console.error("[Redis] Failed to subscribe to user-session-events:", err);
  } else {
    console.log(
      `[Redis] Successfully subscribed to ${count} channel(s): user-session-events`
    );
  }
});

/**
 * Listen for USER_SESSION events published from the HTTPS backend.
 * When a user logs in or out, the HTTPS backend publishes to Redis,
 * and this listener receives it and broadcasts to all admin clients.
 */
redisSubscriber.on("message", (channel: string, message: string) => {
  if (channel !== "user-session-events") return;

  try {
    const sessionEvent: UserSessionPayload = JSON.parse(message);

    console.log(
      `[WebSocket] Received USER_SESSION event from Redis: ${sessionEvent.action} for user ${sessionEvent.userId}`
    );

    // Broadcast to all admin clients
    broadcastUserSessionToAdmins(ClientManager.getClients(), sessionEvent);
  } catch (err) {
    console.error(
      "[WebSocket] Failed to parse USER_SESSION event from Redis:",
      err
    );
  }
});

redisSubscriber.on("error", (err: Error) => {
  console.error("[Redis Subscriber] Error:", err);
});

// ============================================================
// WebSocket Connection Handler
// ============================================================
wss.on("connection", (ws, request) => {
    const { url } = request;
    if (!url) {
        ws.close();
        return;
    }

    const query = url.split("?")[1] ?? "";
    const queryParams = new URLSearchParams(query);
    let token = queryParams.get("token") ?? "";

    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    let decoded: DecodedToken;
    try {
        decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch {
        ws.close();
        return;
    }

    if (!decoded?.userId) {
        ws.close();
        return;
    }
    console.log("New client connected:", decoded.userId);
    // validate role coming from token and normalize to our Role type
    const roleFromToken = decoded.role ?? "USER";
    const role: Role = roleFromToken === "ADMIN" ? "ADMIN" : "USER";
    new ClientManager(ws, decoded.userId, role);
});

console.log(`WebSocket server running on ws://localhost:${port}`);
