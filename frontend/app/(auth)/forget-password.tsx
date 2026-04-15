import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Snackbar, TextInput, ActivityIndicator } from "react-native-paper";
import { ChevronLeft, Check, Circle } from "lucide-react-native";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const COLORS = {
  headerDark: "#21100B",
  headerMid: "#38302E",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  primary: "#21100B",
  accent: "#38302E",
  error: "#D93636",
  warning: "#D97706",
  success: "#10B981",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  textLight: "#4A4341",
  border: "#EDE7E3",
  white: "#FFFFFF",
};

type Step = "email" | "verification" | "reset-password";

interface PasswordStrength {
  score: number;
  text: string;
  color: string;
}

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState({ password: true, confirm: true });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsError, setSnackbarIsError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation('auth');

  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const getPasswordStrength = (): PasswordStrength => {
    const score = Object.values(passwordRequirements).filter(Boolean).length;
    if (score === 0) return { score: 0, text: t('strengthNone'), color: COLORS.error };
    if (score <= 2) return { score: 1, text: t('strengthWeak'), color: COLORS.error };
    if (score < 4) return { score: 2, text: t('strengthMedium'), color: COLORS.warning };
    return { score: 3, text: t('strengthStrong'), color: COLORS.success };
  };

  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  // ── Validations ──
  const validateEmail = () => {
    const e: Record<string, string | undefined> = {};
    if (!email.trim()) e.email = t('emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = t('validEmail');
    setErrors(e);
    if (Object.keys(e).length > 0) { shakeAnimation(); return false; }
    return true;
  };

  const validateVerificationCode = () => {
    const e: Record<string, string | undefined> = {};
    if (!verificationCode.trim()) e.code = t('codeRequired');
    else if (verificationCode.length < 4) e.code = t('codeMin4');
    else if (verificationCode.length > 6) e.code = t('codeMax6');
    setErrors(e);
    if (Object.keys(e).length > 0) { shakeAnimation(); return false; }
    return true;
  };

  const validatePasswordReset = () => {
    const e: Record<string, string | undefined> = {};
    if (!newPassword.trim()) e.password = t('passwordRequired');
    else if (!Object.values(passwordRequirements).every(Boolean)) e.password = t('passwordRequirementsUnmet');
    if (newPassword !== confirmPassword) e.confirmPassword = t('passwordsNoMatch');
    setErrors(e);
    if (Object.keys(e).length > 0) { shakeAnimation(); return false; }
    return true;
  };

  // ── Handlers ──
  const handleSendCode = async () => {
    if (!validateEmail()) return;
    setLoading(true); setErrors({});
    try {
      const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('failedSendCode'));
      setStep("verification");
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error: any) {
      setSnackbarIsError(true);
      setSnackbarMessage(error.message || t('failedSendCode'));
      setSnackbarVisible(true);
      shakeAnimation();
    } finally { setLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationCode()) return;
    setLoading(true); setErrors({});
    try {
      const response = await fetch(`${BACKEND_URL}/auth/verify-code`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('invalidCode'));
      setStep("reset-password");
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (error: any) {
      setSnackbarIsError(true);
      setSnackbarMessage(error.message || t('invalidCode'));
      setSnackbarVisible(true);
      shakeAnimation();
    } finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!validatePasswordReset()) return;
    setLoading(true); setErrors({});
    try {
      const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || t('failedResetPassword'));
      setSnackbarIsError(false);
      setSnackbarMessage(t('passwordResetSuccess'));
      setSnackbarVisible(true);
      setTimeout(() => router.replace("/(auth)/user-login"), 1200);
    } catch (error: any) {
      setSnackbarIsError(true);
      setSnackbarMessage(error.message || t('failedResetPassword'));
      setSnackbarVisible(true);
      shakeAnimation();
    } finally { setLoading(false); }
  };

  const passwordStrength = getPasswordStrength();
  const stepNumber = step === "email" ? 1 : step === "verification" ? 2 : 3;

  const getStepHeadline = () => {
    if (step === "email") return t('forgotPasswordHeader');
    if (step === "verification") return t('verifyCodeHeader');
    return t('newPasswordHeader');
  };

  const getStepSubtitle = () => {
    if (step === "email") return t('enterEmailToReceiveCode');
    if (step === "verification") return t('enterCodeSentToEmail');
    return t('createStrongNewPassword');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ──── Dark Header ──── */}
          <LinearGradient
            colors={[COLORS.headerDark, COLORS.headerMid]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, { paddingTop: insets.top + 12 }]}
          >
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={loading}
              activeOpacity={0.7}
            >
              <ChevronLeft size={24} color={COLORS.white} strokeWidth={2.5} />
            </TouchableOpacity>

            {/* App Logo */}
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/images/sentry-3.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Step Indicator Dots */}
            <View style={styles.stepRow}>
              {[1, 2, 3].map((num) => (
                <View
                  key={num}
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: num <= stepNumber ? COLORS.white : "rgba(255,255,255,0.25)",
                      width: num === stepNumber ? 24 : 8,
                    },
                  ]}
                />
              ))}
            </View>
          </LinearGradient>

          {/* ──── White Form Section ──── */}
          <View style={styles.formSection}>
            <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
              {/* Dynamic Headline */}
              <Text style={styles.headline}>{getStepHeadline()}</Text>
              <Text style={styles.subtitle}>{getStepSubtitle()}</Text>

              {/* ── Step 1: Email ── */}
              {step === "email" && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('emailAddress')}</Text>
                    <TextInput
                      value={email}
                      onChangeText={(v) => {
                        setEmail(v);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder={t('youAtExampleCom')}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      editable={!loading}
                      style={styles.input}
                      underlineColor={COLORS.border}
                      activeUnderlineColor={COLORS.accent}
                      error={!!errors.email}
                      mode="flat"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <Text style={styles.helperText}>
                    {t('sendCodeHelperText')}
                  </Text>

                  <TouchableOpacity
                    style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                    activeOpacity={0.85}
                    onPress={handleSendCode}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} size={22} />
                    ) : (
                      <Text style={styles.primaryButtonText}>{t('sendCodeBtn')}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => router.back()}
                    disabled={loading}
                  >
                    <Text style={styles.backLinkText}>{t('backToSignIn')}</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ── Step 2: Verification Code ── */}
              {step === "verification" && (
                <>
                  <View style={styles.codeSentBox}>
                    <Text style={styles.codeSentLabel}>{t('codeSentTo')}</Text>
                    <Text style={styles.codeSentEmail}>{email}</Text>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('verificationCode')}</Text>
                    <TextInput
                      value={verificationCode}
                      onChangeText={(v) => {
                        const numericValue = v.replace(/[^0-9]/g, "");
                        setVerificationCode(numericValue);
                        if (errors.code) setErrors({ ...errors, code: undefined });
                      }}
                      placeholder="000000"
                      keyboardType="number-pad"
                      editable={!loading}
                      maxLength={6}
                      style={[styles.input, styles.codeInput]}
                      underlineColor={COLORS.border}
                      activeUnderlineColor={COLORS.accent}
                      error={!!errors.code}
                      mode="flat"
                    />
                    {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
                  </View>

                  <TouchableOpacity
                    style={[styles.primaryButton, (loading || verificationCode.length < 4) && styles.primaryButtonDisabled]}
                    activeOpacity={0.85}
                    onPress={handleVerifyCode}
                    disabled={loading || verificationCode.length < 4}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} size={22} />
                    ) : (
                      <Text style={styles.primaryButtonText}>{t('verifyCodeBtn')}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => { setStep("email"); setVerificationCode(""); setErrors({}); }}
                    disabled={loading}
                  >
                    <Text style={styles.backLinkText}>{t('backToEmail')}</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* ── Step 3: Reset Password ── */}
              {step === "reset-password" && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('newPassword')}</Text>
                    <TextInput
                      value={newPassword}
                      onChangeText={(v) => {
                        setNewPassword(v);
                        if (errors.password) setErrors({ ...errors, password: undefined });
                      }}
                      placeholder={t('createStrongPassword')}
                      secureTextEntry={secureText.password}
                      editable={!loading}
                      style={styles.input}
                      underlineColor={COLORS.border}
                      activeUnderlineColor={COLORS.accent}
                      right={
                        <TextInput.Icon
                          icon={secureText.password ? "eye-off-outline" : "eye-outline"}
                          onPress={() => setSecureText((p) => ({ ...p, password: !p.password }))}
                        />
                      }
                      error={!!errors.password}
                      mode="flat"
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                    {/* Password Strength */}
                    {newPassword.length > 0 && (
                      <View style={styles.strengthContainer}>
                        <View style={styles.strengthBar}>
                          <View style={[styles.strengthFill, { flex: passwordStrength.score, backgroundColor: passwordStrength.color }]} />
                          <View style={{ flex: 3 - passwordStrength.score, backgroundColor: COLORS.border }} />
                        </View>
                        <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>{passwordStrength.text}</Text>
                      </View>
                    )}

                    {/* Requirements */}
                    <View style={styles.requirementsBox}>
                      {[
                        { text: t('min8Chars'), met: passwordRequirements.minLength },
                        { text: t('uppercaseLetter'), met: passwordRequirements.hasUppercase },
                        { text: t('number'), met: passwordRequirements.hasNumber },
                        { text: t('specialChar'), met: passwordRequirements.hasSpecial },
                      ].map((req, idx) => (
                        <View key={idx} style={styles.reqItem}>
                          {req.met ? (
                            <Check size={14} color={COLORS.success} strokeWidth={3} />
                          ) : (
                            <Circle size={14} color={COLORS.border} strokeWidth={2} />
                          )}
                          <Text style={[styles.reqText, { color: req.met ? COLORS.success : COLORS.textSecondary }]}>
                            {req.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>{t('confirmPassword')}</Text>
                    <TextInput
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                      }}
                      placeholder={t('reEnterPassword')}
                      secureTextEntry={secureText.confirm}
                      editable={!loading}
                      style={styles.input}
                      underlineColor={COLORS.border}
                      activeUnderlineColor={COLORS.accent}
                      right={
                        <TextInput.Icon
                          icon={secureText.confirm ? "eye-off-outline" : "eye-outline"}
                          onPress={() => setSecureText((p) => ({ ...p, confirm: !p.confirm }))}
                        />
                      }
                      error={!!errors.confirmPassword}
                      mode="flat"
                    />
                    {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
                  </View>

                  {errors.general && (
                    <View style={styles.alertBox}>
                      <Text style={styles.alertText}>{errors.general}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      (loading || !Object.values(passwordRequirements).every(Boolean)) && styles.primaryButtonDisabled,
                    ]}
                    activeOpacity={0.85}
                    onPress={handleResetPassword}
                    disabled={loading || !Object.values(passwordRequirements).every(Boolean)}
                  >
                    {loading ? (
                      <ActivityIndicator color={COLORS.white} size={22} />
                    ) : (
                      <Text style={styles.primaryButtonText}>{t('resetPasswordBtn')}</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backLink}
                    onPress={() => { setStep("verification"); setNewPassword(""); setConfirmPassword(""); setErrors({}); }}
                    disabled={loading}
                  >
                    <Text style={styles.backLinkText}>{t('backToVerification')}</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={4000}
        style={{ backgroundColor: snackbarIsError ? COLORS.error : COLORS.success }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  /* ── Header ── */
  header: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  blob1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  blob2: {
    position: "absolute",
    bottom: 30,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 16,
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
  },
  logoImage: {
    width: 72,
    height: 72,
  },
  stepRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  stepDot: {
    height: 8,
    borderRadius: 4,
  },

  /* ── Form Section ── */
  formSection: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
  },
  headline: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 36,
    color: COLORS.textPrimary,
    letterSpacing: -1,
    lineHeight: 42,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: "transparent",
    fontSize: 16,
    paddingHorizontal: 0,
  },
  codeInput: {
    fontSize: 22,
    letterSpacing: 8,
    textAlign: "center",
  },
  errorText: {
    fontFamily: "PlusJakartaSans_500Medium",
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 24,
    marginTop: -8,
    lineHeight: 18,
  },
  codeSentBox: {
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 14,
    marginBottom: 24,
  },
  codeSentLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  codeSentEmail: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 15,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  strengthContainer: {
    marginTop: 12,
    marginBottom: 8,
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
  strengthLabel: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
  },
  requirementsBox: {
    marginTop: 8,
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 12,
  },
  reqItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  reqText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
  },
  alertBox: {
    padding: 14,
    backgroundColor: `${COLORS.error}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${COLORS.error}30`,
    marginBottom: 18,
  },
  alertText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.error,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  backLink: {
    alignItems: "center",
    paddingVertical: 8,
  },
  backLinkText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 14,
    color: COLORS.accent,
  },
});
