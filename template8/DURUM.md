# DURUM — template8 · AstroWind

- **Tarih:** 28 Eylül 2026
- **Kaynak:** AstroWind — demo https://astrowind.vercel.app · kod https://github.com/arthelokyo/astrowind · **MIT** (© onWidget / Arthelokyo) · `1.0.0-beta.66`, commit `14e1a69` (12.09.2026). Astro 7.3.1 + Tailwind CSS 4.3.3.
- **Tür:** A (Astro projesi derlenir, statik çıktı klasöre konur; sinematik katman kaldırıldı).
- **Canlı adres:** https://sadikbesler.github.io/50-website/template8/
- **Yerel önizleme:** http://localhost:8801/50-website/template8/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template8` · Astro projesi `_kaynak/astro/` · derleme `sh _kaynak/yap.sh` (npm run build → rsync, 0.7)
- **Git'e giren boyut:** ≈ 32,5 MB, 425 dosya (en büyüğü 1,5 MB'lık ekran görüntüsü; `node_modules`, `dist`, `_kaynak/indirilen` dışarıda)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template8`'e çevrildi; ana sayfada `og:title` / `twitter:title` = "Diyetisyen web sitesi · Template 8 (AstroWind)", `og:description` kısa açıklama.
2. AstroWind `_kaynak/astro/`'ya klonlandı, `npm i`; `src/config.yaml` → `site: https://sadikbesler.github.io`, `base: /50-website/template8`, dil `tr`; `astro.config.ts` → `build.format: 'file'`.
3. Referans: demo `/`, `/homes/personal`, `/pricing`, `/about`, `/contact`, `/blog` ve bir makale, 1440 ve 390, açık ve koyu → `_referans/kaynak-*.jpg` (28 görüntü; hareket azaltma açık, AstroWind'in kaydırma animasyonu görüntüyü soldurmasın diye). Ölçümler `_kaynak/test/kaynak-olcum.json`.
4. Ana sayfa `src/pages/index.astro` AstroWind widget'larıyla yeniden yazıldı (eşleme aşağıda). Türkçe metinler özgün sayfalardan çıkarılan sözlükten (`scripts/tr-metinler.mjs`) gelir; her metin `data-i18n` anahtarlı.
5. JS'e bağlı bölümler (araçlar, program, tarifler, randevu, iletişim formu, pencereler, sohbet) diyetisyen-v2'den dilimlenip (`scripts/mizan-parcalar.py`) Content / Contact widget'larının içine kondu; görünümleri `src/assets/styles/mizan.css`'te yalnızca AstroWind tokenlarıyla yazıldı.
6. Blog: 6 makale `src/data/post/*.md` (`scripts/blog-donustur.mjs`), TR ve EN metin aynı dosyada; KVKK `src/pages/kvkk.md` (privacy.md düzeni). Adresler özgünle aynı: `blog/`, `blog/<slug>.html`, `kvkk.html`.
7. Sinematik katman kaldırıldı: GSAP/Lenis, motion.js, premium.css, motion.css, site.css, `#planet-loader`, boot.js gezegen bloğu, `hero.mp4`, `hero-gezegen-ilk.jpg`, `data-reveal` (yerine AstroWind'in kendi `intersect` animasyonu).
8. Tema tek kaynak site.js: `applyTheme` `<html class="dark">` koyar ve `mizan:theme` yayınlar; boot.js ilk boyamadan önce aynı sınıfı koyar. AstroWind'in tema betikleri (ApplyColorMode, `<aw-theme-toggle>`) kaldırıldı; düğme ve simge geçişi AstroWind'in.

### Bölüm eşlemesi (ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | AstroWind |
|---|---|
| S1 üst menü | Header (`#site-header`) + ToggleTheme + ToggleMenu · TR/EN eklendi · "Randevu al" eylemi |
| S2 hero + `#next-slot` | Hero · `hero-gezegen-son.jpg` · kart `content` yuvasında |
| S3 kısa bilgiler | Stats (`.facts`) |
| S4 hizmetler | Features (6 öğe, 2 sütun, Tabler ikonları) |
| S5 mevsim notları | Gallery (7 görsel, 4 sütun, `data-note` sürükleme) |
| S6 yaklaşım | Steps (4 adım + görsel) |
| S7 manifesto | Note (`#manifesto`, yalnızca metin) |
| S8 uzmanlar | Team (3 kişi, `[data-book-staff]`) |
| S9 / S10 / S11 / S13 | Content içinde diyetisyen-v2 işaretlemesi (kart `rounded-lg shadow`, `btn-primary`/`btn-secondary`) |
| S12 ücretler | Pricing (3 plan, orta kart vurgulu) + Features ("Neler dahil" — /pricing sayfasındaki kalıp) |
| S14 blog | BlogLatestPosts (6 yazı) · blog listesi List/ListItem · makale SinglePost + RelatedPosts |
| S15 SSS | FAQs (+ `#faq-schema`, derlemede dolu) |
| S16 afiyet olsun | CallToAction `layout="banner"` (`.sky`) |
| S17 iletişim | Contact (kart içinde diyetisyen-v2 formu) + Features2 (adres / ulaşın / saatler — /contact kalıbı) |
| S18 footer | Footer (`.site-footer`) |
| S19 sohbet | diyetisyen-v2 işaretlemesi, AstroWind tokenları |
| S20 demo şeridi | site.js şeridi, Announcement çubuğunun tokenlarıyla; özgündeki gibi alta sabit |

## Kaynaktan farklar ve nedenleri

1. **Widget'larda küçük uyarlamalar** (hepsi `PARCALAR.md`'de dosya dosya): metin yuvaları `set:html` (data-i18n span'leri için), Header kimliği `#site-header`, Note'a `id`, Team'e randevu bağlantısı, Gallery'de ışık kutusu kapalıyken `<div>`, Content'te görselsiz tam genişlik, Contact'ta özel form yuvası, Features2 açıklaması `<div>`. Görünüm sınıfları değişmedi.
2. **CSP gereği:** AstroWind'in satır içi betikleri/stilleri dışarı alındı — tema betiği → `boot.js`; `<Font>`'un @font-face'i → `assets/css/fonts.css`; CustomStyles → paketlenmiş CSS; küçük bileşen betikleri artık satır içine gömülmüyor; `<Image>` ve tablo sarmalayıcısının `style` nitelikleri kaldırıldı. `<ClientRouter />` (görünüm geçişleri) kaldırıldı: Mizan betikleri her sayfada baştan çalışan klasik betikler ve AstroWind'in kendi notuna göre CSP ile uyumsuz.
3. **Kaldırılanlar:** AstroWind'in "Astro v7" duyuru çubuğu (yerine demo şeridi aynı tokenlarla; üstte değil özgündeki gibi alta sabit — üstte ilk ziyarette sayfayı itip CLS 0,12'ye yol açıyordu), demo sayfaları, kategori/etiket sayfaları (makalelerde kategori düz metin), blog listesindeki Newsletter (sahte form), Analytics / SiteVerification. Testimonials ve Brands kullanılmadı (0.5).
4. **Yuvası olmayan içerik gösterilmedi:** hizmet fotoğrafları/etiketleri/alt satırları (Features ikonlu), uzmanların eğitim-gün-dil listesi ve "Kurucu" rozeti, yaklaşım bölümündeki kurucu alıntısı, manifesto altındaki üç sayı, makalelerdeki içindekiler kutusu ve yazar fotoğrafı, footer'daki "hakkında" paragrafı, şeritler (ribbon).
5. **Koyu tema erişilebilirlik:** AstroWind'in `text-primary` (#0161EF) yazısı koyu zeminde 3,75:1 kalıyor; Team rol satırı, not bağlantıları ve harita bağlantısında AstroWind'in koyu bağlantı tokenı `dark:text-blue-400` kullanıldı. Seçili sekmedeki küçük yazı `text-white/80` yerine `text-white`.
6. **Hero başlığında vurgu rengi yok** (demoda "Astro v7" mor): başlık tek `data-i18n` metni olduğu için dil değişince iç span silinirdi.
7. **Stats:** birimler (yıl, uzman, dk, gün) büyük sayının yanında aynı stilde; `countUp` kapalı (metin dile göre değişiyor).
8. **Blog:** 6 yazı AstroWind ızgarasında 4 + 2; ilgili yazılar 4 (AstroWind varsayılanı; özgünde 3). Tarih AstroWind'in kısa biçiminde ("8 Eyl 2026" / "8 Sept 2026"); okuma süresi özgün metinden ("7 dk okuma"), AstroWind'in hesabı iki dili birden sayacağı için kullanılmadı.
9. **KVKK:** "Yazı tipleri Google Fonts üzerinden yüklenir…" cümlesi (TR/EN) çıkarıldı; bu şablon Inter'i site içinden sunuyor.
10. **Yazı tipi:** Inter, Astro Fonts API ile derlemede indirildi; Türkçe harfler için `latin-ext` alt kümesi eklendi (demo yalnızca `latin`).
11. **Form hata rengi** `red-700` (AstroWind'de hata durumu yok); VKİ ölçeği mavi→yeşil→amber→turuncu (kırmızı yok, yargılayıcı olmayan dil).
12. `sitemap.xml` hreflang'lı olarak Mizan'daki gibi tek dosya (@astrojs/sitemap'in `sitemap-index.xml`'i yerine); RSS korundu.

## CSP

Değişiklik **yok** — bütün sayfalarda diyetisyen-v2 ile birebir aynı `Content-Security-Policy` (`script-src 'self'`, `style-src 'self' https://fonts.googleapis.com`). `'unsafe-inline'` eklenmedi. Derleme çıktısında satır içi betik 0, `<style>` 0, `style=""` niteliği 0 (tarama: `_kaynak/test/protokol.js` öncesi Python kontrolü; JSON-LD veri blokları çalıştırılmaz).

## Eklenen / değişen dosyalar ve boyutlar

| Dosya | Durum | Boyut |
|---|---|---|
| `index.html`, `blog/*.html`, `kvkk.html`, `404.html`, `rss.xml`, `sitemap.xml` | AstroWind ile derlendi | ana sayfa 144 KB |
| `_astro/*.css` | Tailwind 4 + typography + Mizan bileşenleri | 222 KB (gzip 29,6 KB; demo 19,5 KB) |
| `_astro/*.js` | AstroWind bileşen betikleri (menü, kaydırma animasyonu, paylaş, ön yükleme) | toplam gzip 3,4 KB |
| `_astro/fonts/*.woff2`, `assets/css/fonts.css` | Inter latin + latin-ext | 73 + 134 KB |
| `assets/js/*.js` | Mizan betikleri (boot/site/config/i18n yamalı) | gzip ≈ 78 KB (kaynak), derlemede küçültülür |
| `assets/vendor/{astrowind,astro,tailwindcss,inter,tabler-icons}` + `KAYNAKLAR.md` | lisanslar | — |

Şablonun eklediği JS: gzip **3,4 KB**; sitenin JS toplamı 250 KB sınırının çok altında.

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK; 1440/390; açık/koyu) | Geçti | 16 görünümde hata 0 |
| 2 | Taşma 1440 / 390 | Geçti | scrollWidth = innerWidth |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0 (`.servings`, `[data-intent]` çalışma anında); `.cal-day`/`.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor, boş formda 2 hata; boş bilgi adımında 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.500 → 2.580 kcal); filtre 9 → 2; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → en yakın saat; "Beni arayın" → demo yanıtı; sohbetin verdiği blog bağlantısı `blog/<slug>.html` → 200 |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en` (ana sayfa, blog, makale, KVKK) — EN'de Türkçe kalan metin 0; açık↔koyu; yenilemede ikisi de korunuyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, blog, KVKK koyu, takvim + tarif penceresi + sohbet açıkken (açık TR, koyu EN): **ihlal 0** (ilk turda 11 kontrast ihlali vardı, "Kaynaktan farklar" 5) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli/soluk bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür ve opak, 7 not görseli; araç sonuçları / tarif kartları / öğünler JS ile üretildiği için boş (özgünde de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`; widget başına `sonuc-<Widget>(-dark).jpg`; takvim, onay, iptal, boş gün, sohbet, tarif penceresi, mobil menü, demo şeridi; blog/makale/KVKK 1440 ve 390, açık ve koyu |

### Promt 8 kabul testleri

| Test | Sonuç | Not |
|---|---|---|
| Bütün iç bağlantılar 200 (tarayıcı betiği) | Geçti | 67 adres (10 sayfa + CSS/JS/görsel/srcset), kırık 0 |
| Makale kelime sayıları (6 makale) | Geçti | Blok bazlı sayım, metin de harfi harfine aynı — aşağıdaki tablo |
| AstroWind tokenları (kaynak ölçümüyle) | Geçti | gövde 16px / rgb(16,16,16) / -0.4px; h1 60px/700/-3px; h2 36px/700/40px/-1.8px; `btn-primary` rgb(1,97,239), tam yuvarlak, 600; yazı Inter |
| Mobil menü (AstroWind) | Geçti | açılıyor (`aria-expanded=true`), TR/EN görünür, bağlantıya dokununca kapanıyor; açıkken yüzen düğmeler gizli |
| Boş gün durumu | Geçti | saat ilerletilince seçili günde boş durum kutusu |

Makale kelime sayıları (kaynak / sonuç; TR gövde, EN gövde, kaynakça; toplam):

| Makale | TR | EN | Kaynakça | Toplam | h2 · li · tablo hücresi · callout | Başlık kimlikleri |
|---|---|---|---|---|---|---|
| insulin-direnci-beslenme | 435 / 435 | 517 / 517 | 88 / 88 | 1040 / 1040 | 18 · 5 · 0 · 4 aynı | aynı |
| aralikli-oruc-16-8 | 311 / 311 | 389 / 389 | 70 / 70 | 770 / 770 | 14 · 25 · 0 · 2 aynı | aynı |
| gunluk-su-ihtiyaci | 288 / 288 | 334 / 334 | 54 / 54 | 676 / 676 | 12 · 17 · 16 · 0 aynı | aynı |
| akdeniz-tipi-beslenme | 300 / 300 | 347 / 347 | 60 / 60 | 707 / 707 | 12 · 37 · 20 · 2 aynı | aynı |
| protein-ihtiyaci | 330 / 330 | 362 / 362 | 97 / 97 | 789 / 789 | 12 · 12 · 68 · 0 aynı | aynı |
| etiket-okuma-rehberi | 364 / 364 | 423 / 423 | 73 / 73 | 860 / 860 | 12 · 34 · 24 · 2 aynı | aynı |

Başlıklar ve girişler de iki dilde aynı; `strong` / `em` sayıları aynı.

### Lighthouse (mobil, Playwright'ın Chromium'u)

| Sayfa | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
|---|---|---|---|---|
| **Ana sayfa (canlı)** | **93** | 100 | 100 | **100** |
| **Blog listesi (canlı)** | **92** | 100 | 100 | **100** |
| **Makale (canlı)** | **81** | 100 | 100 | **100** |
| **KVKK (canlı)** | **87** | 100 | 100 | **100** |
| Ana sayfa (yerel) | 71 | 100 | 100 | 100 |
| Blog listesi (yerel) | 78 | 100 | 100 | 100 |
| Makale (yerel) | 78 | 100 | 100 | 100 |

Yerel sunucu (`python3 -m http.server`) sıkıştırma yapmıyor; performansı en çok 222 KB'lık CSS'in yavaş 4G benzetiminde sıkıştırılmadan inmesi düşürüyor (TBT 0 ms, CLS 0). Asıl ölçüm canlı adreste (GitHub Pages, gzip) — "Yayın" bölümü; ham değerler `_kaynak/test/lighthouse.json`.

**Karşılaştırma turları** (`kaynak-*` ↔ `sonuc-*`):
- **1. tur (1440 açık/koyu):** hero, özellikler, fiyat, SSS, CTA, footer ölçü ve tipografisi demo ile aynı. Düzeltilenler: Note bandı ile Uzmanlar'ın mavi zemini birleşiyordu (mavi zemin Mevsim notları'na alındı), başlık satır aralığı (`leading-tighter` geri getirildi), makale OG görsel ölçüsü.
- **2. tur (390 açık/koyu, alt sayfalar):** mobil menü açıkken yüzen düğmeler "Randevu al"ı örtüyordu (gizlendi), hero kartı görünürken yüzen düğmeler özgündeki gibi gizleniyor; koyu temada 11 kontrast ihlali giderildi.
- **3. tur (canlı Lighthouse):** ana sayfada CLS 0,121 — ilk ziyarette üst kenara eklenen demo şeridi içeriği itiyordu; şerit alta sabitlendi.

Canlı ölçümler (mobil, yavaş 4G benzetimi): ana sayfa FCP 1,2 s · LCP 3,0 s · TBT 40 ms · CLS 0; makale LCP 3,6 s (kapak görseli). Performans puanı ağ nedeniyle ölçümden ölçüme birkaç puan oynuyor. Ana sayfanın ilk canlı ölçümünde SEO 92 çıktı: `robots-txt` denetimi alan adı kökündeki `sadikbesler.github.io/robots.txt`'yi (bu depoda değil, 404) okurken zaman aşımına uğradı; tekrar ölçümde 100.

## Yayın

- Commit `56499d9` (site) ve `52226a2` (demo şeridi alta sabit, canlı Lighthouse) → `origin/main` (28.09.2026). Canlı adres push'tan yaklaşık 30 sn sonra 200 döndü.
- Canlı kontrol (Playwright): ana sayfa, `blog/`, bir makale, `kvkk.html` ve `?lang=en` → HTTP 200, konsol/CSP hatası 0, başarısız istek 0; Inter yükleniyor, `_astro/` dosyaları sunuluyor (`.nojekyll`), "En yakın uygun randevu" kartı dolu ("Yarın · 09:00" / "Tomorrow · 09:00").

## Bilinen sorunlar / notlar

- **Kesinti notu:** Çalışma sırasında başka bir oturum aynı klasöre dokundu (`public/assets/js` özgünleriyle ezildi, `leading-tighter` sınıfları değiştirildi, bir `extract.cjs` bırakıldı). Hepsi tespit edilip geri alındı; JS yamaları artık `scripts/js-yamalari.py` ile tekrarlanabilir. Kaynak dosyalar bozulmamış AstroWind kopyasıyla dosya dosya karşılaştırıldı; farklar yalnızca `PARCALAR.md`'deki bilinçli uyarlamalar.
- Paylaş düğmelerinin `aria-label`'ları AstroWind'deki gibi İngilizce ("Twitter Share"…); görünür metin değil.
- Gallery 7 görseli 4 sütunda 4 + 3 dizer; mobilde tek sütun (widget davranışı).
- `404.html` GitHub Pages'te yalnızca depo kökündeki 404 kullanıldığı için doğrudan açılınca görünür.
