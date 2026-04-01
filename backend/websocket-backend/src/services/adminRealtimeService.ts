import WebSocket from "ws";
import { Client, LocationPayload } from "../types/wsTypes.js";

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

  const payload = {
    type: "LIVE_USERS_COUNT",
    payload: {
      count: activeUsers.length,
    },
  };

  for (const client of activeAdmins) {
    client.ws.send(JSON.stringify(payload));
  }
}
