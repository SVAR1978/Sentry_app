import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  RefreshControl,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  Ticket,
  Plane,
  Hotel,
  Bus,
  Train,
  ShieldCheck,
  ExternalLink,
  Clock,
  Calendar,
  TicketX,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";
import {
  BookingTicket,
  fetchMyTickets,
} from "../../services/api/bookingService";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  background: "#F2F2F2",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  success: "#10B981",
  cardBorder: "rgba(33, 16, 11, 0.05)",
};

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ size: number; color: string; strokeWidth: number }>
> = {
  flights: Plane,
  hotels: Hotel,
  buses: Bus,
  trains: Train,
};

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category.toLowerCase()] || Ticket;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export default function MyTicketsScreen() {
  const [tickets, setTickets] = useState<BookingTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const loadTickets = useCallback(async () => {
    try {
      const data = await fetchMyTickets();
      setTickets(data);
    } catch (error) {
      console.error("[MyTickets] Load failed:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [loadTickets, fadeAnim]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTickets();
  }, [loadTickets]);

  const handleOpenPartner = useCallback(async (url: string, name: string) => {
    if (!url.startsWith("https://")) {
      Alert.alert("Security Warning", "This URL is not secure.");
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", `Could not open ${name}.`);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.navigate("/profile")}
            style={styles.backButton}
            accessibilityLabel="Go back to profile"
            accessibilityRole="button"
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Tickets</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.iconSection}>
          <View style={styles.iconWrapper}>
            <View style={styles.iconBorder}>
              <Ticket size={48} color={COLORS.white} strokeWidth={1.5} />
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            {loading
              ? "Loading..."
              : `${tickets.length} booking${tickets.length !== 1 ? "s" : ""} found`}
          </Text>
        </View>
      </LinearGradient>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text
            style={styles.loadingText}
            accessibilityLiveRegion="polite"
          >
            Loading your tickets...
          </Text>
        </View>
      ) : tickets.length === 0 ? (
        <Animated.View style={[styles.emptyState, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconContainer}>
            <TicketX size={56} color={COLORS.secondary} strokeWidth={1.5} />
          </View>
          <Text style={styles.emptyTitle}>No Tickets Yet</Text>
          <Text style={styles.emptySubtitle}>
            Book travel through our verified partners on the Home screen and
            your booking history will appear here.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.navigate("/")}
            activeOpacity={0.85}
          >
            <Text style={styles.browseButtonText}>Browse Partners</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {tickets.map((ticket, index) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                index={index}
                onOpen={() =>
                  handleOpenPartner(ticket.partnerUrl, ticket.partnerName)
                }
              />
            ))}
          </Animated.View>

          <Text style={styles.footerNote}>
            Tickets are based on your verified visits to partner platforms.
            Pull down to refresh.
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

// ============================================================
// Ticket Card
// ============================================================
interface TicketCardProps {
  ticket: BookingTicket;
  index: number;
  onOpen: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, index, onOpen }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const CategoryIcon = getCategoryIcon(ticket.partnerCategory);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const categoryColor =
    ticket.partnerCategory === "flights"
      ? COLORS.primary
      : ticket.partnerCategory === "hotels"
      ? "#10B981"
      : ticket.partnerCategory === "trains"
      ? "#3B82F6"
      : COLORS.secondary;

  const categoryBg =
    ticket.partnerCategory === "flights"
      ? "rgba(33, 16, 11, 0.06)"
      : ticket.partnerCategory === "hotels"
      ? "rgba(16, 185, 129, 0.08)"
      : ticket.partnerCategory === "trains"
      ? "rgba(59, 130, 246, 0.08)"
      : "rgba(140, 125, 121, 0.08)";

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onOpen}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.ticketWrapper}
      accessibilityLabel={`Booking with ${ticket.partnerName}, ${ticket.partnerCategory}, visited on ${formatDate(ticket.visitedAt)}`}
      accessibilityRole="button"
    >
      <Animated.View
        style={[styles.ticketCard, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Ticket Number Badge */}
        <View style={styles.ticketNumberBadge}>
          <Text style={styles.ticketNumberText}>#{index + 1}</Text>
        </View>

        {/* Main Content */}
        <View style={styles.ticketTop}>
          <View
            style={[
              styles.categoryIconContainer,
              { backgroundColor: categoryBg },
            ]}
          >
            <CategoryIcon
              size={24}
              color={categoryColor}
              strokeWidth={2.5}
            />
          </View>

          <View style={styles.ticketInfo}>
            <View style={styles.ticketNameRow}>
              <Text style={styles.ticketPartnerName} numberOfLines={1}>
                {ticket.partnerName}
              </Text>
              {ticket.isVerified && (
                <ShieldCheck size={16} color="#10B981" strokeWidth={2.5} />
              )}
            </View>
            <View style={styles.categoryTagSmall}>
              <Text style={styles.categoryTagSmallText}>
                {ticket.partnerCategory.charAt(0).toUpperCase() +
                  ticket.partnerCategory.slice(1)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.openBtn}
            onPress={onOpen}
            accessibilityLabel={`Open ${ticket.partnerName} website`}
          >
            <ExternalLink size={16} color={COLORS.primary} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        {/* Dashed Separator (ticket tear effect) */}
        <View style={styles.tearLine}>
          <View style={styles.tearCircleLeft} />
          <View style={styles.dashedLine} />
          <View style={styles.tearCircleRight} />
        </View>

        {/* Bottom details */}
        <View style={styles.ticketBottom}>
          <View style={styles.detailItem}>
            <Calendar size={13} color={COLORS.secondary} strokeWidth={2.5} />
            <Text style={styles.detailText}>
              {formatDate(ticket.visitedAt)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={13} color={COLORS.secondary} strokeWidth={2.5} />
            <Text style={styles.detailText}>
              {formatTime(ticket.visitedAt)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.durationText}>
              {formatDuration(ticket.durationMs)}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  iconSection: {
    alignItems: "center",
    gap: 12,
  },
  iconWrapper: {
    position: "relative",
  },
  iconBorder: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: -0.2,
  },

  // Loading / Center
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "600",
  },

  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  browseButton: {
    marginTop: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 50,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  browseButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  // Scroll Content
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Ticket Card
  ticketWrapper: {
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  ticketNumberBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
  },
  ticketNumberText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.secondary,
  },
  ticketTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  ticketInfo: {
    flex: 1,
    gap: 6,
  },
  ticketNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ticketPartnerName: {
    fontSize: 17,
    fontWeight: "800",
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  categoryTagSmall: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderRadius: 20,
  },
  categoryTagSmallText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.secondary,
    letterSpacing: 0.3,
  },
  openBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Tear Line (ticket effect)
  tearLine: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  tearCircleLeft: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.background,
    marginLeft: -26,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
    marginHorizontal: 8,
  },
  tearCircleRight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.background,
    marginRight: -26,
  },

  // Bottom details
  ticketBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.success,
  },

  // Footer
  footerNote: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 16,
    paddingHorizontal: 20,
    fontWeight: "500",
  },
});
