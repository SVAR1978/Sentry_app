import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
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

const CATEGORY_COLORS: Record<string, string> = {
  Heritage: "#FF385C",
  Monument: "#4F8EF7",
  Religious: "#8B5CF6",
  Market: "#F59E0B",
  Museum: "#62DCA3",
  Nature: "#10B981",
};

const FeaturedDestinations: React.FC<FeaturedDestinationsProps> = ({
  destinations,
}) => {
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const { t } = useTranslation('common');

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>{t('featuredDestinations')}</Text>
          <Text style={styles.sectionSubtitle}>{t('exploreIndiasWonders')}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>{t('seeAll')}</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={14}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationsScroll}
      >
        {destinations.map((dest) => {
          const catColor = CATEGORY_COLORS[dest.category] || COLORS.primary;
          const isSaved = savedIds[dest.id];

          return (
            <TouchableOpacity
              key={dest.id}
              style={styles.destinationCard}
              activeOpacity={0.92}
            >
              <Image
                source={{ uri: dest.image }}
                style={styles.destinationImage}
              />
              <LinearGradient
                colors={["transparent", "rgba(11, 19, 38, 0.75)", "rgba(11, 19, 38, 0.96)"]}
                locations={[0.3, 0.65, 1]}
                style={styles.destinationOverlay}
              >
                {/* Info at bottom */}
                <View style={styles.destinationInfo}>
                  <View style={[styles.categoryBadge, { backgroundColor: `${catColor}CC` }]}>
                    <Text style={styles.categoryText}>{dest.category}</Text>
                  </View>
                  <Text style={styles.destinationName} numberOfLines={1}>{dest.name}</Text>
                  <View style={styles.destinationMeta}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={12}
                      color="rgba(218,226,253,0.7)"
                    />
                    <Text style={styles.destinationLocation}>{dest.location}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <MaterialCommunityIcons name="star" size={13} color="#FFD700" />
                    <Text style={styles.rating}>{dest.rating}</Text>
                  </View>
                </View>
              </LinearGradient>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => toggleSaved(dest.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <MaterialCommunityIcons
                  name={isSaved ? "heart" : "heart-outline"}
                  size={18}
                  color={isSaved ? "#FF385C" : COLORS.white}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    marginTop: 2,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.primary,
  },
  destinationsScroll: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  destinationCard: {
    width: 200,
    height: 280,
    borderRadius: 20,
    marginRight: 14,
    overflow: "hidden",
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  destinationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    justifyContent: "flex-end",
    padding: 16,
  },
  destinationInfo: {
    gap: 4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 50,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  destinationName: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.2,
  },
  destinationMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  destinationLocation: {
    fontSize: 12,
    color: "rgba(218, 226, 253, 0.7)",
    fontWeight: "500",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  rating: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.white,
  },
  saveButton: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(11, 19, 38, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
});

export default FeaturedDestinations;
