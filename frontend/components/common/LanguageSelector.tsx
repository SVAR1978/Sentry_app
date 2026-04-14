import React, { useCallback, useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Check, Globe, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import {
  changeLanguage,
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from '../../config/i18n';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── DESIGN TOKENS ──────────────────────────────────────
const COLORS = {
  primary: '#21100B',
  primaryContainer: '#4A4341',
  white: '#FFFFFF',
  background: '#F5F1EE',
  textMuted: '#8C7D79',
  cardBorder: 'rgba(33, 16, 11, 0.06)',
  cardShadow: '#21100B',
  success: '#10B981',
  overlay: 'rgba(0, 0, 0, 0.55)', // slightly darker overlay for contrast
};

// ─── PROPS ──────────────────────────────────────────────
interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

// ─── COMPONENT ──────────────────────────────────────────
export default function LanguageSelector({
  visible,
  onClose,
}: LanguageSelectorProps) {
  const { t, i18n } = useTranslation('common');
  const currentLang = i18n.language as LanguageCode;

  // ── Animations ────────────────────────────────────────
  const slideAnim = useRef(new Animated.Value(500)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 24,
          stiffness: 240,
          mass: 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 500,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // ── Language Selection Handler ────────────────────────
  const handleSelect = useCallback(
    async (code: LanguageCode) => {
      if (code === currentLang) {
        onClose();
        return;
      }
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await changeLanguage(code);
      onClose();
    },
    [currentLang, onClose]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
          {Platform.OS === 'ios' && (
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
          )}
        </Pressable>
      </Animated.View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Glass Background */}
        <View style={styles.sheetInner}>
          {Platform.OS === 'ios' && (
            <BlurView
              intensity={95}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          )}
          <View style={styles.solidBg} />

          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.globeCircle}>
                <Globe size={24} color={COLORS.primary} strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.title}>{t('selectLanguage')}</Text>
                <Text style={styles.subtitle}>{t('language')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={20} color={COLORS.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Language Options */}
          <View style={styles.optionsList}>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = lang.code === currentLang;
              
              const innerContent = (
                <>
                  <View style={styles.optionLeft}>
                    <View style={styles.flagContainer}>
                      <Text style={styles.flag}>{lang.flag}</Text>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.optionLabel,
                          isActive && styles.optionLabelActive,
                        ]}
                      >
                        {lang.nativeLabel}
                      </Text>
                      <Text
                        style={[
                          styles.optionSublabel,
                          isActive && styles.optionSublabelActive,
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </View>
                  </View>
                  {isActive ? (
                    <View style={styles.checkCircleActive}>
                      <Check
                        size={16}
                        color={COLORS.primary}
                        strokeWidth={3.5}
                      />
                    </View>
                  ) : (
                    <View style={styles.checkCirclePlaceholder} />
                  )}
                </>
              );

              if (isActive) {
                return (
                  <TouchableOpacity
                    key={lang.code}
                    onPress={() => handleSelect(lang.code)}
                    activeOpacity={0.9}
                    style={styles.optionWrapper}
                  >
                    <LinearGradient
                      colors={[COLORS.primary, COLORS.primaryContainer]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={[styles.option, styles.optionActiveContainer]}
                    >
                      {innerContent}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={lang.code}
                  style={[styles.option, styles.optionInactive]}
                  onPress={() => handleSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  {innerContent}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── STYLES ─────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
      },
      android: {
        elevation: 30,
      },
    }),
  },
  sheetInner: {
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  solidBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255,255,255,0.92)' : COLORS.white,
  },
  handleContainer: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handleBar: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(33, 16, 11, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 18,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  globeCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: 'rgba(33, 16, 11, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(33, 16, 11, 0.06)',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(33, 16, 11, 0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  optionWrapper: {
    borderRadius: 22,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
        shadowColor: COLORS.primary,
      },
    }),
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingRight: 20,
    borderRadius: 22,
  },
  optionInactive: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  optionActiveContainer: {
    borderWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  flagContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  flag: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  optionLabelActive: {
    fontWeight: '800',
    color: COLORS.white,
  },
  optionSublabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  optionSublabelActive: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  checkCircleActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  checkCirclePlaceholder: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(33, 16, 11, 0.1)',
  },
});
