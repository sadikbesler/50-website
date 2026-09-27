# Üçüncü taraf parçalar — template5 (Landwind)

Hepsi site içinden (`self`) sunulur; çalışma anında CDN yok. Lisans metinleri ilgili klasörde.

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| Landwind (tasarım: blok düzeni, sınıflar, SVG'ler, tailwind.config.js) | commit `f8be851` (20.02.2023) | MIT — `landwind/LICENSE` | `index.html`, `blog/*.html`, `kvkk.html` işaretlemesi | https://github.com/themesberg/landwind · https://demo.themesberg.com/landwind/ |
| Flowbite JS | 1.4.7 | MIT — `flowbite/LICENSE.md` | `flowbite/flowbite.js` (mobil menü collapse + SSS accordion) | https://www.npmjs.com/package/flowbite/v/1.4.7 |
| Flowbite Tailwind eklentisi | 1.4.7 | MIT | derlenmiş `assets/css/tw.css` içinde | aynı paket (`flowbite/plugin`) |
| Flowbite belge örnekleri | v2.5.2 (commit `5c8df35`) | MIT | Landwind'de olmayan bölümlerin işaretlemesi (card, tabs, timeline, modal, stepper, input, chat bubble…) | https://github.com/themesberg/flowbite/tree/v2.5.2/content |
| Flowbite Icons | 1.5.0 | MIT — `flowbite-icons/LICENSE` | satır içi SVG (takvim, saat, ödül, telefon, WhatsApp…) | https://github.com/themesberg/flowbite-icons |
| Tailwind CSS | 3.4.17 | MIT — `tailwindcss/LICENSE` | `assets/css/tw.css` (derleme) | https://tailwindcss.com |

Kaldırılanlar (sinematik katman): GSAP 3.15.0 ve eklentileri, Lenis 1.3.26, `assets/js/motion.js`, `premium.css`, `motion.css`, `assets/video/hero.mp4`.
