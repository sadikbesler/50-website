# DURUM — template6 · Tailwind Toolbox Landing Page

- **Tarih:** 27 Eylül 2026
- **Kaynak:** Tailwind Toolbox "Landing Page" — demo https://tailwindtoolbox.github.io/Landing-Page · kod https://github.com/tailwindtoolbox/Landing-Page · MIT (© 2019 Tailwind Toolbox) · depo commit `545f89e` (8 Ara 2022). Tek `index.html`; Tailwind 2.2.19'u CDN'den çeker.
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı). Mizan'ın "gradyan yok" kuralı bu şablonda promt gereği geçersiz.
- **Teknoloji:** Saf HTML + Tailwind CSS **3.4.17** (yerelde derlendi, CDN yok) + kaynağın `.gradient` sınıfı + kaynağın iki küçük vanilla betiği (`assets/js/toolbox-nav.js`). Font: Source Sans Pro 400/700 (Google Fonts, kaynaktaki bağlantı).
- **Canlı adres:** https://sadikbesler.github.io/50-website/template6/
- **Yerel önizleme:** http://localhost:8801/50-website/template6/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template6` · git'e giren boyut ≈ 18,3 MB (`node_modules` ve `_kaynak/indirilen` hariç; 50 MB'ı aşan dosya yok)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template6` yapıldı, `og:title`/`twitter:title` = "Diyetisyen web sitesi · Template 6 (Tailwind Toolbox Landing Page)".
2. Kaynak depo `_kaynak/indirilen/Landing-Page`'e klonlandı; `LICENSE` → `assets/vendor/tailwindtoolbox/`. Referanslar (`_referans/kaynak-*.jpg`): demo 1440 ve 390 tam sayfa, menü kaydırma öncesi/sonrası (her iki genişlik), mobil menü açık. Menünün hesaplanmış stilleri ve tipografi `_kaynak/test/kaynak-olcum.json`'da.
3. Sayfalar `_kaynak/yap.sh` ile kuruluyor (tekrar çalıştırılabilir): `sayfalari-kur.js` + Tailwind derlemesi.
   - Dalga SVG'leri ve iki unDraw çizimi kaynak `index.html`'den **birebir kesiliyor** (elle yazılmadı).
   - JS'e bağlı bloklar (araçlar, program, tarifler, randevu, SSS, iletişim, pencereler, sohbet) özgün işaretlemeyle alınıp `tw.css`'te yalnızca kaynağın tokenlarıyla giydirildi; hizmet/uzman/not/blog kartları özgün içerikten üretiliyor.
4. **Tailwind v2 → v3:** Ölçülen tek fark gölgeler (`shadow`, `shadow-lg` v3'te farklı ikinci katman). v2.2.19 değerleri `tailwind.config.js`'e extend olarak kondu. Renkler (gray = coolGray, pink) iki sürümde aynı; ek gerekmedi.
5. **Kaydırma davranışı:** Kaynaktaki betik aynı sınıfları ekleyip çıkarıyor (bkz. Kabul). Açılır menü betiği aynı mantıkla; `aria-expanded`, Escape ve bağlantıya dokununca kapanma eklendi.
6. **Koyu tema — kaynakta yoktu, türetildi:** beyaz zeminler gray-900, gri zeminler (fiyat) gray-800, metinler gray-100/300; gradyan, dalga renkleri ve düğmeler aynı. Kaydırınca beyaza dönen menü koyu temada gray-900'e döner; dalgaların "bir sonraki/önceki bölümün zemini" olan dolu katmanı o bölümün koyu rengini alır (kaynaktaki yorum: *"Change the colour … to match the previous section colour"*), yarı saydam beyaz katmanlar aynen kalır. Beyaz bölümlerdeki kartlar koyu temada gray-800 (gray-900 bölüm üstünde kart kenarı kaybolmasın diye). `boot.js` ilk boyamadan önce, `site.js → applyTheme` her değişimde `html.dark` koyar ve `mizan:theme` olayını yayınlar.

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

Sıra: Nav → Hero → dalga → S3 → S6 → S7 → S4 → S8 → S5 → S9 → S10 → S11 → S12 → dalga → CTA → S13 → S14 → S15 → S16 → S17 → Footer.

| Mizan | Kaynak |
|---|---|
| S1 üst menü | `nav#header` (sabit, kaydırınca beyaz) · "Action" → "Randevu al" · TR/EN + tema |
| S2 hero + `#next-slot` | Hero (sol metin, sağ görsel → `hero-gezegen-son.jpg`) · kart beyaz + `shadow-lg` + `rounded` |
| S6 yaklaşım | İlk "Title" bölümü: "İlk görüşme" / "Takip" satırları + kaynağın unDraw SVG'leri (renkleri değişmedi) |
| S4 hizmetler | "Title" + üç kart → 6 kart (2 × 3), küçük etiket = hizmet alanı |
| S12 ücretler | Pricing: sol Kontrol (900 TL), **orta İlk görüşme** (1.800 TL, gradyan çizgi, öne çıkan), sağ Online (1.500 TL) |
| Randevu çağrısı | Üst dalga + gradyan CTA: "Randevunuzu şimdi alın" → `#randevu` |
| S18 footer | Logo + Bağlantılar / Yasal / Sosyal (yalnızca Instagram, WhatsApp) / Klinik |
| S3, S5, S7–S11, S13–S17, S19, S20 | Kaynakta yok: `section bg-white border-b py-8` + `h2 text-5xl` + gradyan çubuk kalıbı; kart ve düğme tokenları; seçili durumlar `.gradient` + beyaz yazı |

## Kaynaktan farklar ve nedenleri

1. **Menü `xl`'de açılıyor** (kaynakta `lg`): 7 Türkçe bağlantı + TR/EN + tema + "Randevu al" 1024 px'e sığmıyor. Bağlantı yatay boşluğu `xl`'de `px-3` (kaynak `px-4`).
2. **Hero'da ikinci düğme** ("VKİ'nizi hesaplayın"): sözleşme 2 CTA istiyor; kaynağın kendi `#navAction` ilk hâli tokenlarıyla (beyaz, `shadow`, `opacity-75`). Uzun `hero.lede` yerine kısa bir alt başlık (`hero.sub`) — kaynaktaki "not too long" alt metin ölçüsüne uysun diye.
3. **Hero görseli** `rounded shadow-lg` aldı (kaynaktaki `hero.png` saydam zeminli bir çizim; fotoğrafın köşeleri gradyanın üstünde sert duruyordu). İkisi de kaynağın tokenı.
4. **Hizmet kartlarında fotoğraf yok** (kaynak kartında görsel yuvası yok). Uzman ve blog kartlarında fotoğraf kartın üstünde (içerik gereği).
5. **Ücretler:** Kaynakta 3 kart var; Mizan'ın iki takip paketi, kurumsal şeridi ve "Neler dahil" listesi aynı gri bölümde, yan fiyat kartı tokenlarıyla altta.
6. **Kart düğmeleri `<a>`** (kaynakta `<button>`), bu yüzden `inline-block`. Blog kartında bağlantı üst parçada; alttaki düğme görsel (`tabindex=-1`, `aria-hidden`).
7. **Erişilebilirlik eklemeleri:** Kaynaktaki `focus:outline-none` + (v2'de karşılığı olmayan) `focus:shadow-outline` yerine klavye odağında `ring-4 ring-pink-300`. Kaynak bağlantı rengi `text-pink-500` beyazda 3,5:1 olduğu için metin bağlantılarında kaynağın logo rengi `pink-600` kullanıldı (hover'da pink-500 aynen).
8. **Menü betiği ilk yüklemede de bir kez çalışır** (kaynakta yalnız kaydırmada): `#randevu` gibi derin bağlantıyla sayfanın ortasında açılınca menü beyaz görünsün. Bunun sonucu olarak mobil açılır menü sayfanın en üstünde kaynaktaki kaydırma sonrası hâli gibi `bg-gray-100`.
9. **CTA bölümü alt başlığı** `<h3>` yerine `<p>` (başlık hiyerarşisi); boyut aynı (`text-3xl leading-tight`).
10. **Küçültücü düzeltmesi:** Tailwind'in küçültücüsü `.gradient`'i `linear-gradient(90deg,#d53369,#daae51)` diye kısaltıyor; `yap.sh` kaynağın yazımına (`… 0%, … 100%`) geri çeviriyor, hesaplanan değer kaynakla aynı dize.
11. Kaynaktaki Freepik atıf satırı kaldırıldı (o arka plan kullanılmıyor); yerine sağlık uyarısı, © satırı ve "Tasarım şablonu: Tailwind Toolbox (MIT)".
12. **Kullanılmayan dosyalar silindi:** `site.css`, `premium.css`, `motion.css`, `motion.js`, GSAP/Lenis, `hero.mp4`, `hero-gezegen-ilk.jpg`.

## CSP

Değişiklik **yok**. `Content-Security-Policy` meta etiketi 9 sayfanın hepsinde özgünle birebir aynı (Python ile karşılaştırıldı). Kaynağın satır içi `<script>`'leri `assets/js/toolbox-nav.js`'e, `<body style="font-family…">` ve `<style>.gradient` derlenmiş CSS'e taşındı; Source Sans Pro Google Fonts'tan (zaten izinli).

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut |
|---|---|---|
| `assets/css/tw.css` | yeni (Tailwind 3.4.17 + `.gradient` + JS öğesi kuralları) | 166 KB (gzip 16,0 KB) |
| `assets/js/toolbox-nav.js` | yeni (kaynağın iki betiği) | 3,9 KB (gzip 1,5 KB) |
| `assets/vendor/tailwindtoolbox/LICENSE`, `assets/vendor/tailwindcss/LICENSE`, `assets/vendor/KAYNAKLAR.md` | yeni / yeniden yazıldı | — |
| `index.html`, `blog/*.html`, `kvkk.html` | kaynağın sınıflarıyla yeniden kuruldu | — |
| `assets/js/boot.js` | gezegen yükleyicisi silindi; `dark` sınıfı; tema rengi | küçük yama |
| `assets/js/site.js` | tema senkronu (`html.dark`) + `mizan:theme`; tema rengi | 3 satır |
| `assets/js/i18n.js` | yeni EN anahtarları: hero.sub, undraw.credit, pricing.c1–3/o1–3/packages, cta.title/text, blog.readMore, footer.links/legal/social/template | — |

Şablonun eklediği JS: **1,5 KB gzip**. Sitenin JS toplamı gzip ≈ 75 KB (250 KB sınırının çok altında).

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti | scrollWidth = innerWidth |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0 (`.servings` ve `[data-intent]` özgünde de çalışma anında üretiliyor). `.cal-day`/`.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor, boş formda 2 hata; boş bilgi adımında 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.450 → 2.600 kcal); filtre 9 → 2; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → "Yarın, saat 09:00"; "Beni arayın" → demo yanıtı |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`, EN'de Türkçe kalan metin 0; açık↔koyu; yenilemede ikisi de korunuyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, takvim + tarif penceresi + sohbet açıkken (açık TR, koyu EN): **toplam ihlal 0** |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür, menü açık, 7 not görseli; araç sonuçları / tarif kartları / öğünler JS ile üretildiği için boş (özgünde de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, her bölüm için `sonuc-<ad>(-dark).jpg`, menü öncesi/sonrası, mobil menü, takvim, onay, iptal, boş gün, sohbet, makale/blog/KVKK |
| Kabul | Nav kaydırma davranışı | Geçti | 1440 ve 390'da kaydırma öncesi/sonrası hesaplanan değerler kaynak demoyla **birebir aynı**: zemin `rgba(0,0,0,0)` → `rgb(255,255,255)`, gölge v2 `shadow` değeri, logo `white` → `gray-800`, düğme `bg-white/gray-800` → gradyan/`white`. Koyu tema (türetildi): zemin gray-900, logo gray-100 |
| Kabul | Gradyan hex | Geçti | `.gradient` ve başlık çubuğu: `linear-gradient(90deg, rgb(213, 51, 105) 0%, rgb(218, 174, 81) 100%)` = #d53369 → #daae51; Source Sans Pro 400 ve 700 yüklü |
| Ek | Mobil menü (kaynak betiği) | Geçti | Açılıyor (`aria-expanded=true`), bağlantıya dokununca ve dışarı tıklayınca kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde boş durum kutusu |

**Karşılaştırma turları** (`_referans/kaynak-*` ↔ `sonuc-*`):
- **1. tur (açık):** Hero, dalgalar, başlık + gradyan çubuk, kart ve fiyat düzeni kaynakla aynı. Düzeltilenler: kart bölümlerinde açıklama paragrafının ilk kartla aynı satıra düşmesi (6 kart 1+3+2 dizilmişti), "Neler dahil" simgelerinin boyutsuz kalması, randevudaki uzman adlarının dört sütunda kırılması.
- **2. tur (koyu + alt sayfalar):** Masaüstünde koyu temada menü bağlantılarının arkasında gri kutu çıkması (koyu `bg-gray-100` kuralı `xl:bg-transparent`'ı eziyordu; yalnız mobil kırılıma alındı), sayfa yolunda ayraç olmaması, küçültücünün gradyan yazımını değiştirmesi düzeltildi.

## Yayın

(Push sonrası güncellendi — aşağıya bakın.)

## Bilinen sorunlar / notlar

- Kaynak tasarım gereği gradyanın sağ (altın) ucunda beyaz küçük metin düşük kontrastlı olabilir; hero ve CTA metinleri kaynaktaki gibi büyük punto ve ağırlıkla sol/orta bölgede. axe gradyan zemini "incelenmeli" sayar, ihlal saymaz.
- Kaynakta da olduğu gibi `sm`–`lg` arasında üç fiyat kartı yan yana daralıyor (`w-5/6` + `sm:flex-row`); kaynağın davranışı korundu.
- CTA üstündeki dalganın `#f8fafc` katmanı ile fiyat bölümünün gray-100 zemini arasındaki ince ton farkı kaynakta da var.
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, loader.* vb.) duruyor; zararsız.
