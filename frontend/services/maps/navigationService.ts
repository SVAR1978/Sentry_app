import * as Location from "expo-location";
import { Audio } from "expo-av";
import {
  LocationCoordinate,
  calculateDistance,
  calculateBearing,
} from "./locationService";
import { RouteInfo, RouteStep } from "./placesService";

export interface NavigationState {
  isNavigating: boolean;
  currentStepIndex: number;
  distanceToNextManeuver: number;
  distanceRemaining: number;
  timeRemaining: number;
  currentInstruction: string;
  nextInstruction: string | null;
  isOffRoute: boolean;
  offRouteDistance: number;
  shouldReroute: boolean;
  travelMode: "driving" | "walking" | "cycling";
}

export interface NavigationConfig {
  // Distance thresholds for turn warnings (in meters)
  turnWarningDistance: number;
  turnApproachingDistance: number;
  
  // Off-route detection
  offRouteThreshold: number;
  rerouteThreshold: number;
  
  // Step completion detection
  stepCompletionDistance: number;
  
  // Voice announcements
  enableVoiceGuidance: boolean;
  voiceLanguage: string;
}

// Default configs for different travel modes
const NAVIGATION_CONFIGS: Record<
  "driving" | "walking" | "cycling",
  NavigationConfig
> = {
  driving: {
    turnWarningDistance: 500, // 500m warning
    turnApproachingDistance: 100, // 100m "approaching turn"
    offRouteThreshold: 50, // 50m off route
    rerouteThreshold: 100, // 100m triggers reroute
    stepCompletionDistance: 30, // Complete step when within 30m
    enableVoiceGuidance: true,
    voiceLanguage: "en-US",
  },
  cycling: {
    turnWarningDistance: 200, // 200m warning
    turnApproachingDistance: 50, // 50m "approaching turn"
    offRouteThreshold: 30, // 30m off route
    rerouteThreshold: 60, // 60m triggers reroute
    stepCompletionDistance: 20, // Complete step when within 20m
    enableVoiceGuidance: true,
    voiceLanguage: "en-US",
  },
  walking: {
    turnWarningDistance: 100, // 100m warning
    turnApproachingDistance: 25, // 25m "approaching turn"
    offRouteThreshold: 20, // 20m off route
    rerouteThreshold: 40, // 40m triggers reroute
    stepCompletionDistance: 10, // Complete step when within 10m
    enableVoiceGuidance: true,
    voiceLanguage: "en-US",
  },
};

export class NavigationManager {
  private route: RouteInfo;
  private currentStepIndex: number = 0;
  private travelMode: "driving" | "walking" | "cycling";
  private config: NavigationConfig;
  private lastAnnouncedStep: number = -1;
  private lastAnnouncedDistance: number = -1;
  private sound: Audio.Sound | null = null;

  constructor(
    route: RouteInfo,
    travelMode: "driving" | "walking" | "cycling" = "driving"
  ) {
    this.route = route;
    this.travelMode = travelMode;
    this.config = NAVIGATION_CONFIGS[travelMode];
  }

  // Update travel mode and reconfigure
  setTravelMode(mode: "driving" | "walking" | "cycling"): void {
    this.travelMode = mode;
    this.config = NAVIGATION_CONFIGS[mode];
  }

  // Get navigation state based on current location
  getNavigationState(currentLocation: LocationCoordinate): NavigationState {
    // Find closest point on route and current step
    const { stepIndex, distanceToStep, closestPoint } =
      this.findCurrentStep(currentLocation);

    // Update current step if we've progressed
    if (stepIndex > this.currentStepIndex) {
      this.currentStepIndex = stepIndex;
    }

    const currentStep = this.route.steps[this.currentStepIndex];
    const nextStep =
      this.currentStepIndex < this.route.steps.length - 1
        ? this.route.steps[this.currentStepIndex + 1]
        : null;

    // Calculate remaining distance and time
    const { remainingDistance, remainingTime } =
      this.calculateRemaining(currentLocation);

    // Determine if off-route
    const isOffRoute = distanceToStep > this.config.offRouteThreshold;
    const shouldReroute = distanceToStep > this.config.rerouteThreshold;

    // Generate current instruction with distance context
    const currentInstruction = this.formatInstructionWithDistance(
      currentStep,
      distanceToStep
    );

    const state: NavigationState = {
      isNavigating: true,
      currentStepIndex: this.currentStepIndex,
      distanceToNextManeuver: distanceToStep,
      distanceRemaining: remainingDistance,
      timeRemaining: remainingTime,
      currentInstruction,
      nextInstruction: nextStep ? nextStep.instruction : null,
      isOffRoute,
      offRouteDistance: distanceToStep,
      shouldReroute,
      travelMode: this.travelMode,
    };

    // Handle voice announcements
    this.handleVoiceAnnouncement(state);

    return state;
  }

  // Find which step user is currently on
  private findCurrentStep(
    currentLocation: LocationCoordinate
  ): {
    stepIndex: number;
    distanceToStep: number;
    closestPoint: LocationCoordinate;
  } {
    let minDistance = Infinity;
    let bestStepIndex = this.currentStepIndex;
    let bestPoint = currentLocation;

    // Only check current step and a few steps ahead
    const startIndex = this.currentStepIndex;
    const endIndex = Math.min(
      this.currentStepIndex + 3,
      this.route.steps.length
    );

    for (let i = startIndex; i < endIndex; i++) {
      const step = this.route.steps[i];
      
      // Get step coordinates from route
      const stepStart = this.getStepStartCoordinate(i);
      const stepEnd = this.getStepEndCoordinate(i);

      // Calculate distance to step segment
      const { distance, point } = this.distanceToSegment(
        currentLocation,
        stepStart,
        stepEnd
      );

      if (distance < minDistance) {
        minDistance = distance;
        bestStepIndex = i;
        bestPoint = point;
      }
    }

    return {
      stepIndex: bestStepIndex,
      distanceToStep: minDistance,
      closestPoint: bestPoint,
    };
  }

  // Get step start coordinate from route
  private getStepStartCoordinate(stepIndex: number): LocationCoordinate {
    let coordinateIndex = 0;
    for (let i = 0; i < stepIndex; i++) {
      coordinateIndex += Math.max(1, Math.floor(this.route.steps[i].distance / 100));
    }
    return this.route.coordinates[Math.min(coordinateIndex, this.route.coordinates.length - 1)];
  }

  // Get step end coordinate from route
  private getStepEndCoordinate(stepIndex: number): LocationCoordinate {
    let coordinateIndex = 0;
    for (let i = 0; i <= stepIndex; i++) {
      coordinateIndex += Math.max(1, Math.floor(this.route.steps[i].distance / 100));
    }
    return this.route.coordinates[Math.min(coordinateIndex, this.route.coordinates.length - 1)];
  }

  // Calculate distance from point to line segment
  private distanceToSegment(
    point: LocationCoordinate,
    lineStart: LocationCoordinate,
    lineEnd: LocationCoordinate
  ): { distance: number; point: LocationCoordinate } {
    const A = point.latitude - lineStart.latitude;
    const B = point.longitude - lineStart.longitude;
    const C = lineEnd.latitude - lineStart.latitude;
    const D = lineEnd.longitude - lineStart.longitude;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) {
      param = dot / lenSq;
    }

    let nearestLat, nearestLon;

    if (param < 0) {
      nearestLat = lineStart.latitude;
      nearestLon = lineStart.longitude;
    } else if (param > 1) {
      nearestLat = lineEnd.latitude;
      nearestLon = lineEnd.longitude;
    } else {
      nearestLat = lineStart.latitude + param * C;
      nearestLon = lineStart.longitude + param * D;
    }

    const nearestPoint = { latitude: nearestLat, longitude: nearestLon };
    const distance = calculateDistance(point, nearestPoint);

    return { distance, point: nearestPoint };
  }

  // Calculate remaining distance and time
  private calculateRemaining(
    currentLocation: LocationCoordinate
  ): { remainingDistance: number; remainingTime: number } {
    let remainingDistance = 0;
    let remainingTime = 0;

    // Add distance from current location to end of current step
    const stepEnd = this.getStepEndCoordinate(this.currentStepIndex);
    remainingDistance += calculateDistance(currentLocation, stepEnd);

    // Add remaining steps
    for (let i = this.currentStepIndex + 1; i < this.route.steps.length; i++) {
      remainingDistance += this.route.steps[i].distance;
      remainingTime += this.route.steps[i].duration;
    }

    // Estimate time for current partial step based on travel mode
    const currentPartialDistance = calculateDistance(currentLocation, stepEnd);
    const avgSpeed = this.getAverageSpeed();
    remainingTime += currentPartialDistance / avgSpeed;

    return { remainingDistance, remainingTime };
  }

  // Get average speed for travel mode (m/s)
  private getAverageSpeed(): number {
    switch (this.travelMode) {
      case "driving":
        return 13.9; // ~50 km/h
      case "cycling":
        return 5.6; // ~20 km/h
      case "walking":
        return 1.4; // ~5 km/h
      default:
        return 13.9;
    }
  }

  // Format instruction with distance context
  private formatInstructionWithDistance(
    step: RouteStep,
    distance: number
  ): string {
    const distanceText = this.formatNavigationDistance(distance);
    
    // For very close turns, just say the instruction
    if (distance < this.config.stepCompletionDistance) {
      return step.instruction;
    }

    // For approaching turns
    if (distance < this.config.turnApproachingDistance) {
      return `In ${distanceText}, ${step.instruction.toLowerCase()}`;
    }

    // For distant turns
    if (distance < this.config.turnWarningDistance) {
      return `In ${distanceText}, ${step.instruction.toLowerCase()}`;
    }

    // Just continue
    return step.instruction;
  }

  // Format distance for navigation (more conversational)
  private formatNavigationDistance(meters: number): string {
    if (meters < 50) {
      return "a few meters";
    } else if (meters < 100) {
      return "50 meters";
    } else if (meters < 200) {
      return "100 meters";
    } else if (meters < 400) {
      return `${Math.round(meters / 50) * 50} meters`;
    } else if (meters < 1000) {
      return `${Math.round(meters / 100) * 100} meters`;
    } else {
      return `${(meters / 1000).toFixed(1)} kilometers`;
    }
  }

  // Handle voice announcements
  private handleVoiceAnnouncement(state: NavigationState): void {
    if (!this.config.enableVoiceGuidance) return;

    const shouldAnnounce =
      // New step
      this.currentStepIndex !== this.lastAnnouncedStep ||
      // Approaching turn (at specific distances)
      (state.distanceToNextManeuver < this.config.turnApproachingDistance &&
        this.lastAnnouncedDistance > this.config.turnApproachingDistance) ||
      (state.distanceToNextManeuver < this.config.turnWarningDistance &&
        this.lastAnnouncedDistance > this.config.turnWarningDistance);

    if (shouldAnnounce) {
      this.announceInstruction(state.currentInstruction);
      this.lastAnnouncedStep = this.currentStepIndex;
      this.lastAnnouncedDistance = state.distanceToNextManeuver;
    }
  }

  // Announce instruction (text-to-speech placeholder)
  private announceInstruction(instruction: string): void {
    // In a real app, you'd use expo-speech or a TTS service
    console.log(`🔊 Navigation: ${instruction}`);
    
    // Could implement actual TTS here:
    // import * as Speech from 'expo-speech';
    // Speech.speak(instruction, { language: this.config.voiceLanguage });
  }

  // Play navigation sound (optional)
  private async playNavigationSound(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
      }
      
      // You would load a navigation beep sound here
      // const { sound } = await Audio.Sound.createAsync(
      //   require('../../assets/sounds/nav-beep.mp3')
      // );
      // this.sound = sound;
      // await sound.playAsync();
    } catch (error) {
      console.error("Error playing navigation sound:", error);
    }
  }

  // Reset navigation
  reset(): void {
    this.currentStepIndex = 0;
    this.lastAnnouncedStep = -1;
    this.lastAnnouncedDistance = -1;
  }

  // Clean up resources
  async cleanup(): Promise<void> {
    if (this.sound) {
      await this.sound.unloadAsync();
      this.sound = null;
    }
  }
}

// Helper function to create navigation manager
export const createNavigationManager = (
  route: RouteInfo,
  travelMode: "driving" | "walking" | "cycling" = "driving"
): NavigationManager => {
  return new NavigationManager(route, travelMode);
};

// Format remaining time for display
export const formatRemainingTime = (seconds: number): string => {
  if (seconds < 60) return "< 1 min";
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  const hours = Math.floor(seconds / 3600);
  const mins = Math.round((seconds % 3600) / 60);
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

// Get turn type emoji/icon
export const getTurnIcon = (maneuver: string): string => {
  const lower = maneuver.toLowerCase();
  if (lower.includes("left")) return "↰";
  if (lower.includes("right")) return "↱";
  if (lower.includes("straight") || lower.includes("continue")) return "↑";
  if (lower.includes("u-turn")) return "⟲";
  if (lower.includes("arrive")) return "";
  if (lower.includes("depart")) return "";
  if (lower.includes("roundabout")) return "";
  return "→";
};
