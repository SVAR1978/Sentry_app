import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  AppState,
  Dimensions,
  FlatList,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import {
  ShieldCheck,
  ExternalLink,
  Plane,
  Hotel,
  Bus,
  Train,
  ChevronRight,
  Clock,
  Info,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/userHomeData";
import {
  BookingPartner,
  fetchBookingPartners,
  fetchRecentlyVisited,
  recordPartnerVisit,
} from "../../services/api/bookingService";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ============================================================
// Category Icon Mapping
// ============================================================
const CATEGORY_ICONS: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  flights: Plane,
  hotels: Hotel,
  buses: Bus,
  trains: Train,
};

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category.toLowerCase()] || Plane;
}

// ============================================================
// Main Component
// ============================================================
const BookingPartners: React.FC = () => {
  const [partners, setPartners] = useState<BookingPartner[]>([]);
  const [recentPartners, setRecentPartners] = useState<BookingPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePartner, setActivePartner] = useState<string | null>(null);
  const visitStartTime = useRef<number>(0);
  const appState = useRef(AppState.currentState);

  // Fetch partners from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [allPartners, recent] = await Promise.all([
          fetchBookingPartners(),
          fetchRecentlyVisited(),
        ]);
        setPartners(allPartners);
        setRecentPartners(recent);
      } catch (error) {
        console.error("[BookingPartners] Load failed:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Track when user returns from external browser
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/background/) &&
        nextAppState === "active" &&
        activePartner
      ) {
        const durationMs = Date.now() - visitStartTime.current;
        recordPartnerVisit(activePartner, durationMs);

        // Refresh recently visited
        fetchRecentlyVisited().then(setRecentPartners);
        setActivePartner(null);
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, [activePartner]);

  // Open partner URL in external browser
  const handlePartnerPress = useCallback(
    async (partner: BookingPartner) => {
      // Security: Only open HTTPS URLs
      if (!partner.url.startsWith("https://")) {
        Alert.alert("Security Warning", "This URL is not secure.");
        return;
      }

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Track start time for duration calculation
      visitStartTime.current = Date.now();
      setActivePartner(partner.id);

      try {
        await Linking.openURL(partner.url);
      } catch (error) {
        console.error("[BookingPartners] Failed to open URL:", error);
        Alert.alert("Error", "Could not open the partner website.");
        setActivePartner(null);
      }
    },
    []
  );

  if (loading) {
    return (
      <View style={styles.section}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text
            style={styles.loadingText}
            accessibilityLiveRegion="polite"
          >
            Loading travel partners...
          </Text>
        </View>
      </View>
    );
  }

  if (partners.length === 0) return null;

  return (
    <View style={styles.section}>
      {/* Disclaimer Banner */}
      <View style={styles.disclaimerBanner}>
        <Info size={14} color={COLORS.secondary} strokeWidth={2.5} />
        <Text style={styles.disclaimerText}>
          Bookings are handled by third-party platforms. Our app does not store
          your payment information.
        </Text>
      </View>

      {/* Recently Visited Strip */}
      {recentPartners.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Clock size={14} color={COLORS.secondary} strokeWidth={2.5} />
            <Text style={styles.recentTitle}>Recently Visited</Text>
          </View>
          <FlatList
            data={recentPartners}
            keyExtractor={(item) => `recent-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
            renderItem={({ item }) => (
              <RecentPartnerChip
                partner={item}
                onPress={() => handlePartnerPress(item)}
              />
            )}
          />
        </View>
      )}

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Book Travel</Text>
          <Text style={styles.sectionSubtitle}>Verified partner platforms</Text>
        </View>
      </View>

      {/* Partner Cards */}
      <View style={styles.cardsContainer}>
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            onPress={() => handlePartnerPress(partner)}
          />
        ))}
      </View>
    </View>
  );
};

// ============================================================
// Recently Visited Chip
// ============================================================
interface RecentChipProps {
  partner: BookingPartner;
  onPress: () => void;
}

const RecentPartnerChip: React.FC<RecentChipProps> = ({ partner, onPress }) => {
  const CategoryIcon = getCategoryIcon(partner.category);

  return (
    <TouchableOpacity
      style={styles.recentChip}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityLabel={`Recently visited ${partner.name}`}
      accessibilityRole="button"
    >
      <CategoryIcon size={14} color={COLORS.primary} strokeWidth={2.5} />
      <Text style={styles.recentChipText} numberOfLines={1}>
        {partner.name}
      </Text>
    </TouchableOpacity>
  );
};

// ============================================================
// Partner Card Component
// ============================================================
interface PartnerCardProps {
  partner: BookingPartner;
  onPress: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const CategoryIcon = getCategoryIcon(partner.category);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cardWrapper}
      accessibilityLabel={`Book with ${partner.name}${partner.isVerified ? ", verified partner" : ""}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Top Row: Icon + Info */}
        <View style={styles.cardTop}>
          <View
            style={[
              styles.categoryIconContainer,
              {
                backgroundColor:
                  partner.category === "flights"
                    ? "rgba(33, 16, 11, 0.06)"
                    : partner.category === "hotels"
                    ? "rgba(16, 185, 129, 0.08)"
                    : partner.category === "trains"
                    ? "rgba(59, 130, 246, 0.08)"
                    : "rgba(140, 125, 121, 0.08)",
              },
            ]}
          >
            <CategoryIcon
              size={22}
              color={
                partner.category === "flights"
                  ? COLORS.primary
                  : partner.category === "hotels"
                  ? "#10B981"
                  : partner.category === "trains"
                  ? "#3B82F6"
                  : COLORS.secondary
              }
              strokeWidth={2.5}
            />
          </View>

          <View style={styles.cardInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.cardName} numberOfLines={1}>
                {partner.name}
              </Text>
              {partner.isVerified && (
                <ShieldCheck
                  size={16}
                  color="#10B981"
                  strokeWidth={2.5}
                />
              )}
            </View>
            <Text style={styles.cardDescription} numberOfLines={1}>
              {partner.description}
            </Text>
          </View>

          <View style={styles.openButton}>
            <ExternalLink size={16} color={COLORS.primary} strokeWidth={2.5} />
          </View>
        </View>

        {/* Category Tag */}
        <View style={styles.cardBottom}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>
              {partner.category.charAt(0).toUpperCase() +
                partner.category.slice(1)}
            </Text>
          </View>
          {partner.isVerified && (
            <Text style={styles.verifiedText}>Verified Partner</Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  // Disclaimer
  disclaimerBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    marginBottom: 20,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.secondary,
    fontWeight: "600",
  },

  // Recently Visited
  recentSection: {
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: -0.2,
  },
  recentList: {
    gap: 8,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  recentChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
    maxWidth: 100,
  },

  // Section Header
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },

  // Cards
  cardsContainer: {
    gap: 12,
  },
  cardWrapper: {
    width: "100%",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  openButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 16, 11, 0.04)",
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderRadius: 20,
  },
  categoryTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: 0.3,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: -0.2,
  },
});

export default BookingPartners;
