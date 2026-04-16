import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import {
  CheckCircle2,
  HelpCircle,
  Home,
} from "lucide-react-native";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  success: "#10B981",
};

export default function SupportSuccessScreen() {
  const { t } = useTranslation('common');
  const { ticketRef, email } = useLocalSearchParams<{
    ticketRef: string;
    email: string;
  }>();

  // Animated checkmark
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // 1. Checkmark bounces in
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 8,
      stiffness: 120,
      useNativeDriver: true,
    }).start();

    // 2. Content fades and slides up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Checkmark Animation */}
        <Animated.View
          style={[
            styles.checkContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.checkCircle}>
            <CheckCircle2 size={64} color={COLORS.success} strokeWidth={2} />
          </View>
        </Animated.View>

        {/* Text Content */}
        <Animated.View
          style={[
            styles.textContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>{t('messageSent')}</Text>
          <Text style={styles.subtitle}>
            {t('supportTeamWillGetBack')}{" "}
            <Text style={styles.emailHighlight}>{email || "your email"}</Text>
          </Text>

          {/* Ticket Reference Card */}
          <View style={styles.ticketCard}>
            <Text style={styles.ticketLabel}>{t('ticketReference')}</Text>
            <Text style={styles.ticketRef}>{ticketRef || "TSA-XXXXX"}</Text>
            <Text style={styles.ticketHint}>
              {t('saveThisNumber')}
            </Text>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.replace("/help-center")}
              activeOpacity={0.85}
            >
              <HelpCircle size={18} color={COLORS.white} strokeWidth={2.5} />
              <Text style={styles.primaryButtonText}>{t('backToHelpCenter')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.replace("/")}
              activeOpacity={0.85}
            >
              <Home size={18} color={COLORS.primary} strokeWidth={2.5} />
              <Text style={styles.secondaryButtonText}>{t('goToHome')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  // Checkmark
  checkContainer: {
    marginBottom: 32,
  },
  checkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },

  // Text
  textContent: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
    paddingHorizontal: 16,
  },
  emailHighlight: {
    fontWeight: "800",
    color: COLORS.primary,
  },

  // Ticket Card
  ticketCard: {
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
    gap: 6,
    width: "100%",
  },
  ticketLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.secondary,
    letterSpacing: 1.5,
  },
  ticketRef: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 2,
  },
  ticketHint: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: "500",
  },

  // Buttons
  buttonContainer: {
    width: "100%",
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    gap: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 58,
    borderRadius: 29,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
