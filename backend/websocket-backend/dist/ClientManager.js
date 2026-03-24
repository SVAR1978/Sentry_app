import WebSocket from "ws";
import { prisma } from "./prisma.js";
import { emailQueue } from "./queues/emailQueue.js";
import { emailService } from "./services/emailService.js";
import { geminiService } from "./services/geminiService.js";
import dotenv from "dotenv";
dotenv.config();
export class ClientManager {
    ws;
    userId;
    role;
    static clients = [];
    constructor(ws, userId, role) {
        this.ws = ws;
        this.userId = userId;
        this.role = role;
        ClientManager.clients.push({ ws, userId, role });
        ws.on("message", (data) => {
            try {
                const message = JSON.parse(data.toString());
                this.handleMessage(message);
            }
            catch {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(JSON.stringify({
                        type: "CHAT_ERROR",
                        payload: {
                            message: "Invalid message format",
                        },
                    }));
                }
            }
        });
        ws.on("close", () => this.cleanup());
    }
    async handleMessage(message) {
        if (this.role !== "USER")
            return;
        if (message.type === "CHAT_ASK") {
            await this.handleChatAsk(message);
            return;
        }
        if (message.type !== "LOCATION")
            return;
        const location = message.payload;
        const risk = this.calculateRisk(location.latitude, location.longitude);
        await prisma.locationLog.create({
            data: {
                userId: this.userId,
                latitude: location.latitude,
                longitude: location.longitude,
                accuracy: location.accuracy,
                speed: location.speed,
                heading: location.heading,
                source: location.source,
                riskScore: risk,
            },
        });
        ClientManager.sendToAdmins(this.userId, location);
        // If risk is high, enqueue an email notification job
        const HIGH_RISK_THRESHOLD = Number(process.env.HIGH_RISK_THRESHOLD ?? 8);
        if (risk >= HIGH_RISK_THRESHOLD) {
            try {
                // fetch emergency contacts for the user
                const contacts = await prisma.emergencyContact.findMany({ where: { userId: this.userId } });
                let enqueued = 0;
                for (const contact of contacts) {
                    // support optional email field if present in DB; fall back: skip if not present
                    const contactEmail = contact.email;
                    if (!contactEmail)
                        continue;
                    try {
                        await emailQueue.add("sendEmail", {
                            email: contactEmail,
                            subject: `High risk alert for ${this.userId}`,
                            htmlContent: `<h3>High risk detected: ${risk}</h3><p>User: ${this.userId}</p><p>Location: ${location.latitude}, ${location.longitude}</p>`,
                            userId: this.userId,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            risk,
                            contactId: contact.id,
                        });
                    }
                    catch (err) {
                        console.warn("emailQueue.add failed, falling back to direct send:", err?.message ?? err);
                        try {
                            await emailService.sendEmail(contactEmail, `High risk alert for ${this.userId}`, `<h3>High risk detected: ${risk}</h3><p>User: ${this.userId}</p><p>Location: ${location.latitude}, ${location.longitude}</p>`);
                        }
                        catch (err2) {
                            console.error("Direct email send failed:", err2);
                        }
                    }
                    enqueued++;
                }
                if (enqueued === 0) {
                    console.warn(`No emergency contact email found for user ${this.userId}; no emails enqueued`);
                }
            }
            catch (err) {
                console.error("Failed to enqueue email job:", err);
            }
        }
    }
    async handleChatAsk(message) {
        const question = message.payload?.question?.trim();
        const conversationId = message.payload?.conversationId;
        if (!question) {
            this.sendChatError("Question is required", conversationId);
            return;
        }
        const MAX_QUESTION_LENGTH = Number(process.env.CHAT_MAX_QUESTION_LENGTH ?? 2000);
        if (question.length > MAX_QUESTION_LENGTH) {
            this.sendChatError(`Question is too long (max ${MAX_QUESTION_LENGTH} chars)`, conversationId);
            return;
        }
        try {
            const answer = await geminiService.generateReply(question);
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: "CHAT_RESPONSE",
                    payload: {
                        conversationId,
                        answer,
                    },
                }));
            }
        }
        catch (err) {
            console.error("CHAT_ASK failed:", err?.message ?? err);
            this.sendChatError("Failed to get chat response", conversationId);
        }
    }
    sendChatError(message, conversationId) {
        if (this.ws.readyState !== WebSocket.OPEN)
            return;
        this.ws.send(JSON.stringify({
            type: "CHAT_ERROR",
            payload: {
                conversationId,
                message,
            },
        }));
    }
    static sendToAdmins(userId, location) {
        for (const client of ClientManager.clients) {
            if (client.role === "ADMIN" && client.ws.readyState === WebSocket.OPEN) {
                client.ws.send(JSON.stringify({
                    type: "USER_LOCATION",
                    userId,
                    ...location,
                }));
            }
        }
    }
    calculateRisk(_, __) {
        return Math.floor(Math.random() * 10) + 1;
    }
    cleanup() {
        ClientManager.clients = ClientManager.clients.filter((c) => c.ws !== this.ws);
    }
}
//# sourceMappingURL=ClientManager.js.map