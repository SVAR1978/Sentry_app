import * as LucideIcons from "lucide-react-native";
import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { COLORS } from "../../constants/userHomeData";
import {
  getCachedWeather,
  WeatherData,
} from "../../services/api/weatherService";
import { getCurrentLocation } from "../../services/maps/locationService";

const getIconColor = (icon: string) => {
  if (icon.includes("Sun")) return "#F5B041";
  if (icon.includes("Cloud") && !icon.includes("Rain") && !icon.includes("Bolt")) return COLORS.silver;
  if (icon.includes("Rain") || icon.includes("Bolt")) return "#5DADE2";
  if (icon.includes("Snowflake")) return "#85C1E9";
  return "#F5B041";
};

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(false);
      const location = await getCurrentLocation();
      if (!location) {
        setError(true);
        setLoading(false);
        return;
      }
      const weatherData = await getCachedWeather(location);
      setWeather(weatherData);
      setLoading(false);
    } catch (err) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <View style={styles.section}>
        <BlurView intensity={30} tint="light" style={styles.weatherCard}>
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={COLORS.gold} />
            <Text style={styles.loadingText}>Loading weather...</Text>
          </View>
        </BlurView>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.section}>
        <BlurView intensity={30} tint="light" style={styles.weatherCard}>
          <View style={styles.errorRow}>
            <LucideIcons.CloudAlert size={36} color={COLORS.silver} strokeWidth={2} />
            <View style={styles.errorInfo}>
              <Text style={styles.errorText}>Weather unavailable</Text>
              <TouchableOpacity onPress={fetchWeather}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </View>
    );
  }

  const iconColor = getIconColor(weather.icon);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Current Weather</Text>
        <TouchableOpacity onPress={fetchWeather} style={styles.refreshBtn}>
          <LucideIcons.RefreshCw size={14} color="rgba(255,255,255,0.5)" strokeWidth={2.5} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <BlurView intensity={30} tint="light" style={styles.weatherCard}>
        <View style={styles.cardContent}>
          {/* Left: Temp + Icon */}
          <View style={styles.weatherLeft}>
            <View style={[styles.weatherIconBg, { backgroundColor: `${iconColor}25` }]}>
              {(() => {
                const Icon = (LucideIcons as any)[weather.icon] || LucideIcons.Cloud;
                return <Icon size={36} color={iconColor} strokeWidth={2} />;
              })()}
            </View>
            <View style={styles.tempInfo}>
              <Text style={styles.temperature}>{weather.temperature}°</Text>
              <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Right: Location + Advice */}
          <View style={styles.weatherRight}>
            <View style={styles.locationRow}>
              <LucideIcons.MapPin size={13} color={COLORS.gold} strokeWidth={2.5} />
              <Text style={styles.locationName} numberOfLines={1}>
                {weather.city}
              </Text>
            </View>
            <Text style={styles.weatherAdvice} numberOfLines={2}>
              {weather.description}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  refreshBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  refreshText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
  },
  weatherCard: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: COLORS.glassBorder,
  },
  cardContent: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  loadingRow: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  weatherIconBg: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  tempInfo: {
    gap: 2,
  },
  temperature: {
    fontSize: 34,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -1,
  },
  weatherCondition: {
    fontSize: 13,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.glassBorder,
  },
  weatherRight: {
    flex: 1,
    gap: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.white,
    flex: 1,
  },
  weatherAdvice: {
    fontSize: 12,
    color: "rgba(255,255,255,0.50)",
    lineHeight: 17,
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  errorRow: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  errorInfo: {},
  errorText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "600",
  },
  retryText: {
    fontSize: 12,
    color: COLORS.gold,
    marginTop: 4,
    textDecorationLine: "underline",
    fontWeight: "700",
  },
});

export default WeatherWidget;
