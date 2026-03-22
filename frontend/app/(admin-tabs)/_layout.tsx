import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";

const COLORS = {
  primary: "#21100B",
  accent: "#8C7D79",
  error: "#D93636",
  warning: "#D97706",
  success: "#10B981",
  background: "#F5F1EE",
  text: "#1A1818",
  textLight: "#4A4341",
  border: "#EDE7E3",
  white: "#FFFFFF",
};

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: "#21100B",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: `${COLORS.primary}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? "view-dashboard" : "view-dashboard-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: `${COLORS.accent}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? "account-group" : "account-group-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Reports",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: `${COLORS.warning}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? "chart-box" : "chart-box-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: `${COLORS.success}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? "cog" : "cog-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && { backgroundColor: `${COLORS.primary}15` },
              ]}
            >
              <MaterialCommunityIcons
                name={focused ? "account-circle" : "account-circle-outline"}
                size={24}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 12,
  },
});
