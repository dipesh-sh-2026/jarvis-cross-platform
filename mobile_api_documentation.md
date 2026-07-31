# Jarvis Mobile REST & WebSocket API Specification

This document provides complete documentation for mobile developers building Android (Kotlin/Java) or iOS (Swift/React Native/Flutter) applications to connect to the **Jarvis Sync Engine API**.

---

## Base Endpoints

- **REST API Base URL**: `http://localhost:8080/api/v1/mobile`
- **WebSocket Sync Bus URL**: `ws://localhost:8080/ws/mobile`
- **Content-Type**: `application/json`

---

## 1. Pair Mobile Device Node

Registers a new mobile client node on the Jarvis sync network.

- **Method**: `POST`
- **URL**: `/pair`
- **Request Body**:
```json
{
  "device_name": "Alex's iPhone 15 Pro",
  "platform": "iOS 17.4",
  "pairing_pin": "JRV-8942-SYNC"
}
```

- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Mobile device paired successfully with Jarvis Sync Engine",
  "device": {
    "id": "node-m4",
    "name": "Alex's iPhone 15 Pro",
    "platform": "iOS 17.4",
    "ip": "192.168.1.150",
    "status": "online",
    "battery": "100%",
    "auth_token": "jrv_token_9x8a7b6c5d"
  },
  "sync_server_ws": "ws://localhost:8080/ws/mobile"
}
```

---

## 2. Sync Local Mobile Mutations

Sends offline queued tasks/mutations from the mobile app and receives live state updates from the server.

- **Method**: `POST`
- **URL**: `/sync`
- **Request Body**:
```json
{
  "device_id": "node-m1",
  "mutations": [
    {
      "title": "Grocery List Reminder",
      "status": "PENDING"
    }
  ],
  "last_sync_timestamp": "2026-07-31T11:10:00Z"
}
```

- **Response (200 OK)**:
```json
{
  "success": true,
  "sync_timestamp": "2026-07-31T11:13:20.104Z",
  "server_latency_ms": 38,
  "active_tasks": [
    {
      "task_id": "task-101",
      "title": "Review SRS Specification Document",
      "status": "PENDING"
    }
  ],
  "status": "IN_SYNC"
}
```

---

## 3. Submit Voice & Intent Query

Routes a spoken voice command or text query from the mobile app to Jarvis AI (Google Gemini / Claude API).

- **Method**: `POST`
- **URL**: `/voice-query`
- **Request Body**:
```json
{
  "device_id": "node-m1",
  "query_text": "Jarvis, what is the status of our mobile nodes?"
}
```

- **Response (200 OK)**:
```json
{
  "success": true,
  "device_id": "node-m1",
  "user_query": "Jarvis, what is the status of our mobile nodes?",
  "jarvis_response": "Jarvis system is fully operational. Server latency is 38ms with AES 256 encryption active.",
  "speech_audio_params": {
    "language": "en-US",
    "pitch": 0.95,
    "rate": 1.0
  },
  "timestamp": "2026-07-31T11:13:20.104Z"
}
```

---

## 4. Get Connected Mobile Devices

- **Method**: `GET`
- **URL**: `/devices`
- **Response (200 OK)**:
```json
{
  "count": 2,
  "devices": [
    { "id": "node-m1", "name": "Alex's iPhone 15 Pro", "platform": "iOS 17.4", "status": "online" },
    { "id": "node-m2", "name": "Work Pixel 8 Pro", "platform": "Android 14", "status": "syncing" }
  ]
}
```

---

## 5. WebSocket Real-Time Event Protocol (`ws://localhost:8080/ws/mobile`)

Connect to the persistent WebSocket stream for instant sub-100ms push notifications and live sync state updates:

```javascript
const ws = new WebSocket('ws://localhost:8080/ws/mobile');

ws.onopen = () => {
  console.log('Mobile app connected to Jarvis Sync Bus');
  ws.send(JSON.stringify({
    event: "SUBSCRIBE_TELEMETRY",
    device_id: "node-m1"
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Live Mobile Event Received:', data);
};
```
