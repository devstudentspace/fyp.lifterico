# System Architecture
## Lifterico Delivery Platform

---

## 1. Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Web Dashboard │  │   Mobile App    │  │   Mobile App    │             │
│  │   (Next.js)     │  │   (React Native)│  │   (Rider PWA)   │             │
│  │                 │  │   [Future]      │  │   [Future]      │             │
│  │  • Admin        │  │                 │  │                 │             │
│  │  • Logistics    │  │  • SME          │  │  • Rider        │             │
│  │  • SME          │  │  • Customer     │  │  • Offline Mode │             │
│  │  • Rider        │  │                 │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
└───────────┼─────────────────────┼─────────────────────┼─────────────────────┘
            │                     │                     │
            └─────────────────────┼─────────────────────┘
                                  │
                          ┌───────▼───────┐
                          │   API Gateway │
                          │   (Next.js    │
                          │   API Routes) │
                          └───────┬───────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                         BACKEND LAYER                                        │
├─────────────────────────────────┼───────────────────────────────────────────┤
│                                 │                                            │
│  ┌──────────────────────────────▼──────────────────────────────────────┐    │
│  │                        SUPABASE PLATFORM                             │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │    │
│  │  │  PostgreSQL │  │  Auth       │  │  Realtime   │  │  Storage   │  │    │
│  │  │  Database   │  │  Service    │  │  WebSocket  │  │  (Files)   │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │    │
│  │  ┌─────────────┐  ┌─────────────┐                                   │    │
│  │  │  Edge       │  │  Row Level  │                                   │    │
│  │  │  Functions  │  │  Security   │                                   │    │
│  │  └─────────────┘  └─────────────┘                                   │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼───────────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                                   │
├─────────────────────────────────┼───────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ OpenStreet  │  │  Africa's   │  │  Paystack   │  │  Firebase   │        │
│  │ Map + Leaflet│  │  Talking    │  │  Payment    │  │  FCM        │        │
│  │ (Maps/GPS)  │  │  (SMS)      │  │  Gateway    │  │  (Push)     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Architecture Principles

1. **Modular Design** - Loosely coupled modules for independent development
2. **API-First** - All functionality exposed via REST APIs for mobile app development
3. **Real-time First** - WebSocket connections for live tracking and updates
4. **Offline-Ready** - Service workers and local storage for offline capability
5. **Security by Design** - Row-level security, encryption, and RBAC
6. **Scalable** - Designed to handle growth with minimal refactoring

---

## 2. Frontend Architecture

### 2.1 Web Dashboard (Next.js)

```
app/
├── (auth)/                     # Authentication routes (public)
│   ├── login/
│   ├── register/
│   ├── forgot-password/
│   └── verify/
│
├── (dashboard)/                # Protected dashboard routes
│   ├── layout.tsx              # Shared dashboard layout
│   │
│   ├── admin/                  # Admin dashboard
│   │   ├── page.tsx            # Admin overview
│   │   ├── users/              # User management
│   │   ├── logistics/          # Logistics business management
│   │   ├── orders/             # All orders overview
│   │   ├── disputes/           # Dispute resolution
│   │   ├── settings/           # System settings
│   │   └── reports/            # System-wide reports
│   │
│   ├── logistics/              # Logistics Business dashboard
│   │   ├── page.tsx            # Logistics overview
│   │   ├── riders/             # Fleet management
│   │   ├── orders/             # Order management
│   │   ├── tracking/           # Live tracking
│   │   ├── earnings/           # Revenue & payouts
│   │   └── settings/           # Business settings
│   │
│   ├── sme/                    # SME dashboard
│   │   ├── page.tsx            # SME overview
│   │   ├── orders/             # Create & manage orders
│   │   ├── tracking/           # Track deliveries
│   │   ├── history/            # Order history
│   │   ├── payments/           # Payment history
│   │   └── settings/           # Account settings
│   │
│   └── rider/                  # Rider dashboard
│       ├── page.tsx            # Rider overview
│       ├── deliveries/         # Active deliveries
│       ├── history/            # Delivery history
│       ├── earnings/           # Earnings tracker
│       └── settings/           # Profile settings
│
└── api/                        # API routes
    ├── auth/
    ├── orders/
    ├── riders/
    ├── tracking/
    ├── payments/
    └── webhooks/
```

### 2.2 Component Architecture

```
components/
├── ui/                         # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── table.tsx
│   ├── dialog.tsx
│   └── ...
│
├── common/                     # Shared components
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── breadcrumb.tsx
│   ├── data-table.tsx
│   ├── loading-spinner.tsx
│   └── error-boundary.tsx
│
├── maps/                       # Map components
│   ├── map-container.tsx
│   ├── rider-marker.tsx
│   ├── route-display.tsx
│   └── location-picker.tsx
│
├── orders/                     # Order-related components
│   ├── order-form.tsx
│   ├── order-card.tsx
│   ├── order-status.tsx
│   └── order-timeline.tsx
│
├── riders/                     # Rider-related components
│   ├── rider-card.tsx
│   ├── rider-status.tsx
│   └── rider-assignment.tsx
│
└── analytics/                  # Analytics components
    ├── stats-card.tsx
    ├── chart-container.tsx
    └── report-table.tsx
```

### 2.3 State Management

```typescript
// stores/
├── auth-store.ts              // Authentication state
├── order-store.ts             // Order management state
├── rider-store.ts             // Rider management state
├── tracking-store.ts          // Real-time tracking state
├── notification-store.ts      // Notifications state
└── ui-store.ts                // UI state (sidebar, modals)
```

---

## 3. Backend Architecture

### 3.1 Database Schema Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │   businesses    │     │     riders      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id              │────<│ owner_id        │     │ id              │
│ email           │     │ id              │────<│ business_id     │
│ phone           │     │ name            │     │ user_id         │────┐
│ role            │     │ type            │     │ status          │    │
│ status          │     │ verified        │     │ vehicle_type    │    │
└─────────────────┘     └─────────────────┘     │ current_location│    │
                                                └─────────────────┘    │
                                                                       │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐   │
│     orders      │     │   deliveries    │     │   tracking      │   │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤   │
│ id              │────<│ order_id        │     │ id              │   │
│ sme_id          │     │ id              │────<│ delivery_id     │   │
│ business_id     │     │ rider_id        │────>│ location        │   │
│ status          │     │ status          │     │ timestamp       │   │
│ pickup_address  │     │ proof_type      │     └─────────────────┘   │
│ delivery_address│     │ proof_data      │                           │
│ amount          │     └─────────────────┘                           │
└─────────────────┘                                                   │
                                                                      │
┌─────────────────┐     ┌─────────────────┐                          │
│   transactions  │     │   notifications │                          │
├─────────────────┤     ├─────────────────┤                          │
│ id              │     │ id              │                          │
│ order_id        │     │ user_id         │──────────────────────────┘
│ amount          │     │ type            │
│ commission      │     │ message         │
│ status          │     │ read            │
│ payment_ref     │     └─────────────────┘
└─────────────────┘
```

### 3.2 API Architecture

```
/api/v1/
├── /auth
│   ├── POST   /register          # User registration
│   ├── POST   /login             # User login
│   ├── POST   /logout            # User logout
│   ├── POST   /refresh           # Refresh token
│   ├── POST   /forgot-password   # Password reset request
│   └── POST   /reset-password    # Password reset
│
├── /users
│   ├── GET    /me                # Get current user
│   ├── PUT    /me                # Update current user
│   ├── GET    /:id               # Get user by ID (admin)
│   └── GET    /                  # List users (admin)
│
├── /businesses
│   ├── POST   /                  # Create business
│   ├── GET    /                  # List businesses
│   ├── GET    /:id               # Get business details
│   ├── PUT    /:id               # Update business
│   └── GET    /:id/riders        # Get business riders
│
├── /riders
│   ├── POST   /                  # Register rider
│   ├── GET    /                  # List riders
│   ├── GET    /:id               # Get rider details
│   ├── PUT    /:id               # Update rider
│   ├── PUT    /:id/status        # Update rider status
│   ├── GET    /:id/location      # Get rider location
│   └── GET    /available         # Get available riders
│
├── /orders
│   ├── POST   /                  # Create order
│   ├── GET    /                  # List orders
│   ├── GET    /:id               # Get order details
│   ├── PUT    /:id               # Update order
│   ├── PUT    /:id/status        # Update order status
│   ├── PUT    /:id/assign        # Assign rider
│   └── POST   /:id/cancel        # Cancel order
│
├── /deliveries
│   ├── GET    /:id               # Get delivery details
│   ├── PUT    /:id/status        # Update delivery status
│   ├── POST   /:id/proof         # Submit proof of delivery
│   └── GET    /:id/tracking      # Get tracking history
│
├── /tracking
│   ├── POST   /update            # Update rider location
│   ├── GET    /rider/:id         # Get rider tracking
│   └── WS     /live/:deliveryId  # WebSocket for live tracking
│
├── /payments
│   ├── POST   /initialize        # Initialize payment
│   ├── POST   /verify            # Verify payment
│   ├── GET    /history           # Payment history
│   └── POST   /webhook           # Paystack webhook
│
├── /notifications
│   ├── GET    /                  # Get notifications
│   ├── PUT    /:id/read          # Mark as read
│   └── PUT    /read-all          # Mark all as read
│
└── /analytics
    ├── GET    /dashboard         # Dashboard stats
    ├── GET    /orders            # Order analytics
    ├── GET    /revenue           # Revenue analytics
    └── GET    /performance       # Performance metrics
```

---

## 4. Real-time Architecture

### 4.1 WebSocket Channels

```typescript
// Supabase Realtime Channels

// Order updates channel
supabase.channel('orders')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'orders' 
  }, handleOrderChange)

// Rider location channel
supabase.channel('rider-tracking')
  .on('broadcast', { event: 'location-update' }, handleLocationUpdate)

// Notifications channel
supabase.channel(`notifications:${userId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, handleNotification)
```

### 4.2 Real-time Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Rider     │     │  Supabase   │     │  Dashboard  │
│   App       │     │  Realtime   │     │  (Web)      │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │  Location Update  │                   │
       │──────────────────>│                   │
       │                   │  Broadcast        │
       │                   │──────────────────>│
       │                   │                   │
       │  Status Update    │                   │
       │──────────────────>│                   │
       │                   │  DB Change Event  │
       │                   │──────────────────>│
       │                   │                   │
```

---

## 5. Offline Architecture

### 5.1 Offline Strategy for Riders

```typescript
// Service Worker Strategy
// 1. Cache static assets (App Shell)
// 2. Queue location updates when offline
// 3. Sync when connection restored

interface OfflineQueue {
  locationUpdates: LocationUpdate[];
  statusUpdates: StatusUpdate[];
  proofOfDelivery: ProofData[];
}

// IndexedDB for local storage
const offlineDB = {
  activeDeliveries: Delivery[];
  pendingUpdates: OfflineQueue;
  cachedRoutes: Route[];
}
```

### 5.2 Sync Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE MODE                              │
├─────────────────────────────────────────────────────────────┤
│  1. Detect offline status                                   │
│  2. Store updates in IndexedDB queue                        │
│  3. Show offline indicator to user                          │
│  4. Continue allowing status updates locally                │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ Connection Restored
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    SYNC PROCESS                              │
├─────────────────────────────────────────────────────────────┤
│  1. Detect online status                                    │
│  2. Process queued updates in order                         │
│  3. Resolve conflicts (server wins for most cases)          │
│  4. Clear synced items from queue                           │
│  5. Fetch latest data from server                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Security Architecture

### 6.1 Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │     │ Next.js │     │Supabase │     │   DB    │
│         │     │   API   │     │  Auth   │     │         │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │  Login Req    │               │               │
     │──────────────>│               │               │
     │               │  Verify Creds │               │
     │               │──────────────>│               │
     │               │               │  Check User   │
     │               │               │──────────────>│
     │               │               │<──────────────│
     │               │  JWT + Refresh│               │
     │               │<──────────────│               │
     │  Set Cookies  │               │               │
     │<──────────────│               │               │
     │               │               │               │
```

### 6.2 Row Level Security (RLS)

```sql
-- Example RLS Policies

-- Users can only see their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- SMEs can only see their own orders
CREATE POLICY "SMEs can view own orders"
ON orders FOR SELECT
USING (auth.uid() = sme_id);

-- Logistics businesses can see orders assigned to them
CREATE POLICY "Businesses can view assigned orders"
ON orders FOR SELECT
USING (auth.uid() IN (
  SELECT owner_id FROM businesses WHERE id = orders.business_id
));

-- Riders can see deliveries assigned to them
CREATE POLICY "Riders can view own deliveries"
ON deliveries FOR SELECT
USING (auth.uid() IN (
  SELECT user_id FROM riders WHERE id = deliveries.rider_id
));
```

---

## 7. Future Architecture Considerations

### 7.1 Transportation Booking (Uber-like)

```
┌─────────────────────────────────────────────────────────────┐
│              FUTURE: TRANSPORTATION MODULE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  New Tables:                                                │
│  • ride_requests                                            │
│  • ride_bookings                                            │
│  • vehicle_types                                            │
│  • fare_calculations                                        │
│                                                             │
│  New Features:                                              │
│  • Passenger registration                                   │
│  • Ride request matching                                    │
│  • Dynamic pricing                                          │
│  • Driver ratings                                           │
│  • Trip history                                             │
│                                                             │
│  Shared Infrastructure:                                     │
│  • User authentication                                      │
│  • Real-time tracking                                       │
│  • Payment processing                                       │
│  • Notification system                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Microservices Migration Path

```
Current: Monolithic (Next.js + Supabase)
    │
    │  Scale Trigger: 50,000+ daily orders
    ▼
Phase 1: Extract Services
    • Order Service
    • Tracking Service
    • Notification Service
    │
    │  Scale Trigger: 200,000+ daily orders
    ▼
Phase 2: Full Microservices
    • API Gateway (Kong/AWS API Gateway)
    • Service Mesh (Istio)
    • Event-Driven Architecture (Kafka)
    • Kubernetes Orchestration
```
