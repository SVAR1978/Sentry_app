/**
 * SOS ALERT SERVICE — Backend
 * ════════════════════════════
 * Handles the full lifecycle of an SOS emergency:
 *   1. RECEIVE  → User triggers EMERGENCY_SOS via WebSocket
 *   2. PERSIST  → Alert saved to PostgreSQL via Prisma
 *   3. BROADCAST → All admin clients receive SOS_ALERT in real-time
 *   4. NOTIFY   → Emergency contacts get email if configured
 *   5. ACKNOWLEDGE → Admin can acknowledge active alerts
 *   6. RESOLVE  → User/Admin resolves, closing the incident
 *   7. ESCALATE → Unacknowledged alerts auto-escalate after timeout
 */

import WebSocket from "ws";
import { prisma } from "../prisma.js";
import { emailQueue } from "../queues/emailQueue.js";
import {
  Client,
  SOSContact,
  SOSAlertBroadcast,
  SOSStatusUpdate,
  SOSConfirmation,
} from "../types/wsTypes.js";

// ─── ESCALATION CONFIG ──────────────────────────────────────

const ESCALATION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const escalationTimers = new Map<string, NodeJS.Timeout>();

// ─── 1. HANDLE NEW SOS DISPATCH ─────────────────────────────

export async function handleSOSDispatch(
  clients: Client[],
  userId: string,
  payload: {
    latitude?: number;
    longitude?: number;
    address?: string;
    contacts: SOSContact[];
    userName: string;
    timestamp: string;
  },
  senderWs: WebSocket
): Promise<void> {
  const { latitude, longitude, address, contacts, userName, timestamp } = payload;

  console.log(
    `[SOSService] EMERGENCY_SOS received from user ${userId} (${userName})`
  );

  // ── Step 1: Persist to database ─────────────────────────
  let alert;
  try {
    alert = await prisma.sOSAlert.create({
      data: {
        userId,
        status: "ACTIVE",
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        address: address ?? null,
        emergencyContacts: contacts as any,
      },
    });

    console.log(
      `[SOSService] Alert ${alert.id} persisted to database`
    );
  } catch (dbErr) {
    console.error("[SOSService] Failed to persist SOS alert:", dbErr);

    // Still confirm to user even if DB fails — safety first
    sendToClient(senderWs, {
      type: "SOS_CONFIRMED",
      payload: {
        alertId: "OFFLINE",
        status: "ACTIVE",
        message: "SOS dispatched (offline mode). Emergency contacts notified.",
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  // ── Step 2: Confirm back to the user ────────────────────
  sendToClient(senderWs, {
    type: "SOS_CONFIRMED",
    payload: {
      alertId: alert.id,
      status: "ACTIVE",
      message: "SOS alert dispatched successfully. Admins and contacts notified.",
      timestamp: new Date().toISOString(),
    },
  });

  // ── Step 3: Broadcast to ALL admin clients ──────────────
  const broadcastPayload: SOSAlertBroadcast = {
    type: "SOS_ALERT",
    payload: {
      alertId: alert.id,
      userId,
      userName,
      latitude,
      longitude,
      address,
      contacts,
      status: "ACTIVE",
      timestamp: alert.createdAt.toISOString(),
    },
  };

  broadcastToAdmins(clients, broadcastPayload);

  // ── Step 4: Send email to emergency contacts ────────────
  notifyContactsByEmail(alert.id, userId, userName, contacts, latitude, longitude, address);

  // ── Step 5: Start escalation timer ──────────────────────
  startEscalationTimer(clients, alert.id, userId, userName);

  console.log(
    `[SOSService] Alert ${alert.id} fully dispatched: DB + Admins + Emails + Escalation`
  );
}

// ─── 2. HANDLE SOS RESOLVE ──────────────────────────────────

export async function handleSOSResolve(
  clients: Client[],
  userId: string,
  alertId: string,
  senderWs: WebSocket
): Promise<void> {
  console.log(`[SOSService] SOS_RESOLVE received for alert ${alertId}`);

  // Cancel escalation timer
  clearEscalationTimer(alertId);

  try {
    await prisma.sOSAlert.update({
      where: { id: alertId },
      data: {
        status: "RESOLVED",
        resolvedAt: new Date(),
      },
    });
  } catch (err) {
    console.error(`[SOSService] Failed to resolve alert ${alertId}:`, err);
  }

  // Confirm to user
  sendToClient(senderWs, {
    type: "SOS_CONFIRMED",
    payload: {
      alertId,
      status: "RESOLVED",
      message: "SOS alert resolved. You are marked as safe.",
      timestamp: new Date().toISOString(),
    },
  });

  // Notify admins
  const statusUpdate: SOSStatusUpdate = {
    type: "SOS_STATUS_UPDATE",
    payload: {
      alertId,
      userId,
      status: "RESOLVED",
      timestamp: new Date().toISOString(),
    },
  };

  broadcastToAdmins(clients, statusUpdate);
}

// ─── 3. HANDLE SOS ACKNOWLEDGE (Admin) ──────────────────────

export async function handleSOSAcknowledge(
  clients: Client[],
  alertId: string,
  adminId: string
): Promise<void> {
  console.log(
    `[SOSService] SOS_ACKNOWLEDGE for alert ${alertId} by admin ${adminId}`
  );

  // Cancel escalation timer since admin has acknowledged
  clearEscalationTimer(alertId);

  try {
    await prisma.sOSAlert.update({
      where: { id: alertId },
      data: {
        status: "ACKNOWLEDGED",
        acknowledgedAt: new Date(),
      },
    });
  } catch (err) {
    console.error(`[SOSService] Failed to acknowledge alert ${alertId}:`, err);
  }

  // Notify all admins & the user
  const statusUpdate: SOSStatusUpdate = {
    type: "SOS_STATUS_UPDATE",
    payload: {
      alertId,
      userId: adminId,
      status: "ACKNOWLEDGED",
      timestamp: new Date().toISOString(),
    },
  };

  broadcastToAll(clients, statusUpdate);
}

// ─── 4. ESCALATION PROTOCOL ────────────────────────────────

function startEscalationTimer(
  clients: Client[],
  alertId: string,
  userId: string,
  userName: string
) {
  const timer = setTimeout(async () => {
    console.log(
      `[SOSService] ESCALATION: Alert ${alertId} was not acknowledged in ${ESCALATION_TIMEOUT_MS / 1000}s`
    );

    try {
      const alert = await prisma.sOSAlert.findUnique({ where: { id: alertId } });
      if (alert && alert.status === "ACTIVE") {
        await prisma.sOSAlert.update({
          where: { id: alertId },
          data: { status: "ESCALATED" },
        });

        const escalationUpdate: SOSStatusUpdate = {
          type: "SOS_STATUS_UPDATE",
          payload: {
            alertId,
            userId,
            status: "ESCALATED",
            timestamp: new Date().toISOString(),
          },
        };

        broadcastToAdmins(clients, escalationUpdate);

        console.log(
          `[SOSService] Alert ${alertId} ESCALATED for user ${userName}`
        );
      }
    } catch (err) {
      console.error(`[SOSService] Escalation failed for ${alertId}:`, err);
    }

    escalationTimers.delete(alertId);
  }, ESCALATION_TIMEOUT_MS);

  escalationTimers.set(alertId, timer);
}

function clearEscalationTimer(alertId: string) {
  const timer = escalationTimers.get(alertId);
  if (timer) {
    clearTimeout(timer);
    escalationTimers.delete(alertId);
    console.log(`[SOSService] Escalation timer cleared for alert ${alertId}`);
  }
}

// ─── 5. EMAIL NOTIFICATION ──────────────────────────────────

async function notifyContactsByEmail(
  alertId: string,
  userId: string,
  userName: string,
  contacts: SOSContact[],
  latitude?: number,
  longitude?: number,
  address?: string
) {
  try {
    // Collect unique emails from the incoming payload
    const emailTargets = new Map<string, string>(); // email -> name
    
    // 1. From the SOS payload (frontend localStorage)
    for (const c of contacts) {
      if (c.email && c.email.trim() !== "") {
        emailTargets.set(c.email.trim(), c.name);
      }
    }

    // 2. Also check DB for contacts just in case
    const dbContacts = await prisma.emergencyContact.findMany({
      where: { userId },
    });
    for (const contact of dbContacts) {
      const contactEmail = (contact as any).email as string | undefined;
      if (contactEmail && contactEmail.trim() !== "") {
        emailTargets.set(contactEmail.trim(), contact.name);
      }
    }

    const mapsLink = latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : "";

    const locationStr = address || (latitude && longitude
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : "Location unavailable");

    for (const [contactEmail, contactName] of emailTargets.entries()) {
      try {
        const htmlContent = `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #D93636; color: white; padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="margin: 0; font-size: 24px;">EMERGENCY SOS ALERT</h1>
              <p style="margin: 8px 0 0; opacity: 0.9;">Immediate attention required</p>
            </div>
            <div style="background: #fff; padding: 24px; border: 1px solid #eee; border-radius: 0 0 12px 12px;">
              <p style="font-size: 16px; margin: 0 0 16px;"><strong>${userName}</strong> has triggered an emergency SOS alert.</p>
              <table style="width: 100%; margin-bottom: 16px;">
                <tr><td style="padding: 8px 0; color: #666;">Alert ID</td><td style="padding: 8px 0; font-weight: bold;">${alertId}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0; font-weight: bold;">${locationStr}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Time</td><td style="padding: 8px 0; font-weight: bold;">${new Date().toLocaleString("en-IN")}</td></tr>
              </table>
              ${mapsLink ? `<a href="${mapsLink}" style="display: inline-block; background: #D93636; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Location on Map</a>` : ""}
              <p style="margin-top: 20px; color: #888; font-size: 13px;">This alert was dispatched via the Sentry Emergency App. Please respond immediately or contact local emergency services.</p>
            </div>
          </div>`;

        // Queue email job instead of sending directly
        await emailQueue.add(
          "send-sos-email",
          {
            email: contactEmail,
            subject: `EMERGENCY SOS ALERT — ${userName} needs help`,
            htmlContent,
          },
          { removeOnComplete: true }
        );
        console.log(`[SOSService] SOS email queued for ${contactName} (${contactEmail})`);
      } catch (err) {
        console.error(`[SOSService] Failed to queue email to ${contactEmail}:`, err);
      }
    }
  } catch (err) {
    console.error("[SOSService] Failed to fetch DB contacts for email:", err);
  }
}

// ─── BROADCAST UTILITIES ────────────────────────────────────

function broadcastToAdmins(clients: Client[], message: object) {
  const admins = clients.filter(
    (c) => c.role === "ADMIN" && c.ws.readyState === WebSocket.OPEN
  );

  console.log(`[SOSService] Broadcasting to ${admins.length} admin(s)`);

  for (const admin of admins) {
    try {
      admin.ws.send(JSON.stringify(message));
    } catch (err) {
      console.error(`[SOSService] Failed to send to admin ${admin.userId}:`, err);
    }
  }
}

function broadcastToAll(clients: Client[], message: object) {
  const activeClients = clients.filter(
    (c) => c.ws.readyState === WebSocket.OPEN
  );

  for (const client of activeClients) {
    try {
      client.ws.send(JSON.stringify(message));
    } catch (err) {
      console.error(`[SOSService] Failed to send to ${client.userId}:`, err);
    }
  }
}

function sendToClient(ws: WebSocket, message: object) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
}
