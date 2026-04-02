# Backend USER_SESSION Event Implementation Guide

This document explains the real-time USER_SESSION event architecture implemented for the Admin Panel activity feed.

## Architecture Overview

The system uses a **Redis Pub/Sub** pattern to bridge the HTTPS backend (authentication) with the WebSocket backend (real-time broadcasting):

```
┌─────────────────────┐
│  HTTPS Backend      │
│  (Authentication)   │
└──────────┬──────────┘
           │ Publishes USER_SESSION events
           ▼
      ┌─────────┐
      │  Redis  │ (Pub/Sub Channel: "user-session-events")
      │ Pub/Sub │
      └────┬────┘
           │ Subscribes to events
           ▼
┌──────────────────────┐
│ WebSocket Backend    │
│ (Broadcasting)       │
└──────────┬───────────┘
           │ Broadcasts to admin clients
           ▼
┌──────────────────────┐
│  Admin Panel (React) │
│  Activity Feed       │
└──────────────────────┘
```

## Components Modified

### 1. **HTTPS Backend: `/src/routes/auth.ts`** ✅

#### Changes:
- **POST /auth/signin**: Publishes `USER_SESSION` event with action `"LOGIN"`
- **POST /auth/logout**: New endpoint that publishes `USER_SESSION` event with action `"LOGOUT"`

#### Event Publishing:
```typescript
const userSessionEvent = {
  type: "USER_SESSION",
  payload: {
    userId: user.id,
    userName: user.name || user.email,
    action: "LOGIN" | "LOGOUT",
    timestamp: new Date().toISOString(),
  },
};

await redis.publish(
  "user-session-events",
  JSON.stringify(userSessionEvent.payload)
);
```

**Error Handling**: If Redis publishing fails, the endpoint still completes successfully (graceful degradation). The activity feed is a non-critical real-time feature.

---

### 2. **WebSocket Backend: `/src/index.ts`** ✅

#### Changes:
- Imported Redis subscriber for pub/sub
- Set up subscription to `"user-session-events"` channel
- Message handler receives events and broadcasts to admins

#### Redis Subscriber Setup:
```typescript
const redisSubscriber = redis.duplicate();
redisSubscriber.subscribe("user-session-events");

redisSubscriber.on("message", (channel, message) => {
  const sessionEvent: UserSessionPayload = JSON.parse(message);
  broadcastUserSessionToAdmins(ClientManager.getClients(), sessionEvent);
});
```

**Benefits**:
- Listens for events continuously
- Parses JSON payload
- Broadcasts to all connected admin clients
- Error handling for malformed messages

---

### 3. **WebSocket Backend: `/src/services/adminRealtimeService.ts`** ✅

#### New Function: `broadcastUserSessionToAdmins()`

```typescript
export function broadcastUserSessionToAdmins(
  clients: Client[],
  sessionData: UserSessionPayload
): void
```

**Purpose**: Sends USER_SESSION events to all connected admin clients.

**Logic**:
1. Filters for admin clients only
2. Checks WebSocket readiness (OPEN state)
3. Sends JSON payload to each admin
4. Logs broadcast activity and errors

**Payload Structure**:
```json
{
  "type": "USER_SESSION",
  "payload": {
    "userId": "string",
    "userName": "string",
    "action": "LOGIN" | "LOGOUT",
    "timestamp": "ISO-8601-String"
  }
}
```

---

### 4. **WebSocket Backend: `/src/ClientManager.ts`** ✅

#### New Method: `getClients()`

```typescript
public static getClients(): Client[] {
  return ClientManager.clients;
}
```

**Purpose**: Exposes the private static clients array for use in Redis pub/sub message handler.

---

## Data Flow Example

### Login Scenario:

1. **User Login** (Frontend)
   ```
   POST /auth/signin
   {
     "email": "user@example.com",
     "password": "password123"
   }
   ```

2. **HTTPS Backend Processes**
   - ✅ Verifies credentials
   - ✅ Creates JWT token
   - ✅ **Publishes to Redis**:
     ```json
     {
       "userId": "user_123",
       "userName": "John Doe",
       "action": "LOGIN",
       "timestamp": "2026-04-01T10:30:00Z"
     }
     ```

3. **WebSocket Backend Receives**
   - Redis subscriber picks up the event
   - Parses JSON payload
   - Calls `broadcastUserSessionToAdmins()`

4. **Admin Panel Updates**
   - All connected admins receive:
     ```json
     {
       "type": "USER_SESSION",
       "payload": { ... }
     }
     ```
   - Frontend updates activity feed state
   - UI prepends new activity to list

---

## API Endpoints

### POST /auth/signin
**Public endpoint** - Existing authentication.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "message": "Signin successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  }
}
```

**Side Effect**: Publishes LOGIN event to Redis if successful.

---

### POST /auth/logout ⭐ NEW
**Protected endpoint** - Requires Bearer token.

**Request**:
```bash
POST /auth/logout
Authorization: Bearer eyJhbGc...
```

**Response** (200 OK):
```json
{
  "message": "Logout successful"
}
```

**Side Effect**: Publishes LOGOUT event to Redis if token is valid and user exists.

---

## Message Flow Diagram

```
┌────────────────────────────────────────────────────────────────┐
│ SIGNIN REQUEST                                                 │
└────────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ HTTPS Backend (auth.ts:signin)   │
        │ 1. Verify email & password       │
        │ 2. Generate JWT token            │
        │ 3. Publish to Redis              │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Redis Channel:                   │
        │ "user-session-events"            │
        │ Payload: {                       │
        │   userId, userName,              │
        │   action: "LOGIN",               │
        │   timestamp                      │
        │ }                                │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ WebSocket Backend (index.ts)     │
        │ 1. Redis subscriber receives     │
        │ 2. Parse message                 │
        │ 3. Call broadcastUserSessionTo   │
        │    Admins()                      │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ For each connected admin client: │
        │ 1. Check role == "ADMIN"         │
        │ 2. Check WebSocket.readyState    │
        │ 3. Send USER_SESSION payload     │
        └──────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │ Admin Panel (React Native)       │
        │ 1. Receive WebSocket message     │
        │ 2. Update activities state       │
        │ 3. Prepend to activity feed      │
        │ 4. UI re-renders                 │
        └──────────────────────────────────┘
```

---

## Error Handling & Resilience

### Redis Publishing Failures
- **Location**: `/auth.ts` (signin & logout endpoints)
- **Strategy**: Graceful degradation
- **Behavior**: Login/logout completes successfully even if Redis fails
- **Logging**: Error logged to console for debugging

```typescript
try {
  await redis.publish("user-session-events", JSON.stringify(...));
} catch (publishErr) {
  console.error("[AUTH][SIGNIN] Failed to publish USER_SESSION event:", publishErr);
  // Don't fail the signin - continue to response
}
```

### Invalid Message Format
- **Location**: WebSocket backend Redis message handler
- **Strategy**: Try-catch and skip
- **Behavior**: Logs error and skips malformed events
- **Impact**: One bad event doesn't crash the system

```typescript
try {
  const sessionEvent: UserSessionPayload = JSON.parse(message);
  broadcastUserSessionToAdmins(ClientManager.getClients(), sessionEvent);
} catch (err) {
  console.error("[WebSocket] Failed to parse USER_SESSION event from Redis:", err);
}
```

### WebSocket Send Failures
- **Location**: `adminRealtimeService.ts` broadcastUserSessionToAdmins()
- **Strategy**: Try-catch per client
- **Behavior**: Gracefully handles individual client send failures
- **Impact**: One failed send doesn't prevent sending to other admins

```typescript
for (const adminClient of activeAdmins) {
  try {
    adminClient.ws.send(JSON.stringify(payload));
  } catch (err) {
    console.error(`Failed to send USER_SESSION to admin ${adminClient.userId}:`, err);
  }
}
```

---

## Testing the Implementation

### Manual Test: User Login

1. **Start servers**:
   ```bash
   # Terminal 1: WebSocket backend
   cd backend/websocket-backend
   npm run dev

   # Terminal 2: HTTPS backend
   cd backend/https-backend
   npm run dev
   ```

2. **Connect Admin WebSocket Client**:
   ```javascript
   const ws = new WebSocket('ws://localhost:8080?token=ADMIN_JWT_TOKEN');
   ws.onmessage = (event) => {
     console.log('Received:', JSON.parse(event.data));
   };
   ```

3. **User Logs In**:
   ```bash
   curl -X POST http://localhost:3000/auth/signin \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
   ```

4. **Expected Output on Admin WS**:
   ```json
   {
     "type": "USER_SESSION",
     "payload": {
       "userId": "user_123",
       "userName": "John Doe",
       "action": "LOGIN",
       "timestamp": "2026-04-01T10:30:00Z"
     }
   }
   ```

5. **Monitor Redis** (optional):
   ```bash
   redis-cli
   > SUBSCRIBE user-session-events
   ```

---

## Key Implementation Details

| Aspect | Details |
|--------|---------|
| **Event Channel** | `user-session-events` (Redis Pub/Sub) |
| **Event Type** | `USER_SESSION` |
| **Actions** | `LOGIN`, `LOGOUT` |
| **Broadcasting** | To ADMIN role clients only |
| **Payload** | userId, userName, action, timestamp |
| **Error Handling** | Graceful degradation (non-critical feature) |
| **Logging** | Comprehensive logging at each stage |
| **Memory Leaks** | Redis subscriber cleaned properly on shutdown |

---

## Next Steps for Frontend Integration

The frontend React Native AdminDashboard should:

1. **Connect to WebSocket** with ADMIN JWT token
2. **Listen for USER_SESSION events** with type filter
3. **Update activities state** - prepend new events
4. **Format timestamps** - "Just now" → relative time
5. **Clean up listener** on component unmount

See `REALTIME_ACTIVITY_FEED_GUIDE.md` for frontend implementation details.

---

## Troubleshooting

### Admin not receiving USER_SESSION events

1. ✅ Verify Redis is running:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. ✅ Check WebSocket backend logs for subscription confirmation:
   ```
   [Redis] Successfully subscribed to 1 channel(s): user-session-events
   ```

3. ✅ Verify admin role in JWT token:
   ```javascript
   jwt.decode(token) // role should be "ADMIN"
   ```

4. ✅ Check Redis publisher (log in HTTPS backend):
   ```
   [AUTH][SIGNIN] Published USER_SESSION LOGIN event to Redis
   ```

### Redis connection error

- Ensure Redis URL is correct in `.env`: `REDIS_URL=redis://localhost:6379`
- Test connection: `redis-cli`

### WebSocket connection not open

- Check admin is connected with valid JWT
- Verify role in token is "ADMIN"
- Check WebSocket server is running on correct port

---

**Last Updated**: April 1, 2026
