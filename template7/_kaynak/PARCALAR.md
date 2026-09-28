# PARÇALAR — template7 · Tailblocks (tema "green")

Kaynak: https://tailblocks.cc · https://github.com/mertJF/tailblocks (MIT © 2020 Mert Cukuren) · depo `34943e6` (24 May 2021), `_kaynak/indirilen/tailblocks`.
Bloklar `src/blocks/<kategori>/<light|dark>/<harf>.js` dosyalarından `_kaynak/blok-cevir.js` ile çevrildi (Babel ayrıştırıcısı; `className → class`, `${props.theme} → green`, JSX nitelikleri HTML adlarına). Koyu dosyadaki her farklı sınıf, açık dosyanın **aynı ağaç sırasındaki** öğesine `dark:` önekiyle eklendi. Sayfa şablonları sınıfları elle yazmaz; `{{k:<blok>:<etiket>:<sıra>}}` ile çevrilmiş bloktan çeker (`sayfalari-kur.js`).

Satır biçimi: `Mizan bölümü → kaynak bileşen → dosya → değiştirilen şeyler`

## Bölüm eşlemesi

| Mizan | Kaynak blok | Dosya | Değişenler |
|---|---|---|---|
| S1 `#site-header` | Header A | `header/light/a.js` (+dark) | Yer tutucu logo işareti yerine yeşil dairede Mizan "m" çizgisi (aynı `w-10 h-10 p-2 bg-green-500 rounded-full` yuvası). 4 bağlantı → 7 bağlantı (xl ve üstünde satırda). TR/EN ve tema düğmesi bağlantı tokenıyla (`mr-5 hover:text-gray-900`) linklerin yanında. Sağdaki "Button" → "Randevu al" (ok simgesi kaynaktaki). xl altında aynı düğme tokenıyla menü düğmesi + dikey bağlantı listesi (site.js `#menu-btn/#mobile-menu`). |
| S2 `#top`, `#next-slot` | Hero A | `hero/light/a.js` | `dummyimage` → `hero-gezegen-son.jpg`. İki düğme: "Randevu al" (yeşil), "VKİ'nizi hesaplayın" (gri). `#next-slot` ikinci düğmenin altında: cta/b gri kutusu + blog/a kategori etiketi + content/h "Learn More" bağlantısı. |
| S3 `.facts` | Statistic A | `statistic/light/a.js` | 4 sayı: 12 yıl / 3 uzman / 60 dk / 7 gün. `h2` → `p` (dört sayı başlık olmasın diye; sınıflar aynı). |
| S4 `#hizmetler` | Content H | `content/light/h.js` | 3 kart → 6 kart (aynı `flex-wrap` içinde 2 satır × 3). Görseller `hizmet-*-700.webp`. "Learn More" → "Randevu al" (`data-book-area`). Hizmet etiketleri (tags) ve alt satır kartta yuvası olmadığı için gösterilmedi. |
| S5 `.notes-panel` | Gallery A | `gallery/light/a.js` | 6 hücrelik desen ([½ ½ tam] [tam ½ ½]) korunup 7. görsel tam genişlikte eklendi (aynı satır yüksekliği için oran 10:3; diğer hücreler kaynaktaki dummy oranı 5:3). Başlığın yanındaki paragraf: "Eylül ve ekim" + 3 bağlantı (content/h bağlantı tokenı). Figcaption görünmez (`sr-only`, i18n'li). Sürükleme site.js `[data-note]`. |
| S6 `#yaklasim` | Step A | `step/light/a.js` | 5 adım → 4 adım; son adım kaynağın "FINISH" biçiminde (çizgisiz). Simgeler kaynağın kendi SVG'leri (kişi, aktivite, kalkan, onay). Başlık: contact/c başlık tokenları. Görsel `surec-mutfak-1200.webp`. Kurucunun alıntısı (process.quote) kullanılmadı — kişi adlı alıntı S7 kuralıyla çelişmesin diye. |
| S7 `#manifesto` | Testimonial B | `testimonial/light/b.js` | Yalnızca tipografi: tırnak simgesi + ortalanmış `text-lg` metin = manifesto cümleleri (`h2`), yeşil çizgi, kişi adı yuvasında "YÖNTEM", unvan yuvasında 60 dk / 48 saat / haftalık. Müşteri yorumu yok. |
| S8 `#uzmanlar` | Team B | `team/light/b.js` | 4 kart → 3 kart. `dummyimage` → uzman fotoğrafları (`w-48 h-48 rounded-lg`). Sosyal simge satırı → "…'dan randevu al" bağlantısı (content/h tokenı, `data-book-staff`). Eğitim/gün/dil listesi kartta yuvası olmadığı için gösterilmedi (günler randevu adımında görünür). |
| S9 `#araclar` | Pricing A (başlık + Monthly/Annually anahtarı) + Contact C (input/label) + Statistic A (sonuç) | `pricing/light/a.js`, `contact/light/c.js`, `statistic/light/a.js` | Anahtar 3 sekme (390'da VKİ / KCAL / ML kısaltmaları). Form ve sonuç blog/a kart kenarıyla. VKİ ölçeği tek renkli yeşil ton dizisi (yargısız). |
| S10 `#program` | Feature C + aynı anahtar | `feature/light/c.js` | Sol: görsel (`program-tahta`) + günlük toplam (statistic) + makro çubukları (content/h çizgisi) + günün notu (cta/b gri kutu) + düğmeler. Sağ: öğünler feature/c öğesi (saat dairede, başlık, içerik, kcal bağlantı yuvasında). Hedef ve gün seçimi pricing/a anahtarı. |
| S11 `#tarifler`, `#recipe-dialog` | Blog A + anahtar | `blog/light/a.js` | 9 tarif kartı (content.js üretir) blog/a kartıyla; kategori/süre/kcal kategori satırında, etiketler görüntülenme/yorum sayacı yuvasında. Filtre = anahtar (6 seçenek, sarar). Pencere blog/a kart kenarı + radius. |
| S12 `#ucretler` | Pricing B | `pricing/light/b.js` | Tablo: Plan / Kimin için / Kapsam / Ücret + son sütunda radyo yerine plan başına randevu oku (işlevsiz radyo bırakılmadı). Alt satır: "Neler dahil?" + "İlk görüşmeyi planla". Altında "Neler dahil / değil" (pricing/a kart + onay dairesi tokenları) ve kurumsal şerit (content/e). |
| S13 `#randevu`, `#cancel-dialog` | Contact B (form sütunu + bilgi kartı) + Step A (adım göstergesi) | `contact/light/b.js`, `step/light/a.js` | Sol (lg:w-2/3) 4 adımlı form, alanlar contact/b input tokenı. Sağ özet contact/b bilgi kartı (`bg-white rounded shadow-md py-6`, ADDRESS/EMAIL başlık tokenı). Adım göstergesi step/a dairesi + yatay çizgi. Görüşme/uzman seçimi pricing/a kartı (seçili = `border-green-500`). Konu çipleri, takvim günleri ve saatler header/a düğme tokenıyla, seçili = yeşil zemin + beyaz yazı. Harita iframe'i kullanılmadı. |
| S14 `#blog` + `blog/*.html` | Blog C (+ makalede Content E) | `blog/light/c.js`, `content/light/e.js` | 2 kart → 6 kart (3 satır). Kategori çipi, başlık, özet, "Devamını oku", tarih ve okuma süresi (sahte görüntülenme/yorum sayıları kaldırıldı), yazar satırı (makaledeki byline). Blog dizini aynı kartlar. Makale ve KVKK: content/e düzeni (sol md:w-2/5 başlık + meta + içindekiler, sağ md:w-3/5 metin; metin `leading-relaxed text-base`). |
| S15 `#sss` | Feature D metin tipografisi | `feature/light/d.js` | Tailblocks'ta SSS yok. `<details>` listesi: feature/d kart kenarı (`border-2 rounded-lg border-gray-200 border-opacity-50`), başlık `text-lg font-medium`, cevap `leading-relaxed`, +/× simgesi feature/d simge dairesinde (küçük). Yardım düğmeleri content/e. |
| S16 `.sky` | CTA B + arka plan görseli | `cta/light/b.js` | `sofra-2000.webp` arka planda; üstünde `bg-gray-900 bg-opacity-75` perde ve bloğun **koyu** renkleri (temadan bağımsız). Sol: "afiyet olsun" (h1 yuvası, büyütüldü) + açıklama. Sağ gri kutu: "Ulaşın" + WhatsApp (yeşil), Bizi arayın / Yol tarifi (gri). Kayıt formu kullanılmadı. |
| S17 `#iletisim` | Contact C (+ Contact B harita kutusu) | `contact/light/c.js`, `contact/light/b.js` | Form: ad, e-posta, telefon, konu, mesaj, KVKK, gönder (contact/c tokenları). Ayraç altında e-posta, adres, **harita kartı**, çalışma saatleri tablosu (pricing/b hücreleri), Instagram + WhatsApp. Not: promt iframe'in contact/c'de olduğunu söylüyor; iframe aslında contact/b'de. CSP `frame-src 'none'` olduğu için iframe konmadı; contact/b'nin gri harita kutusu + beyaz bilgi kartı içinde `config.mapsUrl`'ye giden "Haritada aç" bağlantısı. |
| S18 `.site-footer` | Footer A | `footer/light/a.js` | Logo + tanıtım; 4 sütun: Klinik / Kaynaklar / İletişim / Yasal. Alt şerit: © + Asteria imzası (@knyttneve yuvası), Instagram + WhatsApp, sağlık uyarısı. |
| S19 `#chat`, `.floating-actions` | Contact input/button + Blog A kart radius/kenar | `contact/light/c.js`, `blog/light/a.js` | Panel `border-2 rounded-lg`, giriş contact/c input, gönder yeşil düğme, hızlı yanıtlar header düğme tokenı. Yüzen düğmeler header/a logo dairesi (büyük). |
| S20 demo şeridi, KVKK, sitemap | Footer A alt şerit + Content E | — | Demo şeridi footer/a alt şerit zemini + content/e küçük düğme. |

## JSX → HTML çeviri denetimi (blok başına sınıf sayısı)

`node blok-cevir.js` → `bloklar/sayim.json`. Her öğe için: açık dosyadaki her sınıf birleşik HTML'de aynen, koyu dosyadaki her sınıf aynen ya da `dark:` önekiyle var mı (kayıp). Beklenen: **HTML = açık + dark:eklenen + nötrleyici**.

| Blok | JSX açık | JSX koyu | ortak | +dark: | nötr* | HTML toplam | kayıp | {props.theme} |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| header/a | 54 | 55 | 46 | 9 | 0 | 63 | 0 | 1 |
| hero/a | 62 | 64 | 57 | 7 | 0 | 69 | 0 | 2 |
| statistic/a | 46 | 47 | 41 | 6 | 0 | 52 | 0 | 0 |
| content/h | 117 | 118 | 108 | 10 | 0 | 127 | 0 | 4 |
| gallery/a | 83 | 84 | 81 | 3 | 0 | 86 | 0 | 0 |
| step/a | 190 | 191 | 180 | 11 | 0 | 201 | 0 | 5 |
| testimonial/b | 31 | 32 | 28 | 4 | 0 | 35 | 0 | 1 |
| team/b | 184 | 185 | 178 | 7 | 0 | 191 | 0 | 0 |
| pricing/a | 513 | 518 | 435 | 83 | 1 | 597 | 0 | 7 |
| contact/c | 144 | 145 | 119 | 26 | 0 | 170 | 0 | 8 |
| feature/c | 120 | 121 | 107 | 14 | 0 | 134 | 0 | 6 |
| blog/a | 195 | 193 | 170 | 23 | 0 | 218 | 0 | 3 |
| pricing/b | 179 | 180 | 147 | 33 | 0 | 212 | 0 | 2 |
| contact/b | 154 | 154 | 128 | 26 | 2 | 182 | 0 | 8 |
| blog/c | 168 | 173 | 147 | 26 | 0 | 194 | 0 | 4 |
| content/e | 38 | 39 | 35 | 4 | 0 | 42 | 0 | 2 |
| feature/d | 91 | 90 | 78 | 12 | 0 | 103 | 0 | 4 |
| cta/b | 92 | 97 | 77 | 20 | 1 | 113 | 0 | 3 |
| footer/a | 162 | 164 | 117 | 47 | 0 | 209 | 0 | 1 |

Ağaç yapısı 19 blokta da açık/koyu arasında birebir (uyumsuz öğe 0). `{props.theme}` sütunu bloktaki `${props.theme}` sayısıdır; hepsi `green` oldu (`bloklar/*.html` içinde `props`/`indigo` kalmadı).

\* **Nötrleyici:** Açık dosyada renk sınıfı olup koyu dosyada o özelliğin hiç karşılığı olmayan 4 yer (koyu dosyada o öğe saydam zemin / kalıtılan metin rengi taşıyor). Bunlar koyu temada açık rengi taşımasın diye `dark:bg-transparent` / `dark:text-inherit` eklendi: pricing/a başlık altı `p text-gray-500`, contact/b form sütunu `bg-white` ve açıklaması `text-gray-600`, cta/b küçük not `text-gray-500`.

Sayfada kullanılan blok öğeleri `bloklar/kullanim.json`'da (her `{{k:…}}` çağrısı kaydedilir).

## Tailwind 2.0.2 → 3.4.17 (ölçülerek)

`indirilen/tailwind-2.0.2.min.css` (kaynak önizlemenin kullandığı dosya) ile karşılaştırıldı:
- `green`: 2.0.2'de emerald paleti (500 = `#10b981`); v3'te `green` başka palet → `tailwind.config.js`'te `green = emerald` (50–900 birebir).
- `gray`: aynı. Gölgeler (`shadow-md` vb.) 2.0.2 değerleriyle geri kondu. `whitespace-no-wrap` 2.0.2'de de tanımsız (etkisiz) — kaynakta olduğu gibi bırakıldı.
- Yazı: ölçülen kaynak yığını (`ui-sans-serif, system-ui, -apple-system, …`) `font-sans`. `body-font` / `title-font` kaynakta da tanımsız; sınıf olarak kaldı.

## Blok dışı eklemeler (tamamı `DURUM.md` → Kaynaktan farklar)

- Erişilebilirlik ton eşlemesi: metin taşıyan `bg-green-500` → `bg-green-700` (+hover 800), `text-green-500` → `text-green-700`, `text-gray-400` → `text-gray-500`, koyu `text-gray-500` → `text-gray-400`; footer alt şeridinde `text-gray-500` → `text-gray-600` (gri-100 zemin). Dekoratif yeşil (çizgi, simge dairesi, kenar) 500 kaldı.
- Görünür klavye odağı (tek genel kural, green-500 çerçeve), hata metni rengi (red-700), büyük harf için `uppercase` (kaynakta metin büyük harfle yazılmış).

## Kullanılmayanlar

- Tailblocks'un `dummyimage` görselleri, yer tutucu logo, Facebook/Twitter/LinkedIn simgeleri, sahte sayılar (1.2K görüntülenme, 6 yorum, 2.7K kullanıcı), testimonial kişi adı, Google Maps iframe'i, pricing/a'nın 4 fiyat kartı ve "POPULAR" rozeti.
