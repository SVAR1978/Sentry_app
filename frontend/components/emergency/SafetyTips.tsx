import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";

interface SafetyTipsProps {
  tips: string[];
  colors: {
    text: string;
    secondary: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
  };
}

export const SafetyTips: React.FC<SafetyTipsProps> = ({ tips, colors }) => {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Safety Tips</Text>
      <View style={[styles.tipsCard, { backgroundColor: colors.surfaceContainer }]}>
        {tips.map((tip, index) => (
          <View
            key={index}
            style={[
              styles.tipItem,
              index === tips.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <View style={[styles.tipCheckmark, { backgroundColor: "rgba(33, 16, 11, 0.04)" }]}>
              <Check size={14} color={colors.secondary} strokeWidth={3} />
            </View>
            <Text style={[styles.tipText, { color: colors.text }]}>{tip}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  tipsCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(33, 16, 11, 0.05)",
    gap: 12,
  },
  tipCheckmark: {
    width: 28,
    height: 28,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  tipText: {
    fontSize: 14,
    flex: 1,
    fontWeight: "600",
    lineHeight: 20,
  },
});
