# DURUM — template2 · HyperUI

- **Tarih:** 27 Eylül 2026
- **Kaynak:** HyperUI — https://hyperui.dev · https://github.com/markmead/hyperui · MIT · commit `2b5aebb` (26.09.2026)
- **Tür:** T (tasarım baştan; sinematik katman kaldırıldı)
- **Teknoloji:** Saf HTML + Tailwind CSS 4.3.3 + @tailwindcss/forms 0.5.11. HyperUI JS getirmez; sitenin kendi JS dosyaları aynen çalışır.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template2/
- **Yerel önizleme:** http://localhost:8801/50-website/template2/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template2` · git'e giren boyut ≈ 17,9 MB (100 MB'ı aşan dosya yok)

## Ne yapıldı

1. `diyetisyen-animasyon-v2` kopyalandı, adresler `50-website/template2` yapıldı, `og:title`/`twitter:title` = "Diyetisyen web sitesi · Template 2 (HyperUI)".
2. HyperUI deposu `_kaynak/indirilen/hyperui`'ye klonlandı; kullanılan 22 bileşen grubunun ham HTML'i (`public/examples/…`) okunup sayfa şablonlarına birebir aktarıldı. Her bileşenin açık/koyu önizlemesi `_referans/kaynak-<grup>-<n>(-dark).jpg`.
3. Sayfalar `_kaynak/sayfalari-kur.js` ile kuruluyor (tekrar çalıştırılabilir). Üst menü, footer, sohbet kabuğu ve bildirim tek kaynaktan 9 sayfanın hepsine giriyor. Blog/KVKK sayfalarının içeriği özgün dosyalardan alınıp HyperUI düzenine çevriliyor.
4. Koyu tema: açık dosya işaretlemesi + koyu dosyadaki renk sınıfları `dark:` önekiyle. `boot.js` ilk boyamadan önce, `site.js → applyTheme` her değişimde `<html class="dark">`'ı ayarlıyor ve `mizan:theme` olayını yayınlıyor.
5. JS'in ürettiği takvim günleri, saatler, gün hapları ve tarif kartları HyperUI sınıflarıyla üretiliyor; geri kalan dinamik içerik `tw.css` içinde aynı sınıf dizileriyle (`@apply`) giydirildi.

### Bölüm eşlemesi (özet — ayrıntı `_kaynak/PARCALAR.md`)

| Mizan | HyperUI dosyası |
|---|---|
| S1 üst menü | `marketing/headers/2` (+ `application/skip-links/1`) |
| S2 hero + `#next-slot` | `marketing/banners/3` + `application/stats/4` kartı |
| S3 kısa bilgiler | `application/stats/4` |
| S4 hizmetler | `marketing/feature-grids/1` |
| S5 mevsim notları | `marketing/cards/2` (yatay kaydırmalı sıra) |
| S6 yaklaşım | `application/steps/4` |
| S7 manifesto | `marketing/sections/4` |
| S8 uzmanlar | `marketing/team-sections/2` |
| S9 araçlar | `application/tabs/4` + `application/inputs/1-2` + `application/range-inputs/1` + `application/radio-groups/1` + sonuç `application/stats/4` |
| S10 örnek program | `application/tabs/5` + `marketing/cards/2` tipografisi |
| S11 tarifler | `marketing/blog-cards/1` + filtre `application/button-groups/1` + pencere `application/modals/2` |
| S12 ücretler | `marketing/pricing/1` (vurgulu: "Tek görüşme / İlk görüşme") |
| S13 randevu | `application/steps/1` + `application/radio-groups/1-2` + `application/inputs/1` + takvim/saat `button-groups/1`·`radio-groups/1` + boş gün `application/empty-states/1` |
| S14 blog | `marketing/blog-cards/3`; makale ve KVKK sayfaları aynı tokenlarla sade düzen |
| S15 SSS | `marketing/faqs/2` |
| S16 "afiyet olsun" | `marketing/ctas/1` |
| S17 iletişim | `marketing/contact-forms/5` |
| S18 footer | `marketing/footers/10` |
| S19 sohbet / bildirim | kabuk `application/modals/2`, balon `marketing/cards/1`; bildirim `application/toasts/1` |
| S20 demo şeridi | `marketing/announcements/1` |

## Kaynaktan farklar ve nedenleri

1. **Font:** Promt "HyperUI örnekleri sistem sans (font-sans) kullanır" diyor; ölçülen durum farklı: HyperUI'nin önizleme CSS'i (`src/styles/component.css`) `font-sans`'ı `'Google Sans Flex', sans-serif` olarak tanımlıyor ve bütün önizlemeler bu fontla görünüyor. Görünüşün aynısı için `font-sans` sınıfı korundu ve aynı tanım `tw.css`'e kondu; font Google Fonts'tan geliyor (CSP'de zaten izinli, yeni kaynak yok). Sistem fontuna dönmek için `tw.css`'teki `@theme` bloğunu ve `<head>`'deki font bağlantısını silmek yeterli.
2. **Erişilebilirlik için renk tonları (axe ciddi ihlal 0 şartı):** HyperUI'nin bazı renk çiftleri 4.5:1'in altında kalıyordu. Yalnız işaretlenen yerlerde bir ton değiştirildi:
   - Üst menü "Randevu al": `bg-teal-600` → `bg-teal-700` (beyaz yazı 3,66 → 5,4); TR/EN seçili `text-teal-700`, seçili olmayan `text-gray-600`.
   - Footer alt bağlantıları `text-teal-600` → `text-teal-700`.
   - ctas/1 ve makale kutusu düğmesi `bg-emerald-600` → `bg-emerald-700`.
   - Koyu temada mavi/indigo metin bağlantıları (`text-blue-600`, `text-indigo-600`, hero vurgusu, ücret kartı çerçeveli düğmeleri) `dark:text-blue-400` / `dark:text-indigo-400`. HyperUI'nin koyu dosyaları bunları `-600` bırakıyor.
   - Adım göstergesinde etkin adım yazısı `text-blue-500` → `text-blue-600` (çubuk `bg-blue-500` kaldı).
3. **Üst menü:** Bağlantılar HyperUI'deki `md` yerine `lg`'de görünür (7 Türkçe bağlantı + 3 eylem 768 px'e sığmıyor). HyperUI mobil panel vermediği için panel, aynı bağlantı ve düğme tokenlarıyla başlığın altında açılan düz bir liste. Başlık HyperUI'deki gibi yapışkan değil.
4. **Hero:** `w-screen` → `w-full` (1024–1279 px'te kaydırma çubuğu kadar yatay taşma yapıyordu); görsele `w-full` eklendi (768 px'te 72 px taşma). Görsel HyperUI'deki gibi mobilde gizli. Özgün "Moda, Kadıköy · Yüz yüze ve online" üst satırı için yuva olmadığından kaldırıldı.
5. **Bölüm başlıkları:** HyperUI bileşenlerinin çoğunda başlık yok; eksik olanlara feature-grids/1'in başlık bloğu (`text-3xl/tight font-bold … sm:text-4xl`) kondu. Özgün sitedeki küçük "etiket" üst başlıkları (Hizmetler, Ekip…) HyperUI'de karşılığı olmadığından kullanılmadı.
6. **Steps/4:** 3 yerine 4 adım (`lg:grid-cols-4`, oklar `lg`'de); "current" promt gereği ilk adımda. Adım açıklamaları uzun olduğu için `small` satırına `block leading-snug` eklendi.
7. **Pricing/1:** 2 yerine 3 seçenek (`max-w-6xl`, `md:grid-cols-3`); vurgulu seçenek fiyat sırasına uysun diye `sm:order-last` kullanılmadı, ilk sırada. Seçeneklerin kısa açıklaması (özgün içerik) fiyatın altına eklendi.
8. **Koyu dosyası olmayan bileşenler** (`cards/2`, `sections/4`, `pricing/1`, `range-inputs/1`): koyu sınıflar HyperUI'nin diğer dosyalarındaki eşlemeyle türetildi (`text-gray-900→white`, `text-gray-700→gray-200`, `border-gray-200→gray-700`, `bg-gray-300→gray-700`).
9. **Durum görünümleri:** button-groups/1'de seçili durum yok; tarif filtresinde `aria-pressed:bg-gray-100` (hover tonunun bir üstü) eklendi. Radyo kartlarına klavye odak çerçevesi (`has-focus-visible:outline-*`) eklendi.
10. **Hizmetler:** feature-grids/1'de görsel yuvası olmadığı için hizmet fotoğrafları kullanılmadı; her karta blog-cards/3'ün "→" bağlantısıyla randevu bağlantısı eklendi.
11. **Uzmanlar:** team-sections/2'deki LinkedIn yuvası takvim simgeli randevu bağlantısı oldu (`[data-book-staff]`, erişilebilir adı "Selin Hanım'dan randevu al"). Portreler 16:9 kırpıldığı için yüz görünsün diye `object-[50%_25%]`.
12. **Mevsim notları:** Özgün dağınık "masa" düzeni yerine promttaki gibi yatay kaydırmalı sıra; sürükleme (site.js) masaüstünde çalışıyor.
13. **Blog kartları:** blog-cards/3'e, blog-cards/1'in tarih yuvası tokenıyla (`text-xs text-gray-500`) kategori · tarih · okuma süresi satırı eklendi.
14. **VKİ ölçeği:** Kategori renkleri tek tonlu mavi dizi (blue-200 → blue-600); yargılayıcı kırmızı/turuncu yok.
15. **Modal koyu arka planı:** HyperUI koyu dosyasındaki `dark:backdrop:bg-white/50` aynen bırakıldı (kaynakta böyle).
16. **Kullanılmayan dosyalar:** `assets/video/hero.mp4` ve `hero-gezegen-*.jpg` artık hiçbir yerde kullanılmadığı için silindi (6,7 MB).

## CSP

Değişiklik **yok**. `Content-Security-Policy` meta etiketi 9 sayfanın hepsinde özgün dosyayla birebir aynı (karşılaştırıldı). Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) zaten izinliydi. Satır içi `style` niteliği kullanılmadı; JS'in yaptığı `element.style` atamaları CSP'ye takılmıyor.

## Eklenen / değişen / silinen dosyalar

| Dosya | Durum | Boyut |
|---|---|---|
| `assets/css/tw.css` | yeni (derlenmiş Tailwind + forms + HyperUI bileşen kuralları) | 107,6 KB (gzip 15,5 KB) |
| `assets/vendor/hyperui/LICENSE`, `heroicons/LICENSE`, `tailwindcss/LICENSE` | yeni | — |
| `assets/vendor/KAYNAKLAR.md` | yeniden yazıldı | — |
| `index.html`, `blog/*.html`, `kvkk.html` | HyperUI işaretlemesiyle yeniden kuruldu | — |
| `assets/js/boot.js` | gezegen yükleyicisi bloğu silindi; `dark` sınıfı ve tema rengi | 0,9 KB |
| `assets/js/site.js` | tema senkronu (+`mizan:theme`), menü kırılımı 1024 px, bildirim metni `[data-toast-text]`'e | küçük yama |
| `assets/js/booking.js` | `UI` sınıf tablosu (takvim günü, saat, boş durum), adım çubuğu genişliği | küçük yama |
| `assets/js/content.js` | gün hapları ve tarif kartı sınıfları, pencere başlığı statik `#recipe-title` | küçük yama |
| `assets/js/i18n.js` | yeni anahtarların İngilizcesi (hero.t1–3, hero.imgAlt, notes.rowAria, process.stepsTitle, booking.stepsTitle, blog.readMore, post2–6.excerpt, footer.help/kvkkShort/assistant, toast.title) | — |
| `site.webmanifest` | tema/arka plan rengi `#ffffff` | — |
| `assets/css/site.css`, `premium.css`, `motion.css`, `assets/js/motion.js`, `assets/vendor/` GSAP + Lenis, `assets/video/`, `hero-gezegen-*.jpg` | silindi | — |

Şablonun eklediği JS: **0 KB** (HyperUI JS getirmiyor). Önceki sürümün GSAP/Lenis/motion.js yükü (gzip 84 KB) kalktı. Sitenin JS toplamı gzip ≈ 79,5 KB.

## Test sonuçları (0.9) — `_kaynak/test/protokol.js`, ham çıktı `_kaynak/test/sonuc.json`

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1 | Konsol (ana sayfa, blog, makale, KVKK) | Geçti | 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti | Ek olarak 320, 360, 640, 768, 1024, 1100, 1280 px'te TR ve EN taşma yok |
| 3 | Özellik sözleşmesi | Geçti | Eksik seçici 0. `.servings` ve `[data-intent]` özgün sitede de çalışma anında üretiliyor; tarif penceresi ve sohbet açılınca kontrol edildi. `.cal-day`/`.slot` randevu adımında var |
| 4 | Randevu (demo) | Geçti | İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi / test@example.com / 05321234567 / KVKK → özet (8 satır) → onay `MZ-…`; `.ics` indirildi, Google Takvim bağlantısı var; iptal penceresi açılıyor ve boş formda iki hata veriyor; boş adım-3 formunda 4 hata |
| 5 | Araçlar | Geçti | 170 cm / 70 kg → **24,2**; kalori 1.730 kcal; 3 bardak yenilemeden sonra korunuyor |
| 6 | Program ve tarifler | Geçti | Gün ve hedef değişiyor (1.450 → 2.600 kcal); filtre 9 → 2; pencere açılıyor; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | Geçti | "ücretler" → ücret listesi (1.800 TL…); "randevu" → "Yarın, saat 09:00"; "Beni arayın" akışı → demo yanıtı |
| 8 | Dil ve tema | Geçti | Sayfa ortasında TR→EN, `?lang=en`, EN'de Türkçe kalan metin 0 (özel ad ve yemek adları hariç); açık↔koyu; yenilemede ikisi de korunuyor |
| 9 | Erişilebilirlik (axe 4.13) | Geçti | Ana sayfa açık/koyu, makale açık/koyu, ayrıca takvim, tarif penceresi ve sohbet açıkken (açık TR, koyu EN): **hiç ihlal yok** (ciddi/kritik 0, toplam 0) |
| 10 | Hareket azaltma | Geçti | Sonsuz animasyon 0 (footer'daki ping yalnız `motion-safe`), gizli bölüm 0 |
| 11 | JS kapalı | Geçti | Bütün bölümler görünür, metin okunuyor. Araç sonuçları, tarif kartları ve öğün listesi JS ile üretildiği için boş (özgün sitede de öyle) |
| 12 | Ekran görüntüleri | Geçti | `_referans/sonuc-1440(-dark).jpg`, `sonuc-390(-dark).jpg`, her bileşen için `sonuc-<grup>-<n>.jpg` ve `-dark.jpg`; makale, blog, KVKK; takvim, onay, iptal, boş gün, bildirim, sohbet, mobil menü |
| Ek | Mobil menü | Geçti | Açılıyor (`inert` kalkıyor), Esc ile kapanıyor |
| Ek | Boş gün durumu | Geçti | Saat ilerletilince seçili günde empty-states/1 görünümü |

**Karşılaştırma turları:** 1. tur (1440 ve 390, açık): fiyatlandırma başlığındaki çift boşluk ve footer'da taşan e-posta düzeltildi. 2. tur (koyu, `kaynak-*-dark` / `sonuc-*-dark` çiftleri): header, hero, stats, feature grid, steps, team, footer, FAQ ve iletişim formu HyperUI koyu dosyalarıyla aynı renklerde; farklar yalnız yukarıdaki 2. maddedeki erişilebilirlik tonları. Ara genişlik kontrolünde 768 px hero taşması bulundu ve düzeltildi.

## Bilinen sorunlar / notlar

- Başlık yapışkan değil (HyperUI headers/2 gibi); sayfa aşağıdayken menüye yukarı çıkarak ulaşılıyor, yüzen WhatsApp/sohbet düğmeleri her yerde.
- banners/3 görseli ve ctas/1 paragrafı HyperUI'deki gibi mobilde gizli.
- i18n.js'te artık kullanılmayan sinematik katman anahtarları (film.*, cursor.*, loader.*, tag.*) duruyor; zararsız.
- Referans görüntüler hyperui.dev'in önizleme sayfalarından (`/examples/…`) alındı; bunlar bileşen sayfasındaki iframe'lerin kendisi.
