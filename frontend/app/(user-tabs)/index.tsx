import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedDestinations from "../../components/userHome/FeaturedDestinations";
import QuickActions from "../../components/userHome/QuickActions";
import SafetyTips from "../../components/userHome/SafetyTips";
import UserHeader from "../../components/userHome/UserHeader";
import WeatherWidget from "../../components/userHome/WeatherWidget";
import {
    COLORS,
    FEATURED_DESTINATIONS,
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

  // Filter destinations based on search query
  const filteredDestinations = FEATURED_DESTINATIONS.filter((dest) => {
    const query = searchQuery.toLowerCase();
    return (
      dest.name.toLowerCase().includes(query) ||
      dest.location.toLowerCase().includes(query) ||
      dest.category.toLowerCase().includes(query)
    );
  });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar
        style="dark"
        backgroundColor={COLORS.background}
        translucent={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <UserHeader
          user={user}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
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
          {filteredDestinations.length > 0 ? (
            <FeaturedDestinations destinations={filteredDestinations} />
          ) : searchQuery ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                No destinations found for "{searchQuery}"
              </Text>
            </View>
          ) : null}
          <SafetyTips />
          <WeatherWidget />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingTop: 20,
  },
  noResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
  },
});
