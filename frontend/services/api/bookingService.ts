import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ============================================================
// Types
// ============================================================
export interface BookingPartner {
  id: string;
  name: string;
  description: string;
  url: string;
  logoUrl: string | null;
  category: string;
  isVerified: boolean;
  priority: number;
  lastVisitedAt?: string;
}

interface PartnersResponse {
  partners: BookingPartner[];
}

interface RecentPartnersResponse {
  recentPartners: BookingPartner[];
}

interface RecordVisitResponse {
  message: string;
  visitId: string;
  isGenuine: boolean;
}

// ============================================================
// Security: URL Whitelist Validation
// ============================================================
function isUrlSafe(url: string): boolean {
  return url.startsWith("https://");
}

// ============================================================
// Reliable Logo URLs (Google Favicon API)
// ============================================================
const HIGH_RES_LOGOS: Record<string, string> = {
  // RedBus Google Favicon is 16px blurry, explicitly map to high-res app icon
  "redbus.in": "https://play-lh.googleusercontent.com/5ZxVI65M9_yQQHgsY2f_lvSFD9E4Oqvfgxkg-E-MZwWt1M65-6HLY3twREAubQtZqqo",
  "www.redbus.in": "https://play-lh.googleusercontent.com/5ZxVI65M9_yQQHgsY2f_lvSFD9E4Oqvfgxkg-E-MZwWt1M65-6HLY3twREAubQtZqqo",
  
  // Goibibo's high-res icon
  "goibibo.com": "https://play-lh.googleusercontent.com/k9xVFF8T_hL9-t1PoTpS4dCm0e_1CZDaxEs0iG7HXLPjp0seF6QfyQZzJwlTj6kRpSYQ",
  "www.goibibo.com": "https://play-lh.googleusercontent.com/k9xVFF8T_hL9-t1PoTpS4dCm0e_1CZDaxEs0iG7HXLPjp0seF6QfyQZzJwlTj6kRpSYQ",
  
  // Uber's high-res icon
  "uber.com": "https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrBLekb7cyP3kyg5BB1uUuc55zfcnbkCDLHFTBwZfYiu1aDI",
  "www.uber.com": "https://play-lh.googleusercontent.com/AQtSF5Sl18yp3mQ2tcbOrBLekb7cyP3kyg5BB1uUuc55zfcnbkCDLHFTBwZfYiu1aDI",
  
  // IRCTC's high-res icon (Google Favicon 404s for this domain)
  "irctc.co.in": "https://play-lh.googleusercontent.com/pOhc9TAENgN1MXuU42s6tiT7KCJ-PSl7zoSH9r_AfIx-rkfIOHNvJHanJPw-HBa09w",
  "www.irctc.co.in": "https://play-lh.googleusercontent.com/pOhc9TAENgN1MXuU42s6tiT7KCJ-PSl7zoSH9r_AfIx-rkfIOHNvJHanJPw-HBa09w",

  // IndiGo Airlines high-res icon
  "goindigo.in": "https://play-lh.googleusercontent.com/zG1e9Pdw27RYpUo_TpSZcD-zjCeShkN5pxwgy7L-e9hra170T_SpBzcUc5nsBu3gWQ",
  "www.goindigo.in": "https://play-lh.googleusercontent.com/zG1e9Pdw27RYpUo_TpSZcD-zjCeShkN5pxwgy7L-e9hra170T_SpBzcUc5nsBu3gWQ",
};

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    
    // Serve high res variants directly if available
    if (HIGH_RES_LOGOS[domain]) {
      return HIGH_RES_LOGOS[domain];
    }
    
    // Uses Google's reliable favicon service (force 128px)
    return `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://${domain}&size=128`;
  } catch {
    return "";
  }
}

// ============================================================
// Fallback Data
// ============================================================
const FALLBACK_PARTNERS: BookingPartner[] = [
  {
    id: "mmt-fallback-1",
    name: "MakeMyTrip",
    description: "Book flights and hotels securely",
    url: "https://www.makemytrip.com",
    logoUrl: getFaviconUrl("https://www.makemytrip.com"),
    category: "flights",
    isVerified: true,
    priority: 100,
  },
  {
    id: "goibibo-fallback-5",
    name: "Goibibo",
    description: "Flights, hotels & travel packages",
    url: "https://www.goibibo.com",
    logoUrl: getFaviconUrl("https://www.goibibo.com"),
    category: "flights",
    isVerified: true,
    priority: 95,
  },
  {
    id: "oyo-fallback-2",
    name: "OYO Rooms",
    description: "Budget & premium hotels across India",
    url: "https://www.oyorooms.com",
    logoUrl: getFaviconUrl("https://www.oyorooms.com"),
    category: "hotels",
    isVerified: true,
    priority: 90,
  },
  {
    id: "yatra-fallback-7",
    name: "Yatra",
    description: "Complete travel booking platform",
    url: "https://www.yatra.com",
    logoUrl: getFaviconUrl("https://www.yatra.com"),
    category: "flights",
    isVerified: true,
    priority: 85,
  },
  {
    id: "redbus-fallback-3",
    name: "RedBus",
    description: "Intercity bus tickets with live tracking",
    url: "https://www.redbus.in",
    logoUrl: getFaviconUrl("https://www.redbus.in"),
    category: "buses",
    isVerified: true,
    priority: 80,
  },
  {
    id: "irctc-fallback-4",
    name: "IRCTC",
    description: "Official Indian Railways ticket booking",
    url: "https://www.irctc.co.in/nget/train-search",
    logoUrl: getFaviconUrl("https://www.irctc.co.in"),
    category: "trains",
    isVerified: true,
    priority: 70,
  },
  {
    id: "ola-fallback-6",
    name: "Ola",
    description: "Ride hailing & cab booking",
    url: "https://www.olacabs.com",
    logoUrl: getFaviconUrl("https://www.olacabs.com"),
    category: "buses",
    isVerified: true,
    priority: 65,
  },
  {
    id: "uber-fallback-8",
    name: "Uber",
    description: "Rides on demand across cities",
    url: "https://www.uber.com",
    logoUrl: getFaviconUrl("https://www.uber.com"),
    category: "buses",
    isVerified: true,
    priority: 60,
  },
];

// ============================================================
// Helper: Enrich partner with reliable logo URL
// ============================================================
function enrichPartnerLogo(partner: BookingPartner): BookingPartner {
  // Always override unreliable CDN urls with Google Favicons to prevent Image load failures
  return { ...partner, logoUrl: getFaviconUrl(partner.url) };
}

// ============================================================
// Auth helper
// ============================================================
async function getAuthToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem("@sentryapp:token");
  } catch {
    return null;
  }
}

// ============================================================
// GET /booking-partners — Fetch all active partners
// ============================================================
export async function fetchBookingPartners(): Promise<BookingPartner[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/booking-partners`);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        DeviceEventEmitter.emit("auth:unauthorized");
      }
      throw new Error(`Failed to fetch partners: ${response.status}`);
    }

    const data: PartnersResponse = await response.json();

    // Double-check HTTPS on client side (defense-in-depth)
    const validPartners = data.partners.filter((p) => isUrlSafe(p.url));
    
    if (validPartners.length === 0) {
      console.log("[BookingService] API returned 0 partners. Using fallback data to prevent empty UI.");
      return FALLBACK_PARTNERS;
    }

    // Enrich all partners with reliable logos
    return validPartners.map(enrichPartnerLogo);
  } catch (error) {
    console.error("[BookingService] fetchBookingPartners failed:", error);
    return FALLBACK_PARTNERS;
  }
}

// ============================================================
// GET /booking-partners/recently-visited — Fetch recent visits
// ============================================================
export async function fetchRecentlyVisited(): Promise<BookingPartner[]> {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${BACKEND_URL}/booking-partners/recently-visited`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        DeviceEventEmitter.emit("auth:unauthorized");
      }
      throw new Error(`Failed to fetch recent: ${response.status}`);
    }

    const data: RecentPartnersResponse = await response.json();
    return data.recentPartners
      .filter((p) => isUrlSafe(p.url))
      .map(enrichPartnerLogo);
  } catch (error) {
    console.error("[BookingService] fetchRecentlyVisited failed:", error);
    return [];
  }
}

// ============================================================
// POST /booking-partners/visits — Record a user visit
// ============================================================
export async function recordPartnerVisit(
  partnerId: string,
  durationMs: number
): Promise<RecordVisitResponse | null> {
  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await fetch(`${BACKEND_URL}/booking-partners/visits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ partnerId, durationMs }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn("[BookingService] recordVisit failed:", errorData.message);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("[BookingService] recordPartnerVisit failed:", error);
    return null;
  }
}

// ============================================================
// Types for Ticket History
// ============================================================
export interface BookingTicket {
  id: string;
  partnerName: string;
  partnerCategory: string;
  partnerUrl: string;
  partnerLogoUrl: string | null;
  isVerified: boolean;
  durationMs: number;
  visitedAt: string;
}

interface TicketsResponse {
  tickets: BookingTicket[];
}

// ============================================================
// GET /booking-partners/my-tickets — Fetch user's ticket history
// ============================================================
export async function fetchMyTickets(): Promise<BookingTicket[]> {
  try {
    const token = await getAuthToken();
    if (!token) return [];

    const response = await fetch(
      `${BACKEND_URL}/booking-partners/my-tickets`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.status}`);
    }

    const data: TicketsResponse = await response.json();
    return data.tickets;
  } catch (error) {
    console.error("[BookingService] fetchMyTickets failed:", error);
    return [];
  }
}
