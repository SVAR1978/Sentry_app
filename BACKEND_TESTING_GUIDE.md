# USER_SESSION Event Backend Testing Guide

This guide provides step-by-step instructions to test and validate the USER_SESSION real-time event system.

## Prerequisites

- ✅ Redis running (`redis-cli` accessible)
- ✅ WebSocket backend (`ws://localhost:8080`)
- ✅ HTTPS backend (`http://localhost:3000`)
- ✅ Admin JWT token (role: "ADMIN")
- ✅ User credentials for login test

## Test Setup

### 1. Create Test Users

```bash
# Create test admin user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
# Response: Save the token as ADMIN_TOKEN

# Create test regular user
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@test.com",
    "password": "user123",
    "role": "USER"
  }'
# Response: Save the token as USER_TOKEN
```

---

## Test 1: Admin WebSocket Connection

**Objective**: Verify admin can connect to WebSocket and receive messages

**Steps**:

1. Open terminal and create WebSocket client script (`test-admin-ws.js`):

```javascript
const WebSocket = require('ws');

// Replace with your actual admin token
const ADMIN_TOKEN = 'YOUR_ADMIN_JWT_TOKEN_HERE';

const ws = new WebSocket(`ws://localhost:8080?token=${ADMIN_TOKEN}`);

ws.on('open', () => {
  console.log('✅ Admin connected to WebSocket');
});

ws.on('message', (data) => {
  const message = JSON.parse(data);
  console.log('📨 Received message:', JSON.stringify(message, null, 2));
  
  if (message.type === 'USER_SESSION') {
    console.log(`✅ USER_SESSION event received: ${message.payload.action}`);
  }
});

ws.on('error', (err) => {
  console.error('❌ WebSocket error:', err);
});

ws.on('close', () => {
  console.log('❌ WebSocket disconnected');
});

console.log('Waiting for messages... (Keep this running)');
```

2. Run the script:
```bash
node test-admin-ws.js
```

3. Expected output:
```
✅ Admin connected to WebSocket
```

---

## Test 2: User Login Event

**Objective**: Verify LOGIN event is published and received

**Steps**:

1. Keep the admin WebSocket client running (from Test 1)

2. In another terminal, trigger user login:
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123"
  }'
```

3. **Expected output in HTTPS backend logs**:
```
[AUTH][SIGNIN] Request received
[AUTH][SIGNIN] Password verified
[AUTH][SIGNIN] Published USER_SESSION LOGIN event to Redis
  userId: user_123
  userName: Test User
```

4. **Expected output in WebSocket backend logs**:
```
[WebSocket] Received USER_SESSION event from Redis: LOGIN for user user_123
[AdminRealtimeService] Broadcasting USER_SESSION event to 1 admin(s):
  { userId, userName, action: 'LOGIN', timestamp }
```

5. **Expected output in admin WebSocket client**:
```
📨 Received message:
{
  "type": "USER_SESSION",
  "payload": {
    "userId": "user_123",
    "userName": "Test User",
    "action": "LOGIN",
    "timestamp": "2026-04-01T10:30:00.000Z"
  }
}
✅ USER_SESSION event received: LOGIN
```

---

## Test 3: User Logout Event

**Objective**: Verify LOGOUT event is published and received

**Steps**:

1. Keep the admin WebSocket client running

2. Trigger user logout (use USER_TOKEN from setup):
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_USER_JWT_TOKEN"
```

3. **Expected output in HTTPS backend logs**:
```
[AUTH][LOGOUT] Request received
[AUTH][LOGOUT] Published USER_SESSION LOGOUT event to Redis
  userId: user_123
  userName: Test User
```

4. **Expected output in WebSocket backend logs**:
```
[WebSocket] Received USER_SESSION event from Redis: LOGOUT for user user_123
[AdminRealtimeService] Broadcasting USER_SESSION event to 1 admin(s)
```

5. **Expected output in admin WebSocket client**:
```
📨 Received message:
{
  "type": "USER_SESSION",
  "payload": {
    "userId": "user_123",
    "userName": "Test User",
    "action": "LOGOUT",
    "timestamp": "2026-04-01T10:31:00.000Z"
  }
}
✅ USER_SESSION event received: LOGOUT
```

---

## Test 4: Multiple Admin Clients

**Objective**: Verify multiple admins receive the same event

**Steps**:

1. Run two separate admin WebSocket clients:

```bash
# Terminal 1
node test-admin-ws.js

# Terminal 2
node test-admin-ws.js
```

2. User logs in from another terminal:
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "user123"
  }'
```

3. **Expected output**:
   - Both admin clients should receive the USER_SESSION event
   - Both show: `✅ USER_SESSION event received: LOGIN`

---

## Test 5: Rapid Login/Logout Sequence

**Objective**: Verify system handles rapid events without data loss

**Steps**:

1. Keep admin WebSocket client running

2. Run this test script (`rapid-test.sh`):

```bash
#!/bin/bash

# Login attempt 1
echo "Login attempt 1..."
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}' > /tmp/token1.json 2>/dev/null

sleep 2

# Logout
echo "Logout attempt 1..."
TOKEN=$(jq -r '.token' /tmp/token1.json)
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null

sleep 2

# Login attempt 2
echo "Login attempt 2..."
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}' > /tmp/token2.json 2>/dev/null

sleep 2

# Logout again
echo "Logout attempt 2..."
TOKEN=$(jq -r '.token' /tmp/token2.json)
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null
```

3. Run it:
```bash
chmod +x rapid-test.sh
./rapid-test.sh
```

4. **Expected output in admin WebSocket client**:
   - Receives 4 events in sequence:
     1. LOGIN
     2. LOGOUT
     3. LOGIN
     4. LOGOUT
   - No events lost or mixed

---

## Test 6: Redis Monitoring

**Objective**: Verify events are flowing through Redis correctly

**Steps**:

1. In a separate terminal, subscribe to Redis channel:
```bash
redis-cli SUBSCRIBE user-session-events
```

2. Trigger a user login:
```bash
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'
```

3. **Expected output in redis-cli**:
```
Reading messages... (press Ctrl-C to quit)
1) "subscribe"
2) "user-session-events"
3) (integer) 1
1) "message"
2) "user-session-events"
3) "{\"userId\":\"user_123\",\"userName\":\"Test User\",\"action\":\"LOGIN\",\"timestamp\":\"2026-04-01T10:30:00.000Z\"}"
```

---

## Test 7: Error Handling - Invalid Token Logout

**Objective**: Verify logout handles invalid tokens gracefully

**Steps**:

1. Try logout with invalid token:
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token_123"
```

2. **Expected output**:
```json
{
  "message": "Invalid token"
}
```

3. **Expected behavior**:
   - Status code: 401
   - No USER_SESSION event published
   - No error in WebSocket backend
   - Admin clients receive no event

---

## Test 8: Error Handling - Missing Token Logout

**Objective**: Verify logout requires token

**Steps**:

1. Try logout without token:
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json"
```

2. **Expected output**:
```json
{
  "message": "Token is required"
}
```

3. **Status code**: 401

---

## Test 9: Payload Validation

**Objective**: Verify USER_SESSION payload has correct structure

**Steps**:

1. Run admin WebSocket client and capture a message:

```javascript
ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.type === 'USER_SESSION') {
    const payload = message.payload;
    
    // Validate structure
    console.log('🔍 Validation:');
    console.log('✓ userId:', typeof payload.userId === 'string' ? '✅' : '❌');
    console.log('✓ userName:', typeof payload.userName === 'string' ? '✅' : '❌');
    console.log('✓ action:', ['LOGIN', 'LOGOUT'].includes(payload.action) ? '✅' : '❌');
    console.log('✓ timestamp:', /^\d{4}-\d{2}-\d{2}T/.test(payload.timestamp) ? '✅' : '❌');
  }
});
```

2. Trigger a login event

3. **Expected output**:
```
🔍 Validation:
✓ userId: ✅
✓ userName: ✅
✓ action: ✅
✓ timestamp: ✅
```

---

## Test 10: Disconnection Recovery

**Objective**: Verify system handles client disconnections

**Steps**:

1. Connect admin WebSocket client
2. Trigger a login event (verify received)
3. Disconnect the admin client
4. Trigger another login event
5. Reconnect admin WebSocket client
6. Trigger a logout event

**Expected behavior**:
- Admin receives LOGIN before disconnect
- Admin doesn't receive the login event while disconnected
- Admin receives LOGOUT after reconnecting
- No errors in backend logs
- No message accumulation in Redis

---

## Performance Test: Monitor Event Latency

**Objective**: Measure time from login to admin receiving event

**Steps**:

1. Modify test script to measure timing:

```javascript
const WebSocket = require('ws');

const ADMIN_TOKEN = 'YOUR_ADMIN_JWT_TOKEN_HERE';
const timings = {};

const ws = new WebSocket(`ws://localhost:8080?token=${ADMIN_TOKEN}`);

ws.on('message', (data) => {
  const message = JSON.parse(data);
  
  if (message.type === 'USER_SESSION') {
    const receivedAt = Date.now();
    const eventTime = new Date(message.payload.timestamp).getTime();
    const latency = receivedAt - eventTime;
    
    console.log(`📊 Event latency: ${latency}ms`);
    console.log(`   Event: ${message.payload.action}`);
    console.log(`   User: ${message.payload.userName}`);
  }
});
```

2. Run login/logout tests and observe latencies

3. **Expected results**: < 500ms latency (typically < 100ms)

---

## Debugging Checklist

| Issue | Solution |
|-------|----------|
| Admin not receiving events | ✓ Check Redis is running<br>✓ Verify admin role in JWT<br>✓ Check WebSocket readyState<br>✓ Review backend logs |
| Events not published | ✓ Check Redis connection in HTTPS backend<br>✓ Verify signin/logout endpoints hit<br>✓ Check HTTPS backend logs |
| Lost events | ✓ Verify no Redis connection errors<br>✓ Check admin client reconnects properly<br>✓ Monitor WebSocket state |
| Slow delivery | ✓ Check network latency<br>✓ Monitor Redis performance<br>✓ Check subscriber backlog |
| Failed logout | ✓ Verify token is valid<br>✓ Check user exists in DB<br>✓ Review auth logs |

---

## Log Patterns for Debugging

### Successful LOGIN Flow
```
[AUTH][SIGNIN] Request received
[AUTH][SIGNIN] Password verified
[AUTH][SIGNIN] Published USER_SESSION LOGIN event to Redis
[WebSocket] Received USER_SESSION event from Redis: LOGIN for user {userId}
[AdminRealtimeService] Broadcasting USER_SESSION event to X admin(s)
```

### Successful LOGOUT Flow
```
[AUTH][LOGOUT] Request received
[AUTH][LOGOUT] Published USER_SESSION LOGOUT event to Redis
[WebSocket] Received USER_SESSION event from Redis: LOGOUT for user {userId}
[AdminRealtimeService] Broadcasting USER_SESSION event to X admin(s)
```

### Redis Subscription Setup
```
[Redis] Successfully subscribed to 1 channel(s): user-session-events
```

---

**Last Updated**: April 1, 2026
