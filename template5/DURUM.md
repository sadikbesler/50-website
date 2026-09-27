# DURUM — template5 · Landwind

- **Tarih:** 27 Eylül 2026
- **Kaynak:** Landwind — demo https://demo.themesberg.com/landwind/ · kod https://github.com/themesberg/landwind · MIT · commit `f8be851` (20.02.2023). Teknoloji depodaki gibi: Tailwind CSS **3.4.17** + Flowbite **1.4.7** (eklenti + JS). Landwind'de olmayan bölümler için Flowbite belgeleri **v2.5.2** (MIT, Tailwind v3 sınıflı son sürüm) ve Flowbite Icons 1.5.0.
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı)
- **Font:** Landwind özel font yüklemez → Tailwind varsayılan sans. Mizan'ın Google Fonts bağlantıları (ve preconnect'leri) kaldırıldı.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template5/
- **Yerel önizleme:** http://localhost:8801/50-website/template5/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template5` · git'e giren boyut ≈ 23 MB (`node_modules` ve `_kaynak/indirilen` hariç; 100 MB'ı aşan dosya yok)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template5` yapıldı; `og:title` / `twitter:title` = "Diyetisyen web sitesi · Template 5 (Landwind)", açıklama güncellendi.
2. Landwind `git clone --depth 1` ile `_kaynak/indirilen/landwind`'e alındı; `LICENSE` → `assets/vendor/landwind/`. `_kaynak` içinde `npm i -D tailwindcss@3.4.17 flowbite@1.4.7`. `tailwind.config.js` depodan kopyalandı; primary ölçeği (#eff6ff … #1e3a8a) aynen; yalnızca content yolları (0.7 + kullanılan `assets/vendor/flowbite/flowbite.js`), `darkMode: 'class'` ve `require('flowbite/plugin')`. Flowbite JS: `node_modules/flowbite/dist/flowbite.js` → `assets/vendor/flowbite/`.
3. Referans: demo 1440 ve 390'da, açık ve koyu (`dark` sınıfı) tam sayfa + her blok ayrı: `_referans/kaynak-*.jpg`; blok yükseklikleri ve yazı boyutları `_kaynak/test/kaynak-olcu.json` (`test/referans.js`).
4. Sayfalar `_kaynak/sayfalari-kur.js` ile kuruluyor (tekrar çalıştırılabilir): Landwind blokları `_kaynak/sayfa/*.html` şablonlarında; hizmet/adım/not/uzman/SSS/ücret/blog içerikleri özgün HTML'den i18n anahtarlarıyla üretiliyor; Landwind SVG'leri klonlanan `index.html`'den, Flowbite belge örnekleri `_kaynak/bilesenler/`'den kopyalanıyor. Ücret ve süreler `config.js`'ten doğrulanıyor. Ardından `npx tailwindcss -i tw.css -o ../assets/css/tw.css --minify`.
5. **Landwind blok sırası korundu:** header → hero → (logo bulutu kaldırıldı) → özellik bloğu (S4 hizmetler + S6 yaklaşım) → istatistik (S3) → alıntı (Selin Karaca) → … → fiyat (S12) → … → SSS (S15) → CTA → … → footer (S18). Ek bölümler Landwind kalıbıyla promttaki sıraya kondu: S7 yöntem, S5 notlar, **S8 uzmanlar, S9 araçlar** (fiyattan önce), **S13 randevu** (fiyattan hemen sonra), **S11 tarifler, S10 program** (SSS'den önce), CTA, **S14 blog**, S16 "afiyet olsun", **S17 iletişim** (CTA'dan sonra). Bantlar beyaz / gri-50 sırasıyla.
6. **Flowbite JS yalnızca iki iş için:** üst menünün mobil collapse'ı ve SSS accordion'u (Landwind'deki `data-accordion` aynen). Sekmeler tools.js/content.js'te, pencereler `<dialog>`, takvim booking.js'te, sohbet chat.js'te. Köprü `assets/js/flowbite-baglanti.js`: mobil menüde bağlantıya dokununca menüyü kapatır (Flowbite 1.4.7 örnekleri dışarı açmadığı için tetikleyiciye tıklayarak), sohbet arka planına tıklayınca sohbeti kapatır. Flowbite 1.x dinleyicileri öğelere bağlı ve dil değişimi yalnız metin düğümlerini değiştirdiği için yeniden başlatma gerekmiyor (test 8 doğruluyor).
7. **Sabit başlık:** Landwind nav'ı `fixed w-full`; hero'nun kendi `pt-20 lg:pt-28` boşluğu korundu, alt sayfaların ilk bölümüne `pt-24 lg:pt-28` eklendi; derin bağlantılar için `[id] { scroll-margin-top: 5rem }`.
8. Koyu tema: Landwind/Flowbite `dark:` sınıfları; `boot.js` ilk boyamadan önce, `site.js → applyTheme` her değişimde `<html class="dark">` koyar ve `mizan:theme` olayını yayınlar.
9. Landwind'e özgü bağlantılar ("View on GitHub", "Get Figma file", GitHub yıldız düğmesi ve `buttons.github.io` betiği, themesberg indirme bağlantısı, "Built with Flowbite and Tailwind CSS" telif bağlantıları) kaldırıldı.

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | Kaynak |
|---|---|
| S1 üst menü | Landwind header nav (logo = favicon + "Mizan", "Download" → "Randevu al", TR/EN + tema düğmesi) |
| S2 hero + `#next-slot` | Landwind hero (hero.png yuvasında `hero-gezegen-son.jpg`) + Flowbite card tokenları |
| — | Landwind logo bulutu → **kaldırıldı** (sahte logolar, 0.5) |
| S4 hizmetler | Landwind özellik satırı 1 (görsel `hizmet-kilo-1200.webp`, 6 maddelik onay listesi, her maddede `data-book-*` bağlantısı) |
| S6 yaklaşım | Landwind özellik satırı 2 (görsel `surec-mutfak-1200.webp`, 4 adım) |
| S3 kısa bilgiler | Landwind istatistik bloğu ("Moda, Kadıköy" purple-600, 12 yıl / 3 uzman / 60 dk / 7 gün) |
| Alıntı | Landwind figure/blockquote → Uzm. Dyt. Selin Karaca'nın yaklaşım alıntısı (danışan yorumu değil) |
| S7 yöntem | Landwind ortalanmış başlık kalıbı |
| S5 notlar | Flowbite gallery |
| S8 uzmanlar | Flowbite card "Card with image" |
| S9 araçlar | Flowbite tabs underline + range + input + radio + card |
| S12 ücretler | Landwind fiyat bloğu (İlk görüşme / Kontrol / Online; config.js) + paketler, kurumsal satır, dahil/değil listesi |
| S13 randevu | Flowbite stepper + radio advanced/bordered + input + checkbox + list-group + toast (onay) + datepicker 1.4.7 görünümü |
| S11 tarifler | Flowbite card + buttons filtre + modal görünümü |
| S10 program | Flowbite pills tabs + timeline + card + progress |
| S15 SSS | Landwind accordion (Flowbite `data-accordion`), 10 soru, FAQPage JSON-LD korunuyor |
| CTA | Landwind CTA → "İlk görüşmenizi bugün planlayın" (#randevu) |
| S14 blog | Flowbite card × 6 + `blog/index.html` + 6 makale |
| S16 "afiyet olsun" | Landwind özellik satırı kalıbı + `sofra` görseli |
| S17 iletişim | Flowbite input/select/textarea/checkbox + card + list-group |
| S18 footer | Landwind footer (5 sütun, hr, logo, telif, sosyal) |
| S19 sohbet | Flowbite drawer + chat bubble + avatar |
| S20 demo şeridi | Flowbite banner "Bottom banner" |

## Kaynaktan farklar ve nedenleri

1. **Logo bulutu kaldırıldı** (airbnb, Google, Microsoft, Spotify, Mailchimp, Mashable): sahte marka logoları, kurallar 0.5.
2. **Vurgu rengi purple, koyu temada küçük metin purple-400:** Landwind `dark:text-purple-500` kullanıyor; gray-900/800 zeminde 4,5:1'in altında kaldığı için etiket, bağlantı ve rakam simgelerinde koyu temada `purple-400` (açık temada kaynaktaki gibi purple-600). Flowbite belge örneklerindeki blue, Flowbite'ın "Purple" varyantına çevrildi.
3. **Hero:** `#next-slot` kartı (promt gereği) hero'yu uzatıyor (390'da +186 px); hero görseli Landwind gibi `lg` altında gizli; Landwind'in GitHub (Font Awesome Pro, ticari lisans) ve Figma simgeleri yerine Flowbite Icons.
4. **Özellik bloğu:** onay listeleri 3/5 madde yerine 6 hizmet ve 4 adım; hizmetin "tek satırlık açıklaması" etiketleri (ör. "Kilo verme · Kilo koruma · Duygusal yeme"). Özgündeki uzun hizmet cümleleri (s1–s6.text) bu düzende gösterilmiyor. Liste altındaki tekrar paragrafı kullanılmadı.
5. **İstatistik bloğu:** başlık Türkçede tek satıra sığıyor (Landwind'de iki satır) → blok 8–10 % kısa.
6. **Fiyat bloğu:** Landwind kartında 5 madde, bizde 4 → kartlar kısa. Altına özgün paketler (5.400 / 14.900 TL), kurumsal satır ve dahil/değil listesi eklendi (sohbet asistanı bu fiyatları söylediği için sayfadan kaybolmamalı).
7. **SSS:** 4 yerine 10 soru, "Asistana sorun / WhatsApp" satırı ve üst dolgu (öncesinde gri bant var) → blok yaklaşık iki katı.
8. **Footer:** sağlık uyarısı ve Asteria imzası ek satır (1440'ta +92 px); telif satırındaki KVKK bağlantısının altı çizili (axe `link-in-text-block`; Landwind'de yalnız renkle ayrışıyor).
9. **Header:** `z-40` eklendi (Landwind'de yok; kaydırılan kartlar başlığın üstüne çıkmasın); kapat simgesi menü açıkken görünüyor (Landwind'de ikinci SVG hiç görünmüyor); TR/EN + tema sm altında mobil menünün içinde.
10. **Demo şeridi altta** (Flowbite "Bottom banner"): üstte olsaydı sabit başlığın altında kalırdı.
11. **Tailwind v3 preflight düzeltmesi:** `[hidden] { display:none !important }` — v3'te `grid`/`flex` yardımcıları `hidden` niteliğini eziyordu (araç sekmelerinin üçü birden görünüyordu).
12. **Radio "Advanced layout":** Flowbite gizli girdiyi `hidden` yapıyor (klavyeyle seçilemez); girdi etiketin içinde `sr-only`, `peer-checked` → `has-[:checked]`, klavye odağında halka.
13. **Kontrast düzeltmeleri (axe):** modal ve koyu giriş kutularında gri-400 → gri-300; demo şeridi koyu metni gray-300.
14. **Kullanılmayan dosyalar silindi:** `site.css`, `premium.css`, `motion.css`, `motion.js`, GSAP/Lenis, `assets/video/hero.mp4`, `hero-gezegen-ilk.jpg`, `hero-mutfak-*.webp`, kullanılmayan 5 hizmet görseli (≈ 0,9 MB + video).

### Kabul ölçütü: blok yüksekliği ve tipografi (±%5) — `_kaynak/test/olcu.js`, ham çıktı `_kaynak/test/olcu-sonuc.json`

Tipografi ölçeği **18/18 ölçümde birebir** (fark 0). Blok yüksekliği **9/18 ölçümde ±%5 içinde**; dışında kalanların hepsi içerik miktarından (madde/soru sayısı, promtun istediği ek kart), düzen ya da boşluk farkından değil. "fiyat" satırı Landwind'in kendi bloğuna denk gelen kısmı (başlık + üç kart) ölçer; paketler ve dahil/değil listesiyle bölümün tamamı parantezde.

| Genişlik | Blok | Kaynak (px) | Sonuç (px) | Fark | ±%5 | Tipografi (kaynak→sonuç, px) | Neden |
|---|---|---|---|---|---|---|---|
| 1440 | header | 62 | 60 | −3,2% | evet | — | Star düğmesi (mt-2) yok |
| 1440 | hero | 583 | 608 | +4,3% | evet | h1 60→60, p 20→20 | |
| 1440 | özellik | 1162 | 1342 | +15,5% | hayır | h2 30→30, p 20→20 | 6 hizmet + 4 açıklamalı adım |
| 1440 | istatistik | 528 | 485 | −8,1% | hayır | h2 30→30, h3 24→24, p 18→18 | Başlık tek satır |
| 1440 | alıntı | 396 | 396 | 0% | evet | p 24→24 | |
| 1440 | fiyat | 886 | 846 (bölüm 1807) | −4,5% | evet | h2 30→30, h3 24→24, p 20→20 | |
| 1440 | SSS | 569 | 1169 | +105,4% | hayır | h2 30→30, h3 16→16, p 16→16 | 10 soru, yardım satırı, üst dolgu |
| 1440 | CTA | 258 | 258 | 0% | evet | h2 30→30, p 18→18 | |
| 1440 | footer | 513 | 605 | +17,9% | hayır | h3 14→14 | Sağlık uyarısı + imza satırı |
| 390 | header | 60 | 60 | 0% | evet | — | |
| 390 | hero | 428 | 614 | +43,5% | hayır | h1 36→36, p 16→16 | `#next-slot` kartı |
| 390 | özellik | 1042 | 1258 | +20,7% | hayır | h2 30→30, p 16→16 | 6 hizmet + 4 adım |
| 390 | istatistik | 1037 | 929 | −10,4% | hayır | h2 30→30, h3 24→24, p 18→18 | Kısa başlık ve metin |
| 390 | alıntı | 312 | 312 | 0% | evet | p 20→20 | |
| 390 | fiyat | 1862 | 1706 (bölüm 3631) | −8,4% | hayır | h2 30→30, h3 24→24, p 16→16 | Kart başına 4 madde (Landwind 5) |
| 390 | SSS | 629 | 1273 | +102,4% | hayır | h2 30→30, h3 16→16, p 16→16 | 10 soru |
| 390 | CTA | 214 | 227 | +6,1% | hayır | h2 30→30, p 16→16 | Metin bir satır fazla kırılıyor |
| 390 | footer | 905 | 949 | +4,9% | evet | h3 14→14 | |

**Karşılaştırma turları:** 1. tur (açık 1440/390, tam sayfa): araç sekmelerinin üçünün birden görünmesi ve randevudaki boş onay kutusu (`[hidden]` sorunu), uzman seçim kartlarında adın sağa yaslanması, footer'da e-postanın bölünmesi düzeltildi. 2. tur (blok blok `kaynak-blok-*` / `sonuc-blok-*`, açık/koyu): CTA düğmesine eklenmiş `inline-block` kaldırıldı (+24 px, Landwind'de bağlantı satır içi), CTA metni kısaltıldı (1440'ta 282 → 258 px, birebir), koyu temada seçili radyo kartına mor kenarlık, KVKK bağlantısı ve birim etiketlerinin kontrastı.

## CSP

Değişiklik **yok**. `Content-Security-Policy` meta etiketi 9 sayfanın hepsinde özgünle birebir aynı (Python ile karşılaştırıldı). Flowbite JS ve CSS site içinden (`self`); Google Fonts artık yüklenmiyor (CSP'deki izin satırı dokunulmadan duruyor). Satır içi `style` niteliği yok.

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut |
|---|---|---|
| `assets/css/tw.css` | yeni (Tailwind 3.4.17 + Flowbite 1.4.7 eklentisi + JS öğeleri için bileşen kuralları) | 122 KB (gzip 16,0 KB) |
| `assets/vendor/flowbite/flowbite.js` + `LICENSE.md` | yeni (1.4.7, promttaki gibi `dist/flowbite.js`) | 124 KB (gzip 23,8 KB) |
| `assets/js/flowbite-baglanti.js` | yeni (menü kapatma, sohbet arka planı) | 1,3 KB (gzip 0,7 KB) |
| `assets/vendor/{landwind,tailwindcss,flowbite-icons}/LICENSE`, `KAYNAKLAR.md` | yeni / yeniden yazıldı | — |
| `index.html`, `blog/*.html`, `kvkk.html` | Landwind işaretlemesiyle yeniden kuruldu | — |
| `assets/js/boot.js` | gezegen yükleyicisi silindi; `dark` sınıfı; tema rengi | küçük yama |
| `assets/js/site.js` | tema senkronu + `mizan:theme`, tema rengi, bildirim metni `[data-toast-text]`'e | 4 satır |
| `assets/js/content.js` | tarif başlığı modal başlık satırında (`#recipe-title`) | 2 satır |
| `assets/js/i18n.js` | yeni EN anahtarları: facts.place/title/link1, quote.aria, price.n.*, pricing.packages, booking.stepsTitle, cta.title/text, blog.readMore, post2–6.excerpt, footer.help/assistant/contact/lang, cancel.keep | — |
| `site.webmanifest` | tema/arka plan rengi `#ffffff` | — |

Şablonun eklediği JS: **24,5 KB gzip** (Flowbite + köprü). Sitenin JS toplamı gzip ≈ 98 KB (250 KB sınırının altında).

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti | scrollWidth = innerWidth |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0 (`.servings` ve `[data-intent]` özgünde de çalışma anında üretiliyor; pencere/sohbet açılınca var). `.cal-day` / `.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor, boş formda 2 hata; boş bilgi adımında 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.450 → 2.600 kcal); filtre 9 → 2; pencere açılıyor; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → "Yarın, saat 09:00"; "Beni arayın" → demo yanıtı |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`, EN'de Türkçe kalan metin 0 (özel adlar hariç); açık↔koyu; yenilemede ikisi de korunuyor; dil değişiminden sonra SSS akordeonu çalışıyor (2. soru açılıyor, 1. kapanıyor) |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, ayrıca takvim, tarif penceresi ve sohbet açıkken (açık TR, koyu EN): **hiç ihlal yok** (ciddi/kritik 0, toplam 0) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür; mobil menü ve 10 SSS cevabının hepsi açık; 7 not görseli; araç sonuçları, tarif kartları ve öğünler JS ile üretildiği için boş (özgünde de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, her Landwind bloğu için `sonuc-blok-*`, bileşenler (gallery, card, tabs, stepper, datepicker, modal, toast, chat drawer, banner, mobil menü), blog / makale / KVKK |
| Ek | Mobil menü (Flowbite collapse) | Geçti | Açılıyor (`aria-expanded=true`), bağlantıya dokununca kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde boş durum kutusu |
| Kabul | Blok yüksekliği / tipografi ±%5 | Kısmen | Tipografi 18/18; yükseklik 9/18 — kalan 9 ölçüm içerik miktarından (tablo yukarıda) |

## Yayın

- Commit `cc330ed` → `origin/main` (27.09.2026). Canlı adres push'tan yaklaşık 30 sn sonra 200 döndü.
- Canlı kontrol (Playwright): ana sayfa, `blog/`, bir makale ve `kvkk.html` → HTTP 200, konsol/CSP hatası 0, Flowbite 1.4.7 yüklü (`Accordion`, `Collapse`), derlenmiş CSS uygulanmış, "En yakın uygun randevu" kartı dolu ("Yarın · 09:00").

## Bilinen sorunlar / notlar

- Blok yüksekliği ölçütü içerik yoğun bloklarda (özellik, SSS, hero'da `#next-slot`) sağlanmıyor; düzen, boşluk ve tipografi Landwind ile aynı.
- Hizmetlerin uzun açıklama cümleleri ana sayfada gösterilmiyor (Landwind onay listesinde tek satırlık açıklama istendi).
- Range tutamacı Flowbite 1.4.7 eklentisinin varsayılanı olan mavi (Landwind demosu da böyle); geri kalan vurgu purple.
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, cursor.*, loader.*, tag.*) duruyor; zararsız.
