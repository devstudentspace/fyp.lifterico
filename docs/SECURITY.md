# Security Guidelines - Lifterico

## Security Overview

| Area | Implementation |
|------|----------------|
| Authentication | Supabase Auth + JWT |
| Authorization | Role-Based Access Control (RBAC) |
| Data Protection | Encryption at rest & transit |
| API Security | Rate limiting, validation |
| Compliance | NDPR (Nigeria Data Protection) |

---

## 1. Authentication

### JWT Token Strategy
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry
- Secure HTTP-only cookies
- Token rotation on refresh

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character

### Multi-Factor Authentication (Future)
- SMS OTP for sensitive operations
- Email verification required

---

## 2. Authorization (RBAC)

### Middleware Protection
```typescript
// All dashboard routes protected
middleware.ts → Check auth token
             → Verify role permissions
             → Allow/deny access
```

### Row Level Security (RLS)
- Enabled on all Supabase tables
- Users can only access their own data
- Admins have elevated access
- Policies enforced at database level

---

## 3. Data Protection

### Encryption
- **In Transit:** HTTPS/TLS 1.3 for all connections
- **At Rest:** Supabase encrypts all data
- **Sensitive Fields:** Additional encryption for PII

### Sensitive Data Handling
| Data Type | Protection |
|-----------|------------|
| Passwords | Bcrypt hashing (Supabase) |
| Phone numbers | Masked in logs |
| Bank details | Encrypted storage |
| Location data | Access controlled |

---

## 4. API Security

### Rate Limiting
| Endpoint Type | Limit |
|---------------|-------|
| Auth endpoints | 5 req/min |
| General API | 100 req/min |
| Tracking updates | 60 req/min |

### Input Validation
- All inputs sanitized
- SQL injection prevention (parameterized queries)
- XSS prevention (output encoding)
- File upload validation (type, size)

### CORS Configuration
```typescript
// Only allow specific origins
const allowedOrigins = [
  'https://lifterico.com',
  'https://app.lifterico.com'
]
```

---

## 5. Infrastructure Security

### Environment Variables
- Never commit secrets to git
- Use .env.local for development
- Production secrets in secure vault

### Required Secrets
```env
# Database
SUPABASE_SERVICE_ROLE_KEY=xxx

# Payments
PAYSTACK_SECRET_KEY=xxx

# SMS
AT_API_KEY=xxx

# Push Notifications
FIREBASE_PRIVATE_KEY=xxx
```

---

## 6. Compliance (NDPR)

### Data Collection
- Collect only necessary data
- Clear privacy policy
- User consent for data processing

### Data Rights
- Users can request data export
- Users can request data deletion
- Data retention policies defined

### Audit Trail
- Log all sensitive operations
- Track data access
- Maintain audit logs for 1 year

---

## 7. Security Checklist

### Development
- [ ] Input validation on all forms
- [ ] Parameterized database queries
- [ ] Secure session management
- [ ] Error messages don't leak info

### Deployment
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Logging and monitoring active

### Ongoing
- [ ] Regular dependency updates
- [ ] Security audit quarterly
- [ ] Penetration testing annually
- [ ] Incident response plan ready
