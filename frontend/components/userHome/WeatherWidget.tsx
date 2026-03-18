import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { COLORS } from "../../constants/userHomeData";
import {
    getCachedWeather,
    WeatherData,
} from "../../services/api/weatherService";
import { getCurrentLocation } from "../../services/maps/locationService";

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
      console.error("Error fetching weather:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const getIconColor = (icon: string) => {
    if (icon.includes("sunny")) return "#F59E0B";
    if (icon.includes("cloudy")) return "#6B7280";
    if (icon.includes("rainy") || icon.includes("lightning")) return "#3B82F6";
    if (icon.includes("snowy")) return "#60A5FA";
    return "#F59E0B";
  };

  if (loading) {
    return (
      <View style={styles.section}>
        <Card style={styles.weatherCard}>
          <Card.Content style={styles.weatherContent}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading weather...</Text>
          </Card.Content>
        </Card>
      </View>
    );
  }

  if (error || !weather) {
    return (
      <View style={styles.section}>
        <Card style={styles.weatherCard}>
          <Card.Content style={styles.weatherContent}>
            <MaterialCommunityIcons
              name="weather-cloudy-alert"
              size={48}
              color="#6B7280"
            />
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Weather unavailable</Text>
              <TouchableOpacity onPress={fetchWeather}>
                <Text style={styles.retryText}>Tap to retry</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Card style={styles.weatherCard}>
        <Card.Content style={styles.weatherContent}>
          <View style={styles.weatherLeft}>
            <MaterialCommunityIcons
              name={weather.icon as any}
              size={48}
              color={getIconColor(weather.icon)}
            />
            <View style={styles.weatherInfo}>
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
              <Text style={styles.weatherCondition}>{weather.condition}</Text>
            </View>
          </View>
          <View style={styles.weatherRight}>
            <Text style={styles.locationName} numberOfLines={1}>
              {weather.city}
            </Text>
            <Text style={styles.weatherAdvice} numberOfLines={2}>
              {weather.description}
            </Text>
            <TouchableOpacity
              onPress={fetchWeather}
              style={styles.refreshButton}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={14}
                color={COLORS.textLight}
              />
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  weatherCard: {
    borderRadius: 20,
    elevation: 2,
    marginBottom: 20,
  },
  weatherContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
  },
  weatherLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  weatherInfo: {
    marginLeft: 12,
  },
  temperature: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
  },
  weatherCondition: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  weatherRight: {
    alignItems: "flex-end",
    flex: 1,
    marginLeft: 8,
  },
  locationName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  weatherAdvice: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    textAlign: "right",
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.textLight,
  },
  errorContainer: {
    marginLeft: 12,
    alignItems: "flex-start",
  },
  errorText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  retryText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  refreshText: {
    fontSize: 11,
    color: COLORS.textLight,
  },
});

export default WeatherWidget;
