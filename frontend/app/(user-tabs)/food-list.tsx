import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  ArrowLeft,
  Heart,
  MapPin,
} from "lucide-react-native";
import {
  DELHI_FOOD_SPOTS,
  EXPLORE_COLORS as C,
  haversineDistance,
  formatDistanceKm,
  type DelhiFoodSpot,
  type FoodCategory,
  type Coordinates,
} from "../../constants/exploreData";

const SAVED_KEY = "@sentry:saved_places";
type FilterOption = "all" | "vegetarian" | "non_veg" | "budget" | "fine_dining" | "street_food";

export default function FoodListScreen() {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);

  useEffect(() => {
    loadSavedPlaces();
    getLocation();
  }, []);

  const loadSavedPlaces = async () => {
    try {
      const raw = await AsyncStorage.getItem(SAVED_KEY);
      if (raw) setSavedIds(new Set(JSON.parse(raw)));
    } catch {}
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    } catch {}
  };

  const toggleSave = useCallback(async (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify([...next])).catch(() => {});
      return next;
    });
  }, []);

  const filteredData = useMemo(() => {
    let data = [...DELHI_FOOD_SPOTS];
    if (filter === "all") return data;
    if (filter === "vegetarian") return data.filter((f) => f.isVegetarian);
    if (filter === "non_veg") return data.filter((f) => !f.isVegetarian);
    if (filter === "budget") return data.filter((f) => f.avgCostForTwo <= 400);
    if (filter === "fine_dining") return data.filter((f) => f.category === "fine_dining");
    if (filter === "street_food") return data.filter((f) => f.category === "street_food");
    return data;
  }, [filter]);

  const filters: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All" },
    { key: "vegetarian", label: "Vegetarian" },
    { key: "non_veg", label: "Non-Veg" },
    { key: "budget", label: "Budget" },
    { key: "fine_dining", label: "Fine Dining" },
    { key: "street_food", label: "Street Food" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color={C.primary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food & Dining</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[styles.filterChipText, filter === f.key && styles.filterChipTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 14 }}
        renderItem={({ item }) => {
          const dist = userLocation
            ? formatDistanceKm(haversineDistance(userLocation, item.coordinates))
            : "";
          return (
            <View style={styles.listCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
              <View style={styles.listInfo}>
                <View style={styles.listRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.listArea} numberOfLines={1}>
                      {item.area}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleSave(item.id)}
                    accessibilityLabel={`Save ${item.name}`}
                    accessibilityState={{ selected: savedIds.has(item.id) }}
                  >
                    <Heart
                      size={18}
                      color={savedIds.has(item.id) ? "#FF6B6B" : C.secondary}
                      fill={savedIds.has(item.id) ? "#FF6B6B" : "transparent"}
                      strokeWidth={2.5}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.tags}>
                  <View
                    style={[
                      styles.tag,
                      { backgroundColor: item.isVegetarian ? "#D1FAE5" : "#FEE2E2" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: item.isVegetarian ? C.success : C.danger },
                      ]}
                    >
                      {item.isVegetarian ? "🟢 Veg" : "🔴 Non-Veg"}
                    </Text>
                  </View>
                  <Text style={styles.cuisineText}>{item.cuisine}</Text>
                </View>
                <View style={styles.bottomRow}>
                  <Text style={styles.cost}>₹{item.avgCostForTwo} for two</Text>
                  {dist !== "" && (
                    <View style={styles.distRow}>
                      <MapPin size={10} color={C.secondary} strokeWidth={2.5} />
                      <Text style={styles.distText}>{dist}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.badges}>
                  {item.hygieneRated && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>✅ Hygiene</Text>
                    </View>
                  )}
                  {item.touristFriendly && (
                    <View style={[styles.badge, { backgroundColor: "rgba(33,16,11,0.04)" }]}>
                      <Text style={[styles.badgeText, { color: C.primary }]}>🌍 Tourist</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No restaurants match this filter</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 60 : 44,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(33, 16, 11, 0.05)",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: C.primary },
  filterRow: { gap: 8, paddingHorizontal: 20, paddingVertical: 10 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
  },
  filterChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  filterChipText: { fontSize: 12, fontWeight: "700", color: C.secondary },
  filterChipTextActive: { color: C.white },
  listCard: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  listImage: { width: 110, height: "100%", minHeight: 120 },
  listInfo: { flex: 1, padding: 12, gap: 6 },
  listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  listName: { fontSize: 16, fontWeight: "800", color: C.primary },
  listArea: { fontSize: 12, fontWeight: "600", color: C.secondary },
  tags: { flexDirection: "row", gap: 8, alignItems: "center" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  tagText: { fontSize: 10, fontWeight: "800" },
  cuisineText: { fontSize: 11, fontWeight: "700", color: C.secondary },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cost: { fontSize: 13, fontWeight: "800", color: C.accent },
  distRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  distText: { fontSize: 11, fontWeight: "600", color: C.secondary },
  badges: { flexDirection: "row", gap: 6 },
  badge: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: C.success },
  empty: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 14, fontWeight: "600", color: C.secondary },
});
