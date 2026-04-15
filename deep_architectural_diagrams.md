# Sentry: Deep Architectural Analysis & UML Documentation

This document represents Phase 2 of the deep architectural analysis of the Sentry codebase. It translates the raw structures, schemas, and API paths of the `frontend`, `https-backend`, `websocket-backend`, and `email-worker-backend` into formalized UML representations.

---

## DIAGRAM 1: ER DIAGRAM (Entity Relationship)

**Brief Explanation:**
This diagram showcases the complete PostgreSQL relational schema driven by Prisma. It maps the physical constraints, datatypes, and relationships for identity management, tracking, and emergency systems.

```mermaid
erDiagram
    %% Entities
    User {
        String id PK
        String name
        String email UK
        String phone
        String password
        UserRole role
        String avatar
        String address
        DateTime createdAt
        DateTime updatedAt
    }

    LocationLog {
        String id PK
        String userId FK
        Float latitude
        Float longitude
        Float accuracy
        Float speed
        Float heading
        Int riskScore
        LocationSource source
        DateTime timestamp
    }

    EmergencyContact {
        String id PK
        String userId FK
        String name
        String phone
        String email
        String relation
    }

    Itinerary {
        String id PK
        String userId FK
        String startLocation
        String endLocation
        DateTime startTime
        DateTime endTime
        ItineraryStatus status
        Json checklist
    }

    SOSAlert {
        String id PK
        String userId FK
        SOSStatus status
        Float latitude
        Float longitude
        String address
        Json emergencyContacts
        DateTime resolvedAt
        DateTime cancelledAt
        DateTime acknowledgedAt
        DateTime createdAt
        DateTime updatedAt
    }

    SupportTicket {
        String id PK
        Int ticketNumber UK
        String userId FK
        String name
        String email
        String subject
        String message
        TicketStatus status
        DateTime createdAt
        DateTime updatedAt
    }

    BookingPartner {
        String id PK
        String name
        String description
        String url
        String logoUrl
        String category
        Boolean isVerified
        Boolean isActive
        Int priority
        DateTime createdAt
        DateTime updatedAt
    }

    BookingVisit {
        String id PK
        String userId FK
        String partnerId FK
        Int durationMs
        DateTime visitedAt
    }

    SafetyAlert {
        String id PK
        String title
        String description
        AlertSeverity severity
        String[] affectedAreas
        String issuedBy
        Boolean isActive
        DateTime createdAt
        DateTime expiresAt
    }

    SafetyZone {
        String id PK
        String areaName
        Float safetyScore
        ZoneLevel zoneLevel
        Json polygon
        String notes
        DateTime updatedAt
    }

    %% Relationships
    User ||--o{ LocationLog : "generates"
    User ||--o{ EmergencyContact : "registers"
    User ||--o{ Itinerary : "schedules"
    User ||--o{ SOSAlert : "triggers"
    User ||--o{ BookingVisit : "performs"
    User ||--o{ SupportTicket : "opens"
    BookingPartner ||--o{ BookingVisit : "receives"
```

**Key Insights:**
*   **Cascade Deletes:** Almost all core operational tracking entities tightly couple heavily to the `User` object (via `userId`). If a user is deleted, all their trace data (`LocationLog`, `SOSAlert`) guarantees deletion. 
*   **Data Snapshots:** The `SOSAlert` ingeniously takes a `Json` snapshot of `emergencyContacts`. This prevents historical corruption if a user changes or removes an emergency contact after an SOS is resolved.
*   **Decoupled Geography Features:** `SafetyAlert` and `SafetyZone` are globally scoped rather than user-scoped. They define the boundaries the rest of the application runs calculations against.

---

## DIAGRAM 2: SEQUENCE DIAGRAMS

### Sequence Flow A: SOS Alert Full Lifecycle
**Brief Explanation:**
Displays the asynchronous flow of a Tourist triggering an emergency through their mobile device, up to the parallel paths of WebSockets for dashboards and Redis backing queues for external mailing.

```mermaid
sequenceDiagram
    autonumber
    actor Tourist
    participant Client as React Native App
    participant HTTPS as HTTPS Backend (/sos)
    participant DB as Postgres (Prisma)
    participant Redis as Redis (Message Broker)
    participant Worker as Email Worker Node
    participant Brevo as Brevo API
    participant WS as WebSocket Service
    actor Admin

    Tourist->>Client: Press SOS Button
    Client->>HTTPS: POST /sos (userId, coords)
    
    activate HTTPS
    HTTPS->>DB: Fetch Emergency Contacts
    DB-->>HTTPS: Extracted Contacts List
    
    HTTPS->>DB: INSERT into SOSAlert (Status: ACTIVE)
    DB-->>HTTPS: Alert ID Generated
    
    par Push Updates & Fallbacks
        HTTPS->>Redis: enqueue("sendEmail", contactData)
        HTTPS-->>Client: HTTP 200 OK (SOS Dispatched)
        Client->>WS: Broadcast WS Payload (GPS Stream)
        WS->>Admin: Push Realtime "SOS_BROADCAST"
    end
    deactivate HTTPS
    
    activate Worker
    Redis-->>Worker: Dequeue Job
    Worker->>Brevo: POST SMTP API Payload
    Brevo-->>Worker: 201 Sent
    deactivate Worker
    
    Admin->>HTTPS: PUT /sos/:id/acknowledge
    HTTPS->>DB: Update SOSAlert (Status: ACKNOWLEDGED)
    HTTPS->>WS: Broadcast Pub/Sub update
    WS->>Client: Send UI State "Help Resending"
```
**Key Insights:**
*   The architecture opts for immediate HTTP persistence, delegating slow exterior dependency (SMTP Emails) entirely out of the standard loop using BullMQ. 
*   Admins manage system state via traditional REST verbs which bounce back into Real-time updates via internal Pub/Sub systems pushing through the decoupled WebSockets API.

### Sequence Flow B: Geolocation Risk Scoring
**Brief Explanation:**
Depicts how the app pulls risk metrics combining local APIs and remote AWS-hosted static structures via Lambda proxy.

```mermaid
sequenceDiagram
    autonumber
    actor Tourist
    participant App as React Client
    participant HTTPS as HTTPS Backend 
    participant Weather as WeatherService (Ex)
    participant Lambda as Serverless AWS Proxy
    participant S3 as AWS S3 Storage
    
    Tourist->>App: Maps Render / Movement
    App->>HTTPS: POST /api/risk-scores/area (coords, area_id)
    
    activate HTTPS
    
    HTTPS->>Lambda: fetch('AWS_RISK_BASE_URL/score/area')
    activate Lambda
    Lambda->>S3: load 'feature_store.json'
    S3-->>Lambda: Base Risk Map
    Lambda-->>HTTPS: Base Category Score
    deactivate Lambda

    HTTPS->>Weather: fetchLocationWeather(latitude)
    Weather-->>HTTPS: Current Humidity/Precipitation
    HTTPS->>HTTPS: Execute Risk Multipliers
    
    HTTPS-->>App: Return Final Mutated Score Array
    deactivate HTTPS
    
    App->>Tourist: Update Map Visuals / Render Red Zones
```

---

## DIAGRAM 3: USE CASE DIAGRAM

**Brief Explanation:**
Maps the primary functional business boundaries comparing what the System, Security Administrators, and Tourists can execute within the application ecosystem.

```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Tourist User" as User
actor "Security Administrator" as Admin
actor "Background Worker" as System

rectangle "Sentry Safety Operations System" {
  
  rectangle "Authentication & Identity" {
    usecase "Login/Register" as UC1
    usecase "Update Profile Settings" as UC2
    usecase "Manage Emergency Contacts" as UC3
  }

  rectangle "Real-time Tracking & Risk" {
    usecase "Stream GPS Data" as UC4
    usecase "View Risk Scores" as UC5
    usecase "Issue Geofence Warnings" as UC6
    usecase "Manage Safe Zones / Polygons" as UC7
    usecase "Broadcast Global Alerts" as UC8
  }

  rectangle "Emergency Handlers (SOS)" {
    usecase "Trigger Panic / SOS" as UC9
    usecase "View Aggregated SOS Feed" as UC10
    usecase "Acknowledge / Resolve Crises" as UC11
    usecase "Dispatch Emergency Emails" as UC12
  }
}

' Tourist interactions
User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC9

' Administrator Interactions
Admin --> UC1
Admin --> UC7
Admin --> UC8
Admin --> UC10
Admin --> UC11

' System Interactions
System --> UC6
System --> UC12

' Extensions & Inclusions
UC9 ..> UC4 : <<includes>>
UC4 ..> UC6 : <<extends>>
UC9 ..> UC12 : <<includes>>
UC10 ..> UC11 : <<extends>>

@enduml
```

**Key Insights:**
*   **Clear Authorization Dividing Lines:** The application is split exactly dual-tenant. Geofences and map logic are strictly generated down from Administration endpoints context.
*   **Automation:** The `Background Worker` (System) exclusively drives external actions (Email, Risk Multiplier logic based on Weather, GPS evaluating polygons) shielding the Tourist layer from complex client calculations.

---

## END-TO-END ARCHITECTURE SUMMARY

The Sentry Smart Tourist application operates horizontally out of **two parallel data avenues**: a standard `HTTPS Express implementation` for deterministic configuration operations, and a `WebSocket protocol implementation` designed for handling massive, consistent asynchronous coordinate dumps and admin dashboard mutations. 

The entire framework surrounds a `PostgreSQL/Prisma` core heavily intertwined. A Tourist initializes the application, authenticating against the database, before rendering map layers fed via a proxy passing through the Express app to an external **AWS Serverless infrastructure** containing highly optimized machine learning Risk Maps. When in danger, the user triggers an `SOSAlert`. Rather than blocking the UI, this HTTP request instantaneously dumps the heavy computation into a **BullMQ Redis memory store**. This permits a headless Node worker to absorb the high-latency punishment of transmitting external SMTP jobs while simultaneously pumping the coordinates natively into the socket network alerting local administration instantly to react.
