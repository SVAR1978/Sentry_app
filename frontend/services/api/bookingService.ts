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
// Fallback Data
// ============================================================
const FALLBACK_PARTNERS: BookingPartner[] = [
  {
    id: "mmt-fallback-1",
    name: "MakeMyTrip",
    description: "Book flights and hotels securely",
    url: "https://www.makemytrip.com",
    logoUrl: null,
    category: "flights",
    isVerified: true,
    priority: 100,
  },
  {
    id: "oyo-fallback-2",
    name: "OYO Rooms",
    description: "Budget & premium hotels across India",
    url: "https://www.oyorooms.com",
    logoUrl: null,
    category: "hotels",
    isVerified: true,
    priority: 90,
  },
  {
    id: "redbus-fallback-3",
    name: "RedBus",
    description: "Intercity bus tickets with live tracking",
    url: "https://www.redbus.in",
    logoUrl: null,
    category: "buses",
    isVerified: true,
    priority: 80,
  },
  {
    id: "irctc-fallback-4",
    name: "IRCTC Train Booking",
    description: "Official Indian Railways ticket booking",
    url: "https://www.irctc.co.in/nget/train-search",
    logoUrl: null,
    category: "trains",
    isVerified: true,
    priority: 70,
  },
];

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

    return validPartners;
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
    return data.recentPartners.filter((p) => isUrlSafe(p.url));
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
