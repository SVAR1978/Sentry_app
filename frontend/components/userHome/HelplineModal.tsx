import * as LucideIcons from "lucide-react-native";
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
        {(() => {
          const Icon = (LucideIcons as any)[item.icon];
          return Icon ? <Icon size={24} color={item.color} strokeWidth={2.5} /> : null;
        })()}
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
        <LucideIcons.Phone
          size={14}
          color={item.color}
          style={styles.phoneIcon as any}
          strokeWidth={3}
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
              <LucideIcons.X
                size={22}
                color={COLORS.text}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>

          {/* Emergency Banner */}
          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyIconPulse}>
              <LucideIcons.AlertTriangle
                size={24}
                color="#EF4444"
                strokeWidth={2.5}
              />
            </View>
            <View style={styles.emergencyTextContainer}>
              <Text style={styles.emergencyTextPrimary}>{t('nationalEmergency')}</Text>
              <Text style={styles.emergencyTextSecondary}>{t('immediateDispatch')}</Text>
            </View>
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
              activeOpacity={0.8}
            >
              <LucideIcons.Phone size={16} color="#FFFFFF" strokeWidth={3} style={{ marginRight: 6 } as any} />
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
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 14,
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: "#D1D5DB",
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "500",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    marginTop: -4,
    marginRight: -8,
  },
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1.5,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  emergencyIconPulse: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 16,
    marginRight: 12,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTextPrimary: {
    fontSize: 16,
    fontWeight: "800",
    color: "#991B1B",
    marginBottom: 2,
  },
  emergencyTextSecondary: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
    opacity: 0.8,
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingTop: 18,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  helplineItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  helplineIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  helplineContent: {
    flex: 1,
    marginLeft: 16,
  },
  helplineName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  helplineDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  alternateNumber: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
    fontStyle: "italic",
    fontWeight: "500",
  },
  helplineNumber: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    marginLeft: 10,
  },
  numberText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  phoneIcon: {
    marginLeft: 8,
  },
});

export default HelplineModal;
