# Third-Party Integrations - Lifterico

## Integration Overview

| Service | Purpose | Priority |
|---------|---------|----------|
| Supabase | Database, Auth, Realtime, Storage | High |
| OpenStreetMap + Leaflet | Maps and GPS | High |
| Africa's Talking | SMS Notifications | High |
| Paystack | Payment Processing | High |
| Firebase (FCM) | Push Notifications | Medium |

---

## 1. Supabase

**Services:** PostgreSQL, Auth, Realtime, Storage, Edge Functions

**Environment Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

---

## 2. OpenStreetMap + Leaflet

**Purpose:** Maps, tracking, routes, geocoding

**Installation:**
```bash
npm install leaflet react-leaflet
```

**Note:** No API key required - free and open source

**Additional:** OSRM for routing, Nominatim for geocoding

---

## 3. Africa's Talking

**Purpose:** SMS notifications, OTP verification

**Environment Variables:**
```env
AT_API_KEY=your_api_key
AT_USERNAME=your_username
AT_SENDER_ID=LIFTERICO
```

**SMS Types:**
- Order confirmation
- Rider assignment
- Delivery updates
- OTP codes

---

## 4. Paystack

**Purpose:** Payment processing, 15% commission

**Environment Variables:**
```env
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret
```

**Features:**
- Card payments
- Bank transfers
- Payment verification
- Webhook notifications
- Payout to businesses

**Webhook Events:**
- charge.success
- transfer.success
- transfer.failed

---

## 5. Firebase Cloud Messaging (FCM)

**Purpose:** Push notifications to mobile/web

**Environment Variables:**
```env
FIREBASE_PROJECT_ID=your_project
FIREBASE_PRIVATE_KEY=your_key
FIREBASE_CLIENT_EMAIL=your_email
```

**Notification Types:**
- New order alerts
- Delivery status updates
- Payment confirmations
- System announcements

---

## Integration Architecture

```
┌─────────────────────────────────────────────┐
│              LIFTERICO APP                  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│  │Supabase │  │ Leaflet │  │ Africa's│     │
│  │  Client │  │   Map   │  │ Talking │     │
│  └────┬────┘  └────┬────┘  └────┬────┘     │
│       │            │            │           │
│  ┌────┴────┐  ┌────┴────┐  ┌────┴────┐     │
│  │Paystack │  │   FCM   │  │  OSRM   │     │
│  │ Client  │  │  Client │  │ Routing │     │
│  └─────────┘  └─────────┘  └─────────┘     │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Rate Limits & Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Supabase | 500MB DB, 1GB storage | $25/mo+ |
| OpenStreetMap | Unlimited | Free |
| Africa's Talking | - | ~₦4/SMS |
| Paystack | - | 1.5% + ₦100 |
| Firebase FCM | Unlimited | Free |
