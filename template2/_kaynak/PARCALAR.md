# PARCALAR — template2 (HyperUI)

Kaynak: HyperUI — https://hyperui.dev · https://github.com/markmead/hyperui (MIT) · commit `2b5aebb` (26.09.2026)
Depo kopyası: `_kaynak/indirilen/hyperui` (git'e girmez). Bütün yollar `public/examples/` altındadır; `-dark.html` koyu sürümdür.
Önizleme (referans görüntüler): `https://www.hyperui.dev/examples/<yol>.html` — hyperui.dev bileşen sayfalarındaki iframe'lerin kaynağı bu adreslerdir.

HyperUI'de ücretli / PRO bileşen yok; kullanılan her dosya MIT lisanslı depodan birebir alındı.

## Nasıl kuruldu

- Sayfa şablonları `_kaynak/sayfa/*.html`. Kurucu: `node _kaynak/sayfalari-kur.js` → `index.html`, `blog/*.html`, `kvkk.html`.
- Uzun HyperUI sınıf dizileri şablonda `{{c:ad}}` olarak yazıldı; kurucu bunları `sayfalari-kur.js` içindeki `C` tablosundan açar. Tablodaki her satırın yanında hangi HyperUI dosyasından alındığı yazılı.
- `<svg data-icon="hui:<yol>:<n>">` → ilgili HyperUI dosyasındaki n'inci `<svg>` birebir kopyalanır. `<svg data-icon="<ad>">` → Heroicons 2.2.0 `24/outline/<ad>.svg` (HyperUI örnekleri Heroicons kullanır; MIT).
- Koyu tema: açık dosyanın işaretlemesi + koyu dosyadaki farklı renk sınıfları `dark:` önekiyle (koyu dosyalar açık dosyanın birebir kopyası + `dark:` sınıfları; `_kaynak` içinde karşılaştırıldı, fark yalnız biçimlendirme boşlukları).
- JS'in ürettiği öğeler: takvim günü, saat, gün sekmesi ve tarif kartı sınıfları doğrudan JS'e yazıldı (booking.js `UI`, content.js). Pasif içerik (sonuç satırları, sohbet balonları, özet satırları, tarif penceresi içi, makale gövdesi) `_kaynak/tw.css` içinde `@apply` ile, aynı HyperUI sınıf dizilerinden kuruldu.

## Bölüm eşlemesi

Satır biçimi: **Mizan bölümü → HyperUI bileşeni → dosya yolu → değiştirilen şeyler**

| Mizan | HyperUI bileşeni | Dosya | Değiştirilenler |
|---|---|---|---|
| S1 üst menü `#site-header` | Header — "Icon on the left, links in the middle and call to actions on the right" | `marketing/headers/2.html` (+`2-dark.html`) | Sahte logo yerine Mizan "m" işareti (aynı `h-8` yuva, `text-teal-600`). Login → "Randevu al"; Register yuvası → TR/EN düğme çifti (aynı `rounded-md bg-gray-100 … text-teal-*` tokenları); menü düğmesi stiliyle tema düğmesi. 7 bağlantı `md` yerine `lg`'de görünür (Türkçe metinlerle 768'de sığmıyor). |
| S1 mobil menü `#mobile-menu` | headers/2'nin mobil görünümü | `marketing/headers/2.html` | HyperUI panel vermiyor; aynı bağlantı (`text-gray-500 …`) ve Register tokenlarıyla başlığın altında açılan düz panel. Aç/kapa site.js (`body.menu-open`, `inert`, Esc). |
| Atlama bağlantısı | Skip Links — 1 | `application/skip-links/1.html` | Metin i18n. |
| S2 hero `#top` | Banners — "Left with image" | `marketing/banners/3.html` (+dark) | SVG illüstrasyon yerine `assets/img/hero-mutfak-1200/2400.webp` (aynı `mx-auto hidden max-w-md md:block` yuvası, `w-full` eklendi). Vurgulu `<strong class="text-indigo-600">` başlığın "beslenme planı" kısmı. `w-screen` → `w-full` (kaydırma çubuğu taşması). |
| S2 `#next-slot` | Stats — "Title, value and icon" kartı | `application/stats/4.html` (+dark) | CTA'ların altına; değer = en yakın saat, etiket + uzman satırı; "Bu saati ayır" bağlantısı blog-cards/3 CTA stilinde. |
| S3 `.facts` | Stats — "Title, value and icon" | `application/stats/4.html` (+dark) | 4 kart, `sm:grid-cols-2 lg:grid-cols-4` ızgara (kaynak dikey yığın). Simgeler Heroicons: academic-cap, user-group, clock, calendar-days. |
| S4 `#hizmetler` | Feature Grids — "Grid with content" | `marketing/feature-grids/1.html` (+dark) | 6 kart; simgeler Heroicons: scale, beaker, bolt, heart, face-smile, video-camera. Her karta blog-cards/3 CTA'sı ("Randevu al →", `data-book-area`/`data-book-type`). Hizmet fotoğrafları kaynakta yuva olmadığı için kullanılmadı. |
| S5 `.notes-panel` | Cards — "Stacked with Large Image and Content" | `marketing/cards/2.html` (koyu dosya yok) | 7 kart yatay kaydırmalı sırada (`overflow-x-auto`, klavyeyle odaklanabilir). `h3` yuvası figcaption. Koyu sınıflar HyperUI eşlemesiyle türetildi (`text-gray-900→dark:text-white`). site.js sürüklemesi masaüstünde çalışır. |
| S6 `#yaklasim` | Steps — "Grouped with title and description, with highlighted current step" | `application/steps/4.html` (+dark) | 4 adım (`lg:grid-cols-4`); "current" (bg-gray-50 + sağ ok) ilk adımda. Açıklama `small` içinde `block leading-snug`. Selin Hanım'ın yaklaşım cümlesi altına düz alıntı. |
| S7 `#manifesto` | Sections — "Content with image, vertical split" | `marketing/sections/4.html` (koyu dosya yok) | h2 = manifesto 4 satırı, p = 60 dk / 48 saat / haftalık; görsel `assets/img/program-tahta-1200.webp`. |
| S8 `#uzmanlar` | Team Sections — "Base with description" | `marketing/team-sections/2.html` (+dark) | Stok fotoğraf yerine uzman fotoğrafları (`object-[50%_25%]`). LinkedIn yuvası → takvim simgeli `[data-book-staff]` bağlantısı (erişilebilir ad i18n). Eğitim/gün/dil satırları `dl` olarak eklendi. |
| S9 `#araclar` | Tabs — "Underline" | `application/tabs/4.html` (+dark) | Seçili durum `aria-selected:` varyantıyla (tools.js aria-selected değiştiriyor). Mobilde 1. sekme "VKİ" kısaltması. |
| S9 form alanları | Inputs — "Base", "Base with icon" | `application/inputs/1.html`, `application/inputs/2.html` (+dark) | inputs/2'deki sağ simge yuvası birim (cm/kg/yaş/dk) için. |
| S9 kaydırıcı | Range Inputs — "Base" | `application/range-inputs/1.html` (koyu dosya yok) | `dark:bg-gray-700` (steps/1 iz rengi). VKİ ölçeğindeki işaretçi aynı tutamaç tokenı. |
| S9 radyo seçenekleri | Radio Groups — "Base" | `application/radio-groups/1.html` (+dark) | Cinsiyet/hedef/hava/özel durum. Klavye odağı için `has-focus-visible:outline-*`. |
| S9 sonuç kartı | Stats — "Title, value and icon" | `application/stats/4.html` | Değer `text-2xl font-medium`, etiket `text-sm text-gray-500`; makro çubukları steps/1 ilerleme çubuğu. |
| S10 `#program` | Tabs — "Pills" + Cards tipografisi | `application/tabs/5.html` (+dark), `marketing/cards/2.html` | Hedef (role=radio → `aria-checked:`) ve gün (role=tab → `aria-selected:`) hapları. Öğün adı/içeriği cards/2 h3/p ölçeği. Toplam/not kutuları stats/4 kartı. |
| S11 `#tarifler` kartları | Blog Cards — "Bordered with image, date, title and excerpt, shadow on hover" | `marketing/blog-cards/1.html` (+dark) | content.js'te üretilir. Tarih yuvası = "kategori · süre", özet = "kcal · etiketler". |
| S11 filtreler | Button Groups — "Base" | `application/button-groups/1.html` (+dark) | 6 düğme; seçili `aria-pressed:bg-gray-100` (kaynakta seçili durum yok). Dar ekranda yatay kaydırma. |
| S11 `#recipe-dialog` | Modals — "Base with close" | `application/modals/2.html` (+dark) | `<dialog closedby="any">` aynen; başlık satırı statik `#recipe-title`, içerik `.dialog-scroll` içinde kayar. Etiketler Badges/1, porsiyon Quantity Inputs/1 tokenları. |
| S12 `#ucretler` | Pricing — "Options with tier, price, features and call to action with highlighted option" | `marketing/pricing/1.html` (koyu dosya yok) | 3 seçenek, vurgulanan "Tek görüşme (İlk görüşme)", doğal sırada ilk. `max-w-3xl`→`max-w-6xl`, `md:grid-cols-3`. Koyu sınıflar türetildi. Kurumsal satır stats/4 kartı; "Neler dahil" listesi pricing/1 özellik listesi. |
| S13 adım göstergesi | Steps — "Title, icon and progress bar" | `application/steps/1.html` (+dark) | 4 adım; çubuk genişliği booking.js'te `adım × %25`. `is-current/is-done` → `[&.is-*]:text-blue-600`. |
| S13 görüşme türü, uzman | Radio Groups — "Base with input" | `application/radio-groups/2.html` (+dark) | Uzman kartlarında fotoğraf; uygun olmayan uzman `has-disabled:opacity-50`. |
| S13 konu | Radio Groups — "Base" | `application/radio-groups/1.html` | — |
| S13 form | Inputs — "Base" | `application/inputs/1.html` | Hata durumu `aria-invalid:border-red-500` (toasts/2 kırmızısı). |
| S13 takvim günleri | Button Groups — "Base" + Radio Groups seçili durumu | `application/button-groups/1.html`, `application/radio-groups/1.html` | booking.js `UI.day` (`aria-pressed:border-blue-600 ring-1`). Kapalı gün `bg-gray-100`, bugün `text-blue-600`. |
| S13 saatler | Radio Groups — "Base" | `application/radio-groups/1.html` | booking.js `UI.slot`. |
| S13 boş gün | Empty States — "Create first item" | `application/empty-states/1.html` (+dark) | booking.js `emptyState()`: simge + başlık + "Sonraki uygun güne geç" düğmesi. |
| S13 özet, `#cancel-dialog` | Stats/4 kartı + FAQs/2 chevron; Modals/2 | `application/stats/4.html`, `marketing/faqs/2.html`, `application/modals/2.html` | Özet `<details>` (mobilde kapalı). |
| S14 `#blog`, `blog/index.html`, ilgili yazılar | Blog Cards — "Bordered with image, title, excerpt and call to action" | `marketing/blog-cards/3.html` (+dark) | Başlık üstüne blog-cards/1 tarih yuvası tokenıyla kategori · tarih · süre. CTA "Devamını oku". |
| S14 makale sayfaları, `kvkk.html` | (HyperUI'de makale şablonu yok) | Breadcrumbs/1, Toasts/3–4, CTAs/1, sections/4 ve feature-grids/1 ölçeği | Sade düzen: application/breadcrumbs/1, başlık feature-grids/1 h2 ölçeği, gövde h2 sections/4 ölçeği, uyarı kutuları toasts/4 (Info) ve toasts/3 (Warning), randevu kutusu ctas/1 içeriği. `tw.css` → `.prose`, `.article-*`. |
| S15 `#sss` | FAQs — "Divided with chevrons" | `marketing/faqs/2.html` (+dark) | `<details>` JS'siz; soru `h3`. `#faq-schema` site.js ile. |
| S16 `.sky` | CTAs — "Base with content and call to action on the left, image on the right" | `marketing/ctas/1.html` (+dark) | Görsel `assets/img/sofra-1000.webp`; düğme WhatsApp. |
| S17 `#iletisim` | Contact Forms — "Side-by-side form with description" | `marketing/contact-forms/5.html` (+dark) | Alan name/id'leri aynen (`c-name`, `c-email`, `c-phone`, `c-topic`, `c-message`, `kvkk`, `website`). Sol sütuna WhatsApp, Instagram, çalışma saatleri tablosu. |
| S18 `.site-footer` | Footers — "Company info and links" | `marketing/footers/10.html` (+dark) | Logoipsum yerine Mizan işareti + yazısı; sosyal: Instagram (footers/10'daki ikon) + WhatsApp; "Live Chat" yuvası → "Canlı asistan" (sohbeti açar; ping yalnız `motion-safe`). |
| S19 `#chat` | (HyperUI'de sohbet yok) | Kabuk `application/modals/2.html`, balonlar `marketing/cards/1.html`, hızlı yanıt `application/tabs/5.html` | `tw.css` → `.chat*`, `.bubble*`, `.quick`. Yüzen düğmeler ctas/1 emerald ve banners/3 indigo. |
| S19 `M.toast` | Toasts — "Success" | `application/toasts/1.html` (+dark) | site.js metni `[data-toast-text]`'e yazar. |
| S20 demo şeridi | Announcements — 1 | `marketing/announcements/1.html` (+dark) | site.js'in ürettiği `.demo-bar` sınıfları `tw.css`'te. |

## Kaynak görselleri ve yer tutucular
- HyperUI'deki Unsplash fotoğrafları, "logoipsum" logosu, Lorem ipsum ve `$240.94` gibi sahte değerlerin hiçbiri kalmadı.
- banners/3 illüstrasyonu (HyperUI'nin kendi SVG'si) kullanılmadı; promt gereği fotoğraf konuldu.

## Font
- HyperUI örnekleri `font-sans` sınıfını kullanır ve önizleme CSS'i (`src/styles/component.css`) bunu `--font-sans: 'Google Sans Flex', sans-serif` olarak tanımlar. Aynı tanım `tw.css`'te; font Google Fonts'tan (CSP'de zaten izinli).
