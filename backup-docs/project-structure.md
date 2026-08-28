---
sidebar_position: 10
---
### 5. **`PROJECT-STRUCTURE.md`** — PENJELASAN STRUKTUR FOLDER
```markdown
# Project Structure — Buku Wajib Developer
buku-wajib-developer/
├── src/
│ ├── server/ # Backend
│ │ ├── modules/ # Domain modules (DDD)
│ │ │ ├── products/
│ │ │ ├── users/
│ │ │ └── ...
│ │ └── shared/ # Cross-module utils
│ ├── client/ # Frontend
│ │ ├── (dashboard)/ # Route group
│ │ ├── (admin)/
│ │ └── (public)/
│ └── shared/ # Shared antara FE & BE (types, utils)
├── prisma/ # Database schema & migrations
├── public/ # Static assets
├── .env.example # Template environment
├── .gitignore
├── package.json
├── README.md
└── ...

text

## 🧩 Penjelasan Tiap Folder
- **`src/server/modules/`**: Setiap fitur jadi module mandiri (lihat `01-BACKEND.md`).
- **`src/client/(group)/`**: Route group berdasarkan role/akses.
- **`src/client/(group)/[route]/_components/`**: Komponen khusus route itu.
- **`src/shared/`**: Type/interface yang dipakai FE & BE.

## 🔁 Kapan Pindah ke Shared?
- Komponen/function dipakai ≥3 tempat → pindah ke `_shared/`.
- Type/interface dipakai FE & BE → taruh di `src/shared/types/`.
