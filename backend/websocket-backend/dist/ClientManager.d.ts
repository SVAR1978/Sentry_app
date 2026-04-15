import WebSocket from "ws";
import { Client, Role } from "./types/wsTypes.js";
export declare class ClientManager {
    private ws;
    private userId;
    private role;
    private static clients;
    private static liveCountInterval;
    constructor(ws: WebSocket, userId: string, role: Role);
    /**
     * Public getter to access the clients array.
     * Used by services to broadcast events to all connected clients.
     * @returns Array of connected clients
     */
    static getClients(): Client[];
    private handleMessage;
    private handleChatAsk;
    private sendRiskAlert;
    private sendChatError;
    private static ensureLiveCountInterval;
    private static clearLiveCountIntervalIfNoClients;
    private cleanup;
}
//# sourceMappingURL=ClientManager.d.ts.map