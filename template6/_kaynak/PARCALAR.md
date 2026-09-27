# PARÇALAR — template6 (Tailwind Toolbox "Landing Page")

Kaynak: https://github.com/tailwindtoolbox/Landing-Page (MIT, commit `545f89e`) → `_kaynak/indirilen/Landing-Page/index.html` (tek dosya).
Satır biçimi: Mizan bölümü → kaynak bileşen → dosya/satır → değiştirilen şeyler.

| Mizan bölümü | Kaynak bileşen | Kaynak yeri | Değiştirilenler |
|---|---|---|---|
| S1 üst menü `#site-header` | `<nav id="header">` sabit menü + `#nav-toggle` / `#nav-content` / `#navAction` | index.html 25–69, betikler 700–780 | id `header` → `site-header` (sözleşme); uçak SVG → Mizan "m" işareti (aynı `h-8 fill-current inline` yuvası); 3 bağlantı → 7; "Action" → "Randevu al" (`#randevu`); TR/EN + tema düğmesi eklendi; menü kırılımı `lg` → `xl` (7 Türkçe bağlantı + dil + tema 1024 px'e sığmıyor) |
| Kaydırma davranışı | index.html sonundaki betik | 700–743 | Aynı sınıf değişimleri; `assets/js/toolbox-nav.js` (CSP). İlk yüklemede de bir kez çalışır |
| Mobil açılır menü | index.html sonundaki ikinci betik | 744–780 | `document.onclick` → `addEventListener`; `aria-expanded`, Escape, bağlantıya dokununca kapanma eklendi |
| S2 hero `#top`, `#next-slot` | Hero (sol metin, sağ `hero.png`) | 70–91 | Kicker/başlık/alt metin Mizan'dan; "Subscribe" → "Randevu al"; ikinci CTA (sözleşme: 2 CTA) kaynağın `#navAction` ilk hâli tokenlarıyla; `#next-slot` beyaz kart + `shadow-lg` + `rounded`; görsel `hero-gezegen-son.jpg` (`rounded shadow-lg`) |
| Dalga (hero altı) | `div.relative -mt-12 lg:-mt-24` SVG | 92–110 | Birebir; dolu katmana `.wave-fill-white` (koyu temada gray-900) |
| S3 kısa bilgiler `.facts` | — (kaynakta yok) | bölüm kalıbı | `section bg-white border-b py-8` + ilk Title bölümünün kabı; 4 rakam `text-5xl font-bold`, altında kısa gradyan çubuk |
| S6 yaklaşım `#yaklasim` | İlk "Title" bölümü (iki dönüşümlü satır + unDraw) | 111–429 | Satır 1 "İlk görüşme" (ön görüşme, vücut analizi), satır 2 "Takip" (kişisel plan, takip + Selin Karaca alıntısı). unDraw SVG'leri **birebir** (renkler değişmedi; `<title>` silindi, `aria-hidden`). "Images from: undraw.co" → "Çizimler: undraw.co". Karar: unDraw lisansı ticari kullanıma izin veriyor, çizimler "planlama / her yerden bağlantı" konusuyla uyumlu → kaldı |
| S7 yöntem `#manifesto` | — | bölüm kalıbı | 4 satırlık manifesto `h2` kalıbında; 3 rakam kart satırı gibi |
| S4 hizmetler `#hizmetler` | İkinci "Title" + üç kart ("xGETTING STARTED") | 430–505 | Kart 3 → 6 (2 satır × 3); küçük etiket = hizmet alanı etiketleri; düğme hizası kaynaktaki gibi sütuna göre start/center/end; `<button>` → `<a data-book-area>`; hizmet fotoğrafları kullanılmadı (kaynak kartta görsel yuvası yok) |
| S8 uzmanlar `#uzmanlar` | Aynı kart | 438–459 | Üstte fotoğraf (`h-72 object-cover`), etiket = alan · kurucu, eğitim/gün/dil satırları, `data-book-staff` düğmesi |
| S5 mevsim notları `.notes-panel` | — | bölüm kalıbı + kart tokenları | 7 kart (`data-note`, masaüstünde sürüklenir), 3 gradyan düğme |
| S9 araçlar `#araclar` | — | düğme + kart tokenları | Sekmeler kaynak düğmesi (`rounded-full font-bold shadow`); seçili = `.gradient` + beyaz yazı. Form ve sonuç kartları kaynak kartı. Özgün işaretleme korunup tw.css'te giydirildi |
| S10 program `#program` | — | aynı | Hedef ve gün hapları seçili = gradyan; öğün listesi fiyat kartının `border-b py-4` satırları; makro çubukları fiyat kartındaki `h-1 gradient` çizgisi |
| S11 tarifler `#tarifler`, `#recipe-dialog` | — | aynı | Filtre hapları, tarif kartları kaynak kartı + `hover:scale-105` |
| S12 ücretler `#ucretler` | Pricing (gri zemin, 3 kart, orta büyük) | 506–586 | Sol **Kontrol görüşmesi** (900 TL), orta **İlk görüşme** (1.800 TL, gradyan çizgi, `-mt-6 shadow-lg`), sağ **Online görüşme** (1.500 TL). Fiyatlar i18n/config anahtarlarından. Altına iki takip paketi (Aylık takip, 3 aylık program) yan kart tokenlarıyla + kurumsal şerit + "Neler dahil" |
| Dalga (CTA üstü) | `svg.wave-top` | 587–608 | Birebir (`#f8fafc` dahil); `g.wave`'e `.wave-fill-prev` (koyu temada gray-800) |
| Randevu çağrısı | Call to Action (gradyan zemin) | 609–622 | "Randevunuzu şimdi alın" + alt cümle + beyaz düğme → `#randevu` |
| S13 randevu `#randevu`, `#cancel-dialog` | — | düğme + kart tokenları | CTA'nın hemen altında. Adım göstergesi haplar (şu anki/biten = gradyan), seçim kartları seçilince gradyan, takvim günleri ve saatler yuvarlak hap, özet kartı gradyan çizgili |
| S14 blog `#blog` + `blog/*.html` | Kart ("xGETTING STARTED") | 438–459 | 6 kart: görsel + kategori·tarih·süre etiketi + başlık + özet; alttaki düğme görsel (bağlantı üst parçada) |
| S15 SSS `#sss` | — | kart tokenları | `<details>` kartları, açıkken gradyan çubuk; yardım kartı |
| S16 "afiyet olsun" `.sky` | — | bölüm kalıbı | `h2` = "afiyet olsun", `sofra` görseli `rounded shadow-lg`, WhatsApp (gradyan) + ara / yol tarifi (beyaz) düğmeleri |
| S17 iletişim `#iletisim` | — | kart tokenları | Bilgi kartları + form kartı; alanlar gri zemin/gri kenar/pembe odak |
| S18 footer `.site-footer` | Footer (logo + Links/Legal/Social/Company) | 624–696 | Links → Bağlantılar, Legal → Yasal (KVKK, iptal), Social → yalnızca Instagram + WhatsApp, Company → Klinik (blog, ücretler, iletişim, adres/telefon/e-posta). Freepik satırı → sağlık uyarısı + © + "Tasarım şablonu: Tailwind Toolbox (MIT)" + Asteria Soft |
| S19 sohbet `#chat`, `.floating-actions` | — | düğme + kart tokenları | Yüzen düğmeler `rounded-full shadow-lg hover:scale-105` (sohbet gradyan, WhatsApp beyaz); pencere `rounded shadow-lg`, başlık şeridi `.gradient` |
| S20 demo şeridi | — | CTA bölümü tokenları | Alta sabit gradyan şerit + beyaz "Tamam" düğmesi |
| Alt sayfalar (blog, makale, KVKK) | Hero bandı + dalga + beyaz bölüm | 70–111 | Sayfa yolu, başlık, özet gradyan bantta; içerik beyaz bölümde; "Diğer yazılar" bölüm kalıbı + kartlar |

Kullanılmayan kaynak parçaları: `hero.png` (yerine Mizan görseli), uçak logosu, "Lorem ipsum" / "Title" / "Main Hero Message" / "What business are you?" / "Thing" / "£x.99" yer tutucuları (hiçbiri sayfada yok), Freepik atıf satırı (Freepik arka planı kullanılmadı).
