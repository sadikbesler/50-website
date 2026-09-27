#!/bin/sh
# template6 derleme: sayfalar + Tailwind 3.4.17. Küçültücü gradyanı "linear-gradient(90deg,#d53369,#daae51)" diye
# kısaltıyor (0% / 100% durakları varsayılan sayıldığı için); kaynağın yazımı birebir kalsın diye geri yazılır.
set -e
cd "$(dirname "$0")"
node sayfalari-kur.js
npx tailwindcss -c tailwind.config.js -i tw.css -o ../assets/css/tw.css --minify 2>&1 | grep -iv 'browserslist\|update-db\|caniuse\|^$\|Why you should' || true
sed -i '' 's/linear-gradient(90deg,#d53369,#daae51)/linear-gradient(90deg,#d53369 0%,#daae51 100%)/g' ../assets/css/tw.css
grep -c 'linear-gradient(90deg,#d53369 0%,#daae51 100%)' ../assets/css/tw.css
