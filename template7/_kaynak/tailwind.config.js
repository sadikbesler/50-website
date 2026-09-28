// template7 — Tailblocks (MIT). Kaynak önizlemesi Tailwind 2.0.2'yi CDN'den çeker; burada aynı sınıflar
// Tailwind 3.4.17 ile yerelde derlenir (0.7). v2.0.2 → v3 farkları indirilen/tailwind-2.0.2.min.css'ten ölçüldü:
//  1. "green": v2.0.2'de varsayılan yeşil EMERALD paletidir (green-500 = #10b981). v3'te "green" ayrı bir palet
//     (#22c55e); v3'ün emerald paleti v2.0.2'deki green ile 50–900 arası birebir aynı → green = emerald.
//  2. gray: v2.0.2 gray = v3 gray (50–900 birebir), ek gerekmedi.
//  3. Gölgeler: v3'te sm/DEFAULT/md/lg/xl ikinci katmanı farklı; v2.0.2 değerleri geri kondu.
//  4. Yazı: Kaynak ölçümü (test/kaynak-olcum.json) v2.0.2 sans yığınını verdi; aynısı font-sans'a kondu.
const colors = require('tailwindcss/colors');
const { '950': _yok, ...emerald } = colors.emerald; // v2'de 950 yok

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['../index.html', '../blog/*.html', '../kvkk.html', '../assets/js/*.js'],
  theme: {
    extend: {
      colors: { green: emerald },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', '"Noto Sans"', 'sans-serif', '"Apple Color Emoji"', '"Segoe UI Emoji"', '"Segoe UI Symbol"', '"Noto Color Emoji"'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
