import * as Location from "expo-location";
import { useSocket } from "../../store/SocketContext";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Linking,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, {
    Marker,
    Polyline,
    PROVIDER_GOOGLE,
    Region,
} from "react-native-maps";
import { ActivityIndicator, FAB, Icon, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Map Components
import {
    DirectionsPanel,
    MapFilterBar,
  RiskZonePolygon,
    SearchOverlay,
    UserLocationMarker,
} from "../../components/map";

// Map Data
import {
    COLORS,
    DELHI_REGION,
  RiskZone,
} from "../../constants/mapData";

// Location Services
import {
  calculateDistance,
    formatDistance,
    LocationCoordinate,
} from "../../services/maps/locationService";

// Places & Directions
import {
    getDirections,
    RouteInfo,
    searchNearbyPlaces,
    SearchResult,
    testPhotonConnection, 
    testOSRMConnection 
} from "../../services/maps/placesService";

// Navigation Service
import {
    createNavigationManager,
    NavigationManager,
    NavigationState,
} from "../../services/maps/navigationService";
import { getCachedWeather } from "../../services/api/weatherService";
import {
  fetchAllAreaBaseScores,
  fetchAreaBaseScore,
  fetchRiskByLocation,
  toMapRiskLevel,
} from "../../services/api/riskService";
import {
  getAreaBoundaryPolygons,
  getAreaId,
  getPoliceStationLocations,
  normalizeAreaId,
} from "../../services/risk/areaLookup";
import type { PoliceStationLocation } from "../../services/risk/areaLookup";
import {
  applyMultipliers,
  AppliedRiskResult,
} from "../../services/risk/riskMultipliers";

const SCREEN_WIDTH = Dimensions.get("window").width;
const RISK_REFRESH_INTERVAL_MS = 60_000;
const RISK_REFRESH_DISTANCE_METERS = 120;

interface LocationRiskResult extends AppliedRiskResult {
  area_id: string;
  base_category: string;
}

interface PoliceStationMarker extends PoliceStationLocation {
  coordinate: LocationCoordinate;
}

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { sendLocation, onRiskAlert } = useSocket();
  // Get route params (from QuickActions)
  const params = useLocalSearchParams<{ filter?: string }>();

  // Map ref
  const mapRef = useRef<MapView>(null);

  // Region & zoom
  const [region, setRegion] = useState<Region>(DELHI_REGION);
  const [zoomLevel, setZoomLevel] = useState(12);

  // ── Real-time location (expo-location, NOT hardcoded) ──
  const [userLocation, setUserLocation] = useState<LocationCoordinate | null>(
    null,
  );
  const [heading, setHeading] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationCoordinate[]>(
    [],
  );
  const [currentAddress, setCurrentAddress] = useState("Detecting location...");
  const [isTracking, setIsTracking] = useState(false);
  const locationSubRef = useRef<Location.LocationSubscription | null>(null);

  // ── Filters ──
  const [selectedFilter, setSelectedFilter] = useState("all");
  const shouldShowPoliceStations = selectedFilter === "all" || selectedFilter === "police";
  const [showRiskZones, setShowRiskZones] = useState(false);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [loadingRiskZones, setLoadingRiskZones] = useState(false);
  const [policeStations, setPoliceStations] = useState<PoliceStationMarker[]>([]);
  const [loadingPoliceStations, setLoadingPoliceStations] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<LocationRiskResult | null>(null);
  const lastRiskRefreshRef = useRef<{
    location: LocationCoordinate;
    timestamp: number;
  } | null>(null);
  const riskRequestIdRef = useRef(0);

  // ── Directions ──
  const [selectedPlace, setSelectedPlace] = useState<SearchResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [travelMode, setTravelMode] = useState<
    "driving" | "walking" | "cycling"
  >("driving");

  // ── Live Navigation ──
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationState, setNavigationState] = useState<NavigationState | null>(null);
  const navigationManagerRef = useRef<NavigationManager | null>(null);

  // ── Panic state ──
  const [isPanic, setIsPanic] = useState(false);

  // ── UI state ──
  const [isLoading, setIsLoading] = useState(true);
  const [showNearbyPanel, setShowNearbyPanel] = useState(true);
  const [followUser, setFollowUser] = useState(true);
  const nearbyPanelAnim = useRef(new Animated.Value(1)).current;

  // ── Nearby places (fetched from API based on real location) ──
  const [nearbyPlaces, setNearbyPlaces] = useState<
    Array<SearchResult & { distanceValue: number }>
  >([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  // ===================================================================
  // 1A. WEBSOCKET RISK ALERTS
  // ===================================================================
  useEffect(() => {
    const unsub = onRiskAlert((data) => {
      const score = data.payload.score;
      if (typeof score === "number") {
        const level = score > 55 ? "High" : score > 30 ? "Medium" : "Low";
        
        Alert.alert("Risk Status Updated", data.payload.message, [{ text: "OK" }]);

        setCurrentRisk(prev => {
          if (!prev) return null;
          return {
            ...prev,
            final_score: score,
            risk_level: level as "Low" | "Medium" | "High",
          };
        });
      }
    });
    return unsub;
  }, [onRiskAlert]);

  // ===================================================================
  // 1B. REAL LOCATION TRACKING (smooth, like Google Maps)
  // ===================================================================
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;

    const boot = async () => {
      setIsLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Required",
          "Please enable location services to use the map.",
          [
            { text: "Open Settings", onPress: () => Linking.openSettings() },
            { text: "Cancel" },
          ],
        );
        setIsLoading(false);
        return;
      }

      // Get initial position fast
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const initial: LocationCoordinate = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setUserLocation(initial);
      setHeading(loc.coords.heading);
      setAccuracy(loc.coords.accuracy);
      setLocationHistory([initial]);
      setIsLoading(false);

      
      testPhotonConnection();
      testOSRMConnection();

      // Center map on real position
      mapRef.current?.animateToRegion(
        { ...initial, latitudeDelta: 0.015, longitudeDelta: 0.015 },
        600,
      );

      // Reverse geocode
      try {
        const [addr] = await Location.reverseGeocodeAsync(initial);
        if (addr) {
          setCurrentAddress(
            [addr.name, addr.street, addr.city].filter(Boolean).join(", "),
          );
        }
      } catch {}



      // ── Continuous watch (high accuracy, small intervals) ──
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 3, // update every 3 m moved
          timeInterval: 2000, // or every 2 s
        },
        (update) => {
          const coord: LocationCoordinate = {
            latitude: update.coords.latitude,
            longitude: update.coords.longitude,
          };
          setUserLocation(coord);
          setHeading(update.coords.heading);
          setAccuracy(update.coords.accuracy);
          setSpeed(update.coords.speed);

          // ── Send location to WebSocket backend ──
          getAreaId(update.coords.latitude, update.coords.longitude).then((areaId) => {
            if (areaId) {
              sendLocation({
                latitude: update.coords.latitude,
                longitude: update.coords.longitude,
                accuracy: update.coords.accuracy,
                speed: update.coords.speed,
                heading: update.coords.heading,
                source: "GPS",
                areaId: areaId || undefined,
              });
            } else {
              import("../../services/risk/areaResolver").then(({ resolveAreaFromLocation }) => {
                resolveAreaFromLocation(update.coords.latitude, update.coords.longitude).then((newAreaId) => {
                  sendLocation({
                    latitude: update.coords.latitude,
                    longitude: update.coords.longitude,
                    accuracy: update.coords.accuracy,
                    speed: update.coords.speed,
                    heading: update.coords.heading,
                    source: "GPS",
                    areaId: newAreaId || undefined,
                  });
                });
              });
            }
          });

          // Append to breadcrumb trail
          setLocationHistory((prev) => {
            const last = prev[prev.length - 1];
            if (
              !last ||
              Math.abs(last.latitude - coord.latitude) > 0.000005 ||
              Math.abs(last.longitude - coord.longitude) > 0.000005
            ) {
              return [...prev.slice(-200), coord];
            }
            return prev;
          });

          // Update navigation state if navigating
          if (isNavigating && navigationManagerRef.current) {
            const navState = navigationManagerRef.current.getNavigationState(coord);
            setNavigationState(navState);

            // Handle rerouting if needed
            if (navState.shouldReroute && selectedPlace) {
              console.log('User off route, rerouting...');
              // Trigger reroute
              getDirections(coord, selectedPlace.coordinate, travelMode)
                .then((newRoute) => {
                  if (newRoute) {
                    setRouteInfo(newRoute);
                    navigationManagerRef.current = createNavigationManager(newRoute, travelMode);
                    Alert.alert('Rerouting', 'Calculating new route to destination');
                  }
                })
                .catch((err) => console.error('Reroute failed:', err));
            }
          }

          // Follow user if enabled
          setFollowUser((follow) => {
            if (follow) {
              mapRef.current?.animateToRegion(
                {
                  ...coord,
                  latitudeDelta: 0.008,
                  longitudeDelta: 0.008,
                },
                400,
              );
            }
            return follow;
          });

        },
      );

      locationSubRef.current = sub;
      setIsTracking(true);
    };

    boot();

    return () => {
      sub?.remove();
      locationSubRef.current?.remove();
    };
  }, []);

  const lastSearchLocation = useRef<{
    latitude: number;
    longitude: number;
    filter: string;
  } | null>(null);

  // ===================================================================
  // 1B. FETCH NEARBY PLACES - Dynamic API Call with Throttling
  // ===================================================================
  useEffect(() => {
    // Check if coming from QuickActions and set initial filter once
    if (params.filter && selectedFilter === "all") {
      setSelectedFilter(params.filter as string);
    }
  }, [params.filter]);

  useEffect(() => {
    if (!userLocation) return;
    
    // THROTTLE: Only search if moved > 500m or if filter changed
    if (lastSearchLocation.current) {
      const dx = (userLocation.latitude - lastSearchLocation.current.latitude) * 111000;
      const dy = (userLocation.longitude - lastSearchLocation.current.longitude) * 111000;
      const distanceMoved = Math.sqrt(dx*dx + dy*dy);
      
      // If we haven't moved far enough and the filter hasn't changed, don't search
      // Note: selectedFilter change will still trigger this useEffect
      if (distanceMoved < 500 && lastSearchLocation.current.filter === selectedFilter) {
        return;
      }
    }

    let cancelled = false;
    const fetchNearby = async () => {
      setLoadingNearby(true);
      try {
        const filterTypeMap: Record<string, string[]> = {
          hospital: ["hospital"],
          police: ["police"],
          attraction: ["tourism", "attraction"],
          restaurant: ["restaurant", "fast_food", "cafe"],
          hotel: ["hotel", "motel", "hostel"],
          all: ["hospital", "police", "tourism", "restaurant", "hotel"],
        };

        const searchTypes = filterTypeMap[selectedFilter] || filterTypeMap["all"];
        const places = await searchNearbyPlaces(
          userLocation,
          2000,
          searchTypes,
        );

        if (!cancelled) {
          const withDistance = places.map((p) => {
            const dx = (p.coordinate.latitude - userLocation.latitude) * 111_000;
            const dy = (p.coordinate.longitude - userLocation.longitude) * 111_000 * Math.cos((userLocation.latitude * Math.PI) / 180);
            return { ...p, distanceValue: Math.sqrt(dx * dx + dy * dy) };
          });
          
          withDistance.sort((a, b) => a.distanceValue - b.distanceValue);
          setNearbyPlaces(withDistance.slice(0, 5));
          
          // Store this location as the last searched location
          lastSearchLocation.current = { ...userLocation, filter: selectedFilter };
        }
      } catch (error) {
        if (!cancelled) setNearbyPlaces([]);
      } finally {
        if (!cancelled) setLoadingNearby(false);
      }
    };

    fetchNearby();
    return () => { cancelled = true; };
  }, [userLocation, selectedFilter]);

  // ===================================================================
  // 1C. LOAD ALL POLICE STATION POINTS FROM AWS LOCATION GEOJSON
  // ===================================================================
  useEffect(() => {
    if (!shouldShowPoliceStations || policeStations.length > 0 || loadingPoliceStations) {
      return;
    }

    let cancelled = false;

    const loadPoliceStations = async () => {
      setLoadingPoliceStations(true);
      try {
        const stations = await getPoliceStationLocations();

        if (!cancelled) {
          setPoliceStations(
            stations.map((station) => ({
              ...station,
              coordinate: {
                latitude: station.latitude,
                longitude: station.longitude,
              },
            }))
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("[MapScreen] Unable to load police station locations:", error);
        }
      } finally {
        if (!cancelled) {
          setLoadingPoliceStations(false);
        }
      }
    };

    loadPoliceStations();

    return () => {
      cancelled = true;
    };
  }, [shouldShowPoliceStations, policeStations.length, loadingPoliceStations]);

  // ===================================================================
  // 1D. FETCH AND DRAW AREA RISK ZONES
  // ===================================================================
  useEffect(() => {
    if (!showRiskZones || riskZones.length > 0 || loadingRiskZones) {
      return;
    }

    let cancelled = false;

    const loadRiskZones = async () => {
      setLoadingRiskZones(true);
      try {
        const [areaScores] = await Promise.all([fetchAllAreaBaseScores()]);

        const scoreByArea = new Map(
          areaScores.areas.map((area) => [normalizeAreaId(area.area_id), area])
        );

        const zonePolygons = await getAreaBoundaryPolygons();
        const mappedZones: RiskZone[] = zonePolygons.map((polygon) => {
          const areaScore = scoreByArea.get(normalizeAreaId(polygon.areaId));
          const riskCategory = areaScore?.risk_category ?? "Low";

          return {
            id: polygon.id,
            name: polygon.areaId,
            level: toMapRiskLevel(riskCategory),
            coordinates: polygon.coordinates,
            description: areaScore
              ? `Base score ${Math.round(areaScore.base_score)} (${riskCategory})`
              : "Base score unavailable",
          };
        });

        if (!cancelled) {
          setRiskZones(mappedZones);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("[MapScreen] Unable to load risk zones:", error);
        }
      } finally {
        if (!cancelled) {
          setLoadingRiskZones(false);
        }
      }
    };

    loadRiskZones();

    return () => {
      cancelled = true;
    };
  }, [showRiskZones, riskZones.length, loadingRiskZones]);

  // ===================================================================
  // 1E. CURRENT LOCATION RISK = BASE SCORE + CLIENT MULTIPLIERS
  // ===================================================================
  useEffect(() => {
    if (!userLocation) return;

    const lastRefresh = lastRiskRefreshRef.current;
    const now = Date.now();
    if (lastRefresh) {
      const movedMeters = calculateDistance(userLocation, lastRefresh.location);
      if (
        movedMeters < RISK_REFRESH_DISTANCE_METERS &&
        now - lastRefresh.timestamp < RISK_REFRESH_INTERVAL_MS
      ) {
        return;
      }
    }

    let cancelled = false;
    const requestId = ++riskRequestIdRef.current;

    const refreshCurrentRisk = async () => {
      try {
        const areaId = await getAreaId(userLocation.latitude, userLocation.longitude);

        let baseRisk;
        if (areaId) {
          baseRisk = await fetchAreaBaseScore(
            areaId,
            userLocation.latitude,
            userLocation.longitude
          );
        } else {
          // Fallback to nominatim reverse-geocoding if polygon lookup failed (e.g. missing GeoJSON)
          baseRisk = await fetchRiskByLocation(userLocation.latitude, userLocation.longitude);
        }

        if (!baseRisk) {
          if (!cancelled && requestId === riskRequestIdRef.current) {
            setCurrentRisk(null);
            lastRiskRefreshRef.current = {
              location: userLocation,
              timestamp: Date.now(),
            };
          }
          return;
        }

        const finalScore = baseRisk.final_score ?? baseRisk.base_score;
        const riskLevel = finalScore > 55 ? "High" : finalScore > 30 ? "Medium" : "Low";

        if (!cancelled && requestId === riskRequestIdRef.current) {
          setCurrentRisk({
            base_score: baseRisk.base_score,
            final_score: finalScore,
            risk_level: riskLevel as "Low" | "Medium" | "High",
            breakdown: baseRisk.breakdown || {
              time: 0, weather: 0, aqi: 0, festival: 0, weekend: 0, season: 0
            },
            area_id: baseRisk.area_id,
            base_category: baseRisk.risk_category,
          });
          lastRiskRefreshRef.current = {
            location: userLocation,
            timestamp: Date.now(),
          };
        }
      } catch (error) {
        if (!cancelled && requestId === riskRequestIdRef.current) {
          console.warn("[MapScreen] Failed to refresh current risk:", error);
        }
      }
    };

    refreshCurrentRisk();

    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  // ===================================================================
  // 2. DIRECTIONS – fetch route when destination is selected or initially
  // ===================================================================
  const initialUserLocationRef = useRef<LocationCoordinate | null>(null);
  
  // Store initial user location
  useEffect(() => {
    if (userLocation && !initialUserLocationRef.current) {
      initialUserLocationRef.current = userLocation;
    }
  }, [userLocation]);

  useEffect(() => {
    if (!selectedPlace || !userLocation) return;

    let cancelled = false;
    const fetchRoute = async () => {
      if (!userLocation || !selectedPlace) return; // double guard
      setLoadingRoute(true);
      const route = await getDirections(
        userLocation,          // ← your real current location
        selectedPlace.coordinate,
        travelMode,
      );
      if (!cancelled) {
        setRouteInfo(route);
        setLoadingRoute(false);

        if (route && mapRef.current) {
          mapRef.current.fitToCoordinates(route.coordinates, {
            edgePadding: { top: 120, right: 60, bottom: 400, left: 60 },
            animated: true,
          });
          setFollowUser(false);
        }
      }
    };

    fetchRoute();
    return () => {
      cancelled = true;
    };
  }, [selectedPlace]); // Only refetch when destination changes



  // ===================================================================
  // 3. SEARCH – place selected from SearchOverlay
  // ===================================================================
  const handlePlaceSelected = useCallback((place: SearchResult) => {
    setSelectedPlace(place);
    setShowNearbyPanel(false);
    Animated.timing(nearbyPanelAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Zoom to the destination first
    mapRef.current?.animateToRegion(
      {
        ...place.coordinate,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600,
    );
  }, []);

  const clearDirections = useCallback(() => {
    setSelectedPlace(null);
    setRouteInfo(null);
    setShowNearbyPanel(true);
    setFollowUser(true);
    
    // Stop navigation if active
    if (isNavigating) {
      setIsNavigating(false);
      setNavigationState(null);
      if (navigationManagerRef.current) {
        navigationManagerRef.current.cleanup();
        navigationManagerRef.current = null;
      }
    }
    
    Animated.timing(nearbyPanelAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (userLocation) {
      mapRef.current?.animateToRegion(
        { ...userLocation, latitudeDelta: 0.015, longitudeDelta: 0.015 },
        600,
      );
    }
  }, [userLocation, isNavigating]);


  // ===================================================================
  // 5. NOTE: nearbyPlaces is now fetched via API in useEffect above
  // (No longer using hardcoded POI_MARKERS)
  // ===================================================================

  // ===================================================================
  // CALLBACKS
  // ===================================================================
  const onRegionChangeComplete = useCallback((r: Region) => {
    setRegion(r);
    setZoomLevel(Math.round(Math.log(360 / r.longitudeDelta) / Math.LN2));
  }, []);

  const centerOnUser = useCallback(() => {
    if (!userLocation) return;
    setFollowUser(true);
    mapRef.current?.animateToRegion(
      { ...userLocation, latitudeDelta: 0.008, longitudeDelta: 0.008 },
      500,
    );
  }, [userLocation]);


  const togglePanic = useCallback(() => {
    setIsPanic((p) => {
      if (!p) {
        Alert.alert(
          "Panic Mode Activated",
          "Your location is being shared with emergency contacts.",
        );
      }
      return !p;
    });
  }, []);

  const toggleNearbyPanel = useCallback(() => {
    setShowNearbyPanel((prev) => {
      Animated.spring(nearbyPanelAnim, {
        toValue: prev ? 0 : 1,
        useNativeDriver: true,
      }).start();
      return !prev;
    });
  }, []);

  const handleChangeTravelMode = useCallback(
    async (mode: "driving" | "walking" | "cycling") => {
      setTravelMode(mode);
      
      // Refetch route with new travel mode if we have a destination
      if (selectedPlace && userLocation) {
        setLoadingRoute(true);
        const newRoute = await getDirections(
          userLocation,
          selectedPlace.coordinate,
          mode
        );
        
        if (newRoute) {
          setRouteInfo(newRoute);
          
          // If navigating, restart navigation with new route and mode
          if (isNavigating) {
            navigationManagerRef.current?.cleanup();
            navigationManagerRef.current = createNavigationManager(newRoute, mode);
            
            // Update navigation state immediately with new route
            const navState = navigationManagerRef.current.getNavigationState(userLocation);
            setNavigationState(navState);
          }
        }
        setLoadingRoute(false);
      }
    },
    [isNavigating, selectedPlace, userLocation],
  );

  // Handle starting live navigation
  const handleStartNavigation = useCallback(() => {
    if (!routeInfo || !userLocation) return;

    // Create navigation manager
    navigationManagerRef.current = createNavigationManager(routeInfo, travelMode);
    setIsNavigating(true);
    setFollowUser(true); // Auto-follow during navigation

    Alert.alert(
      'Navigation Started',
      `Follow the ${travelMode} directions. You'll receive turn-by-turn guidance.`,
      [{ text: 'OK' }]
    );
  }, [routeInfo, travelMode, userLocation]);

  // Handle stopping navigation
  const handleStopNavigation = useCallback(() => {
    setIsNavigating(false);
    setNavigationState(null);
    
    if (navigationManagerRef.current) {
      navigationManagerRef.current.cleanup();
      navigationManagerRef.current = null;
    }

    Alert.alert(
      'Navigation Stopped',
      'You can restart navigation anytime.',
      [{ text: 'OK' }]
    );
  }, []);

  // ===================================================================
  // RENDER
  // ===================================================================
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" translucent backgroundColor="transparent" />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  const showDirections = !!selectedPlace;
  const currentRiskTheme =
    currentRisk?.risk_level === "High"
      ? {
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          borderColor: "rgba(239, 68, 68, 0.4)",
          textColor: "#B91C1C",
        }
      : currentRisk?.risk_level === "Medium"
        ? {
            backgroundColor: "rgba(245, 158, 11, 0.18)",
            borderColor: "rgba(245, 158, 11, 0.45)",
            textColor: "#92400E",
          }
        : {
            backgroundColor: "rgba(16, 185, 129, 0.18)",
            borderColor: "rgba(16, 185, 129, 0.45)",
            textColor: "#065F46",
          };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={styles.mapContainer}>
        {/* ── MAP ── */}
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          initialRegion={
            userLocation
              ? { ...userLocation, latitudeDelta: 0.015, longitudeDelta: 0.015 }
              : DELHI_REGION
          }
          onRegionChangeComplete={onRegionChangeComplete}
          onPanDrag={() => setFollowUser(false)}
          showsCompass
          showsScale
          rotateEnabled
          pitchEnabled
          showsTraffic={showDirections}
          mapPadding={{
            top: 70,
            right: 0,
            bottom: showDirections ? 380 : showNearbyPanel ? 200 : 0,
            left: 0,
          }}
        >

          {/* Area risk zones from base score API */}
          {showRiskZones &&
            riskZones.map((zone) => (
              <RiskZonePolygon
                key={zone.id}
                zone={zone}
                onPress={(selectedZone) =>
                  Alert.alert(selectedZone.name, selectedZone.description)
                }
              />
            ))}

          {/* All police stations from AWS location GeoJSON */}
          {shouldShowPoliceStations &&
            policeStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={station.coordinate}
                title={station.name}
                description={
                  station.district
                    ? `District: ${station.district}`
                    : "Delhi Police Station"
                }
                pinColor="#2563EB"
              />
            ))}


          {/* Direction route polyline */}
          {routeInfo && (
            <Polyline
              coordinates={routeInfo.coordinates}
              strokeColor="#4285F4"
              strokeWidth={5}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Destination pin */}
          {selectedPlace && (
            <Marker
              coordinate={selectedPlace.coordinate}
              title={selectedPlace.name}
              pinColor="#EF4444"
            />
          )}

          {/* Breadcrumb trail */}
          {locationHistory.length > 1 && !showDirections && (
            <Polyline
              coordinates={locationHistory}
              strokeColor="#10B981"
              strokeWidth={3}
              lineCap="round"
              lineJoin="round"
            />
          )}



          {/* User's live location marker */}
          {userLocation && (
            <UserLocationMarker
              coordinate={userLocation}
              heading={heading}
              accuracy={accuracy}
              isPanic={isPanic}
            />
          )}
        </MapView>

        <View style={[styles.filterContainer, { top: insets.top + 8 }]}>
          <MapFilterBar
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            showRiskZones={showRiskZones}
            onToggleRiskZones={() => setShowRiskZones((prev) => !prev)}
          />
        </View>

        {currentRisk && (
          <View
            style={[
              styles.riskIndicator,
              {
                top: insets.top + 70,
                backgroundColor: currentRiskTheme.backgroundColor,
                borderColor: currentRiskTheme.borderColor,
              },
            ]}
          >
            <Icon source="shield-alert" size={16} color={currentRiskTheme.textColor} />
            <Text style={[styles.riskIndicatorText, { color: currentRiskTheme.textColor }]}>
              {`${currentRisk.risk_level} Risk (${currentRisk.final_score}) • ${currentRisk.area_id}`}
            </Text>
          </View>
        )}

        {/* ── SEARCH ── */}
        <SearchOverlay onSelectPlace={handlePlaceSelected} />







        {/* ── FABs ── */}
        <View style={[styles.fabContainer, showDirections && { bottom: 400 }]}>
          <FAB
            icon={isPanic ? "alert-octagon" : "alert-circle"}
            style={[styles.fab, isPanic && styles.fabPanic]}
            color={isPanic ? "#fff" : "#EF4444"}
            onPress={togglePanic}
          />
          <FAB
            icon={followUser ? "crosshairs-gps" : "crosshairs"}
            style={[styles.fab, followUser && styles.fabFollow]}
            color={followUser ? "#fff" : COLORS.primary}
            onPress={centerOnUser}
          />
          {!showDirections && (
            <FAB
              icon={showNearbyPanel ? "chevron-down" : "chevron-up"}
              style={styles.fab}
              color={COLORS.textLight}
              onPress={toggleNearbyPanel}
            />
          )}
        </View>

        {/* ── LOADING ROUTE OVERLAY ── */}
        {loadingRoute && (
          <View style={[styles.routeLoadingOverlay, { top: insets.top + 76 }]}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.routeLoadingText}>Finding route...</Text>
          </View>
        )}

        {showRiskZones && loadingRiskZones && (
          <View style={[styles.routeLoadingOverlay, { top: insets.top + 118 }]}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.routeLoadingText}>Loading risk zones...</Text>
          </View>
        )}

        {shouldShowPoliceStations && loadingPoliceStations && (
          <View
            style={[
              styles.routeLoadingOverlay,
              { top: insets.top + (showRiskZones ? 160 : 118) },
            ]}
          >
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.routeLoadingText}>Loading police stations...</Text>
          </View>
        )}

        {/* ── DIRECTIONS PANEL ── */}
        {showDirections && routeInfo && (
          <DirectionsPanel
            route={routeInfo}
            destinationName={selectedPlace!.name}
            onClose={clearDirections}
            onRecenter={isNavigating ? centerOnUser : handleStartNavigation}
            travelMode={travelMode}
            onChangeTravelMode={handleChangeTravelMode}
            navigationState={navigationState}
            isLoadingRoute={loadingRoute}
          />
        )}

        {/* ── STOP NAVIGATION BUTTON (when navigating) ── */}
        {isNavigating && (
          <TouchableOpacity
            style={[styles.stopNavButton, { top: insets.top + 76 }]}
            onPress={handleStopNavigation}
            activeOpacity={0.8}
          >
            <Icon source="stop" size={20} color="#fff" />
            <Text style={styles.stopNavText}>Stop Navigation</Text>
          </TouchableOpacity>
        )}

        {/* ── NEARBY PANEL (only when no directions) ── */}
        {!showDirections && (
          <Animated.View
            style={[
              styles.nearbyPreview,
              {
                transform: [
                  {
                    translateY: nearbyPanelAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [200, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.nearbyHeader}>
              <Text style={styles.nearbyTitle}>Nearby Places</Text>
              {isTracking && !loadingNearby && (
                <View style={styles.trackingBadge}>
                  <View style={styles.trackingDot} />
                  <Text style={styles.trackingText}>Live</Text>
                </View>
              )}
            </View>
            <View style={styles.nearbyItems}>
              {loadingNearby ? (
                <View style={styles.nearbyLoading}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.nearbyLoadingText}>
                    Finding nearby places...
                  </Text>
                </View>
              ) : nearbyPlaces.length > 0 ? (
                nearbyPlaces.map((place) => (
                  <TouchableOpacity
                    key={place.id}
                    style={styles.nearbyItem}
                    onPress={() => handlePlaceSelected(place)}
                  >
                    <View
                      style={[
                        styles.nearbyIcon,
                        {
                          backgroundColor:
                            place.type === "hospital" ||
                            place.category === "amenity"
                              ? "#FEE2E2"
                              : place.type === "police"
                                ? "#DBEAFE"
                                : "#D1FAE5",
                        },
                      ]}
                    >
                      <Icon
                        source={place.icon || "map-marker"}
                        size={20}
                        color={
                          place.type === "hospital" ||
                          place.category === "amenity"
                            ? "#EF4444"
                            : place.type === "police"
                              ? "#3B82F6"
                              : "#10B981"
                        }
                      />
                    </View>
                    <View style={styles.nearbyInfo}>
                      <Text style={styles.nearbyName} numberOfLines={1}>
                        {place.name}
                      </Text>
                      <Text style={styles.nearbyDistance}>
                        {formatDistance(place.distanceValue)}
                      </Text>
                    </View>
                    <Icon
                      source="directions"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.nearbyEmpty}>
                  <Icon source="map-search-outline" size={28} color="#D1D5DB" />
                  <Text style={styles.nearbyEmptyText}>
                    No nearby places found
                  </Text>
                </View>
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F1EE" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F1EE",
  },
  loadingText: { marginTop: 16, fontSize: 16, color: "#4A4341" },
  mapContainer: { flex: 1 },
  map: { flex: 1 },

  filterContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 15,
  },

  riskIndicator: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    zIndex: 10,
  },
  riskIndicatorText: { fontSize: 13, fontWeight: "600" },

  locationCard: {
    position: "absolute",
    bottom: 220,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  locationInfo: { flexDirection: "row", alignItems: "center", flex: 1 },
  locationText: { marginLeft: 12, flex: 1 },
  locationTitle: { fontSize: 14, fontWeight: "600", color: "#1A1818" },
  locationSubtitle: { fontSize: 12, color: "#4A4341", marginTop: 2 },
  speedBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  speedText: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },

  fabContainer: {
    position: "absolute",
    right: 16,
    bottom: 240,
    gap: 12,
  },
  fab: { backgroundColor: "#FFFFFF", elevation: 4 },
  fabPanic: { backgroundColor: "#D93636" },
  fabFollow: { backgroundColor: "#21100B" },

  routeLoadingOverlay: {
    position: "absolute",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    zIndex: 25,
  },
  routeLoadingText: { color: "#fff", fontSize: 13, fontWeight: "500" },

  nearbyPreview: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  nearbyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  nearbyTitle: { fontSize: 16, fontWeight: "700", color: "#1A1818" },
  trackingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  trackingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#21100B",
  },
  trackingText: { fontSize: 11, fontWeight: "600", color: "#21100B" },
  nearbyItems: { gap: 10 },
  nearbyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
  },
  nearbyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nearbyInfo: { flex: 1, marginLeft: 12 },
  nearbyName: { fontSize: 14, fontWeight: "600", color: "#1A1818" },
  nearbyDistance: { fontSize: 12, color: "#4A4341", marginTop: 2 },
  nearbyLoading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 10,
  },
  nearbyLoadingText: { fontSize: 13, color: COLORS.textLight },
  nearbyEmpty: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
  },
  nearbyEmptyText: { fontSize: 13, color: "#9CA3AF", fontWeight: "500" },
  
  stopNavButton: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#21100B",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    elevation: 8,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 20,
  },
  stopNavText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
});
