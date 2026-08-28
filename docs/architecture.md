---
sidebar_position: 10
---
# Architecture Overview

> **Pola:** Decoupled Architecture (Hexagonal DDD + Modular Component-Based)  
> **Prinsip:** Pragmatis, Scalable, Maintainable, Anti-Over-Engineering

## Struktur Root (Generik)

```text
src/
├── server/          # Backend (modules + shared)
│   └── modules/     # Domain modules (setiap fitur)
├── client/          # Frontend (route groups + components)
│   ├── (admin)/
│   ├── (dashboard)/
│   └── (public)/
└── shared/          # Shared types/utils antara FE & BE
```

## Backend (Hexagonal DDD)
- **Domain**: Entity + repository interface (pure business logic)
- **Application**: Use cases / services (orchestration)
- **Infrastructure**: Repository implementation (DB, external services)
- **Presentation**: HTTP/RPC routers + validation schemas

Lihat `01-BACKEND.md` untuk detail Level 1 & Level 2.

## Frontend (Feature-based)
- `page.*` & `layout.*` **hanya composition root** – tidak boleh berisi JSX detail.
- Komponen diekstrak ke `_components/` per route.
- Shared component jika dipakai ≥3 halaman.

Lihat `02-FRONTEND.md` untuk aturan lengkap.

## Advanced Topics
- Error handling (BaseError)
- Environment validation (Zod/Pydantic)
- Database migration
- Monitoring (logging, tracing, metrics)

Lihat `03-ADVANCED.md` untuk detail.

## Stack Implementasi
Contoh implementasi untuk Next.js, Express, Django, Laravel, Flask, Vue, dll. ada di `04-STACK-SPECIFIC.md`.
