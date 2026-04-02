import * as Location from "expo-location";
import {
    RiskZone,
    ROUTE_DEVIATION_CONFIG,
} from "../../constants/mapData";

export interface LocationCoordinate {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  currentLocation: LocationCoordinate | null;
  locationHistory: LocationCoordinate[];
  isTracking: boolean;
  accuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  coord1: LocationCoordinate,
  coord2: LocationCoordinate,
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

// Calculate minimum distance from current location to a route
export const calculateRouteDeviation = (
  currentLocation: LocationCoordinate,
  plannedRoute: LocationCoordinate[],
): number => {
  if (!plannedRoute.length) return 0;

  let minDistance = Infinity;

  // Check distance to each point on the route
  for (const point of plannedRoute) {
    const distance = calculateDistance(currentLocation, point);
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  // Also check distance to line segments between route points
  for (let i = 0; i < plannedRoute.length - 1; i++) {
    const distance = pointToLineDistance(
      currentLocation,
      plannedRoute[i],
      plannedRoute[i + 1],
    );
    if (distance < minDistance) {
      minDistance = distance;
    }
  }

  return minDistance;
};

// Calculate perpendicular distance from point to line segment
const pointToLineDistance = (
  point: LocationCoordinate,
  lineStart: LocationCoordinate,
  lineEnd: LocationCoordinate,
): number => {
  const A = point.latitude - lineStart.latitude;
  const B = point.longitude - lineStart.longitude;
  const C = lineEnd.latitude - lineStart.latitude;
  const D = lineEnd.longitude - lineStart.longitude;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let nearestLat, nearestLon;

  if (param < 0) {
    nearestLat = lineStart.latitude;
    nearestLon = lineStart.longitude;
  } else if (param > 1) {
    nearestLat = lineEnd.latitude;
    nearestLon = lineEnd.longitude;
  } else {
    nearestLat = lineStart.latitude + param * C;
    nearestLon = lineStart.longitude + param * D;
  }

  return calculateDistance(point, {
    latitude: nearestLat,
    longitude: nearestLon,
  });
};

// Get deviation status based on distance
export const getDeviationStatus = (
  deviationDistance: number,
): "safe" | "warning" | "danger" => {
  if (deviationDistance <= ROUTE_DEVIATION_CONFIG.warningThreshold) {
    return "safe";
  } else if (deviationDistance <= ROUTE_DEVIATION_CONFIG.dangerThreshold) {
    return "warning";
  }
  return "danger";
};


// Request location permissions
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      return false;
    }

    // Request background permission for tracking
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    // Foreground is enough for basic functionality
    return true;
  } catch (error) {
    console.error("Error requesting location permission:", error);
    return false;
  }
};

// Get current location
export const getCurrentLocation =
  async (): Promise<LocationCoordinate | null> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting current location:", error);
      return null;
    }
  };

// Watch location for real-time tracking
export const startLocationTracking = async (
  onLocationUpdate: (location: Location.LocationObject) => void,
  options?: {
    accuracy?: Location.Accuracy;
    distanceInterval?: number;
    timeInterval?: number;
  },
): Promise<Location.LocationSubscription | null> => {
  try {
    const subscription = await Location.watchPositionAsync(
      {
        accuracy: options?.accuracy || Location.Accuracy.High,
        distanceInterval: options?.distanceInterval || 10, // meters
        timeInterval: options?.timeInterval || 5000, // milliseconds
      },
      onLocationUpdate,
    );

    return subscription;
  } catch (error) {
    console.error("Error starting location tracking:", error);
    return null;
  }
};

// Stop location tracking
export const stopLocationTracking = (
  subscription: Location.LocationSubscription,
): void => {
  subscription.remove();
};

// Get heading/compass direction
export const getHeadingAsync = async (): Promise<number | null> => {
  try {
    const heading = await Location.getHeadingAsync();
    return heading.trueHeading || heading.magHeading;
  } catch (error) {
    console.error("Error getting heading:", error);
    return null;
  }
};

// Reverse geocode a location to get address
export const reverseGeocode = async (
  location: LocationCoordinate,
): Promise<string | null> => {
  try {
    const results = await Location.reverseGeocodeAsync(location);
    if (results.length > 0) {
      const addr = results[0];
      return [addr.name, addr.street, addr.city, addr.region]
        .filter(Boolean)
        .join(", ");
    }
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};

// Calculate bearing between two points (for rotation)
export const calculateBearing = (
  from: LocationCoordinate,
  to: LocationCoordinate,
): number => {
  const φ1 = (from.latitude * Math.PI) / 180;
  const φ2 = (to.latitude * Math.PI) / 180;
  const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
};

// Cluster nearby markers (simple grid-based clustering)
export interface ClusterableMarker {
  id: string;
  coordinate: LocationCoordinate;
}

export interface Cluster {
  id: string;
  coordinate: LocationCoordinate;
  markers: ClusterableMarker[];
  count: number;
}

export const clusterMarkers = (
  markers: ClusterableMarker[],
  zoomLevel: number,
  gridSize: number = 50,
): (ClusterableMarker | Cluster)[] => {
  if (zoomLevel > 14) {
    // Don't cluster at high zoom
    return markers;
  }

  const clusters: Map<string, Cluster> = new Map();
  const scaleFactor = Math.pow(2, 12 - zoomLevel);
  const adjustedGridSize = gridSize * scaleFactor;

  for (const marker of markers) {
    const gridX = Math.floor(
      (marker.coordinate.longitude * 10000) / adjustedGridSize,
    );
    const gridY = Math.floor(
      (marker.coordinate.latitude * 10000) / adjustedGridSize,
    );
    const key = `${gridX}_${gridY}`;

    if (clusters.has(key)) {
      const cluster = clusters.get(key)!;
      cluster.markers.push(marker);
      cluster.count = cluster.markers.length;
      // Update centroid
      const avgLat =
        cluster.markers.reduce((sum, m) => sum + m.coordinate.latitude, 0) /
        cluster.markers.length;
      const avgLng =
        cluster.markers.reduce((sum, m) => sum + m.coordinate.longitude, 0) /
        cluster.markers.length;
      cluster.coordinate = { latitude: avgLat, longitude: avgLng };
    } else {
      clusters.set(key, {
        id: `cluster_${key}`,
        coordinate: marker.coordinate,
        markers: [marker],
        count: 1,
      });
    }
  }

  // Return single markers as-is, multiple as clusters
  return Array.from(clusters.values()).map((cluster) =>
    cluster.count === 1 ? cluster.markers[0] : cluster,
  );
};

export const isCluster = (
  item: ClusterableMarker | Cluster,
): item is Cluster => {
  return "count" in item && item.count > 1;
};

// ============ NAVIGATION HELPERS ============

// Find the closest coordinate on a route to current location
export const findClosestPointOnRoute = (
  currentLocation: LocationCoordinate,
  routeCoordinates: LocationCoordinate[]
): {
  closestPoint: LocationCoordinate;
  distance: number;
  index: number;
} => {
  let minDistance = Infinity;
  let closestPoint = routeCoordinates[0];
  let closestIndex = 0;

  for (let i = 0; i < routeCoordinates.length - 1; i++) {
    const segment = {
      start: routeCoordinates[i],
      end: routeCoordinates[i + 1],
    };

    const distance = pointToLineDistance(
      currentLocation,
      segment.start,
      segment.end
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;

      // Find the exact closest point on the segment
      const A = currentLocation.latitude - segment.start.latitude;
      const B = currentLocation.longitude - segment.start.longitude;
      const C = segment.end.latitude - segment.start.latitude;
      const D = segment.end.longitude - segment.start.longitude;

      const dot = A * C + B * D;
      const lenSq = C * C + D * D;
      let param = lenSq !== 0 ? dot / lenSq : -1;

      if (param < 0) {
        closestPoint = segment.start;
      } else if (param > 1) {
        closestPoint = segment.end;
      } else {
        closestPoint = {
          latitude: segment.start.latitude + param * C,
          longitude: segment.start.longitude + param * D,
        };
      }
    }
  }

  return { closestPoint, distance: minDistance, index: closestIndex };
};

// Calculate progress along a route (0-1)
export const calculateRouteProgress = (
  currentLocation: LocationCoordinate,
  routeCoordinates: LocationCoordinate[]
): number => {
  const { index } = findClosestPointOnRoute(currentLocation, routeCoordinates);
  return index / Math.max(1, routeCoordinates.length - 1);
};

// Get estimated time of arrival
export const getEstimatedArrival = (
  remainingSeconds: number
): { time: Date; text: string } => {
  const arrivalDate = new Date(Date.now() + remainingSeconds * 1000);
  const hours = arrivalDate.getHours();
  const minutes = arrivalDate.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  return {
    time: arrivalDate,
    text: `${displayHours}:${displayMinutes} ${ampm}`,
  };
};

// Smooth location updates to reduce jitter
export class LocationSmoother {
  private history: LocationCoordinate[] = [];
  private maxHistory: number = 5;

  addLocation(location: LocationCoordinate): LocationCoordinate {
    this.history.push(location);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Return weighted average (more recent = higher weight)
    let totalWeight = 0;
    let weightedLat = 0;
    let weightedLng = 0;

    this.history.forEach((loc, index) => {
      const weight = index + 1; // Linear weight
      totalWeight += weight;
      weightedLat += loc.latitude * weight;
      weightedLng += loc.longitude * weight;
    });

    return {
      latitude: weightedLat / totalWeight,
      longitude: weightedLng / totalWeight,
    };
  }

  reset(): void {
    this.history = [];
  }
}

