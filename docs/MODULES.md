# Module Breakdown
## Lifterico Delivery Platform

---

## Module Overview

| Module | Description | Phase |
|--------|-------------|-------|
| Auth | Authentication & authorization | 1 |
| User | User profile management | 1 |
| Business | Logistics & SME management | 1 |
| Order | Delivery order management | 1 |
| Rider | Rider & fleet management | 2 |
| Tracking | Real-time GPS tracking | 2 |
| Analytics | Reports & metrics | 3 |
| Payment | Paystack & commissions | 4 |
| Notification | SMS, push, in-app alerts | 3 |
| Map | OpenStreetMap integration | 2 |
| Storage | File uploads & documents | 1 |

---

## 1. Auth Module

**Purpose:** Handle user authentication, session management, and security.

**Features:**
- Email/Password Login
- Phone Authentication (OTP)
- Session Management (JWT)
- Password Reset
- Role-based Access Control

**Dependencies:** Supabase Auth

---

## 2. User Module

**Purpose:** Manage user profiles, preferences, and account settings.

**Features:**
- Profile Management
- Avatar Upload
- Password Change
- Notification Preferences

**Dependencies:** Auth Module, Storage Module

---

## 3. Business Module

**Purpose:** Manage logistics businesses and SME accounts.

**Features:**
- Business Registration
- Document Verification
- SME Upgrade Request
- Admin Approval Workflow
- Business Settings

**Dependencies:** Auth, User, Storage Modules

---

## 4. Order Module

**Purpose:** Handle delivery order creation, management, and lifecycle.

**Features:**
- Order Creation with Address Picker
- Order Listing & Search
- Status Updates & Timeline
- Order Cancellation
- Bulk Orders

**Order Status Flow:**
```
PENDING → ACCEPTED → ASSIGNED → PICKED_UP → IN_TRANSIT → DELIVERED
    ↓         ↓          ↓           ↓            ↓
 CANCELLED  REJECTED   FAILED    RETURNED     FAILED
```

**Dependencies:** Auth, Business, Rider, Map Modules

---

## 5. Rider Module

**Purpose:** Manage dispatch riders, fleet, and rider operations.

**Features:**
- Rider Registration & Onboarding
- Document Verification
- Fleet Management
- Status Management (Online/Offline/Busy)
- Performance Tracking
- Earnings Dashboard

**Dependencies:** Auth, Business, Storage Modules

---

## 6. Tracking Module

**Purpose:** Real-time GPS tracking and location management.

**Features:**
- Real-time Location Updates
- ETA Calculation
- Route Display
- Location History
- Geofencing (Future)

**Dependencies:** Map, Rider, Order Modules

---

## 7. Analytics Module

**Purpose:** Business intelligence, reporting, and metrics.

**Features:**
- Dashboard Statistics
- Order Analytics
- Revenue Analytics
- Performance Reports
- CSV/PDF Export

**Dependencies:** Order, Rider, Payment Modules

---

## 8. Payment Module

**Purpose:** Handle payments, commissions, and financial transactions.

**Features:**
- Paystack Integration
- 15% Commission Deduction
- Transaction History
- Payout Requests
- Earnings Dashboard
- COD Support (Future)

**Dependencies:** Order, Business Modules, Paystack API

---

## 9. Notification Module

**Purpose:** Handle all system notifications across channels.

**Features:**
- In-app Notifications
- SMS (Africa's Talking)
- Push Notifications (FCM)
- Email Notifications
- Notification Preferences

**Dependencies:** Auth Module, Africa's Talking API, Firebase

---

## 10. Map Module

**Purpose:** Map display and geolocation services.

**Features:**
- OpenStreetMap + Leaflet Integration
- Address Picker
- Route Display
- Rider Markers
- Distance Calculation

**Dependencies:** Leaflet, OpenStreetMap

---

## 11. Storage Module

**Purpose:** File uploads and document management.

**Features:**
- Profile Pictures
- Business Documents
- Rider Documents
- Proof of Delivery Photos

**Dependencies:** Supabase Storage

---

## Module Dependencies Graph

```
Auth ──────────────────────────────────────────────────┐
  │                                                    │
  ├──> User ──────────────────────────────────────┐    │
  │      │                                        │    │
  │      └──> Business ───────────────────────┐   │    │
  │             │                             │   │    │
  │             ├──> Rider ───────────────┐   │   │    │
  │             │      │                  │   │   │    │
  │             │      └──> Tracking ─────┼───┼───┼────┤
  │             │             │           │   │   │    │
  │             └──> Order ───┴───────────┴───┴───┘    │
  │                    │                               │
  │                    ├──> Payment ───────────────────┤
  │                    │                               │
  │                    └──> Analytics ─────────────────┘
  │
  └──> Notification
  │
  └──> Storage
```
