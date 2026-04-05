// ============================================================
// Explore Tab — All Static Data for Delhi Tourist Safety App
// ============================================================

// ── Design Tokens ──────────────────────────────────────────
export const EXPLORE_COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  white: "#FFFFFF",
  background: "#F2F2F2",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#FF6B6B",
  accent: "#D4AF37",
  cardBorder: "rgba(33, 16, 11, 0.05)",
};

// ── Types ──────────────────────────────────────────────────
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type AttractionCategory = "Heritage" | "Monument" | "Religious" | "Market" | "Leisure" | "Park";
export type FoodCategory = "vegetarian" | "non_veg" | "street_food" | "fine_dining" | "budget" | "cafe";
export type TipCategory = "Scam Alert" | "Safety" | "Transport" | "Culture";
export type AlertSeverity = "critical" | "caution" | "info";

export interface DelhiAttraction {
  id: string;
  name: string;
  imageUrl: string;
  safetyScore: number;
  safetyLabel: string;
  coordinates: Coordinates;
  entryFee: string;
  timings: string;
  category: AttractionCategory;
  bookingPartner: string | null;
  isFreeEntry: boolean;
  description: string;
}

export interface DelhiFoodSpot {
  id: string;
  name: string;
  area: string;
  imageUrl: string;
  cuisine: string;
  isVegetarian: boolean;
  hygieneRated: boolean;
  touristFriendly: boolean;
  avgCostForTwo: number;
  coordinates: Coordinates;
  category: FoodCategory;
}

export interface SafetyTip {
  id: string;
  title: string;
  preview: string;
  category: TipCategory;
  readTimeMin: number;
  gradientColors: [string, string];
  content: string;
}

export interface CategoryGridItem {
  id: string;
  emoji: string;
  label: string;
  filterKey: string;
}

export interface MetroStation {
  id: string;
  name: string;
  line: string;
  lineColor: string;
  coordinates: Coordinates;
  isAirportExpress?: boolean;
}

// ── Category Grid ──────────────────────────────────────────
export const CATEGORY_GRID: CategoryGridItem[] = [
  { id: "cat_1", emoji: "🏛️", label: "Attractions", filterKey: "attractions" },
  { id: "cat_2", emoji: "🍽️", label: "Food & Dining", filterKey: "food" },
  { id: "cat_3", emoji: "🏥", label: "Hospitals", filterKey: "hospitals" },
  { id: "cat_4", emoji: "🚔", label: "Police Stations", filterKey: "police" },
  { id: "cat_5", emoji: "🎟️", label: "Book Tickets", filterKey: "tickets" },
  { id: "cat_6", emoji: "🧭", label: "Guided Tours", filterKey: "tours" },
  { id: "cat_7", emoji: "💊", label: "Pharmacies", filterKey: "pharmacies" },
  { id: "cat_8", emoji: "🚇", label: "Metro", filterKey: "metro" },
  { id: "cat_9", emoji: "🌿", label: "Parks", filterKey: "parks" },
];

// ── Delhi Attractions ──────────────────────────────────────
export const DELHI_ATTRACTIONS: DelhiAttraction[] = [
  {
    id: "att_001",
    name: "Red Fort",
    imageUrl: "https://images.unsplash.com/photo-1585484173186-5f2d68e4a7ac?w=600&h=400&fit=crop",
    safetyScore: 4.8,
    safetyLabel: "Safe",
    coordinates: { latitude: 28.6562, longitude: 77.2410 },
    entryFee: "₹35 (Indian) / ₹500 (Foreign)",
    timings: "9:30 AM – 4:30 PM (Closed Monday)",
    category: "Heritage",
    bookingPartner: "BookMyShow",
    isFreeEntry: false,
    description: "UNESCO World Heritage Site and iconic Mughal fortress built by Shah Jahan in 1638.",
  },
  {
    id: "att_002",
    name: "Qutub Minar",
    imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop",
    safetyScore: 4.7,
    safetyLabel: "Safe",
    coordinates: { latitude: 28.5245, longitude: 77.1855 },
    entryFee: "₹35 (Indian) / ₹550 (Foreign)",
    timings: "Sunrise to Sunset (Daily)",
    category: "Heritage",
    bookingPartner: "GetYourGuide",
    isFreeEntry: false,
    description: "The tallest brick minaret in the world, dating back to the 12th century.",
  },
  {
    id: "att_003",
    name: "India Gate",
    imageUrl: "https://images.unsplash.com/photo-1597040663342-45b6ba68fa0b?w=600&h=400&fit=crop",
    safetyScore: 4.6,
    safetyLabel: "Safe",
    coordinates: { latitude: 28.6129, longitude: 77.2295 },
    entryFee: "Free",
    timings: "Open 24 Hours",
    category: "Monument",
    bookingPartner: null,
    isFreeEntry: true,
    description: "War memorial arch standing on the Rajpath, a popular evening gathering spot.",
  },
  {
    id: "att_004",
    name: "Lotus Temple",
    imageUrl: "https://images.unsplash.com/photo-1622030411594-abe38e774bf8?w=600&h=400&fit=crop",
    safetyScore: 4.9,
    safetyLabel: "Very Safe",
    coordinates: { latitude: 28.5535, longitude: 77.2588 },
    entryFee: "Free",
    timings: "9:00 AM – 5:30 PM (Closed Monday)",
    category: "Religious",
    bookingPartner: null,
    isFreeEntry: true,
    description: "Stunning lotus-shaped Bahá'í House of Worship, an architectural marvel.",
  },
  {
    id: "att_005",
    name: "Humayun's Tomb",
    imageUrl: "https://images.unsplash.com/photo-1623682687826-fe07032b9ae0?w=600&h=400&fit=crop",
    safetyScore: 4.7,
    safetyLabel: "Safe",
    coordinates: { latitude: 28.5933, longitude: 77.2507 },
    entryFee: "₹35 (Indian) / ₹550 (Foreign)",
    timings: "Sunrise to Sunset (Daily)",
    category: "Heritage",
    bookingPartner: "GetYourGuide",
    isFreeEntry: false,
    description: "Precursor to the Taj Mahal, this tomb is a masterpiece of Mughal architecture.",
  },
  {
    id: "att_006",
    name: "Akshardham Temple",
    imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop",
    safetyScore: 5.0,
    safetyLabel: "Very Safe",
    coordinates: { latitude: 28.6127, longitude: 77.2773 },
    entryFee: "Free (Exhibitions paid)",
    timings: "10:00 AM – 6:30 PM (Closed Monday)",
    category: "Religious",
    bookingPartner: null,
    isFreeEntry: true,
    description: "A breathtaking spiritual complex celebrating millennia of Indian culture.",
  },
  {
    id: "att_007",
    name: "Chandni Chowk",
    imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop",
    safetyScore: 3.9,
    safetyLabel: "Moderate",
    coordinates: { latitude: 28.6506, longitude: 77.2334 },
    entryFee: "Free",
    timings: "9:00 AM – 8:00 PM (Closed Sunday)",
    category: "Market",
    bookingPartner: null,
    isFreeEntry: true,
    description: "One of the oldest and busiest markets in Old Delhi, full of vibrant street life.",
  },
  {
    id: "att_008",
    name: "Hauz Khas Village",
    imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop",
    safetyScore: 4.3,
    safetyLabel: "Safe",
    coordinates: { latitude: 28.5494, longitude: 77.2001 },
    entryFee: "Free",
    timings: "Open Daily",
    category: "Leisure",
    bookingPartner: null,
    isFreeEntry: true,
    description: "Trendy urban village with art galleries, cafes, boutiques, and ancient ruins.",
  },
];

// ── Delhi Food Spots ───────────────────────────────────────
export const DELHI_FOOD_SPOTS: DelhiFoodSpot[] = [
  {
    id: "food_001",
    name: "Karim's",
    area: "Chandni Chowk",
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    cuisine: "Mughlai",
    isVegetarian: false,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 600,
    coordinates: { latitude: 28.6507, longitude: 77.2334 },
    category: "non_veg",
  },
  {
    id: "food_002",
    name: "Paranthe Wali Gali",
    area: "Chandni Chowk",
    imageUrl: "https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop",
    cuisine: "Street Food",
    isVegetarian: true,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 200,
    coordinates: { latitude: 28.6512, longitude: 77.2306 },
    category: "street_food",
  },
  {
    id: "food_003",
    name: "Indian Accent",
    area: "The Lodhi, Lodhi Road",
    imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    cuisine: "Modern Indian",
    isVegetarian: false,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 5000,
    coordinates: { latitude: 28.5918, longitude: 77.2273 },
    category: "fine_dining",
  },
  {
    id: "food_004",
    name: "Saravana Bhavan",
    area: "Connaught Place",
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop",
    cuisine: "South Indian",
    isVegetarian: true,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 400,
    coordinates: { latitude: 28.6315, longitude: 77.2167 },
    category: "vegetarian",
  },
  {
    id: "food_005",
    name: "Nathu's Sweets",
    area: "Bengali Market",
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&h=400&fit=crop",
    cuisine: "North Indian Sweets",
    isVegetarian: true,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 300,
    coordinates: { latitude: 28.6298, longitude: 77.2270 },
    category: "budget",
  },
  {
    id: "food_006",
    name: "Bukhara",
    area: "ITC Maurya, Chanakyapuri",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop",
    cuisine: "North-West Frontier",
    isVegetarian: false,
    hygieneRated: true,
    touristFriendly: true,
    avgCostForTwo: 6000,
    coordinates: { latitude: 28.5982, longitude: 77.1731 },
    category: "fine_dining",
  },
];

// ── Safety Tips ────────────────────────────────────────────
export const SAFETY_TIPS: SafetyTip[] = [
  {
    id: "tip_001",
    title: "Top 5 Scams Tourists\nFace in Delhi",
    preview: "From fake guides to overpriced autos — know what to watch for.",
    category: "Scam Alert",
    readTimeMin: 4,
    gradientColors: ["#FF416C", "#FF4B2B"],
    content: `## 1. Fake Tourist Guides
Always hire guides from official ASI-approved booths at monuments. Strangers offering "free" tours often lead to commission shops.

## 2. Auto/Cab Overcharging
Always use Ola or Uber. If taking an auto, agree on price first or insist on meter. Prepaid taxi counters at railway stations are safe.

## 3. Gem Export Scam
Strangers claiming you can make money exporting gems from India are always a scam. Do not engage.

## 4. Fake Ticket Sellers
Buy tickets only from official ASI counters or our app's booking partners. Never from individuals outside monuments.

## 5. Fake Police Officers
Real police will not ask for your passport or money on the street. If approached, ask to go to the nearest police station.`,
  },
  {
    id: "tip_002",
    title: "Safe Areas to Visit\nAfter Dark",
    preview: "Not all of Delhi is unsafe at night — here's where to go.",
    category: "Safety",
    readTimeMin: 3,
    gradientColors: ["#1A2980", "#26D0CE"],
    content: `## Safe Areas After 8 PM
- **Connaught Place** — Well-lit, police presence
- **Hauz Khas Village** — Popular with tourists and locals
- **Khan Market** — Restaurants and cafes open late
- **Cyber Hub, Gurugram** — Modern food and entertainment hub

## Areas to Avoid After Dark
- Paharganj (crowded, poorly lit lanes)
- Old Delhi narrow lanes
- Isolated monuments and parks

## General Rules
- Always share your live location with someone trusted
- Use Ola/Uber instead of autos after 9 PM
- Stay on main roads in unfamiliar areas`,
  },
  {
    id: "tip_003",
    title: "How to Use Delhi\nMetro as a Tourist",
    preview: "The safest and cheapest way to travel across Delhi.",
    category: "Transport",
    readTimeMin: 3,
    gradientColors: ["#11998E", "#38EF7D"],
    content: `## Step-by-Step Guide
1. Download the **Delhi Metro Rail** app for route planning
2. Buy a **Tourist Card** (1-day or 3-day unlimited travel)
3. **Women's-only coaches** are the first and last — use them for safety
4. **Airport Express** runs every 10 mins from New Delhi Metro Station to IGI Airport Terminal 3
5. Keep your bag in front of you in crowded trains
6. Last metro is usually around **11 PM** — plan accordingly

## Pro Tips
- Avoid peak hours (8–10 AM, 5–7 PM) for a comfortable ride
- Rajiv Chowk is the busiest interchange station
- Use the QR code feature in the Delhi Metro app for contactless entry`,
  },
  {
    id: "tip_004",
    title: "Emergency Numbers\nEvery Tourist Must Save",
    preview: "Save these before you step out. Always.",
    category: "Safety",
    readTimeMin: 2,
    gradientColors: ["#F7971E", "#FFD200"],
    content: `## Essential Numbers
- **Police:** 100
- **Ambulance:** 102
- **Fire:** 101
- **Tourist Police Delhi:** 1800-11-1363 (Toll Free)
- **Women Helpline:** 1091
- **PCR Van:** 112
- **CATS Ambulance:** 102
- **Delhi Traffic Police:** 011-25844444

> **Tip:** Screenshot this list and save it offline in case you lose internet connectivity.`,
  },
  {
    id: "tip_005",
    title: "Cultural Dos & Don'ts\nfor Delhi Visitors",
    preview: "Respect local customs to have a smoother experience.",
    category: "Culture",
    readTimeMin: 3,
    gradientColors: ["#8E2DE2", "#4A00E0"],
    content: `## Do's
- Remove shoes before entering temples and gurudwaras
- Dress modestly when visiting religious sites
- Ask permission before photographing locals
- Bargain respectfully at street markets

## Don'ts
- Don't point your feet at religious icons
- Don't eat with your left hand (considered impolite)
- Don't drink tap water — always buy sealed bottles
- Don't accept food/drinks from strangers on trains`,
  },
];

// ── Key Delhi Metro Stations (subset for UI) ───────────────
export const DELHI_METRO_STATIONS: MetroStation[] = [
  { id: "ms_001", name: "Rajiv Chowk", line: "Yellow/Blue", lineColor: "#FFCD00", coordinates: { latitude: 28.6328, longitude: 77.2199 } },
  { id: "ms_002", name: "Kashmere Gate", line: "Red/Yellow/Violet", lineColor: "#EE1B2E", coordinates: { latitude: 28.6675, longitude: 77.2282 } },
  { id: "ms_003", name: "Central Secretariat", line: "Yellow/Violet", lineColor: "#FFCD00", coordinates: { latitude: 28.6148, longitude: 77.2114 } },
  { id: "ms_004", name: "Hauz Khas", line: "Yellow/Magenta", lineColor: "#FFCD00", coordinates: { latitude: 28.5432, longitude: 77.2069 } },
  { id: "ms_005", name: "New Delhi", line: "Yellow/Airport Express", lineColor: "#FFCD00", coordinates: { latitude: 28.6425, longitude: 77.2193 } },
  { id: "ms_006", name: "Chandni Chowk", line: "Yellow", lineColor: "#FFCD00", coordinates: { latitude: 28.6562, longitude: 77.2301 } },
  { id: "ms_007", name: "HUDA City Centre", line: "Yellow", lineColor: "#FFCD00", coordinates: { latitude: 28.4595, longitude: 77.0722 } },
  { id: "ms_008", name: "Dwarka Sector 21", line: "Blue/Airport Express", lineColor: "#2B3990", coordinates: { latitude: 28.5527, longitude: 77.0586 } },
  { id: "ms_009", name: "Noida Sector 62", line: "Blue", lineColor: "#2B3990", coordinates: { latitude: 28.6273, longitude: 77.3651 } },
  { id: "ms_010", name: "Botanical Garden", line: "Blue/Magenta", lineColor: "#2B3990", coordinates: { latitude: 28.5647, longitude: 77.3340 } },
  { id: "ms_011", name: "IGI Airport T3", line: "Airport Express", lineColor: "#F68B1F", coordinates: { latitude: 28.5562, longitude: 77.0875 }, isAirportExpress: true },
  { id: "ms_012", name: "Aerocity", line: "Airport Express", lineColor: "#F68B1F", coordinates: { latitude: 28.5553, longitude: 77.0959 }, isAirportExpress: true },
  { id: "ms_013", name: "Dhaula Kuan", line: "Airport Express", lineColor: "#F68B1F", coordinates: { latitude: 28.5918, longitude: 77.1545 }, isAirportExpress: true },
  { id: "ms_014", name: "Lajpat Nagar", line: "Violet", lineColor: "#8B2D8B", coordinates: { latitude: 28.5694, longitude: 77.2378 } },
  { id: "ms_015", name: "Nehru Place", line: "Violet", lineColor: "#8B2D8B", coordinates: { latitude: 28.5494, longitude: 77.2528 } },
  { id: "ms_016", name: "Mandi House", line: "Blue/Violet", lineColor: "#2B3990", coordinates: { latitude: 28.6257, longitude: 77.2343 } },
  { id: "ms_017", name: "INA", line: "Yellow", lineColor: "#FFCD00", coordinates: { latitude: 28.5742, longitude: 77.2098 } },
  { id: "ms_018", name: "Saket", line: "Yellow", lineColor: "#FFCD00", coordinates: { latitude: 28.5235, longitude: 77.2130 } },
  { id: "ms_019", name: "Janakpuri West", line: "Blue/Magenta", lineColor: "#2B3990", coordinates: { latitude: 28.6286, longitude: 77.0810 } },
  { id: "ms_020", name: "Kalkaji Mandir", line: "Violet/Magenta", lineColor: "#8B2D8B", coordinates: { latitude: 28.5494, longitude: 77.2578 } },
];

// ── Filter chips for search ────────────────────────────────
export const SEARCH_FILTER_CHIPS = ["All", "Attractions", "Food", "Hospitals", "Alerts"] as const;
export type SearchFilterChip = (typeof SEARCH_FILTER_CHIPS)[number];

export interface EmergencyService {
  id: string;
  name: string;
  type: "hospital" | "police" | "pharmacy";
  coordinates: Coordinates;
  phone: string;
}

export const EMERGENCY_SERVICES: EmergencyService[] = [
  { id: "es_h1", name: "AIIMS New Delhi", type: "hospital", coordinates: { latitude: 28.5659, longitude: 77.2090 }, phone: "102" },
  { id: "es_h2", name: "Safdarjung Hospital", type: "hospital", coordinates: { latitude: 28.5684, longitude: 77.2057 }, phone: "102" },
  { id: "es_h3", name: "Sir Ganga Ram Hospital", type: "hospital", coordinates: { latitude: 28.6385, longitude: 77.1895 }, phone: "102" },
  { id: "es_p1", name: "Connaught Place Police Station", type: "police", coordinates: { latitude: 28.6315, longitude: 77.2167 }, phone: "100" },
  { id: "es_p2", name: "Hauz Khas Police Station", type: "police", coordinates: { latitude: 28.5492, longitude: 77.2001 }, phone: "100" },
  { id: "es_p3", name: "Chanakyapuri Police Station", type: "police", coordinates: { latitude: 28.5900, longitude: 77.1700 }, phone: "100" },
];

// ── Haversine helper ───────────────────────────────────────
export function haversineDistance(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLng = toRad(coord2.longitude - coord1.longitude);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.latitude)) *
      Math.cos(toRad(coord2.latitude)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // meters
}

export function formatDistanceKm(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
