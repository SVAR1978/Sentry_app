import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  LayoutAnimation,
  Platform,
  UIManager,
  Animated,
  FlatList,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChevronLeft,
  Search,
  X,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Shield,
  Smartphone,
  User,
} from "lucide-react-native";
import { FAQ, FAQCategory, FAQ_DATA, CATEGORY_LABELS } from "../../constants/faqData";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  white: "#FFFFFF",
  background: "#F2F2F2",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  success: "#10B981",
  accent: "#D4AF37",
  cardBorder: "rgba(33, 16, 11, 0.05)",
};

const CATEGORIES: Array<FAQCategory | "all"> = [
  "all",
  "account",
  "bookings",
  "safety",
  "app_issues",
];

const CATEGORY_ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  all: Sparkles,
  account: User,
  bookings: BookOpen,
  safety: Shield,
  app_issues: Smartphone,
};

export default function HelpCenterScreen() {
  const { t } = useTranslation('common');
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounced search (300ms)
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedQuery(text.trim().toLowerCase());
    }, 300);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setDebouncedQuery("");
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
  }, []);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    let results = FAQ_DATA;

    if (activeCategory !== "all") {
      results = results.filter((faq) => faq.category === activeCategory);
    }

    if (debouncedQuery) {
      results = results.filter(
        (faq) =>
          faq.question.toLowerCase().includes(debouncedQuery) ||
          faq.answer.toLowerCase().includes(debouncedQuery)
      );
    }

    return results;
  }, [activeCategory, debouncedQuery]);

  const handleToggle = useCallback((id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleCategoryChange = useCallback((cat: FAQCategory | "all") => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveCategory(cat);
    setExpandedId(null);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.navigate("/profile")}
            style={styles.backButton}
            accessibilityLabel="Go back to profile"
            accessibilityRole="button"
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('helpCenter')}</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={COLORS.secondary} strokeWidth={2.5} />
          <RNTextInput
            style={styles.searchInput}
            placeholder={t('searchHelpArticles')}
            placeholderTextColor={COLORS.secondary}
            value={searchQuery}
            onChangeText={handleSearchChange}
            accessibilityLabel="Search help articles"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={18} color={COLORS.secondary} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Category Tabs */}
      <View style={styles.categorySection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            const CatIcon = CATEGORY_ICON_MAP[cat];
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => handleCategoryChange(cat)}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <CatIcon
                  size={14}
                  color={isActive ? COLORS.white : COLORS.secondary}
                  strokeWidth={2.5}
                />
                <Text
                  style={[
                    styles.categoryPillText,
                    isActive && styles.categoryPillTextActive,
                  ]}
                >
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* FAQ List */}
      <FlatList
        data={filteredFaqs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.faqList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <HelpCircle size={48} color={COLORS.secondary} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>{t('noResults')}</Text>
            <Text style={styles.emptySubtitle}>
              {debouncedQuery
                ? t('noArticlesMatch')
                : t('noFaqsYet')}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <FAQItem
            faq={item}
            isExpanded={expandedId === item.id}
            onToggle={() => handleToggle(item.id)}
          />
        )}
        ListFooterComponent={
          filteredFaqs.length > 0 ? (
            <View style={styles.footerSection}>
              <View style={styles.footerDivider} />
              <Text style={styles.footerTitle}>{t('stillNeedHelp')}</Text>
              <Text style={styles.footerSubtitle}>
                {t('supportTeamResponds')}
              </Text>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => router.push("/contact-support" as any)}
                activeOpacity={0.85}
              >
                <MessageCircle size={18} color={COLORS.white} strokeWidth={2.5} />
                <Text style={styles.contactButtonText}>{t('contactSupport')}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
}

// ============================================================
// FAQ Accordion Item
// ============================================================
interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ faq, isExpanded, onToggle }) => {
  const rotateAnim = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;
  const [helpfulness, setHelpfulness] = useState<"up" | "down" | null>(null);

  React.useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handleHelpful = async (type: "up" | "down") => {
    setHelpfulness(type);
    try {
      const key = `faq_helpful_${faq.id}`;
      await AsyncStorage.setItem(key, type);
    } catch {
      // silent fail for local state
    }
  };

  // Load saved helpfulness
  React.useEffect(() => {
    const loadHelpfulness = async () => {
      try {
        const saved = await AsyncStorage.getItem(`faq_helpful_${faq.id}`);
        if (saved === "up" || saved === "down") {
          setHelpfulness(saved);
        }
      } catch {
        // silent
      }
    };
    loadHelpfulness();
  }, [faq.id]);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity
        style={styles.faqQuestion}
        onPress={onToggle}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        accessibilityLabel={faq.question}
      >
        <View style={styles.faqQuestionLeft}>
          {faq.isPopular && (
            <View style={styles.popularBadge}>
              <Sparkles size={10} color={COLORS.accent} strokeWidth={2.5} />
              <Text style={styles.popularText}>{t('popular')}</Text>
            </View>
          )}
          <Text style={styles.faqQuestionText}>{faq.question}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <ChevronDown size={20} color={COLORS.secondary} strokeWidth={2.5} />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswerText}>{faq.answer}</Text>

          {/* Helpfulness Feedback */}
          <View style={styles.helpfulRow}>
            <Text style={styles.helpfulLabel}>{t('wasThisHelpful')}</Text>
            <View style={styles.helpfulButtons}>
              <TouchableOpacity
                onPress={() => handleHelpful("up")}
                style={[
                  styles.helpfulBtn,
                  helpfulness === "up" && styles.helpfulBtnActive,
                ]}
                accessibilityLabel="Yes, this was helpful"
              >
                <ThumbsUp
                  size={14}
                  color={helpfulness === "up" ? COLORS.success : COLORS.secondary}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleHelpful("down")}
                style={[
                  styles.helpfulBtn,
                  helpfulness === "down" && styles.helpfulBtnActiveDown,
                ]}
                accessibilityLabel="No, this was not helpful"
              >
                <ThumbsDown
                  size={14}
                  color={helpfulness === "down" ? "#FF6B6B" : COLORS.secondary}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "600",
  },

  // Category Tabs
  categorySection: {
    paddingVertical: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  categoryPillTextActive: {
    color: COLORS.white,
  },

  // FAQ List
  faqList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  faqItem: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  faqQuestionLeft: {
    flex: 1,
    gap: 6,
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: "rgba(212, 175, 55, 0.1)",
  },
  popularText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.accent,
    letterSpacing: 0.3,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textPrimary,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  faqAnswerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    fontWeight: "500",
  },
  helpfulRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 16, 11, 0.04)",
  },
  helpfulLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  helpfulButtons: {
    flexDirection: "row",
    gap: 8,
  },
  helpfulBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  helpfulBtnActive: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
  },
  helpfulBtnActiveDown: {
    backgroundColor: "rgba(255, 107, 107, 0.1)",
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },

  // Footer / Contact Support
  footerSection: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 20,
    gap: 12,
  },
  footerDivider: {
    width: 60,
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(33, 16, 11, 0.06)",
    marginBottom: 8,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  footerSubtitle: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  contactButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
