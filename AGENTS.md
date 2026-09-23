# AGENTS.md — DevWay (ringkas untuk AI agent)

Standar arsitektur NoHype Labs. Berlaku untuk semua project, apa pun stack-nya.
Dokumen lengkap: https://github.com/nohypelabs/devway — file ini cukup untuk bekerja.

## Aturan (wajib)

1. **Backend mulai dari Level 1.** Jangan bikin `events/`, `commands/`, `ports/`, `dto/`, `mappers/` kalau kriteria Level 2 belum terpenuhi.
2. **Definisikan interface repository dulu** (di `domain/`), baru implementasi DB (di `infrastructure/`).
3. **Antar modul lewat use case atau event bus.** Jangan import repository/entity modul lain secara langsung.
4. **`domain/` tidak boleh import framework, DB, HTTP, atau library eksternal.** Semua akses eksternal lewat interface.
5. **`page.*` dan `layout.*` hanya composition root:** import + susun komponen + panggil hook. Tidak ada JSX detail (card, form, table, modal) di dalamnya.
6. **Ekstrak ke `_components/` / `_hooks/` per route.** Naikkan ke shared hanya kalau dipakai ≥3 tempat dengan props identik. 2 tempat = biarkan duplikat.
7. **Presentational component tidak memanggil API/framework langsung** — lewat hook/service/port.
8. **Multi-tenant:** `tenantId` diambil dari sesi/token, tidak pernah dari request body. Filter tenant dilakukan di repository, meskipun RLS aktif.
9. **Migration ter-version sejak hari pertama.** Jangan pernah `db push` / edit schema manual di staging/prod. Setiap perubahan schema = satu file migration yang di-commit.
10. **`.env` di-validate saat startup** (Zod/Pydantic). Tambah env var baru → update `.env.example` di commit yang sama.
11. Jangan bikin custom error class kalau `throw new Error('pesan')` sudah cukup. Jangan bikin DTO/mapper kalau shape entity sudah sama.
12. Nama file komponen = apa yang di-render (`OrderTable.tsx`), bukan posisinya (`LeftColumn.tsx`). Satu file komponen ≤ ~200 baris.

## Level 1 → Level 2: naik hanya kalau ada minimal 1 dari

- ≥2 aksi yang memicu side-effect ke modul lain (approve → notifikasi + update stats)
- State machine dengan transisi ber-aturan (draft → submitted → approved/rejected)
- External service yang mungkin diganti (Cloudinary → S3, WA gateway A → B)

## Struktur

```text
src/server/modules/<feature>/          # Level 1 (default)
├── domain/<Entity>.ts                 # interface entity + interface repository + validasi murni
├── application/<Feature>Service.ts    # semua use case dalam 1 file
├── infrastructure/<DB><Entity>Repo.ts # implementasi repository
└── presentation/
    ├── <feature>Router.ts             # HTTP/tRPC handler, resolve TenantContext di sini
    └── <feature>Schema.ts             # Zod/Pydantic

src/server/modules/<feature>/          # Level 2 (hanya jika lolos kriteria)
├── domain/{entities,value-objects,events,errors,repositories}/
├── application/{use-cases/{commands,queries},ports,dto}/
├── infrastructure/{repositories,adapters,mappers}/
└── presentation/{<feature>Router.ts,schemas/}

src/server/shared/                     # eventBus, BaseError, auth/TenantContext — hanya yang benar-benar cross-module

src/client/(<group>)/<route>/
├── _components/                       # komponen khusus route ini
├── _hooks/                            # (_composables/ di Vue)
└── page.*                             # composition root saja
src/client/_shared/components/         # domain-specific, ≥3 pemakaian
src/client/ui/                         # primitif (Button, Input, Dialog), tanpa business logic
src/shared/                            # type DTO yang dipakai FE & BE — bukan domain entity
```

Dependency rule: `presentation → application → domain ← infrastructure`. Tidak ada arah lain.

## Checklist sebelum bikin module backend

- [ ] Tentukan Level 1/2 dari kriteria di atas (default: 1)
- [ ] Interface repository ditulis sebelum implementasi DB
- [ ] Semua method repository menerima `tenantId` dan memfilternya
- [ ] Tidak ada import `infrastructure/` dari `application/` atau `domain/`
- [ ] Ada file migration untuk perubahan schema
- [ ] Unit test domain + use case (repo di-mock) bisa jalan tanpa DB

## Checklist sebelum commit halaman frontend

- [ ] `page.*` isinya hanya import + susun komponen + hook
- [ ] Setiap komponen baru: nama menjelaskan yang di-render, ≤ ~200 baris
- [ ] Fetching di hook (`_hooks/`), bukan di komponen presentational
- [ ] Komponen yang naik ke shared memang dipakai ≥3 tempat

## Auth

- Router hanya memastikan user **login** (`requireAuth`). Cek **role/permission** dilakukan di use case: `if (ctx.role !== 'owner') throw new ForbiddenError()`.
- Aturan authorization yang kompleks → `application/policies/<Feature>Policy.ts`, pure function, di-unit-test.
- `TenantContext { tenantId, userId, role }` di-resolve **sekali** di presentation layer dari JWT/session, lalu diteruskan ke use case sebagai argumen pertama. Jangan baca `req.user` di application/domain.
- Password: hash dengan bcrypt/argon2, jangan pernah log atau return ke client. Token: short-lived access + refresh; simpan refresh di httpOnly cookie, bukan localStorage.
- Jangan bikin sistem auth sendiri kalau stack punya (Supabase Auth, NextAuth, Laravel Sanctum). Bikin sendiri hanya kalau ada alasan tertulis.

## Multi-tenant & RLS

- `tenantId` **selalu** dari `TenantContext`, tidak pernah dari body/query/params. Request yang mengirim `organizationId` di body = bug.
- Setiap method repository menerima `tenantId` dan menambahkan filternya sendiri (`.eq('organization_id', tenantId)`). Use case tidak bertanggung jawab mengingat filter ini.
- Setiap tabel milik tenant: kolom `organization_id NOT NULL`, index, dan **RLS policy aktif**. RLS adalah safety net — kode harus tetap benar tanpa RLS.
- Supabase client:
  - request atas nama user → client dengan JWT user (RLS aktif)
  - cron/webhook/job lintas tenant → `service_role` (RLS bypass) → repository **wajib** filter manual
  - **jangan** pakai `service_role` di handler request user "supaya gampang"
- Unique constraint selalu composite dengan tenant: `UNIQUE (organization_id, slug)`, bukan `UNIQUE (slug)`.
- Wajib ada test: user tenant A tidak bisa membaca/mengubah data tenant B.

## Boundary & validasi

- Validasi **shape** (Zod/Pydantic) di `presentation/<feature>Schema.*`. Validasi **aturan bisnis** (stok tidak boleh negatif, nama min 2 karakter) di `domain/`. Jangan dobel, jangan tertukar.
- Semua input eksternal (HTTP body, query, webhook payload, file upload, env) di-parse lewat schema sebelum masuk use case. Tidak ada `as any` / `req.body.x` mentah di application layer.
- Response envelope konsisten: `{ data }`, `{ data, meta }`, `{ error: { code, message } }`. Error HTTP status dari `BaseError.statusCode`.

## Webhook & pembayaran (QRIS/SNAP, WA gateway, dll)

- Verifikasi signature/HMAC **sebelum** parse body. Reject kalau gagal.
- Handler webhook harus **idempotent**: simpan `event_id`/`reference_no` dengan unique constraint; kalau sudah ada, return 200 tanpa proses ulang.
- Webhook hanya mengubah state lewat use case (`MarkInvoicePaid`), bukan update tabel langsung.
- Nominal uang: integer dalam satuan terkecil (rupiah, bukan desimal), atau `numeric` di DB. Jangan `float`.
- Secrets provider (client secret, private key) hanya di env, tidak pernah di repo, log, atau response.

## File upload & storage

- Upload lewat port (`IFileStorage`) di `application/ports/`, implementasi Cloudinary/S3/Supabase Storage di `infrastructure/adapters/`. Ini contoh sah untuk naik ke Level 2.
- Validasi mime type dan ukuran di server, bukan hanya di client. Nama file di-generate server (uuid), bukan pakai nama asli user.
- Simpan **path/key** di DB, bukan URL penuh — URL bisa berubah saat ganti provider.

## Secrets & env

- Tidak ada secret hardcoded, termasuk di test dan seed. Kalau butuh nilai untuk test, pakai `.env.test` yang git-ignored.
- Env public (`NEXT_PUBLIC_*`, `VITE_*`) hanya untuk nilai yang memang boleh dilihat browser. Supabase `service_role`, API secret, DB URL **tidak pernah** berprefix public.
- Kalau menemukan secret ter-commit: laporkan, jangan hapus diam-diam — credential-nya harus dirotasi.

## Kalau ragu

Pilih yang lebih sederhana. Duplikasi kecil lebih murah daripada abstraksi yang salah. Tanya sebelum menambah layer, folder, atau dependency baru.
