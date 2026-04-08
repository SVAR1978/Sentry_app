import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Home, Compass, ShieldAlert, Map as MapIcon, User } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TraveloChat, { ChatFAB } from "../../components/chat/TraveloChat";

const { width } = Dimensions.get("window");
const TAB_BAR_WIDTH = width * 0.92;
const TAB_WIDTH = TAB_BAR_WIDTH / 5;
const TAB_BAR_HEIGHT = 72;
const SOS_FLOAT = 24;

const COLORS = {
  primary: "#21100B",    
  accent: "#C51E3A",     
  text: "#1A1818",       
  textMuted: "#8C7D79",  
  white: "#FFFFFF",
};

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const PRESS_SPRING = {
  damping: 12,
  stiffness: 400,
  mass: 0.5,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabBarIcon({
  name: Icon,
  focused,
  color,
  isSos,
}: {
  name: any;
  focused: boolean;
  color: string;
  isSos?: boolean;
}) {
  const scale = useSharedValue(focused ? 1.15 : 1);
  const translateY = useSharedValue(focused ? -2 : 0);

  useEffect(() => {
    if (focused) {
      scale.value = withSpring(1.15, SPRING_CONFIG);
      translateY.value = withSpring(-2, SPRING_CONFIG);
    } else {
      scale.value = withSpring(1, SPRING_CONFIG);
      translateY.value = withSpring(0, SPRING_CONFIG);
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  if (isSos) {
    return (
      <View style={styles.sosContainer}>
        <Animated.View style={[styles.sosButton, animatedStyle]}>
          <Icon size={28} color={COLORS.white} strokeWidth={2.5} />
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.iconWrapper, animatedStyle]}>
      <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
    </Animated.View>
  );
}

function TabItem({ route, index, options, isFocused, navigation }: any) {
  const pressScale = useSharedValue(1);

  const onPressIn = () => {
    pressScale.value = withSpring(0.9, PRESS_SPRING);
  };

  const onPressOut = () => {
    pressScale.value = withSpring(1, PRESS_SPRING);
  };

  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const getIcon = () => {
    switch (route.name) {
      case "index": return Home;
      case "explore": return Compass;
      case "emergency": return ShieldAlert;
      case "map": return MapIcon;
      case "profile": return User;
      default: return Home;
    }
  };

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const isSos = route.name === "emergency";

  return (
    <AnimatedPressable
      key={route.key}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={[styles.tabItem, pressAnimatedStyle]}
    >
      <TabBarIcon
        name={getIcon()}
        focused={isFocused}
        color={isFocused ? COLORS.primary : COLORS.textMuted}
        isSos={isSos}
      />
      {!isSos && (
        <Animated.Text
          style={[
            styles.tabLabel,
            {
              color: isFocused ? COLORS.primary : COLORS.textMuted,
              opacity: isFocused ? 1 : 0.7,
              fontWeight: isFocused ? "800" : "500",
            },
          ]}
        >
          {options.title}
        </Animated.Text>
      )}
    </AnimatedPressable>
  );
}

import { TabVisibilityProvider, useTabVisibility } from "../../store/TabVisibilityContext";

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(state.index * TAB_WIDTH);
  const { isTabBarVisible } = useTabVisibility();
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index]);

  useEffect(() => {
    translateY.value = withSpring(isTabBarVisible ? 0 : 150, {
      damping: 20,
      stiffness: 180,
      mass: 0.8,
    });
  }, [isTabBarVisible]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }, wrapperAnimatedStyle]}>
      <View style={styles.container}>
        
        {/* Pill Background with Shadow and Blur */}
        <View style={styles.pillBg}>
          <View style={styles.blurContainer}>
            {Platform.OS === 'ios' && (
              <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
            )}
            <View style={styles.glassLayer} />
          </View>
        </View>

        {/* Tab Items & Indicator */}
        <View style={styles.tabItems}>
          <Animated.View style={[styles.indicator, indicatorStyle]} />

          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            return (
              <TabItem 
                key={route.key}
                route={route} 
                index={index} 
                options={options} 
                isFocused={isFocused} 
                navigation={navigation} 
              />
            );
          })}
        </View>

      </View>
    </Animated.View>
  );
}

export default function UserTabsLayout() {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <TabVisibilityProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="explore" options={{ title: "Explore" }} />
        <Tabs.Screen name="emergency" options={{ title: "SOS Bar" }} />
        <Tabs.Screen name="map" options={{ title: "Map" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />

        {/* Sub-screens (Hidden from Tab Bar) */}
        <Tabs.Screen name="personal-info" options={{ href: null }} />
        <Tabs.Screen name="address-settings" options={{ href: null }} />
        <Tabs.Screen name="my-tickets" options={{ href: null }} />
        <Tabs.Screen name="help-center" options={{ href: null }} />
        <Tabs.Screen name="contact-support" options={{ href: null }} />
        <Tabs.Screen name="support-success" options={{ href: null }} />
        <Tabs.Screen name="tip-detail" options={{ href: null }} />
        <Tabs.Screen name="attraction-list" options={{ href: null }} />
        <Tabs.Screen name="food-list" options={{ href: null }} />
      </Tabs>

      {!chatVisible && (
        <ChatFAB onPress={() => setChatVisible(true)} hasUnread />
      )}

      <TraveloChat
        visible={chatVisible}
        onClose={() => setChatVisible(false)}
      />
    </TabVisibilityProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  container: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT + SOS_FLOAT,
    // Provide a bounding box that ensures Android catches all touches
    pointerEvents: "box-none",
  },
  pillBg: {
    position: "absolute",
    bottom: 0,
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_HEIGHT / 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: TAB_BAR_HEIGHT / 2,
    overflow: "hidden",
  },
  glassLayer: {
    ...StyleSheet.absoluteFillObject,
    // Solid fallback for Android to prevent messy overlap behind missing blur
    backgroundColor: Platform.OS === 'ios' ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  tabItems: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    height: TAB_BAR_HEIGHT,
    width: TAB_BAR_WIDTH,
  },
  tabItem: {
    width: TAB_WIDTH,
    height: TAB_BAR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
  indicator: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}12`,
    top: (TAB_BAR_HEIGHT - 48) / 2,
    left: (TAB_WIDTH - 48) / 2,
    zIndex: -1,
  },
  sosContainer: {
    position: "absolute",
    top: -SOS_FLOAT,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  sosButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
        shadowColor: COLORS.accent,
      },
    }),
  },
});
