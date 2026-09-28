# PARÇALAR — template8 · AstroWind

Kaynak: https://github.com/arthelokyo/astrowind · MIT · 1.0.0-beta.66 · commit `14e1a69` (12.09.2026).
Proje: `_kaynak/astro/` (depo klonu; `.git` silindi, bozulmamış kopya karşılaştırma için `_kaynak/indirilen/astrowind-orijinal/`, git dışı).
Ücretli (PRO) parça yok — AstroWind'in tamamı MIT.

Satır biçimi: `Mizan bölümü → AstroWind bileşeni → dosya → değiştirilen şeyler`

## Sayfa ve widget eşlemesi (ana sayfa: `src/pages/index.astro`)

- S1 üst menü → Header + ToggleTheme + ToggleMenu → `src/components/widgets/Header.astro`, `common/ToggleTheme.astro`, `common/ToggleMenu.astro` → kimlik `#site-header` (tailwind.css'teki `#header` kuralları ve betikteki seçiciler buna çevrildi); bağlantı metinleri HTML (data-i18n); tema düğmesinin yanına TR/EN (aynı düğme sınıfları, seçili dil `text-link`); tema düğmesi `data-theme-toggle` → site.js (AstroWind'in `<aw-theme-toggle>` betiği kaldırıldı, tek kaynak site.js); menü etiketi Türkçe + i18n. Bağlantılar `src/navigation.ts` (7 bağlantı, eylem "Randevu al").
- S2 hero + `#next-slot` → Hero → `widgets/Hero.astro` (değişmedi) → görsel `hero-gezegen-son.jpg` HTML görsel yuvasıyla (alt metin i18n); `#next-slot` kartı `content` yuvasında, Pricing kartı tokenları (`rounded-lg border shadow`).
- S3 kısa bilgiler → Stats → `widgets/Stats.astro` → `amount`/`title` `set:html` (birimler data-i18n span'i); `.facts` kapsayıcı sınıfı.
- S4 hizmetler → Features (2 sütun, demodaki gibi) → `widgets/Features.astro` → başlık `set:html`. İkonlar Tabler: scale, stethoscope, run, heart, baby-carriage, device-laptop. Her maddede "Randevu al »" bağlantısı (`data-book-area` / `data-book-type`).
- S5 mevsim notları → Gallery (4 sütun, ışık kutusu kapalı) → `widgets/Gallery.astro` → HTML görsel yuvası, `<figure>` nitelikleri (`data-note` → site.js sürüklemesi), başlık `set:html`; ışık kutusu kapalıyken devre dışı `<button>` yerine `<div>` (sürüklenebilsin). Açık mavi zemin (`bg-blue-50`, demodaki Content bölümleri gibi).
- S6 yaklaşım → Steps → `widgets/Steps.astro` (değişmedi) → 4 adım, demodaki "Adım: <span class=font-medium>…</span>" kalıbı; görsel `surec-mutfak-1200.webp`; ikonlar clipboard-text, activity, file-description, calendar-repeat.
- S7 manifesto → Note → `widgets/Note.astro` → yalnızca `id` eklendi (`#manifesto`); `tabler:quote`, başlık "Tek bir hafta için değil.", açıklama diğer üç satır.
- S8 uzmanlar → Team (3 sütun) → `widgets/Team.astro` → ad/rol `set:html`, sosyal simgeler yerine "…randevu al »" (`callToAction`, `[data-book-staff]`); rol satırına `dark:text-blue-400` (koyu temada `text-primary` 3,75:1 kalıyordu).
- S9 araçlar → Content → `widgets/Content.astro` → görsel yoksa içerik tam genişlik (`md:basis-full`), içerik kutusu sınıfı `classes.content` ile değiştirilebilir. İşaretleme `src/components/mizan/Araclar.astro` (diyetisyen-v2'den dilimlendi).
- S10 örnek program → Content → aynı → `mizan/Program.astro`; açık mavi zemin.
- S11 tarifler → Content → aynı → `mizan/Tarifler.astro`; tarif kartları (tarif JS'i üretir) blog `GridItem` düzeninde.
- S12 ücretler → Pricing → `widgets/Pricing.astro` → metin yuvaları `set:html` (fiyat data-i18n, "TL" `normal-case`); orta kart `highlight`. "Neler dahil / dahil değil / kurumsal" → Features (3 sütun) — AstroWind /pricing sayfasındaki "Price-related features" kalıbı.
- S13 randevu → Content → aynı → `mizan/Saat.astro` + `mizan/Randevu.astro`.
- S14 blog → BlogLatestPosts (6 yazı) → `widgets/BlogLatestPosts.astro` → bağlantı metni HTML. Kartlar `blog/GridItem.astro`.
- S15 SSS → FAQs (katlanır, ilk soru açık) → `widgets/FAQs.astro` → başlık `set:html`; site.js'in FAQPage verisi için `data-faq-list`, `.faq`, `.faq-a`. Widget'ın kendi `schema` çıktısı kullanılmadı; `#faq-schema` sayfanın `head`'inde, derlemede Türkçe dolu, site.js dile göre yeniliyor. "Asistana sorun / WhatsApp" düğmeleri alt başlıkta.
- S16 "afiyet olsun" → CallToAction `layout="banner"` → `widgets/CallToAction.astro` (değişmedi) → `.sky`; WhatsApp / Bizi arayın / Yol tarifi.
- S17 iletişim → Contact + Features2 (AstroWind /contact sayfasının kalıbı) → `widgets/Contact.astro`: `inputs` yerine varsayılan yuvadaki form aynı kartta; form `mizan/IletisimFormu.astro` (diyetisyen-v2 alanları, KVKK onayı, site.js işleyicisi). `widgets/Features2.astro`: açıklama `<p>` yerine `<div>` (saat tablosu), başlık `set:html`. Kartlar: Adres (harita bağlantısı, iframe yok), Ulaşın, Çalışma saatleri (`[data-open-status]`, bugünün satırı kalın).
- S18 footer → Footer → `widgets/Footer.astro` → `.site-footer`, sütun başlığı `set:html`, bağlantılara ek nitelikler (`data-tel`, `data-mail`, `data-wa`, `data-maps`); alt not: sağlık uyarısı + © + Asteria Soft + "Tema: AstroWind (MIT)".
- S19 sohbet + yüzen düğmeler → (AstroWind'de yok) → `mizan/Sohbet.astro` (diyetisyen-v2 işaretlemesi) → görünüm `mizan.css`'te Contact kartı + CallToAction banner rengi + Tags hapları tokenlarıyla.
- S20 demo şeridi → (Announcement.astro görünümü) → site.js üst kenara ekler; `mizan.css` `.demo-bar` = Announcement sınıfları (`bg-slate-900 text-slate-300`, rozet `bg-white/20`). AstroWind'in kendi Announcement çubuğu (Astro v7 duyurusu) kaldırıldı.
- Pencereler (`#recipe-dialog`, `#cancel-dialog`) → Gallery ışık kutusu tokenları → `mizan/Pencereler.astro`.

## Blog, KVKK, diğer sayfalar

- Blog listesi `blog/index.html` → `src/pages/[...blog]/[...page].astro` + `blog/List.astro`, `ListItem.astro`, `blog/Headline.astro` → başlık/özet/tarih/kategori/yazar iki dilli; Newsletter (sahte form) kaldırıldı. `build.format: 'file'` `blog.html` yazar; `astro.config.ts`'teki `mizan-blog-index` entegrasyonu onu `blog/index.html`'e taşır.
- Makaleler `blog/<slug>.html` → `src/pages/[...blog]/index.astro` + `blog/SinglePost.astro`, `RelatedPosts.astro` (4 yazı), `ToBlogLink.astro`, `common/SocialShare.astro`, `common/Breadcrumbs.astro` → iki dilli üst bilgi, giriş (lede), okuma süresi (özgün "7 dk okuma"), kategori bağlantısız (kategori/etiket sayfaları kapalı); makale sonuna CallToAction kartı ("Size özel bir plan ister misiniz?").
- Makale metinleri → `src/data/post/*.md` → `scripts/blog-donustur.mjs` (özgün HTML'den; TR ve EN bloklar `<div data-lang-block>` içinde Markdown; callout kutuları özgün HTML; başlık kimlikleri `tr-…`/`en-…` özgünle aynı — `utils/frontmatter.ts` → `langHeadingIdsRemarkPlugin`). Smartypants kapalı (metin aynen).
- KVKK `kvkk.html` → `src/pages/kvkk.md` + `layouts/MarkdownLayout.astro` (AstroWind privacy.md düzeni) → iki dilli etiket/başlık/özet; "Google Fonts" cümlesi (TR/EN) çıkarıldı.
- 404 → `src/pages/404.astro` (AstroWind düzeni, metin TR/EN). RSS → `src/pages/rss.xml.ts`. `sitemap.xml` → `src/pages/sitemap.xml.ts` (hreflang'lı; @astrojs/sitemap kaldırıldı).
- Kaldırılan demo sayfaları: homes/*, landing/*, about, contact, pricing, services, privacy, terms, category/tag rotaları, demo yazıları ve görselleri, decapcms, `_headers`.

## Düzen ve altyapı (CSP ve adresler)

- `src/layouts/Layout.astro` → CSP meta etiketi (diyetisyen-v2 ile birebir), `boot.js` (satır içi ApplyColorMode yerine), `FontFiles.astro` (satır içi `<Font>` stili yerine `assets/css/fonts.css`), hreflang, Mizan betikleri `<script is:inline src defer>` (sıra diyetisyen-v2'deki gibi), `data-page` / `data-root` / `data-title-en` / `data-desc-en`, atlama bağlantısı. ClientRouter, Analytics, SiteVerification kaldırıldı.
- `src/pages/assets/css/fonts.css.ts` → Fonts API'nin @font-face CSS'i ayrı dosya.
- `src/components/CustomStyles.astro` → `<style is:inline>` → `<style is:global>` (paketlenir).
- `src/components/common/Image.astro` + `utils/images.ts` → public görseller için `style` niteliksiz `<img>` ve mevcut boyut kopyalarından `srcset`; OG görseli işlenmeden mutlak adres; `imgHtml()`.
- `src/utils/frontmatter.ts` → tablo sarmalayıcısı `style="overflow:auto"` yerine `overflow-auto` sınıfı.
- `src/utils/permalinks.ts` → `build.format: 'file'` adresleri (`.html`, ana sayfa ve blog listesi dizin); kanonik adreslerde `index.html` yok.
- `src/components/common/Metadata.astro` → `og:locale` tr_TR + alternatif en_US; `og:title`/`og:description` ayrı verilebilir; twitter başlık/açıklama/görsel.
- `src/components/common/Intersect.astro` → `mizan:theme` olayını da dinler.
- `src/components/Logo.astro` → "🚀 + ad" kalıbı, roket yerine kliniğin işareti. `Favicons.astro` → Mizan ikonları + manifest. `CommonMeta.astro` → `sitemap.xml`.
- `astro.config.ts` → `build.format: 'file'`, `inlineStylesheets: 'never'`, `vite.build.assetsInlineLimit: 0` (hiçbir betik/stil satır içine gömülmez), Inter `latin-ext`, `smartypants: false`, `mizan-blog-index`.
- `src/content.config.ts`, `types.d.ts`, `utils/blog.ts` → iki dilli makale alanları (`lede`, `readingTimeText`, `authorRole`, `en.*`).
- `src/assets/styles/mizan.css` (yeni) → JS'e bağlı parçaların görünümü, yalnızca AstroWind tokenlarıyla (dosya başında token → widget tablosu).

## Mizan JS (public/assets/js — `scripts/js-yamalari.py`)

- boot.js: gezegen yükleyicisi silindi; `html.dark` ilk boyamadan önce; theme-color AstroWind zeminleri.
- site.js: `applyTheme` → `html.dark` + `mizan:theme` olayı; theme-color.
- config.js: `siteUrl` template8.
- i18n.js: "template8" bloğu (a11y.rss, footer.theme, article.share, article.updated, incl.yesTitle, incl.noTitle, 404.*).
- booking.js, tools.js, content.js, chat.js: değişmedi.

## Yardımcı betikler

- `scripts/varlik-esitle.mjs` — derlemeden önce görselleri/ikonları `template8/assets`'ten `public/`'e kopyalar (tek kopya git'te).
- `scripts/mizan-parcalar.py` — diyetisyen-v2 işaretlemesini `src/components/mizan/*.astro`'ya dilimler.
- `scripts/tr-metinler.mjs` — özgün `data-i18n` Türkçe metinlerini `src/data/tr-metinler.json`'a çıkarır.
- `scripts/blog-donustur.mjs` — 6 makale + KVKK → Markdown.
- `_kaynak/yap.sh` — derle + rsync (0.7).
