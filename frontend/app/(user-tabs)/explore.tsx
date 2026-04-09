import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput as RNTextInput,
  Dimensions,
  Platform,
  UIManager,
  Animated,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useTabVisibility } from "../../store/TabVisibilityContext";
import * as Location from "expo-location";
import {
  Search,
  X,
  MapPin,
  Star,
  ChevronRight,
  Shield,
  ShieldCheck,
  Zap,
  Landmark,
  Church,
  UtensilsCrossed,
  TreePine,
  ShoppingBag,
  LayoutGrid,
  Map,
  Maximize2,
  Navigation,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Clock,
  Compass,
  Building2,
} from "lucide-react-native";
import {
  searchNearbyPlaces,
  type SearchResult,
} from "../../services/maps/placesService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRENDING_CARD_WIDTH = 165;

// ── Color System ──────────────────────────────────────────
const C = {
  primary: "#1D9E75",
  primaryDark: "#167A5B",
  primaryLight: "#E8F8F2",
  background: "#F7F8FA",
  surface: "#FFFFFF",
  textPrimary: "#1A1D26",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "rgba(0,0,0,0.06)",
  cardBorder: "rgba(0,0,0,0.05)",
  shadow: "#0F172A",
  white: "#FFFFFF",
  // Safety
  safeBg: "#E1F5EE",
  safeText: "#0F6E56",
  busyBg: "#FAEEDA",
  busyText: "#854F0B",
  dangerBg: "#FEE2E2",
  dangerText: "#991B1B",
};

// ── Category Chips ──────────────────────────────────────────
type CategoryKey = "all" | "monument" | "food" | "park" | "shopping" | "religious";

interface CategoryChip {
  key: CategoryKey;
  label: string;
  icon: React.ReactNode;
  osmTypes: string[];
}

const CATEGORIES: CategoryChip[] = [
  { key: "all", label: "All", icon: <LayoutGrid size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["tourism", "attraction", "restaurant", "hotel"] },
  { key: "monument", label: "Monuments", icon: <Landmark size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["tourism", "attraction"] },
  { key: "food", label: "Food", icon: <UtensilsCrossed size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["restaurant"] },
  { key: "park", label: "Parks", icon: <TreePine size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["tourism"] },
  { key: "shopping", label: "Shopping", icon: <ShoppingBag size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["tourism"] },
  { key: "religious", label: "Religious", icon: <Church size={14} color={C.textSecondary} strokeWidth={2} />, osmTypes: ["tourism", "attraction"] },
];

// ── Place Type Configs ──────────────────────────────────────
const PLACE_TYPE_CONFIG: Record<string, { bg: string; label: string }> = {
  tourism: { bg: "#EDE9FE", label: "Monument" },
  attraction: { bg: "#EDE9FE", label: "Attraction" },
  monument: { bg: "#FEF3C7", label: "Monument" },
  museum: { bg: "#DBEAFE", label: "Museum" },
  restaurant: { bg: "#FEE2E2", label: "Food" },
  cafe: { bg: "#FEE2E2", label: "Cafe" },
  fast_food: { bg: "#FEE2E2", label: "Fast Food" },
  hotel: { bg: "#E0F2FE", label: "Hotel" },
  guest_house: { bg: "#E0F2FE", label: "Stay" },
  park: { bg: "#D1FAE5", label: "Park" },
  place: { bg: "#F3F4F6", label: "Place" },
};

// ── Helper: Icon for place type ──────────────────────────────
const getPlaceIcon = (type: string, category: string, size: number = 20, color: string = C.primary) => {
  const t = (type + category).toLowerCase();
  if (t.includes("restaurant") || t.includes("food") || t.includes("cafe") || t.includes("fast_food"))
    return <UtensilsCrossed size={size} color={color} strokeWidth={2} />;
  if (t.includes("hotel") || t.includes("guest"))
    return <Building2 size={size} color={color} strokeWidth={2} />;
  if (t.includes("museum") || t.includes("monument") || t.includes("historic"))
    return <Landmark size={size} color={color} strokeWidth={2} />;
  if (t.includes("park") || t.includes("garden"))
    return <TreePine size={size} color={color} strokeWidth={2} />;
  if (t.includes("temple") || t.includes("mosque") || t.includes("church") || t.includes("gurudwara"))
    return <Church size={size} color={color} strokeWidth={2} />;
  if (t.includes("shop") || t.includes("market") || t.includes("mall"))
    return <ShoppingBag size={size} color={color} strokeWidth={2} />;
  return <MapPin size={size} color={color} strokeWidth={2} />;
};

// ── Helper: Safety Badge logic ──────────────────────────────
const getSafetyBadge = (type: string, category: string): { label: string; bg: string; color: string; icon: React.ReactNode } => {
  const t = (type + category).toLowerCase();
  // "Busy" categories: food, market, popular tourist spots
  const busyTypes = ["restaurant", "cafe", "fast_food", "market", "mall", "shop", "attraction"];
  const isBusyType = busyTypes.some(bt => t.includes(bt));

  if (isBusyType) {
    return {
      label: "Busy",
      bg: C.busyBg,
      color: C.busyText,
      icon: <Zap size={12} color={C.busyText} strokeWidth={2.5} />,
    };
  }
  return {
    label: "Safe",
    bg: C.safeBg,
    color: C.safeText,
    icon: <ShieldCheck size={12} color={C.safeText} strokeWidth={2.5} />,
  };
};

// ── Helper: Distance formatting ──────────────────────────────
const formatDist = (meters: number): string => {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)} km`;
};

// ── Horizontal card background colors based on type ─────────
const CARD_BG_COLORS = ["#E8F8F2", "#EDE9FE", "#FEF3C7", "#DBEAFE", "#FEE2E2", "#E0F2FE", "#D1FAE5", "#F3E8FF"];

// ── Place + distance type ───────────────────────────────
interface PlaceWithDist extends SearchResult {
  distanceValue: number;
}

// ============================================================
// Main Explore Screen
// ============================================================
export default function ExploreScreen() {
  // ── State ──
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [places, setPlaces] = useState<PlaceWithDist[]>([]);
  const [trendingPlaces, setTrendingPlaces] = useState<PlaceWithDist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { setTabBarVisible } = useTabVisibility();
  const lastScrollY = useRef(0);
  const headerOpacity = useRef(new Animated.Value(0)).current;

  // ── Mount: get location & fetch places ──
  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    getUserLocation();
  }, []);

  // ── Re-fetch when location or category changes ──
  useEffect(() => {
    if (userLocation) {
      fetchPlaces();
    }
  }, [userLocation, selectedCategory]);

  // ── Get user GPS ──
  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Location permission denied. Please enable it to see nearby places.");
        setIsLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch {
      // Fallback to Delhi center
      setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
    }
  };

  // ── API: Fetch nearby places ──
  const fetchPlaces = async () => {
    if (!userLocation) return;
    setIsLoading(true);
    setError(null);
    try {
      const cat = CATEGORIES.find(c => c.key === selectedCategory) || CATEGORIES[0];
      const results = await searchNearbyPlaces(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        3000,
        cat.osmTypes
      );

      // Compute distance
      const withDist: PlaceWithDist[] = results.map((p) => {
        const dx = (p.coordinate.latitude - userLocation.latitude) * 111000;
        const dy = (p.coordinate.longitude - userLocation.longitude) * 111000 * Math.cos((userLocation.latitude * Math.PI) / 180);
        return { ...p, distanceValue: Math.sqrt(dx * dx + dy * dy) };
      });

      withDist.sort((a, b) => a.distanceValue - b.distanceValue);

      // Split: first 6 for trending, rest for all places
      setTrendingPlaces(withDist.slice(0, 6));
      setPlaces(withDist);
    } catch (err) {
      console.warn("[Explore] Failed to fetch places:", err);
      setError("Unable to load places. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Pull-to-refresh ──
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUserLocation();
    setRefreshing(false);
  }, []);

  // ── Search filter (local, debounced) ──
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return places;
    const q = searchQuery.toLowerCase();
    return places.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.displayName.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [searchQuery, places]);

  const filteredTrending = useMemo(() => {
    if (!searchQuery.trim()) return trendingPlaces;
    const q = searchQuery.toLowerCase();
    return trendingPlaces.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }, [searchQuery, trendingPlaces]);

  // ── Category select ──
  const handleCategorySelect = useCallback((key: CategoryKey) => {
    setSelectedCategory(key);
    setSearchQuery("");
  }, []);

  // ── Get place type config ──
  const getTypeConfig = (type: string, category: string) => {
    const t = (type + category).toLowerCase();
    for (const [key, val] of Object.entries(PLACE_TYPE_CONFIG)) {
      if (t.includes(key)) return val;
    }
    return PLACE_TYPE_CONFIG.place;
  };

  // ── Retry handler ──
  const handleRetry = useCallback(() => {
    setError(null);
    getUserLocation();
  }, []);

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary} colors={[C.primary]} />
        }
        onScroll={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          if (y <= 0) { setTabBarVisible(true); return; }
          if (y > lastScrollY.current + 10) setTabBarVisible(false);
          else if (y < lastScrollY.current - 10) setTabBarVisible(true);
          lastScrollY.current = y;
        }}
      >
        {/* ── HEADER ── */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View>
            <Text style={styles.headerTitle}>Explore Delhi</Text>
            <View style={styles.headerSubRow}>
              <MapPin size={13} color={C.textSecondary} strokeWidth={2} />
              <Text style={styles.headerSub}>New Delhi, India</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── SEARCH BAR ── */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={C.textTertiary} strokeWidth={2} />
            <RNTextInput
              style={styles.searchInput}
              placeholder="Search places, monuments..."
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <X size={16} color={C.textTertiary} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
            <SlidersHorizontal size={18} color={C.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ── CATEGORY CHIPS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
          style={styles.chipContainer}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleCategorySelect(cat.key)}
                activeOpacity={0.7}
              >
                {React.cloneElement(cat.icon as React.ReactElement, {
                  color: isActive ? C.white : C.textSecondary,
                })}
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── MAP PREVIEW CARD ── */}
        <TouchableOpacity
          style={styles.mapCard}
          activeOpacity={0.9}
          onPress={() => router.push("/(user-tabs)/map" as any)}
        >
          <View style={styles.mapCardInner}>
            <View style={styles.mapPlaceholder}>
              <Map size={36} color={C.primary} strokeWidth={1.5} />
              <Text style={styles.mapPlaceholderText}>Tap to open interactive map</Text>
            </View>
            <View style={styles.mapCardOverlay}>
              <View style={styles.mapCardLabel}>
                <Compass size={14} color={C.primary} strokeWidth={2} />
                <Text style={styles.mapCardLabelText}>Live Map View</Text>
              </View>
              <TouchableOpacity
                style={styles.mapExpandBtn}
                onPress={() => router.push("/(user-tabs)/map" as any)}
              >
                <Text style={styles.mapExpandText}>Expand</Text>
                <Maximize2 size={13} color={C.primary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        {/* ── ERROR STATE ── */}
        {error && (
          <View style={styles.errorCard}>
            <AlertCircle size={22} color="#DC2626" strokeWidth={2} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
              <RefreshCw size={14} color={C.white} strokeWidth={2.5} />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── LOADING STATE ── */}
        {isLoading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.loadingText}>Finding places near you...</Text>
          </View>
        )}

        {/* ── TRENDING NEARBY ── */}
        {!isLoading && !error && filteredTrending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>TRENDING NEARBY</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
              decelerationRate="fast"
              snapToInterval={TRENDING_CARD_WIDTH + 12}
            >
              {filteredTrending.map((place, idx) => {
                const badge = getSafetyBadge(place.type, place.category);
                const bgColor = CARD_BG_COLORS[idx % CARD_BG_COLORS.length];
                return (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.trendingCard}
                    activeOpacity={0.85}
                    onPress={() => router.push({ pathname: "/(user-tabs)/map", params: { filter: place.type } } as any)}
                  >
                    {/* Top colored area */}
                    <View style={[styles.trendingCardTop, { backgroundColor: bgColor }]}>
                      {getPlaceIcon(place.type, place.category, 28, C.primary)}
                      {/* Safety badge */}
                      <View style={[styles.trendingBadge, { backgroundColor: badge.bg }]}>
                        {badge.icon}
                        <Text style={[styles.trendingBadgeText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>
                    {/* Bottom info */}
                    <View style={styles.trendingCardBottom}>
                      <Text style={styles.trendingName} numberOfLines={1}>{place.name}</Text>
                      <View style={styles.trendingMeta}>
                        <View style={styles.trendingMetaRow}>
                          <Star size={11} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                          <Text style={styles.trendingRating}>4.5</Text>
                        </View>
                        <View style={styles.trendingMetaRow}>
                          <Navigation size={10} color={C.textTertiary} strokeWidth={2} />
                          <Text style={styles.trendingDist}>{formatDist(place.distanceValue)}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* ── ALL PLACES LIST ── */}
        {!isLoading && !error && (
          <View style={styles.section}>
            <View style={styles.allPlacesHeader}>
              <Text style={styles.sectionLabel}>ALL PLACES</Text>
              <Text style={styles.placesCount}>{filteredPlaces.length} found</Text>
            </View>

            {filteredPlaces.length === 0 && (
              <View style={styles.emptyState}>
                <Search size={36} color={C.textTertiary} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>
                  {searchQuery ? `No results for "${searchQuery}"` : "No places found nearby"}
                </Text>
                <Text style={styles.emptySub}>Try a different category or pull to refresh</Text>
              </View>
            )}

            {filteredPlaces.map((place) => {
              const badge = getSafetyBadge(place.type, place.category);
              const typeConf = getTypeConfig(place.type, place.category);
              // Determine open/closed (simple heuristic: always "Open" during 8am-10pm)
              const hour = new Date().getHours();
              const isOpen = hour >= 8 && hour <= 22;

              return (
                <TouchableOpacity
                  key={place.id}
                  style={styles.placeRow}
                  activeOpacity={0.75}
                  onPress={() => router.push({ pathname: "/(user-tabs)/map", params: { filter: place.type } } as any)}
                >
                  {/* Left: Icon box */}
                  <View style={[styles.placeIconBox, { backgroundColor: typeConf.bg }]}>
                    {getPlaceIcon(place.type, place.category, 22, C.textPrimary)}
                  </View>

                  {/* Middle: Info */}
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
                    <View style={styles.placeSubRow}>
                      <Text style={styles.placeType}>{typeConf.label}</Text>
                      <View style={[styles.openBadge, { backgroundColor: isOpen ? "#D1FAE5" : "#FEE2E2" }]}>
                        <Clock size={9} color={isOpen ? "#059669" : "#DC2626"} strokeWidth={2.5} />
                        <Text style={[styles.openText, { color: isOpen ? "#059669" : "#DC2626" }]}>
                          {isOpen ? "Open" : "Closed"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Right: Distance + Safety */}
                  <View style={styles.placeRight}>
                    <Text style={styles.placeDistance}>{formatDist(place.distanceValue)}</Text>
                    <View style={[styles.placeSafetyPill, { backgroundColor: badge.bg }]}>
                      {badge.icon}
                      <Text style={[styles.placeSafetyText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingBottom: 0 },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 64 : 48,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "500",
    color: C.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textSecondary,
  },

  // Search
  searchRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: C.textPrimary,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: C.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Chips
  chipContainer: { marginBottom: 20 },
  chipScroll: { paddingHorizontal: 20, gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
  },
  chipActive: {
    backgroundColor: C.primary,
    borderColor: C.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textSecondary,
  },
  chipTextActive: {
    color: C.white,
  },

  // Map Card
  mapCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.cardBorder,
    backgroundColor: C.surface,
  },
  mapCardInner: {
    height: 140,
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: C.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  mapPlaceholderText: {
    fontSize: 12,
    fontWeight: "400",
    color: C.primary,
  },
  mapCardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  mapCardLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  mapCardLabelText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textPrimary,
  },
  mapExpandBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  mapExpandText: {
    fontSize: 12,
    fontWeight: "500",
    color: C.primary,
  },

  // Error
  errorCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#FEF2F2",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    gap: 10,
    borderWidth: 0.5,
    borderColor: "#FECACA",
  },
  errorText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#991B1B",
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#DC2626",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "500",
    color: C.white,
  },

  // Loading
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "400",
    color: C.textSecondary,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: C.textTertiary,
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },

  // Trending Cards
  trendingScroll: { paddingHorizontal: 20, gap: 12 },
  trendingCard: {
    width: TRENDING_CARD_WIDTH,
    backgroundColor: C.surface,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: C.cardBorder,
  },
  trendingCardTop: {
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  trendingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendingBadgeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  trendingCardBottom: {
    padding: 12,
    gap: 6,
  },
  trendingName: {
    fontSize: 13,
    fontWeight: "500",
    color: C.textPrimary,
  },
  trendingMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  trendingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  trendingRating: {
    fontSize: 11,
    fontWeight: "500",
    color: C.textSecondary,
  },
  trendingDist: {
    fontSize: 11,
    fontWeight: "400",
    color: C.textTertiary,
  },

  // All Places Header
  allPlacesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  placesCount: {
    fontSize: 12,
    fontWeight: "400",
    color: C.textTertiary,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: C.textPrimary,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textSecondary,
    textAlign: "center",
  },

  // Place Row
  placeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  placeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  placeInfo: {
    flex: 1,
    gap: 4,
  },
  placeName: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
  },
  placeSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  placeType: {
    fontSize: 12,
    fontWeight: "400",
    color: C.textSecondary,
  },
  openBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  openText: {
    fontSize: 10,
    fontWeight: "500",
  },
  placeRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  placeDistance: {
    fontSize: 12,
    fontWeight: "400",
    color: C.textSecondary,
  },
  placeSafetyPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  placeSafetyText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
