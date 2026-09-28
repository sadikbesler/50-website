# DURUM — template7 · Tailblocks (tema "green")

- **Tarih:** 28 Eylül 2026
- **Kaynak:** Tailblocks — https://tailblocks.cc · kod https://github.com/mertJF/tailblocks · MIT (© 2020 Mert Cukuren) · depo commit `34943e6` (24 May 2021). Bloklar React JSX (`src/blocks/<kategori>/<light|dark>/<harf>.js`); önizleme Tailwind 2.0.2'yi CDN'den çeker.
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı).
- **Teknoloji:** Saf HTML + Tailwind CSS **3.4.17** (yerelde derlendi, CDN yok). Font: Tailwind 2.0.2 varsayılan `sans` yığını (sistem yazı tipi; Google Fonts yüklenmiyor). Yeni JS yok.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template7/
- **Yerel önizleme:** http://localhost:8801/50-website/template7/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template7` · git'e giren boyut ≈ 21 MB (`node_modules` ve `_kaynak/indirilen` hariç; 50 MB'ı aşan dosya yok)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template7`, `og:title`/`twitter:title` = "Diyetisyen web sitesi · Template 7 (Tailblocks)".
2. Depo `_kaynak/indirilen/tailblocks`'a klonlandı, `LICENSE` → `assets/vendor/tailblocks/`. Referans: tailblocks.cc'de tema **green** seçiliyken 19 bloğun her biri açık ve koyu modda, masaüstü (1440) ve telefon (410, sitenin kendi "phone" görünümü) → `_referans/kaynak-<kategori>-<harf>(-390)(-dark).jpg` (76 görüntü; sitenin reklam ve yüzen öğeleri görüntüden önce gizlendi). Hesaplanan renk/yazı ölçümleri `_kaynak/test/kaynak-olcum.json`.
3. **JSX → HTML (`_kaynak/blok-cevir.js`):** Babel ayrıştırıcısıyla her bloğun açık ve koyu dosyası ağaç olarak okunur; `className → class`, `${props.theme} → green`, JSX nitelikleri HTML adlarına çevrilir; koyu dosyadaki farklı sınıflar aynı sıradaki öğeye `dark:` önekiyle eklenir. Çıktı `_kaynak/bloklar/*.html` + `ogeler.json` + `sayim.json`. 19 blokta **kayıp sınıf 0**, yapı uyumsuzluğu 0 (tablo: `_kaynak/PARCALAR.md`).
4. **Sayfalar (`_kaynak/sayfalari-kur.js`, `sh _kaynak/yap.sh`):** Şablonlar sınıfları elle yazmaz; `{{k:blok:etiket:sıra}}` ile çevrilmiş bloktan çeker. Metinler, görseller ve JS'e bağlı bloklar özgün siteden. JS'in ürettiği öğeler (takvim, saatler, öğünler, tarif kartları, pencereler, sohbet) `_kaynak/tw.css`'te yalnızca adı geçen blokların tokenlarıyla giydirildi.
5. **Tailwind 2.0.2 → 3.4.17 (ölçüldü):** 2.0.2'de `green` = emerald paleti (500 `#10b981`); v3'te farklı → config'te `green = emerald`. `gray` aynı. Gölgeler 2.0.2 değerleriyle. Yazı yığını kaynak ölçümüyle birebir.
6. **Koyu tema:** blokların `dark/<harf>.js` renkleri (`dark:` önekli). `boot.js` ilk boyamadan önce, `site.js → applyTheme` her değişimde `html.dark` koyar ve `mizan:theme` olayını yayınlar.
7. Silinenler: GSAP/Lenis, `motion.js`, `premium.css`, `motion.css`, `site.css`, `#planet-loader`, `boot.js` gezegen bloğu, `hero.mp4`, `hero-gezegen-ilk.jpg`, `data-reveal` nitelikleri (Tailblocks'ta kaydırma animasyonu yok).

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | Tailblocks |
|---|---|
| S1 üst menü | header/a · "Randevu al" · TR/EN + tema linklerin yanında · xl altında menü düğmesi + dikey liste |
| S2 hero + `#next-slot` | hero/a · `hero-gezegen-son.jpg` · kart ikinci düğmenin altında (cta/b gri kutu) |
| S3 kısa bilgiler | statistic/a (4 sayı) |
| S4 hizmetler | content/h · 2 satır × 3 kart, hizmet fotoğrafları |
| S5 mevsim notları | gallery/a · 7 görsel (desen: [½ ½ tam][tam ½ ½] + tam genişlik), sürükleme site.js |
| S6 yaklaşım | step/a · 4 adım + `surec-mutfak-1200.webp` |
| S7 manifesto | testimonial/b tipografisi · manifesto cümleleri, kişi adı yok |
| S8 uzmanlar | team/b · 3 kişi |
| S9 araçlar | pricing/a sekme anahtarı + contact/c alanları + statistic/a sonuç |
| S10 program | feature/c (görsel + liste) + sekme anahtarı |
| S11 tarifler | blog/a kartları · filtre anahtarı · pencere blog kartı kenarıyla |
| S12 ücretler | pricing/b tablosu (+ "Neler dahil" pricing/a tokenları, kurumsal şerit content/e) |
| S13 randevu | contact/b (form + bilgi kartı özet) + step/a adım göstergesi · takvim/saat header düğmesi tokenı |
| S14 blog + makaleler | blog/c · makale/KVKK content/e düzeni ve tipografisi |
| S15 SSS | feature/d metin tipografisi + kart kenarıyla `<details>` |
| S16 afiyet olsun | cta/b + `sofra-2000.webp` arka plan (bloğun koyu renkleri) |
| S17 iletişim | contact/c + "Haritada aç" kartı (contact/b harita kutusu, iframe yok) |
| S18 footer | footer/a (4 sütun) |
| S19 sohbet | contact input/button + blog/a kart radius/kenarı |

## Kaynaktan farklar ve nedenleri

1. **Erişilebilirlik ton eşlemesi (en görünür fark).** Tailblocks green'de beyaz yazılı `bg-green-500` düğmeler 2,5:1, `text-green-500` bağlantılar 2,5:1, `text-gray-400` küçük metinler 2,5:1 kontrastta; axe bunları "ciddi" sayar ve 0.9'daki "ciddi ihlal 0" şartını çiğner. Metin taşıyan yeşil zeminler `bg-green-700` (hover 800, 5,5:1), yeşil metin `text-green-700`, gri-400 metin `gray-500` yapıldı; koyu temada `text-gray-500` → `gray-400`, blog/c çipinin koyu `text-opacity-75`'i kaldırıldı; gri-100 kutulardaki gri-500 küçük metin gray-600. **Promttaki "seçili = bg-green-500 text-white" da bu yüzden `bg-green-700 text-white` oldu.** Dekoratif yeşiller (başlık çubuğu, adım/simge daireleri, sekme kenarı, VKİ ölçeği) kaynaktaki 500 tonunda. Kurala `sayfalari-kur.js` (`TON_*`) ve `tw.css` başlığında bakılabilir; geri almak tek satır.
2. **Promt S17 için "contact/c iframe içerir" diyor; iframe aslında contact/b'de.** S17 contact/c ile kuruldu; harita için contact/b'nin gri harita kutusu + beyaz bilgi kartı eklendi, iframe yerine `config.mapsUrl`'ye giden "Haritada aç" bağlantısı (CSP `frame-src 'none'` değişmedi). S13'te contact/b'nin form sütunu ve bilgi kartı kullanıldı, orada da iframe yok.
3. **Mobil menü:** header/a'da hamburger yok (bağlantılar alt alta sarar). 7 bağlantı + dil + tema sığmadığı için xl altında aynı düğme tokenıyla bir menü düğmesi ve açılır dikey liste (özgün site.js mantığı). Header kaynaktaki gibi sabit değil (statik).
4. **Görsel oranları:** Tailblocks dummy görselleri sabit oranlı (gallery 5:3). Galeride hücreler `aspect-[5/3]`, 7. görsel `aspect-[10/3]` (aynı satır yüksekliği). Hero görseli 16:9 (kaynak 6:5).
5. **Yuvası olmayan içerik:** hizmet etiketleri, uzman eğitim/gün/dil listesi, hero üst satırı ("Moda, Kadıköy · …"), yöntemdeki kurucu alıntısı ve plan başına 3.–5. özellikler gösterilmedi (plan kapsamı tabloda, "Neler dahil" listesi altta).
6. **Sahte sayılar kaldırıldı:** blog kartlarındaki 1.2K görüntülenme / 6 yorum yuvalarında tarih ve okuma süresi; team/b sosyal simgeleri yerine randevu bağlantısı; pricing/b'nin işlevsiz radyoları yerine plan başına randevu oku.
7. **S16 görsel üstü:** okunabilirlik için `bg-gray-900 bg-opacity-75` perde ve bloğun koyu renkleri her iki temada; "afiyet olsun" h1 yuvasında büyütüldü (`text-5xl sm:text-6xl`).
8. **Blok dışı küçük eklemeler:** görünür klavye odağı (kaynak düğmeleri `focus:outline-none`; tek genel kural, green-500 çerçeve), form hata metni `red-700` (Tailblocks'ta hata durumu yok), kaynakta büyük harfle yazılmış etiketler için `uppercase`, sayfa yolunda "/" ayracı.
9. **KVKK metni:** "Yazı tipleri Google Fonts üzerinden yüklenir…" cümlesi (TR/EN) kaldırıldı; bu şablon Google Fonts yüklemiyor.
10. `statistic/a` sayıları `h2` yerine `p` (dört sayı başlık hiyerarşisine girmesin); testimonial/b'de büyük metin `h2`, isim yuvası `p`.

## Blok sınıflarının sayfada kullanımı (`bloklar/kullanim.json`)

Sayfa HTML'inde `{{k:…}}` ile doğrudan kullanılan benzersiz sınıf / bloktaki benzersiz sınıf: header/a 47/47, hero/a 53/55, statistic/a 22/22, content/h 55/58, gallery/a 34/34, step/a 50/52, testimonial/b 28/33, team/b 46/49, pricing/a 59/88, contact/c 78/80, feature/c 33/52, blog/a 15/57, pricing/b 60/63, contact/b 39/87, blog/c 64/68, content/e 37/40, feature/d 44/53, cta/b 44/73, footer/a 59/67. Düşük oranlar (blog/a, contact/b, feature/c) JS'in ürettiği öğelerden: tarif kartları, randevu formu ve öğünler aynı tokenlarla `tw.css`'te `@apply` ile giydirildi. Kullanılmayan diğerleri bilinçli çıkarılanlar (sosyal simgeler, POPULAR rozeti, 4. fiyat kartı, kayıt formu vb.).

## CSP

Değişiklik **yok** — 9 sayfanın `Content-Security-Policy` etiketi özgünle birebir aynı (Python ile karşılaştırıldı). Satır içi betik/stil eklenmedi; harita iframe'i konmadı.

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut |
|---|---|---|
| `assets/css/tw.css` | yeni (Tailwind 3.4.17) | 97 KB (gzip 12,6 KB) |
| `assets/vendor/tailblocks/LICENSE`, `assets/vendor/tailwindcss/LICENSE`, `assets/vendor/KAYNAKLAR.md` | yeni / yeniden yazıldı | — |
| `index.html`, `blog/*.html`, `kvkk.html` | Tailblocks bloklarıyla yeniden kuruldu | — |
| `assets/js/boot.js` | gezegen yükleyicisi silindi; `dark` sınıfı; tema rengi | küçük yama |
| `assets/js/site.js` | `html.dark` + `mizan:theme`; tema rengi | 3 satır |
| `assets/js/i18n.js` | yeni EN anahtarları: contact.openMap, footer.legal, footer.template, pricing.colPlan/colFor/colIncl/colPrice, blog.readMore | — |
| GSAP/Lenis, motion.js/css, premium.css, site.css, hero.mp4, hero-gezegen-ilk.jpg | silindi | — |

Şablonun eklediği JS: **0 KB**. Sitenin JS toplamı gzip ≈ 78 KB (250 KB sınırının altında).

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti | scrollWidth = innerWidth (ilk turda fiyat tablosundaki `sr-only` başlık taşıyordu; düzeltildi) |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0 (`.servings`, `[data-intent]` özgünde de çalışma anında); `.cal-day`/`.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor, boş formda 2 hata; boş bilgi adımında 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.500 → 2.580 kcal); filtre 9 → 2; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi; "randevu" → en yakın saat; "Beni arayın" → demo yanıtı |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`, EN'de Türkçe kalan metin 0; açık↔koyu; yenilemede ikisi de korunuyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, takvim + tarif penceresi + sohbet açıkken (açık TR, koyu EN): **toplam ihlal 0** (ilk turda 5 kontrast ihlali vardı; ton eşlemesiyle giderildi) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0, gizli bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür, mobil menü listesi açık, 7 not görseli; araç sonuçları / tarif kartları / öğünler JS ile üretildiği için boş (özgünde de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`; **her blok için kaynak/sonuç çifti**: `kaynak-<blok>(-dark).jpg` ↔ `sonuc-<blok>(-dark).jpg` (1440) ve `-390` sürümleri; mobil menü, takvim, onay, iptal, boş gün, sohbet, tarif penceresi, makale/blog/KVKK |
| Kabul | Tema + yazı + çeviri | Geçti | Başlık çubuğu, adım dairesi, sekme kenarı hesaplanan renk `rgb(16, 185, 129)` = Tailblocks green-500 (2.0.2); gövde yazı yığını ve metin rengi kaynak ölçümüyle birebir; JSX→HTML kayıp sınıf 0 |
| Ek | Mobil menü | Geçti | Açılıyor (`aria-expanded=true`), bağlantıya dokununca kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde boş durum kutusu |

**Karşılaştırma turları** (`kaynak-*` ↔ `sonuc-*`):
- **1. tur (açık, 1440):** yerleşim, tipografi ölçeği, radius ve boşluklar bloklarla aynı. Düzeltilenler: header düğmesindeki ok simgesi eksikti, footer sütun başlıkları kaynaktaki büyük harf değildi, footer uyarı metni ortalanmıştı.
- **2. tur (koyu + 390 + alt sayfalar):** 390'da fiyat tablosu belgeyi taşırıyordu (tablo kutusuna `relative`), gri kutulardaki küçük etiketler ve koyu blog çipi kontrastı, sayfa yolunda ayraç yoktu — düzeltildi.

## Bilinen sorunlar / notlar

- 390 px'te fiyat tablosu kaynaktaki gibi kendi kutusunda yatay kayar (`overflow-auto`).
- Tailblocks'ta masaüstünde her blok `py-24` ile üst üste durur; sayfa uzun ve beyaz aralıklı — kaynağın doğal görünümü.
- `_referans/kaynak-*-390*.jpg` tailblocks.cc'nin "phone" görünümünden alındı (410 px genişlik).
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, loader.* vb.) duruyor; zararsız.
