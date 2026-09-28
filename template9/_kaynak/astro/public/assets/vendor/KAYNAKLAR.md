# Üçüncü taraf parçalar — template9 (AstroPaper)

Çalışma anında CDN yok: tema, yazı tipi, arama ve Mizan betikleri bu siteden (`self`) sunulur.

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| AstroPaper (tema: bileşenler, düzen, stiller, makale betikleri) | 6.1.0 (depo commit `35cfa7f`, 5 Ağu 2026) | MIT © Sat Naing — `astro-paper/LICENSE` | `_kaynak/astro/src/**`, derlenmiş hâli `_astro/*.css`, `_astro/*.js`, `assets/js/astro-paper-post.js` | https://github.com/satnaing/astro-paper |
| Astro | 7.3.5 | MIT | Derleme aracı (çıktıya yalnızca statik HTML/CSS/JS girer) | https://astro.build |
| Tailwind CSS (+ @tailwindcss/typography) | 4.3.3 | MIT | Derlemede; çıktı `_astro/*.css` | https://tailwindcss.com |
| Pagefind (arama dizini + varsayılan arayüz) | 1.5.2 | MIT — `pagefind/LICENSE` | `pagefind/` (derlemede üretilen dizin), arayüz `_astro/ui-core.*.js` | https://pagefind.app |
| Pagefind Türkçe arayüz çevirisi | 1.5.2 | MIT (Pagefind) · çeviri: Taylan Özgür Bildik | `search/` sayfasındaki `PAGEFIND_TR` | https://github.com/Pagefind/pagefind/blob/main/pagefind_ui/translations/tr.json |
| Google Sans Code (yazı tipi; AstroPaper'ın varsayılanı) | Google Fonts, Astro Fonts API ile derlemede indirildi | SIL OFL 1.1 — `google-sans-code/OFL.txt` | `_astro/fonts/*.woff`, `*.ttf` | https://fonts.google.com/specimen/Google+Sans+Code |
| rehype-callouts (obsidian teması; AstroPaper bağımlılığı) | 2.x | MIT | Makale bilgi kutuları (`_astro/*.css`) | https://github.com/lin-stephanie/rehype-callouts |
| Tabler Icons (AstroPaper'ın ikonları: takvim, ok, arşiv, arama, sosyal) | AstroPaper içinde | MIT | Satır içi SVG / `_astro/*.svg` | https://tabler.io/icons |
| satori + sharp (dinamik og görseli, yalnızca derlemede) | 0.26 / 0.35 | MPL-2.0 / Apache-2.0 | `og.png`, `blog/<yazı>.png` | https://github.com/vercel/satori · https://sharp.pixelplumbing.com |

Mizan'ın kendi betikleri (`assets/js/config.js`, `i18n.js`, `site.js`, `booking.js`, `tools.js`,
`content.js`, `chat.js`, `boot.js`) diyetisyen-v2'den gelir; üçüncü taraf değildir.

Kaldırılanlar (sinematik katman, 0.6): GSAP 3.15.0 (`gsap`, `ScrollTrigger`, `Flip`, `SplitText`,
`CustomEase`), Lenis 1.3.26, `motion.js`, `premium.css`, `motion.css`.
