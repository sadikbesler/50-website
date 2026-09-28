# PARCALAR — template9 (AstroPaper 6.1.0)

Kaynak: https://github.com/satnaing/astro-paper (MIT) · commit `35cfa7f` (5 Ağu 2026) · `_kaynak/astro/` (düzenlenen kopya),
`_kaynak/indirilen/astro-paper-orijinal/` (değiştirilmemiş kopya; referans görüntüleri bundan alındı).
Ücretli parça yok (AstroPaper tamamen MIT).

Satır biçimi: `Mizan bölümü → kaynak bileşen → dosya → değiştirilen şeyler`

## Düzen ve ortak bileşenler

| Mizan | AstroPaper bileşeni | Dosya | Değişenler |
|---|---|---|---|
| Sayfa iskeleti, CSP, SEO | `Layout.astro` | `src/layouts/Layout.astro` | CSP meta (diyetisyen-v2 kuralı; arama sayfasında + `'wasm-unsafe-eval'`), hreflang, og/twitter, JSON-LD yuvası, Mizan JS'leri diyetisyen-v2 sırasıyla `<script is:inline src>`. **Kaldırılan:** `ClientRouter` (sayfa geçişi; Mizan JS'leri her sayfada bir kez çalışacak biçimde yazıldı), satır içi tema betiği (CSP) → yerine `assets/js/boot.js` |
| S1 üst menü `#site-header` | `Header.astro` | `src/components/Header.astro` | Başlık "mizan"; Posts→"Blog" (`blog/`), Tags→"Etiketler", About→"Hakkımızda"; arşiv/arama ikonları aynen; tema düğmesi `[data-theme-toggle]` (site.js yönetir); TR/EN düğmeleri eklendi (seçili dil = AstroPaper'ın `.active-nav` dalgalı alt çizgisi); mobil menü AstroPaper'ın kendi betiği (etiketler `Mizan.t`); 640–767 px'te menü aralığı `gap-x-3` (taşmasın diye) |
| S18 footer `.site-footer` | `Footer.astro` + `Socials.astro` | `src/components/Footer.astro` | AstroPaper'ın alt satırı (sosyal ikonlar + "Telif © yıl") aynen; üstüne Mizan'ın zorunlu içeriği AstroPaper düz satır tipografisiyle: klinik/kaynak/iletişim bağlantıları, sağlık uyarısı, KVKK, Asteria imzası, başa dön |
| Makale kartı (S14, blog, etiket, arşiv) | `Card.astro` | `src/components/Card.astro` | Başlık/açıklama TR+EN (`data-lang-block`); tarih satırına kategori ve okuma süresi; `transition:name` kaldırıldı |
| Tarih | `Datetime.astro` | `src/components/Datetime.astro` | İki dilde basılır (TR "8 Eyl 2026", EN AstroPaper biçimi "8 Sep, 2026") |
| Etiket | `Tag.astro` | `src/components/Tag.astro` | Adres `tags/<etiket>/`; `transition:name` kaldırıldı |
| Sayfa yolu | `Breadcrumb.astro` | `src/components/Breadcrumb.astro` | Mizan adresleri (blog/, tags/…, kvkk.html) ve TR/EN etiketler; aynı "Blog (sayfa 1)" kalıbı |
| Sayfalama | `Pagination.astro` | `src/components/Pagination.astro` | Adresler `/` ile biter (yerel sunucu + Pages yönlendirmesiz); pasif düğmede aria-label yok (axe) |
| Liste sayfası gövdesi | `Main.astro` | `src/components/Main.astro` | Başlık/açıklama i18n anahtarı veya yuva alır; "backUrl" yükte kaydedilir (ClientRouter yok) |
| Bağlantı düğmesi | `LinkButton.astro` | aynen | — (bütün Mizan düğmeleri bu görünümde) |
| Makale alt bileşenleri | `BackButton`, `BackToTopButton`, `ShareLinks`, `AdjacentPostNav` | `src/components/post/*` | Metinler TR/EN; "önceki/sonraki" başlığı `text-accent/85` → `text-accent` (kontrast); BackToTop'ın satır içi betiği dosyaya taşındı |
| Makale satır içi betiği (ilerleme çubuğu, başlık "#" bağlantıları, kod kopyala, görsel büyütme, başa dön) | `posts/[...slug]/index.astro` + `BackToTopButton.astro` içindeki `<script is:inline>` | `public/assets/js/astro-paper-post.js` | CSP için dosyaya taşındı; `astro:*` dinleyicileri çıkarıldı; "#" bağlantıları `#article` ile sınırlı ve `aria-labelledby` başlık (özgünde adsızdı); erişilebilirlik metinleri TR/EN |
| Tipografi ve renkler | `theme.css`, `typography.css`, `global.css` | `src/styles/` | Aynen (açık `#fdfdfd/#282728/#006cac`, koyu `#212737/#eaedf3/#ff6b01`); `global.css`'e `mizan.css` ve `@source` eklendi |
| Yazı tipi | Astro Fonts API, Google Sans Code | `astro.config.ts` | `subsets: ["latin", "latin-ext"]` (Türkçe harfler); `<Font>`'un satır içi `@font-face`'i derleme sonrası dosyaya taşınır (`satir-ici-ayikla.mjs`) |
| og görseli | `og.png.ts`, `posts/[...slug]/index.png.ts` | `src/pages/og.png.ts`, `src/pages/blog/[slug].png.ts` | Türkçe karakterleri doğru basıyor (bkz. `og.png`) → kullanıldı; "by " → "Yazan: " |

## Ana sayfa (`src/pages/index.astro` ← `_kaynak/sayfa/index.sablon.astro` + `anasayfa-kur.py`)

AstroPaper ana sayfa kalıbı: giriş (`#hero`) → "Featured" başlık stiliyle bölümler → "Recent Posts" → "All Posts →".
Bölüm başlığı her yerde AstroPaper'ın `h2.text-2xl.font-semibold.tracking-wide`'ı, bölüm ayırıcı `border-b border-border`.

| Mizan | AstroPaper karşılığı | Değişenler |
|---|---|---|
| S2 giriş `#top` | `#hero`: büyük h1 + RSS ikonu + paragraf + "Read the blog posts or check README" + "Social Links" | h1 = hero.title; CTA'lar LinkButton (kesikli alt çizgi); sosyal = WhatsApp + e-posta; **`#next-slot`** Card düzeninde (başlık = saat, tarih satırı = "En yakın uygun randevu", açıklama = uzman·tür, "Bu saati ayır →"); altında AstroPaper'ın katlanır içindekiler kutusu (`details`, remark-collapse çıktısıyla aynı görünüm) "Bu sayfada" |
| S3 kısa bilgiler `.facts` | Card tipografisi (vurgu renkli başlık + metin) | sm+ iki sütun |
| S4 hizmetler `#hizmetler` | Card + küçük görsel (`hizmet-*-700.webp`, 96×72 / 128×96, AstroPaper görsel kenarlığı) | Başlık bağlantısı `#randevu` + `data-book-area`/`data-book-type`; etiketler `#` ikonuyla (Tag ikonu, bağlantısız) |
| S5 mevsim notları `.notes-panel` | Etiketler sayfasının düzeni (`flex flex-wrap gap-6`, `#` ikonu) | **Görselsiz** (promt: yalnızca hizmet ve uzman görselleri) → 7 not metin; sürükleme yok |
| S6 yaklaşım `#yaklasim` | Bölüm başlığı + prose blockquote + numaralı liste (vurgu renkli işaretçi) | Süreç görseli çıkarıldı |
| S7 manifesto `#manifesto` | Prose blockquote | Yalnızca metin (4 satır + 3 kısa bilgi) |
| S8 uzmanlar `#uzmanlar` | Card + küçük portre (`uzman-*-560.webp`, 80×100 / 96×120) | `data-book-staff` bağlantısı LinkButton |
| S9 araçlar `#araclar` | diyetisyen-v2 işaretlemesi | Sekmeler = `.active-nav`; girişler = Pagefind arama kutusu tokenları; sonuç kutusu = arama sayfası uyarı kutusu (`bg-muted/75 rounded p-4`); VKİ ölçeği tek vurgu renginin tonları (yargılayıcı renk yok) |
| S10 program `#program` | diyetisyen-v2 işaretlemesi | Hedef seçimi `.active-nav`; seçili gün Tag görünümü (kesikli alt kenar); program görseli çıkarıldı |
| S11 tarifler `#tarifler` | diyetisyen-v2 işaretlemesi, kartlar Card + küçük görsel | Filtre `.active-nav`; `#recipe-dialog` karartması AstroPaper görsel büyütme katmanı (`bg-black/70 backdrop-blur-sm`), başlığı makale h1 stili |
| S12 ücretler `#ucretler` | Card + düz liste (işaretçi vurgu renkli) | 3 plan liste olarak; "vurgulu plan" görsel ayrımı yok (AstroPaper'da karşılığı yok) |
| S13 randevu `#randevu` | diyetisyen-v2 işaretlemesi | Adım göstergesi: numara dairesi + `.active-nav`; takvim/saat: 1px kenarlı 0.375rem kutular, seçili = `bg-accent`; özet kutusu 1px kenar |
| S14 blog `#blog` | "Recent Posts" + "All Posts →" | 6 makale Card (`perIndex: 6`) |
| S15 SSS `#sss` | AstroPaper `details` görünümü | `.faq-icon` gizli, yerel işaretçi vurgu renkli; `#faq-schema` site.js ile dolar |
| S16 "afiyet olsun" `.sky` | Giriş başlığı ölçeği (text-4xl/5xl bold) | Görselsiz; WhatsApp/ara/yol tarifi LinkButton |
| S17 iletişim `#iletisim` | diyetisyen-v2 işaretlemesi | Aynı tokenlar; çalışma saatleri tablosu kesikli satır çizgileri |
| S19 sohbet `#chat` + `.floating-actions` | Yüzen düğmeler = BackToTopButton mobil görünümü (`bg-background size-14 rounded-full shadow-xl`); balonlar `bg-muted/75` / `bg-accent`; hızlı yanıtlar Tag görünümü | Makale sayfasında AstroPaper'ın mobil "başa dön" düğmesi yüzen düğmelerin üstüne alındı (`bottom: 10rem`) |
| S20 demo şeridi | Arama sayfası uyarı kutusu tokenları | `bg-muted`, alt kenara sabit |

## Diğer sayfalar

| Adres | AstroPaper sayfası | Değişenler |
|---|---|---|
| `blog/`, `blog/2/` | `posts/[...page].astro` | Klasör + `index.astro` (`blog/[...page]/index.astro`); başlık/açıklama diyetisyen-v2 blog sayfasından; `perPage: 4` |
| `blog/<slug>.html` (6 makale) | `posts/[...slug]/index.astro` | Adresler diyetisyen-v2 ile aynı; tarih satırında yazar·kategori·okuma süresi ("Edit page" yerine); makale sonunda randevu çağrısı; JSON-LD diyetisyen-v2'deki gibi |
| `tags/`, `tags/<etiket>/` | `tags/index.astro`, `tags/[tag]/[...page].astro` | Klasör + `index.astro` |
| `archives/` | `archives/index.astro` | Ay adları TR/EN |
| `search/` | `search.astro` | Pagefind: `baseUrl` alt klasör; Türkçe arayüz metinleri (Pagefind'ın tr.json'u) açıkça verilir; EN'de sonuç başlığı makalenin EN başlığı, alt sonuçlar etkin dilin başlıkları (`#tr-…`/`#en-…`); giriş kutusuna `aria-label` |
| `about/` | `about.astro` (+ `content/pages/about.md`) | Mizan "Hakkımızda + uzmanlar"; metinler mevcut i18n anahtarlarından |
| `kvkk.html` | `about.astro` düzeni (Breadcrumb + Main + app-prose) | Metin diyetisyen-v2'den; Google Fonts cümlesi çıkarıldı (bu şablon yazı tipini kendisi sunuyor); bilgi kutusu rehype-callouts görünümü |
| `404.html` | `404.astro` | Metinler TR/EN |
| `rss.xml`, `robots.txt` | `rss.xml.ts`, `robots.txt.ts` | robots → `sitemap.xml` |
| `sitemap.xml` | (`@astrojs/sitemap` yerine) | Mizan biçimi (hreflang tr/en) + etiket/arşiv/arama/hakkımızda |

## Makaleler (Markdown)

`_kaynak/blog-cevir.js`: diyetisyen-v2 `blog/*.html` → `src/content/posts/<slug>.md`.
TR ve EN gövde `<div data-lang-block>` içinde Markdown; tablolar AstroPaper `ResponsiveTable` sınıflarıyla sarılı;
bilgi kutuları `> [!warning]` / `> [!note]` (rehype-callouts); kaynakça ortak; kapak görseli makalenin başında;
içindekiler AstroPaper'ın katlanır kutusu. Başlık kimlikleri `tr-…`/`en-…` (`src/utils/rehypeLangHeadingIds.ts`).
Etiketler: insülin → `insulin-direnci, beslenme`; aralıklı oruç → `beslenme`; su → `su, beslenme`;
Akdeniz → `akdeniz, beslenme`; protein → `protein, beslenme`; etiket okuma → `etiket-okuma, beslenme`.
Kelime sayısı özgünle birebir (test: "kabul: makale kelime sayısı").

## Kaynaktan alınmayanlar / kararlar

- AstroPaper demo yazıları, "Mingalaba" metni, README bağlantısı, GitHub/X/LinkedIn sosyal bağlantıları, `default-og.jpg`, AstroPaper favicon'u: yer tutucu → kaldırıldı.
- `ClientRouter` (görünüm geçişleri): Mizan JS'leri (randevu, sohbet) sayfa başına bir kez çalışacak biçimde; kaldırıldı.
- AstroPaper'ın tema betiği (`theme.ts`, localStorage "theme"): tek kaynak site.js ("mizan-theme"); aynı `data-theme` + `.dark` mekanizması.
- `@astrojs/sitemap`: Mizan'ın hreflang'lı haritası tercih edildi.
- Hiç danışan yorumu/puan/öncesi-sonrası yok (AstroPaper'da da yok).
