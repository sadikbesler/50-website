# Template 33 — kullanılan parçalar

Satır biçimi: Mizan bölümü → kaynak bileşen adı → URL veya dosya yolu → değiştirilen şeyler

- S13 Randevu, onay adımı → canvas-confetti `confetti.create(canvas, { resize: true, useWorker: false })` + çağrı `{ particleCount: 90, spread: 70, startVelocity: 38, origin, colors, disableForReducedMotion: true }` → https://github.com/catdad/canvas-confetti (README "confetti.create", "options"); `assets/vendor/canvas-confetti/confetti.browser.min.js` → origin, onay başlığının (`[data-step="done"] .bstep-title`) yazısının ekrandaki merkezinden 0–1 aralığına çevrildi; renkler o anki temanın `--olive`, `--sage-2`, `--terra`, `--bmi-3` değerleri; `ticks: 150` (≈2,5 sn); tuval `aria-hidden`, iş bitince DOM'dan kalkıyor.
- S9 Araçlar, su takibi → aynı kütüphane, küçük patlama `{ particleCount: 40, spread: 60, startVelocity: 24, ticks: 120, scalar: 0.8 }` → aynı dosya → origin, günlük hedefi tamamlayan bardağın merkezi; klinik gününe göre günde bir kez (`mizan-water-celebrated-<YYYY-AA-GG>`).
- Demo sayfasındaki "Basic Cannon" örneği (`particleCount: 100, spread: 70, origin: { y: 0.6 }`) görünüş referansı olarak alındı: `_referans/kaynak-patlama.jpg`. Parçacık biçimi (kare + daire, yalpalama, sönme) kütüphanenin varsayılanı; değiştirilmedi.

## Kütüphaneyi saran kod
- `assets/js/celebrate.js` (yeni, 3,8 KB / gzip 1,7 KB): `mizan:booked` ve `mizan:water-goal` olaylarını dinler, hareket azaltma ve "Hareketi duraklat" kontrolü yapar.
- `assets/js/booking.js`: 0.8 "Randevu olayı" yaması (`finish()` sonunda `mizan:booked`).
- `assets/js/tools.js`: bardak tıklamasında hedef dolunca `mizan:water-goal` olayı (tek satır).
- `assets/js/site.js`, `assets/js/boot.js`: 0.7 tema senkronu (`html.dark` + `mizan:theme`).
- `assets/css/site.css`: `.mizan-confetti` tuval katmanı (sabit, tam ekran, `pointer-events: none`, `z-index: 260`).
