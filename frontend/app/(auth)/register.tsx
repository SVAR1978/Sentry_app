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
import { Button, Checkbox, Text, TextInput } from "react-native-paper";

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

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState({
    password: true,
    confirm: true,
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeAlerts, setAgreeAlerts] = useState(false);
  const [agreeLocation, setAgreeLocation] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Password requirements
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const getPasswordStrength = (): PasswordStrength => {
    const score = Object.values(passwordRequirements).filter(Boolean).length;
    if (score === 0) return { score: 0, text: "None", color: COLORS.error };
    if (score <= 2) return { score: 1, text: "Weak", color: COLORS.error };
    if (score < 4) return { score: 2, text: "Medium", color: COLORS.warning };
    return { score: 3, text: "Strong", color: COLORS.success };
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Please enter a valid email";

    if (!phone.trim()) newErrors.phone = "Phone number is required";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (!Object.values(passwordRequirements).every(Boolean))
      newErrors.password = "Password does not meet requirements";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (!agreeTerms) newErrors.terms = "You must agree to the terms";

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

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Call Firebase or backend API
      // Example: const response = await registerUser({
      //   fullName, email, phone: countryCode + phone, password,
      //   emergencyContact, agreeAlerts, agreeLocation
      // });

      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace("/(auth)/role-selection");
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`${provider} signup tapped`);
  };

  const passwordStrength = getPasswordStrength();

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
            {/* Logo & Icon */}
            <View style={styles.logoContainer}>
              <View style={styles.shieldIcon}>
                <MaterialCommunityIcons
                  name="shield-plus"
                  size={45}
                  color={COLORS.primary}
                />
              </View>
            </View>

            {/* Headline */}
            <Text style={styles.headline}>Create Account</Text>
            <Text style={styles.subheadline}>
              Join thousands of safe travelers
            </Text>
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
                placeholder="John Doe"
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

            {/* Phone Input with Country Code */}
            <View style={styles.phoneContainer}>
              <View style={styles.countryCodeWrapper}>
                <TextInput
                  label="Code"
                  value={countryCode}
                  editable={!loading}
                  style={styles.countryCodeInput}
                  maxLength={4}
                />
              </View>
              <View style={styles.phoneInputWrapper}>
                <TextInput
                  label="Phone Number"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    if (errors.phone)
                      setErrors({ ...errors, phone: undefined });
                  }}
                  placeholder="(555) 123-4567"
                  keyboardType="phone-pad"
                  editable={!loading}
                  style={styles.input}
                  left={<TextInput.Icon icon="phone-outline" />}
                  error={!!errors.phone}
                />
              </View>
            </View>
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

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
                secureTextEntry={secureText.password}
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={
                      secureText.password ? "eye-off-outline" : "eye-outline"
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
              {password && (
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

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                {[
                  {
                    text: "Minimum 8 characters",
                    met: passwordRequirements.minLength,
                  },
                  {
                    text: "One uppercase letter",
                    met: passwordRequirements.hasUppercase,
                  },
                  { text: "One number", met: passwordRequirements.hasNumber },
                  {
                    text: "One special character",
                    met: passwordRequirements.hasSpecial,
                  },
                ].map((req, idx) => (
                  <View key={idx} style={styles.requirementItem}>
                    <MaterialCommunityIcons
                      name={req.met ? "check-circle" : "circle-outline"}
                      size={18}
                      color={req.met ? COLORS.success : COLORS.border}
                    />
                    <Text
                      style={[
                        styles.requirementText,
                        { color: req.met ? COLORS.success : COLORS.textLight },
                      ]}
                    >
                      {req.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Confirm Password */}
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
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
            </View>

            {/* Emergency Contact */}
            <View style={styles.inputWrapper}>
              <TextInput
                label="Emergency Contact (Optional)"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                placeholder="Family member or close friend"
                editable={!loading}
                style={styles.input}
                left={<TextInput.Icon icon="phone-alert-outline" />}
              />
            </View>

            {/* Legal Agreements */}
            <View style={styles.agreementsContainer}>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={agreeTerms ? "checked" : "unchecked"}
                  onPress={() => {
                    setAgreeTerms(!agreeTerms);
                    if (errors.terms)
                      setErrors({ ...errors, terms: undefined });
                  }}
                  color={COLORS.accent}
                />
                <Text style={styles.agreementText}>
                  I agree to{" "}
                  <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </View>
              {errors.terms && (
                <Text style={styles.errorText}>{errors.terms}</Text>
              )}

              <View style={styles.checkboxRow}>
                <Checkbox
                  status={agreeAlerts ? "checked" : "unchecked"}
                  onPress={() => setAgreeAlerts(!agreeAlerts)}
                  color={COLORS.accent}
                />
                <Text style={styles.agreementText}>
                  Receive safety alerts and travel tips
                </Text>
              </View>

              <View style={styles.checkboxRow}>
                <Checkbox
                  status={agreeLocation ? "checked" : "unchecked"}
                  onPress={() => setAgreeLocation(!agreeLocation)}
                  color={COLORS.accent}
                />
                <Text style={styles.agreementText}>
                  Enable location services for safety features
                </Text>
              </View>
            </View>

            {/* Register Button */}
            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !agreeTerms}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Signup */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup("Google")}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name="google"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup("Apple")}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name="apple"
                  size={24}
                  color={COLORS.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignup("Facebook")}
                disabled={loading}
              >
                <MaterialCommunityIcons
                  name="facebook"
                  size={24}
                  color="#1877F2"
                />
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/role-selection")}
                disabled={loading}
              >
                <Text style={styles.loginLink}>Sign in here</Text>
              </TouchableOpacity>
            </View>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    marginBottom: 20,
  },
  shieldIcon: {
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
  phoneContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  countryCodeWrapper: {
    width: 80,
  },
  countryCodeInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
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
    backgroundColor: COLORS.white,
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
    flex: 1,
  },
  agreementsContainer: {
    marginBottom: 20,
    paddingBottom: 8,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  agreementText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    marginTop: 4,
  },
  linkText: {
    color: COLORS.accent,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  registerButton: {
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: COLORS.textLight,
    fontSize: 13,
  },
  socialContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
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
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: "700",
  },
});
