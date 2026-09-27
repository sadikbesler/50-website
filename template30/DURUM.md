# Template 30 · AutoAnimate — DURUM

- **Tarih:** 27 Eylül 2026
- **Kaynak:** AutoAnimate 0.10.0 (FormKit) · https://auto-animate.formkit.com · https://github.com/formkit/auto-animate · npm `@formkit/auto-animate` · **MIT**
- **Tür:** E (entegrasyon). diyetisyen-v2 tasarımı ve sinematik katman (GSAP, Lenis, gezegen yükleyici) aynen duruyor.
- **Canlı:** https://sadikbesler.github.io/50-website/template30/
- **Yerel:** http://localhost:8801/50-website/template30/ · klasör `/Users/sadikbesler/Desktop/claude-frontend-50/template30`

## Ne yapıldı

Sayfa açıkken değişen listeler artık zıplamıyor: gelen öğe beliriyor, giden sönüyor, kalanlar yeni yerine kayıyor. Her hedefte `autoAnimate(el, { duration: 250, easing: 'ease-out' })` kullanıldı (`assets/js/list-motion.js`).

| Promt maddesi | Sonuç |
|---|---|
| 1. `[data-slots]` saat listesi | **Uygulandı.** Kapsayıcıya ve her `.slot-list`'e ayrı bağlandı; tarih/uzman/tür değişince kalan saatler yeni ızgara yerine kayıyor, yeni saatler beliriyor. Sıçrama 0 / 0,4 px. |
| 2. `[data-recipes]` tarif ızgarası | **Kaldırıldı (madde 7).** GSAP tileScroll ile ölçülen çakışma, aşağıda. Filtre geçişi özgündeki GSAP girişiyle çalışıyor. |
| 3. `[data-meals]` ve `[data-days]` | **Uygulandı.** Gün/hedef değişince değişen öğünler sönüp yenileri beliriyor, aynı kalan öğün yerinde duruyor. Gün seçicide seçim değişince liste değişmiyor, yalnızca `aria-selected` değişiyor. Bu yüzden orada hareket yok (bilinçli: eskiden her tıklamada 7 düğme silinip yeniden yaratılıyordu; AutoAnimate altında bu, 7 düğmenin solup yeniden belirmesi olurdu). Yan kazanç: klavyeyle gün değiştirirken odaklı düğme artık yerinde kalıyor. |
| 4. `#chat-log` | **Uygulandı** (ana sayfa, blog, 6 makale, KVKK). Yeni mesaj, "yazıyor" göstergesi ve hızlı yanıtların eklenip kaldırılması canlanıyor. Sabit panel sorunu çözüldü, aşağıda. |
| 5. `[data-result]` ×3 | **Uygulandı.** Kaydırıcı sürüklenirken yalnızca sayılar yerinde değişiyor (aynı düğümler, 0 giriş animasyonu). VKİ kategorisi değişince yeni metin beliriyor, kalori tabanı uyarısı gelince alttakiler kayarak yer açıyor. |
| 6. Randevu adımları (`.bstep`, `hidden`) | **Atlandı, AutoAnimate desteklemiyor.** Kütüphane yalnızca `MutationObserver(el, { childList: true })` kuruyor (`index.mjs` satır 741); nitelik (`hidden`) değişimini hiç görmüyor. Testte adım geçişinde AutoAnimate animasyonu 0. Adım geçişini özgündeki gibi `motion.js` canlandırıyor. |
| 7. GSAP çakışması | Tariflerde çakışma ölçüldü → AutoAnimate orada kaldırıldı. Ayrıca `motion.js` `watchDynamic()` içinde `[data-result]`, `[data-meals]`, `[data-slots]` değişiminde çalışan GSAP giriş animasyonu kaldırıldı: aynı öğelere `opacity/transform` yazıyordu, işi AutoAnimate devraldı (0.6: eski kod ölü kalmaz). tileScroll, tilt, görsel maskeleri ve adım geçişi olduğu gibi. |
| 8. Hareket azaltma | **Doğrulandı.** AutoAnimate tercihi bağlandığı anda okuyup hiçbir şey kurmuyor (`index.mjs` satır 720–724). Testte `data-aa` 0, kapsayıcılar `position: static`, liste değişimlerinde WAAPI animasyonu 0. Sayfa açıkken tercih "azalt"a dönerse `list-motion.js` denetleyicileri kapatıyor. |

### Neden "liste yaması" (`Mizan.patchList`) gerekti

Özgün kod her değişimde listeyi `textContent = ''` ile silip baştan kuruyordu. Bu haliyle AutoAnimate her seferinde "hepsi çıktı, hepsi yeni geldi" görür: yeniden dizilme olmaz, bütün liste söner ve yeniden belirir. Kaydırıcı sürüklerken sonuç kutusu saniyede 60 kez yeniden yaratıldığı için sürekli titrerdi. `site.js`'e eklenen `patchList()` çizimi yine ayrık bir kutuya yaptırıyor, sonra anahtarı aynı olan düğümleri yerinde tutarak canlı listeye uyguluyor. Çizim kodu (`renderSlots`, `renderDays`, `renderPlan`, araç çizicileri) aynen duruyor; yalnızca `appendChild` hedefi değişti.

**Eşdeğerlik testi:** Listelerin 84 farklı durumdaki DOM çıktısı (tarif filtreleri, 3 hedef × 7 gün, araç değerleri, randevu günleri/türleri/uzmanları, EN) özgünle karşılaştırıldı: 79 birebir aynı, 5 farkın hepsi aşağıdaki bardak düzeltmesi.

**Yan etki olarak düzelen hata:** Özgünde su hesaplayıcısında kilo yazıp doğrudan bardağa tıklayınca, alanın `blur`'u `change` tetikliyor, sonuç kutusu baştan yaratılıyor ve tıklama kopmuş düğmeye düşüyordu: ilk tıklama kayboluyordu. Artık aynı bardak satırı yerinde kaldığı için tıklama sayılıyor.

## Kaynaktan farklar

- **Tarifler AutoAnimate'siz.** tileScroll kartları kaydırmaya bağlı sürekli `transform: translateY` ile oynatıyor. AutoAnimate ise öğe konumlarını önbellekte tutup en geç 2 sn'de bir tazeliyor. Kayma sırasında GSAP'ın `transform`'u WAAPI tarafından ezildiği, önbellekteki konum da bayat kaldığı için kartlar kaymanın başında ve sonunda sıçrıyor. Ölçüm (`test/aa-olcum.json`, deney sayfaya geçici bağlanarak yapıldı): başlangıçta ve bitişte 5,4 px (o anki GSAP `y` değeri), ilk denemede 21 px başlangıç / 10 px bitiş. Yalnızca giriş/çıkış modu da çözmüyor, çünkü çıkan kartlar da bayat konumdan başlıyor. Madde 7 gereği kaldırıldı; `renderRecipes` ve GSAP girişi özgünle aynı.
- **Gün seçicide hareket yok** (madde 3, yukarıda).
- **Sabit sohbet paneli için konum tazeleme.** Panel `position: fixed`, AutoAnimate ise konumları sayfanın kaydırma payını ekleyerek saklıyor. Sayfa kayınca saklı konum eskiyordu ve sonraki mesajda eski mesajlar ekran dışından kayarak geliyordu (ölçüm: 1368 px). Günlük ilk kez taştığında da ölçü tabanı değişiyordu. `list-motion.js`, panel açıkken her kaydırma karesinde, kaydırma durunca ve panel geçişi bitince konumları yalnızca AutoAnimate'in genel API'siyle (`disable` → boş gizli öğe ekle/çıkar → `enable`) sessizce tazeliyor. Sonuç: 5 senaryoda (sayfa az önce kaydırılmış, günlük taşarken, günlük en üste kaydırılıp geri gelinmiş, panel kapatılıp sayfa kaydırılıp yeniden açılmış) sıçrama 0 px; 1440 ve 390'da aynı.
- **Sohbette CSS `msg-in` girişi susturuldu** (`.chat-log[data-aa] .msg, .quick { animation: none }`): WAAPI ile üst üste binip görünmez ölü animasyon olarak kalıyordu. AutoAnimate yüklenmezse CSS girişi yine çalışır.
- **`align-content: start`** eklendi: `.slot-group`, `.slot-list`, `.stat-rows`. AutoAnimate yükseklik değişen öğenin `height`'ını canlandırıyor. Grid'in varsayılan `stretch` davranışı, zorlanan fazla yüksekliği satırlara dağıtıp içteki listeyi yarım satır (25 px) kaydırıyordu; iç içe AutoAnimate da bunu yanlış ölçüyordu (saatlerde 8/17 px sıçrama → 0). Duran halde yükseklik içerik kadar olduğundan görünüm değişmiyor.
- **Animasyon biçimi AutoAnimate'in varsayılanı:** çıkış 250 ms, giriş 375 ms (1,5 × süre, ilk yarısı görünmez). Öğünler değişirken kısa bir "boş" an oluşuyor. Bunu değiştirmek eklenti (plugin) modunu gerektirir; o mod hareket azaltma denetimini de devre dışı bıraktığı için kullanılmadı.

## CSP ve eklenen dosyalar

CSP **değişmedi**: her şey `self`'ten geliyor, satır içi betik yok. AutoAnimate stil değişikliklerini `element.style` ve WAAPI ile yapıyor, `style-src` bunlara karışmıyor. Konsolda CSP ihlali yok.

| Dosya | Boyut | gzip |
|---|---|---|
| `assets/vendor/auto-animate/auto-animate.iife.js` (+ `LICENSE`) | 8.127 B | 3.296 B |
| `assets/js/list-motion.js` (yeni) | 6.942 B | 2.796 B |
| `site.js` (+ `patchList`), `booking.js`, `content.js`, `tools.js`, `motion.js` (net fark) | +4.831 B | +1.907 B |
| **Eklenen JS toplamı** | | **7.999 B ≈ 7,8 KB** (sınır 250 KB) |
| `site.css` (3 kural + 2 yorum) | | +123 B |

Script sırası (her sayfada `chat.js`'ten sonra): `vendor/auto-animate/auto-animate.iife.js` → `js/list-motion.js`. Sürüm ve derleme: `assets/vendor/KAYNAKLAR.md`, `_kaynak/PARCALAR.md`.

## Testler (0.9 + promta özgü)

Playwright 1.63 (Chromium), yerel önizleme. Betikler `_kaynak/test/`, çalıştırma `_kaynak/PARCALAR.md`.

| # | Madde | Sonuç |
|---|---|---|
| 1 | Konsol: ana sayfa, blog, makale, KVKK (hareket açık ve azaltılmış, sayfa baştan sona kaydırılarak) | **Geçti** — 0 hata |
| 2 | Taşma 1440 / 390 (4 sayfa) | **Geçti** — 8/8 temiz |
| 3 | Seçici sözleşmesi | **Geçti** — 76 seçici; `.cal-day/.slot` 2. adımda, `.servings` tarif penceresinde, `[data-intent]` sohbet açılınca (özgünde de çalışma anında üretiliyorlar) |
| 4 | Randevu (demo) | **Geçti** — İlk görüşme → Kilo yönetimi → Fark etmez → ilk gün → ilk saat → Test Kişi → özet → onay; .ics ve Google Takvim var; iptal penceresi açılıyor; boş formda 4/4, boş iptalde 2/2 hata |
| 5 | Araçlar | **Geçti** — VKİ 170/70 = 24,2; kalori 1.730; 4 bardak yenilemeden sonra 4 |
| 6 | Program ve tarifler | **Geçti** — gün ve hedef değişiyor; filtre 9 → 2; pencere açılıyor; porsiyon 2 → 3: 80 g → 120 g |
| 7 | Sohbet | **Geçti** — "ücretler" → ücret tablosu; "randevu" → en yakın saat (10:00); "beni arayın" → ad → telefon → demo yanıtı |
| 8 | Dil ve tema | **Geçti** — sayfa ortasında TR↔EN, açık↔koyu, yenilemede korunuyor; `?lang=en`'de Türkçe kalan 0. Not: EN öğün metinlerinde "köfte", "kısır", "cacık" yemek adı olarak geçiyor (2 metin düğümü, özgün içerik, halloumi/bulgur gibi bilinçli). Marka/kişi adları gibi hariç tutuldu. |
| 9 | axe-core 4.13.0 (ana sayfa açık + koyu, makale) | **Geçti** — ciddi/kritik 0, başka ihlal de yok (hareket azaltılmış modda, animasyon ara durumları karışmasın diye) |
| 10 | Hareket azaltma | **Geçti** — gizli kalan içerik 0, sonsuz animasyon 0, liste değişimlerinde AutoAnimate animasyonu 0 |
| 11 | JS kapalı | **Geçti** — 12 bölüm görünür, h1 görünür (`_referans/sonuc-js-kapali-1440.jpg`) |
| 12 | Ekran görüntüleri | **Geçti** — `_referans/sonuc-1440.jpg`, `sonuc-390.jpg` (tam sayfa, hareket azaltılmış düzen); kaynak: `kaynak-1440.jpg`, `kaynak-390.jpg` |

**Değişim anı kareleri** (`_referans/sonuc-aa-*.jpg`: 0 / 60 / 125 / 190 / 250 / 375 ms). WAAPI animasyonları değişimin ilk anında duraklatılıp adım adım ilerletildi. **Sıçrama** şöyle ölçüldü: kayan öğenin t=0'daki konumu değişimden önceki konumuyla, animasyon sonundaki konumu bittikten sonraki konumuyla karşılaştırıldı.

| Şerit | Animasyonlar | Sıçrama (başta / sonda) |
|---|---|---|
| `randevu-saatler` | 16 kayma, 6 giriş | 0 / 0,4 px |
| `program-gun` · `program-hedef` | 5 çıkış + 5 giriş · 5 çıkış + 6 giriş | 0 / 0 |
| `arac-vki` | kategori metni söner/belirir, 5 kayma | 0 / 0 |
| `arac-kalori` | taban uyarısı belirir, 8 kayma | 0 / 0 |
| `arac-su` | 2 giriş, 2 çıkış, 7 kayma | 0 / 0,4 px |
| `sohbet-soru` · `sohbet-yanit` · `sohbet-uzun` | kullanıcı mesajı + "yazıyor" / yanıt + hızlı yanıtlar | 0 / 0 |

Kaydırıcı sürüklenirken (VKİ 62→66 kg): aynı düğümler, 0 giriş animasyonu. Gün seçici tıklaması: aynı düğme, 0 AutoAnimate animasyonu.

## Bilinen sorunlar

- **Sohbet, hızlı sayfa kaydırması sırasında gelen yanıt:** Yanıt tam kaydırmanın ortasına düşerse, AutoAnimate'in kendi `adjustScroll` işlevi (sayfa sonundaki öğe silinince tarayıcının kaydırmayı sıkıştırmasını dengelemek için yazılmış) "yazıyor" göstergesi silinirken bir iki karelik farkı düzeltmeye çalışıyor. Pencereyi 30–60 px itiyor ve mesajlar o kadar kayıyor. Yalnızca o an sayfa hızla kayıyorsa oluyor. Kütüphane içinde; yamamak için kaynağı değiştirmek gerekir.
- Sayfa "hareketi azalt" açıkken yüklenip sonra tercih kapatılırsa, animasyonlar için yenileme gerekir (AutoAnimate o durumda gözlemci kurmuyor; `motion.js` de aynı).
- Kalori sonucundaki makro çubukları her yeniden hesaplamada kendi CSS animasyonunu baştan oynatıyor (özgünle aynı davranış, bu şablonda değişmedi).

## Boyut ve yayın

- Klasör: diskte 72 MB (`_kaynak/node_modules` 28 MB ve `_kaynak/indirilen` 26 MB `.gitignore`'da). Depoya giren: 132 dosya, **17,3 MB**; en büyük dosya 6,3 MB (100 MB GitHub sınırının altında).
- Commit: `template30: AutoAnimate ile Mizan diyetisyen sitesi`, `main` dalına push.
