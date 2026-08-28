---
sidebar_position: 10
---
### 3. **`DEPLOYMENT.md`** — (PRO) BUAT TIM DEVOPS
```markdown
# Deployment Guide

## 🌐 Environment
- **Production**: `https://app.nohypelabs.com`
- **Staging**: `https://staging.nohypelabs.com`

## 🚀 Deploy ke Production (Vercel/Railway/Fly.io)

### Manual (via CLI)
```bash
npm run build
npm run start
Dengan GitHub Actions (CI/CD)
yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - run: npm run deploy # Sesuai platform
🗄️ Migrasi Database di Production
bash
NODE_ENV=production npm run db:migrate
🔄 Rollback
bash
# Kembali ke commit sebelumnya
git revert HEAD
git push
📊 Monitoring
Error: Sentry (lihat 03-ADVANCED.md)

Logs: Pino/structured logging

Metrics: Prometheus + Grafana
