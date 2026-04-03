import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── TYPES ────────────────────────────────────────────────

interface LocationPayload {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  speed?: number | null;
  heading?: number | null;
  source: "GPS" | "NETWORK";
}

interface UserLocationEvent {
  type: "USER_LOCATION";
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  source: string;
}

interface UserActivityEvent {
  type: "USER_SESSION";
  payload: {
    userId: string;
    userName: string;
    action: "LOGIN" | "LOGOUT" | "SIGNUP";
    timestamp: string;
  };
}

interface LiveUsersCountEvent {
  type: "LIVE_USERS_COUNT";
  payload: {
    count: number;
    activeUserIds?: string[];
  };
}

interface SOSDispatchPayload {
  latitude?: number;
  longitude?: number;
  address?: string;
  contacts: { name: string; phone: string; relationship: string }[];
  userName: string;
}

interface SOSConfirmationEvent {
  type: "SOS_CONFIRMED";
  payload: {
    alertId: string;
    status: string;
    message: string;
    timestamp: string;
  };
}

interface SOSAlertEvent {
  type: "SOS_ALERT";
  payload: {
    alertId: string;
    userId: string;
    userName: string;
    latitude?: number;
    longitude?: number;
    address?: string;
    contacts: { name: string; phone: string; relationship: string }[];
    status: string;
    timestamp: string;
  };
}

interface SOSStatusUpdateEvent {
  type: "SOS_STATUS_UPDATE";
  payload: {
    alertId: string;
    userId: string;
    status: string;
    timestamp: string;
  };
}

type IncomingMessage = UserLocationEvent | UserActivityEvent | LiveUsersCountEvent | SOSConfirmationEvent | SOSAlertEvent | SOSStatusUpdateEvent | { type: "CHAT_RESPONSE"; payload: { answer: string; conversationId?: string } } | { type: "CHAT_ERROR"; payload: { message: string; conversationId?: string } } | { type: string;[key: string]: any };

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendLocation: (location: LocationPayload) => void;
  sendSOS: (payload: SOSDispatchPayload) => void;
  resolveSOSBackend: (alertId: string) => void;
  onUserLocation: (callback: (data: UserLocationEvent) => void) => () => void;
  onUserActivity: (callback: (data: UserActivityEvent) => void) => () => void;
  onLiveUsersCount: (callback: (data: LiveUsersCountEvent) => void) => () => void;
  onSOSAlert: (callback: (data: SOSAlertEvent | SOSStatusUpdateEvent | SOSConfirmationEvent) => void) => () => void;
  sendChatAsk: (question: string, conversationId?: string) => void;
  onChatMessage: (callback: (data: any) => void) => () => void;
}

// ─── CONTEXT ──────────────────────────────────────────────

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendLocation: () => { },
  sendSOS: () => { },
  resolveSOSBackend: () => { },
  onUserLocation: () => () => { },
  onUserActivity: () => () => { },
  onLiveUsersCount: () => () => { },
  onSOSAlert: () => () => { },
  sendChatAsk: () => { },
  onChatMessage: () => () => { },
});

const WS_URL = process.env.EXPO_PUBLIC_WEBSOCKET_URL || "wss://websocket-backend-9p0o.onrender.com";

// ─── PROVIDER ─────────────────────────────────────────────

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const reconnectTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const isConnecting = useRef(false);

  // Store admin callbacks for USER_LOCATION events
  const userLocationListeners = useRef<Set<(data: UserLocationEvent) => void>>(new Set());
  const userActivityListeners = useRef<Set<(data: UserActivityEvent) => void>>(new Set());
  const liveUsersCountListeners = useRef<Set<(data: LiveUsersCountEvent) => void>>(new Set());
  const chatListeners = useRef<Set<(data: any) => void>>(new Set());
  const sosListeners = useRef<Set<(data: SOSAlertEvent | SOSStatusUpdateEvent | SOSConfirmationEvent) => void>>(new Set());

  // ─── CONNECT ──────────────────────────────────────────

  const connectWebSocket = useCallback(async () => {
    // Guard: prevent multiple simultaneous connection attempts
    if (isConnecting.current || socketRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    isConnecting.current = true;

    try {
      const token = await AsyncStorage.getItem("@sentryapp:token");

      if (!token) {
        console.log("[WebSocket] No auth token found. Skipping connection.");
        isConnecting.current = false;
        return;
      }

      // Close any existing stale socket before creating a new one
      if (socketRef.current) {
        socketRef.current.onclose = null; // prevent reconnect loop
        socketRef.current.close();
        socketRef.current = null;
      }

      console.log("[WebSocket] Connecting to:", WS_URL);
      const ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
        console.log("[WebSocket] ✅ Connected successfully!");
        setIsConnected(true);
        isConnecting.current = false;
      };

      ws.onmessage = (event) => {
        try {
          const data: IncomingMessage = JSON.parse(event.data as string);
          console.log("[WebSocket] Received:", data.type);

          // Route USER_LOCATION events to admin listeners
          if (data.type === "USER_LOCATION") {
            for (const listener of userLocationListeners.current) {
              listener(data as UserLocationEvent);
            }
          } else if (data.type === "USER_SESSION") {
            for (const listener of userActivityListeners.current) {
              listener(data as UserActivityEvent);
            }
          } else if (data.type === "LIVE_USERS_COUNT") {
            for (const listener of liveUsersCountListeners.current) {
              listener(data as LiveUsersCountEvent);
            }
          } else if (data.type === "CHAT_RESPONSE" || data.type === "CHAT_ERROR") {
            for (const listener of chatListeners.current) {
              listener(data);
            }
          } else if (data.type === "SOS_CONFIRMED" || data.type === "SOS_ALERT" || data.type === "SOS_STATUS_UPDATE") {
            for (const listener of sosListeners.current) {
              listener(data as SOSAlertEvent | SOSStatusUpdateEvent | SOSConfirmationEvent);
            }
          }
        } catch (err) {
          console.warn("[WebSocket] Failed to parse message:", event.data);
        }
      };

      ws.onclose = () => {
        console.log("[WebSocket] Disconnected.");
        setIsConnected(false);
        setSocket(null);
        socketRef.current = null;
        isConnecting.current = false;

        // Reconnect after 5 seconds
        if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
        reconnectTimeout.current = setTimeout(connectWebSocket, 5000);
      };

      ws.onerror = () => {
        console.log("[WebSocket] Connection error.");
        isConnecting.current = false;
        // onclose will fire after onerror, so reconnect is handled there
      };

      socketRef.current = ws;
      setSocket(ws);
    } catch (error) {
      console.error("[WebSocket] Setup Error:", error);
      isConnecting.current = false;
    }
  }, []);

  // ─── SEND LOCATION (for USER role) ────────────────────

  const sendLocation = useCallback((location: LocationPayload) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message = JSON.stringify({
      type: "LOCATION",
      payload: {
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy ?? undefined,
        speed: location.speed ?? undefined,
        heading: location.heading ?? undefined,
        source: location.source,
      },
    });

    ws.send(message);
  }, []);

  // ─── SEND CHAT (for USER role) ─────────────────────────

  const sendChatAsk = useCallback((question: string, conversationId?: string) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("[WebSocket] Cannot send CHAT_ASK. Not connected.");
      return;
    }

    const message = JSON.stringify({
      type: "CHAT_ASK",
      payload: {
        question,
        conversationId,
      },
    });

    ws.send(message);
  }, []);

  // ─── SEND SOS (for USER role) ──────────────────────────

  const sendSOS = useCallback((payload: SOSDispatchPayload) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("[WebSocket] Cannot send EMERGENCY_SOS. Not connected.");
      return;
    }

    const message = JSON.stringify({
      type: "EMERGENCY_SOS",
      payload: {
        ...payload,
        timestamp: new Date().toISOString(),
      },
    });

    ws.send(message);
    console.log("[WebSocket] EMERGENCY_SOS dispatched to backend");
  }, []);

  // ─── RESOLVE SOS (for USER role) ───────────────────────

  const resolveSOSBackend = useCallback((alertId: string) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("[WebSocket] Cannot send SOS_RESOLVE. Not connected.");
      return;
    }

    const message = JSON.stringify({
      type: "SOS_RESOLVE",
      payload: { alertId },
    });

    ws.send(message);
    console.log(`[WebSocket] SOS_RESOLVE sent for alert ${alertId}`);
  }, []);

  // ─── SUBSCRIBE TO USER_LOCATION (for ADMIN role) ──────

  const onUserLocation = useCallback((callback: (data: UserLocationEvent) => void) => {
    userLocationListeners.current.add(callback);
    return () => {
      userLocationListeners.current.delete(callback);
    };
  }, []);

  const onUserActivity = useCallback((callback: (data: UserActivityEvent) => void) => {
    userActivityListeners.current.add(callback);
    return () => {
      userActivityListeners.current.delete(callback);
    };
  }, []);

  const onLiveUsersCount = useCallback((callback: (data: LiveUsersCountEvent) => void) => {
    liveUsersCountListeners.current.add(callback);
    return () => {
      liveUsersCountListeners.current.delete(callback);
    };
  }, []);

  // ─── SUBSCRIBE TO CHAT MESSAGES ───────────────────────

  const onChatMessage = useCallback((callback: (data: any) => void) => {
    chatListeners.current.add(callback);
    return () => {
      chatListeners.current.delete(callback);
    };
  }, []);

  // ─── SUBSCRIBE TO SOS EVENTS ──────────────────────────

  const onSOSAlert = useCallback((callback: (data: SOSAlertEvent | SOSStatusUpdateEvent | SOSConfirmationEvent) => void) => {
    sosListeners.current.add(callback);
    return () => {
      sosListeners.current.delete(callback);
    };
  }, []);

  // ─── LIFECYCLE ────────────────────────────────────────

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (socketRef.current) {
        socketRef.current.onclose = null; // prevent reconnect on unmount
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connectWebSocket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, sendLocation, sendSOS, resolveSOSBackend, onUserLocation, onUserActivity, onLiveUsersCount, onSOSAlert, sendChatAsk, onChatMessage }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
