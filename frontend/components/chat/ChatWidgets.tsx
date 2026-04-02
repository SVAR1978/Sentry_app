import * as LucideIcons from "lucide-react-native";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
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
        <View style={chipStyles.chipIconBg}>
          {Icon && (
            <Icon size={14} color="#21100B" strokeWidth={2.5} />
          )}
        </View>
        <Text style={chipStyles.chipLabel}>{chip.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const chipStyles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 16, 11, 0.06)",
    backgroundColor: "rgba(242, 240, 238, 0.6)",
  },
  list: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 38,
    paddingHorizontal: 16,
    paddingRight: 18,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
    backgroundColor: "#FFFFFF",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chipIconBg: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(33, 16, 11, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#21100B",
    letterSpacing: -0.2,
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
            <Image
              source={require("../../assets/images/chat-bot.png")}
              style={{ width: 72, height: 72, borderRadius: 36 }}
              resizeMode="cover"
            />
          </View >
        </View >
      </View >

      {/* Text */}
      <Text style={welcomeStyles.heading}>Hi, I'm Travelo!</Text>
      <Text style={welcomeStyles.subtext}>
        Your personal AI travel assistant.{"\n"}Ask me anything about destinations, hotels & more!
      </Text>

      {/* Feature grid */}
      <View style={welcomeStyles.featureGrid}>
        {
          WELCOME_FEATURES.map((feature) => {
            const Icon = (LucideIcons as any)[feature.icon];
            return (
              <TouchableOpacity
                key={feature.id}
                style={welcomeStyles.featureCard}
                activeOpacity={0.7}
                onPress={() => onFeaturePress(feature)}
              >
                <View style={welcomeStyles.featureIconBg}>
                  {Icon && (
                    <Icon
                      size={22}
                      color="#21100B"
                      strokeWidth={2}
                    />
                  )}
                </View>
                <Text style={welcomeStyles.featureLabel}>{feature.label}</Text>
                <Text style={welcomeStyles.featureDesc}>{feature.description}</Text>
              </TouchableOpacity>
            );
          })
        }
      </View >
    </View >
  );
};

const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatarWrapper: {
    marginBottom: 24,
  },
  glowRing: {
    padding: 6,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(33, 16, 11, 0.1)",
    backgroundColor: "#F5F0EE",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 6,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heading: {
    fontSize: 26,
    fontWeight: "900",
    color: "#21100B",
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  subtext: {
    fontSize: 14,
    color: "rgba(33, 16, 11, 0.5)",
    textAlign: "center",
    marginBottom: 32,
    fontWeight: "600",
    lineHeight: 21,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  featureCard: {
    width: "46%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.06)",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  featureIconBg: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#F5F0EE",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#21100B",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  featureDesc: {
    fontSize: 11,
    color: "rgba(33, 16, 11, 0.45)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
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
    backgroundColor: "rgba(33, 16, 11, 0.06)",
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#F5F0EE",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    marginHorizontal: 8,
  },
  text: {
    fontSize: 11,
    color: "rgba(33, 16, 11, 0.4)",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
