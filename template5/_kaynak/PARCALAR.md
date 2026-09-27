# PARÇALAR — template5 (Landwind)

Satır biçimi: `Mizan bölümü → kaynak bileşen → URL / dosya yolu → değiştirilen şeyler`

Kaynaklar:
- **Landwind** — https://github.com/themesberg/landwind (MIT, commit `f8be851`, 20.02.2023) · demo https://demo.themesberg.com/landwind/ · klon: `_kaynak/indirilen/landwind/index.html`
- **Flowbite belgeleri** (Landwind'de olmayan bölümler için) — https://github.com/themesberg/flowbite etiket `v2.5.2` (MIT, commit `5c8df35`), `content/**.md`. Tailwind v3 sınıflı son belge sürümü; örnekler `_kaynak/test/dok-al.js` ile `_kaynak/bilesenler/<id>.html`'e birebir döküldü. Hepsi ücretsiz, açık kaynak belge örnekleri (PRO parça yok).
- **Flowbite JS/eklenti** 1.4.7 (npm, MIT) — Landwind'in `package.json`'ındaki sürüm.
- **Flowbite Icons** 1.5.0 (npm, MIT) — Landwind'de karşılığı olmayan simgeler.

Vurgu rengi: Landwind'in kendisi gibi `purple` (düğme `bg-purple-700 / dark:bg-purple-600`, bağlantı `text-purple-600`). Flowbite belgelerindeki `blue-*` sınıfları, Flowbite'ın kendi "Purple" düğme varyantıyla (`default-button-example`) değiştirildi. Koyu temada küçük metinde `purple-500` → `purple-400` (kontrast, axe).

## Landwind blokları (index.html sırası)

| Mizan | Landwind bloğu | Dosya | Değişenler |
|---|---|---|---|
| S1 üst menü `#site-header` | `<header class="fixed w-full">` nav | landwind/index.html (header) | Logo → `assets/icons/favicon.svg` + "Mizan"; "Download" → "Randevu al" (`#randevu`); GitHub yıldız düğmesinin yerinde TR/EN + tema düğmesi (Flowbite `customize/dark-mode` "theme-toggle" SVG'leri); 6 örnek bağlantı → 7 Mizan bağlantısı; "Home" etkin görünümü `aria-current` ile (site.js kaydırma izleyicisi, blog sayfalarında Blog); header'a `z-40`; hamburger/kapat simgesi `aria-expanded`'a göre değişiyor (Landwind'de ikinci SVG hiç görünmüyor); sm altında TR/EN + tema mobil menünün içinde |
| S2 hero `#top` | "Building digital products & brands" | landwind/index.html (hero) | `images/hero.png` (1064×832) → `hero-gezegen-son.jpg` aynı `width/height` ve `object-cover`; "View on GitHub" / "Get Figma file" → "Randevu al" / "VKİ'nizi hesaplayın" (aynı sınıflar, Font Awesome Pro GitHub simgesi ve Figma logosu yerine Flowbite Icons `calendar-month` / `chart-pie`); düğmelerin altında `#next-slot` = Flowbite `card` "Card with CTA button" tokenları (bg-white, border-gray-200, rounded-lg, shadow), yatay |
| — | Logo bulutu (airbnb, Google, Microsoft, Spotify, Mailchimp, Mashable) | landwind/index.html | **Kaldırıldı** (sahte marka logosu, kurallar 0.5) |
| S4 hizmetler `#hizmetler` | Özellik satırı 1 "Work with tools you already use" | landwind/index.html (feature row 1) | Görsel `feature-1.png` → `hizmet-kilo-1200.webp` (+700w srcset); onay listesi 3 → 6 hizmet: başlık + tek satır açıklama (hizmetin etiketleri) + sonda `data-book-area` bağlantısı (online: `data-book-type="online"`, özgündeki gibi); listenin altındaki tekrar paragrafı kullanılmadı |
| S6 yaklaşım `#yaklasim` | Özellik satırı 2 "We invest in the world's potential" | landwind/index.html (feature row 2) | Görsel `feature-2.png` → `surec-mutfak-1200.webp`; onay listesi = 4 adım (başlık · süre + bir cümle); alt paragraf kullanılmadı |
| S3 kısa bilgiler `.facts` | İstatistik "Trusted by over 600 million users…" | landwind/index.html (stats) | "Trusted Worldwide" → "Moda, Kadıköy" (purple-600); 4 rakam 12 yıl / 3 uzman / 60 dk / 7 gün; iki bağlantı → "Diyetisyenlerimizi tanıyın", "Google Haritalar'da yol tarifi al"; simgeler: Landwind `users` + Flowbite Icons `award`, `clock`, `calendar-month` (sunucu/sepet/küre ilgisiz) |
| Alıntı | figure/blockquote (Micheal Gough) | landwind/index.html (testimonial) | **Danışan yorumu değil**: Uzm. Dyt. Selin Karaca'nın diyetisyen-v2 yaklaşım alıntısı, fotoğraf `uzman-selin-560.webp`, rol "kurucu"; flowbite.s3 avatarı kaldırıldı |
| S12 ücretler `#ucretler` | Fiyat "Designed for business teams like yours" | landwind/index.html (pricing) | Starter/Company/Enterprise → İlk görüşme / Kontrol görüşmesi / Online görüşme; ücret ve süre `config.js`'ten (kurucu betik config ile HTML'i karşılaştırır); özellikler diyetisyen-v2 ücret kartlarının maddeleri; "/month" → "TL / 60 dk · Klinikte"; "Get started" → "Randevu al" (`data-book-type`). Altına aynı kart tokenlarıyla 2 paket (Aylık takip, 3 aylık program), kurumsal satır ve "neler dahil" listesi (Landwind yeşil onay simgesi + Flowbite Icons `minus`) |
| S15 SSS `#sss` | FAQ (`#accordion-flush`, `data-accordion="collapse"`) | landwind/index.html (faq) | 4 → 10 soru; her soru `.faq` sarmalayıcısında (site.js FAQPage JSON-LD'si); cevap gövdesi `.faq-a`; soru metni `<span data-i18n>`'de (simge korunuyor); üstte `pt-8 lg:pt-24` (öncesinde gri bölüm var; Landwind'de fiyatla aynı beyaz bantta); altta "Asistana sorun / WhatsApp" satırı |
| CTA | "Start your free trial today" | landwind/index.html (cta) | Başlık/metin Mizan; düğme "İlk görüşmeyi planla" → `#randevu` (`data-book-type="first"`) |
| S18 footer `.site-footer` | `<footer>` 5 sütun + hr + logo + telif + sosyal | landwind/index.html (footer) | Sütunlar: Klinik / Kaynaklar / Yardım / Adres ve iletişim / Dil; logo Mizan; telif satırında KVKK bağlantısı (altı çizili: axe `link-in-text-block`); sağlık uyarısı; sosyal: yalnız Instagram (Landwind SVG) + başa dön; "Designed by asteria.soft" |

## Landwind'de olmayan bölümler (Landwind bölüm kalıbı + Flowbite v2.5.2 belge örnekleri)

Kalıp: `section bg-white / bg-gray-50` sırası, `max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6`, h2 `text-3xl font-extrabold tracking-tight`, p `font-light text-gray-500 sm:text-xl`.

| Mizan | Flowbite belge örneği | Dosya | Değişenler |
|---|---|---|---|
| S7 yöntem `#manifesto` | Landwind ortalanmış başlık + istatistik rakam tipografisi | landwind/index.html | Mor etiket + 4 satırlık başlık (son satır purple) + 3 rakam |
| S5 mevsim notları `.notes-panel` | `components/gallery` "Default gallery" | bilesenler/default-gallery-example.html | 7 görsel, `aspect-square object-cover`, altyazı; sürükleme yok (`data-note` kaldırıldı) |
| S8 uzmanlar `#uzmanlar` | `components/card` "Card with image" | bilesenler/card-image-example.html | 3 kart; kurucu rozeti = `components/badge` purple; eğitim/gün/dil = `components/list-group`; düğme purple, `data-book-staff` |
| S9 araçlar `#araclar` | `components/tabs` "Tabs with underline", `forms/range`, `forms/input-field`, `forms/radio` "Bordered", `forms/select`, sonuç `components/card` | bilesenler/tabs-underline-example.html vb. | Sekme davranışı tools.js'te (`aria-selected` → etkin sınıflar); Flowbite tabs JS'i kullanılmadı; birim etiketi koyuda gray-300 |
| S13 randevu `#randevu` | `components/stepper` "Default", `forms/radio` "Advanced layout" + "Bordered", `forms/input-field` (+ Validation), `forms/checkbox`, özet `components/list-group`, onay `components/toast` "Colors" (success) | bilesenler/default-stepper-example.html vb. | Advanced radio: girdi etiketin içinde `sr-only` (klavye), `peer-checked` → `has-[:checked]`; takvim görünümü Flowbite 1.4.7 `dist/datepicker.js` şablon sınıfları (çizim booking.js) |
| S11 tarifler `#tarifler` | `components/card` "Card with image", filtre `components/buttons` "Alternative" (seçili: Purple), pencere `components/modal` "Default modal" | bilesenler/card-image-example.html, default-modal-example.html | `#recipe-dialog` `<dialog>` olarak kaldı; başlık modal başlık satırında (`#recipe-title`, content.js 2 satır) |
| S10 program `#program` | `components/tabs` "Pills tabs", öğünler `components/timeline` "Default timeline", yan kart `components/card` + `components/progress` | bilesenler/tabs-pill-example.html, default-timeline-example.html | Öğün listesi zaman çizelgesi (`.meal::before` nokta); program görseli kartın üstünde |
| S14 blog `#blog` + `blog/index.html` | `components/card` "Card with image" × 6 | bilesenler/card-image-example.html | Kategori · tarih · okuma süresi; "Devamını oku" purple düğme |
| S16 "afiyet olsun" `.sky` | Landwind özellik satırı kalıbı (görsel + metin) | landwind/index.html | `sofra-1000/2000.webp`; WhatsApp (purple) + Bizi arayın / Yol tarifi (Alternative); görsel mobilde de görünür |
| S17 iletişim `#iletisim` | `forms/input-field`, `forms/select`, `forms/textarea`, `forms/checkbox`, `components/card`, `components/list-group` | bilesenler/default-input-field-example.html vb. | Saat tablosunda bugün satırı vurgulu; açık/kapalı noktası |
| S19 sohbet `#chat` | `components/drawer` (sağdan), `components/chat-bubble` "Default", bot avatarı `components/avatar` "Placeholder initials", hızlı yanıtlar "Pills tabs", yüzen düğmeler `components/speed-dial` tetikleyicisi | bilesenler/chat-bubble-example.html, default-drawer-example.html | Kullanıcı balonu aynalanmış (rounded-s-xl rounded-ee-xl, purple); aç/kapat chat.js; çekmece `sm:w-96` |
| S20 demo şeridi | `components/banner` "Bottom banner" | bilesenler/bottom-banner-example.html | Sabit başlıkla çakışmasın diye altta; yüzen düğmeler şerit yüksekliği kadar yukarı |
| Bildirim (M.toast) | `components/toast` "Colors" → `#toast-success` | bilesenler/toast-colors-example.html | Kapatma düğmesi yok (site.js kapatır), `top-20 right-5` |
| Makale / KVKK tipografisi | Landwind h1/h2/p ölçeği; `components/breadcrumb` "Default"; `components/alerts` (callout); tablolar `components/tables` görünümü | bilesenler/default-breadcrumb-example.html | `.prose` kuralları tw.css'te Landwind tokenlarıyla; ilk bölüm `pt-24 lg:pt-28` (sabit başlık) |

## Kaynak illüstrasyonları

Landwind'in `images/hero.png`, `feature-1.png`, `feature-2.png` ve `logo.svg` dosyaları (MIT) **kullanılmadı**: konu (SaaS panoları, hedef tahtası) diyetisyen sitesiyle uyuşmuyor ve promt Mizan görsellerini istiyor. Landwind'in Font Awesome Pro GitHub simgesi (ticari lisans) ve Figma logosu da kaldırıldı.
