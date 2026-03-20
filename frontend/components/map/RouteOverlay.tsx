import React from "react";
import { StyleSheet, View } from "react-native";
import { Marker, Polyline } from "react-native-maps";
import { Icon, Text } from "react-native-paper";
import { LocationCoordinate } from "../../services/maps/locationService";

interface RouteOverlayProps {
  plannedRoute: LocationCoordinate[];
  actualPath: LocationCoordinate[];
  deviationDistance?: number;
  deviationStatus?: "safe" | "warning" | "danger";
  showDeviationIndicator?: boolean;
}

export const RouteOverlay: React.FC<RouteOverlayProps> = ({
  plannedRoute,
  actualPath,
  deviationDistance = 0,
  deviationStatus = "safe",
  showDeviationIndicator = true,
}) => {
  const getDeviationColor = () => {
    switch (deviationStatus) {
      case "warning":
        return "#F59E0B";
      case "danger":
        return "#EF4444";
      default:
        return "#10B981";
    }
  };

  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  // Get the last point of actual path for deviation indicator
  const lastActualPoint =
    actualPath.length > 0 ? actualPath[actualPath.length - 1] : null;

  return (
    <>
      {/* Planned Route - Blue dashed line */}
      {plannedRoute.length > 1 && (
        <Polyline
          coordinates={plannedRoute}
          strokeColor="#3B82F6"
          strokeWidth={4}
          lineDashPattern={[10, 8]}
        />
      )}

      {/* Actual Path - Solid green/yellow/red based on deviation */}
      {actualPath.length > 1 && (
        <Polyline
          coordinates={actualPath}
          strokeColor={getDeviationColor()}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {/* Waypoint markers for planned route */}
      {plannedRoute.map((point, index) => (
        <Marker
          key={`waypoint-${index}`}
          coordinate={point}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
        >
          <View style={styles.waypointContainer}>
            <View
              style={[
                styles.waypointMarker,
                index === 0 && styles.startMarker,
                index === plannedRoute.length - 1 && styles.endMarker,
              ]}
            >
              {index === 0 ? (
                <Icon source="flag" size={12} color="#fff" />
              ) : index === plannedRoute.length - 1 ? (
                <Icon source="flag-checkered" size={12} color="#fff" />
              ) : (
                <Text style={styles.waypointNumber}>{index}</Text>
              )}
            </View>
          </View>
        </Marker>
      ))}

      {/* Deviation indicator */}
      {showDeviationIndicator && lastActualPoint && deviationDistance > 100 && (
        <Marker
          coordinate={lastActualPoint}
          anchor={{ x: 0.5, y: 1.5 }}
          tracksViewChanges={false}
        >
          <View
            style={[
              styles.deviationBubble,
              { backgroundColor: getDeviationColor() },
            ]}
          >
            <Icon
              source={deviationStatus === "danger" ? "alert" : "information"}
              size={14}
              color="#fff"
            />
            <Text style={styles.deviationText}>
              {formatDistance(deviationDistance)} off route
            </Text>
          </View>
        </Marker>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  waypointContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  waypointMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  startMarker: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
    shadowOpacity: 0.4,
  },
  endMarker: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOpacity: 0.4,
  },
  waypointNumber: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  deviationBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  deviationText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});

export default RouteOverlay;
