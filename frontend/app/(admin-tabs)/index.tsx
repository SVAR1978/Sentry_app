import {
  AlertTriangle,
  Bell,
  CheckCircle,
  LogOut,
  MessageSquare,
  Navigation,
  Plus,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar, Card, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";
import { useSocket } from "../../store/SocketContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  headerDark: "#21100B",
  headerMid: "#38302E",
  primary: "#21100B",
  accent: "#38302E",
  secondary: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  warning: "#F59E0B",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  border: "#EDE7E3",
};

const STATS = [
  {
    id: "1",
    title: "Total Users",
    value: "2,847",
    icon: Users,
    color: "#21100B",
    trend: "+12%",
  },
  {
    id: "2",
    title: "Active Tours",
    value: "156",
    icon: Navigation,
    color: "#10B981",
    trend: "+8%",
  },
];



const INITIAL_ACTIVITIES = [
  {
    id: "1",
    action: "New user registered",
    user: "John Doe",
    time: "5 min ago",
    icon: UserPlus,
    color: "#10B981",
  },
  {
    id: "2",
    action: "SOS alert triggered",
    user: "Jane Smith",
    time: "15 min ago",
    icon: AlertTriangle,
    color: "#D93636",
  },
  {
    id: "3",
    action: "Tour completed",
    user: "Mike Wilson",
    time: "1 hour ago",
    icon: CheckCircle,
    color: "#21100B",
  },
  {
    id: "4",
    action: "Feedback received",
    user: "Sarah Connor",
    time: "2 hours ago",
    icon: MessageSquare,
    color: "#F59E0B",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { onUserActivity } = useSocket();
  const insets = useSafeAreaInsets();
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Real-time Activity Tracking
  useEffect(() => {
    const unsubscribe = onUserActivity((event) => {
      const newActivity = {
        id: Date.now().toString(),
        action: event.payload.action === "LOGIN" ? "User logged in" : "User logged out",
        user: event.payload.userName,
        time: "Just now",
        icon: event.payload.action === "LOGIN" ? UserPlus : LogOut,
        color: event.payload.action === "LOGIN" ? COLORS.success : COLORS.secondary,
      };

      setActivities((prev) => [newActivity, ...prev.slice(0, 9)]);
    });

    return unsubscribe;
  }, [onUserActivity]);

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

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/admin-login");
  };

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
            <View style={styles.userInfo}>
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
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell
                size={22}
                color={COLORS.white}
                strokeWidth={2}
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Welcome back, Admin!</Text>
          <Text style={styles.headerSubtitle}>
            Here's what's happening with your platform today
          </Text>
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
              {STATS.map((stat) => (
                <Card key={stat.id} style={styles.statCard}>
                  <Card.Content style={styles.statContent}>
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
                      {stat.trend.startsWith("+") ? (
                        <TrendingUp size={14} color={COLORS.success} />
                      ) : (
                        <TrendingDown size={14} color={COLORS.error} />
                      )}
                      <Text
                        style={[
                          styles.trendText,
                          {
                            color: stat.trend.startsWith("+")
                              ? COLORS.success
                              : COLORS.error,
                          },
                        ]}
                      >
                        {stat.trend}
                      </Text>
                    </View>
                  </Card.Content>
                </Card>
              ))}
            </View>
          </View>


          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            <Card style={styles.activityCard}>
              {activities.map((activity, index) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    index < activities.length - 1 &&
                      styles.activityBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: `${activity.color}12` },
                    ]}
                  >
                    <activity.icon
                      size={18}
                      color={activity.color}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activityUser}>{activity.user}</Text>
                  </View>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              ))}
            </Card>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
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
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.error,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontWeight: "500",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    width: (SCREEN_WIDTH - 80) / 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
  },
  activityCard: {
    borderRadius: 20,
    elevation: 3,
    padding: 4,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
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
  activityTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  statusCard: {
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statusItem: {
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  statusLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 2,
  },
});
