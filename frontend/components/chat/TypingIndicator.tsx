import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
import { CHAT_COLORS } from "../../constants/chatData";

interface TypingIndicatorProps {
  visible: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ visible }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const createBounce = (dot: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(dot, {
              toValue: -6,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ])
        );

      const anim1 = createBounce(dot1, 0);
      const anim2 = createBounce(dot2, 150);
      const anim3 = createBounce(dot3, 300);

      anim1.start();
      anim2.start();
      anim3.start();

      return () => {
        anim1.stop();
        anim2.stop();
        anim3.stop();
      };
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.avatarSmall}>
        <Image source={require("../../assets/images/chat-bot.png")} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="cover" />
      </View>
      <View style={styles.bubble}>
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot1 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot2 }] }]}
        />
        <Animated.View
          style={[styles.dot, { transform: [{ translateY: dot3 }] }]}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(33, 16, 11, 0.3)",
  },
});

export default TypingIndicator;
