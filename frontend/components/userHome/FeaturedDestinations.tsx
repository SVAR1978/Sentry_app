import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "react-native-paper";
import { COLORS } from "../../constants/userHomeData";

interface Destination {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  category: string;
}

interface FeaturedDestinationsProps {
  destinations: Destination[];
}

const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({
  destinations,
}) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Featured Destinations</Text>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.destinationsScroll}
    >
      {destinations.map((dest) => (
        <TouchableOpacity key={dest.id} style={styles.destinationCard}>
          <Image source={{ uri: dest.image }} style={styles.destinationImage} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.destinationOverlay}
          >
            <View style={styles.destinationCategory}>
              <Text style={styles.categoryText}>{dest.category}</Text>
            </View>
            <View style={styles.destinationInfo}>
              <Text style={styles.destinationName}>{dest.name}</Text>
              <View style={styles.destinationMeta}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={14}
                  color={COLORS.white}
                />
                <Text style={styles.destinationLocation}>{dest.location}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{dest.rating}</Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  destinationsScroll: {
    paddingRight: 20,
  },
  destinationCard: {
    width: 200,
    height: 260,
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  destinationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 16,
  },
  destinationCategory: {
    position: "absolute",
    top: -80,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.white,
  },
  destinationInfo: {
    gap: 4,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  destinationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  destinationLocation: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
});

export default FeaturedDestinations;
