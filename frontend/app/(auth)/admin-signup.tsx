import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Snackbar, TextInput } from "react-native-paper";
import { useAuth } from "../../store/AuthContext";

const COLORS = {
  primary: "#21100B",
  accent: "#8C7D79",
  error: "#D93636",
  background: "#F5F1EE",
  text: "#1A1818",
  textLight: "#4A4341",
  textSecondary: "#8C7D79",
  white: "#FFFFFF",
  border: "#EDE7E3",
  success: "#10B981",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function AdminSignup() {
  const { signup } = useAuth();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Admin password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      shakeAnimation();
      return false;
    }
    return true;
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // ✅ Original Backend Logic
      await signup(fullName, email, "", password, "ADMIN"); // Passing empty string for phone as it's not in this form

      setSnackbarMessage("Admin account created successfully!");
      setSnackbarVisible(true);

      router.push({
        pathname: "/(auth)/success",
        params: {
          userName: fullName,
          userRole: "admin",
        },
      });
    } catch (error: any) {
      setSnackbarMessage(error.message || "Signup failed");
      setSnackbarVisible(true);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.safeContainer}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient Background Header */}
        <LinearGradient
          colors={["#EDE7E3", "#F5F1EE"]}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 48) }]}
        >
            {/* Logo & Icon */}
            <View style={styles.logoContainer}>
              <View style={styles.shieldIcon}>
                <MaterialCommunityIcons
                  name="shield-account-outline"
                  size={50}
                  color={COLORS.primary}
                />
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>Admin Registration</Text>
            <Text style={styles.subheadline}>Create Administrator Account</Text>
          </LinearGradient>

          {/* Form Container */}
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {/* Admin Notice */}
            <View style={styles.noticeContainer}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color={COLORS.primary}
              />
              <Text style={styles.noticeText}>
                Admin accounts require verification
              </Text>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={(value) => {
                  setFullName(value);
                  if (errors.fullName)
                    setErrors({ ...errors, fullName: undefined });
                }}
                placeholder="Enter your full name"
                autoCapitalize="words"
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="account-outline" />}
                error={!!errors.fullName}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Admin Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Enter your admin email"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="email-outline" />}
                error={!!errors.email}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                placeholder="Create a strong password"
                secureTextEntry={secureText}
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={secureText ? "eye-off" : "eye"}
                    onPress={() => setSecureText(!secureText)}
                  />
                }
                error={!!errors.password}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(value) => {
                  setConfirmPassword(value);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                placeholder="Confirm your password"
                secureTextEntry={secureConfirmText}
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="lock-check-outline" />}
                right={
                  <TextInput.Icon
                    icon={secureConfirmText ? "eye-off" : "eye"}
                    onPress={() => setSecureConfirmText(!secureConfirmText)}
                  />
                }
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Signup Button */}
            <Button
              mode="contained"
              onPress={handleSignup}
              loading={loading}
              disabled={loading}
              style={styles.signupButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              icon="shield-check"
            >
              {loading ? "Creating admin account..." : "Create Admin Account"}
            </Button>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/admin-login")}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Sign in as admin</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Snackbar for notifications */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{
          backgroundColor: errors.email ? COLORS.error : COLORS.success,
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingBottom: 48,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 24,
  },
  shieldIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  headline: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subheadline: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${COLORS.primary}10`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  noticeText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    color: COLORS.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
