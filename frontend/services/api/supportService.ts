import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ============================================================
// Types
// ============================================================
export interface SupportTicketPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportTicketResponse {
  success: boolean;
  ticketRef: string;
  message: string;
}

export interface SupportErrorResponse {
  success: false;
  errors: Record<string, string>;
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
// POST /support/tickets — Submit support ticket
// ============================================================
export async function submitSupportTicket(
  payload: SupportTicketPayload
): Promise<SupportTicketResponse> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please log in again.");
  }

  const response = await fetch(`${BACKEND_URL}/support/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.errors) {
      const firstError = Object.values(data.errors)[0] as string;
      throw new Error(firstError || "Validation failed");
    }
    throw new Error(data.message || "Failed to submit ticket");
  }

  return data as SupportTicketResponse;
}
