import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef } from "react";
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

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#21100B",
  secondary: "#8C7D79",
  accent: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  white: "#FFFFFF",
};

const STATS = [
  {
    id: "1",
    title: "Total Users",
    value: "2,847",
    icon: "account-group",
    color: "#21100B",
    trend: "+12%",
  },
  {
    id: "2",
    title: "Active Tours",
    value: "156",
    icon: "map-marker-multiple",
    color: "#10B981",
    trend: "+8%",
  },
  {
    id: "3",
    title: "Alerts",
    value: "23",
    icon: "alert-circle",
    color: "#D93636",
    trend: "-5%",
  },
  {
    id: "4",
    title: "Revenue",
    value: "₹4.2L",
    icon: "currency-inr",
    color: "#8C7D79",
    trend: "+18%",
  },
];

const QUICK_ACTIONS = [
  { id: "1", title: "Add User", icon: "account-plus", color: "#21100B" },
  { id: "2", title: "New Alert", icon: "bell-plus", color: "#D93636" },
  { id: "3", title: "View Map", icon: "map-search", color: "#10B981" },
  { id: "4", title: "Reports", icon: "file-chart", color: "#8C7D79" },
];

const RECENT_ACTIVITIES = [
  {
    id: "1",
    action: "New user registered",
    user: "John Doe",
    time: "5 min ago",
    icon: "account-plus",
    color: "#10B981",
  },
  {
    id: "2",
    action: "SOS alert triggered",
    user: "Jane Smith",
    time: "15 min ago",
    icon: "alert",
    color: "#D93636",
  },
  {
    id: "3",
    action: "Tour completed",
    user: "Mike Wilson",
    time: "1 hour ago",
    icon: "check-circle",
    color: "#21100B",
  },
  {
    id: "4",
    action: "Feedback received",
    user: "Sarah Connor",
    time: "2 hours ago",
    icon: "message-text",
    color: "#F59E0B",
  },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#21100B", "#4A4341"]}
          style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}
        >
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Avatar.Image
                size={48}
                source={{
                  uri: user?.avatar || "https://avatar.iran.liara.run/public/1",
                }}
              />
              <View style={styles.greeting}>
                <Text style={styles.greetingText}>Admin Dashboard</Text>
                <Text style={styles.userName}>
                  {user?.name || "Administrator"}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={24}
                color={COLORS.white}
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
                      <MaterialCommunityIcons
                        name={stat.icon as any}
                        size={24}
                        color={stat.color}
                      />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statTitle}>{stat.title}</Text>
                    <View style={styles.trendContainer}>
                      <MaterialCommunityIcons
                        name={
                          stat.trend.startsWith("+")
                            ? "trending-up"
                            : "trending-down"
                        }
                        size={14}
                        color={
                          stat.trend.startsWith("+")
                            ? COLORS.success
                            : COLORS.error
                        }
                      />
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

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              {QUICK_ACTIONS.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionItem}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: `${action.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={28}
                      color={action.color}
                    />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.title}</Text>
                </TouchableOpacity>
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
              {RECENT_ACTIVITIES.map((activity, index) => (
                <View
                  key={activity.id}
                  style={[
                    styles.activityItem,
                    index < RECENT_ACTIVITIES.length - 1 &&
                      styles.activityBorder,
                  ]}
                >
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: `${activity.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={activity.icon as any}
                      size={20}
                      color={activity.color}
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

          {/* System Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>System Status</Text>
            <Card style={styles.statusCard}>
              <Card.Content>
                <View style={styles.statusRow}>
                  <View style={styles.statusItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: COLORS.success },
                      ]}
                    />
                    <Text style={styles.statusLabel}>Server</Text>
                    <Text style={styles.statusValue}>Online</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: COLORS.success },
                      ]}
                    />
                    <Text style={styles.statusLabel}>Database</Text>
                    <Text style={styles.statusValue}>Connected</Text>
                  </View>
                  <View style={styles.statusItem}>
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: COLORS.accent },
                      ]}
                    />
                    <Text style={styles.statusLabel}>API</Text>
                    <Text style={styles.statusValue}>99.9%</Text>
                  </View>
                </View>
              </Card.Content>
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
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
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
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
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
    borderRadius: 16,
    elevation: 2,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
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
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  activityCard: {
    borderRadius: 16,
    elevation: 2,
    padding: 4,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    color: COLORS.textLight,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  statusCard: {
    borderRadius: 16,
    elevation: 2,
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
    color: COLORS.textLight,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 2,
  },
});
