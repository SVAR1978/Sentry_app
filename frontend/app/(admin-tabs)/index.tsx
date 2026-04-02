import {
  AlertTriangle,
  Bell,
  CheckCircle,
  LogOut,
  Navigation,
  Shield,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Wifi,
  WifiOff,
  Clock,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";
import { useSocket } from "../../store/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";


const COLORS = {
  headerDark: "#21100B",
  headerMid: "#4A4341",
  primary: "#21100B",
  accent: "#4A4341",
  secondary: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  background: "#F2F2F2",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  border: "#EDE7E3",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  iconBg: "rgba(33, 16, 11, 0.04)",
};

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ─── TYPES ────────────────────────────────────────────────────────
interface ActivityItem {
  id: string;
  type: "LOGIN" | "LOGOUT" | "SIGNUP" | "RISK_ALERT" | "SOS" | "SYSTEM";
  action: string;
  user: string;
  timestamp: string; // ISO string
  read?: boolean;
}

// ─── HELPERS ──────────────────────────────────────────────────────

function getRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "Just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 10) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "LOGIN":
      return { Icon: UserPlus, color: COLORS.success };
    case "LOGOUT":
      return { Icon: LogOut, color: COLORS.secondary };
    case "SIGNUP":
      return { Icon: UserPlus, color: COLORS.info };
    case "RISK_ALERT":
      return { Icon: AlertTriangle, color: COLORS.error };
    case "SOS":
      return { Icon: Shield, color: COLORS.error };
    case "SYSTEM":
    default:
      return { Icon: CheckCircle, color: COLORS.primary };
  }
}



// ─── COMPONENT ────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { onUserActivity, onLiveUsersCount, isConnected } = useSocket();
  const insets = useSafeAreaInsets();

  // ─── STATE ────────────────────────────────────────────────
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<ActivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [liveUsers, setLiveUsers] = useState<number>(0);


  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const bellShake = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Timer for relative time updates
  const [, setTick] = useState(0);

  // ─── BELL SHAKE ANIMATION ─────────────────────────────────
  const shakeBell = useCallback(() => {
    Animated.sequence([
      Animated.timing(bellShake, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(bellShake, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(bellShake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(bellShake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(bellShake, { toValue: 5, duration: 60, useNativeDriver: true }),
      Animated.timing(bellShake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [bellShake]);

  // ─── PULSE ANIMATION FOR LIVE INDICATOR ────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // ─── TICK for relative time updates every 30s ──────────────
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  // ─── FETCH INITIAL DATA ───────────────────────────────────
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch(`${BACKEND_URL}/stats`);
        const statsData = await statsRes.json();
        if (statsData.totalUsers !== undefined) {
          setTotalUsers(statsData.totalUsers);
        }

        // Fetch recent activity
        const activityRes = await fetch(`${BACKEND_URL}/stats/recent-activity`);
        const activityData = await activityRes.json();
        if (activityData.activities) {
          const mapped: ActivityItem[] = activityData.activities.map((a: any) => ({
            id: a.id,
            type: a.type as ActivityItem["type"],
            action: a.action,
            user: a.user,
            timestamp: a.timestamp,
            read: true, // Historical data → already "read"
          }));
          setActivities(mapped);
        }


      } catch (error) {
        console.error("[AdminDashboard] Failed to fetch initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  // ─── REAL-TIME: LIVE USERS COUNT ──────────────────────────
  useEffect(() => {
    const unsubscribe = onLiveUsersCount((event) => {
      setLiveUsers(event.payload.count);
    });
    return unsubscribe;
  }, [onLiveUsersCount]);

  // ─── REAL-TIME: USER ACTIVITY (LOGIN/LOGOUT/SIGNUP) ───────
  useEffect(() => {
    const unsubscribe = onUserActivity((event) => {
      const actionLabels: Record<string, string> = {
        LOGIN: "User logged in",
        LOGOUT: "User logged out",
        SIGNUP: "New user registered",
      };

      const newActivity: ActivityItem = {
        id: `ws-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        type: event.payload.action,
        action: actionLabels[event.payload.action] || event.payload.action,
        user: event.payload.userName,
        timestamp: event.payload.timestamp || new Date().toISOString(),
        read: false,
      };

      // Add to activities feed (capped at 50)
      setActivities((prev) => [newActivity, ...prev].slice(0, 50));

      // Add to notifications (capped at 30)
      setNotifications((prev) => [newActivity, ...prev].slice(0, 30));

      // Increment unread
      setUnreadCount((prev) => prev + 1);

      // Update total users on SIGNUP
      if (event.payload.action === "SIGNUP") {
        setTotalUsers((prev) => prev + 1);
      }

      // Shake the bell
      shakeBell();
    });

    return unsubscribe;
  }, [onUserActivity, shakeBell]);

  // ─── ENTRY ANIMATION ──────────────────────────────────────
  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/role-selection");
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, [user]);

  if (!user) return null;

  // ─── HANDLERS ─────────────────────────────────────────────
  const handleLogout = async () => {
    // Call the backend logout endpoint to publish the LOGOUT event
    try {
      const token = await AsyncStorage.getItem("@sentryapp:token");
      if (token) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.warn("[AdminDashboard] Logout API call failed:", err);
    }
    await logout();
    router.replace("/(auth)/admin-login");
  };

  const handleBellPress = () => {
    setShowNotifications(true);
    // Mark all as read
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // ─── STATS DATA ───────────────────────────────────────────
  const dynamicStats = [
    {
      id: "1",
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: Users,
      color: "#21100B",
      trend: "All Time",
    },
    {
      id: "2",
      title: "Live Users",
      value: liveUsers.toString(),
      icon: Navigation,
      color: "#10B981",
      trend: "Now",
    },
  ];

  // ─── RENDER ───────────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.headerDark, COLORS.headerMid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 16 }]}
        >
          {/* Decorative blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.userInfo} 
              onPress={() => router.push("/(admin-tabs)/profile")} 
              activeOpacity={0.8}
            >
              <View style={styles.avatarRing}>
                <Avatar.Image
                  size={48}
                  source={{
                    uri: user?.avatar || "https://avatar.iran.liara.run/public/1",
                  }}
                />
              </View>
              <View style={styles.greeting}>
                <Text style={styles.greetingText}>Admin Dashboard</Text>
                <Text style={styles.userName}>
                  {user?.name || "Administrator"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* ── NOTIFICATION BELL ── */}
            <TouchableOpacity style={styles.notificationBtn} onPress={handleBellPress}>
              <Animated.View style={{ transform: [{ rotate: bellShake.interpolate({
                inputRange: [-15, 15],
                outputRange: ['-15deg', '15deg'],
              }) }] }}>
                <Bell size={22} color={COLORS.white} strokeWidth={2} />
              </Animated.View>
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Welcome back, Admin!</Text>
          <View style={styles.connectionStatus}>
            {isConnected ? (
              <>
                <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                <Wifi size={12} color="rgba(255,255,255,0.7)" strokeWidth={2} />
                <Text style={styles.connectionText}>Live</Text>
              </>
            ) : (
              <>
                <View style={[styles.liveDot, { backgroundColor: COLORS.error }]} />
                <WifiOff size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                <Text style={[styles.connectionText, { color: "rgba(255,255,255,0.5)" }]}>Reconnecting…</Text>
              </>
            )}
          </View>
        </LinearGradient>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Stats Grid */}
          <View style={styles.section}>
            <View style={styles.statsGrid}>
              {dynamicStats.map((stat) => (
                <Card key={stat.id} style={styles.statCard}>
                  <Card.Content style={styles.statContent}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={stat.id === "2" ? () => router.push("/(admin-tabs)/map") : undefined}
                      style={{ alignItems: "center", width: "100%" }}
                    >
                      <View
                        style={[
                          styles.statIcon,
                          { backgroundColor: `${stat.color}15` },
                        ]}
                      >
                        <stat.icon
                          size={24}
                          color={stat.color}
                          strokeWidth={2}
                        />
                      </View>
                      <Text style={styles.statValue}>{stat.value}</Text>
                      <Text style={styles.statTitle}>{stat.title}</Text>
                      <View style={styles.trendContainer}>
                        <TrendingUp size={14} color={stat.id === "2" ? COLORS.success : COLORS.secondary} />
                        <Text
                          style={[
                            styles.trendText,
                            {
                              color: stat.id === "2"
                                ? COLORS.success
                                : COLORS.secondary,
                            },
                          ]}
                        >
                          {stat.trend}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <View style={styles.sectionHeaderRight}>
                <View style={styles.activityCountBadge}>
                  <Text style={styles.activityCountText}>{activities.length}</Text>
                </View>
              </View>
            </View>

            {activities.length === 0 ? (
              <Card style={styles.activityCard}>
                <View style={styles.emptyState}>
                  <Clock size={32} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.emptyStateText}>No activity yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    User logins, signups, and alerts will appear here in real-time
                  </Text>
                </View>
              </Card>
            ) : (
              <Card style={styles.activityCard}>
                {activities.slice(0, 10).map((activity, index) => {
                  const { Icon, color } = getActivityIcon(activity.type);
                  return (
                    <View
                      key={activity.id}
                      style={[
                        styles.activityItem,
                        index < Math.min(activities.length, 10) - 1 && styles.activityBorder,
                        !activity.read && styles.activityUnread,
                      ]}
                    >
                      <View
                        style={[
                          styles.activityIcon,
                          { backgroundColor: `${color}12` },
                        ]}
                      >
                        <Icon size={18} color={color} strokeWidth={2} />
                      </View>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityAction}>{activity.action}</Text>
                        <Text style={styles.activityUser}>{activity.user}</Text>
                      </View>
                      <View style={styles.activityTimeContainer}>
                        <Text style={styles.activityTime}>
                          {getRelativeTime(activity.timestamp)}
                        </Text>
                        {!activity.read && <View style={styles.unreadDot} />}
                      </View>
                    </View>
                  );
                })}
              </Card>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── NOTIFICATION PANEL MODAL ── */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowNotifications(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={[styles.notificationPanel, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
                {/* Panel Header */}
                <View style={styles.panelHeader}>
                  <Text style={styles.panelTitle}>Notifications</Text>
                  <View style={styles.panelActions}>
                    {notifications.length > 0 && (
                      <TouchableOpacity onPress={handleClearNotifications} style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>Clear All</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => setShowNotifications(false)} style={styles.closeBtn}>
                      <X size={20} color={COLORS.text} strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Notification Items */}
                <ScrollView
                  style={styles.notificationList}
                  showsVerticalScrollIndicator={false}
                >
                  {notifications.length === 0 ? (
                    <View style={styles.emptyNotifications}>
                      <Bell size={40} color={COLORS.textMuted} strokeWidth={1.5} />
                      <Text style={styles.emptyNotifText}>All caught up!</Text>
                      <Text style={styles.emptyNotifSubtext}>
                        New notifications will appear here
                      </Text>
                    </View>
                  ) : (
                    notifications.map((notif, index) => {
                      const { Icon, color } = getActivityIcon(notif.type);
                      return (
                        <View
                          key={notif.id}
                          style={[
                            styles.notifItem,
                            index < notifications.length - 1 && styles.notifBorder,
                          ]}
                        >
                          <View style={[styles.notifIcon, { backgroundColor: `${color}15` }]}>
                            <Icon size={20} color={color} strokeWidth={2} />
                          </View>
                          <View style={styles.notifContent}>
                            <Text style={styles.notifAction}>{notif.action}</Text>
                            <Text style={styles.notifUser}>{notif.user}</Text>
                            <Text style={styles.notifTime}>{getRelativeTime(notif.timestamp)}</Text>
                          </View>
                        </View>
                      );
                    })
                  )}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    position: "relative",
  },
  blob1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  blob2: {
    position: "absolute",
    bottom: 10,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarRing: {
    padding: 2,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    fontWeight: "600",
  },
  userName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.headerDark,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -1,
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  connectionText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  content: {
    paddingTop: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activityCountBadge: {
    backgroundColor: `${COLORS.primary}12`,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activityCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 24,
    elevation: 3,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: "500",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "700",
  },
  activityCard: {
    borderRadius: 24,
    elevation: 3,
    padding: 4,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  activityUnread: {
    backgroundColor: "rgba(59, 130, 246, 0.04)",
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  activityInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activityAction: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  activityUser: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  activityTimeContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.info,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    maxWidth: 240,
  },

  // ─── MODAL / NOTIFICATION PANEL ───────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-start",
  },
  notificationPanel: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    maxHeight: "75%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  panelActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: `${COLORS.error}10`,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.error,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationList: {
    paddingHorizontal: 16,
  },
  emptyNotifications: {
    alignItems: "center",
    paddingVertical: 50,
    gap: 10,
  },
  emptyNotifText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptyNotifSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
  },
  notifItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  notifBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  notifContent: {
    flex: 1,
    marginLeft: 12,
  },
  notifAction: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },
  notifUser: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  notifTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    fontWeight: "500",
  },
});
