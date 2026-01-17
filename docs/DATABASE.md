# Database Schema - Lifterico

## Database: PostgreSQL (Supabase)

---

## Tables Overview

| Table | Description |
|-------|-------------|
| users | All system users |
| businesses | Logistics companies and SMEs |
| business_documents | Verification documents |
| riders | Dispatch riders |
| rider_documents | Rider verification docs |
| orders | Delivery orders |
| deliveries | Active deliveries |
| tracking_logs | GPS location history |
| proof_of_delivery | Delivery proof records |
| transactions | Payment records |
| payouts | Business payouts |
| notifications | User notifications |
| upgrade_requests | SME upgrade requests |

---

## Table Schemas

### 1. users
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique email |
| phone | VARCHAR(20) | Phone number |
| full_name | VARCHAR(255) | User's full name |
| avatar_url | TEXT | Profile picture URL |
| role | ENUM | admin, logistics, sme, rider, customer |
| status | ENUM | active, inactive, suspended, pending |
| email_verified | BOOLEAN | Email verification status |
| phone_verified | BOOLEAN | Phone verification status |
| created_at | TIMESTAMPTZ | Creation timestamp |
| updated_at | TIMESTAMPTZ | Last update |

### 2. businesses
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| owner_id | UUID | FK to users |
| name | VARCHAR(255) | Business name |
| type | ENUM | logistics, sme |
| description | TEXT | Business description |
| address | TEXT | Business address |
| city | VARCHAR(100) | City |
| state | VARCHAR(100) | State |
| phone | VARCHAR(20) | Business phone |
| email | VARCHAR(255) | Business email |
| logo_url | TEXT | Logo URL |
| verification_status | ENUM | pending, verified, rejected |
| verified_at | TIMESTAMPTZ | Verification date |
| created_at | TIMESTAMPTZ | Creation timestamp |

### 3. business_documents
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | UUID | FK to businesses |
| document_type | ENUM | cac, id_card, utility_bill |
| document_url | TEXT | Document file URL |
| status | ENUM | pending, approved, rejected |
| uploaded_at | TIMESTAMPTZ | Upload timestamp |

### 4. riders
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| business_id | UUID | FK to businesses |
| vehicle_type | ENUM | motorcycle, bicycle, car |
| vehicle_plate | VARCHAR(20) | Plate number |
| license_number | VARCHAR(50) | Driver's license |
| status | ENUM | offline, online, busy, on_delivery |
| current_lat | DECIMAL(10,8) | Current latitude |
| current_lng | DECIMAL(11,8) | Current longitude |
| rating | DECIMAL(3,2) | Average rating (0-5) |
| total_deliveries | INTEGER | Completed deliveries |
| verification_status | ENUM | pending, verified, rejected |
| created_at | TIMESTAMPTZ | Creation timestamp |

### 5. orders
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_number | VARCHAR(20) | Unique order number |
| sme_id | UUID | FK to users (SME) |
| business_id | UUID | FK to businesses (Logistics) |
| status | ENUM | pending, accepted, assigned, picked_up, in_transit, delivered, cancelled, failed |
| pickup_address | TEXT | Pickup location |
| pickup_lat | DECIMAL(10,8) | Pickup latitude |
| pickup_lng | DECIMAL(11,8) | Pickup longitude |
| pickup_contact_name | VARCHAR(255) | Pickup contact |
| pickup_contact_phone | VARCHAR(20) | Pickup phone |
| delivery_address | TEXT | Delivery location |
| delivery_lat | DECIMAL(10,8) | Delivery latitude |
| delivery_lng | DECIMAL(11,8) | Delivery longitude |
| delivery_contact_name | VARCHAR(255) | Recipient name |
| delivery_contact_phone | VARCHAR(20) | Recipient phone |
| package_description | TEXT | Package details |
| package_size | ENUM | small, medium, large |
| delivery_fee | DECIMAL(10,2) | Delivery cost |
| distance_km | DECIMAL(10,2) | Distance |
| estimated_duration | INTEGER | ETA in minutes |
| notes | TEXT | Special instructions |
| created_at | TIMESTAMPTZ | Order creation |
| updated_at | TIMESTAMPTZ | Last update |

### 6. deliveries
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | FK to orders |
| rider_id | UUID | FK to riders |
| status | ENUM | assigned, picked_up, in_transit, delivered, failed, returned |
| assigned_at | TIMESTAMPTZ | Assignment time |
| picked_up_at | TIMESTAMPTZ | Pickup time |
| delivered_at | TIMESTAMPTZ | Delivery time |
| failed_at | TIMESTAMPTZ | Failure time |
| failure_reason | TEXT | Reason for failure |
| actual_duration | INTEGER | Actual time (minutes) |

### 7. tracking_logs
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| delivery_id | UUID | FK to deliveries |
| rider_id | UUID | FK to riders |
| latitude | DECIMAL(10,8) | Location latitude |
| longitude | DECIMAL(11,8) | Location longitude |
| speed | DECIMAL(5,2) | Speed (km/h) |
| heading | INTEGER | Direction (0-360) |
| recorded_at | TIMESTAMPTZ | Recording time |

### 8. proof_of_delivery
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| delivery_id | UUID | FK to deliveries |
| proof_type | ENUM | photo, otp, signature |
| photo_url | TEXT | Photo URL |
| otp_code | VARCHAR(6) | OTP code |
| signature_url | TEXT | Signature image |
| recipient_name | VARCHAR(255) | Who received |
| notes | TEXT | Delivery notes |
| created_at | TIMESTAMPTZ | Creation time |

### 9. transactions
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| order_id | UUID | FK to orders |
| payer_id | UUID | FK to users |
| payee_id | UUID | FK to users |
| amount | DECIMAL(10,2) | Total amount |
| commission | DECIMAL(10,2) | Platform fee (15%) |
| net_amount | DECIMAL(10,2) | After commission |
| payment_method | ENUM | paystack, wallet, cod |
| payment_reference | VARCHAR(100) | Paystack reference |
| status | ENUM | pending, completed, failed, refunded |
| paid_at | TIMESTAMPTZ | Payment time |
| created_at | TIMESTAMPTZ | Creation time |

### 10. payouts
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | UUID | FK to businesses |
| amount | DECIMAL(10,2) | Payout amount |
| bank_name | VARCHAR(100) | Bank name |
| account_number | VARCHAR(20) | Account number |
| account_name | VARCHAR(255) | Account holder |
| status | ENUM | pending, processing, completed, failed |
| reference | VARCHAR(100) | Payout reference |
| processed_at | TIMESTAMPTZ | Processing time |
| created_at | TIMESTAMPTZ | Request time |

### 11. notifications
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | FK to users |
| type | ENUM | order, delivery, payment, system |
| title | VARCHAR(255) | Notification title |
| message | TEXT | Notification body |
| data | JSONB | Additional data |
| read | BOOLEAN | Read status |
| read_at | TIMESTAMPTZ | Read timestamp |
| created_at | TIMESTAMPTZ | Creation time |

### 12. upgrade_requests
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| business_id | UUID | FK to businesses |
| reason | TEXT | Upgrade reason |
| status | ENUM | pending, approved, rejected |
| reviewed_by | UUID | FK to users (admin) |
| reviewed_at | TIMESTAMPTZ | Review time |
| rejection_reason | TEXT | If rejected |
| created_at | TIMESTAMPTZ | Request time |

---

## Key Relationships

```
users ─────────< businesses ─────────< riders
  │                  │                   │
  │                  │                   │
  └──────< orders >──┘                   │
              │                          │
              └────────< deliveries >────┘
                             │
                             ├────< tracking_logs
                             │
                             └────< proof_of_delivery

transactions ────< orders
notifications ────< users
payouts ────< businesses
upgrade_requests ────< businesses
```

---

## Indexes

- users: email, role, status
- businesses: owner_id, type, verification_status
- riders: business_id, status, (current_lat, current_lng)
- orders: sme_id, business_id, status, created_at
- deliveries: order_id, rider_id, status
- tracking_logs: delivery_id, recorded_at
- transactions: order_id, status
- notifications: user_id, (user_id, read)

---

## Row Level Security (RLS)

All tables have RLS enabled:
- Users see only their own data
- SMEs see their orders
- Logistics see assigned orders and their riders
- Riders see their deliveries
- Admins have full access
