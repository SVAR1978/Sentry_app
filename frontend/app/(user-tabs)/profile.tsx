import {
  ArrowLeft,
  MoreVertical,
  Pencil,
  Wallet,
  MapPin,
  Ticket,
  Globe,
  CircleHelp,
  Bell,
  Lock,
  CreditCard,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react-native";
import { BlurView } from "expo-blur";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,

  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

const THEME = {
  background: "#F6F4F0",
  surface: "#FFFFFF",
  cardBg: "#F1E8DF",
  primary: "#8C4B35",
  secondary: "#C7A27D",
  accent: "#C89766",
  text: "#1A1A1A",
  textMuted: "#8E8E93",
  white: "#FFFFFF",
  iconBox: "#EAD8C9",
  logoutBg: "#F2D8C9",
  logoutText: "#5C2C22",
  gold: "#D4BA94",
};

const MENU_ITEMS = [
  {
    id: "wallet",
    title: "My Wallet",
    icon: Wallet,
    color: THEME.primary,
  },
  {
    id: "address",
    title: "My Address",
    icon: MapPin,
    color: THEME.primary,
  },
  {
    id: "tickets",
    title: "My Tickets",
    icon: Ticket,
    color: THEME.primary,
  },
];

const SETTINGS_ITEMS = [
  {
    id: "language",
    title: "App Language",
    icon: Globe,
    color: THEME.textMuted,
  },
  {
    id: "help",
    title: "Help Center",
    icon: CircleHelp,
    color: THEME.textMuted,
  },
  {
    id: "notifications",
    title: "Notification Settings",
    icon: Bell,
    color: THEME.textMuted,
  },
  {
    id: "privacy",
    title: "Privacy Preferences",
    icon: Lock,
    color: THEME.textMuted,
  },
  {
    id: "payment",
    title: "Payment Methods",
    icon: CreditCard,
    color: THEME.textMuted,
  },
];



export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
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
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Header Overlays */}
      <View style={[styles.headerActions, { top: Math.max(insets.top, 10) }]}>
        <TouchableOpacity style={styles.headerBtn}>
          <ArrowLeft size={22} color={THEME.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MoreVertical size={22} color={THEME.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={["#3E1911", "#5C2C22", "#8C4B35", "#C89766"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          {/* Artistic metallic highlights */}
          <View style={styles.metallicReflect} />
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.1)"]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Profile Info Header (Premium Gradient Card) */}
        <View style={styles.profileHeaderCard}>
          <LinearGradient
            colors={["#5C2C22", "#8C4B35", "#C89766"]}
            start={{ x: 0.1, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={styles.cardContent}>
            <View style={styles.avatarContainer}>
              <ProfilePhotoPicker user={user} updateUser={updateUser} />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={[styles.userName, { color: THEME.white }]}>{user?.name || "Henry Leo"}</Text>
            </View>
          </View>
        </View>

        {/* Menu List */}
        <View style={styles.menuList}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuCardLeft}>
                <View style={styles.iconBox}>
                  <item.icon size={22} color={THEME.primary} strokeWidth={2} />
                </View>
                <Text style={styles.menuCardText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={THEME.textMuted} />
            </TouchableOpacity>
          ))}

          {/* Settings Section Header */}
          <View style={styles.settingsHeader}>
            <Text style={styles.settingsHeaderText}>SETTINGS</Text>
          </View>

          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuCard}
              onPress={() => handleMenuPress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.menuCardLeft}>
                <View style={styles.iconBox}>
                  <item.icon size={22} color={THEME.textMuted} strokeWidth={2} />
                </View>
                <Text style={styles.menuCardText}>{item.title}</Text>
              </View>
              <ChevronRight size={20} color={THEME.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut size={20} color={THEME.logoutText} strokeWidth={2.5} />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ------------------------------------------------------------------
// Dedicated Photo Picker Component
// ------------------------------------------------------------------
const ProfilePhotoPicker = ({ user, updateUser }: { user: any, updateUser: any }) => {
  const pickImage = async () => {
    // 1. Request Media Library Permissions built into the Phone OS
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission Required", 
          "We need camera roll permissions to let you choose a profile picture!"
        );
        return;
      }
    }

    // 2. Launch the Phone Photo Library
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Skip buggy crop screen to avoid invisible 'save' buttons
        aspect: [1, 1],
        quality: 0.8,
      });

      // 3. Update the Image
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
      {user?.avatar ? (
        <Avatar.Image
          size={88}
          source={{ uri: user.avatar }}
          style={styles.avatar}
        />
      ) : (
          <Avatar.Text
            size={88}
            label={user?.name ? user.name.charAt(0).toUpperCase() : "H"}
            style={[styles.avatar, { backgroundColor: THEME.iconBox }]}
            color={THEME.primary}
          />
      )}
      <TouchableOpacity 
        style={styles.editAvatarBtn} 
        onPress={pickImage} 
        activeOpacity={0.8}
      >
        <Pencil size={14} color={THEME.primary} strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerActions: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: THEME.text,
  },
  heroContainer: {
    height: 240,
    width: "100%",
    overflow: "hidden",
  },
  metallicReflect: {
    position: "absolute",
    top: -100,
    left: -50,
    width: "150%",
    height: "200%",
    backgroundColor: "rgba(212, 186, 148, 0.15)",
    transform: [{ rotate: "25deg" }],
  },
  decoCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    top: -50,
    right: -60,
  },
  decoCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(200, 151, 102, 0.2)",
    bottom: 20,
    left: -40,
  },
  profileHeaderCard: {
    marginTop: -60,
    marginHorizontal: 16,
    borderRadius: 24,
    marginBottom: 32,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  avatarContainer: {
    // container for avatar
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    borderWidth: 4,
    borderColor: THEME.white,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBg,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.text,
    letterSpacing: -0.5,
  },
  designation: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textMuted,
    marginTop: 1,
  },
  menuList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.surface,
    padding: 20,
    borderRadius: 20,
    shadowColor: THEME.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  menuCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: THEME.cardBg,
    justifyContent: "center",
    alignItems: "center",
  },
  menuCardText: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.text,
  },
  settingsHeader: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  settingsHeaderText: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.textMuted,
    letterSpacing: 2.5,
    textTransform: "uppercase",
  },
  logoutContainer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  logoutBtn: {
    width: "100%",
    height: 60,
    backgroundColor: THEME.logoutBg,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(140, 75, 53, 0.1)",
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.logoutText,
  },
});
