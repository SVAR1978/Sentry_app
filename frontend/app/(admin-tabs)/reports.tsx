import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#1E40AF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  error: "#EF4444",
  success: "#10B981",
  background: "#F1F5F9",
  surface: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
};

const TIME_FILTERS = ["Today", "This Week", "This Month", "This Year"];

const OVERVIEW_STATS = [
  {
    label: "Total Tours",
    value: "1,234",
    change: "+12%",
    icon: "map-marker-path",
    color: COLORS.primary,
  },
  {
    label: "Active Users",
    value: "856",
    change: "+8%",
    icon: "account-check",
    color: COLORS.success,
  },
  {
    label: "SOS Alerts",
    value: "23",
    change: "-5%",
    icon: "alert-circle",
    color: COLORS.error,
  },
  {
    label: "Revenue",
    value: "₹12.4L",
    change: "+18%",
    icon: "currency-inr",
    color: COLORS.accent,
  },
];

const REPORTS = [
  {
    id: "1",
    title: "User Activity Report",
    type: "Daily",
    generated: "Today, 9:00 AM",
    status: "ready",
    icon: "account-group",
  },
  {
    id: "2",
    title: "Tourism Analytics",
    type: "Weekly",
    generated: "Yesterday, 6:00 PM",
    status: "ready",
    icon: "chart-line",
  },
  {
    id: "3",
    title: "Emergency Response",
    type: "Monthly",
    generated: "Feb 1, 2026",
    status: "ready",
    icon: "alert",
  },
  {
    id: "4",
    title: "Revenue Summary",
    type: "Monthly",
    generated: "Processing...",
    status: "processing",
    icon: "currency-inr",
  },
  {
    id: "5",
    title: "Safety Metrics",
    type: "Weekly",
    generated: "Jan 28, 2026",
    status: "ready",
    icon: "shield-check",
  },
];

export default function ReportsScreen() {
  const [selectedTime, setSelectedTime] = useState("This Week");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Reports & Analytics</Text>
          <Text style={styles.headerSubtitle}>
            Monitor your platform performance
          </Text>
        </View>

        {/* Time Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timeFilters}
        >
          {TIME_FILTERS.map((filter) => (
            <Chip
              key={filter}
              selected={selectedTime === filter}
              onPress={() => setSelectedTime(filter)}
              style={[
                styles.timeChip,
                selectedTime === filter && styles.timeChipSelected,
              ]}
              textStyle={[
                styles.timeText,
                selectedTime === filter && styles.timeTextSelected,
              ]}
            >
              {filter}
            </Chip>
          ))}
        </ScrollView>

        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {OVERVIEW_STATS.map((stat, index) => (
              <Card key={index} style={styles.statCard}>
                <Card.Content style={styles.statContent}>
                  <View
                    style={[
                      styles.statIcon,
                      { backgroundColor: `${stat.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={stat.icon as any}
                      size={22}
                      color={stat.color}
                    />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                  <View style={styles.changeContainer}>
                    <MaterialCommunityIcons
                      name={
                        stat.change.startsWith("+") ? "arrow-up" : "arrow-down"
                      }
                      size={12}
                      color={
                        stat.change.startsWith("+")
                          ? COLORS.success
                          : COLORS.error
                      }
                    />
                    <Text
                      style={[
                        styles.changeText,
                        {
                          color: stat.change.startsWith("+")
                            ? COLORS.success
                            : COLORS.error,
                        },
                      ]}
                    >
                      {stat.change}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        {/* Chart Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Activity Trend</Text>
          <Card style={styles.chartCard}>
            <Card.Content style={styles.chartContent}>
              <MaterialCommunityIcons
                name="chart-areaspline"
                size={100}
                color={COLORS.primary}
              />
              <Text style={styles.chartPlaceholder}>Activity Chart</Text>
              <Text style={styles.chartSubtext}>
                Interactive chart will be displayed here
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Generated Reports */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Generated Reports</Text>
            <TouchableOpacity style={styles.generateButton}>
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color={COLORS.white}
              />
              <Text style={styles.generateText}>Generate</Text>
            </TouchableOpacity>
          </View>

          {REPORTS.map((report) => (
            <Card key={report.id} style={styles.reportCard}>
              <Card.Content style={styles.reportContent}>
                <View
                  style={[
                    styles.reportIcon,
                    { backgroundColor: `${COLORS.primary}15` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={report.icon as any}
                    size={22}
                    color={COLORS.primary}
                  />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportMeta}>
                    {report.type} • {report.generated}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.downloadButton,
                    report.status === "processing" &&
                      styles.downloadButtonDisabled,
                  ]}
                  disabled={report.status === "processing"}
                >
                  <MaterialCommunityIcons
                    name={
                      report.status === "processing" ? "loading" : "download"
                    }
                    size={20}
                    color={
                      report.status === "processing"
                        ? COLORS.textLight
                        : COLORS.primary
                    }
                  />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
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
  timeFilters: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  timeChip: {
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  timeChipSelected: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    color: COLORS.textLight,
    fontSize: 13,
  },
  timeTextSelected: {
    color: COLORS.white,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  statContent: {
    alignItems: "center",
    paddingVertical: 14,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 2,
  },
  changeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chartCard: {
    borderRadius: 16,
    elevation: 2,
  },
  chartContent: {
    alignItems: "center",
    paddingVertical: 40,
  },
  chartPlaceholder: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  generateText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
  },
  reportCard: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 1,
  },
  reportContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  reportIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  reportMeta: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
});
