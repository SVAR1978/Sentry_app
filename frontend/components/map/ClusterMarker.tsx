import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { Text } from "react-native-paper";
import { Cluster } from "../../services/maps/locationService";

interface ClusterMarkerProps {
  cluster: Cluster;
  onPress?: (cluster: Cluster) => void;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  cluster,
  onPress,
}) => {
  // Size based on cluster count
  const getSize = () => {
    if (cluster.count >= 50) return 60;
    if (cluster.count >= 20) return 50;
    if (cluster.count >= 10) return 44;
    return 38;
  };

  // Color based on cluster count
  const getColor = () => {
    if (cluster.count >= 50) return "#EF4444"; // Large cluster - red
    if (cluster.count >= 20) return "#F59E0B"; // Medium cluster - orange
    return "#10B981"; // Small cluster - green
  };

  const size = getSize();
  const color = getColor();

  return (
    <Marker
      coordinate={cluster.coordinate}
      onPress={() => onPress?.(cluster)}
      tracksViewChanges={false}
    >
      <View style={[styles.container, { width: size, height: size }]}>
        <View style={[styles.outerRing, { borderColor: color + "40" }]}>
          <View
            style={[
              styles.innerCircle,
              {
                width: size - 12,
                height: size - 12,
                borderRadius: (size - 12) / 2,
                backgroundColor: color,
              },
            ]}
          >
            <Text style={styles.countText}>
              {cluster.count > 99 ? "99+" : cluster.count}
            </Text>
          </View>
        </View>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  outerRing: {
    flex: 1,
    borderWidth: 3,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  innerCircle: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  countText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default ClusterMarker;
