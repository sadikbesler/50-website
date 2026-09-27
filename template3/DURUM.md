# DURUM — template3 · daisyUI

- **Tarih:** 27 Eylül 2026
- **Kaynak:** daisyUI — https://daisyui.com · https://github.com/saadeghi/daisyui · MIT · npm `daisyui@5.7.46` (depo commit `0f1866e`, 26.09.2026)
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı)
- **Teknoloji:** Tailwind CSS 4.3.3 + daisyUI 5.7.46 eklentisi + @tailwindcss/typography 0.5.20. daisyUI JS getirmez; sitenin kendi JS dosyaları çalışır.
- **Temalar:** açık = daisyUI **emerald**, koyu = daisyUI **forest**. İkisi de `light` / `dark` adlı özel daisyUI temaları olarak tanımlandı; değerler `node_modules/daisyui/theme/emerald.css` ve `forest.css` dosyalarından `_kaynak/tema-uret.js` ile satır satır kopyalanıyor (elle yazılmış renk yok). Tema seçimi daisyUI'nin kendi mekanizmasıyla: `<html data-theme="light|dark">`. `@custom-variant dark` ve `dark` sınıfı kullanılmadı, **site.js hiç değişmedi**.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template3/
- **Yerel önizleme:** http://localhost:8801/50-website/template3/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template3` · git'e giren boyut ≈ 16,8 MB (262 dosya, en büyüğü 1,4 MB)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template3` yapıldı, `og:title`/`twitter:title` = "Diyetisyen web sitesi · Template 3 (daisyUI)".
2. daisyUI deposu `_kaynak/indirilen/daisyui`'ye klonlandı; kullanılan her bileşenin işaretlemesi belge kaynağındaki (`packages/docs/.../components/<ad>/+page.md`) örnek koddan alındı. daisyui.com'daki ilgili örneklerin emerald ve forest görüntüleri `_referans/kaynak-<bileşen>.jpg` / `-forest.jpg`; tema önizlemeleri `kaynak-tema-emerald.jpg`, `kaynak-tema-forest.jpg`.
3. Sayfalar `_kaynak/sayfalari-kur.js` ile kuruluyor (tekrar çalıştırılabilir; hepsi `_kaynak/yap.sh`). Menü, footer, sohbet ve bildirim tek kaynaktan 9 sayfaya giriyor; hizmetler, SSS, blog kartları ve makale içerikleri özgün dosyalardan okunuyor.
4. JS'in ürettiği parçalar doğrudan daisyUI sınıflarıyla üretiliyor (takvim `btn btn-sm`, saatler `btn btn-outline`, `steps`, onay `alert alert-success`, araç sonuçları `stat` + `progress`, günler `tab`, öğünler `list-row` + `badge`, tarifler `card`, sohbet `chat`).
5. Yazı tipi: daisyui.com önizlemelerinde ölçüldüğü gibi gövde sistem yazı tipi (`ui-sans-serif…`), başlıklar **Outfit** (belge sitesindeki `.prose h1–h6 { font-family: var(--font-title) }` kuralı). Outfit Google Fonts'tan (CSP'de zaten izinli).

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | daisyUI bileşeni |
|---|---|
| S1 üst menü | navbar (responsive dropdown) + dropdown + swap (rotate) + join |
| S2 hero + `#next-slot` | hero "with figure" (`hero-mutfak-1200.webp`) + card |
| S3 kısa bilgiler | stat — yatay stats grubu (mobilde dikey) |
| S4 hizmetler | card "image on top" × 6, hizmet fotoğraflarıyla + badge |
| S5 mevsim notları | carousel "snap to start" × 7 (sürükleme site.js) |
| S6 yaklaşım | timeline dikey, simgeli + avatar |
| S7 manifesto | hero "centered" + `bg-neutral` |
| S8 uzmanlar | card + avatar |
| S9 araçlar | tab "tabs-box" + fieldset/input + range + join radyo · sonuçlar stat, VKİ ölçeği **progress** (radial-progress yok) |
| S10 program | tab "tabs-lift" + list + badge |
| S11 tarifler | filter + card + modal (`#recipe-dialog.modal > .modal-box`) |
| S12 ücretler | card + badge `badge-primary` |
| S13 randevu | steps · takvim `btn btn-sm` (seçili `btn-primary`, kapalı `btn-disabled`) · saatler `btn btn-outline` · fieldset/input/select/checkbox · onay `alert alert-success` · loading |
| S14 blog | card `card-side` · makaleler `prose` + daisyUI renkleri |
| S15 SSS | collapse `collapse-arrow` (details) + join |
| S16 "afiyet olsun" | hero "with overlay image" (`sofra-2000.webp`) |
| S17 iletişim | fieldset + input + textarea + checkbox · adres card |
| S18 footer | footer (logo + bağlantı sütunları) + copyright satırı |
| S19 sohbet | chat (`chat-start/chat-end`, `chat-bubble`, `chat-header`, `chat-footer`) · kök sınıf `chat-widget`, `id="chat"` aynı |
| Bildirim / yükleniyor | toast + alert · loading (spinner, dots) |

## Kabul testleri (promta özel)

### Tema renkleri — getComputedStyle karşılaştırması

Ölçüm: bizim sitede `#hizmetler`'deki ilk `.card.bg-base-100` ve sayfadaki ilk `.btn.btn-primary`; referans olarak daisyui.com/components/card sayfasındaki "Card" önizlemesinin kartı ve `btn-primary` düğmesi, `<html data-theme="emerald|forest">` ile (renk geçişi bitince).

| Özellik | Bizim açık tema | daisyUI emerald | Bizim koyu tema | daisyUI forest |
|---|---|---|---|---|
| Kart arka planı | `oklch(1 0 0)` | `oklch(1 0 0)` | `oklch(0.2084 0.008 17.911)` | `oklch(0.2084 0.008 17.911)` |
| Kart metni | `oklch(0.35519 0.032 262.988)` | aynı | `oklch(0.83768 0.001 17.911)` | aynı |
| Primary arka planı | `oklch(0.76662 0.135 153.45)` | aynı | `oklch(0.68628 0.185 148.958)` | aynı |
| Primary metni | `oklch(0.33387 0.04 162.24)` | aynı | `oklch(0 0 0)` | aynı |
| Kart köşesi (`--radius-box`) | 16px | 16px | 16px | 16px |
| Düğme köşesi (`--radius-field`) | 8px | 8px | 32px | 32px |

Sonuç: **Geçti**, altı değerin altısı da iki temada birebir aynı.

### Modal ve collapse klavyeyle — Geçti

- Tarif kartı odaktayken **Enter** pencereyi açar (`:modal`, odak içeride). 25 kez **Tab**'da odak pencere dışındaki bir sayfa öğesine hiç geçmedi. **Esc** kapatır ve odak karta döner. ✕ düğmesi Enter ile kapatır.
- İptal penceresi "Randevu iptali" düğmesinde Enter ile açılıyor, odak içeride.
- SSS collapse: summary odaktayken **Enter** açar, **Space** kapar, içerik görünür. 390 px'te kapalı başlayan randevu özeti Enter ile açılıyor.
- Filtre: başlıktan **Tab** ile gruba girilip **Space** ile "Kahvaltı" seçiliyor (9 → 2 tarif), **→** ile "Ana yemek"e geçiliyor.

## Kaynaktan farklar ve nedenleri

1. **Erişilebilirlik tonları (axe ciddi ihlal 0 şartı):** daisyUI'nin %50–60 saydam yardımcı metinleri emerald'ın beyaz zemininde 2,5–3,5:1 kalıyor. `stat-title`, `stat-desc`, `fieldset-label` %75'e; `label`, seçili olmayan `tab` %80'e; `footer-title` opaklığı 0,6 → 0,8'e çekildi. Kurallar `:where()` ile özgüllüğü 0 olacak biçimde yazıldı (`_kaynak/tw.css`, başta). Renk değeri eklenmedi, yalnız karışım oranı değişti.
2. **`text-primary` metinde kullanılmadı:** emerald yeşili beyaz üstünde yaklaşık 2:1. Stat değerleri bu yüzden örnekteki `text-primary` yerine temel metin renginde. Simgelerde (`stat-figure`, zaman çizelgesi) primary korundu.
3. **Hata metinleri:** `text-error` beyazda 2,8:1 kaldığı için hata metni temel renkte yazılıyor, başına `bg-error` bir nokta konuyor; alan kenarı `input-error`.
4. **Menü:** orta menü `lg` yerine `xl`'de açılıyor (7 Türkçe bağlantı 1024 px'te `navbar-start/end` %50 sütunlarına sığmıyor). Dropdown'ın açılıp kapanması daisyUI'nin `:focus-within` mekanizması yerine site.js'in menü durumuyla (`body.menu-open`) yönetiliyor, çünkü odak düğmede kaldığı sürece daisyUI menüyü açık tutuyor ve site.js'in kapat komutu işlemiyordu. Görünüm aynı (`dropdown-content menu menu-sm rounded-box shadow`).
5. **Swap:** checkbox yerine daisyUI'nin "class name" yöntemi (`swap-active`), sınıf `in-data-[theme=dark]:` ile tema durumundan geliyor. Düğme site.js'in `[data-theme-toggle]` düğmesi olarak kaldı.
6. **Stat:** tek stat yerine 4 statlık grup; küçük ekranda daisyUI'nin "Responsive" örneğindeki gibi dikey, `lg`'de yatay.
7. **Hero görseli:** örnekteki dikey afiş yerine yatay mutfak fotoğrafı (`max-w-sm lg:max-w-md`). `min-h-screen` yerine `min-h-[calc(100svh-4rem)]` (yapışkan menü payı).
8. **tabs-lift:** `.tab-content` sekmelerin kardeşi olmak zorunda, ama günleri content.js her seferinde yeniden çiziyor. Panel sekmelerin hemen altında aynı tokenlarla (`border-base-300`, `rounded-box`, `-mt-px`) ayrı bir kutu olarak duruyor.
9. **Mevsim notları:** carousel öğelerine başlık için `badge badge-neutral` eklendi (örnekte yalnız görsel var, içerik için gerekli). site.js'teki masaüstü sürükleme aynen korundu; kart carousel içinde kaydırıldığı için kenara taşınca kırpılıyor.
10. **Ücretler:** "Pricing Card" düzeni 3 sütunda (başlık `text-2xl`, örnekte `text-3xl`; dar sütuna sığsın diye). Rozetler olgusal metinler ("İlk adım", "Haftalık takip", "12 hafta"); "En popüler" gibi doğrulanamayan bir ifade kullanılmadı (0.5).
11. **"afiyet olsun" bandı:** örnekteki `style="background-image"` CSP'nin satır içi stil yasağı yüzünden Tailwind sınıfı (`bg-[url(../img/sofra-2000.webp)]`). Görsel CSS arka planı olduğu için `sky.alt` metni kullanılmıyor (süsleme görseli).
12. **Footer:** örnekteki `<aside>` öğeleri `<div>` oldu (adsız ikinci "complementary" landmark, axe `landmark-unique`). Logo yuvasında sitenin favicon'u.
13. **Sınıf çakışmaları:** sohbet kökü `chat` → `chat-widget`; yüzen düğmeler `fab` → `fab-btn` (daisyUI 5'te `.fab` bileşeni var); su bardakları `glass` → `water-glass` (daisyUI'de `.glass` cam efekti var).
14. **Modal:** kapatma düğmesi `form method="dialog"` yerine `data-close` (site.js'in mevcut kapatma mantığı). Dışarı tıklama ile kapanma da site.js'ten.
15. **`meta theme-color`:** site.js değişmesin diye tarayıcı çubuğu rengi özgün değerlerde kaldı (`#1E231D` / `#0B0C0A`). Yalnız mobil tarayıcı çubuğunu etkiler.
16. **Silinen dosyalar:** `assets/video/hero.mp4` ve `hero-gezegen-*.jpg` artık hiçbir yerde kullanılmadığı için silindi (6,7 MB).

## CSP

Değişiklik **yok**. `Content-Security-Policy` meta etiketi ana sayfa, KVKK ve makale sayfalarında özgün dosyayla karşılaştırıldı, birebir aynı. Outfit, zaten izinli olan `fonts.googleapis.com` / `fonts.gstatic.com` üzerinden geliyor. Satır içi `style` niteliği kullanılmadı.

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut / not |
|---|---|---|
| `assets/css/tw.css` | yeni (Tailwind + daisyUI + typography + işlevsel kurallar) | 217 KB (gzip 31 KB) |
| `assets/vendor/{daisyui,tailwindcss,tailwindcss-typography,heroicons}/LICENSE`, `KAYNAKLAR.md` | yeni / yeniden yazıldı | — |
| `index.html`, `blog/*.html`, `kvkk.html` | daisyUI işaretlemesiyle yeniden kuruldu | — |
| `assets/js/site.js` | **değişmedi** | — |
| `assets/js/boot.js` | gezegen yükleyicisi bloğu silindi | — |
| `assets/js/tools.js` | sonuçlar `stat`, VKİ ölçeği ve makrolar `progress`, bardaklar `btn` | hesaplamalar aynı |
| `assets/js/booking.js` | takvim/saat sınıfları, `steps` durumu, onay `alert-success`, düğme sınıfları | akış aynı |
| `assets/js/content.js` | gün `tab`, öğün `list-row` + `badge`, makro `progress`, tarif `card`, filtre radyolarına `change` dinleyicisi | — |
| `assets/js/chat.js` | mesajlar daisyUI `chat` yapısı, "Siz/You" başlığı, `loading-dots` | yanıt çekirdeği aynı |
| `assets/js/i18n.js` | 14 yeni EN anahtarı (hero.imgAlt, notes.rowAria, process/booking.stepsTitle, plan1–3.badge, post2–6.excerpt, footer.assistant, footer.ui) | — |
| `assets/css/site.css`, `premium.css`, `motion.css`, `assets/js/motion.js`, GSAP/Lenis, `assets/video/`, `hero-gezegen-*.jpg` | silindi | — |

Şablonun eklediği JS: **0 KB** (daisyUI JS getirmiyor). Sitenin JS toplamı gzip ≈ 77 KB (GSAP/Lenis/motion.js kalktı).

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 | Geçti | 4 sayfa × 2 genişlik × TR/EN, hepsinde `scrollWidth = innerWidth` |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0. `.servings` ve `[data-intent]` özgün sitede de çalışma anında üretiliyor; pencere/sohbet açılınca var. `.cal-day.btn.btn-sm`, seçili `btn-primary`, `btn-disabled` ve `.slot.btn.btn-outline` doğrulandı |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `alert-success`, `MZ-…`, dört adım da `step-primary`. Gönderimde `loading-spinner` görünüyor. `.ics` indirildi, Google Takvim bağlantısı var. İptal penceresi açılıyor, boş formda 2 hata; boş adım-3 formunda 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; ölçek `progress`, radial-progress yok. Kalori 1.730 kcal. 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.450 → 2.600 kcal); filtre 9 → 2 → 9; pencere açılıyor; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → "Yarın, saat 09:00"; "Beni arayın" → demo yanıtı. `chat-start`/`chat-end`/`chat-header`/`chat-footer` var, kök sınıf `chat-widget` |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`; EN'de Türkçe kalan metin 0 (radyo `aria-label` metinleri dahil). Açık↔koyu; koyu temada swap güneşi gösteriyor. Yenilemede ikisi de korunuyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | 14 durum: ana sayfa açık/koyu, makale açık/koyu, blog listesi, KVKK koyu; ayrıca açık TR ve koyu EN'de takvim, tarif penceresi, su aracı ve sohbet açıkken. **Hiç ihlal yok** (ciddi/kritik 0, toplam 0) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür, tema açık. Araç sonuçları, tarifler ve öğünler JS ile üretildiği için boş (özgün sitede de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, her bileşen için `sonuc-<bileşen>(-dark).jpg`; takvim, modal, iptal, toast, sohbet, demo şeridi, mobil menü, boş gün, blog/makale/KVKK |
| Ek | Mobil menü (dropdown) | Geçti | Açılıyor (`aria-expanded=true`, `inert` kalkıyor); düğmeyle, Esc ile ve bağlantıya tıklayınca kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde boş durum kutusu |

**Karşılaştırma turları:**
- **1. tur (açık, 1440 px):** `base-200` zeminde dolgusu görünmeyen ikincil düğmeler (hero ikinci CTA, not bağlantıları, "Tüm yazılar", hedef seçimi) `btn-outline` yapıldı. Footer copyright satırı `.footer > *` grid'i yüzünden kırılıyordu; daisyUI "Footer with copyright text" yapısına geçildi. İşlevsel CSS'in `@layer components`'ta daisyUI'ye yenildiği görüldü (düğme içi yükleniyor simgesi hep görünüyordu); `@layer utilities`'e taşındı.
- **2. tur (koyu/forest, 390 px ve bileşen çiftleri):** footer zemini örnekteki gibi `bg-base-200` yapıldı. tabs-lift, chat, steps, takvim ve toast forest görüntüleriyle aynı tokenlarda. Mobilde timeline `timeline-compact`, hedef seçimi dikey `join`.

Test notu: modal, sohbet ve dropdown daisyUI'de 0,1–0,3 sn'lik geçişlerle kapanıp açılıyor. Test bu geçişlerin bitmesini bekliyor; beklemeden alınan ölçümler yarı saydam ara durumu yakaladığı için ilk koşuda yanlış "kaldı" vermişti.

## Yayın

- Commit `517efa4` → `origin/main` (27.09.2026). Canlı adres push'tan yaklaşık 30 sn sonra 200 döndü.
- Canlı kontrol (Playwright, `_kaynak/test/canli.js`, koyu tema): ana sayfa, `blog/`, bir makale ve `kvkk.html` → HTTP 200, konsol/CSP hatası 0, Outfit yüklü, kart zemini forest `oklch(0.2084 0.008 17.911)`, "En yakın uygun randevu" kartı dolu ("Yarın · 09:00").

## Bilinen sorunlar / notlar

- `tw.css` daisyUI'nin bütün bileşenlerini içeriyor (217 KB, gzip 31 KB). İstenirse `@plugin "daisyui" { include: … }` ile kullanılanlara indirilebilir.
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, loader.*, tag.*) duruyor; zararsız.
- Filtre (daisyUI davranışı): hiçbir kategori seçili değilken "Tümü" sıfırlama düğmesi gizli. Klavyeyle gruba girildiğinde odak ilk kategoriye düşüyor, bir kategori seçilince "×" görünüyor.
