import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput as RNTextInput,
} from "react-native";
import { Text } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useAuth } from "../../store/AuthContext";
import {
  ChevronLeft,
  Send,
  ChevronDown,
  User,
  Mail,
  MessageSquare,
  Tag,
  AlertCircle,
} from "lucide-react-native";
import { submitSupportTicket } from "../../services/api/supportService";

const COLORS = {
  primary: "#21100B",
  primaryContainer: "#4A4341",
  white: "#FFFFFF",
  background: "#F2F2F2",
  secondary: "#8C7D79",
  textPrimary: "#1A1818",
  textSecondary: "#8C7D79",
  success: "#10B981",
  danger: "#FF6B6B",
  cardBorder: "rgba(33, 16, 11, 0.05)",
};

const SUBJECTS = [
  "General Inquiry",
  "Booking Issue",
  "Account Problem",
  "Safety Concern",
  "Bug Report",
  "Other",
];

const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 1000;

export default function ContactSupportScreen() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const messageRef = useRef<RNTextInput>(null);

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!subject) {
      newErrors.subject = "Please select a subject";
    }

    if (!message.trim() || message.trim().length < MIN_MESSAGE_LENGTH) {
      newErrors.message = `Message must be at least ${MIN_MESSAGE_LENGTH} characters`;
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Message must be under ${MAX_MESSAGE_LENGTH} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, subject, message]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setErrorBanner(null);

    try {
      const response = await submitSupportTicket({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });

      // Navigate to success screen with ticket ref
      router.replace({
        pathname: "/support-success" as any,
        params: {
          ticketRef: response.ticketRef,
          email: email.trim(),
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      setErrorBanner(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    subject.length > 0 &&
    message.trim().length >= MIN_MESSAGE_LENGTH &&
    message.length <= MAX_MESSAGE_LENGTH;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
            onPress={() => router.navigate("/help-center" as any)}
            style={styles.backButton}
            accessibilityLabel="Go back to help center"
          >
            <ChevronLeft color={COLORS.white} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contact Support</Text>
          <View style={{ width: 48 }} />
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Error Banner */}
        {errorBanner && (
          <View style={styles.errorBanner} accessibilityLiveRegion="assertive">
            <AlertCircle size={16} color={COLORS.danger} strokeWidth={2.5} />
            <Text style={styles.errorBannerText}>{errorBanner}</Text>
            <TouchableOpacity onPress={() => setErrorBanner(null)}>
              <Text style={styles.errorDismiss}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>YOUR DETAILS</Text>

          {/* Name */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldRow}>
              <User size={18} color={COLORS.secondary} strokeWidth={2.5} />
              <RNTextInput
                style={styles.fieldInput}
                placeholder="Full Name"
                placeholderTextColor={COLORS.secondary}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                accessibilityLabel="Full name"
              />
            </View>
            {errors.name ? (
              <Text style={styles.fieldError} accessibilityLiveRegion="assertive">
                {errors.name}
              </Text>
            ) : null}
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldRow}>
              <Mail size={18} color={COLORS.secondary} strokeWidth={2.5} />
              <RNTextInput
                style={styles.fieldInput}
                placeholder="Email Address"
                placeholderTextColor={COLORS.secondary}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email address"
              />
            </View>
            {errors.email ? (
              <Text style={styles.fieldError} accessibilityLiveRegion="assertive">
                {errors.email}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.sectionLabel}>YOUR MESSAGE</Text>

          {/* Subject Picker */}
          <View style={styles.fieldContainer}>
            <TouchableOpacity
              style={styles.fieldRow}
              onPress={() => setShowSubjectPicker(!showSubjectPicker)}
              accessibilityLabel="Select subject"
              accessibilityRole="button"
            >
              <Tag size={18} color={COLORS.secondary} strokeWidth={2.5} />
              <Text
                style={[
                  styles.fieldInput,
                  !subject && { color: COLORS.secondary },
                ]}
              >
                {subject || "Select Subject"}
              </Text>
              <ChevronDown size={18} color={COLORS.secondary} strokeWidth={2.5} />
            </TouchableOpacity>

            {showSubjectPicker && (
              <View style={styles.pickerDropdown}>
                {SUBJECTS.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[
                      styles.pickerItem,
                      subject === s && styles.pickerItemActive,
                    ]}
                    onPress={() => {
                      setSubject(s);
                      setShowSubjectPicker(false);
                      if (errors.subject) setErrors((e) => ({ ...e, subject: "" }));
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerItemText,
                        subject === s && styles.pickerItemTextActive,
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {errors.subject ? (
              <Text style={styles.fieldError} accessibilityLiveRegion="assertive">
                {errors.subject}
              </Text>
            ) : null}
          </View>

          {/* Message */}
          <View style={styles.fieldContainer}>
            <View style={[styles.fieldRow, styles.messageFieldRow]}>
              <MessageSquare
                size={18}
                color={COLORS.secondary}
                strokeWidth={2.5}
                style={{ marginTop: 2 }}
              />
              <RNTextInput
                ref={messageRef}
                style={[styles.fieldInput, styles.messageInput]}
                placeholder="Describe your issue in detail (min 20 chars)..."
                placeholderTextColor={COLORS.secondary}
                value={message}
                onChangeText={(t) => {
                  if (t.length <= MAX_MESSAGE_LENGTH) {
                    setMessage(t);
                    if (errors.message) setErrors((e) => ({ ...e, message: "" }));
                  }
                }}
                multiline
                textAlignVertical="top"
                accessibilityLabel="Support message"
              />
            </View>
            <View style={styles.charCountRow}>
              {errors.message ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="assertive">
                  {errors.message}
                </Text>
              ) : (
                <View />
              )}
              <Text
                style={[
                  styles.charCount,
                  message.length > MAX_MESSAGE_LENGTH && { color: COLORS.danger },
                  message.length >= MIN_MESSAGE_LENGTH && { color: COLORS.success },
                ]}
              >
                {message.length}/{MAX_MESSAGE_LENGTH}
              </Text>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormValid || submitting) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || submitting}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityState={{ disabled: !isFormValid || submitting, busy: submitting }}
          accessibilityLabel="Submit support ticket"
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Send size={18} color={COLORS.white} strokeWidth={2.5} />
              <Text style={styles.submitButtonText}>Send Message</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By submitting, you agree to our privacy policy. We'll respond to your
          registered email within 24–48 hours.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

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
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Error Banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "rgba(255, 107, 107, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.15)",
    marginBottom: 20,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.danger,
    lineHeight: 18,
  },
  errorDismiss: {
    fontSize: 16,
    color: COLORS.danger,
    fontWeight: "700",
  },

  // Form
  formSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.secondary,
    letterSpacing: 1.5,
    marginBottom: 14,
    marginLeft: 4,
  },
  fieldContainer: {
    marginBottom: 14,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.03)",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
  },
  fieldInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  messageFieldRow: {
    height: "auto",
    minHeight: 140,
    alignItems: "flex-start",
    paddingVertical: 14,
  },
  messageInput: {
    minHeight: 110,
    textAlignVertical: "top",
    paddingTop: 0,
  },
  fieldError: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.danger,
    marginTop: 6,
    marginLeft: 4,
  },
  charCountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingHorizontal: 4,
  },
  charCount: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.secondary,
  },

  // Subject Picker
  pickerDropdown: {
    marginTop: 8,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(33, 16, 11, 0.03)",
  },
  pickerItemActive: {
    backgroundColor: "rgba(33, 16, 11, 0.04)",
  },
  pickerItemText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  pickerItemTextActive: {
    fontWeight: "800",
    color: COLORS.primary,
  },

  // Submit
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    gap: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  disclaimer: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 16,
    paddingHorizontal: 16,
    fontWeight: "500",
  },
});
