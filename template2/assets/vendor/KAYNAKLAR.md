# Üçüncü taraf parçalar — template2 (HyperUI)

Çalışma anında CDN yok; stil dosyası derlenip site içinden (`self`) sunulur. Tek dış kaynak Google Fonts'tur ve sayfadaki Content-Security-Policy onu zaten izinli tutuyordu (değişiklik yapılmadı).

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| HyperUI (bileşen işaretlemesi ve sınıfları) | commit `2b5aebb` (26.09.2026) | MIT — `hyperui/LICENSE` | Bütün sayfa düzeni | https://hyperui.dev · https://github.com/markmead/hyperui |
| Tailwind CSS | 4.3.3 | MIT — `tailwindcss/LICENSE` | `assets/css/tw.css` (derlenmiş) | https://tailwindcss.com |
| @tailwindcss/forms | 0.5.11 | MIT (Tailwind Labs) | `assets/css/tw.css` içinde | https://github.com/tailwindlabs/tailwindcss-forms |
| Heroicons (24/outline) | 2.2.0 | MIT — `heroicons/LICENSE` | Satır içi SVG simgeler | https://heroicons.com |
| Google Sans Flex (font) | Google Fonts | SIL Open Font License 1.1 | `font-sans` | https://fonts.google.com/specimen/Google+Sans+Flex |

Yalnızca test için (siteye girmez): Playwright 1.63.0 (Apache-2.0), axe-core 4.13.0 (MPL-2.0).

Önceki sürümdeki sinematik katman (GSAP 3.15.0, ScrollTrigger, Flip, SplitText, CustomEase, Lenis 1.3.26 ve `motion.js`) bu şablonda Tür T kuralı gereği kaldırıldı.
