import WebSocket from "ws";

export type Role = "USER" | "ADMIN";

export interface Client {
  ws: WebSocket;
  userId: string;
  role: Role;
}

export interface LocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  source: "GPS" | "NETWORK";
}

export interface LocationMessage {
  type: "LOCATION";
  payload: LocationPayload;
}

export interface ChatAskMessage {
  type: "CHAT_ASK";
  payload: {
    question: string;
    conversationId?: string;
  };
}

export interface RiskAlertMessage {
  type: "RISK_ALERT";
  payload: {
    level: "low" | "medium" | "high";
    score: number;
    message: string;
    zoneName?: string;
    timestamp: string;
  };
}

export type IncomingMessage = LocationMessage | ChatAskMessage;
export type OutgoingMessage = RiskAlertMessage;
