import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/userHomeData";

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

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
      <View style={styles.headerBackground} />
      {/* Top Row: Greeting + Avatar */}
      <View style={styles.headerTop}>
        <View style={styles.leftSection}>
          <Text style={styles.userName}>{user?.name || "Explore India"}</Text>
        </View>
        <View style={styles.avatarContainer}>
          <Avatar.Image
            size={46}
            source={{
              uri: user?.avatar || "https://avatar.iran.liara.run/public/3",
            }}
            style={styles.avatar}
          />
          <View style={styles.onlineDot} />
        </View>
      </View>

      {/* Location Row */}
      <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
        <MaterialCommunityIcons
          name="map-marker"
          size={16}
          color="#21100B"
        />
        <Text style={styles.locationText}>India • All Destinations</Text>
        <MaterialCommunityIcons
          name="chevron-down"
          size={16}
          color={COLORS.textMuted}
        />
      </TouchableOpacity>

      {/* Big Title */}
      <Text style={styles.headerTitle}>Where would you{"\n"}like to go?</Text>

      {/* Premium Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#4A4341"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations, attractions..."
            placeholderTextColor="#8C7D79"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#8C7D79"
              />
            </TouchableOpacity>
          )}
          <View style={styles.filterButton}>
            <MaterialCommunityIcons
              name="tune-variant"
              size={18}
              color="#21100B"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    backgroundColor: "#F5F1EE",
  },
  headerBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F5F1EE",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1A1818",
    marginTop: 2,
    letterSpacing: -0.3,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    borderWidth: 2,
    borderColor: "#21100B",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#F5F1EE",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 20,
  },
  locationText: {
    fontSize: 13,
    color: "#4A4341",
    fontWeight: "600",
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#21100B",
    lineHeight: 38,
    letterSpacing: -0.8,
    marginBottom: 20,
  },
  searchBarWrapper: {
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
    gap: 10,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1818",
    fontWeight: "500",
  },
  clearButton: {
    padding: 2,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default UserHeader;
