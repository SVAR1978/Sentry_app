export interface RiskZone {
    id: string;
    name: string;
    level: "low" | "medium" | "high";
    coordinates: [number, number][];
}
export interface RiskZoneResponse {
    zones: RiskZone[];
}
//# sourceMappingURL=riskZones.d.ts.map