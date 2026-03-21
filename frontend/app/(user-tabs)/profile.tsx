import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
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
import { Avatar, Divider, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

const COLORS = {
  primary: "#21100B",
  background: "#F5F1EE",
  surfaceContainerLow: "#EDE7E3",
  surfaceContainer: "#FFFFFF",
  surfaceContainerHigh: "#EDE7E3",
  surfaceContainerHighest: "#8C7D79",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  secondary: "#4A4341",
  accent: "#8C7D79",
};

const MENU_ITEMS = [
  {
    id: "personal",
    title: "Personal Information",
    icon: "account-outline",
    color: "#62DCA3",
    subtitle: "Edit your profile",
  },
  {
    id: "favorites",
    title: "Saved Places",
    icon: "heart-outline",
    color: "#FF385C",
    subtitle: "View saved destinations",
  },
  {
    id: "history",
    title: "Travel History",
    icon: "history",
    color: "#8B5CF6",
    subtitle: "Your past journeys",
  },
];

const SETTINGS_ITEMS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: "bell-outline",
    color: "#F59E0B",
    subtitle: "Manage alerts",
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: "shield-check-outline",
    color: "#62DCA3",
    subtitle: "Control your data",
  },
  {
    id: "language",
    title: "Language",
    icon: "translate",
    color: "#4F8EF7",
    value: "English",
    subtitle: "App language",
  },
  {
    id: "help",
    title: "Help & Support",
    icon: "help-circle-outline",
    color: "#8A9BB8",
    subtitle: "Get assistance",
  },
  {
    id: "about",
    title: "About App",
    icon: "information-outline",
    color: "#8A9BB8",
    subtitle: "Version 1.0.0",
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();

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
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <LinearGradient
          colors={["#EDE7E3", "#F5F1EE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Math.max(insets.top, 24) }]}
        >
          {/* Background decoration circles */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          {/* Avatar Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={88}
                source={{
                  uri: user?.avatar || "https://avatar.iran.liara.run/public/3",
                }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarBtn}>
                <MaterialCommunityIcons name="camera" size={14} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
            <Text style={styles.userEmail}>
              {user?.email || "guest@example.com"}
            </Text>
            <View style={styles.badgeContainer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color="#62DCA3"
              />
              <Text style={styles.badgeText}>Verified Traveler</Text>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Places</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.9</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}18` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
                {index < MENU_ITEMS.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.menuCard}>
            {SETTINGS_ITEMS.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleMenuPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: `${item.color}18` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  </View>
                  {item.value ? (
                    <Text style={styles.menuValue}>{item.value}</Text>
                  ) : null}
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={20}
                    color={COLORS.textMuted}
                  />
                </TouchableOpacity>
                {index < SETTINGS_ITEMS.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <MaterialCommunityIcons
              name="logout"
              size={20}
              color={COLORS.primary}
            />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F1EE",
  },
  header: {
    paddingTop: 24,
    paddingBottom: 0,
    position: "relative",
    overflow: "hidden",
  },
  decoCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    top: -50,
    right: -60,
  },
  decoCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(140, 125, 121, 0.05)",
    bottom: 20,
    left: -40,
  },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    borderWidth: 3,
    borderColor: "#21100B",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#21100B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#F5F1EE",
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1818",
    letterSpacing: -0.3,
  },
  userEmail: {
    fontSize: 13,
    color: "#4A4341",
    marginTop: 4,
    fontWeight: "500",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    marginTop: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#62DCA3",
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 4,
    marginHorizontal: 20,
    backgroundColor: "#EDE7E3",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 0,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#21100B",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: "#4A4341",
    marginTop: 2,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(92, 63, 65, 0.2)",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#21100B",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1818",
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#4A4341",
    marginTop: 1,
    fontWeight: "500",
  },
  menuValue: {
    fontSize: 13,
    color: "#4A4341",
    marginRight: 4,
    fontWeight: "600",
  },
  rowDivider: {
    height: 1,
    backgroundColor: "rgba(92, 63, 65, 0.1)",
    marginLeft: 72,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    paddingVertical: 16,
    borderRadius: 50,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.1)",
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF385C",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#8A9BB8",
    marginVertical: 24,
    fontWeight: "500",
  },
});
