# Deployment Guide - Lifterico

## Environments

| Environment | Platform | URL |
|-------------|----------|-----|
| Development | Local | localhost:3000 |
| Staging | Vercel | staging.lifterico.com |
| Production | Vercel | app.lifterico.com |

---

## 1. Prerequisites

**Required Accounts:**
- Vercel (hosting)
- Supabase (database)
- Paystack (payments)
- Africa's Talking (SMS)
- Firebase (push notifications)
- GitHub (source control)

---

## 2. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Paystack
PAYSTACK_SECRET_KEY=xxx
PAYSTACK_PUBLIC_KEY=xxx

# Africa's Talking
AT_API_KEY=xxx
AT_USERNAME=xxx

# Firebase
FIREBASE_PROJECT_ID=xxx
FIREBASE_PRIVATE_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=xxx
```

---

## 3. Supabase Setup

1. Create Supabase project
2. Run database migrations
3. Enable Row Level Security
4. Configure authentication
5. Create storage buckets

---

## 4. Vercel Deployment

```bash
# Install CLI
npm i -g vercel

# Deploy staging
vercel

# Deploy production
vercel --prod
```

---

## 5. CI/CD Pipeline

**On push to main:**
1. Run tests
2. Build application
3. Deploy to staging
4. Run E2E tests
5. Deploy to production (manual approval)

---

## 6. Monitoring

**Tools:**
- Vercel Analytics (performance)
- Supabase Dashboard (database)
- Sentry (error tracking)
- Uptime Robot (availability)

---

## 7. Backup Strategy

- Database: Daily automated backups (Supabase)
- Storage: Replicated across regions
- Code: GitHub with branch protection

---

## 8. Rollback Procedure

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

---

## 9. Domain Setup

1. Add domain in Vercel
2. Configure DNS records
3. Enable SSL (automatic)
4. Set up redirects

---

## 10. Post-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] SSL certificate active
- [ ] Webhooks configured (Paystack)
- [ ] Monitoring enabled
- [ ] Error tracking active
- [ ] Backup verified
