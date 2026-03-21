import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Card, Divider, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const COLORS = {
  primary: "#21100B",
  secondary: "#8C7D79",
  accent: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  white: "#FFFFFF",
};

const GENERAL_SETTINGS = [
  {
    id: "notifications",
    title: "Push Notifications",
    icon: "bell-outline",
    color: "#F59E0B",
    type: "switch",
  },
  {
    id: "email",
    title: "Email Notifications",
    icon: "email-outline",
    color: "#10B981",
    type: "switch",
  },
  {
    id: "alerts",
    title: "SOS Alerts",
    icon: "alert-circle-outline",
    color: "#EF4444",
    type: "switch",
  },
  {
    id: "language",
    title: "Language",
    icon: "translate",
    color: "#8B5CF6",
    type: "navigate",
    value: "English",
  },
  {
    id: "timezone",
    title: "Timezone",
    icon: "clock-outline",
    color: "#0EA5E9",
    type: "navigate",
    value: "IST (UTC+5:30)",
  },
];

const SECURITY_SETTINGS = [
  {
    id: "2fa",
    title: "Two-Factor Authentication",
    icon: "shield-lock-outline",
    color: "#10B981",
    type: "switch",
  },
  {
    id: "password",
    title: "Change Password",
    icon: "lock-outline",
    color: "#1E40AF",
    type: "navigate",
  },
  {
    id: "sessions",
    title: "Active Sessions",
    icon: "devices",
    color: "#8B5CF6",
    type: "navigate",
    value: "3 devices",
  },
  {
    id: "audit",
    title: "Audit Logs",
    icon: "history",
    color: "#F59E0B",
    type: "navigate",
  },
];

const SYSTEM_SETTINGS = [
  {
    id: "backup",
    title: "Data Backup",
    icon: "cloud-upload-outline",
    color: "#0EA5E9",
    type: "navigate",
    value: "Last: 2 hours ago",
  },
  {
    id: "maintenance",
    title: "Maintenance Mode",
    icon: "tools",
    color: "#EF4444",
    type: "switch",
  },
  {
    id: "api",
    title: "API Settings",
    icon: "api",
    color: "#10B981",
    type: "navigate",
  },
  {
    id: "integrations",
    title: "Integrations",
    icon: "connection",
    color: "#8B5CF6",
    type: "navigate",
    value: "5 active",
  },
];

export default function SettingsScreen() {
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    notifications: true,
    email: true,
    alerts: true,
    "2fa": false,
    maintenance: false,
  });
  const insets = useSafeAreaInsets();

  const toggleSwitch = (id: string) => {
    if (id === "maintenance") {
      Alert.alert(
        "Maintenance Mode",
        switches[id]
          ? "Are you sure you want to disable maintenance mode?"
          : "Enabling maintenance mode will restrict user access. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: () => setSwitches({ ...switches, [id]: !switches[id] }),
          },
        ],
      );
    } else {
      setSwitches({ ...switches, [id]: !switches[id] });
    }
  };

  const renderSettingItem = (item: any, index: number, isLast: boolean) => (
    <React.Fragment key={item.id}>
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() =>
          item.type === "navigate" && console.log("Navigate to", item.id)
        }
        disabled={item.type === "switch"}
      >
        <View
          style={[styles.settingIcon, { backgroundColor: `${item.color}15` }]}
        >
          <MaterialCommunityIcons
            name={item.icon as any}
            size={22}
            color={item.color}
          />
        </View>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        </View>
        {item.type === "switch" ? (
          <Switch
            value={switches[item.id]}
            onValueChange={() => toggleSwitch(item.id)}
            color={COLORS.primary}
          />
        ) : (
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={COLORS.textLight}
          />
        )}
      </TouchableOpacity>
      {!isLast && <Divider />}
    </React.Fragment>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your admin preferences
          </Text>
        </View>

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <Card style={styles.settingsCard}>
            {GENERAL_SETTINGS.map((item, index) =>
              renderSettingItem(
                item,
                index,
                index === GENERAL_SETTINGS.length - 1,
              ),
            )}
          </Card>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <Card style={styles.settingsCard}>
            {SECURITY_SETTINGS.map((item, index) =>
              renderSettingItem(
                item,
                index,
                index === SECURITY_SETTINGS.length - 1,
              ),
            )}
          </Card>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System</Text>
          <Card style={styles.settingsCard}>
            {SYSTEM_SETTINGS.map((item, index) =>
              renderSettingItem(
                item,
                index,
                index === SYSTEM_SETTINGS.length - 1,
              ),
            )}
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: COLORS.error }]}>
            Danger Zone
          </Text>
          <Card style={[styles.settingsCard, styles.dangerCard]}>
            <TouchableOpacity
              style={styles.dangerItem}
              onPress={() =>
                Alert.alert(
                  "Clear Cache",
                  "This will clear all cached data. Continue?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Clear", style: "destructive" },
                  ],
                )
              }
            >
              <View
                style={[styles.settingIcon, { backgroundColor: "#FEE2E2" }]}
              >
                <MaterialCommunityIcons
                  name="delete-sweep"
                  size={22}
                  color={COLORS.error}
                />
              </View>
              <Text style={styles.dangerText}>Clear System Cache</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity
              style={styles.dangerItem}
              onPress={() =>
                Alert.alert(
                  "Reset Database",
                  "⚠️ This action cannot be undone! Are you sure?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset", style: "destructive" },
                  ],
                )
              }
            >
              <View
                style={[styles.settingIcon, { backgroundColor: "#FEE2E2" }]}
              >
                <MaterialCommunityIcons
                  name="database-remove"
                  size={22}
                  color={COLORS.error}
                />
              </View>
              <Text style={styles.dangerText}>Reset Database</Text>
            </TouchableOpacity>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>SentryApp Admin v1.0.0</Text>
          <Text style={styles.appCopyright}>
            © 2026 SentryApp. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  settingsCard: {
    borderRadius: 16,
    elevation: 2,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.text,
  },
  settingValue: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  dangerText: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.error,
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 32,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  appCopyright: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 4,
  },
});
