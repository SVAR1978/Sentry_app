import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import * as Location from "expo-location";
import * as Haptics from "expo-haptics";
import { useAuth } from "../../store/AuthContext";

const ShareLocation: React.FC = () => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);

  const handleShareLocation = async () => {
    if (sharing) return;
    setSharing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // 1. Request Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setSharing(false);
        Alert.alert(
          "Permission Denied",
          "Location permission is required to share your location. Please enable it in Settings.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      // 2. Get Current Location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // 3. Reverse Geocode
      let addressStr = "";
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const place = geocode[0];
          const parts = [
            place.name,
            place.street,
            place.city,
            place.region,
            place.postalCode,
          ].filter(Boolean);
          addressStr = parts.join(", ");
        }
      } catch (e) {
        console.warn("Reverse geocode failed", e);
      }

      // 4. Build Professional Message
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const userName = user?.name || "A Sentry User";
      const timestamp = new Date().toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const shareMessage =
        `*LIVE LOCATION — Emergency Share*\n\n` +
        `From: ${userName}\n` +
        `Location: ${addressStr || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}\n` +
        `Time: ${timestamp}\n\n` +
        `Google Maps URL:\n${mapsLink}\n\n` +
        `This location was shared via the Sentry Emergency App.`;

      // 5. Open Share Sheet
      const result = await Share.share({
        message: shareMessage,
        title: "My Current Location",
      });

      if (result.action === Share.sharedAction) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error("Share location error", error);
      Alert.alert("Error", "Failed to get location. Please try again.");
    } finally {
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
  content: {
    padding: 16,
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
