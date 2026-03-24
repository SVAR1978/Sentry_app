export const COLORS = {
  // Primary Palette - Earth Tone Sophistication
  primary: "#21100B",           // Deepest Brown
  primaryContainer: "#4A4341",  // Graphite
  onPrimary: "#F2F2F2",         // Bone White
  
  // Secondary / Accents
  secondary: "#8C7D79",         // Neutral Stone
  accent: "#8C7D79",            // Warm gray for ratings
  error: "#FF6B6B",             // Functional red
  success: "#10B981",           // Functional green

  // Surface Hierarchy
  background: "#F2F2F2",        // Clean Light Bone
  surface: "#FFFFFF",           // Pure White surfaces
  surfaceContainerLow: "#E5E5E5",
  surfaceContainer: "#F2F2F2",
  surfaceContainerHigh: "#C2C2C2", // Light Gray (was navy)
  surfaceContainerHighest: "#8C7D79",
  surfaceBright: "#FFFFFF",

  // Text Colors
  text: "#1A1818",              // Almost Black (was light)
  textLight: "#4A4341",         // Dark Graphite
  textMuted: "#8C7D79",         // Stone Gray
  white: "#FFFFFF",

  // Borders & Outlines
  border: "#8C7D79",            // Stone
  divider: "#C2C2C2",           // Light Gray
  
  // Legacy compatibility
  gradientStart: "#21100B",
  gradientEnd: "#4A4341",
};

// Quick Action Types
export type QuickActionType = "call" | "helpline" | "navigate";

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  color: string;
  type: QuickActionType;
  phoneNumber?: string;
  serviceName?: string;
  mapFilter?: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "1",
    icon: "Hospital",
    label: "Hospital",
    color: "#21100B",
    type: "call",
    phoneNumber: "102",
    serviceName: "Ambulance Service",
    mapFilter: "hospital",
  },
  {
    id: "2",
    icon: "ShieldAlert",
    label: "Police",
    color: "#4A4341",
    type: "call",
    phoneNumber: "100",
    serviceName: "Police Emergency",
    mapFilter: "police",
  },
  {
    id: "3",
    icon: "Siren",
    label: "Emergency",
    color: "#8C7D79",
    type: "call",
    phoneNumber: "112",
    serviceName: "National Emergency Service",
  },
  {
    id: "4",
    icon: "PhoneCall",
    label: "Helpline",
    color: "#4A4341",
    type: "helpline",
  },
];

// Helpline Numbers for Bottom Sheet
export interface HelplineItem {
  id: string;
  name: string;
  number: string;
  alternateNumber?: string;
  description: string;
  icon: string;
  color: string;
  category: "tourist" | "safety" | "medical" | "transport" | "other";
}

export const HELPLINE_NUMBERS: HelplineItem[] = [
  {
    id: "h1",
    name: "Tourist Helpline",
    number: "1363",
    alternateNumber: "1800-111-363",
    description: "24/7 tourist assistance and information",
    icon: "Info",
    color: "#4A4341",
    category: "tourist",
  },
  {
    id: "h2",
    name: "Women's Helpline",
    number: "1091",
    alternateNumber: "181",
    description: "Women in distress can call for immediate help",
    icon: "UserCheck",
    color: "#8C7D79",
    category: "safety",
  },
  {
    id: "h3",
    name: "National Emergency",
    number: "112",
    description: "Single emergency number for police, fire, ambulance",
    icon: "AlertCircle",
    color: "#21100B",
    category: "safety",
  },
  {
    id: "h4",
    name: "Senior Citizen Helpline",
    number: "14567",
    description: "Support and assistance for senior citizens",
    icon: "Users",
    color: "#4A4341",
    category: "safety",
  },
  {
    id: "h5",
    name: "Child Helpline",
    number: "1098",
    description: "24/7 helpline for children in need",
    icon: "Baby",
    color: "#8C7D79",
    category: "safety",
  },
];
