// template6 — Tailwind Toolbox "Landing Page" (MIT). Kaynak Tailwind 2.2.19'u CDN'den çeker;
// burada aynı sınıflar Tailwind 3.4.17 ile yerelde derlenir (0.7).
// v2 → v3 farkı olarak ölçülen tek şey gölge değerleri: v3'te `shadow` ve `shadow-lg` ikinci katmanı
// farklı (-1px/-4px yayılma, 0.1 opaklık). Kaynağın görünüşü için v2.2.19 değerleri extend ile geri kondu.
// Renkler: v2.2.19 varsayılan paleti (gray = coolGray, pink) v3'ün gray/pink ölçeğiyle birebir aynı; ek gerekmedi.
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['../index.html', '../blog/*.html', '../kvkk.html', '../assets/js/*.js'],
  theme: {
    extend: {
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
