---
sidebar_position: 10
---
# Development Guide

## 🔧 Prasyarat
- Node.js v20+
- Git
- GitHub CLI (`gh`) — optional
- Database (Supabase/PostgreSQL/MySQL tergantung stack)

## 📥 Clone & Install
```bash
git clone git@github.com:nohypelabs/buku-wajib-developer.git
cd buku-wajib-developer
npm install  # atau pnpm install / yarn
🌱 Setup Environment
bash
cp .env.example .env
# Edit .env dengan konfigurasi lokal lu
🚀 Menjalankan Development
bash
npm run dev       # Next.js/React
npm run server    # Backend saja
npm run client    # Frontend saja
🗄️ Database Migration
bash
npm run db:migrate
npm run db:seed   # (opsional) data dummy
✅ Testing
bash
npm run test
npm run test:watch
📦 Build untuk Production
bash
npm run build
❓ Troubleshooting
Error port already in use: npx kill-port 3000

Database connection failed: Cek .env DATABASE_URL

Module not found: rm -rf node_modules && npm install

text

