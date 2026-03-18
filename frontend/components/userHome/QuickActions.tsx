import { MaterialCommunityIcons } from "@expo/vector-icons";
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

  // ✅ Updated: Direct call (no double confirmation)
  const handleEmergencyCall = useCallback(async (action: QuickAction) => {
    if (!action.phoneNumber) return;

    const phoneNumber = `tel:${action.phoneNumber}`;

    try {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );
      await Linking.openURL(phoneNumber);
    } catch (error) {
      // Only show alert if opening the dialer actually fails
      Alert.alert(
        "Unable to Open Dialer",
        `Please dial ${action.phoneNumber} manually.`,
        [{ text: "OK" }]
      );
    }
  }, []);

  // ✅ Keep Map Redirection
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
      <View style={styles.quickActions}>
        {actions.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onPress={() => handleActionPress(action)}
          />
        ))}
      </View>

      <HelplineModal
        visible={helplineModalVisible}
        onClose={() => setHelplineModalVisible(false)}
      />
    </>
  );
};

interface QuickActionButtonProps {
  action: QuickAction;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  action,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.quickActionItem}
    >
      <Animated.View
        style={[
          styles.quickActionIcon,
          { backgroundColor: `${action.color}15` },
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <MaterialCommunityIcons
          name={action.icon as any}
          size={28}
          color={action.color}
        />
      </Animated.View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  quickActionItem: {
    alignItems: "center",
    width: (SCREEN_WIDTH - 80) / 4,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center",
  },
});

export default QuickActions;