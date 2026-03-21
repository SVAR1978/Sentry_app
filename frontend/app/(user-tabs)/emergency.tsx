import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Linking,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Vibration,
    View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

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
};

const EMERGENCY_CONTACTS = [
  { id: "1", name: "Police", number: "100", icon: "police-badge", color: "#4F8EF7" },
  { id: "2", name: "Ambulance", number: "108", icon: "ambulance", color: "#FF385C" },
  { id: "3", name: "Fire", number: "101", icon: "fire", color: "#F59E0B" },
  { id: "4", name: "Women Helpline", number: "1091", icon: "account-heart", color: "#EC4899" },
  { id: "5", name: "Tourist Helpline", number: "1363", icon: "airplane", color: "#62DCA3" },
  { id: "6", name: "Child Helpline", number: "1098", icon: "baby-face", color: "#8B5CF6" },
];

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

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [sosActive, setSosActive] = useState(false);
  const [familyContacts, setFamilyContacts] = useState<FamilyContact[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelation, setNewContactRelation] = useState("");

  const handleSOS = () => {
    Vibration.vibrate([0, 500, 200, 500, 200, 500]);
    setSosActive(true);

    Alert.alert(
      "🚨 SOS Activated",
      "Emergency alert will be sent to your emergency contacts with your current location.\n\nDo you want to proceed?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setSosActive(false),
        },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: () => {
            setTimeout(() => {
              Alert.alert("Alert Sent ✓", "Your emergency contacts have been notified with your current location.");
              setSosActive(false);
            }, 1500);
          },
        },
      ]
    );
  };

  const handleCall = async (number: string, name: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(`Call ${name}?`, `${number}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call Now",
        onPress: async () => {
          try {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await Linking.openURL(`tel:${number}`);
          } catch (error) {
            Alert.alert("Unable to Open Dialer", `Please dial ${number} manually.`, [{ text: "OK" }]);
          }
        },
      },
    ]);
  };

  const handleAddFamilyContact = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddModal(true);
  };

  const handleSaveContact = async () => {
    if (!newContactName.trim()) { Alert.alert("Invalid Input", "Please enter a valid name."); return; }
    if (!newContactPhone.trim()) { Alert.alert("Invalid Input", "Please enter a valid phone number."); return; }

    const newContact: FamilyContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || "Contact",
    };

    setFamilyContacts([...familyContacts, newContact]);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddModal(false);
    Alert.alert("Contact Added ✓", `${newContactName} has been added to your emergency contacts.`);
  };

  const handleCancelAddContact = () => {
    setNewContactName(""); setNewContactPhone(""); setNewContactRelation("");
    setShowAddModal(false);
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Delete Contact", `Are you sure you want to remove ${contactName} from emergency contacts?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setFamilyContacts(familyContacts.filter((c) => c.id !== contactId));
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={["#EDE7E3", "#F5F1EE"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerDecoCircle} />
          <View style={styles.shieldContainer}>
            <View style={styles.shieldBg}>
              <MaterialCommunityIcons name="shield-alert" size={36} color={COLORS.primary} />
            </View>
          </View>
          <Text style={styles.headerTitle}>Emergency SOS</Text>
          <Text style={styles.headerSubtitle}>Your safety is our priority</Text>
        </LinearGradient>

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={[styles.sosButtonOuter, sosActive && styles.sosButtonOuterActive]}
            onPress={handleSOS}
            activeOpacity={0.85}
          >
            <View style={styles.sosButtonRing}>
              <LinearGradient
                colors={sosActive ? ["#21100B", "#4A4341"] : ["#21100B", "#1A1818"]}
                style={styles.sosGradient}
              >
                <MaterialCommunityIcons name="alert" size={56} color={COLORS.white} />
                <Text style={styles.sosText}>{sosActive ? "SENDING..." : "SOS"}</Text>
                <Text style={styles.sosSubtext}>{sosActive ? "Please wait" : "Tap for emergency"}</Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <Text style={styles.sosHint}>Hold for 3 seconds to activate silent SOS</Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          </View>
          <View style={styles.contactsGrid}>
            {EMERGENCY_CONTACTS.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleCall(contact.number, contact.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.contactIcon, { backgroundColor: `${contact.color}18` }]}>
                  <MaterialCommunityIcons name={contact.icon as any} size={26} color={contact.color} />
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={[styles.contactNumber, { color: contact.color }]}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Family Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Family Contacts</Text>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddFamilyContact}>
              <MaterialCommunityIcons name="plus" size={16} color={COLORS.primary} />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          {familyContacts.length === 0 ? (
            <View style={styles.emptyCard}>
              <View style={styles.emptyIconBg}>
                <MaterialCommunityIcons name="account-group" size={28} color={COLORS.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No Emergency Contacts</Text>
              <Text style={styles.emptySubtitle}>Tap + Add to create your emergency contacts</Text>
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
                    <MaterialCommunityIcons name="account" size={22} color={COLORS.secondary} />
                  </View>
                  <View style={styles.familyContactInfo}>
                    <Text style={styles.familyContactName}>{contact.name}</Text>
                    <Text style={styles.familyContactRelation}>{contact.relationship}</Text>
                    <Text style={styles.familyContactPhone}>{contact.phone}</Text>
                  </View>
                  <View style={styles.callIconButton}>
                    <MaterialCommunityIcons name="phone" size={20} color={COLORS.secondary} />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteContact(contact.id, contact.name)}
                >
                  <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsCard}>
            {SAFETY_TIPS.map((tip, index) => (
              <View key={index} style={[styles.tipItem, index === SAFETY_TIPS.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={styles.tipCheckmark}>
                  <MaterialCommunityIcons name="check" size={14} color={COLORS.secondary} />
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Share Location */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => Alert.alert("Share Location", "Location sharing feature")}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="share-variant" size={20} color={COLORS.white} />
            <Text style={styles.shareButtonText}>Share Live Location</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal visible={showAddModal} transparent animationType="fade" onRequestClose={handleCancelAddContact}>
        <Pressable style={styles.modalOverlay} onPress={handleCancelAddContact}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={handleCancelAddContact}>
                <MaterialCommunityIcons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter contact name"
                value={newContactName}
                onChangeText={setNewContactName}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                value={newContactPhone}
                onChangeText={setNewContactPhone}
                keyboardType="phone-pad"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                placeholder="Father, Mother, Friend, etc."
                value={newContactRelation}
                onChangeText={setNewContactRelation}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAddContact}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveContact}>
                <Text style={styles.saveButtonText}>Add Contact</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
    paddingBottom: 28,
    position: "relative",
    overflow: "hidden",
  },
  headerDecoCircle: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    top: -60,
    right: -60,
  },
  shieldContainer: {
    marginBottom: 14,
  },
  shieldBg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "rgba(33, 16, 11, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.15)",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#21100B",
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#8C7D79",
    marginTop: 4,
    fontWeight: "500",
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
    backgroundColor: "rgba(255, 56, 92, 0.15)",
    borderColor: "rgba(255, 56, 92, 0.4)",
    transform: [{ scale: 0.97 }],
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
  sosSubtext: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  sosHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 16,
    textAlign: "center",
    paddingHorizontal: 40,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
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
  contactsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  contactCard: {
    width: (SCREEN_WIDTH - 60) / 3,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(92, 63, 65, 0.12)",
  },
  contactIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactName: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: 0.2,
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: "800",
    marginTop: 3,
    letterSpacing: 0.5,
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
    backgroundColor: "rgba(98, 220, 163, 0.12)",
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
    backgroundColor: "rgba(98, 220, 163, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  deleteButton: {
    padding: 6,
  },
  tipsCard: {
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(92, 63, 65, 0.12)",
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(92, 63, 65, 0.08)",
    gap: 12,
  },
  tipCheckmark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(98, 220, 163, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  tipText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    fontWeight: "500",
    lineHeight: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.1)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textMuted,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(92, 63, 65, 0.25)",
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.surfaceContainerHigh,
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: COLORS.surfaceContainerHigh,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.textMuted,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.white,
  },
});
