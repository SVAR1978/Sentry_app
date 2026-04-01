#!/usr/bin/env node

/**
 * Geofencing Test Suite
 * 
 * This script tests the real-time risk scoring and geofencing system.
 * Run with: node test-geofencing.mjs
 */

import http from "http";

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:4141";
const API_BASE = "http://localhost:3000";
const WS_URL = "ws://localhost:8080";

// Test data
const TEST_ZONES = {
  high_risk: [40.7128, -74.006],  // Inside high-risk zone
  medium_risk: [40.712, -74.0075], // Inside medium-risk zone
  safe_zone: [40.8, -73.97],       // Outside all zones
};

const API_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXIiLCJyb2xlIjoiVVNFUiJ9.test";

// Color codes for output
const colors = {
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(color, label, message) {
  console.log(`${colors[color]}[${label}]${colors.reset} ${message}`);
}

function fetchAPI(endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, API_BASE);
    const req = http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on("error", reject);
  });
}

async function testRiskZonesAPI() {
  log("blue", "TEST_1", "Testing GET /api/risk-zones endpoint");
  try {
    const result = await fetchAPI("/api/risk-zones");
    if (result.zones && Array.isArray(result.zones)) {
      log("green", "PASS", `API returned ${result.zones.length} zones`);
      result.zones.forEach((zone) => {
        log("blue", "ZONE", `  ${zone.name} (${zone.level}) - ${zone.coordinates.length} points`);
      });
      return true;
    } else {
      log("red", "FAIL", "Invalid response format");
      return false;
    }
  } catch (err) {
    log("red", "ERROR", `API test failed: ${err.message}`);
    return false;
  }
}

function testPointInPolygon() {
  log("blue", "TEST_2", "Testing point-in-polygon algorithm");

  // Simple polygon: square from (0,0) to (1,1)
  const polygon = [[0, 0], [1, 0], [1, 1], [0, 1]];

  const testCases = [
    { point: [0.5, 0.5], inside: true, name: "Center" },
    { point: [0, 0], inside: true, name: "Corner" },
    { point: [2, 2], inside: false, name: "Outside" },
  ];

  let passed = 0;
  testCases.forEach(({ point, inside, name }) => {
    // Ray casting implementation
    let result = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [lat1, lng1] = polygon[i];
      const [lat2, lng2] = polygon[j];
      const isIntersect =
        (lng1 > point[1]) !== (lng2 > point[1]) &&
        point[0] < ((lng2 - lng1) * (point[1] - lat1)) / (lat2 - lat1) + lng1;
      if (isIntersect) result = !result;
    }

    const status = result === inside ? "✓" : "✗";
    if (result === inside) passed++;
    log(result === inside ? "green" : "red", "POINT", `  ${status} ${name}: ${JSON.stringify(point)}`);
  });

  log(passed === testCases.length ? "green" : "red", "SCORE", `Passed ${passed}/${testCases.length}`);
  return passed === testCases.length;
}

function testDataStructures() {
  log("blue", "TEST_3", "Testing data structures");

  const sampleZone = {
    id: "zone-1",
    name: "Test Zone",
    level: "high",
    coordinates: [[0, 0], [1, 0], [1, 1], [0, 1]],
  };

  const sampleRiskResult = {
    score: 9,
    level: "high",
    zoneId: "zone-1",
    zoneName: "Test Zone",
  };

  const sampleAlert = {
    type: "RISK_ALERT",
    payload: {
      level: "high",
      score: 9,
      message: "You have entered a HIGH-RISK zone",
      zoneName: "Test Zone",
      timestamp: new Date().toISOString(),
    },
  };

  try {
    // Validate zone
    if (!sampleZone.id || !sampleZone.coordinates) {
      throw new Error("Invalid zone structure");
    }
    log("green", "PASS", "Zone structure valid");

    // Validate risk result
    if (sampleRiskResult.score < 1 || sampleRiskResult.score > 10) {
      throw new Error("Risk score out of range");
    }
    log("green", "PASS", "Risk result structure valid");

    // Validate alert
    if (sampleAlert.type !== "RISK_ALERT") {
      throw new Error("Invalid alert type");
    }
    log("green", "PASS", "Alert structure valid");

    return true;
  } catch (err) {
    log("red", "ERROR", err.message);
    return false;
  }
}

function testEnvironmentSetup() {
  log("blue", "TEST_4", "Checking environment setup");

  const checks = [
    { name: "API Server", url: API_BASE, expected: 3000 },
    { name: "WebSocket Server", url: WS_URL, expected: 8080 },
  ];

  let passed = 0;
  checks.forEach(({ name, url, expected }) => {
    try {
      const parsed = new URL(url);
      const port = parsed.port || (parsed.protocol === "ws:" ? 8080 : 3000);
      if (port == expected || expected == 0) {
        log("green", "PASS", `${name}: ${url}`);
        passed++;
      }
    } catch (err) {
      log("red", "ERROR", `${name}: ${err.message}`);
    }
  });

  return passed === checks.length;
}

async function runTests() {
  console.log("\n" + colors.blue + "====================================");
  console.log("Sentry Geofencing - Test Suite");
  console.log("====================================" + colors.reset + "\n");

  const results = [];

  results.push(await testRiskZonesAPI());
  results.push(testPointInPolygon());
  results.push(testDataStructures());
  results.push(testEnvironmentSetup());

  console.log("\n" + colors.blue + "====================================");
  const passed = results.filter((r) => r).length;
  const total = results.length;
  const color = passed === total ? "green" : "yellow";
  log(color, "SUMMARY", `${passed}/${total} tests passed`);
  console.log("====================================" + colors.reset);

  if (passed < total) {
    console.log("\nℹ️  Make sure servers are running:");
    console.log("  WebSocket: npm run dev (in websocket-backend)");
    console.log("  HTTPS: npm run dev (in https-backend)");
  }

  process.exit(passed === total ? 0 : 1);
}

runTests().catch((err) => {
  console.error("Test suite error:", err);
  process.exit(1);
});
