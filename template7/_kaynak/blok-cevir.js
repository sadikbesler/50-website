// template7 — Tailblocks JSX → HTML çevirici (tekrar çalıştırılabilir: node blok-cevir.js)
// Girdi : indirilen/tailblocks/src/blocks/<kategori>/<light|dark>/<harf>.js (MIT, mertJF/tailblocks)
// Kural : className → class, {props.theme} → green (Tailblocks'un kendi renk seçicisindeki "green"),
//         JSX nitelikleri HTML adlarına (strokeWidth → stroke-width, htmlFor → for …).
// Koyu  : Aynı bloğun dark/<harf>.js sürümü öğe öğe (aynı ağaç sırası) açık sürümle eşlenir; açıkta olmayan
//         her koyu sınıf, açık öğeye "dark:" önekiyle eklenir (renkler koyu dosyadakiyle birebir).
// Çıktı : bloklar/<kategori>-<harf>.html  (birleşik HTML, kaynak metinleriyle — yalnızca inceleme için)
//         bloklar/ogeler.json              (blok başına öğe listesi: etiket + birleşik sınıf; sayfa kurucusu buradan okur)
//         bloklar/sayim.json               (blok başına sınıf sayımı ve kayıp denetimi → PARCALAR.md)
'use strict';
const fs = require('fs');
const path = require('path');
const { parse } = require('@babel/parser');

const KOK = path.join(__dirname, 'indirilen/tailblocks/src/blocks');
const CIKTI = path.join(__dirname, 'bloklar');
const TEMA = 'green';
// Promtun bölüm eşlemesindeki bloklar (+ SSS için feature/d, makale için content/e)
const BLOKLAR = ['header/a', 'hero/a', 'statistic/a', 'content/h', 'gallery/a', 'step/a', 'testimonial/b', 'team/b',
  'pricing/a', 'contact/c', 'feature/c', 'blog/a', 'pricing/b', 'contact/b', 'blog/c', 'content/e', 'feature/d', 'cta/b', 'footer/a'];

const ATTR = { className: 'class', htmlFor: 'for', tabIndex: 'tabindex', frameBorder: 'frameborder', marginHeight: 'marginheight',
  marginWidth: 'marginwidth', xmlnsXlink: 'xmlns:xlink', xlinkHref: 'xlink:href' };
const kebab = (s) => ATTR[s] || (/^(stroke|fill|clip|stop|font|text|dominant|color)[A-Z]/.test(s) ? s.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) : s);
const BOS = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'source']);

function jsxBul(dosya) {
  const src = fs.readFileSync(dosya, 'utf8');
  const ast = parse(src, { sourceType: 'module', plugins: ['jsx'] });
  let bulunan = null;
  (function gez(n) {
    if (bulunan || !n || typeof n.type !== 'string') return;
    if (n.type === 'ReturnStatement' && n.argument && n.argument.type === 'JSXElement') { bulunan = n.argument; return; }
    for (const k of Object.keys(n)) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach(gez); else if (v && typeof v.type === 'string') gez(v);
    }
  })(ast.program);
  if (!bulunan) throw new Error('JSX yok: ' + dosya);
  return bulunan;
}

// JSX ifadesini dizeye çevir: "…", `…${props.theme}…`, {2}, style={{…}}
function deger(v, ad) {
  if (!v) return ad === 'href' ? '#' : '';              // <a href> → href="#"
  if (v.type === 'StringLiteral') return v.value;
  if (v.type === 'JSXExpressionContainer') {
    const e = v.expression;
    if (e.type === 'StringLiteral') return e.value;
    if (e.type === 'NumericLiteral') return String(e.value);
    if (e.type === 'TemplateLiteral') {
      return e.quasis.map((q, i) => {
        let s = q.value.cooked;
        if (i < e.expressions.length) {
          const x = e.expressions[i];
          if (x.type === 'MemberExpression' && x.object.name === 'props' && x.property.name === 'theme') s += TEMA;
          else throw new Error('bilinmeyen şablon ifadesi');
        }
        return s;
      }).join('');
    }
    if (e.type === 'ObjectExpression' && ad === 'style') {
      return e.properties.map((p) => `${p.key.name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}: ${p.value.value}`).join('; ');
    }
  }
  throw new Error('bilinmeyen nitelik değeri: ' + ad + ' ' + v.type);
}

// JSX → düz ağaç { tag, attrs: [[ad, değer]], cls: [..], children: [düğüm | {text}] }
function agac(n) {
  const tag = n.openingElement.name.name;
  const attrs = [];
  let cls = [];
  for (const a of n.openingElement.attributes) {
    const ad = a.name.name;
    const d = deger(a.value, ad);
    if (ad === 'className') cls = d.split(/\s+/).filter(Boolean);
    else attrs.push([kebab(ad), d]);
  }
  const children = [];
  for (const c of n.children) {
    if (c.type === 'JSXElement') children.push(agac(c));
    else if (c.type === 'JSXText') {
      const t = c.value.replace(/\s*\n\s*/g, ' ');
      if (t.trim()) children.push({ text: t.replace(/^\s+/, c.value.startsWith(' ') && !c.value.startsWith(' \n') ? ' ' : '').replace(/\s+$/, (c.value.match(/\S\s+$/) && !/\n\s*$/.test(c.value)) ? ' ' : '') });
    } else if (c.type === 'JSXExpressionContainer') {
      if (c.expression.type === 'StringLiteral') children.push({ text: c.expression.value });
      else if (c.expression.type !== 'JSXEmptyExpression') throw new Error('bilinmeyen çocuk ifadesi');
    }
  }
  return { tag, attrs, cls, children };
}

// Açık + koyu ağaçlarını öğe öğe birleştir
function birlestir(a, k, iz, rapor) {
  if (!k || a.tag !== k.tag) {
    rapor.uyumsuz.push(`${iz}: ${a.tag} ↔ ${k ? k.tag : 'yok'}`);
    return { ...a, dcls: [], children: a.children.map((c, i) => (c.text !== undefined ? c : birlestir(c, null, `${iz}>${c.tag}[${i}]`, rapor))) };
  }
  const acik = new Set(a.cls);
  const koyu = new Set(k.cls);
  const dcls = k.cls.filter((c) => !acik.has(c));
  rapor.acik += a.cls.length; rapor.koyu += k.cls.length;
  rapor.ortak += k.cls.filter((c) => acik.has(c)).length; rapor.darkEk += dcls.length;
  // Koyu sürümde karşılığı olmayan açık renk sınıfları (koyu temada açık değer kalır) → rapor
  // (aynı varyant + aynı renk özelliği koyu sürümde hiç yoksa)
  const RENK = /^((?:[a-z]+:)*)(bg|text|border|placeholder|ring)-(white|black|transparent|[a-z]+-\d{2,3})$/;
  const grup = (c) => { const m = c.match(RENK); return m ? m[1] + m[2] : null; };
  const koyuGrup = new Set(k.cls.map(grup).filter(Boolean));
  // Bunlar koyu dosyada "yok" demektir (zemin saydam, metin kalıtılır); birebirlik için nötrleyici eklenir.
  const NOTR = { bg: 'bg-transparent', text: 'text-inherit' };
  a.cls.filter((c) => !koyu.has(c) && grup(c) && !koyuGrup.has(grup(c))).forEach((c) => {
    const m = c.match(RENK);
    if (!NOTR[m[2]]) throw new Error('nötrleyici yok: ' + c);
    dcls.push(m[1] + NOTR[m[2]]); rapor.notr++;
    rapor.yalnizAcik.push(`${iz} ${c} → dark:${m[1]}${NOTR[m[2]]}`);
  });
  const ae = a.children.filter((c) => c.text === undefined);
  const ke = k.children.filter((c) => c.text === undefined);
  if (ae.length !== ke.length) rapor.uyumsuz.push(`${iz}: çocuk sayısı ${ae.length} ↔ ${ke.length}`);
  let j = 0;
  const children = a.children.map((c) => (c.text !== undefined ? c : birlestir(c, ke[j++], `${iz}>${c.tag}[${j - 1}]`, rapor)));
  return { ...a, dcls, children };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const sinifDizesi = (n) => [...n.cls, ...n.dcls.map((c) => 'dark:' + c)].join(' ');
function html(n, g = 0) {
  const pad = '  '.repeat(g);
  if (n.text !== undefined) return pad + n.text.trim();
  const cls = sinifDizesi(n);
  const at = (cls ? ` class="${cls}"` : '') + n.attrs.map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
  if (BOS.has(n.tag)) return `${pad}<${n.tag}${at}>`;
  if (!n.children.length) return `${pad}<${n.tag}${at}></${n.tag}>`;
  if (n.children.every((c) => c.text !== undefined)) return `${pad}<${n.tag}${at}>${n.children.map((c) => c.text).join('').trim()}</${n.tag}>`;
  return `${pad}<${n.tag}${at}>\n${n.children.map((c) => html(c, g + 1)).join('\n')}\n${pad}</${n.tag}>`;
}
function ogeler(n, out = []) {
  if (n.text !== undefined) return out;
  out.push({ tag: n.tag, c: sinifDizesi(n) });
  n.children.forEach((c) => ogeler(c, out));
  return out;
}
// Birleşik HTML'deki sınıfları say ve kayıp denetimi yap: her açık sınıf aynı öğede aynen, her koyu sınıf aynen ya da dark: ile
function denetle(acikA, koyuA, birlesik) {
  let kayip = 0;
  (function gez(a, k, b) {
    if (a.text !== undefined) return;
    const bs = new Set(sinifDizesi(b).split(' ').filter(Boolean));
    a.cls.forEach((c) => { if (!bs.has(c)) kayip++; });
    if (k && k.tag === a.tag) k.cls.forEach((c) => { if (!bs.has(c) && !bs.has('dark:' + c)) kayip++; });
    const ae = a.children.filter((c) => c.text === undefined), ke = k ? k.children.filter((c) => c.text === undefined) : [], be = b.children.filter((c) => c.text === undefined);
    ae.forEach((c, i) => gez(c, ke[i], be[i]));
  })(acikA, koyuA, birlesik);
  return kayip;
}

fs.mkdirSync(CIKTI, { recursive: true });
const SAYIM = {};
const OGELER = {};
for (const b of BLOKLAR) {
  const [kat, harf] = b.split('/');
  const lf = path.join(KOK, kat, 'light', harf + '.js');
  const df = path.join(KOK, kat, 'dark', harf + '.js');
  const temaSayisi = (fs.readFileSync(lf, 'utf8').match(/\$\{props\.theme\}/g) || []).length;
  const acik = agac(jsxBul(lf));
  const koyu = agac(jsxBul(df));
  const rapor = { acik: 0, koyu: 0, ortak: 0, darkEk: 0, notr: 0, uyumsuz: [], yalnizAcik: [] };
  const bir = birlestir(acik, koyu, kat, rapor);
  const cikti = html(bir);
  const toplam = (cikti.match(/class="([^"]*)"/g) || []).reduce((s, m) => s + m.slice(7, -1).split(/\s+/).filter(Boolean).length, 0);
  const dark = (cikti.match(/\bdark:[^\s"]+/g) || []).length;
  const kayip = denetle(acik, koyu, bir);
  fs.writeFileSync(path.join(CIKTI, `${kat}-${harf}.html`), `<!-- Tailblocks ${kat}/light/${harf}.js + ${kat}/dark/${harf}.js → HTML (tema: ${TEMA}) -->\n${cikti}\n`);
  OGELER[b] = ogeler(bir);
  SAYIM[b] = { jsxAcik: rapor.acik, jsxKoyu: rapor.koyu, ortak: rapor.ortak, darkEklenen: rapor.darkEk, notrleyici: rapor.notr, htmlToplam: toplam, htmlDark: dark,
    temaYerine: temaSayisi, kayip, dogru: toplam === rapor.acik + rapor.darkEk + rapor.notr && kayip === 0, uyumsuz: rapor.uyumsuz, yalnizAcik: rapor.yalnizAcik };
  console.log(`${b.padEnd(14)} açık ${String(rapor.acik).padStart(3)} · koyu ${String(rapor.koyu).padStart(3)} · ortak ${String(rapor.ortak).padStart(3)} · +dark: ${String(rapor.darkEk).padStart(3)}${rapor.notr ? ' +nötr ' + rapor.notr : ''} → html ${String(toplam).padStart(3)} · kayıp ${kayip}${rapor.uyumsuz.length ? ' · UYUMSUZ ' + rapor.uyumsuz.join('; ') : ''}${rapor.yalnizAcik.length ? ' · ' + rapor.yalnizAcik.join(', ') : ''}`);
}
fs.writeFileSync(path.join(CIKTI, 'sayim.json'), JSON.stringify(SAYIM, null, 1));
fs.writeFileSync(path.join(CIKTI, 'ogeler.json'), JSON.stringify(OGELER));
