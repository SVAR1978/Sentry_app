export const COLORS = {
  // Layer 1 – Earthy Gradient Backgrounds
  gradientStart: "#C7A27D",      // Tan
  gradientMid: "#8C4B35",        // Warm Sienna
  gradientEnd: "#3E1911",        // Deep Chocolate

  // Primary Palette
  primary: "#3E1911",            // Deep Chocolate
  primaryContainer: "#5C2C22",   // Deep Rust
  onPrimary: "#F9EFEB",          // Warm Frosted White

  // Layer 2 – Glassmorphism Surfaces
  glass: "rgba(241, 232, 223, 0.65)",  // Frosted Off-White
  glassBorder: "rgba(255, 255, 255, 0.45)",
  surface: "#FFFFFF",
  surfaceContainerLow: "#F1E8DF",
  surfaceContainer: "#F9EFEB",
  surfaceContainerHigh: "#EAD8C9",
  surfaceContainerHighest: "#DDB89A",
  surfaceBright: "#FFFFFF",
  background: "#F6F4F0",

  // Layer 3 – Typography & Metallic Accents
  text: "#000000",               // Pitch Black
  textLight: "#2A1E15",          // Deep Warm Shadow
  textMuted: "#8E8E93",          // Muted Grey
  white: "#FFFFFF",

  // Metallic Accents
  gold: "#CFB084",               // Champagne Gold
  goldLight: "#D4BA94",          // Light Gold
  goldGlow: "#C89766",           // Golden Illumination
  silver: "#D3D1CD",             // Silver Metallic

  // Secondary / Accents
  secondary: "#C7A27D",          // Soft Beige
  accent: "#C89766",             // Golden Illumination
  error: "#B02500",
  success: "#2E7D5B",

  // Borders & Outlines
  border: "#D3D1CD",             // Silver Metallic
  divider: "#EAD8C9",            // Pale Peach
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
    color: "#3E1911",
    type: "call",
    phoneNumber: "102",
    serviceName: "Ambulance Service",
    mapFilter: "hospital",
  },
  {
    id: "2",
    icon: "ShieldAlert",
    label: "Police",
    color: "#5C2C22",
    type: "call",
    phoneNumber: "100",
    serviceName: "Police Emergency",
    mapFilter: "police",
  },
  {
    id: "3",
    icon: "Siren",
    label: "Emergency",
    color: "#8C4B35",
    type: "call",
    phoneNumber: "112",
    serviceName: "National Emergency Service",
  },
  {
    id: "4",
    icon: "PhoneCall",
    label: "Helpline",
    color: "#CFB084",
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
    color: "#CFB084",
    category: "tourist",
  },
  {
    id: "h2",
    name: "Women's Helpline",
    number: "1091",
    alternateNumber: "181",
    description: "Women in distress can call for immediate help",
    icon: "UserCheck",
    color: "#8C4B35",
    category: "safety",
  },
  {
    id: "h3",
    name: "National Emergency",
    number: "112",
    description: "Single emergency number for police, fire, ambulance",
    icon: "AlertCircle",
    color: "#3E1911",
    category: "safety",
  },
  {
    id: "h4",
    name: "Senior Citizen Helpline",
    number: "14567",
    description: "Support and assistance for senior citizens",
    icon: "Users",
    color: "#5C2C22",
    category: "safety",
  },
  {
    id: "h5",
    name: "Child Helpline",
    number: "1098",
    description: "24/7 helpline for children in need",
    icon: "Baby",
    color: "#C7A27D",
    category: "safety",
  },
];
