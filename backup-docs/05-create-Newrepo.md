---
sidebar_position: 10
---
# 1. Inisialisasi project baru
git init
touch .gitignore
nano .gitignore  # isi pola file sensitif

# 2. Setelah file project siap
git add .
git commit -m "pesan commit"

# 3. Kalau perlu bikin repo di GitHub
gh auth login      # sekali aja
gh repo create nama-repo --public --source=. --remote=origin --push

# 4. Kalau ada perubahan file
git add .
git commit -m "update"
git push

# 5. Kalau file rahasia ke-track (emergency!)
git rm --cached .env
git commit -m "remove sensitive file"
git push
