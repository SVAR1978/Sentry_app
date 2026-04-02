import { COLORS } from "./userHomeData";

// Delhi region coordinates
export const DELHI_REGION = {
  latitude: 28.6139,
  longitude: 77.209,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

// Risk Zone Types
export type RiskLevel = "safe" | "moderate" | "high";

export interface RiskZone {
  id: string;
  name: string;
  level: RiskLevel;
  coordinates: { latitude: number; longitude: number }[];
  description: string;
}

// Risk Zone Colors
export const RISK_ZONE_COLORS = {
  safe: {
    fill: "rgba(16, 185, 129, 0.2)", // Green
    stroke: "#10B981",
  },
  moderate: {
    fill: "rgba(245, 158, 11, 0.25)", // Orange
    stroke: "#F59E0B",
  },
  high: {
    fill: "rgba(239, 68, 68, 0.3)", // Red
    stroke: "#EF4444",
  },
};


// Tourist POI Types
export type POIType =
  | "attraction"
  | "restaurant"
  | "hospital"
  | "police"
  | "hotel"
  | "emergency";

export interface POIMarker {
  id: string;
  name: string;
  type: POIType;
  coordinate: { latitude: number; longitude: number };
  rating?: number;
  distance?: string;
  isOpen?: boolean;
  phone?: string;
}

// POI Icons and Colors
export const POI_CONFIG: Record<
  POIType,
  { icon: string; color: string; bgColor: string }
> = {
  attraction: {
    icon: "camera",
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.15)",
  },
  restaurant: {
    icon: "food",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.15)",
  },
  hospital: {
    icon: "hospital-building",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
  },
  police: {
    icon: "police-badge",
    color: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.15)",
  },
  hotel: {
    icon: "bed",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.15)",
  },
  emergency: {
    icon: "alert-circle",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.25)",
  },
};


// Map Filter Options
export const MAP_FILTER_OPTIONS = [
  { id: "all", label: "All", icon: "map-marker" },
  { id: "attraction", label: "Attractions", icon: "camera" },
  { id: "restaurant", label: "Food", icon: "food" },
  { id: "hospital", label: "Hospitals", icon: "hospital-building" },
  { id: "police", label: "Police", icon: "police-badge" },
  { id: "hotel", label: "Hotels", icon: "bed" },
];

// Route Deviation Thresholds (in meters)
export const ROUTE_DEVIATION_CONFIG = {
  warningThreshold: 500, // 500m - Yellow warning
  dangerThreshold: 2000, // 2km - Red warning
  alertInterval: 30000, // Check every 30 seconds
};


// Map Style (for custom styling)
export const MAP_STYLE = [
  {
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#dcf5dc" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#ffffff" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9e7f5" }],
  },
];

export { COLORS };
