import * as LucideIcons from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import {
  CHAT_COLORS,
  DEFAULT_CHIPS,
  WELCOME_FEATURES,
  QuickChip,
} from "../../constants/chatData";
import { COLORS } from "../../constants/userHomeData";

// ============ QUICK REPLY CHIPS ============

interface QuickReplyChipsProps {
  onChipPress: (chip: QuickChip) => void;
  chips?: QuickChip[];
}

export const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({
  onChipPress,
  chips = DEFAULT_CHIPS,
}) => {
  return (
    <View style={chipStyles.wrapper}>
      <FlatList
        data={chips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={chipStyles.list}
        renderItem={({ item }) => (
          <ChipButton chip={item} onPress={() => onChipPress(item)} />
        )}
      />
    </View>
  );
};

interface ChipButtonProps {
  chip: QuickChip;
  onPress: () => void;
}

const ChipButton: React.FC<ChipButtonProps> = ({ chip, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const Icon = (LucideIcons as any)[chip.icon];

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[chipStyles.chip, { transform: [{ scale: scaleAnim }] }]}
      >
        {Icon && (
          <Icon size={16} color={CHAT_COLORS.chipText} strokeWidth={2.5} />
        )}
        <Text style={chipStyles.chipLabel}>{chip.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const chipStyles = StyleSheet.create({
  wrapper: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: CHAT_COLORS.separator,
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_COLORS.chipBorder,
    backgroundColor: CHAT_COLORS.chipBg,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: CHAT_COLORS.chipText,
  },
});

// ============ WELCOME SCREEN ============

interface WelcomeScreenProps {
  onFeaturePress: (feature: { icon: string; label: string }) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onFeaturePress,
}) => {
  return (
    <View style={welcomeStyles.container}>
      {/* Avatar */}
      <View style={welcomeStyles.avatarWrapper}>
        <View style={welcomeStyles.glowRing}>
          <View style={welcomeStyles.avatar}>
            <LucideIcons.Bot size={32} color={CHAT_COLORS.white} strokeWidth={2} />
          </View>
        </View>
      </View>

      {/* Text */}
      <Text style={welcomeStyles.heading}>Hi, I'm Travelo! 👋</Text>
      <Text style={welcomeStyles.subtext}>
        Your personal travel guide. Ask me anything!
      </Text>

      {/* Feature grid */}
      <View style={welcomeStyles.featureGrid}>
        {WELCOME_FEATURES.map((feature) => {
          const Icon = (LucideIcons as any)[feature.icon];
          return (
            <TouchableOpacity
              key={feature.id}
              style={welcomeStyles.featureCard}
              activeOpacity={0.7}
              onPress={() => onFeaturePress(feature)}
            >
              {Icon && (
                <Icon
                  size={24}
                  color={CHAT_COLORS.accent}
                  strokeWidth={2}
                  style={welcomeStyles.featureIcon}
                />
              )}
              <Text style={welcomeStyles.featureLabel}>{feature.label}</Text>
              <Text style={welcomeStyles.featureDesc}>{feature.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 20,
  },
  glowRing: {
    padding: 16,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "rgba(140,125,121,0.2)",
    shadowColor: CHAT_COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(140,125,121,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "500",
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  featureCard: {
    width: "45%",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  featureIcon: {
    marginBottom: 8,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: CHAT_COLORS.white,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 11,
    color: CHAT_COLORS.mutedText,
    textAlign: "center",
    fontWeight: "500",
  },
});

// ============ DATE SEPARATOR ============

interface DateSeparatorProps {
  label: string;
}

export const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <View style={separatorStyles.container}>
      <View style={separatorStyles.line} />
      <View style={separatorStyles.pill}>
        <Text style={separatorStyles.text}>{label}</Text>
      </View>
      <View style={separatorStyles.line} />
    </View>
  );
};

const separatorStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: CHAT_COLORS.separator,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    marginHorizontal: 8,
  },
  text: {
    fontSize: 11,
    color: CHAT_COLORS.mutedText,
    fontWeight: "600",
  },
});
