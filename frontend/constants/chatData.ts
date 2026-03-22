import { COLORS } from "./userHomeData";

// ============ CHAT THEME — Premium Glassmorphic + Metallic ============

export const CHAT_COLORS = {
  // Light glassmorphism background
  windowBg: "rgba(242, 242, 242, 0.92)",
  headerGradientStart: "#21100B",
  headerGradientEnd: "#3E1911",

  // Bubbles — Glass style
  botBubbleBg: "rgba(255, 255, 255, 0.72)",
  botBubbleBorder: "rgba(33, 16, 11, 0.08)",
  botText: "#1A1818",
  userBubbleStart: "#21100B",
  userBubbleEnd: "#3E1911",
  userText: "#FFFFFF",

  // Input — Frosted
  inputBg: "rgba(255, 255, 255, 0.65)",
  inputBorder: "rgba(33, 16, 11, 0.12)",
  inputText: "#1A1818",
  inputPlaceholder: "rgba(33, 16, 11, 0.4)",

  // Accents
  accent: COLORS.accent,
  accentGlow: "rgba(140, 125, 121, 0.25)",
  mutedText: "rgba(33, 16, 11, 0.45)",
  timestamp: "rgba(33, 16, 11, 0.35)",

  // Chips — Glassmorphic pills
  chipBg: "rgba(255, 255, 255, 0.6)",
  chipBorder: "rgba(33, 16, 11, 0.1)",
  chipText: "#21100B",

  // Status
  online: "#10B981",
  sent: "rgba(33, 16, 11, 0.35)",
  seen: "#10B981",

  // Misc
  separator: "rgba(33, 16, 11, 0.06)",
  white: "#FFFFFF",
  overlay: "rgba(0, 0, 0, 0.55)",
};

// ============ BOT IDENTITY ============

export const BOT_INFO = {
  name: "Travelo AI",
  subtitle: "Always online",
  icon: "Bot", // Lucide icon name
};

// ============ QUICK REPLY CHIPS ============

export interface QuickChip {
  id: string;
  icon: string; // Changed from emoji to icon
  label: string;
}

export const DEFAULT_CHIPS: QuickChip[] = [
  { id: "1", icon: "MapPin", label: "Top Places" },
  { id: "2", icon: "Hotel", label: "Best Hotels" },
  { id: "3", icon: "Utensils", label: "Local Food" },
  { id: "4", icon: "Bus", label: "Transport" },
  { id: "5", icon: "Sun", label: "Weather" },
  { id: "6", icon: "Wallet", label: "Budget Tips" },
  { id: "7", icon: "Map", label: "Nearby Me" },
];

// ============ WELCOME FEATURES ============

export interface WelcomeFeature {
  id: string;
  icon: string; // Changed from emoji to icon
  label: string;
  description: string;
}

export const WELCOME_FEATURES: WelcomeFeature[] = [
  { id: "1", icon: "Map", label: "Discover Places", description: "Find amazing destinations" },
  { id: "2", icon: "Hotel", label: "Find Hotels", description: "Best stays near you" },
  { id: "3", icon: "Calendar", label: "Plan Itinerary", description: "Day-by-day travel plans" },
  { id: "4", icon: "Utensils", label: "Local Cuisine", description: "Must-try food spots" },
  { id: "5", icon: "ShieldCheck", label: "Safety Info", description: "Stay safe while traveling" },
  { id: "6", icon: "Lightbulb", label: "Travel Tips", description: "Expert recommendations" },
];

// ============ MESSAGE TYPES ============

export type MessageSender = "bot" | "user";
export type MessageStatus = "sending" | "sent" | "delivered" | "seen";

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  timestamp: Date;
  status?: MessageStatus;
  isTyping?: boolean;
}

// ============ SAMPLE BOT RESPONSES ============

export const BOT_RESPONSES: Record<string, string> = {
  // Default / Generic greetings
  default:
    "I'd love to help you explore! 🌏 Could you tell me which destination you're interested in? I can suggest places to visit, local food, hotels, or create a full itinerary!",
  greeting:
    "Hey there, fellow traveler! 👋 I'm Travelo, your AI travel companion. Ready to plan your next adventure? Just tell me where you're headed!",

  // Quick chip responses
  "top places":
    "🏛️ Here are the top-rated places near you:\n\n1. India Gate — Iconic war memorial\n2. Qutub Minar — UNESCO World Heritage\n3. Humayun's Tomb — Mughal architecture\n4. Lotus Temple — Stunning Bahá'í House\n5. Red Fort — Historic fortification\n\nWant detailed info on any of these? 📍",
  "best hotels":
    "🏨 Top-rated stays in your area:\n\n⭐ The Imperial — 5-star heritage luxury\n⭐ Taj Palace — Classic elegance\n⭐ The Leela — Modern comfort\n⭐ ITC Maurya — Business & leisure\n\nShall I check availability or prices? 💰",
  "local food":
    "🍜 Must-try local dishes:\n\n🥘 Butter Chicken — Rich, creamy curry\n🫓 Paranthe Wali Gali — Stuffed paranthas\n🍢 Chandni Chowk Chaat — Street food heaven\n🍛 Biryani at Karim's — Since 1913\n🧁 Natraj's Dahi Bhalle — Legendary snack\n\nWant me to locate these on the map? 🗺️",
  transport:
    "🚌 Getting around:\n\n🚇 Delhi Metro — Fast & affordable\n🛺 Auto Rickshaws — Negotiate the fare!\n🚕 Uber/Ola — Convenient ride-hailing\n🚌 DTC Buses — Budget-friendly\n\nTip: Metro is the fastest during rush hours! 💡",
  weather:
    "☀️ Current Weather:\n\n📍 Delhi, India\n🌡️ 28°C — Partly Cloudy\n💨 Wind: 12 km/h\n💧 Humidity: 45%\n\n📅 3-Day Forecast:\nTomorrow: 30°C ☀️\nDay after: 27°C 🌤️\nDay 3: 25°C 🌧️\n\nPack light layers! 🧥",
  "budget tips":
    "💰 Budget Travel Tips:\n\n✅ Use Metro for all commutes\n✅ Eat at dhabas — authentic & cheap\n✅ Visit free monuments on Fridays\n✅ Book hostels via Hostelworld\n✅ Bargain at local markets!\n\nAvg daily budget: ₹1,500-2,500 🎯",
  "nearby me":
    "🗺️ Searching nearby attractions...\n\nBased on your location, here are spots within 5 km:\n\n📍 Lodhi Gardens — 1.2 km\n📍 Safdarjung Tomb — 2.1 km\n📍 Dilli Haat — 3.4 km\n📍 Hauz Khas Village — 4.7 km\n\nWant directions to any of these? 🧭",
};
