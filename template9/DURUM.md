# DURUM — template9 · AstroPaper

- **Tarih:** 28 Eylül 2026
- **Kaynak:** AstroPaper — https://github.com/satnaing/astro-paper · MIT (© Sat Naing) · sürüm **6.1.0**, depo commit `35cfa7f` (5 Ağu 2026) · Astro 7.3.5 + Tailwind 4.3.3 + Pagefind 1.5.2
- **Tür:** A (Astro projesi; derlenip statik çıktı bu klasöre konur, sinematik katman kaldırıldı)
- **Canlı adres:** https://sadikbesler.github.io/50-website/template9/
- **Yerel önizleme:** http://localhost:8801/50-website/template9/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template9` · git'e giren boyut ≈ 41 MB (`node_modules`, `_kaynak/indirilen`, `_kaynak/astro/dist` hariç; en büyük dosya 1,2 MB)
- **Derleme:** `sh _kaynak/derle.sh` → ana sayfa + TR sözlüğü + KVKK gövdesi (`anasayfa-kur.py`), 6 makale → Markdown (`blog-cevir.js`), `npm run build` (`astro check && astro build && satir-ici-ayikla.mjs && pagefind`), `rsync -a --delete … dist/ template9/` (`_kaynak`, `_referans`, `DURUM.md`, `.gitignore`, `backend` korunur)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template9`. Proje `_kaynak/astro/` (AstroPaper klonu, `npm i`), `LICENSE` → `assets/vendor/astro-paper/`.
2. **Referans:** README'deki demo (https://astro-paper.pages.dev) bu ağdan açılmadı — DNS, erişimi engellenmiş bir IP döndürüyor (bağlantı zaman aşımı). Engeli aşmaya çalışılmadı. Demo bu depodan yayınlandığı için **değiştirilmemiş depo** `_kaynak/indirilen/astro-paper-orijinal/`'de derlenip yerelde sunuldu ve görüntüler ondan alındı: ana sayfa, /posts, bir makale, /tags, bir etiket, /archives, /search, /about × 1440/390 × açık/koyu → `_referans/kaynak-*.jpg` (32 görüntü, `_kaynak/test/referans.js`). Hesaplanan yazı/renk ölçümleri `_kaynak/test/kaynak-olcum.json`.
3. **Adresler** diyetisyen-v2 ile aynı: `index.html`, `blog/`, `blog/<yazı>.html`, `kvkk.html`; AstroPaper sayfaları `tags/`, `tags/<etiket>/`, `archives/`, `search/`, `about/`, `blog/2/`, `404.html`, `rss.xml`, `sitemap.xml`, `robots.txt`, `og.png`, `blog/<yazı>.png`.
4. **Ana sayfa** AstroPaper kalıbında: giriş (h1 + RSS + paragraf + LinkButton CTA'lar + sosyal + `#next-slot` Card + katlanır "Bu sayfada") → her Mizan bölümü AstroPaper'ın "Featured" başlık stiliyle → "Recent posts" = 6 makale Card → "Tüm yazılar →". S9–S11, S13, S17, S19 diyetisyen-v2 işaretlemesi (0.3 sözleşmesi aynen) AstroPaper tokenlarıyla giydirildi (`src/styles/mizan.css`).
5. **Blog:** 6 makale `src/content/posts/*.md` (AstroPaper'ın içerik klasörü) — TR+EN gövde, tablolar, bilgi kutuları (rehype-callouts), kaynakça; etiketler `beslenme, insulin-direnci, su, protein, akdeniz, etiket-okuma`. `/tags`, `/archives`, `/search` (Pagefind, derleme adımında) çalışıyor. `/about` = Hakkımızda + uzmanlar. `kvkk.html` korunuyor.
6. **og görseli:** AstroPaper'ın dinamik üretimi (`og.png.ts`, makale başına `blog/<yazı>.png`) Türkçe karakterleri (ı ğ ş ö ü ç İ ’) doğru basıyor → kullanıldı. `og:title` ana sayfada "Diyetisyen web sitesi · Template 9 (AstroPaper)".
7. **TR/EN:** AstroPaper arayüz metinleri `src/i18n/lang/tr.ts` (TR) + `assets/js/i18n.js` `ap.*` anahtarları (EN = AstroPaper'ın `en.ts`'i). Makaleler iki dili de taşır; site.js dile göre gösterir.
8. **Mizan JS yamaları (en küçük):** `boot.js` gezegen yükleyicisi bloğu silindi, ilk boyamada `html.dark` konuyor; `site.js → applyTheme` `html.dark` + `mizan:theme` olayı (0.7); `theme-color` AstroPaper arka planı (#fdfdfd / #212737); `i18n.js`'e 45 yeni anahtar (40 EN + JS'in ürettiği 5 metnin TR'si). booking/tools/content/chat.js değişmedi.
9. **Silinenler (0.6):** GSAP, ScrollTrigger, Flip, SplitText, CustomEase, Lenis, `motion.js`, `premium.css`, `motion.css`, `site.css`, `#planet-loader`, `data-reveal`, `hero.mp4` ve kullanılmayan 26 görsel (hero, mevsim notu, sofra, süreç, program, büyük hizmet/uzman sürümleri).

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | AstroPaper |
|---|---|
| S1 üst menü | Header (Blog · Etiketler · Hakkımızda · arşiv · arama · tema) + TR/EN |
| S2 hero + `#next-slot` | `#hero` + LinkButton CTA'lar + Card düzeninde en yakın randevu |
| S3, S4, S6, S7, S8, S12, S15, S16 | Bölüm başlığı ("Featured" stili) + Card + düz liste; yalnızca hizmet ve uzman görselleri, küçük |
| S5 mevsim notları | Etiketler sayfası düzeni, görselsiz |
| S9 araçlar, S10 program, S11 tarifler, S13 randevu | diyetisyen-v2 işaretlemesi; sekmeler/seçimler `.active-nav`, girişler Pagefind kutusu, kutular `bg-muted/75` |
| S14 blog | "Recent posts" (6 Card) + blog/ = AstroPaper /posts (Pagination) |
| S17 iletişim, S19 sohbet | Aynı tokenlar; yüzen düğmeler BackToTop mobil görünümü |
| S18 footer | AstroPaper alt satırı + Mizan bağlantıları/uyarı/KVKK/imza |
| S20 | Demo şeridi (uyarı kutusu tokenları), kvkk.html, sitemap.xml, manifest, ikonlar |

## Kaynaktan farklar ve nedenleri

1. **Görünüm geçişleri yok** (`ClientRouter` kaldırıldı): Mizan'ın randevu/sohbet betikleri sayfa başına bir kez çalışacak biçimde yazılmış; sayfa değişiminde yeniden kurulmaları hata riskli. Sayfalar normal gezinmeyle açılır.
2. **Tema tek kaynaktan:** AstroPaper'ın `theme.ts`'i ve satır içi FOUC betiği yerine diyetisyen-v2'nin `boot.js` + `site.js`'i (aynı `data-theme` + `.dark`, anahtar "mizan-theme"). CSP satır içi betiğe izin vermiyor.
3. **Menü:** "Posts" yerine "Blog" (adres `blog/`), TR/EN düğmeleri eklendi; 640–767 px'te menü aralığı `gap-x-5` → `gap-x-3` (aksi hâlde 13 px yatay taşma). md ve üstü birebir.
4. **Makale tarih satırı:** "Edit page" yerine yazar · kategori · okuma süresi (Mizan verisi). Makale sonunda diyetisyen-v2'nin randevu çağrısı; "Diğer yazılar" yerine AstroPaper'ın önceki/sonraki yazı gezinmesi.
5. **Ana sayfada "Featured" listesi yok:** promt S14'te 6 makalenin tamamını "Recent posts"ta istiyor; AstroPaper'ın "Featured" alanı Mizan bölümlerine bırakıldı (aynı başlık stili). Giriş bölümüne AstroPaper'ın katlanır içindekiler kutusu ("Bu sayfada") eklendi — menüde bölüm bağlantıları olmadığı için.
6. **Görseller:** promt gereği yalnızca hizmet ve uzman görselleri, küçük. Mevsim notları, "afiyet olsun" bandı, süreç ve program görselleri kullanılmadı; notlar sürüklenemez (fotoğraf kartı yok). Tarif kartları ve tarif penceresi content.js'in görselleriyle (küçük küçük resim).
7. **Erişilebilirlik ton eşlemesi (axe "ciddi" 0 için):** (a) açık temada `bg-muted/75` kutuların içinde soluk metin 3,9:1 → kutu içinde ön plandan türetilen ton; (b) koyu temada `--accent` #ff6b01 üstünde beyaz yazı 2,9:1 → vurgu zeminli Mizan öğelerinde (seçili gün/saat, adım numarası, kullanıcı balonu, gönder) yazı rengi sayfa zemini #212737; (c) rehype-callouts açık tema başlık renkleri (not = AstroPaper vurgusu #006cac, uyarı = koyu turuncu), koyu not rengi açık mavi; (d) AdjacentPostNav `text-accent/85` → `text-accent`; (e) makale "#" başlık bağlantılarına `aria-labelledby`, Pagefind girişine `aria-label`, menüde `role="group"` li'den içteki div'e.
8. **Arama:** Pagefind'ın paketlenen arayüzü `<html lang>`'ı okumadığı için Türkçe metinler Pagefind'ın kendi `tr.json` çevirisinden açıkça verildi; dil değişince arayüz yeniden kurulur. Makale başlık kimlikleri diyetisyen-v2 kuralıyla `tr-…`/`en-…` → alt sonuçlar etkin dile göre süzülür; EN'de sonuç başlığı makalenin EN başlığı. Sonuç özetleri, eşleşen metnin dilinde kalır (makaleler iki dili de içerdiği için).
9. **`build.format: "preserve"`** (0.7'deki `"file"` yerine): aynı `kvkk.html` ve `blog/<yazı>.html` adreslerini verir, ek olarak `blog/index.html` ve `tags/<etiket>/index.html` klasör hâlinde kalır ("file" bunları `blog.html` yapıp `blog/` bağlantısını kırardı).
10. **Site haritası:** `@astrojs/sitemap` yerine diyetisyen-v2'nin hreflang'lı `sitemap.xml` biçimi (Astro uç noktası, bütün etiket sayfaları dahil).
11. **Yazı tipi:** AstroPaper'ın Google Sans Code'u Astro Fonts API ile derlemede indiriliyor, `latin-ext` eklendi (Türkçe harfler). KVKK metnindeki "Yazı tipleri Google Fonts üzerinden yüklendiği için…" cümlesi (TR/EN) çıkarıldı: çalışma anında Google'a istek yok.
12. **Mobil "başa dön" (makale):** AstroPaper'ın sabit düğmesi Mizan'ın yüzen WhatsApp/sohbet düğmeleriyle çakışıyordu → mobilde `bottom: 10rem`.

## CSP

- Bütün sayfalarda diyetisyen-v2'nin kuralı aynen (`script-src 'self'`, `style-src 'self' https://fonts.googleapis.com`, `font-src 'self' https://fonts.gstatic.com`, `img-src 'self' data:`, `connect-src 'self' https://script.google.com https://script.googleusercontent.com`, `frame-src 'none'` …).
- **Tek ekleme:** yalnızca `search/index.html`'de `script-src 'self' 'wasm-unsafe-eval'` — Pagefind arama dizinini WebAssembly ile çalıştırır. `'unsafe-inline'` / `'unsafe-eval'` yok.
- Satır içi `<style>`/`<script>` yok: Astro `inlineStylesheets: "never"`, `assetsInlineLimit: 0`; `<Font>`'un `@font-face`'i derleme sonrası `_astro/inline.<özet>.css`'e taşınır (`_kaynak/astro/satir-ici-ayikla.mjs`, satır içi betik ya da `style=""` kalırsa derleme durur). AstroPaper'ın makale satır içi betiği → `assets/js/astro-paper-post.js`.
- Test: 10 sayfa türünde konsolda CSP ihlali dahil hata 0.

## Eklenen dosyalar ve boyutlar

| Dosya | Boyut (gzip) | Nerede |
|---|---|---|
| `_astro/Header…js`, `Main…js`, `BackButton…js` | 0,5 + 0,1 + 0,2 KB | her sayfa / liste / makale |
| `assets/js/astro-paper-post.js` | 4,0 KB | makale |
| `_astro/index…js` + `_astro/ui-core…js` (Pagefind UI) + `pagefind/pagefind.js` (+ WASM) | 1,9 + 26,1 + 12,9 KB | yalnızca arama sayfası |
| `_astro/Footer…css` (Tailwind + AstroPaper + Mizan katmanı) | 17,6 KB | her sayfa |
| `_astro/fonts/` (Google Sans Code 5 ağırlık × 2 stil, woff+ttf) | 932 KB (tarayıcı yalnızca kullanılan woff'ları indirir) | her sayfa |
| `pagefind/` dizini | 720 KB | arama |

Şablonun eklediği JS: sayfa başına ~1 KB, arama sayfasında ~41 KB (gzip) — 250 KB sınırının altında. Mizan JS'leri (değişmedi) 75 KB gzip.

## 0.9 test sonuçları (`node _kaynak/test/protokol.js` → `_kaynak/test/sonuc.json`)

| # | Test | Sonuç |
|---|---|---|
| 1 | Konsol: ana sayfa, blog, blog/2, makale, kvkk, etiketler, etiket, arşiv, arama, hakkımızda | **Geçti** — 0 hata |
| 2 | Taşma 1440 / 390 (aynı 10 sayfa) | **Geçti** — `scrollWidth = innerWidth` |
| 3 | Sözleşme seçicileri (+ `.cal-day`/`.slot`) | **Geçti** — eksik 0 |
| 4 | Randevu (demo) | **Geçti** — boş formda 4 hata, özet 8 satır, onay `MZ-…`, .ics indirildi, Google Takvim bağlantısı, iptal penceresi + hata mesajları |
| 5 | Araçlar | **Geçti** — VKİ 170/70 → 24,2; kalori 1.730; 3 bardak yenilemede kaldı |
| 6 | Program ve tarifler | **Geçti** — gün/hedef değişiyor (1.500 → 2.580), filtre 9 → 2, porsiyon 2 → 3 (80 g → 120 g) |
| 7 | Sohbet | **Geçti** — ücret yanıtı, en yakın saat, "beni arayın" demo yanıtı |
| 8 | Dil ve tema | **Geçti** — sayfa ortasında TR↔EN, EN'de 10 sayfanın hiçbirinde Türkçe metin kalmadı (özel adlar ve KVKK'daki "5/2-ç" madde numarası hariç), `?lang=en`, koyu tema + `html.dark`, yenilemede korunuyor |
| 9 | axe (ana sayfa açık/koyu, makale açık/koyu, blog, etiket, arşiv, hakkımızda, kvkk, arama açık/koyu, takvim, tarif penceresi, sohbet × açık/koyu) | **Geçti** — ciddi/kritik 0. Kalan: `region` (orta, makale sayfası: AstroPaper'ın ilerleme çubuğu ve başa dön düğmesi landmark dışında) |
| 10 | Hareket azaltma | **Geçti** — sonsuz animasyon yok, gizli bölüm yok |
| 11 | JS kapalı | **Geçti** — bölümler görünür, 7 not, 6 yazı; EN blokları gizli |
| 12 | Ekran görüntüleri | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, bölüm görüntüleri `sonuc-bolum-*`, sayfa çiftleri `sonuc-<sayfa>-<genişlik>(-dark).jpg` ↔ `kaynak-…`, yan yana `_referans/karsilastirma/*.jpg` (32), randevu/pencere/sohbet/mobil menü/JS kapalı |

**Promt 9 kabul maddeleri:**

| Madde | Sonuç |
|---|---|
| `/search` ile "insülin" | **Geçti** — ilk sonuç `blog/insulin-direnci-beslenme.html` (200); arayüz Türkçe ("insülin için 2 sonuç bulundu") |
| Etiket sayfaları üretiliyor | **Geçti** — `tags/{akdeniz, beslenme, etiket-okuma, insulin-direnci, protein, su}/` (200), `tags/beslenme/2/` sayfalaması |
| Bütün iç bağlantılar 200 | **Geçti** — 22 sayfadaki 900 bağlantı/kaynak (59 benzersiz adres) 200; `#parça` hedeflerinin hepsi sayfada var |
| (promt 8 ortak) makale metni kelime kaybı yok | **Geçti** — 6 makalede TR+EN gövde ve kaynakça kelime sayısı özgünle birebir (aynı yöntemle sayıldı) |

Görsel karşılaştırma 2 tur yapıldı (1440 ve 390, açık ve koyu). 1. turda düzeltilenler: alıntıda çift tırnak, adım numaralarının taşması, program seçicilerinde dalgalı çizgi çakışması, footer'da boşluk kaybı ve 390'da taşma, Pagefind'ın İngilizce kalması, arama sonuçlarında "TitleEn" satırı, breadcrumb'da "Blog(sayfa 1)". 2. turda liste/etiket/arşiv/makale/arama/hakkımızda sayfaları kaynakla aynı düzende.

## Bilinen sorunlar

- Arama sonuç özetleri eşleşen metnin dilinde gösterilir (makaleler iki dili de içerir; EN arayüzde "insulin" araması TR paragraflardan da özet getirebilir).
- AstroPaper'ın paylaş bağlantıları (Facebook, X, Telegram, Pinterest, e-posta, WhatsApp) harici sitelere düz bağlantıdır; betik yüklemez.
- `pagefind/` klasöründe Pagefind'ın kullanılmayan hazır arayüz dosyaları (`pagefind-ui.js`, modular/component UI) de üretiliyor; sayfalar bunları yüklemiyor.
- Lighthouse bu promtta istenmediği için ölçülmedi.
