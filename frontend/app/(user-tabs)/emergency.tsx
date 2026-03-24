import {
  ShieldAlert,
  AlertTriangle,
  Plus,
  User,
  Phone,
  XCircle,
  Check,
  Share2,
  X,
  Radio,
  MapPin,
  Clock,
  CheckCircle,
  RefreshCw,
  Wifi,
  WifiOff,
} from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Location from "expo-location";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";
import { useSocket } from "../../store/SocketContext";
import sosService, {
  SOSAlertPayload,
  DeliveryLogEntry,
  AlertStatus,
} from "../../services/sos/sosAlertService";
import { AddContactModal } from "../../components/emergency/AddContactModal";
import { SafetyTips } from "../../components/emergency/SafetyTips";
import { CustomAlertModal, AlertConfig } from "../../components/emergency/CustomAlertModal";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#21100B",
  background: "#F5F1EE",
  surfaceContainerLow: "#EDE7E3",
  surfaceContainer: "#FFFFFF",
  surfaceContainerHigh: "#EDE7E3",
  text: "#1A1818",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  secondary: "#4A4341",
  accent: "#8C7D79",
  success: "#10B981",
  error: "#D93636",
  warning: "#D97706",
};

const SAFETY_TIPS = [
  "Share your live location with family",
  "Keep emergency contacts saved offline",
  "Note down local police station address",
  "Keep a copy of ID documents separately",
  "Store embassy contact for foreign travelers",
];

interface FamilyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

// ─── STATUS BADGE COMPONENT ────────────────────────────

const StatusBadge = ({ status }: { status: AlertStatus }) => {
  const map: Record<AlertStatus, { color: string; label: string }> = {
    PENDING: { color: COLORS.warning, label: "PENDING" },
    SENDING: { color: COLORS.warning, label: "SENDING" },
    SENT: { color: COLORS.success, label: "DISPATCHED" },
    FAILED: { color: COLORS.error, label: "FAILED" },
    ACKNOWLEDGED: { color: COLORS.success, label: "ACKNOWLEDGED" },
    RESOLVED: { color: COLORS.secondary, label: "RESOLVED" },
  };
  const { color, label } = map[status] || map.PENDING;

  return (
    <View style={[statusStyles.badge, { backgroundColor: `${color}18` }]}>
      <View style={[statusStyles.dot, { backgroundColor: color }]} />
      <Text style={[statusStyles.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

// ─── DELIVERY LOG ITEM COMPONENT ───────────────────────

const LogItem = ({ entry }: { entry: DeliveryLogEntry }) => {
  const colorMap: Record<string, string> = {
    info: COLORS.textMuted,
    success: COLORS.success,
    error: COLORS.error,
    warning: COLORS.warning,
  };
  const iconColor = colorMap[entry.status] || COLORS.textMuted;

  return (
    <View style={statusStyles.logItem}>
      <Text style={[statusStyles.logTime, { color: iconColor }]}>
        [{entry.timestamp}]
      </Text>
      <Text style={[statusStyles.logMessage, { color: COLORS.text }]}>
        {entry.message}
      </Text>
    </View>
  );
};

// ─── MAIN COMPONENT ────────────────────────────────────

export default function EmergencyScreen() {
  const { user } = useAuth();
  const { isConnected: wsConnected, sendLocation } = useSocket();
  const insets = useSafeAreaInsets();
  const [sosActive, setSosActive] = useState(false);
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("");

  // ─── SOS DISPATCH STATE ────────────────────────────
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [alertPayload, setAlertPayload] = useState<SOSAlertPayload | null>(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isSharingLocation, setIsSharingLocation] = useState(false);

  // ─── LOAD PERSISTED CONTACTS ───────────────────────
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const key = `@sentry_contacts_${user?.id || 'default'}`;
        const storedContacts = await AsyncStorage.getItem(key);
        if (storedContacts) {
          setFamilyContacts(JSON.parse(storedContacts));
        } else {
          // fallback to empty if no contacts found
          setFamilyContacts([]);
        }
      } catch (err) {
        console.error("[SOS] Failed to load contacts:", err);
      }
    };
    loadContacts();
  }, [user?.id]);

  // ─── SYSTEM ALERTS STATE ───────────────────────────
  const [alertConfig, setAlertConfig] = useState<AlertConfig>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const hideAlert = () => setAlertConfig((prev) => ({ ...prev, visible: false }));

  // ─── PULSE ANIMATION FOR ACTIVE SOS ────────────────
  useEffect(() => {
    if (sosActive) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [sosActive]);

  // ─── SUBSCRIBE TO SOS SERVICE UPDATES ──────────────
  useEffect(() => {
    const unsubscribe = sosService.subscribe((payload) => {
      setAlertPayload({ ...payload });
      // Auto-scroll delivery log
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsubscribe;
  }, []);

  // ─── SOS HANDLER ───────────────────────────────────

  const handleSOS = () => {
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    setSosActive(true);
    setShowDispatchModal(true);
  };

  const confirmAndDispatch = async () => {
    if (isDispatching) return;
    setIsDispatching(true);

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const contacts = familyContacts.map((c) => ({
        name: c.name,
        phone: c.phone,
        relationship: c.relationship,
      }));

      // If no contacts, dispatch to emergency services directly
      if (contacts.length === 0) {
        await sosService.quickDispatchToEmergency(
          user?.id || "UNKNOWN",
          user?.name || "Sentry User"
        );
      } else {
        await sosService.dispatch(
          user?.id || "UNKNOWN",
          user?.name || "Sentry User",
          contacts
        );
      }

      // Also stream location via WebSocket for live backend tracking
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        sendLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy,
          speed: loc.coords.speed,
          heading: loc.coords.heading,
          source: "GPS",
        });
      } catch (locErr) {
        console.warn("[SOS] Failed to send location via WebSocket:", locErr);
      }
    } catch (err) {
      console.error("[SOS] Dispatch error:", err);
    } finally {
      setIsDispatching(false);
    }
  };

  const cancelSOS = () => {
    sosService.clear();
    setSosActive(false);
    setShowDispatchModal(false);
    setAlertPayload(null);
  };

  const resolveSOS = async () => {
    await sosService.resolve();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      setSosActive(false);
      setShowDispatchModal(false);
      setAlertPayload(null);
    }, 1200);
  };

  // ─── CONTACT HANDLERS ─────────────────────────────

  const handleCall = async (number: string, name: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAlertConfig({
      visible: true,
      type: "confirm",
      title: `Call ${name}?`,
      message: `${number}`,
      confirmText: "Call Now",
      cancelText: "Cancel",
      onCancel: hideAlert,
      onConfirm: async () => {
        hideAlert();
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          await Linking.openURL(`tel:${number}`);
        } catch (error) {
          setTimeout(() => {
            setAlertConfig({
              visible: true,
              type: "error",
              title: "Unable to Open Dialer",
              message: `Please dial ${number} manually.`,
              confirmText: "Okay",
              onConfirm: hideAlert,
            });
          }, 500);
        }
      },
    });
  };

  const handleAddFamilyContact = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddModal(true);
  };

  const handleSaveContact = async () => {
    if (!newContactName.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Invalid Input",
        message: "Please enter a valid name.",
        confirmText: "Okay",
        onConfirm: hideAlert,
      });
      return;
    }
    if (!newContactPhone.trim()) {
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Invalid Input",
        message: "Please enter a valid phone number.",
        confirmText: "Okay",
        onConfirm: hideAlert,
      });
      return;
    }

    const newContact: FamilyContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || "Contact",
    };

    const updatedContacts = [...familyContacts, newContact];
    setFamilyContacts(updatedContacts);
    
    try {
      const key = `@sentry_contacts_${user?.id || 'default'}`;
      await AsyncStorage.setItem(key, JSON.stringify(updatedContacts));
    } catch (err) {
      console.error("[SOS] Failed to save contact:", err);
    }
    
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddModal(false);
    
    setAlertConfig({
      visible: true,
      type: "success",
      title: "Contact Added",
      message: `${newContactName} has been added to your emergency contacts.`,
      confirmText: "Continue",
      onConfirm: hideAlert,
    });
  };

  const handleCancelAddContact = () => {
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddModal(false);
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAlertConfig({
      visible: true,
      type: "confirm",
      title: "Delete Contact",
      message: `Are you sure you want to remove ${contactName} from emergency contacts?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      onCancel: hideAlert,
      onConfirm: async () => {
        hideAlert();
        const updatedContacts = familyContacts.filter((c) => c.id !== contactId);
        setFamilyContacts(updatedContacts);
        
        try {
          const key = `@sentry_contacts_${user?.id || 'default'}`;
          await AsyncStorage.setItem(key, JSON.stringify(updatedContacts));
        } catch (err) {
          console.error("[SOS] Failed to save after contact deletion:", err);
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      },
    });
  };

  // ─── SHARE LIVE LOCATION HANDLER ────────────────────

  const handleShareLiveLocation = async () => {
    if (isSharingLocation) return;
    setIsSharingLocation(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // 1. Request Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setIsSharingLocation(false);
        setAlertConfig({
          visible: true,
          type: "error",
          title: "Permission Denied",
          message: "Location permission is required to share your live location. Please enable it in Settings.",
          confirmText: "Open Settings",
          cancelText: "Cancel",
          onCancel: hideAlert,
          onConfirm: async () => {
            hideAlert();
            await Linking.openSettings();
          },
        });
        return;
      }

      // 2. Get Current Location (high accuracy)
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;

      // 3. Reverse Geocode for human-readable address
      let addressStr = "";
      try {
        const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geocode.length > 0) {
          const place = geocode[0];
          const parts = [
            place.name,
            place.street,
            place.city,
            place.region,
            place.postalCode,
          ].filter(Boolean);
          addressStr = parts.join(", ");
        }
      } catch {
        // geocode may fail — continue with coords
      }

      // 4. Build Share Message
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      const userName = user?.name || "A Sentry User";
      const timestamp = new Date().toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const shareMessage =
        `*LIVE LOCATION — Emergency Share*\n\n` +
        `From: ${userName}\n` +
        `Location: ${addressStr || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`}\n` +
        `Time: ${timestamp}\n\n` +
        `Google Maps URL:\n${mapsLink}\n\n` +
        `This location was shared via the Sentry Emergency App.`;

      // 5. Open Native Share Sheet
      const result = await Share.share({
        message: shareMessage,
        title: "My Live Location — Sentry Emergency",
      });

      if (result.action === Share.sharedAction) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setAlertConfig({
          visible: true,
          type: "success",
          title: "Location Shared",
          message: `Your live location has been shared successfully.`,
          confirmText: "Done",
          onConfirm: hideAlert,
        });
      }
    } catch (err: any) {
      console.error("[Location] Share error:", err);
      setAlertConfig({
        visible: true,
        type: "error",
        title: "Location Error",
        message: err?.message || "Unable to fetch your current location. Please check your GPS and try again.",
        confirmText: "Okay",
        onConfirm: hideAlert,
      });
    } finally {
      setIsSharingLocation(false);
    }
  };

  // ─── RENDER ────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ height: insets.top + 20 }} />

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.sosButtonOuter, sosActive && styles.sosButtonOuterActive]}
              onPress={handleSOS}
              activeOpacity={0.85}
            >
              <View style={styles.sosButtonRing}>
                <LinearGradient
                  colors={sosActive ? ["#D93636", "#A32020"] : ["#3E1911", "#1A1818"]}
                  style={styles.sosGradient}
                >
                  <AlertTriangle size={56} color={COLORS.white} />
                  <Text style={styles.sosText}>{sosActive ? "ACTIVE" : "SOS"}</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </Animated.View>
          {sosActive && (
            <View style={styles.activeIndicator}>
              <Radio size={14} color={COLORS.error} />
              <Text style={styles.activeIndicatorText}>Alert is active</Text>
            </View>
          )}
          {/* WebSocket Connection Status */}
          <View style={[styles.activeIndicator, { marginTop: 6 }]}>
            {wsConnected ? (
              <Wifi size={14} color={COLORS.success} />
            ) : (
              <WifiOff size={14} color={COLORS.error} />
            )}
            <Text style={[styles.activeIndicatorText, { color: wsConnected ? COLORS.success : COLORS.error }]}>
              {wsConnected ? "Live tracking active" : "Server disconnected"}
            </Text>
          </View>
        </View>

        {/* Family Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Family Contacts</Text>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddFamilyContact}>
              <Plus size={16} color={COLORS.primary} strokeWidth={3} />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          {familyContacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBg}>
                <User size={28} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptySubtitle}>
                Tap + Add to create your emergency contacts
              </Text>
            </View>
          ) : (
            familyContacts.map((contact) => (
              <View key={contact.id} style={styles.familyContactCard}>
                <TouchableOpacity
                  style={styles.familyContactMain}
                  onPress={() => handleCall(contact.phone, contact.name)}
                  activeOpacity={0.7}
                >
                  <View style={styles.familyContactIconBg}>
                    <User size={22} color={COLORS.secondary} />
                  </View>
                  <View style={styles.familyContactInfo}>
                    <Text style={styles.familyContactName}>{contact.name}</Text>
                  </View>
                  <View style={styles.callIconButton}>
                    <Phone size={20} color={COLORS.secondary} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id, contact.name)}
                >
                  <XCircle size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Safety Tips Component */}
        <SafetyTips tips={SAFETY_TIPS} colors={COLORS} />

        {/* Share Location */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.shareButton, isSharingLocation && { opacity: 0.7 }]}
            onPress={handleShareLiveLocation}
            activeOpacity={0.85}
            disabled={isSharingLocation}
          >
            {isSharingLocation ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Share2 size={20} color={COLORS.white} />
            )}
            <Text style={styles.shareButtonText}>
              {isSharingLocation ? "Fetching Location..." : "Share Live Location"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Contact Modal Component */}
      <AddContactModal
        visible={showAddModal}
        onClose={handleCancelAddContact}
        onSave={handleSaveContact}
        name={newContactName}
        setName={setNewContactName}
        phone={newContactPhone}
        setPhone={setNewContactPhone}
        relationship={newContactRelation}
        setRelationship={setNewContactRelation}
        colors={COLORS}
      />

      {/* Custom Universal Alert Modal */}
      <CustomAlertModal config={alertConfig} colors={COLORS} />

      {/* ─── SOS DISPATCH MODAL ──────────────────────── */}
      <Modal visible={showDispatchModal} transparent animationType="slide" onRequestClose={cancelSOS}>
        <View style={dispatchStyles.fullscreen}>
          <LinearGradient
            colors={["#1A1818", "#21100B"]}
            style={[dispatchStyles.container, { paddingTop: insets.top + 20 }]}
          >
            {/* Design Decorations */}
            <View style={dispatchStyles.headerDecoCircle} />

            {/* Header Content */}
            <View style={dispatchStyles.header}>
              <View style={dispatchStyles.shieldContainer}>
                <View style={[dispatchStyles.shieldBg, { borderColor: COLORS.error + '40' }]}>
                  <Radio size={28} color={COLORS.error} />
                </View>
              </View>
              <View style={dispatchStyles.headerTextContainer}>
                <Text style={dispatchStyles.headerTitle}>SOS DISPATCH</Text>
                <Text style={dispatchStyles.headerSubtitle}>Real-time Emergency Routing</Text>
              </View>
              <View style={dispatchStyles.headerRight}>
                {alertPayload && <StatusBadge status={alertPayload.status} />}
              </View>
            </View>

            {/* Alert Card */}
            <View style={dispatchStyles.alertCard}>
              {/* Alert ID and Time */}
              {alertPayload ? (
                <>
                  <View style={dispatchStyles.alertRow}>
                    <View style={dispatchStyles.alertLabel}>
                      <ShieldAlert size={14} color={COLORS.textMuted} />
                      <Text style={dispatchStyles.alertLabelText}>ALERT ID</Text>
                    </View>
                    <Text style={dispatchStyles.alertValue}>{alertPayload.alertId}</Text>
                  </View>

                  <View style={dispatchStyles.divider} />

                  <View style={dispatchStyles.alertRow}>
                    <View style={dispatchStyles.alertLabel}>
                      <Clock size={14} color={COLORS.textMuted} />
                      <Text style={dispatchStyles.alertLabelText}>TIMESTAMP</Text>
                    </View>
                    <Text style={dispatchStyles.alertValue}>
                      {new Date(alertPayload.timestamp).toLocaleString("en-IN")}
                    </Text>
                  </View>

                  <View style={dispatchStyles.divider} />

                  <View style={dispatchStyles.alertRow}>
                    <View style={dispatchStyles.alertLabel}>
                      <MapPin size={14} color={COLORS.textMuted} />
                      <Text style={dispatchStyles.alertLabelText}>LOCATION</Text>
                    </View>
                    <Text style={dispatchStyles.alertValue} numberOfLines={2}>
                      {alertPayload.location
                        ? alertPayload.location.address ||
                        `${alertPayload.location.latitude.toFixed(4)}, ${alertPayload.location.longitude.toFixed(4)}`
                        : "Acquiring..."}
                    </Text>
                  </View>

                  <View style={dispatchStyles.divider} />

                  <View style={dispatchStyles.alertRow}>
                    <View style={dispatchStyles.alertLabel}>
                      <User size={14} color={COLORS.textMuted} />
                      <Text style={dispatchStyles.alertLabelText}>CONTACTS</Text>
                    </View>
                    <Text style={dispatchStyles.alertValue}>
                      {alertPayload.destinations.length} recipient(s)
                    </Text>
                  </View>
                </>
              ) : (
                <View style={dispatchStyles.preDispatch}>
                  <AlertTriangle size={48} color={COLORS.error} />
                  <Text style={dispatchStyles.preDispatchTitle}>Ready to Dispatch</Text>
                  <Text style={dispatchStyles.preDispatchSubtitle}>
                    {familyContacts.length > 0
                      ? `Alert will be sent to ${familyContacts.length} contact(s)`
                      : "No contacts saved — alert will go to Emergency Services (112)"}
                  </Text>
                </View>
              )}
            </View>

            {/* Delivery Log */}
            {alertPayload && alertPayload.deliveryLog.length > 0 && (
              <View style={dispatchStyles.logSection}>
                <Text style={dispatchStyles.logTitle}>Delivery Log</Text>
                <ScrollView
                  ref={scrollViewRef}
                  style={dispatchStyles.logScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {alertPayload.deliveryLog.map((entry, i) => (
                    <LogItem key={i} entry={entry} />
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Action Buttons */}
            <View style={[dispatchStyles.buttonsContainer, { paddingBottom: insets.bottom + 16 }]}>
              {!alertPayload ? (
                <>
                  <TouchableOpacity
                    style={dispatchStyles.dispatchButton}
                    onPress={confirmAndDispatch}
                    activeOpacity={0.85}
                  >
                    {isDispatching ? (
                      <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                      <AlertTriangle size={20} color={COLORS.white} />
                    )}
                    <Text style={dispatchStyles.dispatchButtonText}>
                      {isDispatching ? "DISPATCHING..." : "CONFIRM & DISPATCH"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dispatchStyles.cancelDispatchButton}
                    onPress={cancelSOS}
                    activeOpacity={0.85}
                  >
                    <Text style={dispatchStyles.cancelDispatchText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : alertPayload.status === "RESOLVED" ? (
                <TouchableOpacity
                  style={[dispatchStyles.dispatchButton, { backgroundColor: COLORS.success }]}
                  onPress={cancelSOS}
                  activeOpacity={0.85}
                >
                  <CheckCircle size={20} color={COLORS.white} />
                  <Text style={dispatchStyles.dispatchButtonText}>Done — You&apos;re Safe</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    style={[dispatchStyles.dispatchButton, { backgroundColor: COLORS.success }]}
                    onPress={resolveSOS}
                    activeOpacity={0.85}
                  >
                    <CheckCircle size={20} color={COLORS.white} />
                    <Text style={dispatchStyles.dispatchButtonText}>I'm Safe — Resolve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dispatchStyles.cancelDispatchButton}
                    onPress={cancelSOS}
                    activeOpacity={0.85}
                  >
                    <Text style={dispatchStyles.cancelDispatchText}>Dismiss</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

// ─── DISPATCH MODAL STYLES ─────────────────────────────

const statusStyles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  logItem: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  logTime: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
  },
  logMessage: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
    lineHeight: 17,
  },
});

const dispatchStyles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
    gap: 16,
    zIndex: 2,
  },
  headerDecoCircle: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255, 54, 54, 0.05)",
    top: -100,
    right: -80,
  },
  shieldContainer: {
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  shieldBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "rgba(255, 54, 54, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  headerRight: {
    justifyContent: "center",
  },
  alertCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  alertRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  alertLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 110,
  },
  alertLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  alertValue: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.white,
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginVertical: 4,
  },
  preDispatch: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  preDispatchTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  preDispatchSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
    paddingHorizontal: 20,
  },
  logSection: {
    marginTop: 20,
    flex: 1,
  },
  logTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  logScroll: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  buttonsContainer: {
    paddingTop: 20,
    gap: 12,
  },
  dispatchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.error,
    paddingVertical: 18,
    borderRadius: 50,
    gap: 12,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  dispatchButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 1,
  },
  cancelDispatchButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelDispatchText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
});

// ─── MAIN SCREEN STYLES ────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  sosContainer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  sosButtonOuter: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  sosButtonOuterActive: {
    backgroundColor: "rgba(217, 54, 54, 0.15)",
    borderColor: "rgba(217, 54, 54, 0.4)",
  },
  sosButtonRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: "hidden",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  sosGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  sosText: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.white,
    letterSpacing: 2,
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    backgroundColor: "rgba(217, 54, 54, 0.08)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
  },
  activeIndicatorText: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.error,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  addText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#21100B",
  },
  emptyCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(92, 63, 65, 0.12)",
    gap: 10,
  },
  emptyIconBg: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "500",
  },
  familyContactCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(92, 63, 65, 0.12)",
  },
  familyContactMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  familyContactIconBg: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  familyContactInfo: {
    flex: 1,
  },
  familyContactName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  familyContactRelation: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    marginTop: 1,
  },
  familyContactPhone: {
    fontSize: 13,
    color: COLORS.secondary,
    fontWeight: "700",
    marginTop: 2,
  },
  callIconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.secondary,
    paddingVertical: 16,
    borderRadius: 50,
    gap: 10,
    marginBottom: 20,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.2,
  },
});
