import React from "react";
import { StyleSheet, View } from "react-native";
import { Callout, Marker } from "react-native-maps";
import { Icon, Text } from "react-native-paper";
import {
    POIMarker as POIMarkerType,
    POI_CONFIG,
} from "../../constants/mapData";

interface POIMarkerProps {
  poi: POIMarkerType;
  onPress?: (poi: POIMarkerType) => void;
  onCalloutPress?: (poi: POIMarkerType) => void;
}

export const POIMarker: React.FC<POIMarkerProps> = ({
  poi,
  onPress,
  onCalloutPress,
}) => {
  const config = POI_CONFIG[poi.type];

  return (
    <Marker
      coordinate={poi.coordinate}
      onPress={() => onPress?.(poi)}
      tracksViewChanges={false}
    >
      <View
        style={[styles.markerContainer, { backgroundColor: config.bgColor }]}
      >
        <View style={[styles.markerInner, { backgroundColor: config.color }]}>
          <Icon source={config.icon} size={16} color="#fff" />
        </View>
      </View>

      <Callout onPress={() => onCalloutPress?.(poi)} tooltip>
        <View style={styles.calloutContainer}>
          <View style={styles.calloutHeader}>
            <Icon source={config.icon} size={18} color={config.color} />
            <Text style={styles.calloutTitle} numberOfLines={1}>
              {poi.name}
            </Text>
          </View>

          {poi.rating && (
            <View style={styles.ratingContainer}>
              <Icon source="star" size={14} color="#F59E0B" />
              <Text style={styles.ratingText}>{poi.rating.toFixed(1)}</Text>
            </View>
          )}

          {poi.phone && (
            <View style={styles.phoneContainer}>
              <Icon source="phone" size={14} color="#666" />
              <Text style={styles.phoneText}>{poi.phone}</Text>
            </View>
          )}

          {poi.isOpen !== undefined && (
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: poi.isOpen ? "#10B981" : "#EF4444" },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: poi.isOpen ? "#10B981" : "#EF4444" },
                ]}
              >
                {poi.isOpen ? "Open 24/7" : "Closed"}
              </Text>
            </View>
          )}

          <Text style={styles.calloutAction}>Tap for details →</Text>
        </View>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    padding: 4,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    minWidth: 160,
    maxWidth: 220,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
    color: "#1F2937",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#3B82F6",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  calloutAction: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "right",
  },
});

export default POIMarker;
