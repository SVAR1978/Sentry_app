import { 
  User, 
  MapPin, 
  Ticket, 
  Languages, 
  HelpCircle, 
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
import React, { useState } from "react";
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
import { useAuth } from "../../store/AuthContext";
import { useTabVisibility } from "../../store/TabVisibilityContext";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/common/LanguageSelector";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../../config/i18n";

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

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation('common');
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Derive current language label for display
  const currentLangInfo = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (i18n.language as LanguageCode)
  );

  const ACCOUNT_ITEMS = [
    {
      id: "personal_info",
      title: t('personalInfo'),
      icon: User,
    },
    {
      id: "address",
      title: t('myAddress'),
      icon: MapPin,
    },
    {
      id: "tickets",
      title: t('myTickets'),
      icon: Ticket,
    },
  ];

  const SETTINGS_ITEMS = [
    {
      id: "language",
      title: t('language'),
      icon: Languages,
      value: currentLangInfo?.nativeLabel || 'English',
    },
    {
      id: "help",
      title: t('helpCenter'),
      icon: HelpCircle,
    },
  ];

  const handleLogout = () => {
    Alert.alert(t('signOut'), t('logoutConfirm'), [
      { text: t('cancel'), style: "cancel" },
      {
        text: t('signOut'),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/user-login");
        },
      },
    ]);
  };

  const handleMenuPress = (id: string) => {
    if (id === "personal_info") {
      router.push("/personal-info");
    } else if (id === "address") {
      router.push("/address-settings");
    } else if (id === "tickets") {
      router.push("/(user-tabs)/my-tickets");
    } else if (id === "help") {
      router.push("/(user-tabs)/help-center" as any);
    } else if (id === "language") {
      setShowLanguageSelector(true);
    } else {
      console.log("Menu pressed:", id);
    }
  };

    const { setTabBarVisible } = useTabVisibility();
    const lastScrollY = React.useRef(0);

    const handleScroll = (event: any) => {
      const currentScrollY = event.nativeEvent.contentOffset.y;
      if (currentScrollY <= 0) {
        setTabBarVisible(true);
        return;
      }
      if (currentScrollY > lastScrollY.current + 10) {
        setTabBarVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setTabBarVisible(true);
      }
      lastScrollY.current = currentScrollY;
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
            <Text style={styles.headerTitle}>{t('myProfile')}</Text>
          </View>

          <View style={styles.profileSection}>
            <ProfilePhotoPicker user={user} updateUser={updateUser} />
            <View style={styles.userNameContainer}>
              <Text style={styles.userName}>{user?.name || "Vilash Kumar"}</Text>
            </View>
          </View>
        </LinearGradient>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('account')}</Text>
          {ACCOUNT_ITEMS.map((item) => (
            <AnimatedProfileCard
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
            >
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon size={22} color={COLORS.primaryContainer} strokeWidth={2} />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
            </AnimatedProfileCard>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>
          {SETTINGS_ITEMS.map((item) => (
            <AnimatedProfileCard
              key={item.id}
              onPress={() => handleMenuPress(item.id)}
            >
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon size={22} color={COLORS.primaryContainer} strokeWidth={2} />
                  </View>
                  <View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.value && (
                      <Text style={styles.cardSubtitle}>{item.value}</Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={COLORS.textSecondary} />
            </AnimatedProfileCard>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
            <LogOut size={18} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.logoutText}>{t('signOut')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelector
        visible={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
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
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginTop: 2,
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
