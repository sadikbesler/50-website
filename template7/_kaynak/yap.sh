#!/bin/sh
# template7 derleme: JSX → HTML blok çevirisi + sayfalar + Tailwind 3.4.17
set -e
cd "$(dirname "$0")"
node blok-cevir.js > bloklar/cevir.log
node sayfalari-kur.js
npx tailwindcss -c tailwind.config.js -i tw.css -o ../assets/css/tw.css --minify 2>&1 | grep -iv 'browserslist\|update-db\|caniuse\|^$\|Why you should' || true
ls -la ../assets/css/tw.css | awk '{print "tw.css", $5, "bayt"}'
