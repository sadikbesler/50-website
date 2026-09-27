# Template 1: Preline UI

- **Tarih:** 27 Eylül 2026
- **Kaynak:** Preline UI — https://preline.co · https://github.com/htmlstreamofficial/preline
  - npm `preline@5.0.0` (21.08.2026; sitenin "v5.0" sürümüyle aynı). Blok ve bileşen kodları preline.co'dan 26.09.2026'da alındı.
  - **Lisans:** MIT + Preline UI Fair Use License (ticari kullanım serbest; Preline'a rakip UI kütüphanesi yapılamaz). Dosya: `assets/vendor/preline/LICENSE`.
  - Yalnızca **FREE** etiketli bloklar; PRO blok yok (kanıt: `_kaynak/bloklar/manifest.json`, yöntem: `_kaynak/PARCALAR.md`).
- **Tür:** T (tasarım baştan). HTML + Tailwind CSS v4.3.3 + Preline JS.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template1/
- **Yerel önizleme:** http://localhost:8801/50-website/template1/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template1`

## Ne yapıldı

Site, Preline'ın 16 ücretsiz bloğu ve açık kaynak bileşenleriyle baştan kuruldu. Randevu, araçlar, program, tarifler, sohbet, TR/EN ve açık/koyu tema aynen çalışıyor. Sinematik katman (GSAP, ScrollTrigger, Flip, SplitText, CustomEase, Lenis, `motion.js`, `premium.css`, `motion.css`, gezegen yükleyicisi, hero videosu) kaldırıldı.

| Bölüm | Preline kaynağı |
|---|---|
| S1 üst menü | Website Header with Offcanvas Menu (FREE) · offcanvas = Preline overlay JS |
| S2 hero + `#next-slot` | Full-Bleed Image Hero with Text Overlay (FREE) + Preline kartı |
| S3 kısa bilgiler | Stat Card Group (FREE) |
| S4 hizmetler | Icon Blocks with Hover Background (FREE) · ikonlar Lucide |
| S5 mevsim notları | Masonry Image Grid with Four Columns (FREE) · sürükleme site.js'te çalışıyor |
| S6 yaklaşım | Feature Steps Section (FREE) |
| S7 manifesto | Center-Aligned Dark Hero (FREE), yalnızca 4 cümle |
| S8 uzmanlar | Team Profile Card Grid with Bios and Social Links (FREE) |
| S9 araçlar | Tabs (underline, JS'siz) + Range Slider + Input/Select/Radio cards + Stat Card sonuç kutusu |
| S10 program | Tabs "pill" görünümleri + Preline kartları + Progress |
| S11 tarifler | Article Card Grid with Hover Zoom Images (FREE) + soft Buttons + Modal görünümlü `<dialog>` |
| S12 ücretler | Pricing Card Grid (FREE) · 3 görüşme türü, fiyatlar config.js'ten |
| S13 randevu | Stepper + Datepicker görünümü (JS'leri kullanılmadı; takvimi booking.js çiziyor) |
| S14 blog + 6 makale | Image Post Card Grid with Category Meta (FREE) · Centered Editorial Article Page with Sticky Share Bar (FREE) |
| S15 SSS | Centered FAQ Accordion (FREE) · Preline accordion JS |
| S16 "afiyet olsun" | Feature Cards over Background Image (FREE) · `sofra-2000.webp` |
| S17 iletişim | Split Contact Page with Contact Details (FREE) |
| S18 footer | Five-Column Footer with Language Dropdown (FREE) · Preline dropdown JS, dil site.js'ten |
| S19 sohbet | Chat Bubbles + card/input/button kabuğu |
| kvkk.html | makale bloğunun tipografisi |

Ayrıntılı eşleme ve her blokta değiştirilenler: `_kaynak/PARCALAR.md`.

**Nasıl kuruldu:**
- `_kaynak/tw.css`: Preline'ın Tailwind v4 kurulum satırları (docs'taki gibi `@source "./node_modules/preline/dist/*.js"`, `@import "./node_modules/preline/variants.css"`, `@plugin "@tailwindcss/forms"`, tema importu) + 0.7'deki `@source` ve `dark` varyantı. Derleme: `cd _kaynak && npx @tailwindcss/cli -i tw.css -o ../assets/css/tw.css --minify`.
- Statik HTML blokların sınıflarını olduğu gibi taşır. JS'lerin ürettiği öğeler (`.cal-day`, `.slot`, `.recipe-card`, `.bubble`, `.result-*`, `.meal`…) kendi sınıf adlarıyla üretilmeye devam eder; `tw.css`'teki "köprü katmanı" bunları `@apply` ile ilgili Preline bileşeninin sınıflarına bağlar.
- Alt sayfalar (`blog/*.html`, `kvkk.html`) `_kaynak/sayfalari-kur.js` ile kaynak siteden okunan içerikle üretildi; üst menü/footer/sohbet ana sayfadan alınır.
- Tema tokenları: Preline varsayılan teması (`preline/theme.css`). Koyu tema `html.dark` ile.
- Yazı tipi: blok önizlemelerinin hesaplanan `font-family` değeri sistem yığını (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto…`). Önizleme sayfası Inter'i `<link>`'liyor ama hiçbir öğe kullanmıyor; bu yüzden Google Fonts **yüklenmedi**, ölçülen yığın `--font-sans` oldu.

**JS değişiklikleri (en küçük yamalar):**
- `boot.js`: gezegen yükleyicisi bloğu silindi; ilk boyamadan önce `html.dark`; `theme-color` Preline arka planına göre.
- `site.js`:
  - `applyTheme`: `classList.toggle('dark', …)` ve `mizan:theme` olayı (0.7).
  - `applyLang`: metinler yeniden yazıldıktan sonra `HSStaticMethods.autoInit(['overlay','accordion','dropdown'])`. Footer dil menüsündeki `role="menuitem"` öğelerine `aria-current`.
  - `renderConfigText`: `[data-price]` fiyatları `config.js → types[*].price`'tan.
  - Makale paylaşım çubuğu: `[data-share-wa]` (wa.me bağlantısı) ve `[data-copy-link]` (panoya kopyala + toast).
  - Artık işaretlemesi olmayan kod silindi: eski mobil menü (`#mobile-menu`), dev kelime sığdırma (`data-fit`), kaydırma belirmesi (`data-reveal`, kaynakta kaydırma animasyonu yok). Offcanvas'ta bağlantıya tıklanınca menüyü kapatan 4 satır eklendi.
- `i18n.js`: 22 yeni İngilizce anahtar (menü, ücret kartları, paylaşım, SSS alt başlığı…) + 1 Türkçe (`share.copied`).
- **`booking.js`, `tools.js`, `content.js`, `chat.js`, `config.js` hiç değişmedi.** Takvim/saat/adım göstergesinin Preline görünümü için className değişikliği gerekmedi: adım durumları `group-[.is-current]:` / `group-[.is-done]:` varyantlarıyla (Preline `hs-stepper-active` / `hs-stepper-success` görünümü), takvim ve saatler köprü katmanıyla (Preline datepicker ve button sınıfları).

## Kaynaktan farklar ve nedenleri

1. **Hero'da alttan koyulaşan örtü.** Bloğun görseli koyu, `hero-mutfak` açık tonlu; beyaz metin okunmuyordu. Yalnızca metnin durduğu alt kısmı koyulaştıran `bg-linear-to-t from-black/75` eklendi. Yükseklik `h-120 md:h-[80dvh]` yerine `min-h-…` (açıklama, iki CTA ve `#next-slot` kartı sığsın).
2. **Menü `md` yerine `xl`'de satır içi.** 7 bağlantı + TR/EN + tema + "Randevu al" 768 px'e sığmıyor; `xl` altında bloğun offcanvas çekmecesi kullanılıyor. Bloğun ikinci offcanvas'ı (panel simgeli düğme) yerine promtun istediği eylem alanı geldi. Başlık bloğun aslındaki gibi yapışkan değil (yapışkan yapınca Preline'ın arka örtüsü çekmecenin üstüne çıkıyordu).
3. **Sütun sayıları içeriğe göre.** Kısa bilgiler 3→4, hizmetler 3→6 kart, tarifler 2→3 sütun (9 tarif), blog 4→3 sütun (6 yazı), ücret kartları 4→3.
4. **Ücretler:** promt gereği 3 görüşme türü (ilk/kontrol/online) ve fiyatlar config.js'ten. Aylık takip ve 3 aylık program paketleri kartların altında tek satır olarak duruyor (sohbet asistanının fiyat yanıtıyla tutarlı olsun diye). Aylık/yıllık anahtarı çıkarıldı. "Neler dahil" listesi aynı bloğun "Compare plans" tablosunun yapısıyla.
5. **Mevsim notları:** 7 görsel 2/2/2/1 dağıldı; tek görselli sütun `aspect-[4/9]` ile dengelendi. Resim altları blokta olmadığı için görsel olarak gizli (`sr-only`), ekran okuyucuda var.
6. **Kaynakta olmayan parçalar çıkarıldı:** yaklaşım bölümündeki alıntı, hizmet fotoğrafları ve etiketleri, manifesto sahnesinin alt satırları, makalelerdeki "Bu yazıda" kenar çubuğu, makale yazar tooltip kartı (tooltip JS'i gerektirir) ve "Tweet" düğmesi, iki kayan şerit (ribbon).
7. **Makale paylaşım çubuğu:** yalnızca WhatsApp ve "Bağlantıyı kopyala" (promt). Mobilde etiketler görsel olarak gizli (yüzen düğmelerle çakışmasın), ekran okuyucuda var.
8. **Kontrast düzeltmeleri (axe "serious").** Preline'ın `text-muted-foreground-1` (gray-500) tonu `bg-surface` (gray-100) üzerinde 4.39:1 kalıyor. Dil düğmesinin seçili olmayan hali ve iletişim formunun yüzen etiketleri bir ton koyu (`-2`); program hedef düğmelerindeki kcal etiketinden `opacity-80` kaldırıldı; özetteki boş değer `text-muted-foreground-1`.
9. **Sekmeler JS'siz.** S9 sekmelerinde `hs-tab` nitelikleri yok (promt). Preline v5 her `role="tablist"`'i otomatik başlattığı için araç ve gün sekmelerine Preline'ın belgelediği `--prevent-on-load-init` sınıfı kondu.
10. **VKİ ölçeği renkleri:** Preline'da karşılığı yok; yargılayıcı renk dili olmasın diye Preline birincil renk ölçeğinde açıktan koyuya (`--bmi-1…5`).
11. **Kullanılmayan varlıklar silindi:** `assets/video/hero.mp4` (6,3 MB), `hero-gezegen-*.jpg`, `hizmet-*.webp`, `uzman-*-900.webp`. Tarif görselleri content.js tarafından dinamik adla yüklendiği için kaldı.
12. `site.webmanifest` renkleri Preline arka planına (`#ffffff`) çekildi.

## CSP

- **Değişiklik yok.** `preline.js` yerel (`assets/vendor/preline/`), `script-src 'self'` yeterli. Stil ve font kuralları olduğu gibi kaldı (Google Fonts artık kullanılmıyor ama kural kaldırılmadı; en küçük değişiklik ilkesi).

## Eklenen dosyalar ve boyutlar

| Dosya | Boyut | gzip |
|---|---|---|
| `assets/css/tw.css` (Tailwind + Preline teması + köprü) | 181 KB | 25 KB |
| `assets/vendor/preline/preline.js` 5.0.0 | 435 KB | 94 KB |
| `assets/vendor/preline/LICENSE`, `lucide/LICENSE`, `flag-icons/LICENSE` | < 4 KB | |

- Şablonun eklediği JS: yalnızca `preline.js`, **94 KB gzip** (bütçe 250 KB). Mizan'ın kendi JS'leri toplam 78 KB gzip (değişmedi).
- Silinen: `site.css` (85 KB), `premium.css`, `motion.css`, `motion.js`, GSAP/Lenis dosyaları, hero videosu.
- Klasörün yayına giden boyutu (node_modules ve `_kaynak/indirilen` hariç): **≈ 15,9 MB**; 5 MB'ı aşan dosya yok.

## Test sonuçları (0.9 + promt kabul maddeleri)

`_kaynak/test/protokol.js` ile, Playwright/Chromium 1243, yerel önizlemede. Ham çıktı: `_kaynak/test/sonuc.json`. **Özet: 50 geçti, 0 kaldı.**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog listesi, makale, kvkk; 1440 ve 390) | Geçti | 8/8 sayfa hata 0 |
| 2 | Taşma 1440 / 390 | Geçti | `scrollWidth ≤ innerWidth` her sayfada |
| 3 | Sözleşme seçicileri | Geçti | Boş dizi; `.cal-day`, `.slot`, `.servings`, `[data-intent]` çalışma anında da var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → fark etmez → ilk gün → 09:00 → Test Kişi / test@example.com / 05321234567 + KVKK → özet → onay; `.ics` indi, Google Takvim bağlantısı var; stepper `DC--`; boş formda 4/4 hata; iptal penceresi açılıyor, boş gönderimde 2/2 hata |
| 5 | Araçlar | Geçti | VKİ 170/70 → **24,2**; kalori 1.730 kcal; ok tuşuyla sekme değişiyor; su bardağı yenilemede kalıyor (2 dolu) |
| 6 | Program ve tarifler | Geçti | Gün + hedef değişiyor (1.485 → 2.620); filtre 9 → 2; tarif penceresi açılıyor, porsiyon 2 → 3 ölçekliyor, Esc kapatıyor |
| 7 | Sohbet | Geçti | Kapalıyken gizli; "ücretler" → fiyat listesi, "randevu" → en yakın saat, "beni arayın" → demo yanıtı |
| 8 | Dil ve tema | Geçti | Orta sayfada TR→EN; açık→koyu (`html.dark` dahil); yenilemede korunuyor. `?lang=en`'de Türkçe kalan 10 düğüm yalnızca özel adlar (Moda, Kadıköy, kişi adları, köfte/kısır/cacık, adres) |
| 9 | axe (ana sayfa açık + koyu, makale, blog listesi, kvkk) | Geçti | Ciddi/kritik 0, kalan ihlal de 0 |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, görünmeyen bölüm 0 |
| 11 | JS kapalı | Geçti | 13 bölümün hepsi görünür, ilk SSS yanıtı açık |
| 12 | Ekran görüntüleri | Tamam | `_referans/sonuc-1440.jpg`, `sonuc-390.jpg`, `sonuc-1440-koyu.jpg` |
| K1 | Her blok için kaynak/sonuç çifti | Tamam | `_referans/kaynak-<blok>(-390).jpg` ↔ `sonuc-<blok>(-390).jpg`; bileşenler için `kaynak-datepicker/stepper/modal/chat-bubbles/…` ↔ `sonuc-datepicker/stepper/modal/chat-bubbles/…` |
| K2 | Offcanvas menü klavye ve Esc | Geçti | Enter ile açılıyor, odak menüde, Tab içeride kalıyor, Esc kapatıyor (`aria-expanded` güncelleniyor), bağlantıya tıklayınca kapanıyor |
| K3 | SSS accordion klavye | Geçti | Enter açıyor, Space kapatıyor; FAQPage JSON-LD 10 soru |
| K4 | Footer dil menüsü | Geçti | Preline dropdown açılıyor, "English" → sayfa EN ("Legal"), "Türkçe" → TR |
| K5 | Preline JS yalnızca 3 bileşen | Geçti | Başlayan örnekler: overlay 1, accordion 10, dropdown 1; `data-hs-tab/stepper/datepicker` 0 |
| K6 | PRO blok kullanılmadı | Tamam | 16/16 blok FREE, blok blok `_kaynak/PARCALAR.md` |

**Karşılaştırma turları:**
- Tur 1: hero başlığı bloğun `text-xl md:text-3xl lg:text-5xl` ölçeğine döndü; masonry'de resim altları kaldırılıp sütunlar dengelendi; sohbet paneli açılışta görünüyordu (katman önceliği) düzeltildi.
- Tur 2: SSS'de açık öğenin oku bloktaki gibi yukarı dönüyor (`hs-accordion-heading`); demo şeridi açık menünün altına alındı; kontrast düzeltmeleri; başlık yapışkanlıktan çıkarıldı.

## Bilinen sorunlar

- Tam sayfa ekran görüntülerinde bazen tembel yüklenen görseller boş görünebiliyor (çekim zamanlaması). Tarayıcıda sorun yok; `_referans` görüntüleri görseller önceden yüklenerek alındı.
- Preline'ın `@source "./node_modules/preline/dist/*.js"` satırı (kurulum belgesinin istediği) kullanılmayan bazı Preline sınıflarını da CSS'e ekliyor; derlenmiş CSS 25 KB gzip.
- Randevular demo modunda yalnızca bu tarayıcıda saklanır (`config.js → endpoint` boş).
