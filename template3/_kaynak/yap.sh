#!/bin/sh
# Tüm derleme: sayfalar + tema + CSS
set -e
cd "$(dirname "$0")"
node sayfalari-kur.js
node tema-uret.js
npx @tailwindcss/cli -i tw.css -o ../assets/css/tw.css --minify 2>&1 | grep -v '^$' | tail -1
