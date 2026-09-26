# Parçalar: template46 (svg-gauge)

Biçim: Mizan bölümü → kaynak bileşen adı → URL veya dosya yolu → değiştirilen şeyler

- S9 Araçlar / VKİ sonuç kutusu (`[data-result="bmi"]`) → svg-gauge `Gauge()` (yarım daire, demo sayfasındaki "gauge2" ayarı) → https://github.com/naikus/svg-gauge · `dist/gauge.min.js` (npm `svg-gauge@1.0.7`) → kütüphane dosyası değiştirilmedi. Ayarlar: `min 10`, `max 45`, `dialStartAngle 180`, `dialEndAngle 0`, `dialRadius 40`, `viewBox "0 0 100 57"` (demodaki gauge2 ile aynı kırpma), `color` → `var(--bmi-1…5)`, `label` → `toLocaleString('tr-TR' | 'en-GB', 1 ondalık)`.
- S9 Araçlar / gösterge stili → demo `example/index.css` `.gauge-container.two` (dial `stroke-width 10`, value `stroke-width 13`, metin 16 birim) → `_kaynak/indirilen/svg-gauge/example/index.css` → oranlar aynen alındı. Renkler promta göre değişti: dial `--line`, değer yayı kategori rengi `--bmi-*`, metin `--ink`, yazı tipi `--serif` (Newsreader; sitenin büyük rakam fontu, `.result-num` ile aynı).
- S9 Araçlar / kategori sınırı çentikleri → kaynakta yok, promt istedi → `assets/js/tools.js` `renderGauge()` → 18,5 / 25 / 30 / 35 / 40 için beş `<line class="tick">`, kütüphanenin geometrisiyle (merkez 50,50; açı = 180 + (v−10)/35·180) aynı viewBox'ta, yayın iç tarafında (r 27–31).
- CodePen demosu (http://codepen.io/naikus/pen/BzkoLL) Cloudflare doğrulamasına (403) takıldığı için açılamadı; referans olarak deponun kendi demo sayfası (`example/index.html`) kullanıldı: `_referans/kaynak-demo-1440.jpg`, `kaynak-demo-390.jpg`, `kaynak-gauge2.jpg`.
