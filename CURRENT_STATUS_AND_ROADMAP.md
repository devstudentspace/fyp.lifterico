# Lifterico Implementation Roadmap & Analysis

## Current State Analysis

The project has completed **Sprint 1 (Foundation & Authentication)** of Phase 1.

*   **Authentication:** Fully implemented with Sign Up/Login and role assignment.
*   **Database:** Role-based profiles (`profiles`, `sme_profiles`, `logistics_profiles`, `rider_profiles`) are set up via Supabase migrations.
*   **Dashboards:** High-fidelity, role-specific dashboards exist for Admin, SME, Logistics, Rider, and Customer. They currently use realistic **mock data** (Phase 1 prototype state).
*   **Security:** Middleware handles session management and basic Role-Based Access Control (RBAC).
*   **Branding:** White-labeling is complete; the project is distinctly "Lifterico".

## Implementation Roadmap

This roadmap compares the current state with the requirements and outlines the remaining sprints.

---

### Phase 1: Core Foundation & Order Management (MVP)

#### Sprint 1: Foundation & Authentication (Completed)
*   **Goal:** Secure system access and role-based environment.
*   **Status:** ✅ **DONE**
*   **Deliverables:**
    *   Next.js + Supabase setup.
    *   Auth flow (Sign up/Login) with Role selection.
    *   RBAC Middleware (Redirects users to correct dashboard).
    *   Static UI Dashboards for all 5 roles.

#### Sprint 2: Profiles & Business Verification (Next Up)
*   **Goal:** Establish trust and identity.
*   **Expected Outcome:** Users can complete their profiles with real data, and Admins can verify businesses.
*   **Key Tasks:**
    *   [ ] **API/DB:** Create API routes to fetch/update profile data from Supabase (replacing mock data).
    *   [ ] **UI:** "Edit Profile" forms for SMEs and Logistics.
    *   [ ] **Feature:** Document upload (Storage) for verification.
    *   [ ] **Admin:** Real "Upgrade Requests" logic in Admin dashboard.
*   **Success Metric:** Users see their actual name/details on dashboards; Admins can approve a request in DB.

#### Sprint 3: Order Management Core
*   **Goal:** The heart of the system—creating and moving orders.
*   **Expected Outcome:** SMEs can create orders that Logistics companies can see.
*   **Key Tasks:**
    *   [ ] **DB:** Create `orders` table (Pickup/Dropoff coords, price, status).
    *   [ ] **SME:** "New Order" wizard (Step 1: Details, Step 2: Address).
    *   [ ] **Logistics:** "Available Orders" list fetching from DB.
*   **Success Metric:** An order created by an SME appears in the Logistics dashboard database query.

---

### Phase 2: Logistics Operations & Mapping

#### Sprint 4: Fleet & Rider Management
*   **Goal:** Allow Logistics companies to manage their workforce.
*   **Expected Outcome:** Logistics companies can onboard riders and see them in their fleet.
*   **Key Tasks:**
    *   [ ] **Feature:** "Add Rider" invite system (email link or direct add).
    *   [ ] **DB:** Associate `rider_profiles` with `logistics_id`.
    *   [ ] **UI:** "My Fleet" page for Logistics users.

#### Sprint 5: Dispatch & Assignment Logic
*   **Goal:** Efficiently matching orders to riders.
*   **Expected Outcome:** A Logistics manager can assign a specific order to a specific rider.
*   **Key Tasks:**
    *   [ ] **Logic:** Assignment state transition (`PENDING` -> `ASSIGNED`).
    *   [ ] **Rider App:** "New Job" notification/modal for the assigned rider.

#### Sprint 6: Map Integration
*   **Goal:** Visualizing locations.
*   **Expected Outcome:** Users can see order locations on a map.
*   **Key Tasks:**
    *   [ ] **Tech:** Integrate Leaflet/OpenStreetMap.
    *   [ ] **UI:** Replace text addresses with Lat/Long selection on Order Creation.
    *   [ ] **UI:** Map view in Order Details.

---

### Phase 3: Real-time Communication & Trust

#### Sprint 7: Proof of Delivery (POD) & Security
*   **Goal:** Secure delivery completion.
*   **Expected Outcome:** Delivery can only be marked "Complete" with valid proof.
*   **Key Tasks:**
    *   [ ] **Feature:** OTP generation for Customer.
    *   [ ] **Rider UI:** Input field for OTP to validate delivery.
    *   [ ] **Storage:** Photo upload logic for POD.

#### Sprint 8: Notifications
*   **Goal:** Keep users informed.
*   **Expected Outcome:** Users get alerts for status changes.
*   **Key Tasks:**
    *   [ ] **Tech:** Integrate Africa's Talking (SMS) or Email provider.
    *   [ ] **Logic:** Trigger alerts on database status changes (Supabase Realtime).

---

### Phase 4: Business Value

#### Sprint 9: Financial Infrastructure
*   **Goal:** Monetization.
*   **Expected Outcome:** System calculates and tracks revenue.
*   **Key Tasks:**
    *   [ ] **DB:** Ledger/Transaction tables.
    *   [ ] **Logic:** 15% commission calculation on Order Completion.
    *   [ ] **Integration:** Paystack for SME payments.

#### Sprint 10: Analytics & Reporting
*   **Goal:** Visualizing performance.
*   **Expected Outcome:** Dashboards show real historical data charts.
*   **Key Tasks:**
    *   [ ] **UI:** Replace mock charts with Recharts/Chart.js fed by DB queries.
    *   [ ] **Feature:** Export to CSV.

---

### Phase 5: Final Polish & Launch

#### Sprint 11: Testing & Optimization
*   **Goal:** Production readiness.
*   **Expected Outcome:** Bug-free, performant application.
*   **Key Tasks:**
    *   [ ] QA Testing.
    *   [ ] Mobile responsiveness check.

#### Sprint 12: Launch
*   **Goal:** Go live.
*   **Expected Outcome:** Publicly accessible URL.
