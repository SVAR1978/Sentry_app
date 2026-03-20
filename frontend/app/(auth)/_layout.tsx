import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="user-login" />
      <Stack.Screen name="admin-login" />
      <Stack.Screen name="user-signup" />
      <Stack.Screen name="admin-signup" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forget-password" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
