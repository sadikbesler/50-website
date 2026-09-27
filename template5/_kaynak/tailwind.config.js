/** @type {import('tailwindcss').Config} */
// Landwind deposundaki tailwind.config.js (themesberg/landwind@f8be851, MIT) birebir kopyası.
// Yalnızca üç değişiklik: content yolları (ortak kurallar 0.7), darkMode: 'class', plugins → require('flowbite/plugin').
module.exports = {
  darkMode: 'class',
  content: ['../index.html', '../blog/*.html', '../kvkk.html', '../assets/js/*.js', '../assets/vendor/flowbite/flowbite.js'],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" }
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
