import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
import { COLORS } from "../../constants/userHomeData";
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
      <BlurView intensity={30} tint="light" style={styles.safetyCard}>
        <View style={styles.content}>
          <TouchableOpacity
            style={[styles.shareBtn, sharing && styles.shareBtnDisabled]}
            onPress={handleShareLocation}
            disabled={sharing}
            activeOpacity={0.85}
          >
            {sharing ? (
              <>
                <ActivityIndicator size="small" color={COLORS.gold} />
                <Text style={styles.shareBtnText}>Getting Location...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="share-variant" size={18} color={COLORS.gold} />
                <Text style={styles.shareBtnText}>Share My Location</Text>
                <MaterialCommunityIcons name="arrow-right" size={16} color={COLORS.gold} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  safetyCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
  },
  content: {
    padding: 18,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 50,
    backgroundColor: "rgba(207, 176, 132, 0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(207, 176, 132, 0.3)",
  },
  shareBtnDisabled: {
    opacity: 0.6,
  },
  shareBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.white,
  },
});

export default ShareLocation;
