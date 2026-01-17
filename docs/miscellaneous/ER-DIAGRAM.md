# Entity Relationship Diagram - Lifterico

## Complete ER Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar email UK
        varchar phone UK
        varchar full_name
        text avatar_url
        enum role
        enum status
        boolean email_verified
        boolean phone_verified
        timestamptz created_at
        timestamptz updated_at
    }

    BUSINESSES {
        uuid id PK
        uuid owner_id FK
        varchar name
        enum type
        text description
        text address
        varchar city
        varchar state
        varchar phone
        varchar email
        text logo_url
        enum verification_status
        timestamptz verified_at
        timestamptz created_at
    }

    BUSINESS_DOCUMENTS {
        uuid id PK
        uuid business_id FK
        enum document_type
        text document_url
        enum status
        timestamptz uploaded_at
    }

    RIDERS {
        uuid id PK
        uuid user_id FK
        uuid business_id FK
        enum vehicle_type
        varchar vehicle_plate
        varchar license_number
        enum status
        decimal current_lat
        decimal current_lng
        decimal rating
        integer total_deliveries
        enum verification_status
        timestamptz created_at
    }

    ORDERS {
        uuid id PK
        varchar order_number UK
        uuid sme_id FK
        uuid business_id FK
        enum status
        text pickup_address
        decimal pickup_lat
        decimal pickup_lng
        varchar pickup_contact_name
        varchar pickup_contact_phone
        text delivery_address
        decimal delivery_lat
        decimal delivery_lng
        varchar delivery_contact_name
        varchar delivery_contact_phone
        text package_description
        enum package_size
        decimal delivery_fee
        decimal distance_km
        integer estimated_duration
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    DELIVERIES {
        uuid id PK
        uuid order_id FK
        uuid rider_id FK
        enum status
        timestamptz assigned_at
        timestamptz picked_up_at
        timestamptz delivered_at
        timestamptz failed_at
        text failure_reason
        integer actual_duration
    }

    TRACKING_LOGS {
        uuid id PK
        uuid delivery_id FK
        uuid rider_id FK
        decimal latitude
        decimal longitude
        decimal speed
        integer heading
        timestamptz recorded_at
    }

    PROOF_OF_DELIVERY {
        uuid id PK
        uuid delivery_id FK
        enum proof_type
        text photo_url
        varchar otp_code
        text signature_url
        varchar recipient_name
        text notes
        timestamptz created_at
    }

    TRANSACTIONS {
        uuid id PK
        uuid order_id FK
        uuid payer_id FK
        uuid payee_id FK
        decimal amount
        decimal commission
        decimal net_amount
        enum payment_method
        varchar payment_reference
        enum status
        timestamptz paid_at
        timestamptz created_at
    }

    PAYOUTS {
        uuid id PK
        uuid business_id FK
        decimal amount
        varchar bank_name
        varchar account_number
        varchar account_name
        enum status
        varchar reference
        timestamptz processed_at
        timestamptz created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        enum type
        varchar title
        text message
        jsonb data
        boolean read
        timestamptz read_at
        timestamptz created_at
    }

    UPGRADE_REQUESTS {
        uuid id PK
        uuid business_id FK
        text reason
        enum status
        uuid reviewed_by FK
        timestamptz reviewed_at
        text rejection_reason
        timestamptz created_at
    }

    %% Relationships
    USERS ||--o| BUSINESSES : "owns"
    BUSINESSES ||--o{ BUSINESS_DOCUMENTS : "has"
    BUSINESSES ||--o{ RIDERS : "employs"
    USERS ||--o| RIDERS : "is"
    USERS ||--o{ ORDERS : "creates (SME)"
    BUSINESSES ||--o{ ORDERS : "receives"
    ORDERS ||--o| DELIVERIES : "has"
    RIDERS ||--o{ DELIVERIES : "executes"
    DELIVERIES ||--o{ TRACKING_LOGS : "generates"
    DELIVERIES ||--o| PROOF_OF_DELIVERY : "has"
    ORDERS ||--o| TRANSACTIONS : "has"
    USERS ||--o{ TRANSACTIONS : "pays"
    USERS ||--o{ TRANSACTIONS : "receives"
    BUSINESSES ||--o{ PAYOUTS : "requests"
    USERS ||--o{ NOTIFICATIONS : "receives"
    BUSINESSES ||--o{ UPGRADE_REQUESTS : "submits"
    USERS ||--o{ UPGRADE_REQUESTS : "reviews"
```

---

## Simplified ER Diagram (Core Entities)

```mermaid
erDiagram
    USERS ||--o| BUSINESSES : owns
    BUSINESSES ||--o{ RIDERS : employs
    USERS ||--o{ ORDERS : creates
    BUSINESSES ||--o{ ORDERS : receives
    ORDERS ||--|| DELIVERIES : has
    RIDERS ||--o{ DELIVERIES : executes
    DELIVERIES ||--o{ TRACKING_LOGS : generates
    DELIVERIES ||--|| PROOF_OF_DELIVERY : has
    ORDERS ||--|| TRANSACTIONS : has

    USERS {
        uuid id PK
        string email
        string role
    }

    BUSINESSES {
        uuid id PK
        uuid owner_id FK
        string type
    }

    RIDERS {
        uuid id PK
        uuid business_id FK
        string status
    }

    ORDERS {
        uuid id PK
        uuid sme_id FK
        uuid business_id FK
        string status
    }

    DELIVERIES {
        uuid id PK
        uuid order_id FK
        uuid rider_id FK
        string status
    }

    TRACKING_LOGS {
        uuid id PK
        uuid delivery_id FK
        decimal lat
        decimal lng
    }

    PROOF_OF_DELIVERY {
        uuid id PK
        uuid delivery_id FK
        string proof_type
    }

    TRANSACTIONS {
        uuid id PK
        uuid order_id FK
        decimal amount
    }
```

---

## Relationship Descriptions

| Relationship | Type | Description |
|--------------|------|-------------|
| Users → Businesses | 1:0..1 | A user can own at most one business |
| Businesses → Business_Documents | 1:N | A business can have multiple documents |
| Businesses → Riders | 1:N | A logistics business can have many riders |
| Users → Riders | 1:0..1 | A user can be at most one rider |
| Users → Orders | 1:N | An SME user can create many orders |
| Businesses → Orders | 1:N | A logistics business can receive many orders |
| Orders → Deliveries | 1:0..1 | An order has at most one active delivery |
| Riders → Deliveries | 1:N | A rider can execute many deliveries |
| Deliveries → Tracking_Logs | 1:N | A delivery has many location logs |
| Deliveries → Proof_of_Delivery | 1:0..1 | A delivery has at most one proof |
| Orders → Transactions | 1:0..1 | An order has at most one transaction |
| Businesses → Payouts | 1:N | A business can request many payouts |
| Users → Notifications | 1:N | A user can have many notifications |
| Businesses → Upgrade_Requests | 1:N | A business can submit upgrade requests |

---

## Cardinality Summary

```
Users (1) ────────── (0..1) Businesses
Businesses (1) ───── (0..N) Business_Documents
Businesses (1) ───── (0..N) Riders
Users (1) ────────── (0..1) Riders
Users (1) ────────── (0..N) Orders
Businesses (1) ───── (0..N) Orders
Orders (1) ────────── (0..1) Deliveries
Riders (1) ────────── (0..N) Deliveries
Deliveries (1) ───── (0..N) Tracking_Logs
Deliveries (1) ───── (0..1) Proof_of_Delivery
Orders (1) ────────── (0..1) Transactions
Businesses (1) ───── (0..N) Payouts
Users (1) ────────── (0..N) Notifications
```
