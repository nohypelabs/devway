# 📚 DevWay — Panduan Arsitektur Universal

> **Pola:** Decoupled Architecture (Hexagonal DDD + Modular Component-Based)
> **Prinsip:** Pragmatis, Scalable, Maintainable, Anti-Over-Engineering
> **Universal:** Dapat diimplementasikan di STACK APAPUN (React, Vue, Next.js, Express, Django, Laravel, Go, dll.)

**DevWay** adalah "kitab wajib" arsitektur untuk seluruh developer dan AI Agent. Satu standar yang sama berlaku di semua project, apa pun bahasa/framework-nya — hanya implementasi teknis yang berbeda.

---

## 🎯 Filosofi

- **Anti over-engineering.** Pakai Level 1 (simple) secara default. Naik ke Level 2 hanya kalau benar-benar butuh.
- **Decoupled & modular.** Backend pakai Hexagonal (Ports & Adapters) + DDD; Frontend pakai feature-based folder + composition root.
- **Dependency rule ketat.** `domain` tidak boleh tahu framework/DB. Semua akses eksternal lewat interface (port).
- **Ekstraksi agresif.** Unit visual yang berdiri sendiri = komponen terpisah. Jangan tumpuk JSX detail di `page.*`.

---

## 🗺️ Peta Dokumentasi

### Inti (Wajib Baca)

| Dokumen | Isi |
|---|---|
| [`readme`](readme) | Panduan arsitektur universal ini |
| [`architecture`](architecture) | Overview struktur root & prinsip decoupled architecture |
| [`01-backend`](01-backend) | Standard arsitektur backend — Level 1 (CRUD) & Level 2 (state machine + events), dependency rule, bounded context |
| [`02-frontend`](02-frontend) | Standard arsitektur frontend — composition root, struktur folder feature-based, kapan ekstraksi komponen |
| [`03-advanced`](03-advanced) | Pola advanced/enterprise — error handling, env vars, migration, monorepo, observability |
| [`04-stack-specific`](04-stack-specific) | Contoh implementasi per stack (Next.js, Express, Nuxt, Django, Laravel, Flask, Node+Mongo) |

### Operasional & Kontribusi

| Dokumen | Isi |
|---|---|
| [`development`](development) | Setup lokal & menjalankan project |
| [`deployment`](deployment) | Deploy ke production |
| [`testing`](testing) | Strategi testing (unit, integration, e2e) |
| [`project-structure`](project-structure) | Penjelasan struktur folder project |
| [`api`](api) | Dokumentasi API |
| [`faq`](faq) | Pertanyaan yang sering muncul |
| [`contributing`](contributing) | Cara berkontribusi ke repo ini |
| [`security`](security) | Kebijakan keamanan & pelaporan vulnerability |
| [`changelog`](changelog) | Riwayat perubahan |

---

## 🚀 Panduan Cepat — "Mau Bikin Apa?"

| Yang Ingin Dibuat | Baca |
|---|---|
| Backend module baru (CRUD sederhana) | [`01-backend`](01-backend) §2 |
| Backend module kompleks (state machine/events) | [`01-backend`](01-backend) §3 |
| Halaman frontend baru | [`02-frontend`](02-frontend) §2–§3 |
| Komponen UI baru | [`02-frontend`](02-frontend) §1 |
| Error handling & observability | [`03-advanced`](03-advanced) §1, §5 |
| Environment variables | [`03-advanced`](03-advanced) §2 |
| Database migration | [`03-advanced`](03-advanced) §3 |
| Scaling ke monorepo | [`03-advanced`](03-advanced) §4 |
| Setup lokal & jalankan project | [`development`](development) |
| Deploy ke production | [`deployment`](deployment) |
| Testing | [`testing`](testing) |
| Struktur folder project | [`project-structure`](project-structure) |
| Daftar API | [`api`](api) |
| Cari jawaban cepat | [`faq`](faq) |
| Laporkan kerentanan | [`security`](security) |

---

## 🧠 Aturan Emas (Ringkas)

1. **Backend:** mulai dari Level 1. Jangan buat folder `events/`, `commands/`, `ports/` kalau tidak dibutuhkan.
2. **Backend:** define interface repository **dulu**, baru implementasi DB.
3. **Backend:** antar modul komunikasi lewat use case atau event bus — **jangan** import repository/entity modul lain secara langsung.
4. **Frontend:** `page.*` & `layout.*` hanya composition root. Ekstrak komponen & hook ke `_components/` / `_hooks/`.
5. **Frontend:** naikkan ke shared hanya kalau dipakai **≥3** tempat identik (hindari premature abstraction).
6. **Keduanya:** jangan panggil API/framework langsung di presentational layer — selalu lewat service/hook/port.

---

**Dokumen ini adalah standar wajib untuk seluruh project. Gunakan di APAPUN. 🚀**
