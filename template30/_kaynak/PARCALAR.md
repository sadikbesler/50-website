# Template 30 · Kullanılan parçalar

Kaynak: **AutoAnimate 0.10.0** (FormKit, MIT) — https://auto-animate.formkit.com ·
https://github.com/formkit/auto-animate · npm `@formkit/auto-animate`.
Tür E: diyetisyen-v2 tasarımı ve sinematik katman aynen kaldı; yalnızca sayfa
açıkken değişen listelerin hareketi eklendi. Görsel bir parça alınmadı;
AutoAnimate'in kendi varsayılan animasyonları (giriş: `scale(.98)`+opaklık,
çıkış: `scale(.98)`+sönme, yer değiştirme: FLIP + yükseklik) değiştirilmeden,
promttaki ayarla (`{ duration: 250, easing: 'ease-out' }`) kullanıldı.

Satır biçimi: `Mizan bölümü → kaynak bileşen → URL / dosya → değiştirilen şeyler`

- S13 Randevu, saat listesi `[data-slots]` → `autoAnimate()` → `assets/vendor/auto-animate/auto-animate.iife.js`, `assets/js/list-motion.js` → kapsayıcıya ve her `.slot-list`'e ayrı ayrı bağlandı (gruplar eklendikçe bağlanır, kalkınca `destroy`); `booking.js` `renderSlots` artık ayrık bir kutuya çizip `Mizan.patchList` ile uyguluyor (saat düğmesi saat değeriyle eşlenir); `.slot-group` ve `.slot-list`'e `align-content: start`.
- S10 Program, öğünler `[data-meals]` → `autoAnimate()` → aynı dosyalar → `content.js` `renderPlan` `patchList` ile; öğün metniyle eşlenir (aynı öğün kalır, değişen söner/belirir).
- S10 Program, gün seçici `[data-days]` → `autoAnimate()` → aynı dosyalar → `content.js` `renderDays` `patchList` ile; düğmeler gün numarasıyla eşlenir. Seçim değişince yalnızca nitelikler değişiyor, liste değişmediği için hareket yok (bilinçli, DURUM.md).
- S9 Araçlar, sonuç kutuları `[data-result]` ×3 → `autoAnimate()` → aynı dosyalar → `tools.js` `update()` `patchList` ile; sayılar yerinde değişir, yalnızca metin satırları metinleriyle eşlenir (yeni kategori/not belirir); `.stat-rows`'a `align-content: start`.
- S19 Sohbet `#chat-log` (ana sayfa, blog, makaleler, KVKK) → `autoAnimate()` → aynı dosyalar → `chat.js` değişmedi; CSS `msg-in` girişi AutoAnimate bağlıyken susturuldu (`.chat-log[data-aa]`); sabit panel için konum tazeleme (`list-motion.js`).
- S11 Tarifler `[data-recipes]` → **kullanılmadı** → — → GSAP tileScroll ile ölçülen çakışma yüzünden promt madde 7 gereği kaldırıldı; `content.js` `renderRecipes` ve `motion.js`'teki GSAP girişi özgün hâlinde.
- S13 Randevu adımları `.bstep` → **kullanılmadı** → — → AutoAnimate `hidden` değişimini izlemiyor (madde 6); GSAP adım geçişi özgün hâlinde.
- Ortak yardımcı `Mizan.patchList` → kendi kodumuz → `assets/js/site.js` → anahtarlı liste güncellemesi (AutoAnimate'in "aynı öğe kaldı mı" sorusuna doğru yanıt verebilmesi için).
- Sinematik katman `motion.js` `watchDynamic()` → — → `assets/js/motion.js` → `[data-result]`, `[data-meals]`, `[data-slots]` değişimlerinde çalışan GSAP giriş animasyonu kaldırıldı (işi AutoAnimate devraldı; iki katman aynı öğeye `opacity/transform` yazıyordu).

## Derleme

```bash
cd template30/_kaynak
npm install          # esbuild 0.28.2, @formkit/auto-animate 0.10.0, playwright
npm run build        # giris.js → ../assets/vendor/auto-animate/auto-animate.iife.js (+ LICENSE)
```

## Testler (`_kaynak/test/`, yerel önizleme 8801'de açıkken)

| Komut | Ne yapar |
|---|---|
| `npm run test:protokol` | 0.9 protokolünün 12 maddesi → `test/protokol-sonuc.json` |
| `npm run test:kareler` | Her hedefte değişim anını dondurup 0/60/125/190/250/375 ms karelerini `_referans/sonuc-aa-*.jpg` şeridine yazar, sıçrama ölçer, tarif/tileScroll çakışma deneyini tekrarlar → `test/aa-olcum.json` |
| `npm run test:sohbet` | Sohbette gerçek zamanlı sıçrama ölçümü (1440 ve 390), 5 senaryo |
| `npm run test:esdeger` | Listelerin 84 durumdaki DOM çıktısı (özgünle karşılaştırmak için önce aynı betiği `diyetisyen-animasyon-v2` adresine koşun) |
| `npm run test:duman` | 4 sayfada konsol ve AutoAnimate bağlantıları, hareket açık/azaltılmış |
