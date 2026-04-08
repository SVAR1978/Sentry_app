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
  areaId?: string;
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

// ─── SOS MESSAGE TYPES ──────────────────────────────────────

export interface SOSContact {
  name: string;
  email: string;
  relationship: string;
}

export interface EmergencySOSMessage {
  type: "EMERGENCY_SOS";
  payload: {
    latitude?: number;
    longitude?: number;
    address?: string;
    contacts: SOSContact[];
    userName: string;
    timestamp: string;
  };
}

export interface SOSResolveMessage {
  type: "SOS_RESOLVE";
  payload: {
    alertId: string;
  };
}

export interface SOSAcknowledgeMessage {
  type: "SOS_ACKNOWLEDGE";
  payload: {
    alertId: string;
    adminId: string;
  };
}

// ─── OUTGOING MESSAGE TYPES ─────────────────────────────────

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

export interface SOSAlertBroadcast {
  type: "SOS_ALERT";
  payload: {
    alertId: string;
    userId: string;
    userName: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    contacts: SOSContact[];
    status: string;
    timestamp: string;
  };
}

export interface SOSStatusUpdate {
  type: "SOS_STATUS_UPDATE";
  payload: {
    alertId: string;
    userId: string;
    status: string;
    timestamp: string;
  };
}

export interface SOSConfirmation {
  type: "SOS_CONFIRMED";
  payload: {
    alertId: string;
    status: string;
    message: string;
    timestamp: string;
  };
}

export type IncomingMessage = LocationMessage | ChatAskMessage | EmergencySOSMessage | SOSResolveMessage | SOSAcknowledgeMessage;
export type OutgoingMessage = RiskAlertMessage | SOSAlertBroadcast | SOSStatusUpdate | SOSConfirmation;
