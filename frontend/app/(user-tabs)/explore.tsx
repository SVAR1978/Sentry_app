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
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTabVisibility } from "../../store/TabVisibilityContext";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  History,
  TrendingUp,
  ArrowUpRight,
  Loader2,
} from "lucide-react-native";
import {
  searchNearbyPlaces,
  searchPlaces,
  type SearchResult,
} from "../../services/maps/placesService";
import { Text } from "react-native-paper";

const RECENT_SEARCHES_KEY = '@sentry_recent_searches';
const MAX_RECENT_SEARCHES = 8;

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

// ── Realistic Place Images Dictionary ───────────────────────
const PLACE_IMAGES: Record<string, string[]> = {
  restaurant: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80"
  ],
  monument: [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=400&q=80"
  ],
  park: [
    "https://images.unsplash.com/photo-1585938389612-a552a28d6914?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80"
  ],
  religious: [
    "https://images.unsplash.com/photo-1561359313-0639aad49ca6?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1600080649740-42be63afbc00?auto=format&fit=crop&w=400&q=80"
  ],
  shopping: [
    "https://images.unsplash.com/photo-1519567281023-eb1c60b73c24?auto=format&fit=crop&w=400&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=400&q=80",
  ]
};

const getPlaceImage = (type: string, id: string) => {
  const t = type.toLowerCase();
  let categoryImages = PLACE_IMAGES.default;
  if (t.includes("restaurant") || t.includes("cafe") || t.includes("food")) categoryImages = PLACE_IMAGES.restaurant;
  else if (t.includes("park") || t.includes("garden")) categoryImages = PLACE_IMAGES.park;
  else if (t.includes("monument") || t.includes("attraction") || t.includes("tourism") || t.includes("museum")) categoryImages = PLACE_IMAGES.monument;
  else if (t.includes("temple") || t.includes("church") || t.includes("mosque")) categoryImages = PLACE_IMAGES.religious;
  else if (t.includes("shop") || t.includes("mall") || t.includes("market")) categoryImages = PLACE_IMAGES.shopping;

  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return categoryImages[hash % categoryImages.length];
};

// ── Place Type Configs ──────────────────────────────────────
const getPlaceTypeConfig = (t: any) => ({
  tourism: { bg: "#EDE9FE", label: t('monument') },
  attraction: { bg: "#EDE9FE", label: t('attraction') },
  monument: { bg: "#FEF3C7", label: t('monument') },
  museum: { bg: "#DBEAFE", label: t('museum') },
  restaurant: { bg: "#FEE2E2", label: t('food') },
  cafe: { bg: "#FEE2E2", label: t('cafe') },
  fast_food: { bg: "#FEE2E2", label: t('fastFood') },
  hotel: { bg: "#E0F2FE", label: t('hotel') },
  guest_house: { bg: "#E0F2FE", label: t('stay') },
  park: { bg: "#D1FAE5", label: t('park') },
  place: { bg: "#F3F4F6", label: t('place') },
});

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
const getSafetyBadge = (type: string, category: string, t: any): { label: string; bg: string; color: string; icon: React.ReactNode } => {
  const tStr = (type + category).toLowerCase();
  // "Busy" categories: food, market, popular tourist spots
  const busyTypes = ["restaurant", "cafe", "fast_food", "market", "mall", "shop", "attraction"];
  const isBusyType = busyTypes.some(bt => tStr.includes(bt));

  if (isBusyType) {
    return {
      label: t('busy'),
      bg: C.busyBg,
      color: C.busyText,
      icon: <Zap size={12} color={C.busyText} strokeWidth={2.5} />,
    };
  }
  return {
    label: t('safe'),
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

const DynamicPlaceImage = ({ place, style, resizeMode }: { place: PlaceWithDist, style: any, resizeMode: any }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRealImage = async () => {
      const tStr = (place.type + place.category).toLowerCase();
      const isFamousType = tStr.includes("monument") || tStr.includes("tourism") || tStr.includes("attraction") || tStr.includes("museum") || tStr.includes("temple") || tStr.includes("mosque") || tStr.includes("park") || tStr.includes("mall");

      if (isFamousType && place.name && place.name.length > 2) {
        try {
          const cleanName = place.name.split(',')[0].trim();
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanName)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.thumbnail?.source && isMounted) {
              setImageUrl(data.thumbnail.source);
              return;
            }
          }
        } catch (e) { } // ignore fails silently
      }

      // Fallback instantly if no real image is found online
      if (isMounted) setImageUrl(getPlaceImage(place.type, place.id));
    };

    fetchRealImage();
    return () => { isMounted = false; };
  }, [place.name, place.id, place.type]);

  if (!imageUrl) {
    return <View style={[style, { backgroundColor: '#E0F2FE' }]} />;
  }

  return <Image source={{ uri: imageUrl }} style={style} resizeMode={resizeMode} />;
};

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
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [sortOption, setSortOption] = useState<'distance' | 'safety' | 'atoz'>('distance');

  // ── Search Engine State ──
  const [searchResults, setSearchResults] = useState<PlaceWithDist[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchInputRef = useRef<RNTextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const { setTabBarVisible } = useTabVisibility();
  const lastScrollY = useRef(0);
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation('common');

  // ── Mount: get location & fetch places ──
  useEffect(() => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    getUserLocation();
    loadRecentSearches();
  }, []);

  // ── Load recent searches from storage ──
  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {
      console.warn('[Search] Failed to load recent searches');
    }
  };

  // ── Save a search term to recents ──
  const saveRecentSearch = async (query: string) => {
    try {
      const trimmed = query.trim();
      if (!trimmed || trimmed.length < 2) return;
      const updated = [trimmed, ...recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[Search] Failed to save recent search');
    }
  };

  // ── Clear all recent searches ──
  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

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
        setError(t('locationDenied'));
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
      setError(t('unableLoadPlaces'));
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

  // ── Search Engine: Debounced API Search ──
  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    setShowSearchOverlay(true);

    // Cancel previous debounce
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!text.trim() || text.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Debounce: wait 400ms after user stops typing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const lat = userLocation?.latitude;
        const lon = userLocation?.longitude;
        const results = await searchPlaces(text.trim(), lat, lon);

        // Compute distance for each result
        const withDist: PlaceWithDist[] = results.map((p) => {
          if (!userLocation) return { ...p, distanceValue: 9999 };
          const dx = (p.coordinate.latitude - userLocation.latitude) * 111000;
          const dy = (p.coordinate.longitude - userLocation.longitude) * 111000 * Math.cos((userLocation.latitude * Math.PI) / 180);
          return { ...p, distanceValue: Math.sqrt(dx * dx + dy * dy) };
        });

        withDist.sort((a, b) => a.distanceValue - b.distanceValue);
        setSearchResults(withDist.slice(0, 10));
      } catch (err) {
        console.warn('[Search] API search failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [userLocation]);

  // ── Handle selecting a search result ──
  const handleSelectSearchResult = useCallback((place: PlaceWithDist) => {
    saveRecentSearch(place.name);
    setSearchQuery('');
    setShowSearchOverlay(false);
    setSearchResults([]);
    searchInputRef.current?.blur();
    router.push({
      pathname: '/(user-tabs)/map',
      params: {
        lat: place.coordinate.latitude.toString(),
        lon: place.coordinate.longitude.toString(),
        name: place.name,
        filter: place.type,
      },
    } as any);
  }, []);

  // ── Handle selecting a recent search ──
  const handleSelectRecent = useCallback((query: string) => {
    setSearchQuery(query);
    handleSearch(query);
  }, [handleSearch]);

  // ── Close search overlay ──
  const closeSearchOverlay = useCallback(() => {
    setShowSearchOverlay(false);
    setSearchResults([]);
    searchInputRef.current?.blur();
  }, []);

  const filteredPlaces = useMemo(() => {
    let result = places;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.displayName.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      if (sortOption === 'distance') return a.distanceValue - b.distanceValue;
      if (sortOption === 'atoz') return a.name.localeCompare(b.name);
      if (sortOption === 'safety') {
        const getSafetyScore = (p: PlaceWithDist) => {
          const badge = getSafetyBadge(p.type, p.category, t);
          return badge.label === t('safe') ? 1 : 0;
        };
        const sA = getSafetyScore(a);
        const sB = getSafetyScore(b);
        if (sA === sB) return a.distanceValue - b.distanceValue; // fallback to distance if equal
        return sB - sA; // Safe (1) comes before Busy (0)
      }
      return 0;
    });
  }, [searchQuery, places, sortOption, t]);

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
    const tStr = (type + category).toLowerCase();
    const config = getPlaceTypeConfig(t);
    for (const [key, val] of Object.entries(config)) {
      if (tStr.includes(key)) return val;
    }
    return config.place;
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

      {/* ── FIXED TOP: HEADER + SEARCH (outside ScrollView) ── */}
      <Animated.View style={[styles.fixedTop, { opacity: headerOpacity }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('exploreTitle')} Delhi</Text>
          <View style={styles.headerSubRow}>
            <MapPin size={13} color={C.textSecondary} strokeWidth={2} />
            <Text style={styles.headerSub}>New Delhi, India</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Search size={18} color={C.textTertiary} strokeWidth={2} />
            <RNTextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder={t('searchPlaces')}
              placeholderTextColor={C.textTertiary}
              value={searchQuery}
              onChangeText={handleSearch}
              returnKeyType="search"
              onFocus={() => setShowSearchOverlay(true)}
              autoCorrect={false}
              autoCapitalize="none"
              spellCheck={false}
              onSubmitEditing={() => {
                if (searchQuery.trim().length >= 2) saveRecentSearch(searchQuery.trim());
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => { setSearchQuery(''); setSearchResults([]); setShowSearchOverlay(false); }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color={C.textTertiary} strokeWidth={2} />
              </TouchableOpacity>
            )}
            {isSearching && (
              <ActivityIndicator size="small" color={C.primary} style={{ marginLeft: 4 }} />
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8} onPress={() => setIsFilterVisible(true)}>
            <SlidersHorizontal size={18} color={C.white} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ── SEARCH OVERLAY (absolutely positioned over content) ── */}
        {showSearchOverlay && (searchQuery.length > 0 || searchResults.length > 0 || recentSearches.length > 0) && (
          <View style={styles.searchOverlay}>
            {/* Background dismiss tap area - doesn't dismiss keyboard */}
            {/* Recent Searches */}
            {searchQuery.length === 0 && recentSearches.length > 0 && (
              <View>
                <View style={styles.searchSectionHeader}>
                  <View style={styles.searchSectionLeft}>
                    <History size={14} color={C.textTertiary} strokeWidth={2} />
                    <Text style={styles.searchSectionTitle}>Recent Searches</Text>
                  </View>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearBtn}>Clear</Text>
                  </TouchableOpacity>
                </View>
                {recentSearches.map((term, idx) => (
                  <TouchableOpacity
                    key={`recent-${idx}`}
                    style={styles.searchSuggestionRow}
                    onPress={() => handleSelectRecent(term)}
                  >
                    <History size={16} color={C.textTertiary} strokeWidth={1.5} />
                    <Text style={styles.suggestionText} numberOfLines={1}>{term}</Text>
                    <ArrowUpRight size={14} color={C.textTertiary} strokeWidth={2} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Loading */}
            {isSearching && searchQuery.length >= 2 && (
              <View style={styles.searchLoadingRow}>
                <ActivityIndicator size="small" color={C.primary} />
                <Text style={styles.searchLoadingText}>Searching "{searchQuery}"...</Text>
              </View>
            )}

            {/* API Results */}
            {!isSearching && searchResults.length > 0 && (
              <View>
                <View style={styles.searchSectionHeader}>
                  <View style={styles.searchSectionLeft}>
                    <TrendingUp size={14} color={C.primary} strokeWidth={2} />
                    <Text style={[styles.searchSectionTitle, { color: C.primary }]}>Results</Text>
                  </View>
                  <Text style={styles.resultCount}>{searchResults.length} found</Text>
                </View>
                {searchResults.map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.searchResultRow}
                    onPress={() => handleSelectSearchResult(place)}
                  >
                    <View style={[styles.searchResultIcon, { backgroundColor: getTypeConfig(place.type, place.category).bg }]}>
                      {getPlaceIcon(place.type, place.category, 16, C.textPrimary)}
                    </View>
                    <View style={styles.searchResultInfo}>
                      <Text style={styles.searchResultName} numberOfLines={1}>{place.name}</Text>
                      <Text style={styles.searchResultSub} numberOfLines={1}>{place.displayName}</Text>
                    </View>
                    <View style={styles.searchResultRight}>
                      <Text style={styles.searchResultDist}>{formatDist(place.distanceValue)}</Text>
                      <MapPin size={12} color={C.primary} strokeWidth={2} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* No Results */}
            {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
              <View style={styles.noResultsRow}>
                <Search size={20} color={C.textTertiary} strokeWidth={1.5} />
                <Text style={styles.noResultsText}>No places found for "{searchQuery}"</Text>
              </View>
            )}
          </View>
        )}

      </Animated.View>

      {/* ── SCROLLABLE CONTENT (starts BELOW the fixed top) ── */}
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
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
                {React.cloneElement(cat.icon as React.ReactElement<any>, {
                  color: isActive ? C.white : C.textSecondary,
                })}
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {t(cat.key === 'monument' ? 'monuments' : cat.key === 'park' ? 'parks' : cat.key)}
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
              <Text style={styles.mapPlaceholderText}>{t('tapOpenMap')}</Text>
            </View>
            <View style={styles.mapCardOverlay}>
              <View style={styles.mapCardLabel}>
                <Compass size={14} color={C.primary} strokeWidth={2} />
                <Text style={styles.mapCardLabelText}>{t('liveMapView')}</Text>
              </View>
              <TouchableOpacity
                style={styles.mapExpandBtn}
                onPress={() => router.push("/(user-tabs)/map" as any)}
              >
                <Text style={styles.mapExpandText}>{t('expand')}</Text>
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
              <Text style={styles.retryText}>{t('retry')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── LOADING STATE ── */}
        {isLoading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={C.primary} />
            <Text style={styles.loadingText}>{t('findingPlaces')}</Text>
          </View>
        )}

        {/* ── TRENDING NEARBY ── */}
        {!isLoading && !error && filteredTrending.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{t('trendingNearby')}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.trendingScroll}
              decelerationRate="fast"
              snapToInterval={TRENDING_CARD_WIDTH + 12}
            >
              {filteredTrending.map((place, idx) => {
                const badge = getSafetyBadge(place.type, place.category, t);
                const bgColor = CARD_BG_COLORS[idx % CARD_BG_COLORS.length];
                return (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.trendingCard}
                    activeOpacity={0.85}
                    onPress={() => router.push({ pathname: "/(user-tabs)/map", params: { filter: place.type, lat: place.coordinate.latitude.toString(), lon: place.coordinate.longitude.toString(), name: place.name } } as any)}
                  >
                    {/* Top image area */}
                    <View style={styles.trendingCardTop}>
                      <DynamicPlaceImage
                        place={place}
                        style={styles.trendingImage}
                        resizeMode="cover"
                      />
                      <View style={[styles.trendingImageGradient, { backgroundColor: 'rgba(0,0,0,0.4)', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }]} />
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
              <Text style={styles.sectionLabel}>{t('allPlaces')}</Text>
              <Text style={styles.placesCount}>{filteredPlaces.length} {t('found')}</Text>
            </View>

            {filteredPlaces.length === 0 && (
              <View style={styles.emptyState}>
                <Search size={36} color={C.textTertiary} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>
                  {searchQuery ? t('noResultsFor', { query: searchQuery }) : t('noPlacesFound')}
                </Text>
                <Text style={styles.emptySub}>{t('tryDifferentCategory')}</Text>
              </View>
            )}

            {filteredPlaces.map((place) => {
              const badge = getSafetyBadge(place.type, place.category, t);
              const typeConf = getTypeConfig(place.type, place.category);
              // Determine open/closed (simple heuristic: always "Open" during 8am-10pm)
              const hour = new Date().getHours();
              const isOpen = hour >= 8 && hour <= 22;

              return (
                <TouchableOpacity
                  key={place.id}
                  style={styles.placeRow}
                  activeOpacity={0.75}
                  onPress={() => router.push({ pathname: "/(user-tabs)/map", params: { filter: place.type, lat: place.coordinate.latitude.toString(), lon: place.coordinate.longitude.toString(), name: place.name } } as any)}
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
                          {isOpen ? t('open') : t('closed')}
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

      {/* ── FILTER MODAL ── */}
      <Modal
        visible={isFilterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('filterAndSort', 'Sort & Filter')}</Text>
              <TouchableOpacity onPress={() => setIsFilterVisible(false)} hitSlop={10}>
                <X size={20} color={C.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSectionTitle}>{t('sortBy', 'Sort By')}</Text>

            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'distance' && styles.sortOptionActive]}
              onPress={() => setSortOption('distance')}
            >
              <Navigation size={18} color={sortOption === 'distance' ? C.primary : C.textSecondary} />
              <Text style={[styles.sortText, sortOption === 'distance' && styles.sortTextActive]}>{t('nearestFirst', 'Nearest First')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'safety' && styles.sortOptionActive]}
              onPress={() => setSortOption('safety')}
            >
              <ShieldCheck size={18} color={sortOption === 'safety' ? C.primary : C.textSecondary} />
              <Text style={[styles.sortText, sortOption === 'safety' && styles.sortTextActive]}>{t('safestFirst', 'Safest First')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortOption, sortOption === 'atoz' && styles.sortOptionActive]}
              onPress={() => setSortOption('atoz')}
            >
              <LayoutGrid size={18} color={sortOption === 'atoz' ? C.primary : C.textSecondary} />
              <Text style={[styles.sortText, sortOption === 'atoz' && styles.sortTextActive]}>{t('alphabetical', 'Alphabetical (A-Z)')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={() => setIsFilterVisible(false)}>
              <Text style={styles.applyBtnText}>{t('apply', 'Apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },
  scrollContent: { paddingBottom: 0 },

  // Fixed Top Container (header + search bar - outside ScrollView)
  fixedTop: {
    backgroundColor: C.background,
    zIndex: 10,
  },

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
    height: 100,
    width: "100%",
    position: "relative",
  },
  trendingImage: {
    width: "100%",
    height: "100%",
  },
  trendingImageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
    opacity: 0.5,
  },
  trendingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
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

  // Modal 
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: C.textPrimary,
  },
  modalSectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: C.textTertiary,
    marginBottom: 12,
    marginTop: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
    gap: 12,
  },
  sortOptionActive: {
    borderColor: C.primary,
    backgroundColor: C.primaryLight,
  },
  sortText: {
    fontSize: 15,
    fontWeight: "500",
    color: C.textSecondary,
  },
  sortTextActive: {
    color: C.primary,
    fontWeight: "600",
  },
  applyBtn: {
    backgroundColor: C.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  applyBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "600",
  },

  // Search Focus State
  searchBarFocused: {
    borderColor: C.primary,
    borderWidth: 1.5,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Search Overlay (absolute, floats over ScrollView)
  searchOverlay: {
    position: "absolute",
    top: "100%",
    marginTop: 8,
    left: 20,
    right: 20,
    backgroundColor: C.white,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.cardBorder,
    shadowColor: C.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: 420,
    overflow: "hidden",
    zIndex: 100,
  },
  searchSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  searchSectionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  searchSectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: C.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearBtn: {
    fontSize: 12,
    fontWeight: "500",
    color: "#DC2626",
  },
  resultCount: {
    fontSize: 11,
    fontWeight: "500",
    color: C.textTertiary,
  },

  // Recent Search Row
  searchSuggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: C.textPrimary,
  },

  // Search Loading
  searchLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },
  searchLoadingText: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textSecondary,
  },

  // Search Result Row
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  searchResultIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  searchResultInfo: {
    flex: 1,
    gap: 2,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: "500",
    color: C.textPrimary,
  },
  searchResultSub: {
    fontSize: 11,
    fontWeight: "400",
    color: C.textTertiary,
  },
  searchResultRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  searchResultDist: {
    fontSize: 11,
    fontWeight: "500",
    color: C.primary,
  },

  // No Results
  noResultsRow: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  noResultsText: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textTertiary,
    textAlign: "center",
  },
});
