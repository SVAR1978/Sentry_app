import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import {
  ArrowLeft,
  Shield,
  Heart,
  Clock,
  MapPin,
  Filter,
} from "lucide-react-native";
import {
  DELHI_ATTRACTIONS,
  EXPLORE_COLORS as C,
  haversineDistance,
  formatDistanceKm,
  type DelhiAttraction,
  type Coordinates,
} from "../../constants/exploreData";

const SAVED_KEY = "@sentry:saved_places";
type FilterOption = "all" | "freeEntry" | "topRated" | "nearest";

export default function AttractionListScreen() {
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

  const getDistance = useCallback(
    (coords: Coordinates): number => {
      if (!userLocation) return 0;
      return haversineDistance(userLocation, coords);
    },
    [userLocation]
  );

  const filteredData = useMemo(() => {
    let data = [...DELHI_ATTRACTIONS];
    if (filter === "freeEntry") data = data.filter((a) => a.isFreeEntry);
    if (filter === "topRated") data.sort((a, b) => b.safetyScore - a.safetyScore);
    if (filter === "nearest" && userLocation)
      data.sort(
        (a, b) =>
          haversineDistance(userLocation, a.coordinates) -
          haversineDistance(userLocation, b.coordinates)
      );
    return data;
  }, [filter, userLocation]);

  const filters: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All" },
    { key: "freeEntry", label: "Free Entry" },
    { key: "topRated", label: "Top Rated" },
    { key: "nearest", label: "Nearest" },
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
        <Text style={styles.headerTitle}>All Attractions</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
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
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, gap: 14 }}
        renderItem={({ item }) => {
          const dist = getDistance(item.coordinates);
          const safetyColor =
            item.safetyScore >= 4.5 ? C.success : item.safetyScore >= 3.5 ? C.warning : C.danger;
          return (
            <View style={styles.listCard}>
              <Image source={{ uri: item.imageUrl }} style={styles.listImage} />
              <View style={styles.listInfo}>
                <View style={styles.listRow}>
                  <Text style={styles.listName} numberOfLines={1}>
                    {item.name}
                  </Text>
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
                <View style={styles.listMeta}>
                  <View style={[styles.safetyBadge, { backgroundColor: safetyColor + "15" }]}>
                    <Shield size={10} color={safetyColor} strokeWidth={2.5} />
                    <Text style={[styles.safetyText, { color: safetyColor }]}>
                      {item.safetyScore}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={10} color={C.secondary} strokeWidth={2.5} />
                    <Text style={styles.metaText} numberOfLines={1}>{item.timings}</Text>
                  </View>
                </View>
                <View style={styles.listMeta}>
                  <Text style={styles.feeText}>{item.entryFee}</Text>
                  {dist > 0 && (
                    <View style={styles.metaItem}>
                      <MapPin size={10} color={C.secondary} strokeWidth={2.5} />
                      <Text style={styles.metaText}>{formatDistanceKm(dist)}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
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
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
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
  listImage: { width: 110, height: "100%", minHeight: 110 },
  listInfo: { flex: 1, padding: 12, gap: 6 },
  listRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  listName: { fontSize: 16, fontWeight: "800", color: C.primary, flex: 1 },
  listMeta: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  safetyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  safetyText: { fontSize: 11, fontWeight: "800" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontWeight: "600", color: C.secondary },
  feeText: { fontSize: 12, fontWeight: "700", color: C.accent },
});
