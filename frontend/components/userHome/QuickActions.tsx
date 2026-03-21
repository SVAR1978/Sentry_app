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
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <Text style={styles.sectionSubtitle}>Emergency services</Text>
        </View>
        <View style={styles.quickActions}>
          {actions.map((action) => (
            <QuickActionButton
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
      toValue: 0.9,
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
          styles.quickActionIconWrap,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          style={[
            styles.quickActionIcon,
            { backgroundColor: `${action.color}20` },
          ]}
        >
          <MaterialCommunityIcons
            name={action.icon as any}
            size={26}
            color={action.color}
          />
        </View>
        {/* Colored accent ring */}
        <View
          style={[
            styles.accentRing,
            { borderColor: `${action.color}40` },
          ]}
        />
      </Animated.View>
      <Text style={styles.quickActionLabel}>{action.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionItem: {
    alignItems: "center",
    width: (SCREEN_WIDTH - 80) / 4,
  },
  quickActionIconWrap: {
    position: "relative",
    marginBottom: 10,
  },
  quickActionIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
  },
  accentRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 23,
    borderWidth: 1,
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    letterSpacing: 0.2,
  },
});

export default QuickActions;