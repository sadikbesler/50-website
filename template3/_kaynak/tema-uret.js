// "light" ve "dark" adlı iki daisyUI özel teması üretir: node tema-uret.js → tema.css
// Değerler elle yazılmaz; node_modules/daisyui/theme/emerald.css ve forest.css dosyalarından
// satır satır kopyalanır. site.js <html data-theme="light|dark"> yazdığı için tema adları böyle.
'use strict';
const fs = require('fs');
const path = require('path');

const KAYNAK = { light: 'emerald', dark: 'forest' };
const THEME_DIR = path.join(__dirname, 'node_modules/daisyui/theme');
const surum = require('./node_modules/daisyui/package.json').version;

function degiskenler(ad) {
  const css = fs.readFileSync(path.join(THEME_DIR, `${ad}.css`), 'utf8');
  const govde = css.slice(css.indexOf('{') + 1, css.lastIndexOf('}'));
  const satirlar = govde.split(';').map((s) => s.trim()).filter(Boolean);
  if (!satirlar.length) throw new Error('tema boş: ' + ad);
  return satirlar;
}

let out = `/* Otomatik üretildi (tema-uret.js) — elle düzenlemeyin.
   daisyUI ${surum}: light = "emerald", dark = "forest" temalarının değerleri birebir. */\n`;
for (const [ad, kaynak] of Object.entries(KAYNAK)) {
  const satirlar = degiskenler(kaynak);
  out += `\n/* ${ad} ← node_modules/daisyui/theme/${kaynak}.css */\n@plugin "daisyui/theme" {\n  name: "${ad}";\n  default: ${ad === 'light'};\n  prefersdark: ${ad === 'dark'};\n`;
  for (const s of satirlar) out += `  ${s};\n`;
  out += '}\n';
}
fs.writeFileSync(path.join(__dirname, 'tema.css'), out);
console.log('tema.css yazıldı:', Object.entries(KAYNAK).map(([a, k]) => `${a}←${k}`).join(', '));
