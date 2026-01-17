# Lifterico Implementation Roadmap

This document outlines the phase-by-phase and sprint-by-sprint implementation plan for the Lifterico Delivery Platform, based on the `PRD.md`, `MODULES.md`, and `SRS.txt`.

---

## Phase 1: Core Foundation & Order Management (MVP)
**Goal:** Enable user registration, business verification, and the core ability to create and manage delivery orders.
**Modules:** Auth, User, Business, Order, Storage.

### Sprint 1: Foundation & Authentication (Completed/In-Progress)
*   **Goal:** Secure system access and role-based environment.
*   **Tasks:**
    *   [x] Setup Next.js + Supabase environment.
    *   [x] Implement Sign Up / Login (Email & Password).
    *   [x] Implement Role-Based Access Control (RBAC) Middleware.
    *   [x] Create basic dashboards for all user roles (Admin, SME, Logistics, Rider, Customer).
    *   [ ] Fix Authentication edge cases (Password Reset, Email Confirmation flow).

### Sprint 2: Profiles & Business Verification
*   **Goal:** Establish trust and identity for businesses and riders.
*   **Tasks:**
    *   [ ] **Database:** Finalize `profiles`, `sme_profiles`, `logistics_profiles` schemas.
    *   [ ] **UI/UX:** Create "Complete Profile" forms for SMEs and Logistics companies.
    *   [ ] **Storage:** Implement file upload for business registration documents (CAC, etc.).
    *   [ ] **Admin:** Build the "Business Verification" view in Admin Dashboard to approve/reject profiles.
    *   [ ] **Logic:** Restrict order creation/acceptance to verified accounts only.

### Sprint 3: Order Management Core
*   **Goal:** The heart of the system—creating and moving orders.
*   **Tasks:**
    *   [ ] **Database:** Create `orders` table with status enums (`PENDING`, `ASSIGNED`, `DELIVERED`, etc.).
    *   [ ] **SME Feature:** "Create Order" form with address inputs and item details.
    *   [ ] **Logistics Feature:** "Order Pool" view to see available orders.
    *   [ ] **Logic:** Implement basic state transitions (SME creates -> Logistics accepts -> Rider assigned).
    *   [ ] **UI:** Order history lists for all dashboards.

---

## Phase 2: Logistics Operations & Mapping
**Goal:** Connect orders to the physical world with riders, fleets, and maps.
**Modules:** Rider, Tracking (Basic), Map.

### Sprint 4: Fleet & Rider Management
*   **Goal:** Allow Logistics companies to manage their workforce.
*   **Tasks:**
    *   [ ] **Rider Feature:** Rider onboarding flow (Invite by Logistics or Self-signup).
    *   [ ] **Logistics Feature:** "My Fleet" dashboard (Add/Remove riders, View status).
    *   [ ] **Database:** Link `rider_profiles` to `logistics_profiles`.
    *   [ ] **Validation:** Rider document upload (License, ID).

### Sprint 5: Dispatch & Assignment Logic
*   **Goal:** Efficiently matching orders to riders.
*   **Tasks:**
    *   [ ] **Manual Assignment:** Logistics admin manually assigns an order to a specific rider.
    *   [ ] **Rider App:** "New Delivery Request" screen for riders to Accept/Reject.
    *   [ ] **Status Sync:** Updating order status updates rider availability (Online/Busy).

### Sprint 6: Map Integration (OpenStreetMap/Leaflet)
*   **Goal:** Visualizing locations.
*   **Tasks:**
    *   [ ] **Integration:** Integrate Leaflet.js / OpenStreetMap.
    *   [ ] **Features:** Address picker with auto-complete (or pin on map) for Order Creation.
    *   [ ] **Visualization:** Display Pickup and Dropoff points on a map in the Order Details view.
    *   [ ] **Calculations:** Basic distance and ETA estimation algorithms.

---

## Phase 3: Real-time Communication & Trust
**Goal:** Live updates, transparency, and proof of service.
**Modules:** Tracking (Real-time), Notification, Communication.

### Sprint 7: Proof of Delivery (POD) & Security
*   **Goal:** ensuring deliveries are completed securely.
*   **Tasks:**
    *   [ ] **Feature:** Secure OTP generation for Customers upon order creation.
    *   [ ] **Rider App:** Interface to input OTP to complete delivery.
    *   [ ] **Storage:** Photo capture upload for "Leave at door" or documentation.
    *   [ ] **Logic:** "Delivered" status only triggers upon valid POD.

### Sprint 8: Notifications & Alerts
*   **Goal:** Keeping users informed without checking the app.
*   **Tasks:**
    *   [ ] **System:** In-app notification center (Bell icon).
    *   [ ] **External:** Email alerts (via Supabase/Resend) for major status changes.
    *   [ ] **External:** SMS integration (Africa's Talking) for urgent updates (e.g., Rider arrival).
    *   [ ] **Triggers:** "Order Accepted", "Rider Arriving", "Delivery Successful".

---

## Phase 4: Business Value (Finance & Analytics)
**Goal:** Monetization and data-driven insights.
**Modules:** Payment, Analytics.

### Sprint 9: Financial Infrastructure
*   **Goal:** Handling money and commissions.
*   **Tasks:**
    *   [ ] **Database:** Create `transactions` and `wallets` tables.
    *   [ ] **Integration:** Paystack API integration for SME payments.
    *   [ ] **Logic:** Automated 15% commission calculation and deduction.
    *   [ ] **Admin:** Payout request management system.

### Sprint 10: Analytics & Reporting
*   **Goal:** Visualizing performance.
*   **Tasks:**
    *   [ ] **Admin/Logistics:** Revenue charts, Delivery success rates.
    *   [ ] **Rider:** Earning history and completed jobs summary.
    *   [ ] **Export:** Ability to download reports as CSV/PDF.

---

## Phase 5: Final Polish & Launch
**Goal:** Production readiness.

### Sprint 11: Testing & Optimization
*   **Tasks:**
    *   [ ] **QA:** End-to-end testing of all user flows.
    *   [ ] **Performance:** Optimization of database queries and image loading.
    *   [ ] **Mobile:** Responsive design tweaks for low-end Android devices (as per SRS).

### Sprint 12: Launch
*   **Tasks:**
    *   [ ] **Deployment:** Final production build.
    *   [ ] **Seeding:** production data / master data setup.
    *   [ ] **Handoff:** Documentation handover.
