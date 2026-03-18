import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ClientManager } from "./ClientManager.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "123123";

type Role = "USER" | "ADMIN";

interface DecodedToken {
    userId: string;
    role?: string;
}

const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket backend is up");

wss.on("connection", (ws, request) => {
    const url = request.url;
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

console.log("WebSocket server running on ws://localhost:8080");
