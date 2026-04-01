export interface RiskZone {
  id: string;
  name: string;
  level: "low" | "medium" | "high";
  coordinates: [number, number][]; // polygon [lat, lng]
}

export interface RiskZoneResponse {
  zones: RiskZone[];
}

export interface RiskCalculationResult {
  score: number;
  level: "low" | "medium" | "high";
  zoneId?: string;
  zoneName?: string;
}
