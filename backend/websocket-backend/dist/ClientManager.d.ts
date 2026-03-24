import WebSocket from "ws";
type Role = "USER" | "ADMIN";
export declare class ClientManager {
    private ws;
    private userId;
    private role;
    private static clients;
    constructor(ws: WebSocket, userId: string, role: Role);
    private handleMessage;
    private handleChatAsk;
    private sendChatError;
    private static sendToAdmins;
    private calculateRisk;
    private cleanup;
}
export {};
//# sourceMappingURL=ClientManager.d.ts.map