import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  name: string;
  setName: (text: string) => void;
  phone: string;
  setPhone: (text: string) => void;
  email: string;
  setEmail: (text: string) => void;
  relationship: string;
  setRelationship: (text: string) => void;
  colors: {
    text: string;
    textMuted: string;
    surfaceContainerHigh: string;
    primary: string;
    white: string;
  };
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  visible,
  onClose,
  onSave,
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
  relationship,
  setRelationship,
  colors,
}) => {
  const { t } = useTranslation('emergency');
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('addContact')}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={22} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('contactName')} *</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.surfaceContainerHigh },
              ]}
              placeholder="Enter contact name"
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('contactPhone')} *</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.surfaceContainerHigh },
              ]}
              placeholder="+91 98765 43210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('contactEmail')} *</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.surfaceContainerHigh },
              ]}
              placeholder="friend@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textMuted }]}>{t('relationship')}</Text>
            <TextInput
              style={[
                styles.input,
                { color: colors.text, backgroundColor: colors.surfaceContainerHigh },
              ]}
              placeholder="Father, Mother, Friend, etc."
              value={relationship}
              onChangeText={setRelationship}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.surfaceContainerHigh }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textMuted }]}>{t('cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={onSave}
            >
              <Text style={[styles.saveButtonText, { color: colors.white }]}>{t('addContact')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
    letterSpacing: -0.3,
  },
  inputContainer: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
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
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
