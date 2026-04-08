import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../store/AuthContext";
import {
  MapPin,
  Navigation,
  ChevronLeft,
  Save,
  Map as MapIcon,
} from "lucide-react-native";
import * as Location from "expo-location";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  background: "#F2F2F2",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  accent: "#8C7D79",
  success: "#4CAF50",
};

export default function AddressSettingsScreen() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [address, setAddress] = useState(user?.address || "");

  useEffect(() => {
    if (user?.address) {
      setAddress(user.address);
    }
  }, [user]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUser({
        address: address,
      });

      Alert.alert("Success", "Address updated successfully");
      router.navigate("/profile");
    } catch (error) {
      Alert.alert("Error", "Failed to update address");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Allow location access to get your current address.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const formattedAddress = `${addr.name || ""}${addr.street ? ", " + addr.street : ""}${addr.city ? ", " + addr.city : ""}${addr.region ? ", " + addr.region : ""}${addr.postalCode ? " " + addr.postalCode : ""}`;
        setAddress(formattedAddress.trim().replace(/^, /, ""));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to get current location");
      console.error(error);
    } finally {
      setLocating(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.navigate("/profile")}
            style={styles.backButton}
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Address</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconBorder}>
              <MapPin size={48} color={COLORS.white} strokeWidth={1.5} />
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>SAVED ADDRESS</Text>
            <TouchableOpacity
              onPress={getCurrentLocation}
              style={styles.locateButton}
              disabled={locating}
            >
              {locating ? (
                <ActivityIndicator size="small" color={COLORS.textSecondary} />
              ) : (
                <>
                  <Navigation size={14} color={COLORS.textSecondary} />
                  <Text style={styles.locateText}>Locate Me</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <MapIcon size={20} color={COLORS.secondary} />
            </View>
            <TextInput
              label="Home Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              mode="flat"
              textColor={COLORS.textPrimary}
              underlineColor="transparent"
              activeUnderlineColor={COLORS.primary}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
          disabled={loading || locating}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Save size={20} color={COLORS.white} strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>Update Address</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  iconSection: {
    alignItems: "center",
    marginTop: 10,
  },
  iconWrapper: {
    position: "relative",
  },
  iconBorder: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.secondary,
    letterSpacing: 1.5,
  },
  locateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "rgba(140, 125, 121, 0.1)",
  },
  locateText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 20,
    marginBottom: 16,
    paddingLeft: 16,
    paddingTop: 8,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
  },
  inputIcon: {
    marginTop: 18,
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    fontWeight: "700",
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 32,
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
