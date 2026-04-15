# Sentry Frontend (Expo + React Native)

Mobile-first frontend for the Sentry Tourist and Safety platform.

This app provides:
- Role-based user flows (`admin` and `user`)
- Live map and routing experience
- Real-time risk and SOS interactions over WebSocket
- Travel support modules (weather, attractions, help center, support tickets)
- Localized UX (English, Hindi, Assamese)

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Routing and Role Flows](#routing-and-role-flows)
- [Backend Integrations](#backend-integrations)
- [Known Notes](#known-notes)

## Overview

This frontend is built with Expo Router and React Native. It authenticates users, redirects based on role, and renders dedicated tab layouts for admins and users.

The user side focuses on tourist safety:
- Home dashboard
- Explore and place discovery
- Emergency SOS workflow
- Live map with risk overlays and route guidance
- Profile and support tools

The admin side focuses on operations:
- Dashboard
- User management
- Map monitoring
- Settings

## Tech Stack

- **Framework**: Expo SDK 54, React Native 0.81, React 19
- **Routing**: `expo-router`
- **UI**: `react-native-paper`, `lucide-react-native`, `expo-blur`, Reanimated
- **State/Context**: React Context (`AuthContext`, `SocketContext`, tab visibility context)
- **Maps/Geo**: `react-native-maps`, Expo Location, Photon, OSRM, Overpass
- **Realtime**: WebSocket (for location stream, risk alerts, SOS, chat events)
- **i18n**: `i18next`, `react-i18next`, `expo-localization`
- **Storage**: `@react-native-async-storage/async-storage`

## Project Structure

```text
frontend/
  app/
    _layout.tsx                 # Root providers + auth-aware stack flow
    index.tsx                   # Animated splash + auth-based redirect
    (auth)/                     # Login/signup/role selection flow
    (user-tabs)/                # User tab screens + hidden sub-screens
    (admin-tabs)/               # Admin tab screens
  components/
    chat/                       # Chat widget and bubble components
    common/                     # Shared UI pieces (e.g., language selector)
    emergency/                  # Emergency modals and safety tips
    map/                        # Map overlays, markers, search, directions
    userHome/                   # Home dashboard modular blocks
  services/
    api/                        # REST clients (risk, weather, support, booking)
    maps/                       # Search, directions, navigation logic
    risk/                       # Area resolution and multipliers
    sos/                        # SOS dispatch and local state lifecycle
  store/
    AuthContext.tsx             # Auth/session + profile sync
    SocketContext.tsx           # WS lifecycle and event channels
  locales/
    en/ hi/ as/                 # Translation namespaces
  config/
    i18n.ts                     # Language init and persistence
    mapbox.config.ts            # Mapbox settings helper
```

## Features

### 1. Authentication and Role-Based Access
- Signup/login against backend auth endpoints
- Session persistence via AsyncStorage
- Automatic route guard/redirect:
  - unauthenticated -> `(auth)`
  - authenticated admin -> `(admin-tabs)`
  - authenticated user -> `(user-tabs)`

### 2. User Experience
- Custom animated tab bar with dedicated SOS emphasis
- Nearby place discovery and filtered map exploration
- Risk visualization and safety indicators
- Weather card with caching and graceful fallback
- Support tickets and help center flows
- In-app chat widget

### 3. Admin Experience
- Dashboard and user management views
- Operational map visibility
- Settings area for administration tasks

### 4. Realtime and Safety
- WebSocket connection for:
  - live user location events
  - user session events
  - risk alerts
  - SOS dispatch/updates/confirmations
  - chat responses
- SOS dispatch service with retry and local delivery logs

### 5. Localization
- Supported languages: English (`en`), Hindi (`hi`), Spanish, French, Chinese
- Language persisted in AsyncStorage
- Namespaced translation resources (`common`, `auth`, `emergency`)

## Environment Variables

Create a `.env` file in this folder based on `.env.example`.

### Core variables

| Variable | Required | Example / Default | Purpose |
|---|---|---|---|
| `EXPO_PUBLIC_BACKEND_URL` | Yes | `http://localhost:3000` | Main REST backend base URL |
| `EXPO_PUBLIC_WEBSOCKET_URL` | Recommended | `ws://localhost:8080` | Realtime socket URL |
| `EXPO_PUBLIC_OPENWEATHER_API_KEY` | Recommended | `your-openweather-key` | Weather API key |
| `EXPO_PUBLIC_OPENWEATHER_API_URL` | Optional | `https://api.openweathermap.org/data/2.5/weather` | Weather API base |
| `EXPO_PUBLIC_WEATHER_FETCH_TIMEOUT` | Optional | `8000` | Weather request timeout (ms) |
| `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` | Recommended | `your-mapbox-token` | Mapbox token (if Mapbox APIs are used) |
| `EXPO_PUBLIC_MAPBOX_API_URL` | Optional | `https://api.mapbox.com` | Mapbox API root |
| `EXPO_PUBLIC_DEFAULT_COUNTRY_CODE` | Optional | `IN` | Default country bias |
| `EXPO_PUBLIC_DEFAULT_LATITUDE` | Optional | `28.6139` | Default map latitude |
| `EXPO_PUBLIC_DEFAULT_LONGITUDE` | Optional | `77.2090` | Default map longitude |
| `EXPO_PUBLIC_MAP_FETCH_TIMEOUT` | Optional | `8000` | Map fetch timeout (ms) |
| `EXPO_PUBLIC_FETCH_TIMEOUT` | Optional | `8000` | Shared fetch timeout (ms) |
| `EXPO_PUBLIC_AWS_RISK_BASE_URL` | Optional | _empty_ | Direct AWS risk endpoint (alternative to backend proxy) |
| `EXPO_PUBLIC_POLICE_STATION_LOCATION_URL` | Optional | _empty_ | Police station points GeoJSON/API |
| `EXPO_PUBLIC_POLICE_STATION_BOUNDARY_URL` | Optional | _empty_ | Police station boundary polygons |

### Additional optional variables referenced in code

| Variable | Required | Default in code | Purpose |
|---|---|---|---|
| `EXPO_PUBLIC_CHAT_API_URL` | Optional | Placeholder URL in `chatService.ts` | Future dedicated chat REST API |
| `EXPO_PUBLIC_PHOTON_API` | Optional | `https://photon.komoot.io` | Place search backend |
| `EXPO_PUBLIC_OSRM_API` | Optional | `https://router.project-osrm.org` | Directions/routing backend |
| `EXPO_PUBLIC_OVERPASS_API` | Optional | `https://overpass-api.de/api/interpreter` | Nearby OSM POI lookup |

## Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm 9+
- Expo CLI (via `npx expo` usage from scripts)
- Android Studio emulator and/or iOS simulator (macOS for iOS)

### Installation

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Then fill in API keys/URLs as needed.

### Run development server

```bash
npm run start
```

Open targets:
- Android: `npm run android`
- iOS: `npm run ios`
- Web: `npm run web`

## Available Scripts

- `npm run start` - Start Expo dev server
- `npm run android` - Launch Android target
- `npm run ios` - Launch iOS target
- `npm run web` - Launch web target
- `npm run lint` - Run Expo lint rules

## Routing and Role Flows

- Root stack is configured in `app/_layout.tsx`
- Initial gate and redirect logic is in `app/index.tsx`
- Auth flow screens live in `app/(auth)`
- User tabs are in `app/(user-tabs)`
- Admin tabs are in `app/(admin-tabs)`

Role resolution comes from persisted authenticated user data (`store/AuthContext.tsx`).

## Backend Integrations

### REST
- Auth (`/auth/signup`, `/auth/signin`, `/auth/update-profile`)
- Support (`/support/tickets`)
- Risk score endpoints (backend proxy and/or AWS risk API)
- Booking endpoints via `services/api/bookingService.ts`

### WebSocket
- Connection managed in `store/SocketContext.tsx`
- Event channels include:
  - `USER_LOCATION`
  - `USER_SESSION`
  - `LIVE_USERS_COUNT`
  - `RISK_ALERT`
  - `SOS_ALERT`, `SOS_STATUS_UPDATE`, `SOS_CONFIRMED`
  - `CHAT_RESPONSE`, `CHAT_ERROR`

## Known Notes

1. `package.json` contains a `reset-project` script that points to `./scripts/reset-project.js`, but this `scripts/` directory is not present in the current folder snapshot.
2. `services/api/chatService.ts` currently returns a placeholder response until a production chat API endpoint is wired.
3. Risk area lookup gracefully degrades when police boundary/location URLs are not configured.

---

If you are documenting this app in a monorepo root README, you can link to this file as the frontend-specific setup and architecture guide.
