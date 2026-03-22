import * as LucideIcons from "lucide-react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { COLORS, QuickAction } from "../../constants/userHomeData";
import HelplineModal from "./HelplineModal";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const [helplineModalVisible, setHelplineModalVisible] = useState(false);

  const handleEmergencyCall = useCallback(async (action: QuickAction) => {
    if (!action.phoneNumber) return;

    const phoneNumber = `tel:${action.phoneNumber}`;

    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      await Linking.openURL(phoneNumber);
    } catch (error) {
      Alert.alert(
        "Unable to Open Dialer",
        `Please dial ${action.phoneNumber} manually.`,
        [{ text: "OK" }]
      );
    }
  }, []);

  const handleFindNearest = useCallback((action: QuickAction) => {
    if (!action.mapFilter) return;

    router.push({
      pathname: "/(user-tabs)/map",
      params: { filter: action.mapFilter },
    });
  }, []);

  const handleActionPress = useCallback(
    async (action: QuickAction) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      if (action.type === "helpline") {
        setHelplineModalVisible(true);
        return;
      }

      if (action.type === "call") {
        if (action.mapFilter) {
          Alert.alert(
            action.serviceName || action.label,
            "What would you like to do?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Find Nearest",
                onPress: () => handleFindNearest(action),
              },
              {
                text: `Call ${action.phoneNumber}`,
                onPress: () => handleEmergencyCall(action),
              },
            ]
          );
        } else {
          handleEmergencyCall(action);
        }
      }
    },
    [handleEmergencyCall, handleFindNearest]
  );

  return (
    <>
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Emergency Services</Text>
          </View>
        </View>
        <View style={styles.quickActionsGrid}>
          {actions.map((action) => (
            <QuickActionCard
              key={action.id}
              action={action}
              onPress={() => handleActionPress(action)}
            />
          ))}
        </View>
      </View>

      <HelplineModal
        visible={helplineModalVisible}
        onClose={() => setHelplineModalVisible(false)}
      />
    </>
  );
};

interface QuickActionCardProps {
  action: QuickAction;
  onPress: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  action,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const Icon = (LucideIcons as any)[action.icon];

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cardWrapper}
    >
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${action.color}15` },
          ]}
        >
          {Icon && <Icon size={24} color={action.color} strokeWidth={2.5} />}
        </View>
        <Text style={styles.cardLabel}>{action.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 24, // Reset to standard spacing
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "700",
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  cardWrapper: {
    width: (SCREEN_WIDTH - 52) / 2, // 2 items per row
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.primary,
    letterSpacing: -0.2,
  },
});

export default QuickActions;