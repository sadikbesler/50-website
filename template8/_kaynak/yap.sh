#!/bin/sh
# template8: derle ve şablon klasörüne aktar (0.7). Çalıştır: sh _kaynak/yap.sh
set -e
cd "$(dirname "$0")/astro"
npm run build
rsync -a --delete --exclude _kaynak --exclude _referans --exclude DURUM.md --exclude .gitignore --exclude backend dist/ ../../
echo "template8 güncellendi"
