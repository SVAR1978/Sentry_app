import React, { useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Share2,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react-native";
import { SAFETY_TIPS, EXPLORE_COLORS as C } from "../../constants/exploreData";

const FEEDBACK_KEY = "@sentry:tip_feedback";

export default function TipDetailScreen() {
  const { t } = useTranslation('common');
  const { tipId } = useLocalSearchParams<{ tipId: string }>();
  const tip = SAFETY_TIPS.find((t) => t.id === tipId);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  React.useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const raw = await AsyncStorage.getItem(FEEDBACK_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data[tipId!]) setFeedback(data[tipId!]);
      }
    } catch {}
  };

  const saveFeedback = useCallback(
    async (value: "up" | "down") => {
      setFeedback(value);
      setFeedbackSaved(true);
      try {
        const raw = await AsyncStorage.getItem(FEEDBACK_KEY);
        const data = raw ? JSON.parse(raw) : {};
        data[tipId!] = value;
        await AsyncStorage.setItem(FEEDBACK_KEY, JSON.stringify(data));
      } catch {}
      setTimeout(() => setFeedbackSaved(false), 2000);
    },
    [tipId]
  );

  const handleShare = useCallback(async () => {
    if (!tip) return;
    try {
      await Share.share({
        title: tip.title.replace("\n", " "),
        message: `${tip.title.replace("\n", " ")}\n\n${tip.content.slice(0, 200)}...\n\n${t('sharedFromSentry')}`,
      });
    } catch {}
  }, [tip]);

  if (!tip) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('tipNotFound')}</Text>
      </View>
    );
  }

  // Related tips (other tips in same category)
  const relatedTips = SAFETY_TIPS.filter(
    (t) => t.id !== tipId && (t.category === tip.category || true)
  ).slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Header Gradient */}
        <LinearGradient
          colors={tip.gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backBtn}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.shareBtn}
              accessibilityLabel="Share this tip"
            >
              <Share2 size={20} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{tip.category}</Text>
            </View>
            <Text style={styles.heroTitle}>{tip.title.replace("\n", " ")}</Text>
            <View style={styles.readTimeBadge}>
              <BookOpen size={14} color="rgba(255,255,255,0.8)" strokeWidth={2.5} />
              <Text style={styles.readTimeText}>{tip.readTimeMin} {t('minRead')}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={styles.body}>
          {tip.content.split("\n").map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <View key={i} style={{ height: 10 }} />;
            if (trimmed.startsWith("## ")) {
              return (
                <Text key={i} style={styles.contentH2}>
                  {trimmed.replace("## ", "")}
                </Text>
              );
            }
            if (trimmed.startsWith("- **")) {
              const match = trimmed.match(/- \*\*(.+?)\*\* — (.+)/);
              if (match) {
                return (
                  <View key={i} style={styles.bulletRow}>
                    <View style={styles.bulletDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.bulletBold}>{match[1]}</Text>
                      <Text style={styles.bulletDesc}>{match[2]}</Text>
                    </View>
                  </View>
                );
              }
            }
            if (trimmed.startsWith("- ")) {
              return (
                <View key={i} style={styles.bulletRow}>
                  <View style={styles.bulletDot} />
                  <Text style={styles.bulletText}>{trimmed.replace("- ", "")}</Text>
                </View>
              );
            }
            if (trimmed.startsWith("> ")) {
              return (
                <View key={i} style={styles.callout}>
                  <Text style={styles.calloutText}>
                    {trimmed.replace("> ", "").replace(/\*\*/g, "")}
                  </Text>
                </View>
              );
            }
            // Regular line: strip ** for bold but just show plain
            return (
              <Text key={i} style={styles.contentText}>
                {trimmed.replace(/\*\*/g, "")}
              </Text>
            );
          })}
        </View>

        {/* Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={styles.feedbackTitle}>{t('wasThisHelpful')}</Text>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={[styles.feedbackBtn, feedback === "up" && styles.feedbackBtnActive]}
              onPress={() => saveFeedback("up")}
            >
              <ThumbsUp
                size={20}
                color={feedback === "up" ? C.white : C.primary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.feedbackBtnText,
                  feedback === "up" && styles.feedbackBtnTextActive,
                ]}
              >
                {t('yes')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.feedbackBtn, feedback === "down" && styles.feedbackBtnActiveDanger]}
              onPress={() => saveFeedback("down")}
            >
              <ThumbsDown
                size={20}
                color={feedback === "down" ? C.white : C.primary}
                strokeWidth={2.5}
              />
              <Text
                style={[
                  styles.feedbackBtnText,
                  feedback === "down" && styles.feedbackBtnTextActive,
                ]}
              >
                {t('no')}
              </Text>
            </TouchableOpacity>
          </View>
          {feedbackSaved && (
            <Text style={styles.feedbackThanks}>{t('thankYouFeedback')}</Text>
          )}
        </View>

        {/* Related Tips */}
        {relatedTips.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>{t('moreTips')}</Text>
            {relatedTips.map((related) => (
              <TouchableOpacity
                key={related.id}
                style={styles.relatedCard}
                onPress={() =>
                  router.replace({
                    pathname: "/tip-detail",
                    params: { tipId: related.id },
                  } as any)
                }
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={related.gradientColors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.relatedGradient}
                >
                  <Text style={styles.relatedCardCategory}>{related.category}</Text>
                  <Text style={styles.relatedCardTitle}>{related.title.replace("\n", " ")}</Text>
                  <Text style={styles.relatedCardRead}>{related.readTimeMin} {t('minRead')}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.white },
  errorText: { fontSize: 16, color: C.secondary, textAlign: "center", marginTop: 100 },

  // Header
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 44,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: { gap: 10 },
  categoryTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  categoryText: { fontSize: 12, fontWeight: "800", color: "#fff", letterSpacing: 0.5 },
  heroTitle: { fontSize: 26, fontWeight: "900", color: "#fff", letterSpacing: -0.5 },
  readTimeBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 },
  readTimeText: { fontSize: 13, fontWeight: "600", color: "rgba(255,255,255,0.8)" },

  // Body
  body: { paddingHorizontal: 20, paddingVertical: 24, gap: 6 },
  contentH2: {
    fontSize: 18,
    fontWeight: "800",
    color: C.primary,
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  contentText: {
    fontSize: 15,
    fontWeight: "500",
    color: C.textPrimary,
    lineHeight: 24,
  },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginVertical: 3 },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.primary,
    marginTop: 8,
  },
  bulletText: { fontSize: 15, fontWeight: "500", color: C.textPrimary, lineHeight: 24, flex: 1 },
  bulletBold: { fontSize: 15, fontWeight: "800", color: C.primary },
  bulletDesc: { fontSize: 14, fontWeight: "500", color: C.secondary, lineHeight: 22 },
  callout: {
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderLeftWidth: 4,
    borderLeftColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  calloutText: { fontSize: 14, fontWeight: "600", color: C.primary, lineHeight: 22, fontStyle: "italic" },

  // Feedback
  feedbackSection: { alignItems: "center", paddingVertical: 30, gap: 14 },
  feedbackTitle: { fontSize: 18, fontWeight: "800", color: C.primary },
  feedbackButtons: { flexDirection: "row", gap: 14 },
  feedbackBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.1)",
    backgroundColor: C.white,
  },
  feedbackBtnActive: { backgroundColor: C.success, borderColor: C.success },
  feedbackBtnActiveDanger: { backgroundColor: C.danger, borderColor: C.danger },
  feedbackBtnText: { fontSize: 14, fontWeight: "700", color: C.primary },
  feedbackBtnTextActive: { color: C.white },
  feedbackThanks: { fontSize: 13, fontWeight: "600", color: C.success },

  // Related
  relatedSection: { paddingHorizontal: 20, gap: 12 },
  relatedTitle: { fontSize: 20, fontWeight: "900", color: C.primary, letterSpacing: -0.5 },
  relatedCard: { borderRadius: 18, overflow: "hidden" },
  relatedGradient: { padding: 18, gap: 6 },
  relatedCardCategory: { fontSize: 10, fontWeight: "800", color: "rgba(255,255,255,0.7)" },
  relatedCardTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },
  relatedCardRead: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
});
