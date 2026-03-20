import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Icon, Text } from "react-native-paper";
import { formatDistance } from "../../services/maps/locationService";
import { RouteInfo } from "../../services/maps/placesService";
import {
  NavigationState,
  formatRemainingTime,
  getTurnIcon,
} from "../../services/maps/navigationService";

interface DirectionsPanelProps {
  route: RouteInfo;
  destinationName: string;
  onClose: () => void;
  onRecenter: () => void;
  travelMode: "driving" | "walking" | "cycling";
  onChangeTravelMode: (mode: "driving" | "walking" | "cycling") => void;
  navigationState?: NavigationState | null;
  isLoadingRoute?: boolean;
}

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

export const DirectionsPanel: React.FC<DirectionsPanelProps> = ({
  route,
  destinationName,
  onClose,
  onRecenter,
  travelMode,
  onChangeTravelMode,
  navigationState,
  isLoadingRoute = false,
}) => {
  const maneuverIcon = (type: string) => {
    switch (type) {
      case "depart":
        return "flag";
      case "arrive":
        return "flag-checkered";
      case "turn":
        return "arrow-right-top";
      case "roundabout":
        return "rotate-right";
      default:
        return "arrow-up";
    }
  };

  const isNavigating = navigationState?.isNavigating;
  const currentStep = isNavigating
    ? route.steps[navigationState.currentStepIndex]
    : null;

  return (
    <View style={styles.container}>
      {/* Live Navigation Instruction */}
      {isNavigating && currentStep && (
        <View style={styles.liveNavContainer}>
          <View style={styles.turnIconContainer}>
            <Text style={styles.turnIconText}>
              {getTurnIcon(currentStep.maneuver)}
            </Text>
          </View>
          <View style={styles.liveNavContent}>
            <Text style={styles.liveNavInstruction} numberOfLines={2}>
              {navigationState.currentInstruction}
            </Text>
            <View style={styles.liveNavMeta}>
              <Text style={styles.liveNavDistance}>
                {formatDistance(navigationState.distanceToNextManeuver)}
              </Text>
              {navigationState.isOffRoute && (
                <View style={styles.offRouteWarning}>
                  <Icon source="alert" size={12} color="#EF4444" />
                  <Text style={styles.offRouteText}>Off route</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.destinationDot} />
          <View style={styles.headerText}>
            <Text style={styles.destinationName} numberOfLines={1}>
              {destinationName}
            </Text>
            <Text style={styles.routeSummary}>
              {isNavigating
                ? `${formatDistance(navigationState.distanceRemaining)} · ${formatRemainingTime(navigationState.timeRemaining)}`
                : `${formatDistance(route.distance)} · ${formatDuration(route.duration)}`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Icon source="close" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Travel Mode Selector */}
      <View style={styles.modeSelector}>
        {(
          [
            { id: "driving", icon: "car", label: "Drive" },
            { id: "walking", icon: "walk", label: "Walk" },
            { id: "cycling", icon: "bike", label: "Bike" },
          ] as const
        ).map((mode) => (
          <TouchableOpacity
            key={mode.id}
            style={[
              styles.modeButton,
              travelMode === mode.id && styles.modeButtonActive,
            ]}
            onPress={() => onChangeTravelMode(mode.id)}
            disabled={isLoadingRoute}
          >
            <Icon
              source={mode.icon}
              size={18}
              color={travelMode === mode.id ? "#10B981" : "#9CA3AF"}
            />
            <Text
              style={[
                styles.modeLabel,
                travelMode === mode.id && styles.modeLabelActive,
              ]}
            >
              {mode.label}
            </Text>
            {isLoadingRoute && travelMode === mode.id && (
              <ActivityIndicator size={12} color="#10B981" style={styles.modeLoading} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Steps */}
      <ScrollView style={styles.stepsList} showsVerticalScrollIndicator={false}>
        {route.steps.map((step, index) => {
          const isCurrentStep =
            isNavigating && index === navigationState.currentStepIndex;
          const isPastStep =
            isNavigating && index < navigationState.currentStepIndex;

          return (
          <View
            key={index}
            style={[
              styles.stepItem,
              isCurrentStep && styles.stepItemCurrent,
              isPastStep && styles.stepItemPast,
            ]}
          >
            <View style={styles.stepIconContainer}>
              <View
                style={[
                  styles.stepIcon,
                  index === 0 && styles.stepIconStart,
                  index === route.steps.length - 1 && styles.stepIconEnd,
                  isCurrentStep && styles.stepIconActive,
                  isPastStep && styles.stepIconCompleted,
                ]}
              >
                {isPastStep ? (
                  <Icon source="check" size={14} color="#fff" />
                ) : (
                  <Icon
                    source={maneuverIcon(step.maneuver)}
                    size={14}
                    color="#fff"
                  />
                )}
              </View>
              {index < route.steps.length - 1 && (
                <View style={styles.stepLine} />
              )}
            </View>
            <View style={styles.stepInfo}>
              <Text
                style={[
                  styles.stepInstruction,
                  isCurrentStep && styles.stepInstructionActive,
                  isPastStep && styles.stepInstructionPast,
                ]}
              >
                {step.instruction}
              </Text>
              {step.distance > 0 && (
                <Text
                  style={[
                    styles.stepDistance,
                    isPastStep && styles.stepDistancePast,
                  ]}
                >
                  {formatDistance(step.distance)} ·{" "}
                  {formatDuration(step.duration)}
                </Text>
              )}
            </View>
          </View>
          );
        })}
      </ScrollView>

      {/* Recenter Button */}
      <TouchableOpacity style={styles.recenterButton} onPress={onRecenter}>
        <Icon source={isNavigating ? "navigation" : "play"} size={18} color="#fff" />
        <Text style={styles.recenterText}>
          {isNavigating ? "Recenter" : "Start Navigation"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: 420,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(16, 185, 129, 0.1)",
  },
  liveNavContainer: {
    flexDirection: "row",
    backgroundColor: "#0EA5E9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#0EA5E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  turnIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  turnIconText: {
    fontSize: 32,
  },
  liveNavContent: {
    flex: 1,
  },
  liveNavInstruction: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    lineHeight: 22,
    marginBottom: 6,
  },
  liveNavMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  liveNavDistance: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
  },
  offRouteWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  offRouteText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#EF4444",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  destinationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#EF4444",
    marginRight: 14,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
  },
  destinationName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  routeSummary: {
    fontSize: 14,
    color: "#10B981",
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.2,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  modeSelector: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    padding: 6,
    borderRadius: 14,
  },
  modeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "transparent",
    gap: 6,
  },
  modeButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  modeLabelActive: {
    color: "#10B981",
    fontWeight: "700",
  },
  modeLoading: {
    marginLeft: 4,
  },
  stepsList: {
    maxHeight: 180,
  },
  stepItem: {
    flexDirection: "row",
    minHeight: 48,
  },
  stepItemCurrent: {
    backgroundColor: "rgba(14, 165, 233, 0.05)",
    marginHorizontal: -20,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "#0EA5E9",
  },
  stepItemPast: {
    opacity: 0.5,
  },
  stepIconContainer: {
    width: 30,
    alignItems: "center",
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  stepIconStart: {
    backgroundColor: "#10B981",
    shadowColor: "#10B981",
  },
  stepIconEnd: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
  },
  stepIconActive: {
    backgroundColor: "#0EA5E9",
    shadowColor: "#0EA5E9",
    transform: [{ scale: 1.15 }],
  },
  stepIconCompleted: {
    backgroundColor: "#10B981",
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 2,
  },
  stepInfo: {
    flex: 1,
    marginLeft: 10,
    paddingBottom: 14,
  },
  stepInstruction: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    lineHeight: 20,
  },
  stepInstructionActive: {
    color: "#0EA5E9",
    fontWeight: "700",
  },
  stepInstructionPast: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  stepDistance: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 3,
    fontWeight: "500",
  },
  stepDistancePast: {
    color: "#D1D5DB",
  },
  recenterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recenterText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});

export default DirectionsPanel;
