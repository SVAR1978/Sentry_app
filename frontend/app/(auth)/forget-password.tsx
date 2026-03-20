import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, TextInput } from "react-native-paper";

const COLORS = {
  primary: "#1E40AF",
  accent: "#14B8A6",
  error: "#FF6B6B",
  warning: "#F59E0B",
  success: "#10B981",
  background: "#F8FAFC",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
  border: "#E5E7EB",
};

type Step = "email" | "verification" | "reset-password";

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState({
    password: true,
    confirm: true,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const getPasswordStrength = (): PasswordStrength => {
    const score = Object.values(passwordRequirements).filter(Boolean).length;
    if (score === 0) return { score: 0, text: "None", color: COLORS.error };
    if (score <= 2) return { score: 1, text: "Weak", color: COLORS.error };
    if (score < 4) return { score: 2, text: "Medium", color: COLORS.warning };
    return { score: 3, text: "Strong", color: COLORS.success };
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

  const validateEmail = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      shakeAnimation();
      return false;
    }
    return true;
  };

  const validateVerificationCode = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!verificationCode.trim()) {
      newErrors.code = "Verification code is required";
    } else if (verificationCode.length < 4) {
      newErrors.code = "Code must be at least 4 digits";
    } else if (verificationCode.length > 6) {
      newErrors.code = "Code must not exceed 6 digits";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      shakeAnimation();
      return false;
    }
    return true;
  };

  const validatePasswordReset = () => {
    const newErrors: Record<string, string | undefined> = {};
    if (!newPassword.trim()) {
      newErrors.password = "Password is required";
    } else if (!Object.values(passwordRequirements).every(Boolean)) {
      newErrors.password = "Password does not meet requirements";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      shakeAnimation();
      return false;
    }
    return true;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    setErrors({});
    try {
      // TODO: Call your API to send reset code
      // Example: await sendPasswordResetCode(email);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("verification");
    } catch (error) {
      setErrors({ email: "Failed to send verification code" });
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationCode()) return;
    setLoading(true);
    setErrors({});
    try {
      // TODO: Call your API to verify code
      // Example: await verifyResetCode(email, verificationCode);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep("reset-password");
    } catch (error) {
      setErrors({ code: "Invalid verification code. Please try again." });
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePasswordReset()) return;
    setLoading(true);
    setErrors({});
    try {
      // TODO: Call your API to reset password
      // Example: await resetPassword(email, newPassword, verificationCode);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace("/(auth)/role-selection");
    } catch (error) {
      setErrors({ general: "Failed to reset password. Please try again." });
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength();
  const stepNumber = step === "email" ? 1 : step === "verification" ? 2 : 3;

  return (
    <SafeAreaView style={styles.safeContainer}>
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
            style={styles.headerGradient}
          >
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButtonHeader}
              onPress={() => router.back()}
              disabled={loading}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.lockIcon}>
                <MaterialCommunityIcons
                  name="lock-reset"
                  size={50}
                  color={COLORS.primary}
                />
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>Reset Password</Text>
            <Text style={styles.subheadline}>
              {step === "email"
                ? "Enter your email to receive a code"
                : step === "verification"
                  ? "Verify your code"
                  : "Create a new password"}
            </Text>

            {/* Step Indicator */}
            <View style={styles.stepIndicator}>
              {[1, 2, 3].map((num) => (
                <View
                  key={num}
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor:
                        num <= stepNumber ? COLORS.primary : COLORS.border,
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>

          {/* Form Container */}
          <Animated.View
            style={[
              styles.formContainer,
              { transform: [{ translateX: shakeAnim }] },
            ]}
          >
            {/* Step 1: Email */}
            {step === "email" && (
              <>
                <View style={styles.inputWrapper}>
                  <TextInput
                    label="Email Address"
                    value={email}
                    onChangeText={(value) => {
                      setEmail(value);
                      if (errors.email)
                        setErrors({ ...errors, email: undefined });
                    }}
                    placeholder="you@example.com"
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

                <Text style={styles.helperText}>
                  We'll send you a verification code to this email address.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleSendCode}
                  loading={loading}
                  disabled={loading}
                  style={styles.primaryButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>
              </>
            )}

            {/* Step 2: Verification Code */}
            {step === "verification" && (
              <>
                <View style={styles.codeContainer}>
                  <MaterialCommunityIcons
                    name="email-open-outline"
                    size={32}
                    color={COLORS.primary}
                  />
                  <Text style={styles.codeSubtitle}>Code sent to</Text>
                  <Text style={styles.emailDisplay}>{email}</Text>
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    label="Verification Code"
                    value={verificationCode}
                    onChangeText={(value) => {
                      const numericValue = value.replace(/[^0-9]/g, "");
                      setVerificationCode(numericValue);
                      if (errors.code)
                        setErrors({ ...errors, code: undefined });
                    }}
                    placeholder="000000"
                    keyboardType="number-pad"
                    editable={!loading}
                    maxLength={6}
                    style={[styles.input, styles.codeInput]}
                    left={<TextInput.Icon icon="shield-check-outline" />}
                    error={!!errors.code}
                  />
                  {errors.code && (
                    <Text style={styles.errorText}>{errors.code}</Text>
                  )}
                </View>

                <Text style={styles.helperText}>
                  Enter the 6-digit code we sent to your email.
                </Text>

                <Button
                  mode="contained"
                  onPress={handleVerifyCode}
                  loading={loading}
                  disabled={loading || verificationCode.length < 4}
                  style={styles.primaryButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>

                <Button
                  onPress={() => {
                    setStep("email");
                    setVerificationCode("");
                    setErrors({});
                  }}
                  mode="text"
                  disabled={loading}
                  style={styles.textButton}
                  labelStyle={styles.textButtonLabel}
                >
                  ← Back to Email
                </Button>
              </>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset-password" && (
              <>
                <View style={styles.inputWrapper}>
                  <TextInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={(value) => {
                      setNewPassword(value);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Create a strong password"
                    secureTextEntry={secureText.password}
                    editable={!loading}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={
                          secureText.password
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        onPress={() =>
                          setSecureText((prev) => ({
                            ...prev,
                            password: !prev.password,
                          }))
                        }
                      />
                    }
                    error={!!errors.password}
                  />
                  {errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <View style={styles.strengthContainer}>
                      <View style={styles.strengthBar}>
                        <View
                          style={[
                            styles.strengthFill,
                            {
                              flex: passwordStrength.score,
                              backgroundColor: passwordStrength.color,
                            },
                          ]}
                        />
                        <View
                          style={{
                            flex: 3 - passwordStrength.score,
                            backgroundColor: COLORS.border,
                          }}
                        />
                      </View>
                      <Text
                        style={[
                          styles.strengthText,
                          { color: passwordStrength.color },
                        ]}
                      >
                        {passwordStrength.text}
                      </Text>
                    </View>
                  )}

                  {/* Requirements */}
                  <View style={styles.requirementsContainer}>
                    {[
                      {
                        text: "Min 8 characters",
                        met: passwordRequirements.minLength,
                      },
                      {
                        text: "Uppercase letter",
                        met: passwordRequirements.hasUppercase,
                      },
                      { text: "Number", met: passwordRequirements.hasNumber },
                      {
                        text: "Special character",
                        met: passwordRequirements.hasSpecial,
                      },
                    ].map((req, idx) => (
                      <View key={idx} style={styles.requirementItem}>
                        <MaterialCommunityIcons
                          name={req.met ? "check-circle" : "circle-outline"}
                          size={16}
                          color={req.met ? COLORS.success : COLORS.border}
                        />
                        <Text
                          style={[
                            styles.requirementText,
                            {
                              color: req.met
                                ? COLORS.success
                                : COLORS.textLight,
                            },
                          ]}
                        >
                          {req.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={(value) => {
                      setConfirmPassword(value);
                      if (errors.confirmPassword)
                        setErrors({ ...errors, confirmPassword: undefined });
                    }}
                    placeholder="Re-enter your password"
                    secureTextEntry={secureText.confirm}
                    editable={!loading}
                    style={styles.input}
                    left={<TextInput.Icon icon="lock-check-outline" />}
                    right={
                      <TextInput.Icon
                        icon={
                          secureText.confirm ? "eye-off-outline" : "eye-outline"
                        }
                        onPress={() =>
                          setSecureText((prev) => ({
                            ...prev,
                            confirm: !prev.confirm,
                          }))
                        }
                      />
                    }
                    error={!!errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                {errors.general && (
                  <View style={styles.alertBox}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={20}
                      color={COLORS.error}
                    />
                    <Text style={styles.alertText}>{errors.general}</Text>
                  </View>
                )}

                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  loading={loading}
                  disabled={
                    loading ||
                    !Object.values(passwordRequirements).every(Boolean)
                  }
                  style={styles.primaryButton}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>

                <Button
                  onPress={() => {
                    setStep("verification");
                    setNewPassword("");
                    setConfirmPassword("");
                    setErrors({});
                  }}
                  mode="text"
                  disabled={loading}
                  style={styles.textButton}
                  labelStyle={styles.textButtonLabel}
                >
                  ← Back to Verification
                </Button>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonHeader: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  lockIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
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
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  codeInput: {
    fontSize: 20,
    letterSpacing: 6,
    textAlign: "center",
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 16,
    marginTop: -8,
  },
  codeContainer: {
    alignItems: "center",
    marginBottom: 24,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  codeSubtitle: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 8,
  },
  emailDisplay: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginTop: 4,
  },
  strengthContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  strengthBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: "hidden",
    flexDirection: "row",
    marginBottom: 6,
  },
  strengthFill: {
    height: "100%",
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },
  requirementsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 13,
  },
  alertBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: `${COLORS.error}15`,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 13,
    color: COLORS.error,
    flex: 1,
  },
  primaryButton: {
    marginBottom: 12,
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
  textButton: {
    marginBottom: 16,
  },
  textButtonLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
});
