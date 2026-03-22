import { LinearGradient } from "expo-linear-gradient";
import { Search, CircleX, SlidersHorizontal, MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/userHomeData";
import {
  getCurrentLocation,
  reverseGeocode,
} from "../../services/maps/locationService";

interface UserHeaderProps {
  user: any;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  user,
  searchQuery,
  setSearchQuery,
}) => {
  const insets = useSafeAreaInsets();
  const [locationName, setLocationName] = useState("Locating...");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const coords = await getCurrentLocation();
        if (coords) {
          const address = await reverseGeocode(coords);
          if (address) {
            // Address usually returns "Name, Street, City, Region"
            const parts = address.split(", ");
            // Grab City and Region if available (e.g. "Gurgaon, Haryana")
            const displayCity =
              parts.length >= 3
                ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
                : address;
            setLocationName(displayCity);
          } else {
            setLocationName("Location Found");
          }
        } else {
          setLocationName("India");
        }
      } catch (error) {
        setLocationName("Explore India");
      }
    };

    fetchLocation();
  }, []);

  return (
    <View style={styles.headerWrapper}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}
      >
        <View style={styles.headerContent}>
          {/* Top Row: Greeting + Avatar */}
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.userName}>{user?.name || "Explorer"}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={COLORS.secondary} strokeWidth={2.5} />
                <Text style={styles.locationNameText}>{locationName}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.avatarContainer} activeOpacity={0.8}>
              <View style={styles.avatarBorder}>
                {user?.avatar ? (
                  <Avatar.Image
                    size={52}
                    source={{ uri: user.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <Avatar.Text
                    size={52}
                    label={user?.name ? user.name.charAt(0).toUpperCase() : "G"}
                    style={[
                      styles.avatar,
                      { backgroundColor: "rgba(255,255,255,0.1)" },
                    ]}
                    color={COLORS.white}
                  />
                )}
              </View>
              <View style={styles.onlineDot} />
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.headerTitle}>Find your next safe</Text>
            <Text style={[styles.headerTitle, { color: COLORS.secondary }]}>
              adventure
            </Text>
          </View>

          {/* Premium Search Bar */}
          <View style={styles.searchBarWrapper}>
            <View style={styles.searchBar}>
              <Search
                size={20}
                color={COLORS.primaryContainer}
                strokeWidth={2.5}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search destinations..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <CircleX size={18} color={COLORS.textMuted} strokeWidth={2} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                <SlidersHorizontal
                  size={18}
                  color={COLORS.white}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    backgroundColor: COLORS.white,
  },
  header: {
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    paddingBottom: 48, 
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },
  greetingContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  locationNameText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  avatar: {
    backgroundColor: "transparent",
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  heroSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    lineHeight: 38,
    letterSpacing: -1,
  },
  searchBarWrapper: {
    marginTop: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8, // reduced slightly
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)", // slightly less visible border
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
  },
  clearButton: {
    padding: 10,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default UserHeader;
