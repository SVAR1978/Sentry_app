import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: "#21100B",            // Deep Brown — unchanged, excellent
    onPrimary: "#F5F1EE",          // Warmed from cold #F2F2F2
    primaryContainer: "#4A4341",   // Graphite — unchanged
    onPrimaryContainer: "#F5F1EE", // Warmed

    background: "#F5F1EE",         // ← CHANGED: bone-warm off-white, matches your brown
    surface: "#FFFFFF",            // Pure white cards — unchanged
    onSurface: "#1A1818",          // Strong text — unchanged
    surfaceVariant: "#EDE7E3",     // Added: for input fields, chips, tonal surfaces

    secondary: "#4A4341",          // Graphite — unchanged
    onSecondary: "#F5F1EE",        // Warmed
    secondaryContainer: "#E8E0DC", // ← CHANGED: warm gray (was cold #C2C2C2)
    onSecondaryContainer: "#1A1818",

    outline: "#8C7D79",            // Neutral Stone — unchanged, perfect
    outlineVariant: "#C8BEBC",     // ← CHANGED: warm-tinted (was neutral #C2C2C2)

    error: "#D93636",              // ← FIXED: was #FF6B6B (failed WCAG AA at 3.1:1 ratio)
    onError: "#FFFFFF",
    errorContainer: "#FDECEA",     // Added: for error chip backgrounds
    onErrorContainer: "#A32020",

    success: "#10B981",            // Emerald — unchanged, great choice
    onSuccess: "#FFFFFF",

    warning: "#D97706",            // ← ADDED: amber, essential for Sentry severity states
    onWarning: "#FFFFFF",
  },
};