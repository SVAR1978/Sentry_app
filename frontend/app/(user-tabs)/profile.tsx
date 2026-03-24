import { 
  Wallet, 
  MapPin, 
  Ticket, 
  Languages, 
  HelpCircle, 
  Bell, 
  LogOut, 
  ArrowLeft, 
  MoreVertical, 
  Edit2,
  ChevronRight 
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

// Leveraging design tokens derived from userHomeData.ts
const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  background: "#F2F2F2",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  danger: "#FF6B6B",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  cardShadow: "#21100B",
};

const ACCOUNT_ITEMS = [
  {
    id: "wallet",
    title: "My Wallet",
    icon: Wallet,
  },
  {
    id: "address",
    title: "My Address",
    icon: MapPin,
  },
  {
    id: "tickets",
    title: "My Tickets",
    icon: Ticket,
  },
];

const SETTINGS_ITEMS = [
  {
    id: "language",
    title: "App Language",
    icon: Languages,
  },
  {
    id: "help",
    title: "Help Center",
    icon: HelpCircle,
  },
  {
    id: "notifications",
    title: "Notification Settings",
    icon: Bell,
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
      
      {/* Hero Header matching UserHeader.tsx style */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View style={styles.headerSpacer} />

        <View style={styles.heroSection}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <ProfilePhotoPicker user={user} updateUser={updateUser} />
          <View style={styles.userNameContainer}>
            <Text style={styles.userName}>{user?.name || "Vilash Kumar"}</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          {ACCOUNT_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleMenuPress(item.id)} activeOpacity={0.7} style={styles.cardWrapper}>
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon size={22} color={COLORS.primaryContainer} strokeWidth={2} />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {SETTINGS_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleMenuPress(item.id)} activeOpacity={0.7} style={styles.cardWrapper}>
              <View style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon size={22} color={COLORS.primaryContainer} strokeWidth={2} />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut size={18} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.logoutText}>Sign Out</Text>
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
    // 1. Request Media Library Permissions
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
        allowsEditing: false, 
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
      <View style={styles.avatarBorder}>
        {user?.avatar ? (
          <Avatar.Image
            size={72}
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
        ) : (
          <Avatar.Text
            size={72}
            label={user?.name ? user.name.charAt(0).toUpperCase() : "V"}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
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
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: "600",
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
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
    backgroundColor: "rgba(33, 16, 11, 0.04)",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  logoutSection: {
    marginTop: 32,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(33, 16, 11, 0.04)",
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
    color: COLORS.danger,
  },
});


