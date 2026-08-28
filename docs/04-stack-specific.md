---
sidebar_position: 4
---

# STACK-SPECIFIC.md — Implementasi per Framework/Stack

> Panduan ini adalah **contoh implementasi** dari arsitektur universal di berbagai stack populer.

---

## 1. Next.js + tRPC + Supabase (Stack yang Direkomendasikan)

**Struktur:**

```text
src/
├── server/
│   └── modules/
│       ├── products/
│       │   ├── domain/
│       │   ├── application/
│       │   ├── infrastructure/
│       │   └── presentation/
│       └── ...
├── app/
│   ├── (dashboard)/
│   │   └── products/
│   │       ├── _components/
│   │       ├── _hooks/
│   │       └── page.tsx
│   └── ...
└── components/
    ├── ui/
    └── shared/
```

**Key Technologies:**

- **Backend:** tRPC (API layer), Supabase (Database), Zod (Validation)
- **Frontend:** Next.js App Router, Tailwind CSS, React Query
- **Testing:** Vitest, React Testing Library

---

## 2. React + Express + PostgreSQL (Alternatif)

**Struktur:**

```text
frontend/
├── src/
│   ├── components/
│   │   ├── features/
│   │   │   └── products/
│   │   │       ├── ProductForm.tsx
│   │   │       └── ProductList.tsx
│   │   └── shared/
│   └── hooks/
│       └── useProducts.ts
backend/
├── src/
│   └── modules/
│       └── products/
│           ├── domain/
│           ├── application/
│           ├── infrastructure/
│           └── presentation/
│               └── productController.ts
```

**Key Technologies:**

- **Backend:** Express.js, PostgreSQL, TypeORM/Prisma
- **Frontend:** React, React Query, Tailwind CSS
- **Testing:** Jest, React Testing Library

---

## 3. Vue + Nuxt + Supabase

**Struktur:**

```text
server/
├── modules/
│   └── products/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
client/
├── pages/
│   └── products/
│       ├── _components/
│       │   ├── ProductForm.vue
│       │   └── ProductList.vue
│       ├── _composables/
│       │   └── useProducts.ts
│       └── index.vue
└── components/
    ├── ui/
    └── shared/
```

**Key Technologies:**

- **Backend:** Nitro (Nuxt server), Supabase
- **Frontend:** Vue 3, Nuxt 3, Tailwind CSS
- **Testing:** Vitest, Vue Test Utils

---

## 4. Django + React (Full-Stack)

**Struktur:**

```text
backend/
├── apps/
│   └── products/
│       ├── domain/          # models.py
│       ├── application/     # services.py
│       ├── infrastructure/  # repositories.py
│       └── presentation/    # views.py, serializers.py
frontend/
├── src/
│   └── features/
│       └── products/
│           ├── components/
│           ├── hooks/
│           └── index.tsx
```

**Key Technologies:**

- **Backend:** Django, Django REST Framework, PostgreSQL
- **Frontend:** React, React Query, Tailwind CSS

---

## 5. Laravel + Vue (Inertia.js)

**Struktur:**

```text
backend/
├── app/
│   └── Modules/
│       └── Products/
│           ├── Domain/
│           ├── Application/
│           ├── Infrastructure/
│           └── Presentation/
│               └── Controllers/
frontend/
├── resources/
│   └── js/
│       └── Pages/
│           └── Products/
│               ├── Components/
│               ├── Composables/
│               └── Index.vue
```

**Key Technologies:**

- **Backend:** Laravel, Eloquent ORM, PostgreSQL
- **Frontend:** Vue 3, Inertia.js, Tailwind CSS

---

## 6. Flask + React (Microservices)

**Struktur:**

```text
backend/
├── modules/
│   └── products/
│       ├── domain/
│       ├── application/
│       ├── infrastructure/
│       └── presentation/
│           └── routes.py
frontend/
├── src/
│   └── features/
│       └── products/
│           ├── components/
│           ├── hooks/
│           └── index.tsx
```

**Key Technologies:**

- **Backend:** Flask, SQLAlchemy, PostgreSQL
- **Frontend:** React, React Query, Tailwind CSS

---

## 7. Node.js + Express + MongoDB (NoSQL)

**Struktur:**

```text
src/
├── modules/
│   └── products/
│       ├── domain/
│       │   └── Product.ts
│       ├── application/
│       │   └── ProductService.ts
│       ├── infrastructure/
│       │   └── MongoProductRepo.ts
│       └── presentation/
│           └── productRouter.ts
```

**Key Technologies:**

- **Backend:** Express.js, Mongoose, MongoDB
- **Frontend:** React atau vanilla JS (sesuai kebutuhan)

---

## 📌 Tips Memilih Stack

| Kriteria | Rekomendasi Stack |
|---|---|
| **Full-stack TypeScript** | Next.js + tRPC + Supabase |
| **React + Express** | React + Express + PostgreSQL |
| **Vue.js** | Vue + Nuxt + Supabase |
| **Python (Django)** | Django + React |
| **PHP (Laravel)** | Laravel + Vue (Inertia) |
| **Microservices** | Flask + React |
| **NoSQL** | Node.js + Express + MongoDB |

---

**Prinsip arsitektur di `01-backend.md`, `02-frontend.md`, dan `03-advanced.md` berlaku untuk SEMUA stack di atas. Hanya implementasi teknis yang berbeda. 🚀**
