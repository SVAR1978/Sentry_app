import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { resources } from '../locales';

// ─── STORAGE KEY ────────────────────────────────────────
const LANGUAGE_STORAGE_KEY = '@sentryapp:language';

// ─── SUPPORTED LANGUAGES ────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिंदी', flag: '🇮🇳' },
  { code: 'as', label: 'Assamese', nativeLabel: 'অসমীয়া', flag: '🇮🇳' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

// ─── DEFAULT NAMESPACES ─────────────────────────────────
export const DEFAULT_NS = 'common';
export const NAMESPACES = ['common', 'auth', 'emergency'] as const;

// ─── DETECT DEVICE LANGUAGE ─────────────────────────────
// Only returns a code we support; otherwise falls back to 'en'
function getDeviceLanguage(): LanguageCode {
  try {
    const locales = getLocales();
    if (locales && locales.length > 0) {
      const deviceLang = locales[0].languageCode;
      const supported = SUPPORTED_LANGUAGES.find((l) => l.code === deviceLang);
      if (supported) return supported.code;
    }
  } catch (e) {
    console.warn('[i18n] Failed to detect device language:', e);
  }
  return 'en';
}

// ─── LOAD PERSISTED LANGUAGE ────────────────────────────
export async function getStoredLanguage(): Promise<LanguageCode | null> {
  try {
    const storedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLang && SUPPORTED_LANGUAGES.some((l) => l.code === storedLang)) {
      return storedLang as LanguageCode;
    }
  } catch (e) {
    console.warn('[i18n] Failed to read stored language:', e);
  }
  return null;
}

// ─── PERSIST LANGUAGE CHOICE ────────────────────────────
export async function setStoredLanguage(lang: LanguageCode): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (e) {
    console.warn('[i18n] Failed to persist language:', e);
  }
}

// ─── CHANGE LANGUAGE (public API) ───────────────────────
export async function changeLanguage(lang: LanguageCode): Promise<void> {
  await i18n.changeLanguage(lang);
  await setStoredLanguage(lang);
}

// ─── INITIALISE i18n ────────────────────────────────────
// This is called once before the app renders (see _layout.tsx).
// It resolves the correct language: stored > device > 'en'.
export async function initI18n(): Promise<void> {
  const stored = await getStoredLanguage();
  const initialLang = stored ?? getDeviceLanguage();

  await i18n.use(initReactI18next).init({
    resources,
    lng: initialLang,
    fallbackLng: 'en',
    defaultNS: DEFAULT_NS,
    ns: [...NAMESPACES],

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false, // Prevent Suspense; we handle loading ourselves
    },
  });
}

export default i18n;
