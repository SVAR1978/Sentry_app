import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ClientManager } from "./ClientManager.js";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "123123";
const port = Number(process.env.PORT) || 8080;
const wss = new WebSocketServer({ port });
console.log(`WebSocket backend is up on port ${port}`);
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
    let decoded;
    try {
        decoded = jwt.verify(token, JWT_SECRET);
    }
    catch {
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
    const role = roleFromToken === "ADMIN" ? "ADMIN" : "USER";
    new ClientManager(ws, decoded.userId, role);
});
console.log(`WebSocket server running on ws://localhost:${port}`);
//# sourceMappingURL=index.js.map