---
id: multi-tenant
sidebar_position: 2
---

# Auth & Multi-Tenancy

Hampir semua produk NoHype Labs multi-tenant (satu deployment, banyak organisasi/sekolah/warung). Bagian ini menetapkan **di mana tenant scoping hidup** supaya tidak bocor antar tenant dan tidak duplikat di tiap layer.

## 1. Prinsip

1. **Tenant ID datang dari sesi, bukan dari request body.** Client tidak pernah mengirim `organizationId` — server resolve dari token/session.
2. **Scoping terjadi di repository.** Setiap method repository menerima `tenantId` (atau `TenantContext`) dan menambahkan filter-nya sendiri. Use case tidak perlu ingat menambah `WHERE organization_id = ?`.
3. **RLS (Row Level Security) adalah safety net, bukan business logic.** Kalau pakai Supabase/Postgres, aktifkan RLS di semua tabel tenant. Tapi kode tetap harus benar tanpa RLS — RLS menangkap bug, bukan menggantikan filter.
4. **Domain tidak tahu tenant** kecuali tenant memang bagian dari konsep bisnis. `Product` tidak perlu tahu ia milik org mana; repository yang tahu.

## 2. Bentuk Kode (Level 1)

```ts
// application/ProductService.ts
export class ProductService {
  constructor(private repo: IProductRepository) {}

  list(ctx: TenantContext) {
    return this.repo.findAll(ctx.tenantId);
  }

  create(ctx: TenantContext, input: CreateProductInput) {
    validateProductName(input.name);
    return this.repo.create(ctx.tenantId, input);
  }
}
```

```ts
// infrastructure/SupabaseProductRepo.ts
export class SupabaseProductRepo implements IProductRepository {
  constructor(private db: SupabaseClient) {}

  async findAll(tenantId: string) {
    const { data, error } = await this.db
      .from('products')
      .select('*')
      .eq('organization_id', tenantId);   // filter eksplisit, walau RLS aktif
    if (error) throw error;
    return data.map(toDomain);
  }
}
```

```ts
// presentation/productRouter.ts — tenant di-resolve sekali, di sini
router.get('/', requireAuth, async (req, res) => {
  const ctx: TenantContext = { tenantId: req.user.organizationId, userId: req.user.id };
  res.json({ data: await productService.list(ctx) });
});
```

`TenantContext` didefinisikan di `src/server/shared/auth/TenantContext.ts`:

```ts
export interface TenantContext {
  tenantId: string;
  userId: string;
  role: 'owner' | 'admin' | 'staff' | 'member';
}
```

## 3. Supabase: Client mana yang dipakai?

| Situasi | Client | RLS |
|---|---|---|
| Request atas nama user (default) | `createServerClient` dengan JWT user | Aktif — RLS membatasi ke tenant user |
| Job/cron/webhook lintas tenant | `service_role` client | Bypass — **wajib** filter manual di repository |
| Frontend langsung ke Supabase | anon client + JWT | Aktif — hanya untuk read sederhana; mutasi lewat API |

Jangan pernah pakai `service_role` di handler request user biasa "supaya gampang". Itu mematikan safety net-nya.

## 4. Authorization (role di dalam tenant)

- Cek role di **use case**, bukan di router: `if (ctx.role !== 'owner') throw new ForbiddenError()`. Router hanya memastikan user login.
- Untuk aturan yang kompleks (owner boleh X kecuali Y), bikin `application/policies/<Feature>Policy.ts` — satu file per fitur, pure function, mudah di-unit-test.

## 5. Checklist Module Multi-Tenant

- [ ] Semua method repository menerima `tenantId` dan memfilternya.
- [ ] Tidak ada `organizationId`/`tenantId` yang dibaca dari request body atau query.
- [ ] Tabel tenant punya kolom `organization_id NOT NULL` + index + RLS policy.
- [ ] `service_role` hanya dipakai di job/webhook, dan repository yang dipanggilnya tetap memfilter tenant.
- [ ] Ada minimal satu test: user tenant A tidak bisa membaca data tenant B.
