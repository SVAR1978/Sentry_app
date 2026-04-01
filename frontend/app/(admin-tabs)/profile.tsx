import {
  Award,
  Bell,
  ChevronRight,
  HelpCircle,
  History,
  Key,
  Lock,
  LogOut,
  Palette,
  ShieldCheck,
  User,
} from "lucide-react-native";
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
  headerDark: "#21100B",
  headerMid: "#38302E",
  primary: "#21100B",
  accent: "#38302E",
  secondary: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  border: "#EDE7E3",
};

const ADMIN_MENU = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
    color: "#1E40AF",
  },
  {
    id: "security",
    title: "Security Settings",
    icon: Lock,
    color: "#10B981",
  },
  { id: "activity", title: "Activity Log", icon: History, color: "#8B5CF6" },
  {
    id: "permissions",
    title: "My Permissions",
    icon: Key,
    color: "#F59E0B",
  },
];

const QUICK_SETTINGS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    color: "#F59E0B",
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
    color: "#EC4899",
  },
  {
    id: "help",
    title: "Help Center",
    icon: HelpCircle,
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
                <ShieldCheck
                  size={16}
                  color={COLORS.white}
                  strokeWidth={2.5}
                />
              </View>
            </View>
            <Text style={styles.userName}>{user?.name || "Administrator"}</Text>

             <View style={styles.roleContainer}>
              <Award
                size={14}
                color={COLORS.white}
                strokeWidth={2.5}
              />
              <Text style={styles.roleText}>Super Administrator</Text>
            </View>
          </View>
        </LinearGradient>


        {/* Admin Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.menuCard}>
            {ADMIN_MENU.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}12` },
                    ]}
                  >
                    <item.icon
                      size={20}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <ChevronRight
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
                {index < ADMIN_MENU.length - 1 && <Divider style={styles.menuDivider} />}
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
                <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}12` },
                    ]}
                  >
                    <item.icon
                      size={20}
                      color={item.color}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <ChevronRight
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
                {index < QUICK_SETTINGS.length - 1 && <Divider style={styles.menuDivider} />}
              </React.Fragment>
            ))}
          </Card>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut
              size={20}
              color={COLORS.error}
              strokeWidth={2.5}
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
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.2)",
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
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 12,
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
    fontWeight: "500",
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },

  menuCard: {
    borderRadius: 20,
    elevation: 3,
    overflow: "hidden",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  menuDivider: {
    backgroundColor: COLORS.border,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 16,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.error,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textMuted,
    marginVertical: 24,
    fontWeight: "500",
  },
});
