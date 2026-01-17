# Use Case Descriptions - Lifterico

## Use Case Description Tables

---

### UC-01: User Registration

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-01 |
| **Use Case Name** | User Registration |
| **Actor(s)** | Admin, Logistics, SME, Rider, Customer |
| **Description** | User creates a new account on the platform |
| **Preconditions** | User has valid email/phone, User is not already registered |
| **Postconditions** | Account created, Verification email/SMS sent |
| **Main Flow** | 1. User selects role type<br>2. User enters email, phone, password<br>3. System validates input<br>4. System creates account<br>5. System sends verification |
| **Alternative Flow** | 3a. Invalid input → Show error message |
| **Exception Flow** | Email/phone already exists → Show duplicate error |

---

### UC-02: User Login

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-02 |
| **Use Case Name** | User Login |
| **Actor(s)** | All Users |
| **Description** | User authenticates to access the system |
| **Preconditions** | User has registered account |
| **Postconditions** | User is authenticated, Session created |
| **Main Flow** | 1. User enters email/phone and password<br>2. System validates credentials<br>3. System creates session<br>4. User redirected to dashboard |
| **Alternative Flow** | 2a. Invalid credentials → Show error |
| **Exception Flow** | Account suspended → Show suspension message |

---

### UC-03: Register Business

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-03 |
| **Use Case Name** | Register Business |
| **Actor(s)** | Logistics, SME |
| **Description** | User registers their business on the platform |
| **Preconditions** | User is logged in, User has no existing business |
| **Postconditions** | Business created with pending status |
| **Main Flow** | 1. User fills business details<br>2. User uploads documents<br>3. System validates input<br>4. System creates business<br>5. Business set to pending verification |
| **Alternative Flow** | 2a. Invalid documents → Request re-upload |
| **Exception Flow** | Business name exists → Show duplicate error |

---

### UC-04: Verify Business

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-04 |
| **Use Case Name** | Verify Business |
| **Actor(s)** | Admin |
| **Description** | Admin reviews and approves/rejects business |
| **Preconditions** | Business has pending status, Documents uploaded |
| **Postconditions** | Business status updated to verified/rejected |
| **Main Flow** | 1. Admin views pending businesses<br>2. Admin reviews documents<br>3. Admin approves business<br>4. System updates status<br>5. System notifies business owner |
| **Alternative Flow** | 3a. Admin rejects → Enter rejection reason |
| **Exception Flow** | None |

---

### UC-05: Create Delivery Order

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-05 |
| **Use Case Name** | Create Delivery Order |
| **Actor(s)** | SME |
| **Description** | SME creates a new delivery order |
| **Preconditions** | SME is logged in, Business is verified |
| **Postconditions** | Order created with pending status |
| **Main Flow** | 1. SME enters pickup details<br>2. SME enters delivery details<br>3. SME selects logistics company<br>4. System calculates fee and ETA<br>5. SME confirms order<br>6. System creates order |
| **Alternative Flow** | 3a. No logistics available → Show message |
| **Exception Flow** | Payment fails → Order not created |

---

### UC-06: Assign Rider

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-06 |
| **Use Case Name** | Assign Rider to Order |
| **Actor(s)** | Logistics, System (Auto) |
| **Description** | Rider is assigned to a delivery order |
| **Preconditions** | Order is accepted, Riders available |
| **Postconditions** | Rider assigned, Order status updated |
| **Main Flow** | 1. System finds nearest available rider<br>2. System assigns rider<br>3. Rider receives notification<br>4. Order status → Assigned |
| **Alternative Flow** | 1a. Manual assignment → Logistics selects rider |
| **Exception Flow** | No riders available → Notify logistics |

---

### UC-07: Execute Delivery

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-07 |
| **Use Case Name** | Execute Delivery |
| **Actor(s)** | Rider |
| **Description** | Rider picks up and delivers package |
| **Preconditions** | Rider is assigned to order |
| **Postconditions** | Delivery completed or failed |
| **Main Flow** | 1. Rider navigates to pickup<br>2. Rider confirms pickup<br>3. Rider navigates to delivery<br>4. Rider delivers package<br>5. Rider submits proof<br>6. Delivery marked complete |
| **Alternative Flow** | 4a. Customer unavailable → Mark as failed |
| **Exception Flow** | Package damaged → Report issue |

---

### UC-08: Track Delivery

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-08 |
| **Use Case Name** | Track Delivery |
| **Actor(s)** | SME, Logistics, Customer |
| **Description** | User tracks delivery in real-time |
| **Preconditions** | Delivery is in progress |
| **Postconditions** | User views current location and ETA |
| **Main Flow** | 1. User opens tracking page<br>2. System displays map<br>3. System shows rider location<br>4. System updates ETA<br>5. Real-time updates continue |
| **Alternative Flow** | None |
| **Exception Flow** | Rider offline → Show last known location |

---

### UC-09: Submit Proof of Delivery

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-09 |
| **Use Case Name** | Submit Proof of Delivery |
| **Actor(s)** | Rider |
| **Description** | Rider submits proof that delivery was completed |
| **Preconditions** | Rider at delivery location |
| **Postconditions** | Proof recorded, Delivery completed |
| **Main Flow** | 1. Rider selects proof type<br>2. Rider captures photo OR<br>3. Customer enters OTP OR<br>4. Customer signs on device<br>5. System records proof<br>6. Delivery marked complete |
| **Alternative Flow** | 2a. Photo unclear → Retake |
| **Exception Flow** | OTP expired → Generate new OTP |

---

### UC-10: Make Payment

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-10 |
| **Use Case Name** | Make Payment |
| **Actor(s)** | SME, Customer |
| **Description** | User pays for delivery service |
| **Preconditions** | Order created, Amount calculated |
| **Postconditions** | Payment completed, Transaction recorded |
| **Main Flow** | 1. System displays amount<br>2. User selects payment method<br>3. User completes Paystack checkout<br>4. System verifies payment<br>5. Transaction recorded<br>6. Commission deducted (15%) |
| **Alternative Flow** | 3a. COD selected → Pay on delivery |
| **Exception Flow** | Payment failed → Retry or cancel |

---

### UC-11: Request Payout

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-11 |
| **Use Case Name** | Request Payout |
| **Actor(s)** | Logistics |
| **Description** | Logistics business requests earnings payout |
| **Preconditions** | Balance available, Bank details added |
| **Postconditions** | Payout request created |
| **Main Flow** | 1. User views available balance<br>2. User enters payout amount<br>3. User confirms bank details<br>4. System creates payout request<br>5. Admin notified for processing |
| **Alternative Flow** | None |
| **Exception Flow** | Insufficient balance → Show error |

---

### UC-12: View Analytics

| Field | Description |
|-------|-------------|
| **Use Case ID** | UC-12 |
| **Use Case Name** | View Analytics |
| **Actor(s)** | Admin, Logistics, SME, Rider |
| **Description** | User views performance metrics and reports |
| **Preconditions** | User is logged in |
| **Postconditions** | Analytics displayed |
| **Main Flow** | 1. User opens analytics page<br>2. System loads dashboard stats<br>3. User selects date range<br>4. System displays charts/tables<br>5. User can export data |
| **Alternative Flow** | 5a. Export as CSV or PDF |
| **Exception Flow** | No data available → Show empty state |
