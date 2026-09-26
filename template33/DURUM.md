# Template 33 — canvas-confetti · DURUM

- **Tarih:** 27 Eylül 2026
- **Kaynak:** canvas-confetti 1.9.4 · https://github.com/catdad/canvas-confetti · demo https://catdad.github.io/canvas-confetti/ · **ISC** (© 2020 Kiril Vatev)
- **Tür:** E (entegrasyon). diyetisyen-v2 tasarımı aynen kaldı; yalnızca iki küçük kutlama eklendi.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template33/
- **Yerel önizleme:** http://localhost:8801/50-website/template33/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template33` (depoya giren kısım ≈ 13 MB; `_kaynak/indirilen/` 4,1 MB, `.gitignore` ile dışarıda)

## Ne yapıldı

1. **Randevu onayı:** `booking.js` → `finish()` sonunda `mizan:booked` olayı (0.8 yaması). `celebrate.js` bu olayda, onay adımı kaydırılarak yerine oturunca, onay başlığının ("Randevu talebiniz gönderildi") yazısının ekrandaki merkezinden 90 parçacıklık bir patlama yapar: `spread: 70`, `startVelocity: 38`, renkler o anki temadan `--olive`, `--sage-2`, `--terra`, `--bmi-3`.
2. **Su hedefi:** Günlük bardak hedefi bir tıklamayla ilk kez dolduğunda, o bardağın konumundan 40 parçacıklık küçük bir patlama olur. Klinik gününe göre günde bir kez: `localStorage['mizan-water-celebrated-<YYYY-AA-GG>']`. Aynı gün boşaltıp yeniden doldurmak ya da sayfayı yenilemek tekrar tetiklemez.
3. **Ekran okuyucu:** Hiçbir yeni metin, canlı bölge veya bildirim yok. Tuval `aria-hidden="true"` ve `pointer-events: none`; odak onay adımında kalır.
4. **Hareket:** `prefers-reduced-motion: reduce` açıksa ya da "Hareketi duraklat" düğmesi açıksa (`html.film-paused` / `mizan-motion=off`) tuval hiç oluşturulmaz. Çağrıda `disableForReducedMotion: true` da var.
5. **Tema senkronu (0.7):** `site.js` → `applyTheme` içinde `html.dark` sınıfı ve `mizan:theme` olayı; `boot.js` ilk boyamadan önce aynı sınıfı koyar.
6. `og:title` / `twitter:title` / açıklamalar güncellendi (yalnızca ana sayfa; blog ve KVKK kendi başlıklarını taşıyor).

### Bölüm eşlemesi (özet, ayrıntı `_kaynak/PARCALAR.md`)

| Mizan bölümü | canvas-confetti | Not |
|---|---|---|
| S13 Randevu, onay adımı | `confetti.create(canvas, { resize: true, useWorker: false })` + 90 parçacık | origin = başlık yazısının merkezi (1440'ta x 0,222 / y 0,363; 390'da x 0,47 / y 0,366) |
| S9 Araçlar, su takibi | aynı örnek, 40 parçacık, `scalar: 0.8` | origin = hedefi tamamlayan bardak |

## Kaynaktan / promttan farklar ve nedenleri

- **`useWorker: false`, `confetti()` çağrısında değil `confetti.create()`'te.** README'ye göre `useWorker` yalnızca `confetti.create(canvas, globalOptions)` seçeneği. Kaynak kodda (`src/confetti.js` satır 720–723) global `confetti()` her zaman `confettiCannon(null, { useWorker: true, resize: true })` ile kuruluyor, çağrıya verilen `useWorker: false` hiç okunmuyor. Global fonksiyon kullanılsaydı blob worker açılacak ve CSP'ye takılacaktı. Bu yüzden kendi tuvalimizle `confetti.create(…, { useWorker: false })` kullanıldı. Diğer seçenek adları (`particleCount`, `spread`, `startVelocity`, `origin`, `colors`, `disableForReducedMotion`, `ticks`, `scalar`) README ile doğrulandı.
- **`colors` hex'e çevriliyor.** Kütüphane yalnızca `#rrggbb` okuyor (`hexToRgb`). Tema değişkenleri 2D bağlamın `fillStyle`'ı üzerinden normalleştiriliyor (bugün zaten hex; ileride `rgb()`/`oklch()` olursa da çalışır).
- **`ticks: 150` (randevu) / `120` (su) eklendi.** Varsayılan 200 kare ≈ 3,3 sn sürüyor; testin istediği "3 sn içinde temizlenme" ve "ölçülü" hedefi için kısaltıldı (ölçülen: 2,50 sn / 1,99 sn). Ayrıca 2,9 sn'lik bir güvenlik zamanlayıcısı `reset()` çağırır (arka plandaki sekmede kareler durursa tuval yine kalkar).
- **Origin, başlık öğesinin değil yazısının merkezi.** `h3` sütun genişliğinde bir blok olduğundan öğe merkezi yazının sağına düşüyordu; `Range` ile yazının sınırları kullanıldı.
- **Su patlamasında promtun belirtmediği değerler:** `spread: 60`, `startVelocity: 24`, `scalar: 0.8`: 34×44 px'lik bardaktan çıkan "küçük" patlama için.
- **Koyu temada `--sage-2` (#2A3325) parçacıkları koyu zeminde zor seçiliyor.** Promt bu dört değişkeni açıkça istediği için değiştirilmedi; istenirse `--sage-2` yerine `--bmi-2` konabilir.
- **Vendor dosyası:** npm paketinde `.min.js` yok. README'nin gösterdiği `dist/confetti.browser.min.js` jsDelivr'ın Terser çıktısı; kaynağı npm'deki dosyayla bayt bayt aynı. Başa lisans satırı eklendi, `sourceMappingURL` satırı çıkarıldı (bkz. `assets/vendor/KAYNAKLAR.md`).

## CSP ve eklenen dosyalar

- **CSP değişmedi.** `worker-src blob:` gerekmedi (worker kullanılmıyor), `'unsafe-inline'` / `'unsafe-eval'` yok. Tuval stilleri `site.css`'te; kütüphanenin kendi `canvas.style.*` atamaları CSSOM olduğu için CSP'ye takılmaz. Testte `securitypolicyviolation` olayı 0, oluşturulan Worker 0.

| Dosya | Boyut | gzip |
|---|---|---|
| `assets/vendor/canvas-confetti/confetti.browser.min.js` | 10 829 B | 4 433 B |
| `assets/vendor/canvas-confetti/LICENSE` | 743 B | — |
| `assets/js/celebrate.js` | 3 822 B | 1 741 B |
| **Eklenen JS toplamı** | | **≈ 6,2 KB** (sınır 250 KB) |

Değişen dosyalar: `index.html` (2 script etiketi + og/twitter), `assets/js/booking.js` (+1 satır), `assets/js/tools.js` (+1), `assets/js/site.js` (+2), `assets/js/boot.js` (+1), `assets/css/site.css` (+2), `assets/vendor/KAYNAKLAR.md`.

## Testler (Playwright, Chromium 153, yerel önizleme)

Karşılaştırma için aynı betik kaynak site (`diyetisyen-animasyon-v2`) üzerinde de koşuldu.

### Promta özel testler
| Test | Sonuç |
|---|---|
| Randevu akışı sonunda tuval oluşuyor | **Geçti** — `canvas.mizan-confetti`, 1440×900, `aria-hidden="true"`, `z-index: 260`, `pointer-events: none` |
| Tuval 3 sn içinde temizleniyor | **Geçti** — açık tema 2 500 ms, koyu tema 2 499 ms, 390 px 2 497 ms; sonrasında DOM'da tuval 0 |
| Su hedefinde bir kez tetikleniyor | **Geçti** — 13 bardak; son bardakta 1 patlama (1 993 ms); aynı oturumda boşalt/doldur → 0 yeni |
| Yenilemede tekrar etmiyor | **Geçti** — yenileme sonrası 13/13 dolu, patlama 0; yeniden boşalt/doldur → 0 |
| Hareket azaltmada tetiklenmiyor | **Geçti** — randevu 0, su 0 |
| "Hareketi duraklat" açıkken tetiklenmiyor | **Geçti** — düğme `aria-pressed="true"`; su 0, randevu 0 (yenilemede de duraklatma korunuyor) |
| Ekran okuyucuya ek bir şey okutulmuyor | **Geçti** — yeni canlı bölge/metin yok, odak onay adımında (`[data-step="done"]`) |
| Konsol / CSP / Worker | **Geçti** — hata 0, CSP ihlali 0, Worker 0 |
| Ekran görüntüleri | `_referans/sonuc-konfeti-randevu-light.jpg`, `…-dark.jpg`, `…-390.jpg`, `sonuc-konfeti-su.jpg` (patlamadan 0,26–0,33 sn sonra); kaynak: `kaynak-1440.jpg`, `kaynak-390.jpg`, `kaynak-patlama.jpg` |

### 0.9 protokolü
| # | Test | Sonuç |
|---|---|---|
| 1 | Konsol (ana sayfa, blog, `gunluk-su-ihtiyaci`, KVKK; 1440 ve 390) | **Geçti** — hata 0 |
| 2 | Taşma 1440 / 390 | **Geçti** — 8 sayfa/genişlikte `scrollWidth == innerWidth` |
| 3 | Sözleşme | **Geçti** — yüklemede yalnızca `.servings` ve `[data-intent]` yok; ikisi de çalışma anında oluşuyor (tarif penceresi açılınca / sohbet açılınca 6 adet), kaynakta da aynı. `.cal-day`, `.slot` randevu adımında var |
| 4 | Randevu (demo) | **Geçti** — onay "Randevu talebiniz gönderildi"; `.ics` indiriliyor (`mizan-randevu-MZ-….ics`); Google Takvim bağlantısı var; iptal penceresi açılıyor ve boş gönderimde iki hata; 3. adımda boş formda 4 hata |
| 5 | Araçlar | **Geçti** — 170 cm / 70 kg → 24,2; kalori sonucu var; su bardağı yenilemede kalıyor |
| 6 | Program ve tarifler | **Geçti** — gün ve hedef değişiyor; filtre 9 → 2; tarif penceresi açılıyor; porsiyon 2 → 3 (80 g → 120 g yulaf) |
| 7 | Sohbet | **Geçti** — "ücretler" → ücret listesi; "randevu" → "Yarın, saat 09:00 · Uzm. Dyt. Selin Karaca"; "beni arayın" → ad → telefon → demo yanıtı |
| 8 | Dil ve tema | **Geçti** — TR→EN, sayfa ortasında EN→TR; açık→koyu (`html.dark` de geliyor), yenilemede korunuyor. `?lang=en`'de Türkçe karakterli 13 metin: hepsi yer/kişi/yemek adı (Kadıköy, Türkiye, Zeynep Tunalı, köfte, cacık, kısır); kaynakla aynı |
| 9 | axe | **Makale: geçti** (0 ihlal). **Ana sayfa (açık ve koyu): kaldı (koşullu, kaynaktan gelen)**: 1 ciddi `color-contrast` (2 düğüm), `p[data-i18n="process.quote"]` içinde. Kaydırdıkça vurgulanan alıntının henüz vurgulanmamış kelimeleri (opaklık 0,2) sayfa başındayken ölçülüyor; alıntı görünür alana gelince 0. Kaynak sitede birebir aynı. Tür E gereği dokunulmadı. Ayrıca 1 küçük `aria-allowed-role` (kaynakta da var) |
| 10 | Hareket azaltma | **Geçti** — gizli bölüm 0, sonsuz animasyon 0, yükleyici yok, konfeti yok |
| 11 | JS kapalı | **Geçti** — 13 bölümün hepsi görünür, `data-reveal` opaklığı 0 olan öğe yok |
| 12 | Ekran görüntüleri | `_referans/sonuc-1440.jpg`, `_referans/sonuc-390.jpg` + yukarıdaki konfeti görüntüleri |

## Bilinen sorunlar

- Ana sayfadaki axe `color-contrast` bulgusu (yukarıda, madde 9) kaynak siteden geliyor; bu şablonda değiştirilmedi.
- Koyu temada `--sage-2` rengindeki parçacıklar düşük kontrastlı (dekoratif; bilgi taşımıyor).
