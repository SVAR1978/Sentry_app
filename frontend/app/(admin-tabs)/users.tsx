import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Avatar, Card, Chip, FAB, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#21100B",
  secondary: "#8C7D79",
  accent: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  background: "#F5F1EE",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  white: "#FFFFFF",
};

const USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "User",
    status: "active",
    avatar: "https://avatar.iran.liara.run/public/1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    avatar: "https://avatar.iran.liara.run/public/2",
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "User",
    status: "inactive",
    avatar: "https://avatar.iran.liara.run/public/3",
  },
  {
    id: "4",
    name: "Sarah Connor",
    email: "sarah@example.com",
    role: "User",
    status: "active",
    avatar: "https://avatar.iran.liara.run/public/4",
  },
  {
    id: "5",
    name: "Tom Hardy",
    email: "tom@example.com",
    role: "Admin",
    status: "active",
    avatar: "https://avatar.iran.liara.run/public/5",
  },
  {
    id: "6",
    name: "Emily Brown",
    email: "emily@example.com",
    role: "User",
    status: "pending",
    avatar: "https://avatar.iran.liara.run/public/6",
  },
];

const FILTERS = ["All", "Active", "Inactive", "Pending"];

export default function UsersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const insets = useSafeAreaInsets();

  const filteredUsers = USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "All" ||
      user.status.toLowerCase() === selectedFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return COLORS.success;
      case "inactive":
        return COLORS.error;
      case "pending":
        return COLORS.accent;
      default:
        return COLORS.textLight;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) }]}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>{USERS.length} total users</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search users..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {FILTERS.map((filter) => (
          <Chip
            key={filter}
            selected={selectedFilter === filter}
            onPress={() => setSelectedFilter(filter)}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.filterChipSelected,
            ]}
            textStyle={[
              styles.filterText,
              selectedFilter === filter && styles.filterTextSelected,
            ]}
          >
            {filter}
          </Chip>
        ))}
      </ScrollView>

      {/* User List */}
      <ScrollView style={styles.userList} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((user) => (
          <Card key={user.id} style={styles.userCard}>
            <Card.Content style={styles.userContent}>
              <Avatar.Image size={48} source={{ uri: user.avatar }} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <View style={styles.userMeta}>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{user.role}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(user.status) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(user.status) },
                    ]}
                  >
                    {user.status}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* FAB */}
      <FAB
        icon="account-plus"
        style={styles.fab}
        color={COLORS.white}
        onPress={() => console.log("Add user")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    borderRadius: 16,
    elevation: 2,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    fontSize: 14,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    marginRight: 8,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textLight,
    fontSize: 13,
  },
  filterTextSelected: {
    color: COLORS.white,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
  },
  userContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  roleTag: {
    backgroundColor: `${COLORS.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.primary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  moreButton: {
    padding: 8,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: COLORS.primary,
  },
});
