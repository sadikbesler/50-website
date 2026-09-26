# Template 46: svg-gauge (VKİ göstergesi)

- **Tarih:** 27 Eylül 2026
- **Kaynak:** svg-gauge 1.0.7, https://github.com/naikus/svg-gauge (MIT, © 2016 Aniket Naik). npm `svg-gauge@1.0.7`, depo son commit `a2cbfab` (18.05.2023).
- **Tür:** E (entegrasyon). diyetisyen-v2 tasarımı aynen kaldı; yalnızca VKİ sonuç kutusuna gösterge eklendi.
- **Canlı adres:** https://sadikbesler.github.io/50-website/template46/
- **Yerel önizleme:** http://localhost:8801/50-website/template46/
- **Klasör:** `/Users/sadikbesler/Desktop/claude-frontend-50/template46`

## Ne yapıldı

VKİ sonuç kutusunun (`[data-result="bmi"]`) en üstüne, sonuç metninin üstüne svg-gauge ile yarım daire bir gösterge eklendi.

| Mizan bölümü | Kaynak parça | Not |
|---|---|---|
| S9 Araçlar / VKİ sonucu | `Gauge()`, demodaki "gauge2" (180° → 0°, `viewBox 0 0 100 57`) | min 10, max 45; yay rengi kategoriye göre `--bmi-1…5` |
| S9 / gösterge stili | demo `index.css` `.gauge-container.two` | dial 10, değer yayı 13, metin 16 birim (kaynakla aynı oran); renkler promttaki tokenlar |
| S9 / kategori çentikleri | kaynakta yok (promt istedi) | 18,5 / 25 / 30 / 35 / 40 için 5 `<line>`, kütüphanenin geometrisiyle aynı viewBox'ta |

Ayrıntı: `_kaynak/PARCALAR.md`.

**Davranış:**
- Her hesaplamada `setValueAnimated(v, 1)`; hareket azaltma açıksa `setValue(v)`.
- Tek gösterge örneği tutulur. `renderBmi` kutuyu her seferinde boşalttığı için aynı düğüm yeniden eklenir; yay bir önceki değerden yeni değere kayar.
- Renk `var(--bmi-N)` olarak verilir, o anki temadan çözülür. Tema değişince yeniden çizim gerekmeden renk güncellenir.
- Etiket `toLocaleString('tr-TR' | 'en-GB', 1 ondalık)`: TR "24,2", EN "24.2". Dil değişince aynı değerde de ayırıcı güncellenir.
- Gösterge `aria-hidden="true"`. Sonuç metni, kategori, uyarı ve randevu bağlantısı değişmedi; hepsi eskisi gibi `aria-live` kutusunda.
- Değiştirilen dosyalar:
  - `assets/js/tools.js`: `renderGauge()` eklendi. `bmiColor()` eklendi; kategori etiketi de aynı eşlemeyi bu fonksiyonla kullanıyor, davranışı aynı.
  - `assets/css/site.css`: `.bmi-gauge` ile `dial`, `value`, `value-text`, `tick` kuralları.
  - `index.html`: script etiketi; `og:`/`twitter:` başlık ve açıklaması.

## Kaynaktan ve promttan farklar

1. **170/110 → 38,1 rengi `--bmi-5`, promttaki `--bmi-4` değil.**
   - Sitenin mevcut eşlemesi `--bmi-(bmiIndex+1)`. 35–39,9 aralığı (2. derece obezite) bu eşlemeyle `--bmi-5` oluyor.
   - Hemen yanındaki kategori etiketi ve çizgi ölçekteki 35–40 dilimi de `--bmi-5`.
   - Promttaki beklenti büyük olasılıkla sayım hatası. Göstergenin etiketten farklı renk göstermemesi için sitenin eşlemesi korundu.
   - 24,2 → `--bmi-2` ve 15,6 → `--bmi-1` promtla aynı.
2. **Uyarı metni.**
   - Promtta "VKİ tek başına sağlık göstergesi değildir" deniyor. Sitedeki gerçek uyarı: "VKİ; 18 yaş altı, gebelik dönemi ve kas kütlesi yüksek sporcular için yanıltıcı olabilir." (`tools.bmiNote`).
   - Bu metin aynen kaldı; yeni metin eklenmedi.
3. **Eski çizgi ölçek kaldı.**
   - Tür E kuralı "hiçbir şey silinmez", promt da "ekle" diyor. Bu yüzden renkli çizgi ölçek (işaretçi + 18,5/25/30/35 etiketleri) yerinde duruyor.
   - Sonuç: değer göstergenin ortasında ve altındaki büyük rakamda iki kez görünüyor; ölçek de ikinci bir görsel.
   - İstenirse çizgi ölçek tek adımda kaldırılabilir. Göstergedeki çentikler aynı sınırları zaten gösteriyor.
4. **45'in üstü / 10'un altı.**
   - svg-gauge değeri min–max aralığına kırpar ve etikete kırpılmış değeri yollar; 53,3 için "45,0" yazardı.
   - Yay kırpma noktasına varınca etiket gerçek VKİ'yi yazıyor. Yay 45'te dolu kalıyor.
5. **Genişlik.**
   - Demo kutusu 200 px, Mizan'da en fazla 300 px (kart geniş olduğu için). Oranlar aynı.
6. **Kaynakta olmayanlar:** kategori çentikleri (promt istedi).
7. **Referans ekran görüntüsü.**
   - README'deki CodePen demosu Cloudflare doğrulamasına takıldı (403).
   - Aynı demoların kaynağı olan depodaki `example/index.html` kullanıldı: `_referans/kaynak-demo-*.jpg`, `kaynak-gauge2.jpg`.
8. **Karşılaştırma turları.**
   - Tur 1: yapı, viewBox, kalınlıklar ölçülerek kaynakla eşlendi.
   - Tur 2: metin boyutu 17 → 16 birim yapıldı (demoda 16).

## CSP

Değişiklik yok. Kütüphane `'self'`ten yükleniyor. Stilleri `style` niteliğiyle değil CSSOM ile (`path.style.stroke`, `path.style.transition`) verdiği için `style-src 'self'` yeterli; `'unsafe-inline'` eklenmedi.

## Eklenen dosyalar ve boyutlar

| Dosya | Boyut | gzip |
|---|---|---|
| `assets/vendor/svg-gauge/gauge.min.js` | 3.048 B | 1.505 B |
| `assets/vendor/svg-gauge/LICENSE` | 1.078 B | — |
| `assets/js/tools.js` (ek kod) | +2.450 B | +885 B |
| `assets/css/site.css` (ek kural) | +575 B | +210 B |

- Şablonun eklediği JS toplamı ≈ 2,4 KB gzip (sınır 250 KB).
- Klasör 19 MB; `_kaynak/indirilen/` (4,1 MB, `.gitignore`'da) hariç ≈ 15 MB. 50 MB'ı aşan dosya yok.

## Testler

Çalıştırma: `_kaynak/test/protokol.js` (Playwright 1.63, Chromium). Sonuçlar `_kaynak/test/sonuc.json`'da. **40/40 geçti.**

### Promtun istediği gösterge testleri

| Test | Sonuç |
|---|---|
| 170/70 → 24,2, `--bmi-2` | Geçti (açık `rgb(111,145,96)`, koyu `rgb(134,168,116)`) |
| 160/40 → 15,6, `--bmi-1` | Geçti |
| 170/110 → 38,1, `--bmi-4` | **Değer geçti, renk `--bmi-5`** (yukarıdaki fark 1; kategori etiketiyle tutarlı) |
| Açık/koyu ekran görüntüleri | `_referans/gosterge-<boy>-<kilo>-<light/dark>-<tr/en>.jpg` (12 adet) + `gosterge-390-light-tr.jpg` |
| TR/EN ondalık ayırıcı | Geçti: "24,2" / "24.2"; sayfa ortasında canlı dil değişiminde de güncelleniyor |
| Hareket azaltma | Geçti: 250 ms'de değer zaten son değer; geçiş süresi 0; sonsuz animasyon yok |
| axe | Geçti: VKİ kutusunda ihlal 0 |
| Ek | Tema değişimi rengi anında güncelliyor. Geçersiz girdide gösterge gizleniyor, geri gelince çalışıyor. 150/120 → "53,3" (kırpma sorunu yok). Hızlı kaydırıcı sürüklemesinde son değer doğru. |

### 0.9 test protokolü

| # | Test | Sonuç |
|---|---|---|
| 1 | Konsol: ana sayfa, blog, makale, KVKK (1440 ve 390) | Geçti, hata 0 |
| 2 | Taşma 1440 / 390 (4 sayfa) | Geçti |
| 3 | Sözleşme seçicileri | Geçti. `.servings`, `[data-intent]`, `.cal-day`, `.slot` çalışma anında, ilgili adımda doğrulandı. |
| 4 | Randevu: ilk görüşme → kilo yönetimi → fark etmez → ilk gün → 09:00 → Test Kişi → özet → onay | Geçti. .ics indiriliyor (`mizan-randevu-MZ-….ics`), Google Takvim bağlantısı var, iptal penceresi açılıyor, boş formda 4/4 ve iptalde 2/2 hata. |
| 5 | Araçlar: VKİ 24,2; kalori 1.730 kcal; su bardağı yenilemede kalıyor | Geçti |
| 6 | Program: gün ve hedef değişimi; tarif filtresi 9 → 2; tarif penceresi; porsiyon 2 → 3 ölçekleme | Geçti |
| 7 | Sohbet: açılıyor; "ücretler" → ücret listesi; "randevu" → en yakın saat; "beni arayın" → demo yanıtı | Geçti |
| 8 | Dil/tema: sayfa ortasında TR↔EN, açık↔koyu, yenilemede korunuyor | Geçti |
| 8b | `?lang=en` Türkçe kalan metin | Yalnızca özel adlar kaldı: Kadıköy, Moda, Türkiye, Zeynep Tunalı, köfte, cacık, kısır. Temel siteyle aynı; yeni metin eklenmedi. |
| 9 | axe: ana sayfa açık/koyu, makale | Geçti: ciddi/kritik 0. Kalan: `aria-allowed-role` (minor), `#hero-video`. Temel sitede de var, bu şablonla ilgisiz. |
| 10 | Hareket azaltma | Geçti: sonsuz animasyon 0, görünmeyen öğe 0 |
| 11 | JS kapalı | Geçti: bölümlerin hepsi görünür |
| 12 | Ekran görüntüleri | `_referans/sonuc-1440.jpg`, `sonuc-390.jpg` (tam sayfa; tüm içerik görünsün diye hareket azaltma açıkken alındı) ve gösterge görüntüleri |

## Bilinen sorunlar

- Değer göstergede ve büyük rakamda iki kez görünüyor, çizgi ölçek de duruyor (fark 3).
- svg-gauge'un animasyonu iptal edilemiyor. Çok hızlı art arda değişimde yay, bir önceki hedeften yeni hedefe küçük bir sıçramayla geçebiliyor; son değer her zaman doğru.
