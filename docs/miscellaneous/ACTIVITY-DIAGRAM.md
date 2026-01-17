# Activity Diagrams - Lifterico

## 1. User Registration Flow

```mermaid
flowchart TD
    A([Start]) --> B[Select User Role]
    B --> C[Enter Registration Details]
    C --> D{Valid Input?}
    D -->|No| E[Show Validation Errors]
    E --> C
    D -->|Yes| F{Email/Phone Exists?}
    F -->|Yes| G[Show Duplicate Error]
    G --> C
    F -->|No| H[Create User Account]
    H --> I[Send Verification Email/SMS]
    I --> J[Show Success Message]
    J --> K([End])
```

---

## 2. Order Creation Flow

```mermaid
flowchart TD
    A([Start]) --> B[SME Logs In]
    B --> C[Navigate to Create Order]
    C --> D[Enter Pickup Details]
    D --> E[Enter Delivery Details]
    E --> F[Select Package Size]
    F --> G[System Calculates Fee & ETA]
    G --> H[Select Logistics Company]
    H --> I{Logistics Available?}
    I -->|No| J[Show No Logistics Message]
    J --> H
    I -->|Yes| K[Review Order Summary]
    K --> L{Confirm Order?}
    L -->|No| M[Edit Details]
    M --> D
    L -->|Yes| N[Initialize Payment]
    N --> O{Payment Success?}
    O -->|No| P[Show Payment Error]
    P --> N
    O -->|Yes| Q[Create Order]
    Q --> R[Notify Logistics]
    R --> S[Show Order Confirmation]
    S --> T([End])
```

---

## 3. Rider Assignment Flow

```mermaid
flowchart TD
    A([Start]) --> B[Order Received by Logistics]
    B --> C{Accept Order?}
    C -->|No| D[Reject Order]
    D --> E[Notify SME]
    E --> F([End - Rejected])
    C -->|Yes| G{Assignment Type?}
    G -->|Automatic| H[Find Nearest Available Rider]
    G -->|Manual| I[Select Rider from Fleet]
    H --> J{Rider Found?}
    J -->|No| K[Notify Logistics - No Riders]
    K --> I
    J -->|Yes| L[Assign Rider]
    I --> L
    L --> M[Send Notification to Rider]
    M --> N{Rider Accepts?}
    N -->|No| O[Find Next Rider]
    O --> J
    N -->|Yes| P[Update Order Status]
    P --> Q[Notify SME]
    Q --> R([End - Assigned])
```

---

## 4. Delivery Execution Flow

```mermaid
flowchart TD
    A([Start]) --> B[Rider Receives Assignment]
    B --> C[Rider Accepts Delivery]
    C --> D[Navigate to Pickup Location]
    D --> E[Arrive at Pickup]
    E --> F[Verify Package]
    F --> G{Package OK?}
    G -->|No| H[Report Issue]
    H --> I[Contact Logistics]
    I --> J([End - Issue Reported])
    G -->|Yes| K[Confirm Pickup]
    K --> L[Update Status: Picked Up]
    L --> M[Navigate to Delivery Location]
    M --> N[Update Location Continuously]
    N --> O[Arrive at Delivery]
    O --> P{Customer Available?}
    P -->|No| Q[Contact Customer]
    Q --> R{Customer Responds?}
    R -->|No| S[Mark as Failed]
    S --> T[Return Package]
    T --> U([End - Failed])
    R -->|Yes| P
    P -->|Yes| V[Deliver Package]
    V --> W[Capture Proof of Delivery]
    W --> X[Update Status: Delivered]
    X --> Y[Notify All Parties]
    Y --> Z([End - Completed])
```

---

## 5. Payment Flow

```mermaid
flowchart TD
    A([Start]) --> B[Order Created]
    B --> C[Calculate Delivery Fee]
    C --> D[Display Payment Options]
    D --> E{Payment Method?}
    E -->|Paystack| F[Initialize Paystack]
    E -->|COD| G[Mark as COD]
    F --> H[Redirect to Paystack]
    H --> I[Customer Completes Payment]
    I --> J{Payment Verified?}
    J -->|No| K[Show Payment Failed]
    K --> L{Retry?}
    L -->|Yes| F
    L -->|No| M[Cancel Order]
    M --> N([End - Cancelled])
    J -->|Yes| O[Record Transaction]
    G --> O
    O --> P[Calculate Commission 15%]
    P --> Q[Update Business Balance]
    Q --> R[Send Payment Confirmation]
    R --> S([End - Paid])
```

---

## 6. Payout Request Flow

```mermaid
flowchart TD
    A([Start]) --> B[Logistics Views Balance]
    B --> C{Balance > 0?}
    C -->|No| D[Show No Balance Message]
    D --> E([End])
    C -->|Yes| F[Enter Payout Amount]
    F --> G{Amount <= Balance?}
    G -->|No| H[Show Insufficient Balance]
    H --> F
    G -->|Yes| I[Confirm Bank Details]
    I --> J[Submit Payout Request]
    J --> K[Notify Admin]
    K --> L[Admin Reviews Request]
    L --> M{Approve?}
    M -->|No| N[Reject with Reason]
    N --> O[Notify Logistics]
    O --> P([End - Rejected])
    M -->|Yes| Q[Process Payout via Paystack]
    Q --> R{Transfer Success?}
    R -->|No| S[Mark as Failed]
    S --> T[Notify Admin]
    T --> L
    R -->|Yes| U[Update Balance]
    U --> V[Notify Logistics]
    V --> W([End - Completed])
```

---

## 7. Business Verification Flow

```mermaid
flowchart TD
    A([Start]) --> B[Business Registers]
    B --> C[Upload Documents]
    C --> D[Submit for Verification]
    D --> E[Status: Pending]
    E --> F[Admin Notified]
    F --> G[Admin Reviews Documents]
    G --> H{Documents Valid?}
    H -->|No| I{Fixable?}
    I -->|Yes| J[Request Re-upload]
    J --> K[Notify Business]
    K --> C
    I -->|No| L[Reject Business]
    L --> M[Send Rejection Reason]
    M --> N([End - Rejected])
    H -->|Yes| O[Approve Business]
    O --> P[Status: Verified]
    P --> Q[Notify Business Owner]
    Q --> R[Enable Full Features]
    R --> S([End - Verified])
```

---

## 8. Real-time Tracking Flow

```mermaid
flowchart TD
    A([Start]) --> B[User Opens Tracking Page]
    B --> C[Load Delivery Details]
    C --> D[Initialize Map]
    D --> E[Subscribe to Realtime Channel]
    E --> F[Display Rider Location]
    F --> G[Calculate ETA]
    G --> H{Delivery Complete?}
    H -->|No| I[Wait for Location Update]
    I --> J[Receive New Location]
    J --> K[Update Map Marker]
    K --> L[Recalculate ETA]
    L --> H
    H -->|Yes| M[Show Delivery Complete]
    M --> N[Unsubscribe from Channel]
    N --> O([End])
```
