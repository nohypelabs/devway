---
sidebar_position: 11
---

# Membuat Repo Baru

Checklist dan perintah saat memulai project baru.

## 1. Inisialisasi

```bash
git init
cp <devway>/AGENTS.md .            # aturan arsitektur untuk AI agent
cp <devway>/.gitignore.example .gitignore   # atau tulis manual, minimal: .env, node_modules, build
touch .env.example
```

## 2. Commit pertama

```bash
git add .
git commit -m "chore: init project"
```

## 3. Buat repo di GitHub

```bash
gh auth login      # sekali saja
gh repo create nohypelabs/nama-repo --private --source=. --remote=origin --push
```

## 4. Perubahan berikutnya

```bash
git add .
git commit -m "feat: ..."   # convention di contributing.md
git push
```

## 5. Kalau file rahasia terlanjur ke-track

```bash
git rm --cached .env
echo ".env" >> .gitignore
git commit -m "chore: remove sensitive file"
git push
```

Kalau sudah sempat ter-push ke remote, **rotasi semua credential** di dalamnya. Menghapus dari history saja tidak cukup.
