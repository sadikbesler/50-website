# Üçüncü taraf parçalar — template6 (Tailwind Toolbox Landing Page)

Çalışma anında CDN yok. Kaynak şablon Tailwind 2.2.19'u unpkg'den çekiyordu; burada aynı sınıflar Tailwind 3.4.17 ile yerelde derlenip `assets/css/tw.css` olarak site içinden (`self`) sunulur. Tek dış kaynak Google Fonts'tur (Source Sans Pro); sayfadaki Content-Security-Policy onu zaten izinli tutuyordu (değişiklik yok).

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| Tailwind Toolbox "Landing Page" (düzen, sınıflar, `.gradient`, dalga SVG'leri, kaydırma ve açılır menü betikleri) | depo commit `545f89e` (8 Ara 2022) | MIT — `tailwindtoolbox/LICENSE` (© 2019 Tailwind Toolbox) | Bütün sayfalar; `assets/js/toolbox-nav.js` | https://github.com/tailwindtoolbox/Landing-Page · https://tailwindtoolbox.github.io/Landing-Page |
| unDraw çizimleri ("travel booking", "connected world") — kaynak şablonun içinde satır içi SVG | kaynaktaki hâli | unDraw lisansı (ücretsiz, atıfsız ticari kullanım serbest) | Yaklaşım bölümü (`#yaklasim`) | https://undraw.co/license |
| Tailwind CSS | 3.4.17 | MIT — `tailwindcss/LICENSE` | `assets/css/tw.css` (derlenmiş) | https://tailwindcss.com |
| Source Sans Pro (font, 400/700) | Google Fonts | SIL Open Font License 1.1 | `body` | https://fonts.google.com/specimen/Source+Sans+3 |

Notlar:
- Kaynağın `index.html` sonundaki iki satır içi betik, CSP satır içi betiğe izin vermediği için `assets/js/toolbox-nav.js` dosyasına taşındı; sınıf değişimleri aynı.
- Kaynaktaki uçak logosu (potlabicons.com) ve `hero.png` kullanılmadı; yerine Mizan işareti ve `assets/img/hero-gezegen-son.jpg`.
- Yalnızca test/derleme için (siteye girmez): Playwright 1.63 (Apache-2.0), axe-core 4.13 (MPL-2.0).
- Önceki sürümdeki sinematik katman (GSAP 3.15.0, ScrollTrigger, Flip, SplitText, CustomEase, Lenis 1.3.26, `motion.js`, `premium.css`, `motion.css`, `hero.mp4`) Tür T kuralı gereği kaldırıldı.
