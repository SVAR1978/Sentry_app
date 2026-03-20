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

// Sample Risk Zones in Delhi
export const RISK_ZONES: RiskZone[] = [
  {
    id: "rz1",
    name: "Connaught Place - Safe Zone",
    level: "safe",
    coordinates: [
      { latitude: 28.6348, longitude: 77.2167 },
      { latitude: 28.6348, longitude: 77.2227 },
      { latitude: 28.6288, longitude: 77.2227 },
      { latitude: 28.6288, longitude: 77.2167 },
    ],
    description: "Well-patrolled tourist area with 24/7 security",
  },
  {
    id: "rz2",
    name: "Old Delhi Market - Moderate Zone",
    level: "moderate",
    coordinates: [
      { latitude: 28.6562, longitude: 77.2285 },
      { latitude: 28.6562, longitude: 77.2385 },
      { latitude: 28.6492, longitude: 77.2385 },
      { latitude: 28.6492, longitude: 77.2285 },
    ],
    description: "Crowded area - stay alert for pickpockets",
  },
  {
    id: "rz3",
    name: "Industrial Area - High Risk",
    level: "high",
    coordinates: [
      { latitude: 28.5892, longitude: 77.3185 },
      { latitude: 28.5892, longitude: 77.3285 },
      { latitude: 28.5822, longitude: 77.3285 },
      { latitude: 28.5822, longitude: 77.3185 },
    ],
    description: "Avoid after dark - limited tourist infrastructure",
  },
];

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

// Sample POI Markers in Delhi
export const POI_MARKERS: POIMarker[] = [
  // Attractions
  {
    id: "poi1",
    name: "Red Fort",
    type: "attraction",
    coordinate: { latitude: 28.6562, longitude: 77.241 },
    rating: 4.8,
  },
  {
    id: "poi2",
    name: "India Gate",
    type: "attraction",
    coordinate: { latitude: 28.6129, longitude: 77.2295 },
    rating: 4.7,
  },
  {
    id: "poi3",
    name: "Qutub Minar",
    type: "attraction",
    coordinate: { latitude: 28.5245, longitude: 77.1855 },
    rating: 4.6,
  },
  {
    id: "poi4",
    name: "Lotus Temple",
    type: "attraction",
    coordinate: { latitude: 28.5535, longitude: 77.2588 },
    rating: 4.7,
  },
  {
    id: "poi5",
    name: "Akshardham Temple",
    type: "attraction",
    coordinate: { latitude: 28.6127, longitude: 77.2773 },
    rating: 4.8,
  },
  // Hospitals
  {
    id: "poi6",
    name: "AIIMS Hospital",
    type: "hospital",
    coordinate: { latitude: 28.5672, longitude: 77.2099 },
    phone: "011-26588500",
    isOpen: true,
  },
  {
    id: "poi7",
    name: "Safdarjung Hospital",
    type: "hospital",
    coordinate: { latitude: 28.5689, longitude: 77.2066 },
    phone: "011-26707437",
    isOpen: true,
  },
  {
    id: "poi8",
    name: "Apollo Hospital",
    type: "hospital",
    coordinate: { latitude: 28.5517, longitude: 77.2506 },
    phone: "011-29871090",
    isOpen: true,
  },
  // Police Stations
  {
    id: "poi9",
    name: "Parliament Street PS",
    type: "police",
    coordinate: { latitude: 28.6234, longitude: 77.2149 },
    phone: "100",
    isOpen: true,
  },
  {
    id: "poi10",
    name: "Connaught Place PS",
    type: "police",
    coordinate: { latitude: 28.6315, longitude: 77.2167 },
    phone: "100",
    isOpen: true,
  },
  // Restaurants
  {
    id: "poi11",
    name: "Karim's",
    type: "restaurant",
    coordinate: { latitude: 28.6506, longitude: 77.2341 },
    rating: 4.5,
  },
  {
    id: "poi12",
    name: "Indian Accent",
    type: "restaurant",
    coordinate: { latitude: 28.5947, longitude: 77.1893 },
    rating: 4.8,
  },
  // Hotels
  {
    id: "poi13",
    name: "The Imperial",
    type: "hotel",
    coordinate: { latitude: 28.6282, longitude: 77.2193 },
    rating: 4.9,
  },
  {
    id: "poi14",
    name: "Taj Palace",
    type: "hotel",
    coordinate: { latitude: 28.5977, longitude: 77.1718 },
    rating: 4.8,
  },
];

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

// Sample Planned Route (Tourist Circuit)
export const SAMPLE_PLANNED_ROUTE = [
  { latitude: 28.6129, longitude: 77.2295 }, // India Gate
  { latitude: 28.6282, longitude: 77.2193 }, // Connaught Place
  { latitude: 28.6562, longitude: 77.241 }, // Red Fort
  { latitude: 28.6506, longitude: 77.2341 }, // Jama Masjid
  { latitude: 28.6527, longitude: 77.2311 }, // Chandni Chowk
];

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
