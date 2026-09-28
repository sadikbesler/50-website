# Üçüncü taraf parçalar — template8 (AstroWind)

Hepsi site içinden (`self`) sunulur; çalışma anında CDN yoktur. Kaynak proje:
`_kaynak/astro/` (derleme: `sh _kaynak/yap.sh`).

| Parça | Sürüm | Lisans | Nerede | Kaynak |
|---|---|---|---|---|
| AstroWind (tema: widget'lar, düzenler, blog, Tailwind tokenları) | 1.0.0-beta.66 · commit `14e1a69` (12.09.2026) | MIT — `astrowind/LICENSE.md` | `_astro/*.css`, `_astro/*.js`, bütün sayfaların işaretlemesi | https://github.com/arthelokyo/astrowind |
| Astro (statik site derleyicisi; Fonts API, içerik koleksiyonları) | 7.3.1 | MIT — `astro/LICENSE` | derleme aracı; `_astro/page.*.js` (bağlantı ön yükleme) | https://astro.build |
| Tailwind CSS + @tailwindcss/typography | 4.3.3 · 0.5.20 | MIT — `tailwindcss/LICENSE` | `_astro/*.css` | https://tailwindcss.com |
| Inter (yazı tipi; latin + latin-ext alt kümeleri) | Fontsource, derlemede indirildi | SIL Open Font License 1.1 — `inter/LICENSE.txt` | `_astro/fonts/*.woff2`, `assets/css/fonts.css` | https://github.com/rsms/inter · https://fontsource.org |
| Tabler Icons (Iconify paketi, SVG olarak sayfaya gömülü) | @iconify-json/tabler 1.2.38 (Tabler 3.45.0) | MIT — `tabler-icons/LICENSE` | hizmet, adım, iletişim ve düğme simgeleri | https://tabler.io/icons |
| astro-icon | 1.2.0 | MIT | derleme aracı (simgeleri SVG olarak basar) | https://github.com/natemoo-re/astro-icon |

Mizan'ın kendi betikleri (`assets/js/*.js`) ve görselleri (`assets/img`) diyetisyen-v2'den gelir;
bu şablonda üçüncü taraf JS kütüphanesi (GSAP, Lenis vb.) yoktur.
