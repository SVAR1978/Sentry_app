import React from "react";
import {
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react-native";

export type AlertType = "success" | "error" | "confirm" | "info";

export interface AlertConfig {
  visible: boolean;
  type: AlertType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomAlertModalProps {
  config: AlertConfig;
  colors: any;
}

export const CustomAlertModal: React.FC<CustomAlertModalProps> = ({ config, colors }) => {
  if (!config.visible) return null;

  const { type, title, message, confirmText, cancelText, onConfirm, onCancel } = config;

  // Icon Resolution
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={32} color={colors.success} />;
      case "error":
        return <AlertTriangle size={32} color={colors.error} />;
      case "confirm":
        return <AlertTriangle size={32} color={colors.warning} />;
      case "info":
        return <Info size={32} color={colors.secondary} />;
      default:
        return <Info size={32} color={colors.secondary} />;
    }
  };

  // Color resolution for the glow/metallic effect
  const getGlowColor = () => {
    switch (type) {
      case "success":
        return "rgba(16, 185, 129, 0.15)";
      case "error":
        return "rgba(217, 54, 54, 0.15)";
      case "confirm":
        return "rgba(217, 119, 6, 0.15)";
      case "info":
        return "rgba(74, 67, 65, 0.15)";
      default:
        return "rgba(74, 67, 65, 0.15)";
    }
  };

  return (
    <Modal visible={config.visible} transparent animationType="fade" onRequestClose={onCancel || onConfirm}>
      <BlurView intensity={30} tint="dark" style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onCancel || onConfirm}>
          <Pressable style={styles.alertContainer} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={["#FFFFFF", "#F5F1EE"]}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              {/* Metallic Deco background ring */}
              <View style={[styles.glowRing, { backgroundColor: getGlowColor() }]} />

              <View style={styles.iconContainer}>
                <View style={[styles.iconShield, { backgroundColor: "rgba(33, 16, 11, 0.04)", borderColor: "rgba(33, 16, 11, 0.08)" }]}>
                  {getIcon()}
                </View>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>

              <View style={styles.buttonRow}>
                {cancelText && onCancel && (
                  <TouchableOpacity
                    style={[styles.cancelButton, { backgroundColor: "rgba(33, 16, 11, 0.05)" }]}
                    onPress={onCancel}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cancelText, { color: colors.textMuted }]}>{cancelText}</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity
                  style={[
                    styles.confirmButton,
                    {
                      backgroundColor: type === "error" || type === "confirm" ? colors.error : colors.primary,
                      flex: 1,
                    },
                  ]}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmText}>{confirmText || "Okay"}</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  alertContainer: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cardGradient: {
    padding: 24,
    alignItems: "center",
  },
  glowRing: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    top: -50,
    filter: "blur(20px)",
  },
  iconContainer: {
    marginBottom: 16,
    zIndex: 2,
  },
  iconShield: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: "center",
    zIndex: 2,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
    marginBottom: 24,
    zIndex: 2,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    zIndex: 2,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "700",
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});
