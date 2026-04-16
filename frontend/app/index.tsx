import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/AuthContext";

const COLORS = {
  primary: "#21100B",
  background: "#F5F1EE",
};

export default function Index() {
  const { isAuthenticated, role, loading } = useAuth();
  const { t } = useTranslation('common');
  const [splashFinished, setSplashFinished] = useState(false);

  // Entrance Animations
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 1. Kick off the logo presentation animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 12,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Enforce a deliberate 2-second hold for "Premium" brand recognition 
    // before allowing the app to transition out of the loading screen.
    const timer = setTimeout(() => {
      setSplashFinished(true);
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  // 3. Orchestrate smooth routing ONLY when both the auth-check AND splash animation are fully done
  useEffect(() => {
    if (!loading && splashFinished) {
      if (!isAuthenticated) {
        router.replace("/(auth)/role-selection");
      } else {
        if (role === "admin") {
          router.replace("/(admin-tabs)");
        } else if (role === "user") {
          router.replace("/(user-tabs)");
        } else {
          router.replace("/(auth)/role-selection");
        }
      }
    }
  }, [loading, splashFinished, isAuthenticated, role]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Decorative Blur Backgrounds */}
      <View style={styles.ambientTopLeft} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Image
            source={require("../assets/images/sentry-3.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>{t('appName')}</Text>
        <Text style={styles.tagline}>{t('tagline')}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  ambientTopLeft: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
  },
  content: {
    alignItems: "center",
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 32,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    overflow: "hidden",
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  appName: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 48,
    color: COLORS.primary,
    letterSpacing: -2,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: "#8C7D79",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
});
