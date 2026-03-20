import WebSocket from "ws";
import { prisma } from "./prisma.js";
import { emailQueue } from "./queues/emailQueue.js";
import { emailService } from "./services/emailService.js";
import dotenv from "dotenv";

dotenv.config();

type Role = "USER" | "ADMIN";

interface Client {
  ws: WebSocket;
  userId: string;
  role: Role;
}

interface LocationMessage {
  type: "LOCATION";
  payload: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    speed?: number;
    heading?: number;
    source: "GPS" | "NETWORK";
  };
}

export class ClientManager {
  private static clients: Client[] = [];

  constructor(
    private ws: WebSocket,
    private userId: string,
    private role: Role
  ) {
    ClientManager.clients.push({ ws, userId, role });

    ws.on("message", (data) => {
      const message = JSON.parse(data.toString()) as LocationMessage;
      this.handleMessage(message);
    });

    ws.on("close", () => this.cleanup());
  }

  private async handleMessage(message: LocationMessage) {
    if (this.role !== "USER") return;
    if (message.type !== "LOCATION") return;

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
          const contactEmail = (contact as any).email as string | undefined;
          if (!contactEmail) continue;
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
          } catch (err) {
            console.warn("emailQueue.add failed, falling back to direct send:", (err as any)?.message ?? err);
            try {
              await emailService.sendEmail(
                contactEmail,
                `High risk alert for ${this.userId}`,
                `<h3>High risk detected: ${risk}</h3><p>User: ${this.userId}</p><p>Location: ${location.latitude}, ${location.longitude}</p>`
              );
            } catch (err2) {
              console.error("Direct email send failed:", err2);
            }
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

  private static sendToAdmins(userId: string, location: LocationMessage["payload"]) {
    for (const client of ClientManager.clients) {
      if (client.role === "ADMIN" && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(
          JSON.stringify({
            type: "USER_LOCATION",
            userId,
            ...location,
          })
        );
      }
    }
  }

  private calculateRisk(_: number, __: number): number {
    return Math.floor(Math.random() * 10) + 1;
  }

  private cleanup() {
    ClientManager.clients = ClientManager.clients.filter(
      (c) => c.ws !== this.ws
    );
  }
}
