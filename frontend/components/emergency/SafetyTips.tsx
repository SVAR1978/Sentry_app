import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { BookOpen } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { SAFETY_TIPS, SafetyTip } from "../../constants/exploreData";
import { useTranslation } from "react-i18next";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TIP_CARD_WIDTH = SCREEN_WIDTH * 0.7;

interface SafetyTipsProps {
  colors: {
    text: string;
    secondary: string;
    surfaceContainer: string;
    surfaceContainerHigh: string;
  };
}

export const SafetyTips: React.FC<SafetyTipsProps> = ({ colors }) => {
  const router = useRouter();
  const { t } = useTranslation('emergency');

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>📰 {t('safetyTips')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TIP_CARD_WIDTH + 14}
        decelerationRate="fast"
      >
        {SAFETY_TIPS.map((tip) => (
          <TouchableOpacity
            key={tip.id}
            style={[styles.tipCard, { width: TIP_CARD_WIDTH }]}
            onPress={() =>
              router.push({
                pathname: "/tip-detail",
                params: { tipId: tip.id },
              } as any)
            }
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={tip.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tipGradient}
            >
              <View style={styles.tipCategoryBadge}>
                <Text style={styles.tipCategoryText}>{tip.category}</Text>
              </View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipPreview} numberOfLines={2}>
                {tip.preview}
              </Text>
              <View style={styles.tipBottom}>
                <View style={styles.tipReadTime}>
                  <BookOpen size={12} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
                  <Text style={styles.tipReadTimeText}>{tip.readTimeMin} min</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingLeft: 20, // Only pad left so cards scroll off screen nicely on the right
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  tipCard: { marginRight: 14 },
  tipGradient: {
    borderRadius: 22,
    padding: 20,
    height: 200,
    justifyContent: "space-between",
  },
  tipCategoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  tipCategoryText: { fontSize: 10, fontWeight: "800", color: "#FFF", letterSpacing: 0.5 },
  tipTitle: { fontSize: 18, fontWeight: "900", color: "#FFF", letterSpacing: -0.3 },
  tipPreview: { fontSize: 13, fontWeight: "500", color: "rgba(255,255,255,0.85)", lineHeight: 18 },
  tipBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  tipReadTime: { flexDirection: "row", alignItems: "center", gap: 4 },
  tipReadTimeText: { fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.8)" },
});
