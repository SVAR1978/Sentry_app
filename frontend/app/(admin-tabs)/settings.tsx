import {
  Bell,
  Mail,
  AlertTriangle,
  Languages,
  ChevronRight,
  LogOut,
} from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "../../store/AuthContext";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import { Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../../components/common/LanguageSelector";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "../../config/i18n";

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

const AnimatedSettingCard = ({
  children,
  onPress,
  isDanger,
}: {
  children: React.ReactNode;
  onPress: () => void;
  isDanger?: boolean;
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
          isDanger && styles.dangerCard,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const { logout } = useAuth();
  const { t, i18n } = useTranslation('common');
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    notifications: true,
    email: true,
    alerts: true,
  });
  const insets = useSafeAreaInsets();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  // Derive current language label
  const currentLangInfo = SUPPORTED_LANGUAGES.find(
    (l) => l.code === (i18n.language as LanguageCode)
  );

  const GENERAL_SETTINGS = [
    {
      id: "notifications",
      title: t('pushNotifications'),
      icon: Bell,
      type: "switch" as const,
    },
    {
      id: "email",
      title: t('emailNotifications'),
      icon: Mail,
      type: "switch" as const,
    },
    {
      id: "alerts",
      title: t('sosAlerts'),
      icon: AlertTriangle,
      type: "switch" as const,
    },
    {
      id: "language",
      title: t('language'),
      icon: Languages,
      type: "navigate" as const,
      value: currentLangInfo?.nativeLabel || "English",
    },
  ];



  const handleLogout = () => {
    Alert.alert(t('signOut'), t('logoutAdminConfirm'), [
      { text: t('cancel'), style: "cancel" },
      {
        text: t('signOut'),
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/admin-login");
        },
      },
    ]);
  };

  const toggleSwitch = (id: string) => {
    setSwitches({ ...switches, [id]: !switches[id] });
  };

  const handleSettingPress = (item: (typeof GENERAL_SETTINGS)[0]) => {
    if (item.type === "switch") {
      toggleSwitch(item.id);
    } else if (item.id === "language") {
      setShowLanguageSelector(true);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View
          style={[
            styles.header,
            { paddingTop: Math.max(insets.top, 20) + 8 },
          ]}
        >
          <Text style={styles.headerTitle}>{t('settings')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('managePreferences')}
          </Text>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          {GENERAL_SETTINGS.map((item) => (
            <AnimatedSettingCard
              key={item.id}
              onPress={() => handleSettingPress(item)}
            >
                <View style={styles.cardLeft}>
                  <View style={styles.cardIconBox}>
                    <item.icon
                      size={22}
                      color={COLORS.primaryContainer}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    {item.value && (
                      <Text style={styles.cardValue}>{item.value}</Text>
                    )}
                  </View>
                </View>
                {item.type === "switch" ? (
                  <Switch
                    value={switches[item.id]}
                    onValueChange={() => toggleSwitch(item.id)}
                    color={COLORS.primary}
                  />
                ) : (
                  <ChevronRight
                    size={20}
                    color={COLORS.textMuted}
                  />
                )}
            </AnimatedSettingCard>
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
            <Text style={styles.logoutText}>{t('signOut')}</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>{t('appVersion')}</Text>
          <Text style={styles.appCopyright}>
            {t('copyright')}
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: "600",
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
  dangerCard: {
    borderColor: "rgba(217, 54, 54, 0.1)",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  cardIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.iconBg,
  },
  dangerIconBox: {
    backgroundColor: "rgba(217, 54, 54, 0.06)",
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
  cardValue: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "500",
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
