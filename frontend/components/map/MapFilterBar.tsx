import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { MAP_FILTER_OPTIONS } from "../../constants/mapData";

interface MapFilterBarProps {
  selectedFilter: string;
  onFilterChange: (filterId: string) => void;
  showRiskZones: boolean;
  onToggleRiskZones: () => void;
}

export const MapFilterBar: React.FC<MapFilterBarProps> = ({
  selectedFilter,
  onFilterChange,
  showRiskZones,
  onToggleRiskZones,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Risk Zones Toggle */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            showRiskZones && styles.riskZoneChipActive,
          ]}
          onPress={onToggleRiskZones}
          activeOpacity={0.7}
        >
          <Icon
            source="shield-alert"
            size={16}
            color={showRiskZones ? "#fff" : "#EF4444"}
          />
          <Text
            style={[
              styles.filterLabel,
              showRiskZones && styles.riskZoneLabelActive,
            ]}
          >
            Risk Zones
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* POI Filters */}
        {MAP_FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              selectedFilter === filter.id && styles.filterChipActive,
            ]}
            onPress={() => onFilterChange(filter.id)}
            activeOpacity={0.7}
          >
            <Icon
              source={filter.icon}
              size={16}
              color={selectedFilter === filter.id ? "#fff" : "#6B7280"}
            />
            <Text
              style={[
                styles.filterLabel,
                selectedFilter === filter.id && styles.filterLabelActive,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: "#10B981",
  },
  riskZoneChipActive: {
    backgroundColor: "#EF4444",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  filterLabelActive: {
    color: "#fff",
  },
  riskZoneLabelActive: {
    color: "#fff",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
  },
});

export default MapFilterBar;
