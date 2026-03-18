import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Avatar, Searchbar, Text } from "react-native-paper";
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
}) => (
  <LinearGradient
    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
    style={styles.header}
  >
    <View style={styles.headerTop}>
      <View style={styles.userInfo}>
        
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hello, Traveler! 👋</Text>
        </View>
      </View>
    </View>
    <Text style={styles.headerTitle}>Where would you like to go?</Text>
    <Searchbar
      placeholder="Search destinations, attractions..."
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={styles.searchBar}
      inputStyle={styles.searchInput}
      iconColor={COLORS.textLight}
    />
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 16,
  },
  searchBar: {
    borderRadius: 16,
    elevation: 0,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    fontSize: 14,
  },
});

export default UserHeader;
