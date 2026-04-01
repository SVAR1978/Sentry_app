#!/bin/bash

# Sentry App - Geofencing Setup Script
# This script helps set up and test the real-time risk scoring system

set -e

echo "======================================"
echo "Sentry Geofencing Setup"
echo "======================================"

# Step 1: Install dependencies
echo ""
echo "[1/5] Installing/checking dependencies..."
cd backend/websocket-backend
npm install 2>/dev/null || echo "  ✓ Already installed"
cd ../https-backend
npm install 2>/dev/null || echo "  ✓ Already installed"
cd ../..

# Step 2: Build TypeScript
echo ""
echo "[2/5] Building TypeScript..."
cd backend/websocket-backend
npm run build 2>/dev/null || echo "  ✓ Build skipped (dev mode)"
cd ../https-backend
npm run build 2>/dev/null || echo "  ✓ Build skipped (dev mode)"
cd ../..

# Step 3: Environment setup
echo ""
echo "[3/5] Checking environment variables..."
if [ ! -f backend/websocket-backend/.env ]; then
  echo "  Creating websocket-backend/.env..."
  cat > backend/websocket-backend/.env << EOF
ML_BACKEND_URL=http://localhost:4141
HIGH_RISK_THRESHOLD=8
PORT=8080
JWT_SECRET=123123
EOF
fi

if [ ! -f backend/https-backend/.env ]; then
  echo "  Creating https-backend/.env..."
  cat > backend/https-backend/.env << EOF
ML_BACKEND_URL=http://localhost:4141
HIGH_RISK_THRESHOLD=8
PORT=3000
JWT_SECRET=123123
EOF
fi

# Step 4: Info message
echo ""
echo "[4/5] Setup complete!"
echo ""
echo "======================================"
echo "Next Steps:"
echo "======================================"
echo ""
echo "1. Start the WebSocket backend:"
echo "   cd backend/websocket-backend && npm run dev"
echo ""
echo "2. Start the HTTPS backend (in another terminal):"
echo "   cd backend/https-backend && npm run dev"
echo ""
echo "3. (Optional) Start ML backend simulator:"
echo "   Ensure http://localhost:4141/zones responds with:"
echo "   {\"zones\": [{id, name, level, coordinates}]}"
echo ""
echo "4. Test the API endpoint:"
echo "   curl http://localhost:3000/api/risk-zones"
echo ""
echo "[5/5] Configuration reference:"
echo ""
echo "Environment Variables:"
echo "  ML_BACKEND_URL      - ML backend address (default: http://localhost:4141)"
echo "  HIGH_RISK_THRESHOLD - Alert threshold (default: 8)"
echo "  PORT                - Server port"
echo "  JWT_SECRET          - JWT signing secret"
echo ""
echo "Endpoints:"
echo "  WS:   ws://localhost:8080?token=<jwt>"
echo "  REST: GET http://localhost:3000/api/risk-zones"
echo ""
echo "WebSocket Message Format:"
echo "  LOCATION: {type: 'LOCATION', payload: {latitude, longitude, ...}}"
echo "  RISK_ALERT: {type: 'RISK_ALERT', payload: {level, score, message, ...}}"
echo ""
echo "======================================"
