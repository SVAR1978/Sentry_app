import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../store/AuthContext";
import { SocketProvider } from "../store/SocketContext";
import { theme } from "../theme";
import { 
  useFonts, 
  PlusJakartaSans_500Medium, 
  PlusJakartaSans_700Bold, 
  PlusJakartaSans_800ExtraBold 
} from "@expo-google-fonts/plus-jakarta-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { initI18n } from "../config/i18n";

// Prevent auto conceal while fetching heavy font files
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  // ── i18n must resolve saved language from AsyncStorage before first render ──
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n()
      .then(() => setI18nReady(true))
      .catch((err) => {
        console.error("[i18n] Initialization failed:", err);
        setI18nReady(true); // render anyway with fallback English
      });
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, i18nReady]);

  // Hold back rendering until fonts AND i18n are perfectly loaded
  if (!fontsLoaded || !i18nReady) {
    return null;
  }

  return (
    <AuthProvider>
      <SocketProvider>
        <PaperProvider theme={theme}>
        <StatusBar style="auto" />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Root index - redirects based on auth state */}
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          {/* Authentication flow with role selection - shown when user is not logged in */}
          <Stack.Screen
            name="(auth)"
            options={{
              animation: "fade",
            }}
          />

          {/* Admin tabs - shown for admin users */}
          <Stack.Screen
            name="(admin-tabs)"
            options={{
              animation: "slide_from_right",
            }}
          />

          {/* User tabs - shown for regular users */}
          <Stack.Screen
            name="(user-tabs)"
            options={{
              animation: "slide_from_right",
            }}
          />
        </Stack>
        </PaperProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
