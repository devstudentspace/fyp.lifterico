# API Specification - Lifterico

## Base URL
- Development: `http://localhost:3000/api/v1`
- Production: `https://api.lifterico.com/v1`

## Authentication
All protected endpoints require Bearer token in header:
```
Authorization: Bearer <access_token>
```

---

## Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | User login | No |
| POST | /auth/logout | User logout | Yes |
| POST | /auth/refresh | Refresh token | Yes |
| POST | /auth/forgot-password | Request password reset | No |
| POST | /auth/reset-password | Reset password | No |
| POST | /auth/verify-email | Verify email | No |
| POST | /auth/verify-phone | Verify phone OTP | No |

---

## User Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /users/me | Get current user | Yes | All |
| PUT | /users/me | Update profile | Yes | All |
| PUT | /users/me/password | Change password | Yes | All |
| GET | /users | List all users | Yes | Admin |
| GET | /users/:id | Get user by ID | Yes | Admin |
| PUT | /users/:id/status | Update user status | Yes | Admin |
| DELETE | /users/:id | Delete user | Yes | Admin |

---

## Business Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /businesses | Create business | Yes | SME, Logistics |
| GET | /businesses | List businesses | Yes | Admin |
| GET | /businesses/:id | Get business details | Yes | Owner, Admin |
| PUT | /businesses/:id | Update business | Yes | Owner |
| POST | /businesses/:id/documents | Upload documents | Yes | Owner |
| PUT | /businesses/:id/verify | Verify business | Yes | Admin |
| POST | /businesses/:id/upgrade | Request upgrade | Yes | SME |
| GET | /businesses/pending | Pending verifications | Yes | Admin |

---

## Rider Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /riders | Register rider | Yes | Logistics |
| GET | /riders | List riders | Yes | Logistics, Admin |
| GET | /riders/:id | Get rider details | Yes | Owner, Logistics, Admin |
| PUT | /riders/:id | Update rider | Yes | Owner, Logistics |
| PUT | /riders/:id/status | Update status | Yes | Rider |
| PUT | /riders/:id/location | Update location | Yes | Rider |
| GET | /riders/available | Get available riders | Yes | Logistics |
| GET | /riders/:id/deliveries | Rider's deliveries | Yes | Rider, Logistics |
| GET | /riders/:id/earnings | Rider earnings | Yes | Rider, Logistics |

---

## Order Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /orders | Create order | Yes | SME |
| GET | /orders | List orders | Yes | All |
| GET | /orders/:id | Get order details | Yes | Owner, Assigned |
| PUT | /orders/:id | Update order | Yes | Owner |
| PUT | /orders/:id/status | Update status | Yes | Logistics, Rider |
| POST | /orders/:id/assign | Assign rider | Yes | Logistics |
| POST | /orders/:id/cancel | Cancel order | Yes | Owner |
| GET | /orders/:id/tracking | Get tracking info | Yes | All involved |

---

## Delivery Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /deliveries/:id | Get delivery details | Yes | Rider, Logistics |
| PUT | /deliveries/:id/status | Update status | Yes | Rider |
| POST | /deliveries/:id/pickup | Confirm pickup | Yes | Rider |
| POST | /deliveries/:id/complete | Complete delivery | Yes | Rider |
| POST | /deliveries/:id/proof | Submit proof | Yes | Rider |
| POST | /deliveries/:id/fail | Mark as failed | Yes | Rider |

---

## Tracking Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /tracking/update | Update location | Yes | Rider |
| GET | /tracking/rider/:id | Get rider location | Yes | Logistics, SME |
| GET | /tracking/delivery/:id | Get delivery tracking | Yes | All involved |
| WS | /tracking/live/:deliveryId | Live tracking stream | Yes | All involved |

---

## Payment Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /payments/initialize | Initialize payment | Yes | SME |
| POST | /payments/verify | Verify payment | Yes | SME |
| GET | /payments/history | Payment history | Yes | All |
| GET | /payments/:id | Payment details | Yes | Owner |
| POST | /webhooks/paystack | Paystack webhook | No | - |

---

## Payout Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| POST | /payouts/request | Request payout | Yes | Logistics |
| GET | /payouts | List payouts | Yes | Logistics, Admin |
| GET | /payouts/:id | Payout details | Yes | Owner, Admin |
| PUT | /payouts/:id/process | Process payout | Yes | Admin |

---

## Analytics Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /analytics/dashboard | Dashboard stats | Yes | All |
| GET | /analytics/orders | Order analytics | Yes | SME, Logistics, Admin |
| GET | /analytics/revenue | Revenue analytics | Yes | Logistics, Admin |
| GET | /analytics/performance | Performance metrics | Yes | Logistics, Admin |
| GET | /analytics/export | Export report | Yes | All |

---

## Notification Endpoints

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | /notifications | List notifications | Yes | All |
| PUT | /notifications/:id/read | Mark as read | Yes | Owner |
| PUT | /notifications/read-all | Mark all read | Yes | Owner |
| DELETE | /notifications/:id | Delete notification | Yes | Owner |

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### Pagination
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | Authentication required |
| INVALID_TOKEN | 401 | Invalid or expired token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| DUPLICATE_ENTRY | 409 | Resource already exists |
| SERVER_ERROR | 500 | Internal server error |
