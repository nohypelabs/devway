
## 1. Error Handling Strategy

### 1.1. Base Error Class (Generik)

```ts
// src/server/shared/errors/BaseError.ts
export abstract class BaseError extends Error {
  abstract statusCode: number;
  abstract code: string;
  abstract userMessage?: string;
}

export class NotFoundError extends BaseError {
  statusCode = 404;
  code = 'NOT_FOUND';
  userMessage = 'Data tidak ditemukan';
}

export class ValidationError extends BaseError {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  
  constructor(public errors: Record<string, string>) {
    super('Validation failed');
    this.userMessage = 'Data tidak valid';
  }
}
Implementasi di framework tertentu:

Express: Middleware global yang catch BaseError dan return HTTP status sesuai.

Flask: @app.errorhandler(BaseError).

Laravel: Handler.php dengan render() method.

tRPC: errorFormatter (lihat contoh di dokumen terpisah).

2. Environment Variables Management
2.1. Schema Validation (Zod/Pydantic/Joi)
ts
// env.ts (Node.js)
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
});

export const env = envSchema.parse(process.env);
Untuk Python (Pydantic):

python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    node_env: str = "development"
    port: int = 3000

settings = Settings()
2.2. Multi-Environment Files
text
.env.example           # Template untuk developer
.env.local            # Local development (git-ignored)
.env.development      # Development
.env.staging          # Staging
.env.production       # Production
3. Database Migration Strategy
3.1. Generik
Tool	Command	Stack
Prisma	npx prisma migrate dev	Node.js
Drizzle	npx drizzle-kit push	Node.js
TypeORM	typeorm migration:run	Node.js
Alembic	alembic upgrade head	Python (SQLAlchemy)
Laravel	php artisan migrate	PHP
Goose	goose up	Go
Prinsip: Selalu version-control migration files. Jangan pernah manual edit DB.

4. Monorepo Strategy (Super Large Projects)
4.1. Struktur Monorepo (Turborepo/Nx/Lerna)
text
apps/
├── web/                      # Frontend (React/Vue/Svelte)
├── api/                      # Backend (Express/Flask/Laravel)
└── mobile/                   # React Native (opsional)

packages/
├── domain/                   # Shared business logic (pure TS/JS/Python)
├── shared-types/             # TypeScript/Python types
└── shared-utils/             # Utility functions

tooling/
├── eslint/                   # Linter config
└── typescript/               # TS config

turbo.json                    # atau nx.json, lerna.json
pnpm-workspace.yaml           # atau package.json workspaces
4.2. Kapan Pakai Monorepo?
#	Kriteria	Kapan Butuh?
1	Tim >10 orang	✅ Ya
2	Module >10	✅ Ya
3	Multiple apps (web + mobile + API)	✅ Ya
4	Shared domain logic lintas project	✅ Ya
5	Solo dev / tim kecil (<5 orang)	❌ Overkill
Buat 90% proyek, satu repo dengan struktur modular (Level 1/Level 2) sudah cukup.

5. Performance Monitoring & Observability
5.1. Logging (Structured)
Node.js (Pino):

ts
import pino from 'pino';
export const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
Python (structlog):

python
import structlog
logger = structlog.get_logger()
Go (slog):

go
import "log/slog"
logger := slog.Default()
5.2. Error Tracking (Sentry)
Universal untuk semua stack — cukup init di entry point.

5.3. Performance Tracing (OpenTelemetry)
Support untuk semua bahasa/framework — tracing HTTP, DB, queue otomatis.

5.4. Metrics (Prometheus)
Node.js: prom-client

Python: prometheus_client

Go: prometheus/client_golang

6. Checklist Advanced
Gunakan fitur ini hanya jika:

#	Fitur	Kapan Butuh?
1	BaseError + custom errors	>5 modul, perlu response HTTP status beda
2	Environment schema validation	>10 env vars
3	Database migration tools	Tim >3 orang, perlu rollback
4	Monorepo	>10 modul, >10 orang, atau multi-app
5	Logging (pino/structlog)	Production traffic >1000 req/hari
6	Error tracking (Sentry)	Production traffic >1000 req/hari
7	Performance tracing	Perlu debugging latency
8	Metrics (Prometheus)	Butuh dashboard monitoring
Dokumen ini adalah penyempurnaan untuk enterprise. Untuk 90% proyek, cukup baca 01-BACKEND.md dan 02-FRONTEND.md. 🚀
