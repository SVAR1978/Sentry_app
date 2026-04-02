import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { LayoutDashboard, Users, Settings, User, Map } from "lucide-react-native";
import React, { useEffect } from "react";
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

const { width } = Dimensions.get("window");
const TAB_BAR_WIDTH = width * 0.92;
const TAB_WIDTH = TAB_BAR_WIDTH / 4;
const TAB_BAR_HEIGHT = 72;

const COLORS = {
  primary: "#21100B",
  accent: "#38302E",
  text: "#1A1818",
  textMuted: "#8C7D79",
  white: "#FFFFFF",
  error: "#D93636",
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
}: {
  name: any;
  focused: boolean;
  color: string;
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
      case "index": return LayoutDashboard;
      case "users": return Users;
      case "map": return Map;
      case "settings": return Settings;
      default: return LayoutDashboard;
    }
  };

  const pressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

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
      />
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
    </AnimatedPressable>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const translateX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 16) }]}>
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
    </View>
  );
}

export default function AdminTabsLayout() {
  return (
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
      <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="users" options={{ title: "Users" }} />
      <Tabs.Screen name="map" options={{ title: "Map" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
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
    height: TAB_BAR_HEIGHT,
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
});
