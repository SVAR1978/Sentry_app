import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import {
  Minus,
  X,
  Send,
  Mic,
  Paperclip,
  Image as ImageIcon,
  Bot,
  MessageSquareText,
} from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BOT_INFO,
  BOT_RESPONSES,
  CHAT_COLORS,
  ChatMessage,
  QuickChip,
} from "../../constants/chatData";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import {
  QuickReplyChips,
  WelcomeScreen,
  DateSeparator,
} from "./ChatWidgets";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// ============ MAIN CHAT MODAL ============

interface TraveloChatProps {
  visible: boolean;
  onClose: () => void;
}

const TraveloChat: React.FC<TraveloChatProps> = ({ visible, onClose }) => {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const sendScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          tension: 65,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const getBotResponse = (userText: string): string => {
    const lower = userText.toLowerCase().trim();

    // Check for keyword matches
    for (const [key, response] of Object.entries(BOT_RESPONSES)) {
      if (lower.includes(key)) {
        return response;
      }
    }

    // Check for greetings
    const greetings = ["hi", "hello", "hey", "hola", "sup", "yo"];
    if (greetings.some((g) => lower.startsWith(g))) {
      return BOT_RESPONSES.greeting;
    }

    return BOT_RESPONSES.default;
  };

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Animate send button
      Animated.sequence([
        Animated.timing(sendScaleAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(sendScaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        sender: "user",
        text: text.trim(),
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputText("");
      setShowChips(false);
      scrollToBottom();

      // Show typing indicator after a brief pause
      setTimeout(() => {
        setIsTyping(true);
        scrollToBottom();

        // Mark user message as delivered
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: "delivered" } : m
          )
        );
      }, 400);

      // Bot responds after realistic delay
      const responseDelay = 1200 + Math.random() * 800;
      setTimeout(() => {
        const botReply: ChatMessage = {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: getBotResponse(text),
          timestamp: new Date(),
        };

        setIsTyping(false);
        setMessages((prev) => [...prev, botReply]);
        setShowChips(true);

        // Mark user message as seen
        setMessages((prev) =>
          prev.map((m) =>
            m.id === userMessage.id ? { ...m, status: "seen" } : m
          )
        );

        scrollToBottom();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, responseDelay);
    },
    [scrollToBottom]
  );

  const handleChipPress = useCallback(
    (chip: QuickChip) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      sendMessage(chip.label);
    },
    [sendMessage]
  );

  const handleWelcomeFeaturePress = useCallback(
    (feature: { icon: string; label: string }) => {
      sendMessage(feature.label);
    },
    [sendMessage]
  );

  const handleClose = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Keyboard.dismiss();
    onClose();
  }, [onClose]);

  // Message grouping
  const renderMessage = useCallback(
    ({ item, index }: { item: ChatMessage; index: number }) => {
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const nextMessage =
        index < messages.length - 1 ? messages[index + 1] : null;

      const isFirstInGroup =
        !prevMessage || prevMessage.sender !== item.sender;
      const isLastInGroup =
        !nextMessage || nextMessage.sender !== item.sender;

      return (
        <MessageBubble
          message={item}
          isFirstInGroup={isFirstInGroup}
          isLastInGroup={isLastInGroup}
        />
      );
    },
    [messages]
  );

  const hasMessages = messages.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <Animated.View
          style={[
            styles.chatWindow,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
              paddingBottom: insets.bottom,
            },
          ]}
        >
          <BlurView intensity={90} tint="light" style={StyleSheet.absoluteFillObject} />
          
          {/* ========== HEADER ========== */}
          <LinearGradient
            colors={[CHAT_COLORS.headerGradientStart, CHAT_COLORS.headerGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, { paddingTop: Math.max(insets.top, 12) + 8 }]}
          >
            {/* Left: Avatar + Info */}
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatarRing}>
                <View style={styles.headerAvatar}>
                  <Image source={require("../../assets/images/chat-bot.png")} style={{ width: 44, height: 44, borderRadius: 22 }} resizeMode="cover" />
                </View>
                <View style={styles.onlineDot} />
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerName}>{BOT_INFO.name}</Text>
                <Text style={styles.headerSubtitle}>{BOT_INFO.subtitle}</Text>
              </View>
            </View>

            {/* Right: Actions */}
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.headerBtn}
                onPress={handleClose}
                activeOpacity={0.6}
              >
                <X size={18} color="rgba(255,255,255,0.7)" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            {/* Bottom glow */}
            <View style={styles.headerGlow} />
          </LinearGradient>

          {/* ========== MESSAGE BODY ========== */}
          <View style={styles.body}>
            {!hasMessages ? (
              <WelcomeScreen onFeaturePress={handleWelcomeFeaturePress} />
            ) : (
              <>
                <FlatList
                  ref={flatListRef}
                  data={messages}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMessage}
                  contentContainerStyle={styles.messageList}
                  showsVerticalScrollIndicator={false}
                  ListHeaderComponent={
                    <DateSeparator label="Today" />
                  }
                  ListFooterComponent={
                    <TypingIndicator visible={isTyping} />
                  }
                  onContentSizeChange={scrollToBottom}
                />
              </>
            )}
          </View>

          {/* ========== QUICK CHIPS ========== */}
          {hasMessages && showChips && (
            <QuickReplyChips onChipPress={handleChipPress} />
          )}

          {/* ========== INPUT BAR ========== */}
          <View style={styles.inputBar}>
            {/* Left icons */}
            <View style={styles.inputLeftIcons}>
              <TouchableOpacity style={styles.inputIconBtn} activeOpacity={0.6}>
                <Paperclip size={18} color={CHAT_COLORS.mutedText} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIconBtn} activeOpacity={0.6}>
                <ImageIcon size={18} color={CHAT_COLORS.mutedText} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Text field */}
            <View style={styles.inputFieldWrapper}>
              <TextInput
                style={styles.inputField}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask about destinations, hotels, food..."
                placeholderTextColor={CHAT_COLORS.inputPlaceholder}
                multiline
                maxLength={500}
                returnKeyType="send"
                onSubmitEditing={() => sendMessage(inputText)}
                blurOnSubmit
              />
            </View>

            {/* Right icons */}
            <TouchableOpacity style={styles.micBtn} activeOpacity={0.6}>
              <Mic size={18} color={CHAT_COLORS.mutedText} strokeWidth={2} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendBtn,
                !inputText.trim() && styles.sendBtnDisabled,
              ]}
              activeOpacity={0.7}
              disabled={!inputText.trim()}
              onPress={() => sendMessage(inputText)}
            >
              <Animated.View style={{ transform: [{ scale: sendScaleAnim }] }}>
                <Send
                  size={18}
                  color={
                    inputText.trim()
                      ? CHAT_COLORS.white
                      : CHAT_COLORS.mutedText
                  }
                  strokeWidth={2.5}
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ============ FAB BUBBLE BUTTON ============

interface ChatFABProps {
  onPress: () => void;
  hasUnread?: boolean;
}

export const ChatFAB: React.FC<ChatFABProps> = ({
  onPress,
  hasUnread = false,
}) => {
  const bobAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const badgePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating bob animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bobAnim, {
          toValue: -6,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bobAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Badge pulse
    if (hasUnread) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(badgePulse, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(badgePulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [hasUnread]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        fabStyles.wrapper,
        {
          transform: [
            { translateY: bobAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={fabStyles.button}
      >
        <LinearGradient
          colors={[CHAT_COLORS.headerGradientStart, CHAT_COLORS.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={fabStyles.gradient}
        >
          <Image source={require("../../assets/images/chat-bot.png")} style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode="cover" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Unread badge */}
      {hasUnread && (
        <Animated.View
          style={[
            fabStyles.badge,
            { transform: [{ scale: badgePulse }] },
          ]}
        >
          <View style={fabStyles.badgeDot} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

// ============ STYLES ============

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: CHAT_COLORS.overlay,
  },
  overlayTouchable: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chatWindow: {
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.75)", // glassmorphism semi-transparent base
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },

  // Header
  header: {
    height: "auto",
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  headerAvatarRing: {
    position: "relative",
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatarText: {
    fontSize: 20,
  },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: CHAT_COLORS.online,
    borderWidth: 2,
    borderColor: CHAT_COLORS.headerGradientStart,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "800",
    color: CHAT_COLORS.white,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginTop: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  headerDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  headerGlow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "rgba(140,125,121,0.3)",
    shadowColor: CHAT_COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  // Body
  body: {
    flex: 1,
    backgroundColor: "transparent",
  },
  messageList: {
    paddingTop: 8,
    paddingBottom: 16,
  },

  // Input Bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(33, 16, 11, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    gap: 6,
  },
  inputLeftIcons: {
    flexDirection: "row",
    gap: 2,
    paddingBottom: 6,
  },
  inputIconBtn: {
    padding: 8,
  },
  inputFieldWrapper: {
    flex: 1,
    backgroundColor: CHAT_COLORS.inputBg,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: CHAT_COLORS.inputBorder,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "ios" ? 10 : 4,
    maxHeight: 100,
    justifyContent: "center",
  },
  inputField: {
    fontSize: 14,
    color: CHAT_COLORS.inputText,
    fontWeight: "500",
    lineHeight: 20,
    maxHeight: 80,
  },
  micBtn: {
    padding: 10,
    paddingBottom: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CHAT_COLORS.headerGradientStart,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: CHAT_COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: "rgba(33, 16, 11, 0.06)",
    shadowOpacity: 0,
    elevation: 0,
  },
});

const fabStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 999,
  },
  button: {
    shadowColor: CHAT_COLORS.headerGradientStart,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 28,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
  },
  badgeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#C51E3A",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});

export default TraveloChat;
