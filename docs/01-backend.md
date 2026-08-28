# BACKEND.md — Backend Architecture Standard (Stack-Agnostic)

> **Pola:** Pragmatic Hexagonal Architecture (Ports & Adapters) + DDD
> **Prinsip:** 2 Level Kompleksitas — jangan over-engineer yang gak perlu
> **Stack:** Bebas — implementasi bisa pakai Express, Flask, Laravel, Go, dsb.

---

## 1. Struktur Root Backend (Generik)

```text
src/server/ # atau backend/, api/, dsb.
├── modules/
│ ├── <feature-1>/ # Satu folder per domain/fitur
│ ├── <feature-2>/
│ └── ...
├── shared/ # Cross-module code (events, errors, utils)
└── main.* # Entry point (app.ts, server.go, main.py, dsb.)
```

---

## 2. Level 1 — Simple Module (CRUD)

**Kapan:** CRUD sederhana, tanpa business rule kompleks, tanpa side-effect ke module lain.

```text
src/server/modules/<feature>/
├── domain/
│ └── <Entity>.{ts,py,go} # Entity + interface repository (inline)
├── application/
│ └── <Feature>Service.{ts,py} # Semua use case dalam 1 file
├── infrastructure/
│ └── <DB><Entity>Repo.{ts,py} # Implementasi repository (SQL, MongoDB, dsb.)
└── presentation/
├── <feature>Router.{ts,py} # HTTP/RPC router (Express, tRPC, Flask, dsb.)
└── <feature>Schema.{ts,py} # Validation schema (Zod, Pydantic, Joi, dsb.)
```

### Contoh: `Occupation` (Level 1) — Pseudo-code

**`domain/Occupation.ts` (atau .py, .go)**

```ts
export interface Occupation {
  id: string;
  name: string;
  organizationId: string;
}

export interface IOccupationRepository {
  findById(id: string): Promise<Occupation | null>;
  findAllByOrg(orgId: string): Promise<Occupation[]>;
  create(data: Omit<Occupation, 'id'>): Promise<Occupation>;
  update(id: string, data: Partial<Occupation>): Promise<Occupation>;
  delete(id: string): Promise<void>;
}

export function validateOccupationName(name: string): void {
  if (!name || name.trim().length < 2) {
    throw new Error('Nama occupation minimal 2 karakter');
  }
}
```

```text
application/OccupationService.ts
```

```ts
import { IOccupationRepository, validateOccupationName } from '../domain/Occupation';

export class OccupationService {
  constructor(private repo: IOccupationRepository) {}

  async create(name: string, organizationId: string) {
    validateOccupationName(name);
    return this.repo.create({ name, organizationId });
  }

  async list(organizationId: string) {
    return this.repo.findAllByOrg(organizationId);
  }
}
```

```text
infrastructure/SupabaseOccupationRepo.ts (atau MySQL, MongoDB, dsb.)
```

```ts
import { Occupation, IOccupationRepository } from '../domain/Occupation';

export class SupabaseOccupationRepo implements IOccupationRepository {
  // Implementasi spesifik DB
  async findById(id: string): Promise<Occupation | null> {
    // SELECT * FROM occupations WHERE id = $1
  }
  // ...
}
```

### 3. Level 2 — Complex Module (State Machine + Events)

**Kapan:** Ada state machine, cross-module side-effect, atau external service integration.

```text
src/server/modules/<feature>/
├── domain/
│   ├── entities/
│   │   └── <Entity>.ts
│   ├── value-objects/
│   │   └── <Entity>Status.ts
│   ├── events/
│   │   └── <Entity><Action>Event.ts
│   ├── errors/
│   │   └── <Entity>Errors.ts
│   └── repositories/
│       └── I<Entity>Repository.ts
├── application/
│   ├── use-cases/
│   │   ├── commands/            # Mengubah state
│   │   └── queries/             # Membaca data
│   ├── ports/
│   │   └── I<ExternalService>.ts
│   └── dto/
│       └── <Entity>DTO.ts
├── infrastructure/
│   ├── repositories/
│   ├── adapters/
│   └── mappers/
└── presentation/
    ├── <feature>Router.ts
    └── schemas/
```

**Contoh: Inspection (Level 2) — Pseudo-code**

```text
domain/entities/Inspection.ts
```

```ts
import { InspectionStatus } from '../value-objects/InspectionStatus';
import { InspectionAlreadySubmittedError } from '../errors/InspectionErrors';

export class Inspection {
  constructor(
    public readonly id: string,
    public status: InspectionStatus,
    public photos: string[],
  ) {}

  submit(): void {
    if (this.status !== InspectionStatus.DRAFT) {
      throw new InspectionAlreadySubmittedError(this.id);
    }
    if (this.photos.length === 0) {
      throw new Error('Tidak boleh submit tanpa foto');
    }
    this.status = InspectionStatus.SUBMITTED;
  }
}
```

```text
application/use-cases/commands/ApproveInspection.ts
```

```ts
import { IInspectionRepository } from '../../../domain/repositories/IInspectionRepository';
import { InspectionApprovedEvent } from '../../../domain/events/InspectionApprovedEvent';
import { eventBus } from '@/server/shared/events/eventBus';

export class ApproveInspection {
  constructor(private repo: IInspectionRepository) {}

  async execute(inspectionId: string, approverId: string) {
    const inspection = await this.repo.findById(inspectionId);
    if (!inspection) throw new Error('Inspection tidak ditemukan');

    inspection.approve();
    await this.repo.save(inspection);

    eventBus.publish(new InspectionApprovedEvent(inspection.id, approverId));
    return inspection;
  }
}
```

### 4. Kriteria Promosi Level 1 → Level 2

Naik ke Level 2 jika memenuhi minimal 1 dari:

| # | Kriteria | Contoh |
|---|----------|--------|
| 1 | ≥2 aksi trigger side-effect ke module lain | Approve → kirim notifikasi + update stats |
| 2 | Ada state machine dengan validasi kompleks | draft → submitted → approved/rejected |
| 3 | Butuh external service yang berpotensi diganti | Storage: Cloudinary → S3 |

Default: Level 1. Jangan bikin folder `events/`, `commands/`, `ports/` kalau tidak dibutuhkan.

### 5. Dependency Rule (Wajib)

```text
presentation/  →  application/  →  domain/
                       ↑
             infrastructure/  (implements interface dari domain/)
```

- `domain/` TIDAK BOLEH tahu tentang framework, database, atau library eksternal.
- Semua akses DB/service eksternal WAJIB lewat interface (port).
- `infrastructure/` mengimplementasikan interface, tidak dipanggil langsung.

### 6. Shared/Cross-Cutting Code

```text
src/server/shared/
├── events/
│   └── eventBus.{ts,py}    # Event dispatcher (in-memory atau queue)
├── errors/
│   └── BaseError.{ts,py}   # Base class untuk domain errors (lihat 03-ADVANCED.md)
└── utils/
    └── ...
```

### 7. Bounded Context (Komunikasi Antar Modul)

Aturan: Antar modul backend TIDAK BOLEH saling import repository/entity secara langsung.

Cara komunikasi yang benar:

- Via Use Case: Modul A panggil use case modul B.
- Via Event Bus: Untuk komunikasi async.

```ts
// ✅ BENAR
import { GetStudentByIdUseCase } from '@/server/modules/students/application/use-cases/queries/GetStudentByIdUseCase';

// ❌ SALAH — jangan langsung import repository
import { StudentRepository } from '@/server/modules/students/infrastructure/repositories/SupabaseStudentRepo';
```

### 8. Checklist Sebelum Membuat Module Baru

- [ ] Tentukan Level 1 atau Level 2 berdasarkan §4.
- [ ] Buat folder sesuai template.
- [ ] Definisikan interface repository DULU sebelum implementasi DB.
- [ ] Jangan buat DTO/mapper terpisah jika shape domain entity sudah sama.
- [ ] Jangan buat custom error class jika `throw new Error('pesan')` sudah cukup (kecuali butuh catch spesifik — lihat 03-ADVANCED.md).
