import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  AppState,
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
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "../../constants/userHomeData";
import {
  BookingPartner,
  fetchBookingPartners,
  fetchRecentlyVisited,
  recordPartnerVisit,
} from "../../services/api/bookingService";

// ============================================================
// Category Icon Mapping & Brand Colors
// ============================================================
const CATEGORY_ICONS: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth: number }>> = {
  flights: Plane,
  hotels: Hotel,
  buses: Bus,
  trains: Train,
};

// Attractive brand-inspired colors for fallback initials
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  "MakeMyTrip": { bg: "#0057B8", text: "#FFFFFF" },
  "Goibibo":    { bg: "#EC5B24", text: "#FFFFFF" },
  "OYO Rooms":  { bg: "#EE2E24", text: "#FFFFFF" },
  "Yatra":      { bg: "#E42121", text: "#FFFFFF" },
  "RedBus":     { bg: "#D84233", text: "#FFFFFF" },
  "IRCTC":      { bg: "#1A5276", text: "#FFFFFF" },
  "Ola":        { bg: "#1C8C3C", text: "#FFFFFF" },
  "Uber":       { bg: "#000000", text: "#FFFFFF" },
};

const DEFAULT_BRAND_COLORS = [
  { bg: "#4A4341", text: "#FFFFFF" },
  { bg: "#8C7D79", text: "#FFFFFF" },
  { bg: "#21100B", text: "#FFFFFF" },
  { bg: "#5C4033", text: "#FFFFFF" },
];

function getBrandColor(name: string) {
  if (BRAND_COLORS[name]) return BRAND_COLORS[name];
  // Deterministic color from name hash
  const idx = name.charCodeAt(0) % DEFAULT_BRAND_COLORS.length;
  return DEFAULT_BRAND_COLORS[idx];
}

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
          <Text style={styles.sectionSubtitle}>Trusted travel partners</Text>
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

      {/* Recently Visited Section */}
      {recentPartners.length > 0 && (
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Clock size={13} color={COLORS.secondary} strokeWidth={2.5} />
            <Text style={styles.recentTitle}>Recently Visited</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recentList}
          >
            {recentPartners.map((partner) => (
              <RecentPartnerChip
                key={partner.id}
                partner={partner}
                onPress={() => handlePartnerPress(partner)}
              />
            ))}
          </ScrollView>
        </View>
      )}
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
// Partner Card Component (Modern Tile with Image Error Handling)
// ============================================================
interface PartnerCardProps {
  partner: BookingPartner;
  onPress: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const CategoryIcon = getCategoryIcon(partner.category);
  const brandColor = getBrandColor(partner.name);

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

  const showLogo = partner.logoUrl && !imageError;
  const initial = partner.name.charAt(0).toUpperCase();

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
        <View style={[
          styles.logoContainer,
          !showLogo && { backgroundColor: brandColor.bg, borderColor: brandColor.bg },
        ]}>
          {showLogo ? (
            <>
              <Image 
                source={{ uri: partner.logoUrl! }} 
                style={styles.logoImage} 
                resizeMode="cover"
                onError={() => {
                  console.log(`[BookingPartners] Logo failed for ${partner.name}: ${partner.logoUrl}`);
                  setImageError(true);
                }}
                onLoadEnd={() => setImageLoading(false)}
              />
              {imageLoading && (
                <View style={styles.logoPlaceholder}>
                  <Text style={[styles.initialText, { color: brandColor.text, backgroundColor: brandColor.bg }]}>
                    {initial}
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.fallbackContainer}>
              <Text style={[styles.initialText, { color: brandColor.text }]}>
                {initial}
              </Text>
              <View style={styles.categoryBadge}>
                <CategoryIcon size={12} color={brandColor.text} strokeWidth={2.5} />
              </View>
            </View>
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

  // Recently Visited
  recentSection: {
    marginTop: 20,
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
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    // Overflow hidden on container will naturally clip the image exactly.
  },
  logoPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  initialText: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -1,
  },
  categoryBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    opacity: 0.5,
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
