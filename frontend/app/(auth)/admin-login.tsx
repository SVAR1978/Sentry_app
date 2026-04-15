import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
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
import { Checkbox, Snackbar, TextInput, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../store/AuthContext";
import { useTranslation } from "react-i18next";

const FORM_WIDTH = Dimensions.get("window").width;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  headerDark: "#21100B",
  headerMid: "#38302E",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  primary: "#21100B",
  accent: "#38302E",
  error: "#D93636",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  border: "#EDE7E3",
  link: "#38302E",
  white: "#FFFFFF",
  success: "#10B981",
};

type AuthTab = "signin" | "signup";

export default function AdminLogin() {
  const { login, logout, signup } = useAuth();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const { t } = useTranslation('auth');

  // ── Shared state ──
  const [activeTab, setActiveTab] = useState<AuthTab>("signin");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarIsError, setSnackbarIsError] = useState(false);

  // ── Sign In state ──
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});

  // ── Sign Up state ──
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureSignupText, setSecureSignupText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);
  const [signupErrors, setSignupErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // ── Animations ──
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const pagerAnim = useRef(new Animated.Value(0)).current;

  // ── Tab switching ──
  const switchTab = useCallback(
    (tab: AuthTab) => {
      if (tab === activeTab || loading) return;
      setActiveTab(tab);

      Animated.spring(pagerAnim, {
        toValue: tab === "signup" ? 1 : 0,
        tension: 50,
        friction: 12,
        useNativeDriver: true,
      }).start();

      scrollRef.current?.scrollTo({ y: 0, animated: true });
    },
    [activeTab, loading]
  );

  // ── Shake ──
  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  // ── Sign In validation & handler ──
  const validateLogin = () => {
    const errs: { email?: string; password?: string } = {};
    if (!loginEmail.trim()) errs.email = t('emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail)) errs.email = t('validEmail');
    if (!loginPassword.trim()) errs.password = t('passwordRequired');
    else if (loginPassword.length < 6) errs.password = t('passwordMin6');
    setLoginErrors(errs);
    if (Object.keys(errs).length > 0) { shakeAnimation(); return false; }
    return true;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const loggedInUser = await login(loginEmail, loginPassword, rememberMe);
      if (loggedInUser.role.name !== "admin") {
        await logout();
        setSnackbarIsError(true);
        setSnackbarMessage(t('accessDenied'));
        setSnackbarVisible(true);
        return;
      }
      router.replace("/(admin-tabs)");
    } catch (error: any) {
      setSnackbarIsError(true);
      setSnackbarMessage(error.message || t('loginFailed'));
      setSnackbarVisible(true);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up validation & handler ──
  const validateSignup = () => {
    const errs: {
      fullName?: string; email?: string;
      password?: string; confirmPassword?: string;
    } = {};
    if (!fullName.trim()) errs.fullName = t('fullNameRequired');
    if (!signupEmail.trim()) errs.email = t('emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) errs.email = t('validEmail');
    if (!signupPassword.trim()) errs.password = t('passwordRequired');
    else if (signupPassword.length < 8) errs.password = t('passwordMin8');
    if (!confirmPassword.trim()) errs.confirmPassword = t('confirmPasswordRequired');
    else if (signupPassword !== confirmPassword) errs.confirmPassword = t('passwordsNoMatch');
    setSignupErrors(errs);
    if (Object.keys(errs).length > 0) { shakeAnimation(); return false; }
    return true;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    setLoading(true);
    try {
      await signup(fullName, signupEmail, "", signupPassword, "ADMIN");
      setSnackbarIsError(false);
      setSnackbarMessage(t('adminAccountCreated'));
      setSnackbarVisible(true);
      router.push({
        pathname: "/(auth)/success",
        params: { userName: fullName, userRole: "admin" },
      });
    } catch (error: any) {
      setSnackbarIsError(true);
      setSnackbarMessage(error.message || t('signupFailed'));
      setSnackbarVisible(true);
      shakeAnimation();
    } finally {
      setLoading(false);
    }
  };

  // ── Pager interpolations ──
  const tabHalfWidth = (SCREEN_WIDTH - 48) / 2;
  const indicatorTranslateX = pagerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabHalfWidth],
  });
  const pagerTranslateX = pagerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -FORM_WIDTH],
  });

  // ── Render ──
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
          {/* ═══════ Dark Header ═══════ */}
          <LinearGradient
            colors={[COLORS.headerDark, COLORS.headerMid]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, { paddingTop: insets.top + 30 }]}
          >
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            {/* App Logo */}
            <View style={styles.logoWrapper}>
              <Image
                source={require("../../assets/images/sentry-3.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            {/* Admin Badge */}
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>{t('adminPortal')}</Text>
            </View>

            {/* Tab Row */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={styles.tab}
                activeOpacity={0.7}
                onPress={() => switchTab("signin")}
              >
                <Text style={[styles.tabText, activeTab === "signin" && styles.tabTextActive]}>
                  {t('signIn')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                activeOpacity={0.7}
                onPress={() => switchTab("signup")}
              >
                <Text style={[styles.tabText, activeTab === "signup" && styles.tabTextActive]}>
                  {t('signUp')}
                </Text>
              </TouchableOpacity>

              {/* Animated underline indicator */}
              <Animated.View
                style={[
                  styles.tabIndicator,
                  { width: tabHalfWidth, transform: [{ translateX: indicatorTranslateX }] },
                ]}
              />
            </View>
          </LinearGradient>

          {/* ═══════ Pager — both forms side-by-side ═══════ */}
          <View style={styles.pagerClip}>
            <Animated.View
              style={[
                styles.pagerTrack,
                { transform: [{ translateX: pagerTranslateX }] },
              ]}
            >
              {/* ─── PAGE 1: SIGN IN ─── */}
              <Animated.View style={[styles.formPage, { transform: [{ translateX: shakeAnim }] }]}>
                <View style={styles.welcomeRow}>
                  <Text style={styles.welcomeHeader}>{t('welcomeAdmin')}</Text>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('adminEmail')}</Text>
                  <TextInput
                    value={loginEmail}
                    onChangeText={(v) => {
                      setLoginEmail(v);
                      if (loginErrors.email) setLoginErrors({ ...loginErrors, email: undefined });
                    }}
                    placeholder={t('enterAdminEmail')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    error={!!loginErrors.email}
                    mode="flat"
                  />
                  {loginErrors.email && <Text style={styles.errorText}>{loginErrors.email}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('password')}</Text>
                  <TextInput
                    value={loginPassword}
                    onChangeText={(v) => {
                      setLoginPassword(v);
                      if (loginErrors.password) setLoginErrors({ ...loginErrors, password: undefined });
                    }}
                    placeholder={t('enterPassword')}
                    secureTextEntry={secureText}
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    right={
                      <TextInput.Icon
                        icon={secureText ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setSecureText(!secureText)}
                      />
                    }
                    error={!!loginErrors.password}
                    mode="flat"
                  />
                  {loginErrors.password && <Text style={styles.errorText}>{loginErrors.password}</Text>}
                </View>

                {/* Options */}
                <View style={styles.optionsRow}>
                  <TouchableOpacity
                    style={styles.rememberRow}
                    onPress={() => setRememberMe(!rememberMe)}
                    disabled={loading}
                  >
                    <Checkbox
                      status={rememberMe ? "checked" : "unchecked"}
                      onPress={() => setRememberMe(!rememberMe)}
                      disabled={loading}
                      color={COLORS.accent}
                    />
                    <Text style={styles.rememberText}>{t('rememberMe')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/forget-password")}
                    disabled={loading}
                  >
                    <Text style={styles.forgotText}>{t('forgotPassword')}</Text>
                  </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  activeOpacity={0.85}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} size={22} />
                  ) : (
                    <Text style={styles.primaryButtonText}>{t('adminSignIn')}</Text>
                  )}
                </TouchableOpacity>

                {/* Switch prompt */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>{t('needAdminAccess')} </Text>
                  <TouchableOpacity onPress={() => switchTab("signup")}>
                    <Text style={styles.switchLink}>{t('requestAccount')}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>

              {/* ─── PAGE 2: SIGN UP ─── */}
              <Animated.View style={[styles.formPage, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.headline}>{t('adminRegistration')}</Text>

                {/* Notice */}
                <View style={styles.noticeBar}>
                  <Text style={styles.noticeText}>{t('adminVerification')}</Text>
                </View>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('fullName')}</Text>
                  <TextInput
                    value={fullName}
                    onChangeText={(v) => {
                      setFullName(v);
                      if (signupErrors.fullName) setSignupErrors({ ...signupErrors, fullName: undefined });
                    }}
                    placeholder={t('enterFullName')}
                    autoCapitalize="words"
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    error={!!signupErrors.fullName}
                    mode="flat"
                  />
                  {signupErrors.fullName && <Text style={styles.errorText}>{signupErrors.fullName}</Text>}
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('adminEmail')}</Text>
                  <TextInput
                    value={signupEmail}
                    onChangeText={(v) => {
                      setSignupEmail(v);
                      if (signupErrors.email) setSignupErrors({ ...signupErrors, email: undefined });
                    }}
                    placeholder={t('enterAdminEmail')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    error={!!signupErrors.email}
                    mode="flat"
                  />
                  {signupErrors.email && <Text style={styles.errorText}>{signupErrors.email}</Text>}
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('password')}</Text>
                  <TextInput
                    value={signupPassword}
                    onChangeText={(v) => {
                      setSignupPassword(v);
                      if (signupErrors.password) setSignupErrors({ ...signupErrors, password: undefined });
                    }}
                    placeholder={t('createStrongPassword')}
                    secureTextEntry={secureSignupText}
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    right={
                      <TextInput.Icon
                        icon={secureSignupText ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setSecureSignupText(!secureSignupText)}
                      />
                    }
                    error={!!signupErrors.password}
                    mode="flat"
                  />
                  {signupErrors.password && <Text style={styles.errorText}>{signupErrors.password}</Text>}
                </View>

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>{t('confirmPassword')}</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(v) => {
                      setConfirmPassword(v);
                      if (signupErrors.confirmPassword) setSignupErrors({ ...signupErrors, confirmPassword: undefined });
                    }}
                    placeholder={t('confirmYourPassword')}
                    secureTextEntry={secureConfirmText}
                    editable={!loading}
                    style={styles.input}
                    underlineColor={COLORS.border}
                    activeUnderlineColor={COLORS.accent}
                    right={
                      <TextInput.Icon
                        icon={secureConfirmText ? "eye-off-outline" : "eye-outline"}
                        onPress={() => setSecureConfirmText(!secureConfirmText)}
                      />
                    }
                    error={!!signupErrors.confirmPassword}
                    mode="flat"
                  />
                  {signupErrors.confirmPassword && <Text style={styles.errorText}>{signupErrors.confirmPassword}</Text>}
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  activeOpacity={0.85}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={COLORS.white} size={22} />
                  ) : (
                    <Text style={styles.primaryButtonText}>{t('createAdminAccount')}</Text>
                  )}
                </TouchableOpacity>

                {/* Switch prompt */}
                <View style={styles.switchRow}>
                  <Text style={styles.switchText}>{t('haveAccount')} </Text>
                  <TouchableOpacity onPress={() => switchTab("signin")}>
                    <Text style={styles.switchLink}>{t('signInLink')}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
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
    paddingBottom: 0,
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
  blob3: {
    position: "absolute",
    top: 40,
    left: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  logoWrapper: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
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
  adminBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  adminBadgeText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
  },

  /* ── Tabs ── */
  tabRow: {
    flexDirection: "row",
    width: "100%",
    position: "relative",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.45)",
  },
  tabTextActive: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: COLORS.white,
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  /* ── Pager ── */
  pagerClip: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },
  pagerTrack: {
    flexDirection: "row",
    width: FORM_WIDTH * 2,
    flex: 1,
  },
  formPage: {
    width: FORM_WIDTH,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 48,
    justifyContent: "center",
  },
  welcomeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  welcomeHeader: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 34,
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  headline: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 36,
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 20,
    lineHeight: 42,
  },
  noticeBar: {
    backgroundColor: `${COLORS.primary}10`,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: `${COLORS.primary}15`,
  },
  noticeText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
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
  errorText: {
    fontFamily: "PlusJakartaSans_500Medium",
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
    marginTop: 4,
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberText: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.textPrimary,
    marginLeft: 4,
  },
  forgotText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 13,
    color: COLORS.link,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    height: 58,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  switchText: {
    fontFamily: "PlusJakartaSans_500Medium",
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  switchLink: {
    fontFamily: "PlusJakartaSans_700Bold",
    color: COLORS.accent,
    fontSize: 14,
  },
});
