import { Shield, User, Check } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ROLES, UserRole } from "../../types/rbac";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = {
  primary: "#21100B", // Deep luxurious brown/black
  background: "#F5F1EE", // Bone white
  surface: "#FFFFFF",
  white: "#FFFFFF",
  coral: "#38302E", // SOS Red / Selected Highlight
  coralLight: "#38302E",
  textLight: "#8C7D79",
  ghostBorder: "rgba(33, 16, 11, 0.06)",
};

interface RoleSelectionScreenProps {
  onRoleSelect?: (role: UserRole) => void;
  selectedEmail?: string;
}

export default function RoleSelectionScreen({
  onRoleSelect,
  selectedEmail,
}: RoleSelectionScreenProps) {
  const insets = useSafeAreaInsets();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation('auth');

  // Entrance Animations
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(40)).current;
  const scaleSelectedAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // Micro-interaction bounce for selection
    scaleSelectedAnim.setValue(0.95);
    Animated.spring(scaleSelectedAnim, {
      toValue: 1,
      tension: 60,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (onRoleSelect) {
        onRoleSelect(selectedRole);
      } else {
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

  const filteredRoles = ROLES.filter(
    (role) => role.id === "user" || role.id === "admin",
  );

  const renderRoleIcon = (roleId: string, isSelected: boolean) => {
    const props = {
      size: 28,
      color: isSelected ? COLORS.coral : COLORS.primary,
      strokeWidth: 2.5,
    };

    if (roleId === "admin") return <Shield {...props} />;
    return <User {...props} />;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Decorative ambient background blur vectors */}
      <View style={styles.ambientTopLeft} />
      <View style={styles.ambientBottomRight} />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: Math.max(insets.bottom, 40) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.centerWrapper}>
          {/* App Icon / Shield Component */}
          <Animated.View style={[styles.headerSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.iconContainer}>
              <View style={styles.iconGlassOverlay} />
              <Image
                source={require("../../assets/images/sentry-3.png")}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.iconGlowDot} />
            </View>

            <Text style={styles.headline}>Sentry</Text>
            <Text style={styles.subheadline}>{t('chooseAccessLevel')}</Text>
          </Animated.View>

          {/* Roles List (Stacked Massive Cards) */}
          <Animated.View style={[styles.rolesGrid, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {filteredRoles.map((role) => {
              const isSelected = selectedRole?.id === role.id;

              return (
                <TouchableOpacity
                  key={role.id}
                  style={styles.roleCardWrapper}
                  activeOpacity={0.9}
                  onPress={() => handleRoleSelect(role)}
                  disabled={loading}
                >
                  <Animated.View
                    style={[
                      styles.roleCard,
                      isSelected && styles.roleCardActive,
                      isSelected && { transform: [{ scale: scaleSelectedAnim }] },
                    ]}
                  >
                    <LinearGradient
                      colors={isSelected ? [COLORS.coralLight, COLORS.surface] : [COLORS.surface, COLORS.surface]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.cardGradient}
                    >
                      <View style={styles.cardRow}>
                        {/* Role Icon */}
                        <View style={[styles.roleIconWrapper, isSelected && styles.roleIconWrapperActive]}>
                          {renderRoleIcon(role.id, isSelected)}
                        </View>

                        {/* Role Texts */}
                        <View style={styles.roleTextContainer}>
                          <Text style={[styles.roleTitle, isSelected && styles.roleTitleActive]}>{role.displayName}</Text>
                          <Text style={styles.roleDesc}>
                            {role.id === "admin" ? t('adminControls') : t('standardAccess')}
                          </Text>
                        </View>

                        {/* Checkmark Indicator */}
                        <View style={[styles.checkboxCircle, isSelected && styles.checkboxCircleActive]}>
                          {isSelected && <Check size={14} color={COLORS.white} strokeWidth={3} />}
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        </View>

        {/* Action Button */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <TouchableOpacity
            style={[styles.continueButton, !selectedRole && styles.continueButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleContinue}
            disabled={!selectedRole || loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} size={24} />
            ) : (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>
                  {selectedRole ? t('continueAs', { role: selectedRole.displayName }) : t('selectRole')}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  ambientTopLeft: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(33, 16, 11, 0.03)",
  },
  ambientBottomRight: {
    position: "absolute",
    bottom: -50,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255, 56, 92, 0.03)",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  headerSection: {
    alignItems: "flex-start",
    marginBottom: 50,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40, // Perfect circle
    // Removed solid white so custom logo background doesn't clash
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.ghostBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    position: "relative",
    overflow: "hidden", // Ensures image respects circular corners
  },
  iconGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Reduced opacity
    borderRadius: 40, // Match container
    zIndex: 0,
  },
  logoImage: {
    width: 80, // Fill container width
    height: 80, // Fill container height
    zIndex: 2, // Definitely above overlay
  },
  iconGlowDot: {
    position: "absolute",
    top: 14,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.coral,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  headline: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 44,
    color: COLORS.primary,
    letterSpacing: -1.5,
    marginBottom: 12,
  },
  subheadline: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 16,
    color: COLORS.textLight,
    lineHeight: 24,
    fontWeight: "500",
    paddingRight: 40,
  },
  rolesGrid: {
    flexDirection: "column",
    gap: 16,
  },
  roleCardWrapper: {
    width: "100%",
  },
  roleCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "transparent",
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 3,
  },
  cardGradient: {
    padding: 24,
    minHeight: 120,
    justifyContent: "center",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleCardActive: {
    borderColor: COLORS.coral,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  roleIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  roleIconWrapperActive: {
    backgroundColor: COLORS.surface,
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  roleTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  roleTitle: {
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  roleTitleActive: {
    color: COLORS.coral,
  },
  roleDesc: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
    fontWeight: "500",
    paddingRight: 10,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.ghostBorder,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  checkboxCircleActive: {
    backgroundColor: COLORS.coral,
    borderColor: COLORS.coral,
  },
  footer: {
    width: "100%",
  },
  continueButton: {
    backgroundColor: COLORS.coral,
    borderRadius: 999,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.coral,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: "rgba(33, 16, 11, 0.1)",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  btnIcon: {
    marginLeft: 12,
  },
});
