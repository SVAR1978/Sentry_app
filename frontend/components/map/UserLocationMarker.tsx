import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Circle, Marker } from "react-native-maps";
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
  accuracy,
  isPanic = false,
  showAccuracyCircle = true,
}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;
  const markerColor = isPanic ? "#EF4444" : "#4285F4"; // Threat Red vs Google Blue

  useEffect(() => {
    pulseAnim.setValue(1);
    opacityAnim.setValue(isPanic ? 0.6 : 0.4);

    if (isPanic) {
      // Rapid pulse for high-risk red zone
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 3, duration: 800, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.6, duration: 0, useNativeDriver: true }),
          ]),
          Animated.delay(100),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      // Slow, sweeping radar pulse for safe status
      const breathe = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 4, duration: 2500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.4, duration: 0, useNativeDriver: true }),
          ]),
          Animated.delay(800),
        ])
      );
      breathe.start();
      return () => breathe.stop();
    }
  }, [isPanic, pulseAnim, opacityAnim]);

  return (
    <>
      {/* Surrounding GPS Accuracy Bubble */}
      {showAccuracyCircle && accuracy && accuracy > 10 && (
        <Circle
          center={coordinate}
          radius={accuracy}
          fillColor={isPanic ? "rgba(239, 68, 68, 0.12)" : "rgba(66, 133, 244, 0.12)"}
          strokeColor={isPanic ? "rgba(239, 68, 68, 0.3)" : "rgba(66, 133, 244, 0.3)"}
          strokeWidth={1}
          zIndex={1}
        />
      )}

      <Marker
        coordinate={coordinate}
        anchor={{ x: 0.5, y: 0.5 }}
        flat={true} // Rotates alongside the map if the user spins the map overview
        zIndex={1000}
        tracksViewChanges={false} // Performance critical for static geometry markers
      >
        <View style={styles.container}>
          {/* Animated Sonar Expansion Ring */}
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

          {/* Minimalist, Premium Center Node */}
          <View
            style={[
              styles.coreDot,
              { backgroundColor: markerColor },
              isPanic && styles.panicShadow,
            ]}
          />
        </View>
      </Marker>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 100, // Large bounds prevent sonar from getting clipped on scaling
    height: 100,
  },
  pulseRing: {
    position: "absolute",
    width: 20, // Baseline perfectly identically sized to inner radius
    height: 20,
    borderRadius: 10,
  },
  coreDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 3.5, // Crisp solid white frame ring
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  panicShadow: {
    shadowColor: "#EF4444",
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default UserLocationMarker;
