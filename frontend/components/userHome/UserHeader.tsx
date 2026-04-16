import { LinearGradient } from "expo-linear-gradient";
import { MapPin, ShieldAlert, ShieldCheck, Shield } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/userHomeData";
import {
  getCurrentLocation,
  reverseGeocode,
} from "../../services/maps/locationService";
import { getAreaId } from "../../services/risk/areaLookup";
import { resolveAreaFromLocation } from "../../services/risk/areaResolver";
import { fetchAreaBaseScore } from "../../services/api/riskService";

interface UserHeaderProps {
  user: any;
}

export interface LocationRiskResult {
  risk_level: "Safe" | "Low" | "Medium" | "High";
  final_score: number;
  area_id: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');
  const [locationName, setLocationName] = useState(t('locating'));
  const [currentRisk, setCurrentRisk] = useState<LocationRiskResult | null>(null);
  const [isLoadingRisk, setIsLoadingRisk] = useState(true);

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

          // 2. Resolve Area ID for Risk Model
          try {
            let areaId = await getAreaId(coords.latitude, coords.longitude);
            if (!areaId) {
              areaId = await resolveAreaFromLocation(coords.latitude, coords.longitude);
            }
            // 3. Fetch Base Risk Score
            if (areaId) {
              const baseRisk = await fetchAreaBaseScore(areaId);
              if (baseRisk) {
                const finalScore = baseRisk.final_score ?? baseRisk.base_score;
                const riskLevel = finalScore > 55 ? "High" : finalScore > 30 ? "Medium" : "Safe";
                setCurrentRisk({
                  risk_level: riskLevel,
                  final_score: Math.round(finalScore),
                  area_id: baseRisk.area_id
                });
              }
            }
          } catch (riskError) {
            console.warn("[UserHeader] Error fetching risk score:", riskError);
          }
        } else {
          setLocationName(t('india'));
        }
      } catch (error) {
        setLocationName(t('exploreIndia'));
      } finally {
        setIsLoadingRisk(false);
      }
    };

    fetchLocationAndRisk();
  }, []);

  const getRiskTheme = (level: string) => {
    switch (level) {
      case "High":
        return { bg: "#FEF2F2", text: "#991B1B", border: "#F87171", Icon: ShieldAlert };
      case "Medium":
        return { bg: "#FFFBEB", text: "#92400E", border: "#FBBF24", Icon: Shield };
      default:
        return { bg: "#ECFDF5", text: "#065F46", border: "#34D399", Icon: ShieldCheck };
    }
  };

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

          {/* Hero Section & Risk Score */}
          <View style={styles.heroSection}>
            <Text style={styles.headerTitle}>{t('findNextSafe')}</Text>
            <Text style={[styles.headerTitle, { color: COLORS.secondary }]}>
              {t('adventure')}
            </Text>
            
            <View style={styles.riskCardWrapper}>
              {isLoadingRisk ? (
                 <View style={styles.riskLoading}>
                   <ActivityIndicator size="small" color={COLORS.white} />
                   <Text style={styles.loadingText}>{t('analyzingRegionalSafety')}</Text>
                 </View>
              ) : currentRisk ? (
                <View style={[styles.riskCard, { backgroundColor: getRiskTheme(currentRisk.risk_level).bg, borderColor: getRiskTheme(currentRisk.risk_level).border }]}>
                  <View style={styles.riskRow}>
                    {React.createElement(getRiskTheme(currentRisk.risk_level).Icon, {
                      size: 24,
                      color: getRiskTheme(currentRisk.risk_level).text,
                      strokeWidth: 2.5
                    })}
                    <View style={styles.riskInfo}>
                      <Text style={[styles.riskLevelText, { color: getRiskTheme(currentRisk.risk_level).text }]}>
                        {t('riskZone', { level: currentRisk.risk_level })}
                      </Text>
                      <Text style={[styles.riskDetailsText, { color: getRiskTheme(currentRisk.risk_level).text }]}>
                        {t('scoreLabel', { score: currentRisk.final_score, area: currentRisk.area_id })}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
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
  riskCardWrapper: {
    marginTop: 20,
    minHeight: 64,
    justifyContent: "center",
  },
  riskLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  loadingText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  riskCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  riskRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  riskInfo: {
    flex: 1,
    justifyContent: "center",
  },
  riskLevelText: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  riskDetailsText: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
    marginTop: 2,
  },
});

export default UserHeader;
