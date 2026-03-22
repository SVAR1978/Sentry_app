import React, { useCallback, useRef, useState } from "react";
import {
    FlatList,
    Keyboard,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Icon, Searchbar, Text } from "react-native-paper";
import {
    SearchResult,
    searchTouristPlaces,
} from "../../services/maps/placesService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SearchOverlayProps {
  onSelectPlace: (place: SearchResult) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  onSelectPlace,
}) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = useCallback((text: string) => {
    setQuery(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setShowResults(true);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const places = await searchTouristPlaces(text.trim());
        setResults(places);
      } catch (e) {
        console.error("Search failed:", e);
        setResults([]);
      }
      setLoading(false);
    }, 500);
  }, []);

  const handleSelect = (place: SearchResult) => {
    setQuery(place.name);
    setShowResults(false);
    setResults([]);
    Keyboard.dismiss();
    onSelectPlace(place);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.resultIcon}>
        <Icon source={item.icon || "map-marker"} size={22} color="#10B981" />
      </View>
      <View style={styles.resultText}>
        <Text style={styles.resultName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.resultAddress} numberOfLines={1}>
          {item.displayName}
        </Text>
      </View>
      <Icon source="arrow-top-left" size={18} color="#D1D5DB" />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { top: insets.top + 12 }]}>
      <Searchbar
        placeholder="Search tourist places in India..."
        onChangeText={handleSearch}
        value={query}
        style={styles.searchBar}
        inputStyle={styles.searchInput}
        onFocus={() => {
          if (results.length > 0) setShowResults(true);
        }}
        icon={() => <Icon source="magnify" size={22} color="#9CA3AF" />}
        clearIcon={() =>
          query.length > 0 ? (
            <TouchableOpacity onPress={handleClear}>
              <Icon source="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null
        }
      />

      {showResults && (
        <View style={styles.resultsContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={styles.loadingText}>Searching places...</Text>
            </View>
          ) : results.length > 0 ? (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              keyboardShouldPersistTaps="handled"
              style={styles.resultsList}
            />
          ) : query.length >= 2 ? (
            <View style={styles.emptyContainer}>
              <Icon source="map-search-outline" size={32} color="#D1D5DB" />
              <Text style={styles.emptyText}>No places found</Text>
              <Text style={styles.emptySubtext}>
                Try "Red Fort", "India Gate", or "Lotus Temple"
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 30,
  },
  searchBar: {
    borderRadius: 18,
    elevation: 8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.1)",
  },
  searchInput: {
    fontSize: 15,
    fontWeight: "500",
  },
  resultsContainer: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    maxHeight: 340,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.1)",
  },
  resultsList: {
    maxHeight: 320,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
    backgroundColor: "#FFFFFF",
  },
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },
  resultAddress: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 6,
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 2,
    fontWeight: "500",
  },
});

export default SearchOverlay;
