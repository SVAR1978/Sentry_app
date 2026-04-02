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
  Edit2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../store/AuthContext";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  background: "#F2F2F2",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  text: "#1A1818",
  textMuted: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  cardShadow: "#21100B",
  iconBg: "rgba(33, 16, 11, 0.04)",
};

const ADMIN_MENU = [
  {
    id: "personal",
    title: "Personal Information",
    icon: User,
  },
  {
    id: "security",
    title: "Security Settings",
    icon: Lock,
  },
  {
    id: "activity",
    title: "Activity Log",
    icon: History,
  },
  {
    id: "permissions",
    title: "My Permissions",
    icon: Key,
  },
];

const QUICK_SETTINGS = [
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
  },
  {
    id: "appearance",
    title: "Appearance",
    icon: Palette,
  },
  {
    id: "help",
    title: "Help Center",
    icon: HelpCircle,
  },
];

// ------------------------------------------------------------------
// Profile Photo Picker Component (matching user-tabs profile)
// ------------------------------------------------------------------
const ProfilePhotoPicker = ({
  user,
  updateUser,
}: {
  user: any;
  updateUser: any;
}) => {
  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need camera roll permissions to let you choose a profile picture!"
        );
        return;
      }
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        updateUser({ avatar: localUri });
      }
    } catch (error) {
      console.error("ImagePicker Error: ", error);
      Alert.alert("Error", "Something went wrong opening the photo library.");
    }
  };

  return (
    <View style={styles.avatarWrapper}>
      <View style={styles.avatarBorder}>
        {user?.avatar ? (
          <Avatar.Image size={80} source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <Avatar.Text
            size={80}
            label={user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.1)" }]}
            color={COLORS.white}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.editAvatarBtn}
        onPress={pickImage}
        activeOpacity={0.8}
      >
        <Edit2 size={12} color={COLORS.primary} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
};

const AnimatedProfileCard = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cardWrapper}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function AdminProfileScreen() {
  const { user, logout, updateUser } = useAuth();
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

  const handleMenuPress = (id: string) => {
    console.log("Menu pressed:", id);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Header — matching user-tabs profile */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.header,
            { paddingTop: Math.max(insets.top, 20) },
          ]}
        >
          <View style={styles.headerSpacer} />

          <View style={styles.heroSection}>
            <Text style={styles.headerTitle}>Admin Profile</Text>
          </View>

          <View style={styles.profileSection}>
            <ProfilePhotoPicker user={user} updateUser={updateUser} />
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>
                {user?.name || "Administrator"}
              </Text>
              <View style={styles.roleContainer}>
                <Award size={14} color={COLORS.white} strokeWidth={2.5} />
                <Text style={styles.roleText}>Super Administrator</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {ADMIN_MENU.map((item) => (
            <AnimatedProfileCard
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
            >
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon
                      size={22}
                      color={COLORS.primaryContainer}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textMuted} />
            </AnimatedProfileCard>
          ))}
        </View>

        {/* Quick Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Settings</Text>
          {QUICK_SETTINGS.map((item) => (
            <AnimatedProfileCard
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
            >
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon
                      size={22}
                      color={COLORS.primaryContainer}
                      strokeWidth={2}
                    />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textMuted} />
            </AnimatedProfileCard>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LogOut size={18} color={COLORS.error} strokeWidth={2.5} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Admin Portal v1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2026 SentryApp. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ─── HEADER (matching user-tabs profile exactly) ──────────
  header: {
    paddingBottom: 48,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
  },
  headerSpacer: {
    height: 24,
    width: "100%",
  },
  heroSection: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -1,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: 16,
    gap: 16,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatar: {
    backgroundColor: "transparent",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  userNameContainer: {
    justifyContent: "center",
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
  },

  // ─── SECTIONS (matching user-tabs card design) ────────────
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.iconBg,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },

  // ─── LOGOUT (matching user-tabs pill style) ───────────────
  logoutSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.iconBg,
    paddingVertical: 14,
    width: "100%",
    borderRadius: 50,
    gap: 8,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.error,
  },

  // ─── APP INFO ─────────────────────────────────────────────
  appInfo: {
    alignItems: "center",
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  appCopyright: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
