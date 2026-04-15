import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native-paper";
import { Check, CheckCheck } from "lucide-react-native";
import Markdown from 'react-native-markdown-display';
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

  // Compute border radii based on grouping
  const userRadii = {
    borderTopLeftRadius: 20,
    borderTopRightRadius: isFirstInGroup ? 20 : 6,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: isLastInGroup ? 20 : 6,
  };

  const botRadii = {
    borderTopLeftRadius: isFirstInGroup ? 20 : 6,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: isLastInGroup ? 20 : 6,
    borderBottomRightRadius: 20,
  };

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isBot ? styles.botRow : styles.userRow,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
          marginBottom: isLastInGroup ? 14 : 3,
        },
      ]}
    >
      {/* Bot avatar */}
      {isBot && (
        <View style={styles.avatarColumn}>
          {isLastInGroup ? (
            <View style={styles.avatarSmall}>
              <Image source={require("../../assets/images/chat-bot.png")} style={{ width: 30, height: 30, borderRadius: 15 }} resizeMode="cover" />
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
        {isBot ? (
          /* ── Bot Bubble: Solid light background ── */
          <View style={[styles.bubble, styles.botBubble, botRadii]}>
            <Markdown style={markdownStyles}>
              {message.text}
            </Markdown>
            <View style={[styles.metaInline, styles.metaLeft]}>
              <Text style={styles.timestamp}>{time}</Text>
            </View>
          </View>
        ) : (
          /* ── User Bubble: Gradient matching the header ── */
          <LinearGradient
            colors={['#1A0C08', '#2D1610', '#3E1911']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.bubble, styles.userBubble, userRadii]}
          >
            <Text style={[styles.messageText, styles.userMessageText]}>
              {message.text}
            </Text>
            <View style={[styles.metaInline, styles.metaRight]}>
              <Text style={[styles.timestamp, styles.timestampUser]}>{time}</Text>
              {message.status && (
                <View style={styles.statusIcon}>
                  {message.status === "seen" ? (
                    <CheckCheck size={12} color={CHAT_COLORS.seen} strokeWidth={2.5} />
                  ) : (
                    <Check size={12} color="rgba(255,255,255,0.5)" strokeWidth={2.5} />
                  )}
                </View>
              )}
            </View>
          </LinearGradient>
        )}
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

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: "500",
    color: "#1A1818",
  },
  heading1: { fontSize: 22, fontWeight: '700', marginTop: 10, marginBottom: 5 },
  heading2: { fontSize: 20, fontWeight: '700', marginTop: 10, marginBottom: 5 },
  heading3: { fontSize: 18, fontWeight: '700', marginTop: 10, marginBottom: 5 },
  paragraph: { marginTop: 4, marginBottom: 4 },
  list_item: { marginTop: 2, marginBottom: 2 },
  bullet_list: { marginTop: 4, marginBottom: 8 },
  ordered_list: { marginTop: 4, marginBottom: 8 },
  strong: { fontWeight: '700' },
  em: { fontStyle: 'italic' },
  code_inline: { backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, padding: 2, fontFamily: 'monospace' },
  code_block: { backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 8, padding: 8, marginTop: 4, marginBottom: 8, fontFamily: 'monospace' },
});

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: "row",
    paddingHorizontal: 14,
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
    width: 30,
  },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F0EE",
    borderWidth: 1.5,
    borderColor: "rgba(33, 16, 11, 0.08)",
    overflow: "hidden",
  },
  avatarSpacer: {
    width: 30,
    height: 30,
  },
  bubbleContainer: {
    maxWidth: "78%",
  },
  botBubbleContainer: {
    alignItems: "flex-start",
  },
  userBubbleContainer: {
    alignItems: "flex-end",
  },
  bubble: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    overflow: "hidden",
  },
  botBubble: {
    backgroundColor: "#F5F0EE",
  },
  userBubble: {
    shadowColor: "#1A0C08",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 6,
  },
  messageText: {
    fontSize: 14.5,
    lineHeight: 22,
    fontWeight: "500",
  },
  botMessageText: {
    color: "#1A1818",
  },
  userMessageText: {
    color: "#FFFFFF",
  },
  metaInline: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  metaLeft: {
    justifyContent: "flex-start",
  },
  metaRight: {
    justifyContent: "flex-end",
  },
  timestamp: {
    fontSize: 10,
    color: "rgba(33, 16, 11, 0.35)",
    fontWeight: "600",
  },
  timestampUser: {
    color: "rgba(255, 255, 255, 0.45)",
  },
  statusIcon: {
    marginLeft: 2,
  },
});

export default MessageBubble;
