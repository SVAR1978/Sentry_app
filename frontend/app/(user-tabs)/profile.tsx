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
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

const COLORS = {
  primary: "#10B981",
  secondary: "#0EA5E9",
  accent: "#F59E0B",
  error: "#EF4444",
  background: "#F0FDF4",
  surface: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
};

const MENU_ITEMS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: "account-outline",
    color: "#10B981",
  },
  {
    id: "favorites",
    title: "Saved Places",
    icon: "heart-outline",
    color: "#EC4899",
  },
  {
    id: "history",
    title: "Travel History",
    icon: "history",
    color: "#8B5CF6",
  },
];

const SETTINGS_ITEMS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: "bell-outline",
    color: "#F59E0B",
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: "shield-check-outline",
    color: "#10B981",
  },
  {
    id: "language",
    title: "Language",
    icon: "translate",
    color: "#0EA5E9",
    value: "English",
  },
  {
    id: "help",
    title: "Help & Support",
    icon: "help-circle-outline",
    color: "#6B7280",
  },
  {
    id: "about",
    title: "About App",
    icon: "information-outline",
    color: "#6B7280",
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/user-login");
        },
      },
    ]);
  };

  const handleMenuPress = (id: string) => {
    console.log("Menu pressed:", id);
    // TODO: Navigate to respective screens
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, "#059669"]}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <Avatar.Image
              size={80}
              source={{
                uri: user?.avatar || "https://avatar.iran.liara.run/public/3",
              }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "guest@example.com"}
            </Text>
            <View style={styles.badgeContainer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color={COLORS.white}
              />
              <Text style={styles.badgeText}>Verified Traveler</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                >
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
                {index < MENU_ITEMS.length - 1 && <Divider />}
              </View>
            ))}
          </Card>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Card style={styles.menuCard}>
            {SETTINGS_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                >
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
                  {item.value ? (
                    <Text style={styles.menuValue}>{item.value}</Text>
                  ) : null}
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22}
                    color={COLORS.textLight}
                  />
                </TouchableOpacity>
                {index < SETTINGS_ITEMS.length - 1 && <Divider />}
              </View>
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
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  avatar: {
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.3)",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.white,
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
  menuValue: {
    fontSize: 13,
    color: COLORS.textLight,
    marginRight: 8,
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
