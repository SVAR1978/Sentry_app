import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Text, TextInput, Avatar, Button, IconButton } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../store/AuthContext";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  ChevronLeft,
  Save,
  Camera
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  background: "#F2F2F2",
  white: "#FFFFFF",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  accent: "#D4AF37", // Metallic gold accent
  success: "#4CAF50",
  danger: "#FF6B6B",
  cardBorder: "rgba(33, 16, 11, 0.05)",
};

export default function PersonalInfoScreen() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would call a service that hits the backend
      // and then updates the local state via updateUser(updatedUser)
      await updateUser({
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
      });

      Alert.alert("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Required", "Allow access to photos to change your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar style="light" />

      {/* Premium Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryContainer]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Info</Text>
          <View style={{ width: 48 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarBorder}>
              {formData.avatar ? (
                <Avatar.Image
                  size={100}
                  source={{ uri: formData.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Text
                  size={100}
                  label={formData.name.charAt(0).toUpperCase() || "U"}
                  style={[styles.avatar, { backgroundColor: "rgba(255,255,255,0.1)" }]}
                  color={COLORS.white}
                />
              )}
            </View>
            <TouchableOpacity style={styles.editPhotoButton} onPress={pickImage}>
              <Camera size={16} color={COLORS.primary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>ACCOUNT DETAILS</Text>

          {/* Name Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <UserIcon size={20} color={COLORS.secondary} />
            </View>
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              style={styles.input}
              mode="flat"
              textColor={COLORS.textPrimary}
              underlineColor="transparent"
              activeUnderlineColor={COLORS.primary}
            />
          </View>

          {/* Email (Read Only for security) */}
          <View style={[styles.inputContainer, styles.disabledInput]}>
            <View style={styles.inputIcon}>
              <Mail size={20} color={COLORS.secondary} />
            </View>
            <TextInput
              label="Email Address"
              value={formData.email}
              editable={false}
              style={styles.input}
              mode="flat"
              textColor={COLORS.textSecondary}
              underlineColor="transparent"
            />
          </View>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Phone size={20} color={COLORS.secondary} />
            </View>
            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              style={styles.input}
              mode="flat"
              textColor={COLORS.textPrimary}
              underlineColor="transparent"
              activeUnderlineColor={COLORS.primary}
              keyboardType="phone-pad"
            />
          </View>

          {/* Role (Read Only) */}
          <View style={[styles.inputContainer, styles.disabledInput]}>
            <View style={styles.inputIcon}>
              <Shield size={20} color={COLORS.secondary} />
            </View>
            <TextInput
              label="Account Role"
              value={user?.role?.name?.toUpperCase() || "USER"}
              editable={false}
              style={styles.input}
              mode="flat"
              textColor={COLORS.textSecondary}
              underlineColor="transparent"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Save size={20} color={COLORS.white} strokeWidth={2.5} />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
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
  avatarSection: {
    alignItems: "center",
    marginTop: 10,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatarBorder: {
    padding: 4,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatar: {
    backgroundColor: "transparent",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: COLORS.white,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.secondary,
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 20,
    marginBottom: 16,
    paddingLeft: 16,
    height: 64,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: "rgba(33, 16, 11, 0.05)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    fontSize: 15,
    fontWeight: "700",
    height: 60,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 32,
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
});
