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
import { ActivityIndicator, Text } from "react-native-paper";
import { getCurrentLocation } from "../../services/maps/locationService";

const ShareLocation: React.FC = () => {
  const [sharing, setSharing] = useState(false);

  const handleShareLocation = async () => {
    try {
      setSharing(true);
      const location = await getCurrentLocation();

      if (!location) {
        Alert.alert(
          "Location Unavailable",
          "Unable to get your current location. Please enable location services.",
          [{ text: "OK" }]
        );
        setSharing(false);
        return;
      }

      const { latitude, longitude } = location;
      const mapsUrl = Platform.select({
        ios: `maps:0,0?q=${latitude},${longitude}`,
        android: `geo:0,0?q=${latitude},${longitude}`,
      });
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      Alert.alert(
        "Share Your Location",
        "Choose how you want to share your location:",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Share Link",
            onPress: async () => {
              try {
                await Share.share({
                  message: `I'm sharing my live location!\n\nView on map: ${googleMapsUrl}`,
                  title: "My Current Location",
                });
              } catch (error) {}
            },
          },
          {
            text: "Open in Maps",
            onPress: async () => {
              try {
                const supported = await Linking.canOpenURL(mapsUrl!);
                await Linking.openURL(supported ? mapsUrl! : googleMapsUrl);
              } catch (error) {
                Alert.alert("Error", "Unable to open maps application");
              }
            },
          },
        ]
      );
      setSharing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to share location. Please try again.");
      setSharing(false);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.safetyCard}>
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.shareBtn, sharing && styles.shareBtnDisabled]}
            onPress={handleShareLocation}
            disabled={sharing}
            activeOpacity={0.85}
          >
            {sharing ? (
              <>
                <ActivityIndicator size="small" color="#21100B" />
                <Text style={styles.shareBtnText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="share-variant" size={18} color="#21100B" />
                <Text style={styles.shareBtnText}>Share My Location</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color="#21100B" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  safetyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  cardBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  shieldIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  bannerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 13,
    color: "#8A9BB8",
    fontWeight: "500",
    marginBottom: 16,
    lineHeight: 18,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 50,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  shareBtnDisabled: {
    opacity: 0.6,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#21100B",
  },
});

export default ShareLocation;
