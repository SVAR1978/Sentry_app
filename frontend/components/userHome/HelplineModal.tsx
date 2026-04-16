import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Linking,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    COLORS,
    HELPLINE_NUMBERS,
    HelplineItem,
} from "../../constants/userHomeData";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.75;

interface HelplineModalProps {
  visible: boolean;
  onClose: () => void;
}

const HelplineModal: React.FC<HelplineModalProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('common');
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: MODAL_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleCall = useCallback(async (helpline: HelplineItem) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const phoneNumber = `tel:${helpline.number}`;

    Alert.alert(
      t('callHelpline', { name: helpline.name }),
      `${helpline.number}${
        helpline.alternateNumber
          ? ` (${t('alternateLabel', { number: helpline.alternateNumber })})`
          : ""
      }\n\n${helpline.description}`,
      [
        {
          text: t('cancel'),
          style: "cancel",
        },
        {
          text: t('callNow'),
          style: "default",
          onPress: async () => {
            try {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              await Linking.openURL(phoneNumber);
            } catch (error) {
              Alert.alert(
                t('unableOpenDialer'),
                t('pleaseDialManually', { number: helpline.number }),
                [{ text: t('okay') }],
              );
            }
          },
        },
      ],
    );
  }, []);

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "tourist":
        return t('touristServices');
      case "safety":
        return t('safetySecurity');
      case "medical":
        return t('medicalEmergency');
      case "transport":
        return t('transportHelplines');
      default:
        return t('otherServices');
    }
  };

  const groupedHelplines = HELPLINE_NUMBERS.reduce(
    (acc, helpline) => {
      if (!acc[helpline.category]) {
        acc[helpline.category] = [];
      }
      acc[helpline.category].push(helpline);
      return acc;
    },
    {} as Record<string, HelplineItem[]>,
  );

  const sections = Object.entries(groupedHelplines).map(
    ([category, items]) => ({
      title: getCategoryTitle(category),
      data: items,
    }),
  );

  const renderHelplineItem = ({ item }: { item: HelplineItem }) => (
    <TouchableOpacity
      style={styles.helplineItem}
      onPress={() => handleCall(item)}
      activeOpacity={0.7}
    >
      <View
        style={[styles.helplineIcon, { backgroundColor: `${item.color}15` }]}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={24}
          color={item.color}
        />
      </View>
      <View style={styles.helplineContent}>
        <Text style={styles.helplineName}>{item.name}</Text>
        <Text style={styles.helplineDescription} numberOfLines={1}>
          {item.description}
        </Text>
        {item.alternateNumber && (
          <Text style={styles.alternateNumber}>
            Alt: {item.alternateNumber}
          </Text>
        )}
      </View>
      <View style={styles.helplineNumber}>
        <Text style={[styles.numberText, { color: item.color }]}>
          {item.number}
        </Text>
        <MaterialCommunityIcons
          name="phone"
          size={16}
          color={item.color}
          style={styles.phoneIcon}
        />
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderContent = () => {
    const allItems: (HelplineItem | { type: "header"; title: string })[] = [];

    sections.forEach((section) => {
      allItems.push({ type: "header", title: section.title });
      allItems.push(...section.data);
    });

    return (
      <FlatList
        data={allItems}
        keyExtractor={(item, index) =>
          "type" in item ? `header-${item.title}` : item.id
        }
        renderItem={({ item }) =>
          "type" in item
            ? renderSectionHeader(item.title)
            : renderHelplineItem({ item })
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
              paddingTop: Platform.OS === "android" ? 8 : 0,
            },
          ]}
        >
          {/* Handle Bar */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>{t('emergencyHelplines')}</Text>
              <Text style={styles.subtitle}>
                {t('tapAnyNumber')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={COLORS.text}
              />
            </TouchableOpacity>
          </View>

          {/* Emergency Banner */}
          <View style={styles.emergencyBanner}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color={COLORS.white}
            />
            <Text style={styles.emergencyText}>
              {t('forImmediateEmergency')}
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() =>
                handleCall({
                  id: "emergency",
                  name: t('nationalEmergency'),
                  number: "112",
                  description: t('singleEmergencyNumber'),
                  icon: "alert-circle",
                  color: "#D93636",
                  category: "safety",
                })
              }
            >
              <Text style={styles.emergencyButtonText}>{t('callEmergencyNumber')}</Text>
            </TouchableOpacity>
          </View>

          {/* Helpline List */}
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  modalContent: {
    height: MODAL_HEIGHT,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.textLight,
    borderRadius: 2,
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  closeButton: {
    padding: 8,
    marginTop: -4,
    marginRight: -8,
  },
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.error,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
  },
  emergencyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.white,
  },
  emergencyButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.error,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textLight,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  helplineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.06)",
  },
  helplineIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  helplineContent: {
    flex: 1,
    marginLeft: 14,
  },
  helplineName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1818",
    marginBottom: 2,
  },
  helplineDescription: {
    fontSize: 12,
    color: "#4A4341",
    lineHeight: 16,
  },
  alternateNumber: {
    fontSize: 11,
    color: "#4A4341",
    marginTop: 2,
    fontStyle: "italic",
    opacity: 0.7,
  },
  helplineNumber: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 10,
  },
  numberText: {
    fontSize: 15,
    fontWeight: "700",
  },
  phoneIcon: {
    marginLeft: 6,
  },
});

export default HelplineModal;
