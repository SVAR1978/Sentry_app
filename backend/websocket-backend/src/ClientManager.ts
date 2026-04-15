import WebSocket from "ws";
import { prisma } from "./prisma.js";
import { emailQueue } from "./queues/emailQueue.js";
import { geminiService } from "./services/geminiService.js";
import { RiskZoneService } from "./services/riskZoneService.js";
import {
  broadcastLiveUserCountToAdmins,
  broadcastUserLocationToAdmins,
} from "./services/adminRealtimeService.js";
import {
  handleSOSDispatch,
  handleSOSResolve,
  handleSOSAcknowledge,
} from "./services/sosAlertService.js";
import {
  ChatAskMessage,
  Client,
  EmergencySOSMessage,
  SOSResolveMessage,
  SOSAcknowledgeMessage,
  IncomingMessage,
  Role,
} from "./types/wsTypes.js";
import dotenv from "dotenv";

dotenv.config();

export class ClientManager {
  private static clients: Client[] = [];
  private static liveCountInterval: NodeJS.Timeout | null = null;

  constructor(
    private ws: WebSocket,
    private userId: string,
    private role: Role
  ) {
    ClientManager.clients.push({ ws, userId, role });
    ClientManager.ensureLiveCountInterval();
    broadcastLiveUserCountToAdmins(ClientManager.clients);

    if (role === "ADMIN") {
      this.sendInitialLocations().catch(err => console.error("Failed to send initial locations:", err));
    }

    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString()) as IncomingMessage;
        this.handleMessage(message);
      } catch {
        if (this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(
            JSON.stringify({
              type: "CHAT_ERROR",
              payload: {
                message: "Invalid message format",
              },
            })
          );
        }
      }
    });

    ws.on("close", () => this.cleanup());
  }

  /**
   * Public getter to access the clients array.
   * Used by services to broadcast events to all connected clients.
   * @returns Array of connected clients
   */
  public static getClients(): Client[] {
    return ClientManager.clients;
  }

  private async handleMessage(message: IncomingMessage) {
    // ── SOS messages: available to BOTH users and admins ──
    if (message.type === "EMERGENCY_SOS" && this.role === "USER") {
      await handleSOSDispatch(
        ClientManager.clients,
        this.userId,
        (message as EmergencySOSMessage).payload,
        this.ws
      );
      return;
    }

    if (message.type === "SOS_RESOLVE" && this.role === "USER") {
      const alertId = (message as SOSResolveMessage).payload.alertId;
      await handleSOSResolve(ClientManager.clients, this.userId, alertId, this.ws);
      return;
    }

    if (message.type === "SOS_ACKNOWLEDGE" && this.role === "ADMIN") {
      const { alertId, adminId } = (message as SOSAcknowledgeMessage).payload;
      await handleSOSAcknowledge(ClientManager.clients, alertId, adminId);
      return;
    }

    // ── User-only messages below ──
    if (this.role !== "USER") return;

    if (message.type === "CHAT_ASK") {
      await this.handleChatAsk(message);
      return;
    }

    if (message.type !== "LOCATION") return;

    const location = message.payload;
    
    // Calculate real risk using HTTPS backend API 
    const riskResult = await RiskZoneService.getRealtimeRisk(
      location.latitude,
      location.longitude,
      location.areaId
    );
    const risk = riskResult.score;

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

    broadcastUserLocationToAdmins(ClientManager.clients, this.userId, location);

    // Send WebSocket alert if risk is high (threshold: 8)
    const HIGH_RISK_THRESHOLD = Number(process.env.HIGH_RISK_THRESHOLD ?? 8);
    if (risk >= HIGH_RISK_THRESHOLD) {
      this.sendRiskAlert(riskResult);
    }

    // If risk is high, enqueue an email notification job
    if (risk >= HIGH_RISK_THRESHOLD) {
      try {
        // fetch emergency contacts for the user
        const contacts = await prisma.emergencyContact.findMany({ where: { userId: this.userId } });

        let enqueued = 0;
        for (const contact of contacts) {
          // support optional email field if present in DB; fall back: skip if not present
          const contactEmail = (contact as any).email as string | undefined;
          if (!contactEmail) continue;
          try {
            await emailQueue.add("sendEmail", {
              email: contactEmail,
              subject: `High risk alert for ${this.userId}`,
              htmlContent: `<h3>High risk detected: ${risk}</h3><p>Zone: ${riskResult.zoneName || "Unknown"}</p><p>User: ${this.userId}</p><p>Location: ${location.latitude}, ${location.longitude}</p>`,
              userId: this.userId,
              latitude: location.latitude,
              longitude: location.longitude,
              risk,
              contactId: contact.id,
            });
          } catch (err) {
            console.error("Failed to enqueue high-risk email job:", (err as any)?.message ?? err);
          }
          enqueued++;
        }

        if (enqueued === 0) {
          console.warn(`No emergency contact email found for user ${this.userId}; no emails enqueued`);
        }
      } catch (err) {
        console.error("Failed to enqueue email job:", err);
      }
    }
  }

  private async handleChatAsk(message: ChatAskMessage) {
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
        this.ws.send(
          JSON.stringify({
            type: "CHAT_RESPONSE",
            payload: {
              conversationId,
              answer,
            },
          })
        );
      }
    } catch (err: any) {
      console.error("CHAT_ASK failed:", err?.message ?? err);
      this.sendChatError("Failed to get chat response", conversationId);
    }
  }

  private sendRiskAlert(riskResult: any) {
    if (this.ws.readyState !== WebSocket.OPEN) return;
    
    const levelDescriptions: Record<string, string> = {
      high: "You have entered a HIGH-RISK zone. Stay alert and consider changing your route.",
      medium: "You have entered a MEDIUM-RISK zone. Please be cautious.",
      low: "You are in a low-risk area.",
    };

    const message = levelDescriptions[riskResult.level] || "Risk detected in your area.";

    console.log(
      `[ClientManager] Sending risk alert to user ${this.userId}: ${riskResult.level} (score: ${riskResult.score})`
    );

    this.ws.send(
      JSON.stringify({
        type: "RISK_ALERT",
        payload: {
          level: riskResult.level,
          score: riskResult.score,
          message,
          zoneName: riskResult.zoneName || undefined,
          timestamp: new Date().toISOString(),
        },
      })
    );
  }

  private async sendInitialLocations() {
    try {
      // Get the latest location per active user from Prisma
      const latestLogs = await prisma.locationLog.findMany({
        orderBy: { timestamp: 'desc' },
        distinct: ['userId'],
        select: {
          userId: true,
          latitude: true,
          longitude: true,
          accuracy: true,
          speed: true,
          heading: true,
        }
      });

      if (this.ws.readyState !== WebSocket.OPEN) return;

      // Ensure we only send locations for users who are currently connected
      const activeUserIds = new Set(
        ClientManager.clients.filter(c => c.role === "USER").map(c => c.userId)
      );

      let sentCount = 0;
      for (const log of latestLogs) {
        if (!activeUserIds.has(log.userId)) continue;
        
        this.ws.send(JSON.stringify({
          type: "USER_LOCATION",
          userId: log.userId,
          latitude: log.latitude,
          longitude: log.longitude,
          accuracy: log.accuracy,
          speed: log.speed,
          heading: log.heading,
          source: "DATABASE_SYNC"
        }));
        sentCount++;
      }
      
      console.log(`[ClientManager] Sent ${sentCount} initial user locations to admin ${this.userId}`);
    } catch (err) {
      console.error("[ClientManager] Failed to fetch initial locations from DB:", err);
    }
  }

  private sendChatError(message: string, conversationId?: string) {
    if (this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(
      JSON.stringify({
        type: "CHAT_ERROR",
        payload: {
          conversationId,
          message,
        },
      })
    );
  }

  private static ensureLiveCountInterval() {
    if (ClientManager.liveCountInterval) return;

    ClientManager.liveCountInterval = setInterval(() => {
      broadcastLiveUserCountToAdmins(ClientManager.clients);
    }, 2000);
  }

  private static clearLiveCountIntervalIfNoClients() {
    if (ClientManager.clients.length > 0) return;
    if (!ClientManager.liveCountInterval) return;

    clearInterval(ClientManager.liveCountInterval);
    ClientManager.liveCountInterval = null;
  }

  private cleanup() {
    ClientManager.clients = ClientManager.clients.filter(
      (c) => c.ws !== this.ws
    );
    broadcastLiveUserCountToAdmins(ClientManager.clients);
    ClientManager.clearLiveCountIntervalIfNoClients();
  }
}
