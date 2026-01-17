# User Roles & Permissions - Lifterico

## Role Overview

| Role | Description | Platform |
|------|-------------|----------|
| Admin | System administrator | Web |
| Logistics | Fleet owner/manager | Web |
| SME | Business owner | Web + Mobile |
| Rider | Dispatch rider | Web + Mobile |
| Customer | Delivery recipient | Mobile (Future) |

---

## Admin Permissions

**Full system access including:**
- Manage all users (CRUD)
- Approve/reject business verifications
- Approve SME upgrade requests
- View all orders and deliveries
- Resolve disputes
- Access system-wide analytics
- Manage system settings
- Process payouts

---

## Logistics Business Permissions

**Fleet and order management:**
- Manage business profile
- Onboard and manage riders
- View/accept incoming orders
- Assign riders to orders
- Track all fleet deliveries
- View earnings and analytics
- Request payouts
- Communicate with SMEs

---

## SME Permissions

**Order creation and tracking:**
- Manage business profile
- Create delivery orders
- Select logistics business
- Track order status
- View order history
- Make payments
- View spending analytics
- Request upgrade to Logistics tier

---

## Rider Permissions

**Delivery execution:**
- Manage personal profile
- View assigned deliveries
- Accept/reject assignments
- Update delivery status
- Update location (GPS)
- Submit proof of delivery
- View earnings
- Go online/offline

---

## Customer Permissions (Future)

**Delivery tracking:**
- Track deliveries
- Confirm receipt
- Rate service
- Communicate with rider
- Pay on delivery (COD)

---

## Permission Matrix

| Feature | Admin | Logistics | SME | Rider | Customer |
|---------|-------|-----------|-----|-------|----------|
| User Management | ✅ | ❌ | ❌ | ❌ | ❌ |
| Business Verification | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fleet Management | ✅ | ✅ | ❌ | ❌ | ❌ |
| Create Orders | ❌ | ❌ | ✅ | ❌ | ❌ |
| Assign Riders | ✅ | ✅ | ❌ | ❌ | ❌ |
| Execute Deliveries | ❌ | ❌ | ❌ | ✅ | ❌ |
| Track Deliveries | ✅ | ✅ | ✅ | ✅ | ✅ |
| View All Analytics | ✅ | ❌ | ❌ | ❌ | ❌ |
| View Own Analytics | ✅ | ✅ | ✅ | ✅ | ❌ |
| Process Payouts | ✅ | ❌ | ❌ | ❌ | ❌ |
| Request Payouts | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## Upgrade Path: SME to Logistics

**Requirements:**
1. Minimum 50 completed orders
2. Account age > 3 months
3. Business verification documents
4. Admin approval

**Process:**
1. SME submits upgrade request
2. Upload required documents
3. Admin reviews request
4. Approval grants Logistics permissions
5. SME can now onboard riders
