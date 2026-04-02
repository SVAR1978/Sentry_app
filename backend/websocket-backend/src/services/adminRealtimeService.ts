import WebSocket from "ws";
import { Client, LocationPayload } from "../types/wsTypes.js";

// ============================================================
// USER_SESSION Event Payload Type
// ============================================================
export interface UserSessionPayload {
  userId: string;
  userName: string;
  action: "LOGIN" | "LOGOUT" | "SIGNUP";
  timestamp: string;
}

export function broadcastUserLocationToAdmins(
  clients: Client[],
  userId: string,
  location: LocationPayload
) {
  for (const client of clients) {
    if (client.role !== "ADMIN") continue;
    if (client.ws.readyState !== WebSocket.OPEN) continue;

    client.ws.send(
      JSON.stringify({
        type: "USER_LOCATION",
        userId,
        ...location,
      })
    );
  }
}

export function broadcastLiveUserCountToAdmins(clients: Client[]) {
  const activeClients = clients.filter((c) => c.ws.readyState === WebSocket.OPEN);
  const activeUsers = activeClients.filter((c) => c.role === "USER");
  const activeAdmins = activeClients.filter((c) => c.role === "ADMIN");

  // Collect unique active user IDs
  const activeUserIds = [...new Set(activeUsers.map((c) => c.userId))];

  const payload = {
    type: "LIVE_USERS_COUNT",
    payload: {
      count: activeUsers.length,
      activeUserIds,
    },
  };

  for (const client of activeAdmins) {
    client.ws.send(JSON.stringify(payload));
  }
}

/**
 * Broadcasts USER_SESSION events to all connected admin clients.
 * This function sends real-time login/logout activity to admins without manual refresh.
 * 
 * @param clients - Array of all connected WebSocket clients
 * @param sessionData - Session payload containing userId, userName, action, and timestamp
 * 
 * @example
 * broadcastUserSessionToAdmins(ClientManager.clients, {
 *   userId: "user123",
 *   userName: "John Doe",
 *   action: "LOGIN",
 *   timestamp: new Date().toISOString(),
 * });
 */
export function broadcastUserSessionToAdmins(
  clients: Client[],
  sessionData: UserSessionPayload
) {
  const activeAdmins = clients.filter(
    (c) => c.role === "ADMIN" && c.ws.readyState === WebSocket.OPEN
  );

  if (activeAdmins.length === 0) {
    console.log(
      `[AdminRealtimeService] No active admin clients to broadcast USER_SESSION event`
    );
    return;
  }

  const payload = {
    type: "USER_SESSION",
    payload: sessionData,
  };

  console.log(
    `[AdminRealtimeService] Broadcasting USER_SESSION event to ${activeAdmins.length} admin(s):`,
    sessionData
  );

  for (const adminClient of activeAdmins) {
    try {
      adminClient.ws.send(JSON.stringify(payload));
    } catch (err) {
      console.error(
        `[AdminRealtimeService] Failed to send USER_SESSION to admin ${adminClient.userId}:`,
        err
      );
    }
  }
}
