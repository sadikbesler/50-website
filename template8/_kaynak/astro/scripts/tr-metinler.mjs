// Mizan: özgün sayfalardaki data-i18n / data-i18n-attr değerlerini (Türkçe metin HTML'dedir)
// src/data/tr-metinler.json'a çıkarır. Bileşenler Türkçe metni buradan alır; böylece
// metin diyetisyen-v2'dekiyle harfi harfine aynı kalır. Çalıştır: node scripts/tr-metinler.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const here = path.dirname(fileURLToPath(import.meta.url));
const OZGUN = path.resolve(here, '../../ozgun');
const out = {};
const cakisma = [];
function* walk(n) {
  yield n;
  for (const c of n.children || []) yield* walk(c);
}
for (const f of ['index.html', 'blog/index.html', 'kvkk.html', 'blog/insulin-direnci-beslenme.html']) {
  const tree = fromHtml(readFileSync(path.join(OZGUN, f), 'utf8'));
  for (const n of walk(tree)) {
    if (n.type !== 'element' || !n.properties) continue;
    const key = n.properties.dataI18n;
    if (key) {
      const v = toText(n).replace(/\s+/g, ' ').trim();
      if (key in out && out[key] !== v) cakisma.push(`${key}: "${out[key]}" ≠ "${v}"`);
      else out[key] = v;
    }
    const attr = n.properties.dataI18NAttr ?? n.properties.dataI18nAttr;
    if (attr) {
      for (const pair of String(attr).split(';').filter(Boolean)) {
        const i = pair.indexOf(':');
        const a = pair.slice(0, i).trim();
        const k = pair.slice(i + 1).trim();
        const prop = a === 'aria-label' ? 'ariaLabel' : a;
        const v = n.properties[prop];
        if (v != null && !(k in out)) out[k] = String(v);
      }
    }
  }
}
writeFileSync(path.resolve(here, '../src/data/tr-metinler.json'), JSON.stringify(out, null, 1) + '\n');
console.log(Object.keys(out).length, 'anahtar');
if (cakisma.length) console.log('Aynı anahtar farklı metin (ilk bulunan kullanıldı):\n' + cakisma.join('\n'));
