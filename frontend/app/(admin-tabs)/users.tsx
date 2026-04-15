import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Animated,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Avatar, Card, Chip, Searchbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Users,
  UserCheck,
  UserX,
  Wifi,
  WifiOff,
  Search,
  RefreshCw,
  Clock,
  UserPlus,
  X,
  SlidersHorizontal,
} from "lucide-react-native";
import { useSocket } from "../../store/SocketContext";

const COLORS = {
  primary: "#21100B",
  accent: "#4A4341",
  secondary: "#8C7D79",
  error: "#D93636",
  success: "#10B981",
  warning: "#F59E0B",
  info: "#3B82F6",
  background: "#F2F2F2",
  surface: "#FFFFFF",
  text: "#1A1818",
  textLight: "#4A4341",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  border: "#EDE7E3",
  cardBorder: "rgba(33, 16, 11, 0.05)",
  iconBg: "rgba(33, 16, 11, 0.04)",
};

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// ─── TYPES ────────────────────────────────────────────────────────
interface UserData {
  id: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
}

// ─── HELPERS ──────────────────────────────────────────────────────
function getRelativeTime(isoString: string): string {
  const now = Date.now();
  const then = new Date(isoString).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return "Just now";
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getAvatarUrl(index: number): string {
  return `https://avatar.iran.liara.run/public/${(index % 100) + 1}`;
}

// ─── ANIMATED CARD COMPONENT ──────────────────────────────────────
const AnimatedUserCard = ({ user, index, isOnline }: { user: UserData; index: number; isOnline: boolean }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    const delay = Math.min(index * 70, 700);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        tension: 65,
        friction: 6.5,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
        tension: 70,
        friction: 7,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim, index]);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [
        { translateY: slideAnim },
        { scale: scaleAnim }
      ]
    }}>
      <Card style={styles.userCard}>
        <Card.Content style={styles.userContent}>
          {/* Avatar with online indicator */}
          <View style={styles.avatarContainer}>
            <View style={[
              styles.avatarRing,
              isOnline && styles.avatarRingOnline,
            ]}>
              <Avatar.Image
                size={48}
                source={{ uri: getAvatarUrl(index) }}
              />
            </View>
            <View
              style={[
                styles.onlineDot,
                {
                  backgroundColor: isOnline ? COLORS.success : COLORS.secondary,
                },
              ]}
            />
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || "Unnamed User"}</Text>
            <Text style={styles.userPhone}>{user.phone || "No phone"}</Text>
            <View style={styles.userMeta}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: isOnline
                      ? `${COLORS.success}12`
                      : `${COLORS.secondary}12`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusDotSmall,
                    {
                      backgroundColor: isOnline ? COLORS.success : COLORS.secondary,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isOnline ? COLORS.success : COLORS.secondary },
                  ]}
                >
                  {isOnline ? "Online" : "Offline"}
                </Text>
              </View>
              <View style={styles.joinedTag}>
                <Clock size={10} color={COLORS.textMuted} strokeWidth={2} />
                <Text style={styles.joinedText}>
                  {getRelativeTime(user.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

// ─── COMPONENT ────────────────────────────────────────────────────
export default function UsersScreen() {
  const { onLiveUsersCount, onUserActivity, isConnected } = useSocket();
  const insets = useSafeAreaInsets();

  // ─── STATE ──────────────────────────────────────────────
  const [users, setUsers] = useState<UserData[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Timer for relative time updates
  const [, setTick] = useState(0);

  // ─── FETCH USERS FROM BACKEND ──────────────────────────
  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/stats/users`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (data.users) {
        setUsers(data.users);
      }
    } catch (err: any) {
      console.error("[UsersScreen] Failed to fetch users:", err);
      setError("Failed to load users. Pull to retry.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ─── INITIAL LOAD ──────────────────────────────────────
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ─── ENTRY ANIMATION ──────────────────────────────────
  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    }
  }, [loading]);

  // ─── REAL-TIME: ONLINE USER IDS ────────────────────────
  useEffect(() => {
    const unsubscribe = onLiveUsersCount((event) => {
      if (event.payload.activeUserIds) {
        setOnlineUserIds(new Set(event.payload.activeUserIds));
      }
    });
    return unsubscribe;
  }, [onLiveUsersCount]);

  // ─── REAL-TIME: NEW USER SIGNUPS ───────────────────────
  useEffect(() => {
    const unsubscribe = onUserActivity((event) => {
      if (event.payload.action === "SIGNUP") {
        // Refetch user list to include the new user
        fetchUsers();
      }
    });
    return unsubscribe;
  }, [onUserActivity, fetchUsers]);

  // ─── TICK for relative time updates every 60s ──────────
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── FILTER & SEARCH ──────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  }).sort((a, b) => {
    const aOnline = onlineUserIds.has(a.id);
    const bOnline = onlineUserIds.has(b.id);
    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;
    // Default to newest first if both have the same status
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const onlineCount = users.filter((u) => onlineUserIds.has(u.id)).length;
  const offlineCount = users.length - onlineCount;

  const visibleUsers = showAllUsers ? filteredUsers : filteredUsers.slice(0, 5);

  // ─── RENDER ───────────────────────────────────────────
  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 8 }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>User Management</Text>
            <Text style={styles.headerSubtitle}>
              {users.length} total users
            </Text>
          </View>
          <View style={styles.connectionIndicator}>
            {isConnected ? (
              <>
                <View style={styles.liveDotSmall} />
                <Wifi size={14} color={COLORS.success} strokeWidth={2} />
              </>
            ) : (
              <>
                <View style={[styles.liveDotSmall, { backgroundColor: COLORS.error }]} />
                <WifiOff size={14} color={COLORS.error} strokeWidth={2} />
              </>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={[styles.quickStatItem, { backgroundColor: `${COLORS.success}12` }]}>
            <UserCheck size={16} color={COLORS.success} strokeWidth={2} />
            <Text style={[styles.quickStatValue, { color: COLORS.success }]}>{onlineCount}</Text>
            <Text style={styles.quickStatLabel}>Online</Text>
          </View>
          <View style={[styles.quickStatItem, { backgroundColor: `${COLORS.secondary}12` }]}>
            <UserX size={16} color={COLORS.secondary} strokeWidth={2} />
            <Text style={[styles.quickStatValue, { color: COLORS.secondary }]}>{offlineCount}</Text>
            <Text style={styles.quickStatLabel}>Offline</Text>
          </View>
          <View style={[styles.quickStatItem, { backgroundColor: `${COLORS.primary}12` }]}>
            <Users size={16} color={COLORS.primary} strokeWidth={2} />
            <Text style={[styles.quickStatValue, { color: COLORS.primary }]}>{users.length}</Text>
            <Text style={styles.quickStatLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.customSearchWrapper, isFocused && styles.customSearchWrapperFocused]}>
          <Search size={20} color={isFocused ? COLORS.primary : COLORS.textMuted} strokeWidth={2.5} />
          <TextInput
            style={styles.customSearchInput}
            placeholder="Search by name or phone..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearIconBtn}>
              <X size={18} color={COLORS.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.filterIconBtn}>
              <SlidersHorizontal size={18} color={COLORS.textMuted} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* User List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchUsers()}>
            <RefreshCw size={16} color={COLORS.white} strokeWidth={2} />
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScrollView
            style={styles.userList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchUsers(true)}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
          >
            {filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Search size={40} color={COLORS.textMuted} strokeWidth={1.5} />
                <Text style={styles.emptyTitle}>No users found</Text>
                <Text style={styles.emptySubtitle}>
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "No users match the selected filter"}
                </Text>
              </View>
            ) : (
              <>
                {visibleUsers.map((user, index) => {
                  const isOnline = onlineUserIds.has(user.id);
                  return (
                    <AnimatedUserCard
                      key={user.id}
                      user={user}
                      index={index}
                      isOnline={isOnline}
                    />
                  );
                })}
                {filteredUsers.length > 5 && (
                  <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={() => setShowAllUsers(!showAllUsers)}
                  >
                    <Text style={styles.seeAllBtnText}>
                      {showAllUsers ? "Show Less" : `See All Users (${filteredUsers.length})`}
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </ScrollView>
        </Animated.View>
      )}

    </View>
  );
}

// ─── STYLES ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: "500",
  },
  connectionIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  liveDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: COLORS.success,
  },
  quickStats: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  quickStatItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 6,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  quickStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  customSearchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  customSearchWrapperFocused: {
    borderColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    backgroundColor: "#FDFDFD",
  },
  customSearchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
    height: "100%",
  },
  clearIconBtn: {
    padding: 6,
    backgroundColor: `${COLORS.secondary}15`,
    borderRadius: 14,
  },
  filterIconBtn: {
    padding: 6,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextSelected: {
    color: COLORS.white,
  },
  userList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    marginBottom: 12,
    borderRadius: 24,
    elevation: 3,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  userContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
  },
  avatarRing: {
    padding: 2,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  avatarRingOnline: {
    borderColor: COLORS.success,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },
  userInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  userPhone: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 5,
  },
  statusDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  joinedTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  joinedText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  // ─── Loading / Error / Empty States ─────────────────────
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.error,
    fontWeight: "600",
    textAlign: "center",
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.white,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    maxWidth: 240,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  seeAllBtn: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: `${COLORS.primary}0D`,
    borderRadius: 16,
  },
  seeAllBtnText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 14,
  },
});
