import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../store/AuthContext";
import { theme } from "../theme";
import { 
  useFonts, 
  PlusJakartaSans_500Medium, 
  PlusJakartaSans_700Bold, 
  PlusJakartaSans_800ExtraBold 
} from "@expo-google-fonts/plus-jakarta-sans";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent auto conceal while fetching heavy font files
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Hold back rendering until fonts are perfectly loaded
  }
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}
