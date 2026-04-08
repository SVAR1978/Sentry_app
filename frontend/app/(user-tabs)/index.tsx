import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import QuickActions from "../../components/userHome/QuickActions";
import SafetyTips from "../../components/userHome/SafetyTips";
import UserHeader from "../../components/userHome/UserHeader";
import WeatherWidget from "../../components/userHome/WeatherWidget";
import BookingPartners from "../../components/userHome/BookingPartners";
import {
    COLORS,
    QUICK_ACTIONS,
} from "../../constants/userHomeData";
import { useAuth } from "../../store/AuthContext";

export default function UserHomeScreen() {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    if (!user) {
      router.replace("/(auth)/role-selection");
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
    ]).start();
  }, [user]);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/user-login");
  };



  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <UserHeader user={user} />
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <QuickActions actions={QUICK_ACTIONS} />
          <SafetyTips />
          <BookingPartners />
          <WeatherWidget />
        </Animated.View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingTop: 0,
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    fontWeight: "500",
  },
});
