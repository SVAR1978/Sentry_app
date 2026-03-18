import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Circle, Marker } from "react-native-maps";
import { Icon } from "react-native-paper";
import { LocationCoordinate } from "../../services/maps/locationService";

interface UserLocationMarkerProps {
  coordinate: LocationCoordinate;
  heading?: number | null;
  accuracy?: number | null;
  isPanic?: boolean;
  showAccuracyCircle?: boolean;
}

export const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  coordinate,
  heading,
  accuracy,
  isPanic = false,
  showAccuracyCircle = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (isPanic) {
      // Flashing animation for panic mode
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.5,
              duration: 500,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 500,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.7,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );
      pulse.start();

      return () => pulse.stop();
    } else {
      // Normal breathing animation
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      breathe.start();

      return () => breathe.stop();
    }
  }, [isPanic, pulseAnim, opacityAnim]);

  const markerColor = isPanic ? "#EF4444" : "#4285F4"; // Google Maps blue
  const rotation = heading ? `${heading}deg` : "0deg";

  return (
    <>
      {/* Accuracy circle (Google Maps style) */}
      {showAccuracyCircle && accuracy && accuracy > 10 && (
        <Circle
          center={coordinate}
          radius={accuracy}
          fillColor="rgba(66, 133, 244, 0.15)"
          strokeColor="rgba(66, 133, 244, 0.4)"
          strokeWidth={1.5}
        />
      )}

      <Marker
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        flat={true}
        tracksViewChanges={false}
        zIndex={1000}
      >
        <View style={styles.container}>
          {/* Pulse ring (more prominent) */}
          <Animated.View
            style={[
              styles.pulseRing,
              {
                backgroundColor: markerColor,
                transform: [{ scale: pulseAnim }],
                opacity: opacityAnim,
              },
            ]}
          />

          {/* Main marker (Google Maps style) */}
          <View
            style={[
              styles.markerOuter,
              { backgroundColor: markerColor },
              isPanic && styles.panicMarker,
            ]}
          >
            <View style={styles.markerInner}>
              {heading !== null && heading !== undefined ? (
                <View
                  style={[
                    styles.directionContainer,
                    { transform: [{ rotate: rotation }] },
                  ]}
                >
                  <Icon source="navigation" size={20} color={markerColor} />
                </View>
              ) : (
                <View
                  style={[styles.centerDot, { backgroundColor: markerColor }]}
                />
              )}
            </View>
          </View>
        </View>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
  },
  pulseRing: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  markerOuter: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  panicMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 5,
    borderColor: "#fff",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  directionContainer: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  centerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    shadowColor: "#4285F4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

export default UserLocationMarker;
