# Üçüncü taraf parçalar (template1 · Preline UI)

Hepsi site içinden (`self`) sunulur; çalışma anında CDN yoktur. Sinematik katmanın dosyaları (GSAP, ScrollTrigger, Flip, SplitText, CustomEase, Lenis) bu şablonda kaldırıldı.

| Parça | Sürüm | Lisans | Kaynak | Sitede nerede |
|---|---|---|---|---|
| Preline UI (`preline/preline.js`) | 5.0.0 (npm, 21.08.2026) | MIT + Preline UI Fair Use License (`preline/LICENSE`) | https://preline.co · https://github.com/htmlstreamofficial/preline | Yalnızca offcanvas menü (HSOverlay), SSS accordion (HSAccordion) ve footer dil menüsü (HSDropdown) işaretlemesi var |
| Preline UI bloklarının ve bileşenlerinin HTML'i | preline.co, 26.09.2026 | aynı (yalnızca FREE etiketli bloklar) | https://preline.co/blocks · https://preline.co/docs | Bütün bölümler; blok blok liste: `_kaynak/PARCALAR.md` |
| Preline teması (`preline/theme.css`) | 5.0.0 | aynı | npm `preline` | `_kaynak/tw.css` içinde derlenir → `assets/css/tw.css` |
| Tailwind CSS + `@tailwindcss/cli` | 4.3.3 | MIT | https://tailwindcss.com | `assets/css/tw.css` (derlenmiş, başlığında lisans satırı var) |
| `@tailwindcss/forms` | 0.5.11 | MIT | https://github.com/tailwindlabs/tailwindcss-forms | Form girişleri (Preline kurulum belgesinin istediği eklenti) |
| Lucide ikonları (`lucide/LICENSE`) | lucide-static 1.48.0 | ISC | https://lucide.dev | Blokların kendi ikon seti; SVG'ler HTML'e satır içi kopyalandı (hizmetler, menü, iletişim, kısa bilgiler…) |
| flag-icons (`flag-icons/LICENSE`) | 7.5.0 | MIT | https://github.com/lipis/flag-icons | Footer dil menüsündeki TR ve GB bayrakları (bloğun `flag-icon-css-*` SVG'leri bu setten), satır içi |

Preline UI Fair Use License gereği atıf: bu şablon Preline UI'dan türetilmiştir — https://github.com/htmlstreamofficial/preline. Preline'a rakip bir UI kütüphanesi değildir.
