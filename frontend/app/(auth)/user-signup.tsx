import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../store/AuthContext";

const COLORS = {
  primary: "#1E40AF",
  accent: "#14B8A6",
  error: "#FF6B6B",
  background: "#F8FAFC",
  text: "#1F2937",
  textLight: "#6B7280",
  textSecondary: "#9CA3AF",
  white: "#FFFFFF",
  border: "#E5E7EB",
  success: "#10B981",
};

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function UserSignup() {
  const { signup } = useAuth();
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [familyPhone, setFamilyPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    familyPhone?: string;
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
      familyPhone?: string;
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

    if (!familyPhone.trim()) {
      newErrors.familyPhone = "Family phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(familyPhone.replace(/[\s-()]/g, ""))) {
      newErrors.familyPhone =
        "Please enter a valid phone number (10-15 digits)";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      await signup(fullName, email, familyPhone, password, "USER");

      setSnackbarMessage("Account created successfully!");
      setSnackbarVisible(true);

      router.push({
        pathname: "/(auth)/success",
        params: {
          userName: fullName,
          userRole: "user",
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
          colors={["#E0F2FE", "#F0F9FF"]}
          style={[styles.headerGradient, { paddingTop: Math.max(insets.top, 48) }]}
        >
            {/* Logo & Icon */}
            <View style={styles.logoContainer}>
              <View style={styles.shieldIcon}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={50}
                  color={COLORS.success}
                />
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>Create Account</Text>
            <Text style={styles.subheadline}>Register as User</Text>
          </LinearGradient>

          {/* Form Container */}
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
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
                label="Email Address"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                placeholder="Enter your email"
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

            {/* Family Phone Number Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Family Phone Number"
                value={familyPhone}
                onChangeText={(value) => {
                  setFamilyPhone(value);
                  if (errors.familyPhone)
                    setErrors({ ...errors, familyPhone: undefined });
                }}
                placeholder="Enter family phone number"
                keyboardType="phone-pad"
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="phone-outline" />}
                error={!!errors.familyPhone}
              />
              {errors.familyPhone && (
                <Text style={styles.errorText}>{errors.familyPhone}</Text>
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
                placeholder="Create a password"
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
              icon="account-check"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/user-login")}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Sign in</Text>
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
    shadowColor: COLORS.success,
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
    backgroundColor: COLORS.success,
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
    color: COLORS.success,
    fontSize: 14,
    fontWeight: "700",
  },
});
