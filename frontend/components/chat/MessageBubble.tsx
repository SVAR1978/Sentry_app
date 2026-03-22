import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
import { Text } from "react-native-paper";
import { Check, CheckCheck } from "lucide-react-native";
import {
  CHAT_COLORS,
  ChatMessage,
} from "../../constants/chatData";

interface MessageBubbleProps {
  message: ChatMessage;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isFirstInGroup,
  isLastInGroup,
}) => {
  const slideAnim = useRef(new Animated.Value(message.sender === "bot" ? -30 : 30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const isBot = message.sender === "bot";
  const time = formatTime(message.timestamp);

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isBot ? styles.botRow : styles.userRow,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          marginBottom: isLastInGroup ? 12 : 4,
        },
      ]}
    >
      {/* Bot avatar */}
      {isBot && (
        <View style={styles.avatarColumn}>
          {isLastInGroup ? (
            <View style={styles.avatarSmall}>
              <Image source={require("../../assets/images/chat-bot.png")} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="cover" />
            </View>
          ) : (
            <View style={styles.avatarSpacer} />
          )}
        </View>
      )}

      <View
        style={[
          styles.bubbleContainer,
          isBot ? styles.botBubbleContainer : styles.userBubbleContainer,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isBot ? styles.botBubble : styles.userBubble,
            isFirstInGroup && isBot && styles.botBubbleFirst,
            isFirstInGroup && !isBot && styles.userBubbleFirst,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isBot ? styles.botMessageText : styles.userMessageText,
            ]}
          >
            {message.text}
          </Text>
        </View>

        {/* Timestamp & Status */}
        <View
          style={[
            styles.metaRow,
            isBot ? styles.metaLeft : styles.metaRight,
          ]}
        >
          <Text style={styles.timestamp}>{time}</Text>
          {!isBot && message.status && (
            <View style={styles.statusIcon}>
              {message.status === "seen" ? (
                <CheckCheck size={12} color={CHAT_COLORS.seen} strokeWidth={2.5} />
              ) : (
                <Check size={12} color={CHAT_COLORS.sent} strokeWidth={2.5} />
              )}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    alignItems: "flex-end",
  },
  botRow: {
    justifyContent: "flex-start",
  },
  userRow: {
    justifyContent: "flex-end",
  },
  avatarColumn: {
    marginRight: 8,
    width: 28,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.06)",
  },
  avatarEmoji: {
    fontSize: 14,
  },
  avatarSpacer: {
    width: 28,
    height: 28,
  },
  bubbleContainer: {
    maxWidth: "75%",
  },
  botBubbleContainer: {
    alignItems: "flex-start",
  },
  userBubbleContainer: {
    alignItems: "flex-end",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  botBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.08)",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  botBubbleFirst: {
    borderTopLeftRadius: 18,
  },
  userBubble: {
    backgroundColor: "#21100B",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#21100B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  userBubbleFirst: {
    borderTopRightRadius: 18,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 21,
  },
  botMessageText: {
    color: "#1A1818",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
    paddingHorizontal: 4,
  },
  metaLeft: {
    justifyContent: "flex-start",
  },
  metaRight: {
    justifyContent: "flex-end",
  },
  timestamp: {
    fontSize: 10,
    color: CHAT_COLORS.timestamp,
  },
  statusIcon: {
    marginLeft: 2,
  },
});

export default MessageBubble;
