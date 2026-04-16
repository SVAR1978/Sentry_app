import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/userHomeData";
import {
  getCurrentLocation,
  reverseGeocode,
} from "../../services/maps/locationService";

interface UserHeaderProps {
  user: any;
}



const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');
  const [locationName, setLocationName] = useState(t('locating'));

  useEffect(() => {
    const fetchLocationAndRisk = async () => {
      try {
        const coords = await getCurrentLocation();
        if (coords) {
          // 1. Resolve Display Address
          const address = await reverseGeocode(coords);
          if (address) {
            const parts = address.split(", ");
            const displayCity =
              parts.length >= 3
                ? `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
                : address;
            setLocationName(displayCity);
          } else {
            setLocationName(t('locationFound'));
          }

        } else {
          setLocationName(t('india'));
        }
      } catch (error) {
        setLocationName(t('exploreIndia'));
      }
    };

    fetchLocationAndRisk();
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
              <Text style={styles.userName}>{user?.name || t('explorer')}</Text>
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
            <Text style={styles.headerTitle}>{t('findNextSafe')}</Text>
            <Text style={[styles.headerTitle, { color: COLORS.secondary }]}>
              {t('adventure')}
            </Text>

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
    paddingBottom: 24, 
  },
  headerContent: {
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.white,
    lineHeight: 38,
    letterSpacing: -1,
  },
});

export default UserHeader;
