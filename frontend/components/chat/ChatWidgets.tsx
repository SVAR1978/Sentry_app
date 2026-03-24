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
    backgroundColor: "rgba(255, 255, 255, 0.4)",
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
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
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
              style={{ width: 64, height: 64, borderRadius: 32 }}
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
                      color="#3E1911"
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
    marginBottom: 20,
  },
  glowRing: {
    padding: 6,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "rgba(33, 16, 11, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heading: {
    fontSize: 24,
    fontWeight: "900",
    color: "#21100B",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 14,
    color: "rgba(33, 16, 11, 0.5)",
    textAlign: "center",
    marginBottom: 28,
    fontWeight: "600",
    lineHeight: 20,
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
    backgroundColor: "rgba(255, 255, 255, 0.65)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  featureIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(33, 16, 11, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#21100B",
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  featureDesc: {
    fontSize: 11,
    color: "rgba(33, 16, 11, 0.45)",
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
    backgroundColor: "rgba(33, 16, 11, 0.06)",
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
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
