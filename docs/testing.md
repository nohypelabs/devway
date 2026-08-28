---
sidebar_position: 10
---
### 4. **`TESTING.md`** — (PRO) STRATEGI TESTING
```markdown
# Testing Strategy

## 🧪 Unit Test
- **Backend**: Test use cases dan domain logic
- **Frontend**: Test komponen dan hooks

```bash
npm run test:unit
🔗 Integration Test
Test endpoint API

Test database query

bash
npm run test:integration
🖥️ E2E Test (Playwright/Cypress)
Test flow user utama (login, CRUD, dll.)

bash
npm run test:e2e
📁 Struktur Test
text
src/
├── server/
│   └── modules/
│       └── products/
│           ├── domain/
│           │   └── __tests__/
│           ├── application/
│           │   └── __tests__/
│           └── infrastructure/
│               └── __tests__/
└── client/
    └── features/
        └── products/
            ├── _components/
            │   └── __tests__/
            └── _hooks/
                └── __tests__/
✅ Coverage Target
Core domain logic: 100%

Use cases: 80%

Components: 70%
