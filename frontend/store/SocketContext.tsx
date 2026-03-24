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

type IncomingMessage = UserLocationEvent | { type: string; [key: string]: any };

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendLocation: (location: LocationPayload) => void;
  onUserLocation: (callback: (data: UserLocationEvent) => void) => () => void;
}

// ─── CONTEXT ──────────────────────────────────────────────

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendLocation: () => {},
  onUserLocation: () => () => {},
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

  // ─── SUBSCRIBE TO USER_LOCATION (for ADMIN role) ──────

  const onUserLocation = useCallback((callback: (data: UserLocationEvent) => void) => {
    userLocationListeners.current.add(callback);
    return () => {
      userLocationListeners.current.delete(callback);
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
    <SocketContext.Provider value={{ socket, isConnected, sendLocation, onUserLocation }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
