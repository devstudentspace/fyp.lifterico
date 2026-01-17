# Testing Strategy - Lifterico

## Testing Overview

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit Tests | Vitest | 80% |
| Integration Tests | Vitest + Supabase | Key flows |
| E2E Tests | Playwright | Critical paths |
| API Tests | Vitest | All endpoints |

---

## 1. Unit Testing

### Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Configuration
```typescript
// vitest.config.ts
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'html'],
      threshold: { global: { lines: 80 } }
    }
  }
}
```

### What to Test
- Utility functions
- React hooks
- Component rendering
- Form validation
- State management

---

## 2. Integration Testing

### Database Testing
- Use Supabase test project
- Seed test data before tests
- Clean up after tests

### API Testing
```typescript
describe('Orders API', () => {
  it('creates order successfully', async () => {
    const response = await api.post('/orders', orderData)
    expect(response.status).toBe(201)
    expect(response.data.id).toBeDefined()
  })
})
```

---

## 3. E2E Testing

### Setup
```bash
npm install -D playwright @playwright/test
```

### Critical User Flows
1. User registration and login
2. Business verification
3. Order creation flow
4. Rider assignment
5. Delivery completion
6. Payment processing

### Example Test
```typescript
test('SME can create order', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name=email]', 'sme@test.com')
  await page.fill('[name=password]', 'password')
  await page.click('button[type=submit]')
  
  await page.goto('/sme/orders/new')
  // Fill order form...
  await page.click('button:has-text("Create Order")')
  
  await expect(page).toHaveURL(/\/orders\//)
})
```

---

## 4. API Testing

### Endpoints to Test
- [ ] Auth (register, login, logout)
- [ ] Users (CRUD, permissions)
- [ ] Businesses (CRUD, verification)
- [ ] Riders (CRUD, status)
- [ ] Orders (CRUD, status flow)
- [ ] Deliveries (status updates)
- [ ] Payments (initialize, verify)

### Test Cases per Endpoint
- Success scenarios
- Validation errors
- Authentication errors
- Authorization errors
- Edge cases

---

## 5. Test Data

### Seed Data
```typescript
const testUsers = {
  admin: { email: 'admin@test.com', role: 'admin' },
  logistics: { email: 'logistics@test.com', role: 'logistics' },
  sme: { email: 'sme@test.com', role: 'sme' },
  rider: { email: 'rider@test.com', role: 'rider' }
}
```

### Test Database
- Separate Supabase project for testing
- Reset before each test suite
- Isolated from production

---

## 6. CI/CD Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
```

### Pre-commit Hooks
```bash
# Run tests before commit
npm run test -- --run
npm run lint
```

---

## 7. Test Commands

```bash
# Unit tests
npm run test

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# API tests
npm run test:api

# All tests
npm run test:all
```

---

## 8. Quality Gates

### Before Merge
- All tests passing
- Coverage >= 80%
- No linting errors
- Code review approved

### Before Deploy
- E2E tests passing
- Performance benchmarks met
- Security scan clean
