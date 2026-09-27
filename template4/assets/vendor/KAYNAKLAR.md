# Üçüncü taraf parçalar — template4 (Flowbite)

Çalışma anında CDN yok: stil dosyası derlenip, Flowbite JS de kopyalanıp site içinden (`self`) sunulur. Tek dış kaynak Google Fonts'tur (Inter); sayfadaki Content-Security-Policy onu zaten izinli tutuyordu (değişiklik yapılmadı).

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| Flowbite (JS: navbar collapse + carousel; tema: `themes/default`; Tailwind eklentisi) | 4.0.2 (npm) · depo commit `232ebdb` | MIT — `flowbite/LICENSE` | `assets/vendor/flowbite/flowbite.min.js`, `assets/css/tw.css` | https://flowbite.com · https://github.com/themesberg/flowbite |
| Flowbite Blocks — yalnızca ücretsiz ("Show code" açık) bloklar | 27.09.2026'da flowbite.com/blocks'tan | MIT (Flowbite) | Sayfa bölümleri — liste `_kaynak/PARCALAR.md` | https://flowbite.com/blocks/ |
| Flowbite Icons (outline + solid) | 1.5.0 | MIT — `flowbite-icons/LICENSE` | Satır içi SVG simgeler | https://github.com/themesberg/flowbite-icons |
| Flowbite Typography (`format` sınıfı) | 1.0.5 | MIT — `flowbite-typography/LICENSE` | Makale ve KVKK gövdesi, `assets/css/tw.css` | https://flowbite.com/docs/components/typography/ |
| flowbite-datepicker (yalnızca sınıf dizileri; JS'i kullanılmadı) | 2.0.0 | MIT — `flowbite-datepicker/LICENSE` | Randevu takviminin görünümü (`tw.css` → `.cal*`) | https://github.com/themesberg/flowbite-datepicker |
| Tailwind CSS (+ @tailwindcss/cli) | 4.3.3 | MIT — `tailwindcss/LICENSE` | `assets/css/tw.css` (derlenmiş) | https://tailwindcss.com |
| Inter (font) | Google Fonts, 300–800 | SIL Open Font License 1.1 | `font-sans` (Flowbite varsayılan teması) | https://fonts.google.com/specimen/Inter |

Notlar:
- `flowbite.min.js` npm paketindeki dosyanın aynısıdır; yalnızca sondaki `//# sourceMappingURL=flowbite.min.js.map` satırı (harita dosyası sunulmadığı için) silindi.
- Yalnızca test için (siteye girmez): Playwright 1.63.0 (Apache-2.0), axe-core 4.13.0 (MPL-2.0).
- Önceki sürümdeki sinematik katman (GSAP 3.15.0, ScrollTrigger, Flip, SplitText, CustomEase, Lenis 1.3.26 ve `motion.js`) bu şablonda Tür T kuralı gereği kaldırıldı.
