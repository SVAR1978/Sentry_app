import React, { useEffect, useState, useRef, useMemo } from "react";
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Map, Users, Crosshair } from "lucide-react-native";
import { useSocket } from "../../store/SocketContext";
import { DELHI_REGION } from "../../constants/mapData";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Premium styling tokens matching admin dashboard
const COLORS = {
  primary: "#21100B",
  accent: "#4A4341",
  background: "#F2F2F2",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  live: "#10B981",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  iconBg: "rgba(33, 16, 11, 0.04)",
};

// Interface for user location state
interface UserNode {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  lastSeen: number; // timestamp
}

export default function AdminMapScreen() {
  const insets = useSafeAreaInsets();
  const { onUserLocation, isConnected } = useSocket();
  const mapRef = useRef<MapView>(null);

  // State to hold all active users
  const [activeUsers, setActiveUsers] = useState<Record<string, UserNode>>({});
  const [selectedUser, setSelectedUser] = useState<UserNode | null>(null);

  // Setup real-time listener for user locations
  useEffect(() => {
    const unsub = onUserLocation((event) => {
      setActiveUsers((prev) => ({
        ...prev,
        [event.userId]: {
          userId: event.userId,
          latitude: event.latitude,
          longitude: event.longitude,
          accuracy: event.accuracy,
          heading: event.heading,
          speed: event.speed,
          lastSeen: Date.now(),
        },
      }));
    });

    // Cleanup disconnected or stale users every 30 seconds
    const interval = setInterval(() => {
      setActiveUsers((prev) => {
        const now = Date.now();
        let changed = false;
        const next = { ...prev };
        for (const [id, user] of Object.entries(next)) {
          if (now - user.lastSeen > 60000) { // Remove if not heard from in 60s
            delete next[id];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 30000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [onUserLocation]);

  const usersList = Object.values(activeUsers);

  // Center map on all users
  const fitAllUsers = () => {
    if (!mapRef.current || usersList.length === 0) return;
    
    // If only one user, just center on them
    if (usersList.length === 1) {
      mapRef.current.animateToRegion({
        latitude: usersList[0].latitude,
        longitude: usersList[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
      return;
    }

    const coords = usersList.map((u) => ({
      latitude: u.latitude,
      longitude: u.longitude,
    }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 100, right: 50, bottom: 150, left: 50 },
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Full-bleed Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DELHI_REGION}
        showsUserLocation={false}
        mapPadding={{ top: insets.top + 80, right: 0, bottom: 90, left: 0 }}
      >
        {usersList.map((user) => (
          <Marker
            key={user.userId}
            coordinate={{ latitude: user.latitude, longitude: user.longitude }}
            onPress={() => setSelectedUser(user)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerDot} />
              <View style={styles.pulseRing} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Floating Glass Header */}
      <View style={[styles.headerGlass, { top: Math.max(insets.top, 20) + 10 }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Global Tracking</Text>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: isConnected ? COLORS.live : '#D93636' }]} />
              <Text style={styles.statusText}>
                {isConnected ? `${usersList.length} Active Patrols` : 'Connecting...'}
              </Text>
            </View>
          </View>
          <View style={styles.iconBox}>
            <Map size={24} color={COLORS.primary} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab} onPress={fitAllUsers} activeOpacity={0.8}>
          <Crosshair size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Target Info Panel (Bottom) */}
      {selectedUser && (
        <View style={styles.bottomPanel}>
          <View style={styles.panelHeader}>
            <Users size={20} color={COLORS.primary} />
            <Text style={styles.panelTitle}>Active Agent</Text>
            <TouchableOpacity onPress={() => setSelectedUser(null)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>ID</Text>
              <Text style={styles.infoValue}>{selectedUser.userId.substring(0, 8)}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Speed</Text>
              <Text style={styles.infoValue}>
                 {selectedUser.speed ? (selectedUser.speed * 3.6).toFixed(1) : '0.0'} km/h
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoLabel}>Updated</Text>
              <Text style={styles.infoValue}>Just now</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  headerGlass: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: COLORS.textLight,
    fontWeight: "600",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  markerContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(16, 185, 129, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.5)",
  },
  markerDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.live,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 110,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 90,
    left: 20,
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  panelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 8,
    flex: 1,
  },
  closeText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
  },
});
