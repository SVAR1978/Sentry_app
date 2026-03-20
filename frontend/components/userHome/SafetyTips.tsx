import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    Linking,
    Platform,
    Share,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { getCurrentLocation } from "../../services/maps/locationService";

const SafetyTips: React.FC = () => {
  const [sharing, setSharing] = useState(false);

  const handleShareLocation = async () => {
    try {
      setSharing(true);

      // Get current location
      const location = await getCurrentLocation();

      if (!location) {
        Alert.alert(
          "Location Unavailable",
          "Unable to get your current location. Please enable location services.",
          [{ text: "OK" }],
        );
        setSharing(false);
        return;
      }

      const { latitude, longitude } = location;

      // Create Google Maps link
      const mapsUrl = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });

      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Share options
      Alert.alert(
        "Share Your Location",
        "Choose how you want to share your location:",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Share Link",
            onPress: async () => {
              try {
                await Share.share({
                  message: `📍 I'm sharing my live location with you!\n\nLatitude: ${latitude.toFixed(6)}\nLongitude: ${longitude.toFixed(6)}\n\nView on map: ${googleMapsUrl}`,
                  title: "My Current Location",
                });
              } catch (error) {
                console.error("Error sharing:", error);
              }
            },
          },
          {
            text: "Open in Maps",
            onPress: async () => {
              try {
                const supported = await Linking.canOpenURL(mapsUrl!);
                if (supported) {
                  await Linking.openURL(mapsUrl!);
                } else {
                  await Linking.openURL(googleMapsUrl);
                }
              } catch (error) {
                console.error("Error opening maps:", error);
                Alert.alert("Error", "Unable to open maps application");
              }
            },
          },
        ],
      );

      setSharing(false);
    } catch (error) {
      console.error("Error in handleShareLocation:", error);
      Alert.alert("Error", "Failed to share location. Please try again.", [
        { text: "OK" },
      ]);
      setSharing(false);
    }
  };

  return (
    <View style={styles.section}>
      <Card style={styles.safetyCard}>
        <LinearGradient
          colors={["#FEF3C7", "#FDE68A"]}
          style={styles.safetyGradient}
        >
          <View style={styles.safetyContent}>
            <View style={styles.safetyIcon}>
              <MaterialCommunityIcons
                name="shield-check"
                size={32}
                color="#F59E0B"
              />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>Travel Safety Tip</Text>
              <Text style={styles.safetyDescription}>
                Always share your live location with family members when
                traveling to new places.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.safetyButton,
              sharing && styles.safetyButtonDisabled,
            ]}
            onPress={handleShareLocation}
            disabled={sharing}
          >
            {sharing ? (
              <>
                <ActivityIndicator size="small" color="#F59E0B" />
                <Text style={styles.safetyButtonText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <Text style={styles.safetyButtonText}>Share Location</Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#F59E0B"
                />
              </>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  safetyCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 0,
  },
  safetyGradient: {
    padding: 20,
  },
  safetyContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  safetyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  safetyText: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginBottom: 6,
  },
  safetyDescription: {
    fontSize: 13,
    color: "#A16207",
    lineHeight: 18,
  },
  safetyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  safetyButtonDisabled: {
    opacity: 0.6,
  },
  safetyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
  },
});

export default SafetyTips;
