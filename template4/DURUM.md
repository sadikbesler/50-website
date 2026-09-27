# DURUM — template4 · Flowbite

- **Tarih:** 27 Eylül 2026
- **Kaynak:** Flowbite — https://flowbite.com · https://github.com/themesberg/flowbite · MIT · npm `flowbite@4.0.2` (depo commit `232ebdb`). Ücretsiz bloklar flowbite.com/blocks'tan 27.09.2026'da "Show code" ile alındı.
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı)
- **Teknoloji:** Saf HTML + Tailwind CSS 4.3.3 + Flowbite 4.0.2 (tema `themes/default`, eklenti, JS) + Flowbite Typography 1.0.5 + Flowbite Icons 1.5.0. Font: Inter (Google Fonts).
- **Canlı adres:** https://sadikbesler.github.io/50-website/template4/
- **Yerel önizleme:** http://localhost:8801/50-website/template4/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template4` · git'e giren boyut ≈ 21 MB (`node_modules` ve `_kaynak/indirilen` hariç; 100 MB'ı aşan dosya yok)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template4` yapıldı, `og:title`/`twitter:title` = "Diyetisyen web sitesi · Template 4 (Flowbite)".
2. **Ücretsiz/PRO denetimi:** `_kaynak/test/bloklar-al.js` 11 blok ailesinin 93 bloğunu tek tek sınıflandırdı ("Show code" = ücretsiz, "Unlock the code" = PRO). Promtta adı geçen 11 bloğun hepsi ücretsiz çıktı; kodları "Show code" ile açılan panelden `_kaynak/bloklar/` altına alındı. Ek olarak ücretsiz "Visual image with heading" (hero ızgarası için). **PRO blok yok.** Tablo `_kaynak/PARCALAR.md`.
3. Bileşen belgelerinin örnekleri (navbar, card, carousel, timeline, tabs, range, input, radio, checkbox, list group, buttons, modal, stepper, datepicker, toast, typography, chat bubble, drawer, banner, jumbotron, blockquote) klonlanan depodaki `content/**/*.md` dosyalarından birebir alındı.
4. Referanslar: her blok ve her belgenin ilk örneği (+ promtta adı geçen varyant) açık/koyu `_referans/kaynak-*.jpg`.
5. Sayfalar `_kaynak/sayfalari-kur.js` ile kuruluyor (tekrar çalıştırılabilir). Hizmet kartları, notlar, SSS ve blog kartları özgün HTML'den i18n anahtarlarıyla üretiliyor; makale ve KVKK gövdeleri Flowbite Typography'ye (`format`) çevriliyor.
6. **Flowbite JS yalnızca iki iş için:** üst menünün mobil collapse'ı ve mevsim notları carousel'i (`data-carousel="static"`, otomatik geçiş yok). Sekmeler tools.js/content.js'te, pencereler `<dialog>`, takvim booking.js'te, sohbet chat.js'te kaldı. Accordion kullanılmadı (FAQ bloğu açık liste).
7. **`initFlowbite()` dil değişiminden sonra** `assets/js/flowbite-baglanti.js` içinde çağrılıyor. Flowbite'ın `initCarousels()`'ı her çağrıda düğmelere yeni dinleyici ekleyip eskileri kaldırmadığı için (tıklama başına iki slayt kayıyordu) köprü önce carousel düğmelerini klonluyor ve etkin slaydı koruyor. Test 8 bunu doğruluyor (dil değişiminden sonra "sonraki" tam bir slayt).
8. Koyu tema: Flowbite `dark:` sınıfları + anlamsal tokenların `.dark` değerleri. `boot.js` ilk boyamadan önce, `site.js → applyTheme` her değişimde `<html class="dark">`'ı ayarlıyor ve `mizan:theme` olayını yayınlıyor.

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | Flowbite | Ücretsiz kodu görüldü |
|---|---|---|
| S1 üst menü | Blok *Default header navigation* + Navbar (collapse) | evet |
| S2 hero | Blok *Default hero section* (ızgara: *Visual image with heading*) · `#next-slot` = Card *Default card* | evet |
| S3 kısa bilgiler | Blok *Default feature list* | evet |
| S4 hizmetler | Card *Card with image* × 6 | belge |
| S5 mevsim notları | Carousel *Default slider* (7 görsel, static) | belge |
| S6 yaklaşım | Timeline *Vertical timeline* + Blockquote | belge |
| S7 manifesto | Blok *Heading with description* | evet |
| S8 uzmanlar | Blok *Team member cards* | evet |
| S9 araçlar | Tabs *underline* + Range + Input + Radio *Bordered* | belge |
| S10 program | Tabs *pills* + List group | belge |
| S11 tarifler | Card *Card with image* + Buttons filtre + Modal görünümü | belge |
| S12 ücretler | Blok *Default pricing cards* | evet |
| S13 randevu | Stepper + Radio *Advanced layout* + Input/Checkbox + Datepicker görünümü + onayda Toast *success* | belge |
| S14 blog | Blok *Default blog card* · makaleler: Flowbite Typography | evet |
| S15 SSS | Blok *Default example* | evet |
| S16 "afiyet olsun" | Blok *Heading with CTA button* + Jumbotron arka plan yöntemi (`sofra-2000.webp`) | evet |
| S17 iletişim | Blok *Default contact form* + Card/List group | evet |
| S18 footer | Blok *Sitemap with logo and social media* | evet |
| S19 sohbet | Chat bubble *Default* + Drawer *Default* görünümü | belge |
| S20 demo şeridi | Banner *Default sticky banner* görünümü | belge |

## Kaynaktan farklar ve nedenleri

1. **Tasarım tokenları — iki lehçe:** Promt "primary renk ölçeği, rounded-lg, shadow-sm, Inter" diyor. Ölçülen durum: flowbite.com/blocks hâlâ Tailwind v3 CDN ile bu klasik tokenlarla çiziliyor, ama Flowbite 4 belgeleri anlamsal tokenlara geçmiş (`bg-brand` = blue-700, `rounded-base` = 12 px, `text-heading`, `bg-neutral-*`). Her parça kaynağındaki gibi görünsün diye ikisi birlikte kullanıldı: Flowbite varsayılan teması + bloğun `tailwind.config`'indeki `primary` renkleri `@theme`'de. İkisi de Inter ve aynı mavi (primary-700 = brand).
2. **v3 → v4 sınıf çevirisi (yalnız bloklarda):** Flowbite teması `rounded-lg`'yi 16 px, düz `rounded`'u 8 px yapıyor. Blok ölçüleri korunsun diye `rounded-lg→rounded` (8 px), `rounded→rounded-xs` (4 px), `shadow-sm→shadow-xs`, `tracking-tight→tracking-[-0.025em]`, `flex-shrink-0→shrink-0`; Tailwind'in resmî v3 uyumluluk tabanı (kenar rengi gray-200, düğmede el imleci) eklendi.
3. **Hero:** "Default hero section" ortalanmış ve görselsiz. Promt görseli sağda istediği için aynı öğeler (duyuru hapı, başlık, metin, iki düğme) aynı sayfadaki ücretsiz "Visual image with heading" bloğunun 7+5 ızgarasına kondu, metin sola yaslandı. "Featured in" logoları yerine `#next-slot` kartı. Görsel blok gibi `lg` altında gizli.
4. **Üst menü `xl`'de açılıyor** (blokta `lg`): 9 Türkçe bağlantı + TR/EN + tema + "Randevu al" 1024 px'e sığmıyor. Masaüstünde 7 bağlantı; Örnek program ve SSS yalnız mobil menüde. Kapatma simgesi menü açıkken görünür (blokta ikinci SVG hiç açılmıyor). Menüde bağlantıya dokununca menü kapanıyor (köprü).
5. **Carousel:** Otomatik geçiş kapalı (`static`), hareket azaltmada geçiş animasyonu yok. Not adları slayt köşesinde Badge tokenlarıyla (belgede metin yuvası yok). Özgündeki sürükleme bu şablonda yok. JS kapalıyken slaytlar alt alta görünüyor.
6. **Kart / blok içerik uyarlamaları:** Card with image'a açıklama paragrafı ve etiket rozetleri; Team member cards 3 kişi, sosyal simgeler yerine "randevu al" bağlantısı, eğitim/gün/dil satırları; Default blog card 6 kart, yazar = makalenin byline'ı; pricing düğmeleri `mt-auto` ile hizalı; iletişim bloğuna ad/telefon/konu/KVKK alanları ve altına adres/saat kartları; footer 4 sütun + uyarı satırı + alt boşluk (`pb-24`, yüzen düğmeler sosyal simgeleri örtmesin).
7. **Radio "Advanced layout":** Flowbite gizli girdiyi `hidden` yapıyor (klavyeyle seçilemez). Girdi `sr-only` oldu, `peer-checked` yerine `has-checked` (girdi etiketin içinde), klavye odağında `ring-4 ring-brand-medium`.
8. **Pills tabs:** Etkin hap belgede `py-2.5`, diğerleri `py-3` (2 px kısa); hepsi `py-2.5`.
9. **Chat bubble:** Belgedeki `leading-1.5` v4'te 6 px satır yüksekliği; belgede alt öğeler kendi `text-sm`'ini taşıdığı için sorun olmuyor, chat.js'in `<p>`'leri taşımadığı için satırlar üst üste biniyordu → `.bubble p { text-sm/5 }`. Bot avatarı fotoğraf yerine Avatar "Placeholder initials" (M).
10. **Datepicker görünümü:** Hücreler 2 satır (gün + "15 boş") olduğu için `leading-9` yerine `min-h-11`; "bugün" hücresi koyu temada `text-heading` (datepicker'ın kendi gray-400/gray-600 çifti 2,4:1).
11. **Erişilebilirlik için ton değişiklikleri (axe ciddi ihlal 0 şartı):**
    - Gri bant bölümleri `bg-gray-50 dark:bg-gray-800` yerine Flowbite tokenı `bg-neutral-secondary` (açıkta aynı gray-50, koyuda gray-950): `fg-brand` (blue-500) sekmesi gray-800 üzerinde 3,9:1'di.
    - Blog kartı "Devamını oku" `dark:text-primary-500 → 400` (blok kendi koyu kartında 3,98:1).
    - Uzman kartı randevu bağlantısı `dark:text-gray-400`; özetteki "Seçilmedi" `text-body`; takvim hücresindeki küçük yazıdan `opacity-80` kaldırıldı.
    - VKİ rozetinin metni (tools.js `var(--ink)`) = Badge metin rengi `fg-brand-strong`.
12. **Sohbet kabuğu Drawer görünümünde:** sağdan tam boy açılır, arka plan `bg-dark-backdrop/70` (tıklayınca kapanır). Flowbite drawer JS'i yerine chat.js.
13. **Kullanılmayan dosyalar silindi:** `assets/css/site.css`, `premium.css`, `motion.css`, `assets/js/motion.js`, GSAP/Lenis, `assets/video/hero.mp4`, `hero-gezegen-*.jpg` (≈ 6,5 MB).

## CSP

Değişiklik **yok**. `Content-Security-Policy` meta etiketi 9 sayfanın hepsinde özgünle birebir aynı (Python ile karşılaştırıldı). Flowbite JS ve CSS site içinden (`self`), Inter Google Fonts'tan (zaten izinli). Satır içi `style` niteliği yok; S16 arka planı derlenmiş CSS'te (`bg-[url('../img/sofra-2000.webp')]`).

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut |
|---|---|---|
| `assets/css/tw.css` | yeni (Tailwind 4 + Flowbite teması/eklentisi + Typography + JS öğesi kuralları) | 143 KB (gzip 22,7 KB) |
| `assets/vendor/flowbite/flowbite.min.js` + `LICENSE` | yeni | 131 KB (gzip 29,6 KB) |
| `assets/vendor/{flowbite-icons,flowbite-typography,flowbite-datepicker,tailwindcss}/LICENSE`, `KAYNAKLAR.md` | yeni / yeniden yazıldı | — |
| `assets/js/flowbite-baglanti.js` | yeni (dil sonrası `initFlowbite()`, menü kapatma, drawer arka planı) | 2,1 KB (gzip 1,0 KB) |
| `index.html`, `blog/*.html`, `kvkk.html` | Flowbite işaretlemesiyle yeniden kuruldu | — |
| `assets/js/boot.js` | gezegen yükleyicisi silindi; `dark` sınıfı, tema rengi | küçük yama |
| `assets/js/site.js` | tema senkronu + `mizan:theme`, tema rengi, bildirim metni `[data-toast-text]`'e | 4 satır |
| `assets/js/content.js` | tarif başlığı pencere başlık satırında (`#recipe-title`) | 2 satır |
| `assets/js/i18n.js` | yeni EN anahtarları: hero.imgAlt, notes.rowAria/prev/next, booking.stepsTitle, blog.readMore, post2–6.excerpt, footer.help/assistant, cancel.keep | — |
| `site.webmanifest` | tema/arka plan rengi `#ffffff` | — |

Şablonun eklediği JS: **30,6 KB gzip** (Flowbite + köprü). Önceki sürümün GSAP/Lenis/motion.js yükü kalktı. Sitenin JS toplamı gzip ≈ 109 KB (250 KB sınırının altında).

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti | scrollWidth = innerWidth |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0 (`.servings` ve `[data-intent]` özgünde de çalışma anında üretiliyor; pencere/sohbet açılınca var). `.cal-day`/`.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor, boş formda 2 hata; boş bilgi adımında 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.450 → 2.600 kcal); filtre 9 → 2; pencere açılıyor; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → "Yarın, saat 09:00"; "Beni arayın" → demo yanıtı |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`, EN'de Türkçe kalan metin 0 (özel adlar hariç); açık↔koyu; yenilemede ikisi de korunuyor. Dil değişiminden sonra carousel tek slayt ilerliyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, ayrıca takvim, tarif penceresi ve sohbet açıkken (açık TR, koyu EN): **hiç ihlal yok** (ciddi/kritik 0, toplam 0) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli bölüm 0; carousel geçişi anında |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür, 7 not görseli alt alta; araç sonuçları, tarif kartları ve öğünler JS ile üretildiği için boş (özgünde de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, her blok/bileşen için `sonuc-<ad>(-dark).jpg`; makale, blog, KVKK; takvim, onay (toast), iptal, boş gün, sohbet, mobil menü |
| Ek | Mobil menü (Flowbite collapse) | Geçti | Açılıyor (`aria-expanded=true`), bağlantıya dokununca kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde boş durum kutusu |

**Karşılaştırma turları:** 1. tur (açık, `kaynak-blok-*` / `sonuc-blok-*` yan yana): yerleşim, tipografi ölçeği, renk, köşe ve gölgeler bloklarla aynı; randevu adım göstergesinde "Tarih ve saat"in üç satıra kırılması ve footer'daki sosyal simgelerin yüzen düğmelerin altında kalması düzeltildi. 2. tur (koyu + bileşenler): sohbet balonunda satırların üst üste binmesi (v4 `leading-1.5`) ve koyu temada kapalı "bugün" hücresinin görünmemesi düzeltildi; kontrast düzeltmeleri yukarıdaki 11. maddede.

## Bilinen sorunlar / notlar

- Başlık yapışkan değil (blok gibi); yüzen WhatsApp/sohbet düğmeleri her yerde.
- Hero görseli blok gibi `lg` altında gizli.
- Koyu temada bot balonunun zemini (Flowbite `neutral-secondary-soft`) drawer zeminiyle aynı ton (gray-900); metin okunur, balon çerçevesi belirsiz.
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, cursor.*, loader.*, tag.*) duruyor; zararsız.
- Blok referans görüntüleri flowbite.com/blocks'taki önizleme iframe'lerinden (sayfanın yapışkan menüsü gizlenerek) alındı.
