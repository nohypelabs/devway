---
sidebar_position: 2
---

# FRONTEND.md — Frontend Architecture Standard (Stack-Agnostic)

> **Pola:** Feature-based folder structure + strict component composition
> **Prinsip:** `page.*` sebagai composition root, bukan tempat menulis JSX/HTML detail
> **Stack:** Bebas — berlaku untuk React, Vue, Svelte, Angular, atau bahkan vanilla JS.

---

## 1. Aturan Inti (Wajib)

1. **`page.*` dan `layout.*` HANYA sebagai composition root.** Tidak boleh berisi HTML/JSX detail untuk card, section, list, form, atau modal.
2. **Trigger wajib ekstraksi:** Jika sebuah blok HTML/JSX memiliki ≥2 level nested children dengan class/style panjang DAN merepresentasikan 1 unit visual utuh — **langsung ekstrak jadi komponen**.
3. **Penamaan file = apa yang di-render**, bukan posisinya. `StatsGrid.jsx`, `OrderTable.vue` — BUKAN `Section1.jsx`, `LeftColumn.svelte`.
4. **Styling tetap co-located.** Di React pakai Tailwind/CSS-in-JS, di Vue pakai scoped CSS, di Svelte pakai `<style>` — jangan pindah ke file CSS global terpisah kecuali benar-benar shared.
5. **Setiap unit visual yang berdiri sendiri = komponen terpisah.** Card, list item, form field, modal — semua wajib jadi file sendiri.

---

## 2. Struktur Folder Frontend (Generik)

```text
src/client/                         # atau app/, ui/, frontend/, dsb.
├── (admin)/                        # Route Group: Admin
│   └── dashboard/
│       └── page.*                  # HANYA composition root
├── (dashboard)/                    # Route Group: User
│   ├── products/
│   │   ├── [id]/
│   │   │   ├── _components/         # Komponen khusus route ini
│   │   │   │   ├── ProductForm.*
│   │   │   │   └── ImageUploader.*
│   │   │   ├── _hooks/              # Atau _composables/, _stores/ (tergantung framework)
│   │   │   │   └── useProductForm.*
│   │   │   └── page.*
│   │   └── orders/
│   │       ├── _components/
│   │       │   ├── OrderTable.*
│   │       │   └── InvoiceModal.*
│   │       ├── _hooks/
│   │       │   └── useOrdersData.*
│   │       └── page.*
│   └── (public)/                   # Login, Landing Page
│       └── login/
│           └── page.*
└── _shared/                        # Shared components (domain-specific)
    └── components/
        └── UserAvatar.*
```

**Aturan folder:**

- Komponen khusus 1 route → `_components/` route (pakai prefiks `_` agar diabaikan oleh router).
- Komponen dipakai ≥2 halaman → naikkan ke `src/client/_shared/components/` (domain-specific) atau `src/client/ui/` (UI primitif).
- **⚠️ PERANGKAP PREMATURE ABSTRACTION:** Jangan pindahkan ke shared hanya karena dipakai 2 halaman. Tunggu **minimal 3 penggunaan identik** atau kontrak props-nya stabil.

---

## 3. Contoh: `page.*` yang Benar vs Salah

### ❌ SALAH — Monolith (React/JSX)

```tsx
export default function DashboardPage() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="bg-white rounded-[28px] p-5">
        <div className="flex justify-between">
          {/* puluhan baris JSX detail inline */}
        </div>
      </div>
    </div>
  );
}
```

### ✅ BENAR — Composition Root

```tsx
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { OrderTable } from '@/components/dashboard/OrderTable';

export default function DashboardPage() {
  const { data: stats } = useStats();
  const { data: orders } = useOrders();

  return (
    <div className="min-h-screen">
      <StatsGrid stats={stats} />
      <OrderTable orders={orders} />
    </div>
  );
}
```

Untuk Vue:

```vue
<template>
  <div class="min-h-screen">
    <StatsGrid :stats="stats" />
    <OrderTable :orders="orders" />
  </div>
</template>

<script setup>
import { useStats } from '@/composables/useStats';
import { useOrders } from '@/composables/useOrders';
const { data: stats } = useStats();
const { data: orders } = useOrders();
</script>
```

---

## 4. Kapan Fetching/State Boleh di Komponen Anak

Default: Fetching/data-fetching di `page.*`, hasil diturunkan via props.

Pengecualian (komponen boleh fetch sendiri):

- Punya state internal kompleks yang terikat erat dengan query (chart dengan toggle periode).
- Dipakai di banyak tempat dengan kebutuhan data yang sama persis.

---

## 5. Styling Cheat Sheet (React/Tailwind)

| Yang Mau Diubah | Class Tailwind |
|---|---|
| Tinggi/lebar card | `h-[...]`, `w-[...]`, `min-h-[...]` |
| Padding | `p-5`, `px-6 py-3` |
| Border radius | `rounded-[28px]`, `rounded-xl` |
| Grid kolom | `grid-cols-2`, `lg:grid-cols-4` |
| Gap | `gap-[13px]`, `lg:gap-[18px]` |
| Lebar relatif | `col-span-3` (dari total `grid-cols-5`) |

Untuk framework lain, sesuaikan dengan sistem styling masing-masing (Vue scoped, Svelte, CSS Modules, dsb.).

---

## 6. tRPC vs REST vs GraphQL (Stack-Agnostic)

- **tRPC (Next.js):** `trpc.server.routerName.procedureName` (server) / `trpc.react...` (client)
- **REST (Flask/Express):** `fetch('/api/...')` di `page.*` atau di custom hook.
- **GraphQL (Apollo):** `useQuery`/`useMutation` di `page.*` atau di custom hook.

Prinsip: Jangan panggil API langsung di komponen presentational — ekstrak ke hook/composable/service.

---

## 7. Panduan Testing Frontend

- **Component Test:** Testing Library (React/Vue/Svelte) untuk komponen di `_components/`.
- **Hook Test:** `@testing-library/react-hooks` (React) atau `@vue/test-utils` (Vue) untuk custom hook di `_hooks/`.

---

## 8. Checklist Sebelum Commit Halaman Baru

- [ ] Buka `page.*` — apakah isinya cuma import + susun komponen?
- [ ] Setiap komponen baru punya nama yang menjelaskan apa yang direndernya.
- [ ] Komponen yang dipakai >1 halaman sudah dipindah ke shared (tapi tunggu 3x pakai!).
- [ ] Tidak ada file komponen tunggal yang melebihi ~150–200 baris.
