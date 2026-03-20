import React from "react";
import { Polygon } from "react-native-maps";
import { RISK_ZONE_COLORS, RiskZone } from "../../constants/mapData";

interface RiskZonePolygonProps {
  zone: RiskZone;
  onPress?: (zone: RiskZone) => void;
}

export const RiskZonePolygon: React.FC<RiskZonePolygonProps> = ({
  zone,
  onPress,
}) => {
  const colors = RISK_ZONE_COLORS[zone.level];

  return (
    <Polygon
      coordinates={zone.coordinates}
      fillColor={colors.fill}
      strokeColor={colors.stroke}
      strokeWidth={2}
      tappable={!!onPress}
      onPress={() => onPress?.(zone)}
    />
  );
};

export default RiskZonePolygon;
