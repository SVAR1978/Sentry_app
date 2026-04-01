export interface RiskZone {
  id: string;
  name: string;
  level: "low" | "medium" | "high";
  coordinates: [number, number][]; // polygon [lat, lng]
}

export interface RiskZoneResponse {
  zones: RiskZone[];
}
