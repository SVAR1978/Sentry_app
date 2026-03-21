import { BlurView } from "expo-blur";
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
            const parts = address.split(", ");
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
    <View style={[styles.headerWrapper, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.headerContent}>
        {/* Top Row: Greeting + Avatar */}
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.userName}>{user?.name || "Explorer"}</Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color={COLORS.gold} strokeWidth={2.5} />
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
                    { backgroundColor: "rgba(207, 176, 132, 0.25)" },
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
          <Text style={[styles.headerTitle, { color: COLORS.gold }]}>
            adventure
          </Text>
        </View>

        {/* Glassmorphism Search Bar */}
        <View style={styles.searchBarWrapper}>
          <BlurView intensity={40} tint="light" style={styles.searchBlur}>
            <View style={styles.searchBar}>
              <Search
                size={20}
                color={COLORS.gold}
                strokeWidth={2.5}
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search destinations..."
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearButton}
                >
                  <CircleX size={18} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
                <SlidersHorizontal
                  size={18}
                  color={COLORS.primary}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    paddingBottom: 40,
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greetingContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 5,
  },
  locationNameText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "700",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarBorder: {
    padding: 3,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.glassBorder,
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
    borderWidth: 2.5,
    borderColor: COLORS.gradientMid,
  },
  heroSection: {
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.white,
    lineHeight: 40,
    letterSpacing: -1,
  },
  searchBarWrapper: {
    marginTop: 8,
  },
  searchBlur: {
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 64,
  },
  searchIcon: {
    marginLeft: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: "600",
  },
  clearButton: {
    padding: 10,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.gold,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
});

export default UserHeader;
