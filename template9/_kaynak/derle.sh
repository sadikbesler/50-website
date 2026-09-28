#!/bin/sh
# template9 derleme hattı (0.7 Astro kuralı): kaynak üret → npm run build → rsync
set -e
K="$(cd "$(dirname "$0")" && pwd)"
HEDEF="$(dirname "$K")"
python3 "$K/anasayfa-kur.py"        # ana sayfa + TR sözlüğü + KVKK gövdesi (diyetisyen-v2'den)
node "$K/blog-cevir.js" > /dev/null  # 6 makale → src/content/posts/*.md
cd "$K/astro"
npm run build
rsync -a --delete --exclude _kaynak --exclude _referans --exclude DURUM.md --exclude .gitignore --exclude backend dist/ "$HEDEF/"
echo "yayın klasörü güncellendi: $HEDEF"
