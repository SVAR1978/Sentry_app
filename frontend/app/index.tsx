import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../store/AuthContext";

const COLORS = {
  primary: "#1E40AF",
  background: "#F8FAFC",
  text: "#1F2937",
};

export default function Index() {
  const { isAuthenticated, role, loading } = useAuth();

  // Add console logs for debugging
  useEffect(() => {
    console.log("Index - isAuthenticated:", isAuthenticated);
    console.log("Index - role:", role);
    console.log("Index - loading:", loading);
  }, [isAuthenticated, role, loading]);

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons
            name="shield-account"
            size={80}
            color={COLORS.primary}
          />
        </View>
        <Text style={styles.appName}>Sentry</Text>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={styles.loader}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Not authenticated - go to role selection
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  // Authenticated - redirect based on role
  if (role === "admin") {
    return <Redirect href="/(admin-tabs)" />;
  }

  if (role === "user") {
    return <Redirect href="/(user-tabs)" />;
  }

  // Fallback to role selection
  return <Redirect href="/(auth)/role-selection" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 40,
  },
  loader: {
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.text,
    marginTop: 10,
  },
});

// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/(auth)/role-selection" />;
// }
