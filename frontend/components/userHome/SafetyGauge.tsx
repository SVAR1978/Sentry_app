import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { Text } from "react-native-paper";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { COLORS } from "../../constants/userHomeData";
import { getCurrentLocation } from "../../services/maps/locationService";
import { getAreaId } from "../../services/risk/areaLookup";
import { resolveAreaFromLocation } from "../../services/risk/areaResolver";
import { fetchAreaBaseScore } from "../../services/api/riskService";

// ── Responsive sizing ──
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GAUGE_SIZE = Math.min(SCREEN_WIDTH * 0.3, 120);
const STROKE_WIDTH = 8;
const RADIUS = (GAUGE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Earthy palette
const RISK_COLORS = {
  Safe: "#7FA071",
  Low: "#7FA071",
  Medium: "#D4A373",
  High: "#BC6C25",
};

const RISK_LABELS: Record<string, string> = {
  Safe: "Safe",
  Low: "Safe",
  Medium: "Elevated",
  High: "Critical",
};

const RISK_LEVEL_DESCRIPTIONS: Record<string, string> = {
  Safe: "Low Risk",
  Low: "Low Risk",
  Medium: "Moderate Risk",
  High: "High Risk",
};


interface RiskData {
  risk_level: "Safe" | "Low" | "Medium" | "High";
  final_score: number;
  area_id: string;
}

const SafetyGauge: React.FC = () => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(CIRCUMFERENCE)).current;
  const [displayedOffset, setDisplayedOffset] = useState(CIRCUMFERENCE);

  // ── Fetch risk data ──
  useEffect(() => {
    const fetchRisk = async () => {
      try {
        const coords = await getCurrentLocation();
        if (!coords) return;

        let areaId = await getAreaId(coords.latitude, coords.longitude);
        if (!areaId) {
          areaId = await resolveAreaFromLocation(coords.latitude, coords.longitude);
        }

        if (areaId) {
          const baseRisk = await fetchAreaBaseScore(areaId);
          if (baseRisk) {
            const finalScore = baseRisk.final_score ?? baseRisk.base_score;
            const riskLevel = finalScore > 55 ? "High" : finalScore > 30 ? "Medium" : "Safe";
            setRiskData({
              risk_level: riskLevel as RiskData["risk_level"],
              final_score: Math.round(finalScore),
              area_id: baseRisk.area_id,
            });
          }
        }
      } catch (error) {
        console.warn("[SafetyGauge] Error fetching risk:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRisk();
  }, []);

  // ── Animations ──
  useEffect(() => {
    if (!isLoading && riskData) {
      const scorePercent = riskData.final_score / 100;
      const targetOffset = CIRCUMFERENCE * (1 - scorePercent);

      // Card entrance
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 60,
          friction: 9,
          useNativeDriver: true,
        }),
      ]).start();

      // Ring fill
      Animated.timing(progressAnim, {
        toValue: targetOffset,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      const listenerId = progressAnim.addListener(({ value }) => {
        setDisplayedOffset(value);
      });

      return () => progressAnim.removeListener(listenerId);
    }
  }, [isLoading, riskData]);

  // ── Loading state ──
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.loadingInner}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Analyzing safety…</Text>
          </View>
        </View>
      </View>
    );
  }

  if (!riskData) return null;

  const color = RISK_COLORS[riskData.risk_level] || RISK_COLORS.Safe;
  const label = RISK_LABELS[riskData.risk_level] || "Safe";
  const description = RISK_LEVEL_DESCRIPTIONS[riskData.risk_level] || "Low Risk";
  const areaName = riskData.area_id.replace(/_/g, " ");

  return (
    <View style={styles.container}>
      {/* Section title row */}
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>Safety Index</Text>
        <View style={[styles.livePill, { backgroundColor: `${color}12` }]}>
          <View style={[styles.liveDot, { backgroundColor: color }]} />
          <Text style={[styles.liveLabel, { color }]}>Live</Text>
        </View>
      </View>

      {/* Main card */}
      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={styles.row}>
          {/* ── Circular gauge ── */}
          <View style={styles.gaugeWrapper}>
            <Svg width={GAUGE_SIZE} height={GAUGE_SIZE}>
              <Defs>
                <SvgGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <Stop offset="100%" stopColor={color} stopOpacity={1} />
                </SvgGradient>
              </Defs>

              {/* Background track */}
              <Circle
                cx={GAUGE_SIZE / 2}
                cy={GAUGE_SIZE / 2}
                r={RADIUS}
                stroke={`${color}15`}
                strokeWidth={STROKE_WIDTH}
                fill="none"
              />

              {/* Progress arc */}
              <Circle
                cx={GAUGE_SIZE / 2}
                cy={GAUGE_SIZE / 2}
                r={RADIUS}
                stroke="url(#ringGrad)"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={`${CIRCUMFERENCE}`}
                strokeDashoffset={displayedOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${GAUGE_SIZE / 2}, ${GAUGE_SIZE / 2}`}
              />
            </Svg>

            {/* Score inside ring */}
            <View style={styles.gaugeCenter}>
              <Text style={[styles.scoreNumber, { color }]}>
                {riskData.final_score}
              </Text>
              <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
            </View>
          </View>

          {/* ── Info column ── */}
          <View style={styles.infoCol}>
            <Text style={styles.riskTitle}>{description}</Text>

            <Text style={styles.areaText} numberOfLines={1}>
              {areaName}
            </Text>

            {/* Mini scale */}
            <View style={styles.scaleRow}>
              <View style={styles.scaleTrack}>
                <View style={[styles.seg, { backgroundColor: "#7FA071" }]} />
                <View style={[styles.seg, { backgroundColor: "#D4A373" }]} />
                <View style={[styles.seg, { backgroundColor: "#BC6C25" }]} />
              </View>
              <View
                style={[
                  styles.scaleThumb,
                  { left: `${Math.min(riskData.final_score, 100)}%` },
                ]}
              />
            </View>
            <View style={styles.scaleLabelRow}>
              <Text style={styles.scaleNum}>0</Text>
              <Text style={styles.scaleNum}>50</Text>
              <Text style={styles.scaleNum}>100</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  // ── Title row ──
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },

  // ── Card ──
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(33, 16, 11, 0.05)",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  // ── Gauge ──
  gaugeWrapper: {
    width: GAUGE_SIZE,
    height: GAUGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  gaugeCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1.5,
    lineHeight: 36,
  },
  scoreLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginTop: 1,
    opacity: 0.8,
  },

  // ── Info column ──
  infoCol: {
    flex: 1,
  },
  riskTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  areaText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "capitalize",
    marginBottom: 12,
  },

  // ── Scale bar ──
  scaleRow: {
    height: 5,
    borderRadius: 3,
    position: "relative",
  },
  scaleTrack: {
    flexDirection: "row",
    height: 5,
    borderRadius: 3,
    overflow: "hidden",
    gap: 2,
  },
  seg: {
    flex: 1,
    borderRadius: 3,
  },
  scaleThumb: {
    position: "absolute",
    top: -3,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#1F2937",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    marginLeft: -5.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
  },
  scaleLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  scaleNum: {
    fontSize: 10,
    fontWeight: "700",
    color: "#D1D5DB",
  },

  // ── Loading ──
  loadingInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 28,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textMuted,
  },
});

export default SafetyGauge;
