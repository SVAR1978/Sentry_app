import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar, Card, Divider, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../store/AuthContext";

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

const ADMIN_MENU = [
  {
    id: "personal",
    title: "Personal Information",
    icon: "account-outline",
    color: "#1E40AF",
  },
  {
    id: "security",
    title: "Security Settings",
    icon: "shield-lock-outline",
    color: "#10B981",
  },
  { id: "activity", title: "Activity Log", icon: "history", color: "#8B5CF6" },
  {
    id: "permissions",
    title: "My Permissions",
    icon: "key-outline",
    color: "#F59E0B",
  },
];

const QUICK_SETTINGS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: "bell-outline",
    color: "#F59E0B",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: "palette-outline",
    color: "#EC4899",
  },
  {
    id: "help",
    title: "Help Center",
    icon: "help-circle-outline",
    color: "#6B7280",
  },
];

export default function AdminProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout from admin panel?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/admin-login");
        },
      },
    ]);
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
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Avatar.Image
                size={90}
                source={{
                  uri: user?.avatar || "https://avatar.iran.liara.run/public/1",
                }}
                style={styles.avatar}
              />
              <View style={styles.adminBadge}>
                <MaterialCommunityIcons
                  name="shield-crown"
                  size={16}
                  color={COLORS.white}
                />
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || "Administrator"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "admin@sentryapp.com"}
            </Text>
            <View style={styles.roleContainer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color={COLORS.white}
              />
              <Text style={styles.roleText}>Super Administrator</Text>
            </View>
          </View>

          {/* Admin Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>247</Text>
              <Text style={styles.statLabel}>Actions Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Pending Tasks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>99.9%</Text>
              <Text style={styles.statLabel}>Uptime</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Last Login Info */}
        <View style={styles.section}>
          <Card style={styles.loginCard}>
            <Card.Content style={styles.loginContent}>
              <MaterialCommunityIcons
                name="login"
                size={24}
                color={COLORS.success}
              />
              <View style={styles.loginInfo}>
                <Text style={styles.loginTitle}>Last Login</Text>
                <Text style={styles.loginValue}>
                  Today at 9:30 AM • Mumbai, India
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Admin Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.menuCard}>
            {ADMIN_MENU.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={styles.menuItem}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
                {index < ADMIN_MENU.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Quick Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          <Card style={styles.menuCard}>
            {QUICK_SETTINGS.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={styles.menuItem}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={22}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
                {index < QUICK_SETTINGS.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons
              name="logout"
              size={22}
              color={COLORS.error}
            />
            <Text style={styles.logoutText}>Logout from Admin Panel</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.version}>Admin Portal v1.0.0</Text>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  adminBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  loginCard: {
    borderRadius: 16,
    elevation: 2,
  },
  loginContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginInfo: {
    marginLeft: 14,
  },
  loginTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  loginValue: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  menuCard: {
    borderRadius: 16,
    elevation: 2,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.error,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textLight,
    marginVertical: 24,
  },
});
