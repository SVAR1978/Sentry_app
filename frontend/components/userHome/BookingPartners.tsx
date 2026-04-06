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
  ScrollView,
  Image,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import {
  Plane,
  Hotel,
  Bus,
  Train,
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

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Book Travel</Text>
        </View>
      </View>

      {/* Partner Grid/Scroll */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardsContainer}
      >
        {partners.map((partner) => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            onPress={() => handlePartnerPress(partner)}
          />
        ))}
      </ScrollView>
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
// Partner Card Component (Modern Tile)
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
      toValue: 0.92,
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
      <Animated.View style={[styles.tileCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          {partner.logoUrl ? (
            <Image 
              source={{ uri: partner.logoUrl }} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          ) : (
            <CategoryIcon size={24} color={COLORS.primary} strokeWidth={2} />
          )}
        </View>
        <Text style={styles.tileName} numberOfLines={1}>
          {partner.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  section: {
    paddingVertical: 12,
    marginBottom: 32,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  // Disclaimer
  disclaimerBanner: {
    marginBottom: 20,
  },
  disclaimerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.secondary,
    fontWeight: "600",
  },

  // Recently Visited
  recentSection: {
    marginBottom: 24,
  },
  recentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: -0.2,
  },
  recentList: {
    gap: 8,
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
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

  // Partner Grid/Tiles
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  cardWrapper: {
    width: 90,
  },
  tileCard: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.06)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
    padding: 12,
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  tileName: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    textAlign: "center",
    paddingHorizontal: 2,
  },
});

export default BookingPartners;
