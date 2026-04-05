// ============================================================
// Static FAQ Data — No API required, loads instantly
// ============================================================

export type FAQCategory = "account" | "bookings" | "safety" | "app_issues";

export interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
  isPopular?: boolean;
}

export const CATEGORY_LABELS: Record<FAQCategory | "all", string> = {
  all: "All",
  account: "Account",
  bookings: "Bookings",
  safety: "Safety",
  app_issues: "App Issues",
};

export const FAQ_DATA: FAQ[] = [
  // ── Account ──────────────────────────────────────────────
  {
    id: "a1",
    category: "account",
    question: "How do I update my personal information?",
    answer:
      "Go to Profile → Personal Information. Update your name, phone number, or avatar, then tap Save Changes. All updates sync in real time with our servers.",
    isPopular: true,
  },
  {
    id: "a2",
    category: "account",
    question: "How do I reset my password?",
    answer:
      'On the login screen, tap "Forgot Password", enter your registered email address, and follow the reset link sent to your inbox. The link expires in 15 minutes for security.',
  },
  {
    id: "a3",
    category: "account",
    question: "How do I delete my account?",
    answer:
      "Contact our support team via Help Center → Contact Support. Provide your registered email and reason for deletion. Your data will be permanently erased within 72 hours per our privacy policy.",
  },
  {
    id: "a4",
    category: "account",
    question: "How do I update my home address?",
    answer:
      'Go to Profile → My Address. You can type your address manually or use the "Locate Me" feature to auto-detect your current location. This address is used for emergency response dispatch.',
  },

  // ── Bookings ─────────────────────────────────────────────
  {
    id: "b1",
    category: "bookings",
    question: "Why was I redirected to an external website to book?",
    answer:
      "We partner with trusted platforms like MakeMyTrip, Klook, GetYourGuide, and BookMyShow. Clicking a partner opens their site in your browser. Your visit is tracked automatically and appears under My Tickets when you return.",
    isPopular: true,
  },
  {
    id: "b2",
    category: "bookings",
    question: "Is my payment information safe on partner sites?",
    answer:
      "Absolutely. All payments are handled directly by the partner platform using their own secure checkout (SSL/TLS encrypted). Our app never stores, accesses, or transmits your payment details.",
    isPopular: true,
  },
  {
    id: "b3",
    category: "bookings",
    question: "Where can I see my booking history?",
    answer:
      "Go to Profile → My Tickets. You'll see a chronological list of all your verified visits to partner platforms, including the date, time, and duration of each session. Pull down to refresh.",
  },
  {
    id: "b4",
    category: "bookings",
    question: "What does a 'genuine visit' mean?",
    answer:
      "A genuine visit is when you spend 5 seconds or more on a partner website. Quick, accidental taps (under 5 seconds) are filtered out and won't appear in your tickets.",
  },

  // ── Safety ───────────────────────────────────────────────
  {
    id: "s1",
    category: "safety",
    question: "How do I trigger an SOS alert?",
    answer:
      "Press and hold the SOS button on the home screen for 3 seconds. This will immediately alert your emergency contacts and notify nearby admins with your real-time GPS coordinates.",
  },
  {
    id: "s2",
    category: "safety",
    question: "How do I add emergency contacts?",
    answer:
      "Go to Settings → Emergency Contacts. Add contacts by their email address. When you trigger an SOS, these contacts receive an automated email with your location and a live tracking link.",
  },
  {
    id: "s3",
    category: "safety",
    question: "How do I report an unsafe location?",
    answer:
      "Use the SOS button on the home screen. Your report includes your GPS coordinates and is sent directly to the admin dashboard for immediate review and response.",
  },
  {
    id: "s4",
    category: "safety",
    question: "Can admin track my location in real time?",
    answer:
      "Only during active SOS alerts. Admins see live coordinates on their dashboard map to dispatch help. Location sharing stops automatically when the alert is resolved.",
  },

  // ── App Issues ───────────────────────────────────────────
  {
    id: "i1",
    category: "app_issues",
    question: "The app is crashing. What should I do?",
    answer:
      "Try force-closing and reopening the app. If the issue persists, update to the latest version from the App Store or Google Play. Still broken? Go to Help Center → Contact Support and include your device model and OS version.",
  },
  {
    id: "i2",
    category: "app_issues",
    question: "I am not receiving notifications. How do I fix this?",
    answer:
      "Go to your phone Settings → Notifications → Sentry App and ensure notifications are enabled. Also check that Do Not Disturb mode is off. If using Android, ensure the app is excluded from battery optimization.",
  },
  {
    id: "i3",
    category: "app_issues",
    question: "The map or weather widget is not loading.",
    answer:
      "Ensure you have a stable internet connection and location services enabled. Try pulling down to refresh the home screen. If the problem persists, clear the app cache and restart.",
  },
  {
    id: "i4",
    category: "app_issues",
    question: "The chatbot is not responding.",
    answer:
      "The AI chatbot requires an active WebSocket connection. Check your internet, then close and reopen the chat. If it still doesn't work, restart the app entirely.",
  },
];
