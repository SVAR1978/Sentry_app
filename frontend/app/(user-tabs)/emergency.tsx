import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../store/AuthContext";

const SCREEN_WIDTH = Dimensions.get("window").width;

const COLORS = {
  primary: "#EF4444",
  secondary: "#F59E0B",
  background: "#FEF2F2",
  surface: "#FFFFFF",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
  success: "#10B981",
};

const EMERGENCY_CONTACTS = [
  {
    id: "1",
    name: "Police",
    number: "100",
    icon: "police-badge",
    color: "#3B82F6",
  },
  {
    id: "2",
    name: "Ambulance",
    number: "108",
    icon: "ambulance",
    color: "#EF4444",
  },
  { id: "3", name: "Fire", number: "101", icon: "fire", color: "#F59E0B" },
  {
    id: "4",
    name: "Women Helpline",
    number: "1091",
    icon: "account-heart",
    color: "#EC4899",
  },
  {
    id: "5",
    name: "Tourist Helpline",
    number: "1363",
    icon: "airplane",
    color: "#10B981",
  },
  {
    id: "6",
    name: "Child Helpline",
    number: "1098",
    icon: "baby-face",
    color: "#8B5CF6",
  },
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
            // Simulate sending emergency alert
            setTimeout(() => {
              Alert.alert(
                "Alert Sent ✓",
                "Your emergency contacts have been notified with your current location.",
              );
              setSosActive(false);
            }, 1500);
          },
        },
      ],
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
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            await Linking.openURL(`tel:${number}`);
          } catch (error) {
            Alert.alert(
              "Unable to Open Dialer",
              `Please dial ${number} manually.`,
              [{ text: "OK" }]
            );
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
    if (!newContactName.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid name.");
      return;
    }
    if (!newContactPhone.trim()) {
      Alert.alert("Invalid Input", "Please enter a valid phone number.");
      return;
    }

    const newContact: FamilyContact = {
      id: Date.now().toString(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRelation.trim() || "Contact",
    };
    
    setFamilyContacts([...familyContacts, newContact]);
    await Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );
    
    // Reset form
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddModal(false);
    
    Alert.alert(
      "Contact Added ✓",
      `${newContactName} has been added to your emergency contacts.`
    );
  };

  const handleCancelAddContact = () => {
    setNewContactName("");
    setNewContactPhone("");
    setNewContactRelation("");
    setShowAddModal(false);
  };

  const handleDeleteContact = async (contactId: string, contactName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      "Delete Contact",
      `Are you sure you want to remove ${contactName} from emergency contacts?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setFamilyContacts(familyContacts.filter(c => c.id !== contactId));
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, "#DC2626"]}
          style={styles.header}
        >
          <MaterialCommunityIcons
            name="shield-alert"
            size={40}
            color={COLORS.white}
          />
          <Text style={styles.headerTitle}>Emergency SOS</Text>
          <Text style={styles.headerSubtitle}>Your safety is our priority</Text>
        </LinearGradient>

        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <TouchableOpacity
            style={[styles.sosButton, sosActive && styles.sosButtonActive]}
            onPress={handleSOS}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                sosActive ? ["#991B1B", "#7F1D1D"] : [COLORS.primary, "#DC2626"]
              }
              style={styles.sosGradient}
            >
              <MaterialCommunityIcons
                name="alert"
                size={64}
                color={COLORS.white}
              />
              <Text style={styles.sosText}>
                {sosActive ? "SENDING..." : "SOS"}
              </Text>
              <Text style={styles.sosSubtext}>
                {sosActive ? "Please wait" : "Tap for emergency"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.sosHint}>
            Press and hold for 3 seconds to activate silent SOS
          </Text>
        </View>

        {/* Emergency Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Numbers</Text>
          <View style={styles.contactsGrid}>
            {EMERGENCY_CONTACTS.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={styles.contactCard}
                onPress={() => handleCall(contact.number, contact.name)}
              >
                <View
                  style={[
                    styles.contactIcon,
                    { backgroundColor: `${contact.color}15` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={contact.icon as any}
                    size={28}
                    color={contact.color}
                  />
                </View>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Family Contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Contacts</Text>
            <TouchableOpacity onPress={handleAddFamilyContact}>
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {familyContacts.length === 0 ? (
            <Card style={styles.familyCard}>
              <Card.Content style={styles.familyContent}>
                <View style={styles.familyIcon}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={24}
                    color={COLORS.textLight}
                  />
                </View>
                <View style={styles.familyInfo}>
                  <Text style={styles.familyTitle}>No Emergency Contacts</Text>
                  <Text style={styles.familySubtitle}>
                    Tap + Add to create your emergency contacts
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            familyContacts.map((contact) => (
              <Card key={contact.id} style={styles.familyContactCard}>
                <Card.Content style={styles.familyContactContent}>
                  <TouchableOpacity
                    style={styles.familyContactMain}
                    onPress={() => handleCall(contact.phone, contact.name)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.familyContactIcon}>
                      <MaterialCommunityIcons
                        name="account"
                        size={24}
                        color={COLORS.success}
                      />
                    </View>
                    <View style={styles.familyContactInfo}>
                      <Text style={styles.familyContactName}>{contact.name}</Text>
                      <Text style={styles.familyContactRelation}>
                        {contact.relationship}
                      </Text>
                      <Text style={styles.familyContactPhone}>{contact.phone}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.callIconButton}
                      onPress={() => handleCall(contact.phone, contact.name)}
                    >
                      <MaterialCommunityIcons
                        name="phone"
                        size={22}
                        color={COLORS.success}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteContact(contact.id, contact.name)}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color={COLORS.primary}
                    />
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {/* Safety Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <Card style={styles.tipsCard}>
            <Card.Content>
              {SAFETY_TIPS.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={COLORS.success}
                  />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        </View>

        {/* Share Location */}
        <View style={styles.section}>
          <Button
            mode="contained"
            icon="share-variant"
            style={styles.shareButton}
            contentStyle={styles.shareButtonContent}
            labelStyle={styles.shareButtonLabel}
            onPress={() =>
              Alert.alert("Share Location", "Location sharing feature")
            }
          >
            Share Live Location
          </Button>
        </View>
      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={handleCancelAddContact}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCancelAddContact}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TouchableOpacity onPress={handleCancelAddContact}>
                <MaterialCommunityIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter contact name"
                value={newContactName}
                onChangeText={setNewContactName}
                placeholderTextColor={COLORS.textLight}
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
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                placeholder="Father, Mother, Friend, etc."
                value={newContactRelation}
                onChangeText={setNewContactRelation}
                placeholderTextColor={COLORS.textLight}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelAddContact}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveContact}
              >
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
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.white,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  sosContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: "hidden",
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  sosButtonActive: {
    transform: [{ scale: 0.95 }],
  },
  sosGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sosText: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
    marginTop: 8,
  },
  sosSubtext: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  sosHint: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 16,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  addText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  contactsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  contactCard: {
    width: (SCREEN_WIDTH - 60) / 3,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
  },
  contactIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  contactName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
  contactNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 4,
  },
  familyCard: {
    borderRadius: 16,
    elevation: 2,
    marginBottom: 12,
  },
  familyContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  familyIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${COLORS.success}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  familyInfo: {
    flex: 1,
  },
  familyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  familySubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  familyContactCard: {
    borderRadius: 16,
    elevation: 2,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  familyContactContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  familyContactMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  familyContactIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: `${COLORS.success}15`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  familyContactInfo: {
    flex: 1,
  },
  familyContactName: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  familyContactRelation: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  familyContactPhone: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: "600",
    marginTop: 2,
  },
  callIconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.success}15`,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  tipsCard: {
    borderRadius: 16,
    elevation: 2,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tipText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  shareButton: {
    backgroundColor: COLORS.success,
    borderRadius: 16,
    marginBottom: 20,
  },
  shareButtonContent: {
    paddingVertical: 8,
  },
  shareButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  saveButton: {
    backgroundColor: COLORS.success,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.white,
  },
});
