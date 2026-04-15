import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import MapView, { Marker, Circle, PROVIDER_GOOGLE } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Map,
  Users,
  Crosshair,
  Navigation,
  Clock,
  Gauge,
  Signal,
  X,
  Locate,
  Eye,
} from "lucide-react-native";
import { useSocket } from "../../store/SocketContext";
import { DELHI_REGION, MAP_STYLE } from "../../constants/mapData";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const COLORS = {
  primary: "#21100B",
  accent: "#4A4341",
  background: "#F2F2F2",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  live: "#10B981",
  error: "#D93636",
  warning: "#F59E0B",
  info: "#3B82F6",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  iconBg: "rgba(33, 16, 11, 0.04)",
};

// ─── INTERFACES ─────────────────────────────────────────────────
interface UserNode {
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
  lastSeen: number;
}

interface UserInfo {
  id: string;
  name: string;
  phone: string;
}

// ─── HELPERS ────────────────────────────────────────────────────
function getRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  if (diff < 5000) return "Just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

function getAvatarUrl(index: number): string {
  return `https://avatar.iran.liara.run/public/${(index % 100) + 1}`;
}

function formatSpeed(speedMs: number | undefined): string {
  if (!speedMs || speedMs < 0) return "0.0 km/h";
  return `${(speedMs * 3.6).toFixed(1)} km/h`;
}

// ─── ANIMATED MARKER COMPONENT ──────────────────────────────────
const PulsingMarker = React.memo(
  ({ user, index, isSelected, onPress }: {
    user: UserNode;
    index: number;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.6)).current;

    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.8,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }, []);

    return (
      <Marker
        key={user.userId}
        coordinate={{ latitude: user.latitude, longitude: user.longitude }}
        onPress={onPress}
        tracksViewChanges={false}
        anchor={{ x: 0.5, y: 0.5 }}
      >
        <View style={styles.markerWrapper}>
          {/* Outer pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
                borderColor: isSelected ? COLORS.info : COLORS.live,
                backgroundColor: isSelected
                  ? "rgba(59, 130, 246, 0.15)"
                  : "rgba(16, 185, 129, 0.15)",
              },
            ]}
          />
          {/* Avatar container */}
          <View
            style={[
              styles.markerAvatarContainer,
              isSelected && styles.markerAvatarContainerSelected,
            ]}
          >
            <Avatar.Image
              size={32}
              source={{ uri: getAvatarUrl(index) }}
            />
          </View>
          {/* Heading indicator */}
          {user.heading !== undefined && user.heading !== null && (user.speed ?? 0) > 0.5 && (
            <View
              style={[
                styles.headingArrow,
                { transform: [{ rotate: `${user.heading}deg` }] },
              ]}
            >
              <Navigation size={12} color={COLORS.live} strokeWidth={3} fill={COLORS.live} />
            </View>
          )}
          {/* Name label */}
          <View style={styles.markerLabel}>
            <Text style={styles.markerLabelText} numberOfLines={1}>
              {user.name?.split(" ")[0] || "User"}
            </Text>
          </View>
        </View>
      </Marker>
    );
  }
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────
export default function AdminMapScreen() {
  const insets = useSafeAreaInsets();
  const { onUserLocation, onLiveUsersCount, onUserActivity, isConnected } = useSocket();
  const mapRef = useRef<MapView>(null);

  // State
  const [activeUsers, setActiveUsers] = useState<Record<string, UserNode>>({});
  const [selectedUser, setSelectedUser] = useState<UserNode | null>(null);
  const [userDirectory, setUserDirectory] = useState<Record<string, UserInfo>>({});
  const [showUserList, setShowUserList] = useState(false);
  const [serverLiveCount, setServerLiveCount] = useState(0);
  const [, setTick] = useState(0);

  // Animations
  const headerFade = useRef(new Animated.Value(0)).current;
  const panelSlide = useRef(new Animated.Value(300)).current;
  const listSlide = useRef(new Animated.Value(-SCREEN_WIDTH)).current;

  // Entry animation
  useEffect(() => {
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // ─── LIVE USERS COUNT — authoritative sync from server ────────
  useEffect(() => {
    const unsub = onLiveUsersCount((event) => {
      const { count, activeUserIds } = event.payload;
      setServerLiveCount(count);
      console.log(`[AdminMap] 🟢 Live users from server: ${count} | IDs: [${(activeUserIds || []).join(", ")}]`);

      // Prune users who are no longer in the server's active list
      if (activeUserIds && activeUserIds.length >= 0) {
        const serverSet = new Set(activeUserIds);
        setActiveUsers((prev) => {
          const next = { ...prev };
          let changed = false;
          for (const id of Object.keys(next)) {
            if (!serverSet.has(id)) {
              console.log(`[AdminMap] 🔴 Removing disconnected user: "${next[id].name}" (${id})`);
              // Close selected panel if this user was selected
              setSelectedUser((sel) => (sel?.userId === id ? null : sel));
              delete next[id];
              changed = true;
            }
          }
          if (changed) {
            console.log(`[AdminMap] 📊 After prune: ${Object.keys(next).length} users on map`);
          }
          return changed ? next : prev;
        });
      }
    });
    return () => unsub();
  }, [onLiveUsersCount]);

  // ─── USER SESSION (LOGIN / LOGOUT) — instant removal ──────────
  useEffect(() => {
    const unsub = onUserActivity((event) => {
      const { userId, userName, action } = event.payload;
      if (action === "LOGOUT") {
        console.log(`[AdminMap] 🚪 User logged out: "${userName}" (${userId})`);
        setActiveUsers((prev) => {
          if (!prev[userId]) return prev;
          const next = { ...prev };
          delete next[userId];
          return next;
        });
        setSelectedUser((sel) => (sel?.userId === userId ? null : sel));
      } else if (action === "LOGIN") {
        console.log(`[AdminMap] 🟢 User logged in: "${userName}" (${userId})`);
      }
    });
    return () => unsub();
  }, [onUserActivity]);

  // Tick for relative time
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── FETCH USER DIRECTORY (names/phones) ─────────────────────
  useEffect(() => {
    const fetchUserDirectory = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/stats/users`);
        const data = await res.json();
        if (data.users) {
          const directory: Record<string, UserInfo> = {};
          data.users.forEach((u: UserInfo) => {
            directory[u.id] = u;
          });
          setUserDirectory(directory);
        }
      } catch (err) {
        console.error("[AdminMap] Failed to fetch user directory:", err);
      }
    };

    fetchUserDirectory();
  }, []);

  // ─── REAL-TIME LOCATION UPDATES ──────────────────────────────
  useEffect(() => {
    const unsub = onUserLocation((event) => {
      setActiveUsers((prev) => {
        const userName = userDirectory[event.userId]?.name || `User-${event.userId.substring(0, 6)}`;
        const next = {
          ...prev,
          [event.userId]: {
            userId: event.userId,
            name: userName,
            latitude: event.latitude,
            longitude: event.longitude,
            accuracy: event.accuracy,
            heading: event.heading,
            speed: event.speed,
            lastSeen: Date.now(),
          },
        };
        console.log(`[AdminMap] 📍 Location update from "${userName}" — Total tracked: ${Object.keys(next).length}`);
        return next;
      });

      // Update selected user if it's the same
      setSelectedUser((prev) => {
        if (prev && prev.userId === event.userId) {
          return {
            ...prev,
            latitude: event.latitude,
            longitude: event.longitude,
            accuracy: event.accuracy,
            heading: event.heading,
            speed: event.speed,
            lastSeen: Date.now(),
          };
        }
        return prev;
      });
    });

    // Safety-net cleanup: remove users not heard from in 60s
    const interval = setInterval(() => {
      setActiveUsers((prev) => {
        const now = Date.now();
        let changed = false;
        const next = { ...prev };
        for (const [id, user] of Object.entries(next)) {
          if (now - user.lastSeen > 60000) {
            console.log(`[AdminMap] ⏰ Stale cleanup: "${user.name}" (${id}) — last seen ${Math.round((now - user.lastSeen) / 1000)}s ago`);
            delete next[id];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 15000);

    return () => {
      unsub();
      clearInterval(interval);
    };
  }, [onUserLocation, userDirectory]);

  // Update names when directory loads
  useEffect(() => {
    setActiveUsers((prev) => {
      const updated = { ...prev };
      let changed = false;
      for (const [id, user] of Object.entries(updated)) {
        const dirName = userDirectory[id]?.name;
        if (dirName && user.name !== dirName) {
          updated[id] = { ...user, name: dirName };
          changed = true;
        }
      }
      return changed ? updated : prev;
    });
  }, [userDirectory]);

  const usersList = Object.values(activeUsers);

  // ─── MAP CONTROLS ────────────────────────────────────────────
  const fitAllUsers = useCallback(() => {
    if (!mapRef.current || usersList.length === 0) return;

    if (usersList.length === 1) {
      mapRef.current.animateToRegion(
        {
          latitude: usersList[0].latitude,
          longitude: usersList[0].longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        800
      );
      return;
    }

    const coords = usersList.map((u) => ({
      latitude: u.latitude,
      longitude: u.longitude,
    }));
    mapRef.current.fitToCoordinates(coords, {
      edgePadding: { top: 120, right: 60, bottom: 200, left: 60 },
      animated: true,
    });
  }, [usersList]);

  const focusUser = useCallback((user: UserNode) => {
    setSelectedUser(user);
    setShowUserList(false);
    Animated.spring(listSlide, {
      toValue: -SCREEN_WIDTH,
      useNativeDriver: true,
    }).start();

    Animated.spring(panelSlide, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 9,
    }).start();

    mapRef.current?.animateToRegion(
      {
        latitude: user.latitude,
        longitude: user.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      800
    );
  }, []);

  const closePanel = useCallback(() => {
    Animated.timing(panelSlide, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedUser(null));
  }, []);

  const toggleUserList = useCallback(() => {
    setShowUserList((prev) => {
      Animated.spring(listSlide, {
        toValue: prev ? -SCREEN_WIDTH : 0,
        useNativeDriver: true,
        tension: 50,
        friction: 9,
      }).start();
      return !prev;
    });
  }, []);

  // ─── RENDER ──────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* ── Full-bleed Map ── */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={DELHI_REGION}
        customMapStyle={MAP_STYLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass
        showsScale
        rotateEnabled
        pitchEnabled
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        mapPadding={{ top: insets.top + 90, right: 0, bottom: 100, left: 0 }}
      >
        {/* Accuracy circles */}
        {usersList.map((user) =>
          user.accuracy && user.accuracy > 0 ? (
            <Circle
              key={`circle-${user.userId}`}
              center={{ latitude: user.latitude, longitude: user.longitude }}
              radius={Math.min(user.accuracy, 500)}
              fillColor="rgba(16, 185, 129, 0.08)"
              strokeColor="rgba(16, 185, 129, 0.25)"
              strokeWidth={1}
            />
          ) : null
        )}

        {/* User markers */}
        {usersList.map((user, index) => (
          <PulsingMarker
            key={user.userId}
            user={user}
            index={index}
            isSelected={selectedUser?.userId === user.userId}
            onPress={() => focusUser(user)}
          />
        ))}
      </MapView>

      {/* ── Floating Glass Header ── */}
      <Animated.View
        style={[
          styles.headerGlass,
          { 
            top: Math.max(insets.top, 20) + 10, 
            opacity: headerFade,
            zIndex: 100,
            elevation: 100
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Global Tracking</Text>
            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: isConnected ? COLORS.live : COLORS.error,
                  },
                ]}
              />
              <Text style={styles.statusText}>
                {isConnected
                  ? `${usersList.length} on Map · ${serverLiveCount} Online`
                  : "Reconnecting…"}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.iconBox}
            onPress={toggleUserList}
            activeOpacity={0.8}
          >
            <Users size={22} color={COLORS.primary} strokeWidth={2} />
            {usersList.length > 0 && (
              <View style={styles.userCountBadge}>
                <Text style={styles.userCountBadgeText}>{usersList.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Map Controls ── */}
      <View style={[styles.controlsColumn, { bottom: selectedUser ? 250 : 110, zIndex: 100, elevation: 100 }]}>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={fitAllUsers}
          activeOpacity={0.8}
        >
          <Crosshair size={22} color={COLORS.primary} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={toggleUserList}
          activeOpacity={0.8}
        >
          <Eye size={22} color={COLORS.primary} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── User List Sidebar ── */}
      <Animated.View
        style={[
          styles.userListPanel,
          {
            top: Math.max(insets.top, 20) + 90,
            transform: [{ translateX: listSlide }],
            zIndex: 100,
            elevation: 100,
          },
        ]}
      >
        <View style={styles.userListHeader}>
          <Text style={styles.userListTitle}>Active Users</Text>
          <TouchableOpacity onPress={toggleUserList}>
            <X size={20} color={COLORS.textMuted} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.userListScroll}
          showsVerticalScrollIndicator={false}
        >
          {usersList.length === 0 ? (
            <View style={styles.emptyListState}>
              <Signal size={32} color={COLORS.textMuted} strokeWidth={1.5} />
              <Text style={styles.emptyListText}>No active users</Text>
              <Text style={styles.emptyListSubtext}>
                Users will appear here when they open their map
              </Text>
            </View>
          ) : (
            usersList.map((user, index) => (
              <TouchableOpacity
                key={user.userId}
                style={[
                  styles.userListItem,
                  selectedUser?.userId === user.userId &&
                    styles.userListItemSelected,
                ]}
                onPress={() => focusUser(user)}
                activeOpacity={0.8}
              >
                <View style={styles.userListAvatar}>
                  <Avatar.Image
                    size={36}
                    source={{ uri: getAvatarUrl(index) }}
                  />
                  <View style={styles.userListOnlineDot} />
                </View>
                <View style={styles.userListInfo}>
                  <Text style={styles.userListName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.userListMeta}>
                    {formatSpeed(user.speed)} · {getRelativeTime(user.lastSeen)}
                  </Text>
                </View>
                <Locate size={16} color={COLORS.textMuted} strokeWidth={2} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </Animated.View>

      {/* ── Selected User Detail Panel ── */}
      {selectedUser && (
        <Animated.View
          style={[
            styles.bottomPanel,
            { transform: [{ translateY: panelSlide }] },
          ]}
        >
          <View style={styles.panelHandle} />

          <View style={styles.panelHeader}>
            <View style={styles.panelUserRow}>
              <View style={styles.panelAvatarWrap}>
                <Avatar.Image
                  size={44}
                  source={{
                    uri: getAvatarUrl(
                      usersList.findIndex(
                        (u) => u.userId === selectedUser.userId
                      )
                    ),
                  }}
                />
                <View style={styles.panelOnlineDot} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.panelUserName}>{selectedUser.name}</Text>
                <Text style={styles.panelUserId}>
                  ID: {selectedUser.userId.substring(0, 12)}…
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={closePanel}
              style={styles.panelCloseBtn}
            >
              <X size={18} color={COLORS.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <View style={styles.panelStatsRow}>
            <View style={styles.panelStatItem}>
              <View
                style={[
                  styles.panelStatIcon,
                  { backgroundColor: `${COLORS.live}12` },
                ]}
              >
                <Gauge size={18} color={COLORS.live} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.panelStatLabel}>Speed</Text>
                <Text style={styles.panelStatValue}>
                  {formatSpeed(selectedUser.speed)}
                </Text>
              </View>
            </View>
            <View style={styles.panelStatItem}>
              <View
                style={[
                  styles.panelStatIcon,
                  { backgroundColor: `${COLORS.info}12` },
                ]}
              >
                <Navigation size={18} color={COLORS.info} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.panelStatLabel}>Heading</Text>
                <Text style={styles.panelStatValue}>
                  {selectedUser.heading
                    ? `${Math.round(selectedUser.heading)}°`
                    : "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.panelStatItem}>
              <View
                style={[
                  styles.panelStatIcon,
                  { backgroundColor: `${COLORS.warning}12` },
                ]}
              >
                <Clock size={18} color={COLORS.warning} strokeWidth={2} />
              </View>
              <View>
                <Text style={styles.panelStatLabel}>Updated</Text>
                <Text style={styles.panelStatValue}>
                  {getRelativeTime(selectedUser.lastSeen)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.panelCoords}>
            <Text style={styles.panelCoordsText}>
              📍 {selectedUser.latitude.toFixed(6)}, {selectedUser.longitude.toFixed(6)}
              {selectedUser.accuracy
                ? `  ±${Math.round(selectedUser.accuracy)}m`
                : ""}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // ─── Header ───────────────────────────
  headerGlass: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
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
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  userCountBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: COLORS.live,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userCountBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.surface,
  },

  // ─── Marker ───────────────────────────
  markerWrapper: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
  },
  markerAvatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: COLORS.live,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    overflow: "hidden",
  },
  markerAvatarContainerSelected: {
    borderColor: COLORS.info,
    borderWidth: 3.5,
  },
  headingArrow: {
    position: "absolute",
    top: 6,
  },
  markerLabel: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(33, 16, 11, 0.85)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  markerLabelText: {
    fontSize: 9,
    fontWeight: "700",
    color: COLORS.surface,
    maxWidth: 60,
    textAlign: "center",
  },

  // ─── Controls ─────────────────────────
  controlsColumn: {
    position: "absolute",
    right: 16,
    gap: 10,
  },
  controlBtn: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },

  // ─── User List Panel ──────────────────
  userListPanel: {
    position: "absolute",
    left: 16,
    width: SCREEN_WIDTH * 0.72,
    maxHeight: 400,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  userListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userListTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  userListScroll: {
    maxHeight: 320,
  },
  userListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 16,
    marginBottom: 6,
    backgroundColor: "rgba(33, 16, 11, 0.02)",
  },
  userListItemSelected: {
    backgroundColor: `${COLORS.info}10`,
    borderWidth: 1,
    borderColor: `${COLORS.info}30`,
  },
  userListAvatar: {
    position: "relative",
  },
  userListOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.live,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  userListInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userListName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  userListMeta: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  emptyListState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyListText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyListSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: "center",
    maxWidth: 180,
  },

  // ─── Bottom Detail Panel ──────────────
  bottomPanel: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 20,
    paddingTop: 12,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  panelHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(33, 16, 11, 0.1)",
    alignSelf: "center",
    marginBottom: 12,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  panelUserRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  panelAvatarWrap: {
    position: "relative",
  },
  panelOnlineDot: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.live,
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  panelUserName: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  panelUserId: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  panelCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.iconBg,
    alignItems: "center",
    justifyContent: "center",
  },
  panelStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  panelStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  panelStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  panelStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  panelStatValue: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 1,
  },
  panelCoords: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 16, 11, 0.06)",
  },
  panelCoordsText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    textAlign: "center",
  },
});
