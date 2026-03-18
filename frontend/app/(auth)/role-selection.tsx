import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Easing,
  View,
} from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROLES, UserRole } from "../../types/rbac";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#1E40AF",
  accent: "#14B8A6",
  background: "#F8FAFC",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
  success: "#10B981",
};

interface RoleSelectionScreenProps {
  onRoleSelect?: (role: UserRole) => void;
  selectedEmail?: string;
}

export default function RoleSelectionScreen({
  onRoleSelect,
  selectedEmail,
}: RoleSelectionScreenProps) {
  const theme = useTheme();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 40,
        friction: 6,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Animate selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (onRoleSelect) {
        onRoleSelect(selectedRole);
      } else {
        // Navigate to role-specific login screen
        if (selectedRole.id === "admin") {
          router.push("/(auth)/admin-login");
        } else {
          router.push("/(auth)/user-login");
        }
      }
    } catch (error) {
      console.error("Role selection error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter to show only User and Administration roles
  const filteredRoles = ROLES.filter(
    (role) => role.id === "user" || role.id === "admin",
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Background Header */}
        <LinearGradient
          colors={["#E0F2FE", "#F0F9FF"]}
          style={styles.headerGradient}
        >
          {/* Logo & Icon */}
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.shieldIcon}>
              <MaterialCommunityIcons
                name="account-group"
                size={60}
                color={COLORS.primary}
              />
            </View>
          </Animated.View>

          {/* Headline */}
          <Animated.View
            style={[
              styles.headlineContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.headline}>Welcome to Sentry</Text>
            <Text style={styles.subheadline}>
              Choose your account type to get started
            </Text>
          </Animated.View>
        </LinearGradient>

        {/* Role Cards Container */}
        <Animated.View
          style={[
            styles.rolesContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {filteredRoles.map((role, index) => (
            <Animated.View
              key={role.id}
              style={[
                styles.cardWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: Animated.add(
                        slideAnim,
                        new Animated.Value(index * 10),
                      ),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => handleRoleSelect(role)}
                activeOpacity={0.7}
                disabled={loading}
              >
                <Card
                  style={[
                    styles.roleCard,
                    {
                      borderColor:
                        selectedRole?.id === role.id
                          ? role.color
                          : COLORS.white,
                      borderWidth: selectedRole?.id === role.id ? 3 : 1,
                      backgroundColor: COLORS.white,
                    },
                  ]}
                  elevation={selectedRole?.id === role.id ? 5 : 3}
                >
                  <View style={styles.cardContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        { backgroundColor: `${role.color}15` },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={role.icon as any}
                        size={48}
                        color={role.color}
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={[styles.roleTitle, { color: COLORS.text }]}>
                        {role.displayName}
                      </Text>
                      <Text
                        style={[
                          styles.roleDescription,
                          { color: COLORS.textLight },
                        ]}
                      >
                        {role.id === "admin"
                          ? "Full system access with all administrative privileges"
                          : "Standard user access with essential features"}
                      </Text>
                    </View>

                    {selectedRole?.id === role.id && (
                      <View style={styles.selectedBadge}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={32}
                          color={role.color}
                        />
                      </View>
                    )}
                  </View>
                </Card>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Continue Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Button
            mode="contained"
            onPress={handleContinue}
            disabled={!selectedRole || loading}
            loading={loading}
            style={[
              styles.continueButton,
              {
                backgroundColor: selectedRole
                  ? selectedRole.color
                  : theme.colors.surfaceVariant,
              },
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
            icon={selectedRole ? "arrow-right" : "account-arrow-right"}
          >
            {loading
              ? "Please wait..."
              : selectedRole
                ? `Continue as ${selectedRole.displayName}`
                : "Select a role to continue"}
          </Button>

          {selectedRole && (
            <Text style={styles.helperText}>
              You'll be able to access all{" "}
              {selectedRole.displayName.toLowerCase()} features
            </Text>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  shieldIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  headlineContainer: {
    alignItems: "center",
  },
  headline: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "center",
  },
  subheadline: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
  },
  rolesContainer: {
    paddingHorizontal: 20,
    gap: 20,
  },
  cardWrapper: {
    marginBottom: 20,
  },
  roleCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  cardContent: {
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 140,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  selectedBadge: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  continueButton: {
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonContent: {
    paddingVertical: 14,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  helperText: {
    textAlign: "center",
    color: COLORS.textLight,
    fontSize: 13,
    marginTop: 8,
  },
});
