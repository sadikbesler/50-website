// template7 sayfa kurucusu (Tailblocks, tema "green"). Tekrar çalıştırılabilir: sh yap.sh
// Girdiler:
//   bloklar/ogeler.json                         — blok-cevir.js'in JSX'ten çevirdiği öğe/sınıf listesi (açık + dark:)
//   _kaynak/sayfa/*.html                        — Tailblocks bloklarının iskeletiyle yazılmış sayfa şablonları
//   diyetisyen-animasyon-v2/*.html (salt okunur) — head, metinler, JS'e bağlı bloklar
// Şablonda sınıflar elle yazılmaz, bloktan çekilir:  {{k:<kategori>/<harf>:<etiket>:<sıra>|<değişiklik>…}}
//   <sıra>   : o etiketin blok içindeki sırası (bloklar/dizin.txt)
//   +x / -x  : sınıf ekle / çıkar      ~a>b : a'yı b ile değiştir
//   ton      : metin taşıyan yeşil zemin (bg-green-500 → 700, hover 600 → 800) — erişilebilirlik (DURUM.md)
//   koyu     : bloğun koyu sürüm renkleri temadan bağımsız uygulanır (görsel üstündeki S16 için)
// Her {{k:…}} çağrısı sayılır; test/bloklar-denetim.js hangi blok sınıfının sayfada kullanıldığını raporlar.
// Çıktılar: template7/index.html, template7/blog/*.html, template7/kvkk.html, bloklar/kullanim.json
'use strict';
const fs = require('fs');
const path = require('path');

const N = 7;
const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const OGELER = JSON.parse(fs.readFileSync(path.join(__dirname, 'bloklar/ogeler.json'), 'utf8'));

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, `50-website/template${N}`).replace(/diyetisyen-animasyon-v2/g, `template${N}`);
const reveal = (s) => s.replace(/ data-reveal(="[^"]*")?/g, '');

/* ---------- Sınıf seçici ---------- */
const KULLANIM = {}; // blok → Set(sınıf)
// Erişilebilirlik ton eşlemesi (her çağrıda): açık zeminde 4,5:1'i geçmeyen metin renkleri bir ton koyulaşır
const TON_METIN = [
  [/^text-green-500$/, 'text-green-700'],   // 2,5:1 → 5,5:1
  [/^text-gray-400$/, 'text-gray-500'],     // 2,5:1 → 4,8:1
  [/^dark:text-gray-500$/, 'dark:text-gray-400'], // gray-900 üstünde 3,9:1 → 7,0:1
  [/^dark:text-opacity-75$/, ''],                 // blog/c çipi: gray-800 üstünde %75 opaklık 4,5:1'in altına düşürüyor
];
const TON_ZEMIN = [[/^bg-green-500$/, 'bg-green-700'], [/^hover:bg-green-600$/, 'hover:bg-green-800']];
const RENK = /^((?:[a-z-]+:)*)(bg|text|border|ring|placeholder)-(white|black|transparent|inherit|current|[a-z]+-\d{2,3})$/;
const OPAK = /^((?:[a-z-]+:)*)(bg|text|border)-opacity-\d+$/;
function grup(c) {
  let m = c.match(RENK); if (m) return m[1] + m[2] + '-renk';
  m = c.match(OPAK); if (m) return m[1] + m[2] + '-opak';
  return null;
}
function K(spec) {
  const [ana, ...mods] = spec.split('|');
  const [kat, harf, tag, sira] = ana.split(':').length === 4 ? ana.split(':') : (() => { const p = ana.split(':'); return [p[0].split('/')[0], p[0].split('/')[1], p[1], p[2]]; })();
  const blok = `${kat}/${harf}`;
  const liste = OGELER[blok];
  if (!liste) throw new Error('blok yok: ' + blok);
  const adaylar = liste.filter((o) => o.tag === tag);
  const o = adaylar[+sira];
  if (!o) throw new Error(`öğe yok: ${spec}`);
  let c = o.c.split(' ').filter(Boolean);
  (KULLANIM[blok] = KULLANIM[blok] || new Set());
  c.forEach((x) => KULLANIM[blok].add(x));
  // otomatik metin tonu
  c = c.map((x) => { for (const [re, y] of TON_METIN) if (re.test(x)) return y; return x; }).filter(Boolean);
  // text-gray-500 koyu karşılığı yoksa gray-900 üstünde 3,9:1 → dark:text-gray-400
  if (c.includes('text-gray-500') && !c.some((x) => /^dark:text-/.test(x))) c.push('dark:text-gray-400');
  for (const m of mods) {
    if (m === 'ton') c = c.map((x) => { for (const [re, y] of TON_ZEMIN) if (re.test(x)) return y; return x; });
    else if (m === 'koyu') {
      const koyular = c.filter((x) => x.startsWith('dark:')).map((x) => x.slice(5));
      const gruplar = new Set(koyular.map(grup).filter(Boolean));
      c = c.filter((x) => !x.startsWith('dark:') && !(grup(x) && gruplar.has(grup(x)))).concat(koyular);
      c = c.map((x) => (x === 'text-gray-500' ? 'text-gray-400' : x));
    } else if (m[0] === '+') c.push(m.slice(1));
    else if (m[0] === '-') { const i = c.indexOf(m.slice(1)); if (i < 0) throw new Error(`çıkarılacak sınıf yok: ${m} ← ${spec}`); c.splice(i, 1); }
    else if (m[0] === '~') { const [a, b] = m.slice(1).split('>'); const i = c.indexOf(a); if (i < 0) throw new Error(`değiştirilecek sınıf yok: ${a} ← ${spec}`); c[i] = b; }
    else throw new Error('bilinmeyen değişiklik: ' + m);
  }
  return [...new Set(c)].join(' ');
}

/* ---------- Kaynaktan (çevrilmiş bloklardan) kesilen SVG'ler ---------- */
const BLOKHTML = (ad) => oku(path.join(__dirname, 'bloklar', ad + '.html'));
const svgler = (ad) => BLOKHTML(ad).match(/<svg[\s\S]*?<\/svg>/g).map((s) => s.replace(/\n\s*/g, '').replace(/^<svg /, '<svg aria-hidden="true" focusable="false" '));
const OK = svgler('content-h')[0]; // "Learn More" oku (w-4 h-4 ml-2)
const ADIM_SVG = svgler('step-a');  // 0 kalkan, 1 aktivite, 2 çapa, 3 kişi, 4 onay
const TIRNAK = svgler('testimonial-b')[0];
const CHECK = svgler('pricing-a')[0]; // w-3 h-3 onay
const CIZGI = CHECK.replace(/<path d="[^"]*"><\/path>/, '<path d="M5 12h14"></path>');
// Logo: header/a'nın yuvarlak yeşil logo yuvası; Tailblocks'un yer tutucu işareti yerine Mizan "m" çizgisi
const LOGO = (kls) => `<svg class="${kls}" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 18v-6.5a3 3 0 0 1 6 0V18m0-6.5a3 3 0 0 1 6 0V18"></path></svg>`;

/* ---------- Dengeli öğe kesici ---------- */
function oge(html, acilis, tag) {
  const i = html.indexOf(acilis);
  if (i < 0) throw new Error('bulunamadı: ' + acilis);
  tag = tag || acilis.match(/^<(\w+)/)[1];
  const re = new RegExp(`<${tag}\\b|</${tag}>`, 'g');
  re.lastIndex = i;
  let d = 0, m;
  while ((m = re.exec(html))) {
    d += m[0][1] === '/' ? -1 : 1;
    if (d === 0) return html.slice(i, m.index + m[0].length);
  }
  throw new Error('kapanmadı: ' + acilis);
}

/* ---------- <head> ---------- */
function head(src, anaSayfa) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace(/\s*<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '\n  <link rel="preload" as="image" href="assets/img/hero-gezegen-son.jpg" fetchpriority="high">');
  // Tailblocks yazı tipi: Tailwind varsayılan sans (sistem yazı tipi) → Google Fonts bağlantıları kalkar
  h = h.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>/g, '');
  h = h.replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*">/, '');
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#ffffff">');
  if (anaSayfa) {
    const t = `Diyetisyen web sitesi · Template ${N} (Tailblocks)`;
    const d = 'Tailblocks’un yeşil temalı, sade bloklarıyla kurulmuş hızlı bir diyetisyen sitesi. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/gsap|lenis|motion\.js|premium\.css|site\.css|hero-gezegen-ilk|fonts\.googleapis\.com\/css2/i.test(h)) throw new Error('head temizlenmedi');
  return h;
}

/* ---------- Özgün içerik ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));
const IKON = (() => {
  const sky = oge(ozgunIndex, '<section class="panel sky"', 'section');
  const s = sky.match(/<svg[\s\S]*?<\/svg>/g);
  const cls = (x) => x.replace(/^<svg /, '<svg class="w-5 h-5 shrink-0" ');
  return { wa: cls(s[0]), tel: cls(s[1]), map: cls(s[2]) };
})();
const ASTERIA = oge(ozgunIndex, '<a class="footer-credit"', 'a')
  .replace('class="footer-credit"', `class="footer-credit ${K('footer/a:a:17')} inline-flex items-center gap-1 align-middle"`);

// Sekme anahtarı: pricing/a "Monthly/Annually" — seçili = düğme:0 (bg-green-500 text-white → ton), seçili değil = düğme:1
const TOGGLE = (() => {
  const secili = K('pricing/a:button:0|ton').split(' ').filter((x) => /^(bg|text)-/.test(x));
  const d = ['aria-selected', 'aria-checked', 'aria-pressed'];
  return K('pricing/a:button:1') + ' ' + d.map((v) => secili.map((x) => `${v}:${x}`).concat(`dark:${v}:text-white`).join(' ')).join(' ');
})();

// S4: 6 hizmet kartı — content/h kartı
function hizmetler() {
  const re = /<article class="service[^"]*"[^>]*>\s*<a href="#randevu" (data-book-[a-z]+="[^"]+")>([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2];
    const img = ic.match(/<img ([^>]*)>/)[1].replace(/ sizes="[^"]*"/, ' sizes="(min-width: 768px) 33vw, 100vw"');
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const p = ic.match(/<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const book = ic.match(/<span class="link-arrow" data-i18n="([^"]+)">([^<]*)<\/span>/);
    out.push(`          <article class="${K('content/h:div:6')}">
            <div class="${K('content/h:div:7')}"><img class="${K('content/h:img:0')}" ${img}></div>
            <h3 class="${K('content/h:h2:0')}" data-i18n="${h3[1]}">${h3[2]}</h3>
            <p class="${K('content/h:p:1')}" data-i18n="${p[1]}">${p[2]}</p>
            <a class="${K('content/h:a:0|ton')}" href="#randevu" ${m[1]}><span data-i18n="${book[1]}">${book[2]}</span>${OK}</a>
          </article>`);
  }
  if (out.length !== 6) throw new Error('hizmet sayısı ' + out.length);
  return out.join('\n');
}

// S5: 7 not görseli — gallery/a deseni: [½ ½ tam] [tam ½ ½] + 7. görsel tam genişlikte (aynı satır yüksekliği: 10:3)
function notlar() {
  const re = /<figure class="note[^"]*" data-note[^>]*>\s*<img ([^>]*)>\s*<figcaption data-i18n="([^"]+)">([^<]*)<\/figcaption>\s*<\/figure>/g;
  const n = [];
  let m;
  while ((m = re.exec(ozgunIndex))) n.push({ img: m[1], k: m[2], t: m[3] });
  if (n.length !== 7) throw new Error('not sayısı ' + n.length);
  const fig = (x, kutu, img, oran) => `            <figure class="note ${K(kutu)}" data-note>
              <img class="${K(img)} ${oran}" ${x.img}>
              <figcaption class="sr-only" data-i18n="${x.k}">${x.t}</figcaption>
            </figure>`;
  const yarim = (x) => fig(x, 'gallery/a:div:4', 'gallery/a:img:0', 'aspect-[5/3]');
  const tam = (x) => fig(x, 'gallery/a:div:6', 'gallery/a:img:2', 'aspect-[5/3]');
  return `          <div class="${K('gallery/a:div:3')}">\n${yarim(n[0])}\n${yarim(n[1])}\n${tam(n[2])}\n          </div>
          <div class="${K('gallery/a:div:3')}">\n${tam(n[3])}\n${yarim(n[4])}\n${yarim(n[5])}\n          </div>
${fig(n[6], 'gallery/a:div:6', 'gallery/a:img:2', 'aspect-[10/3]')}`;
}

// S6: 4 adım — step/a (son adım "FINISH" biçiminde, çizgisiz)
function adimlar() {
  const re = /<li class="step"[^>]*><span class="node"[^>]*><\/span><span class="label" data-i18n="([^"]+)">([^<]*)<\/span><h3 data-i18n="([^"]+)">([^<]*)<\/h3><p data-i18n="([^"]+)">([^<]*)<\/p><\/li>/g;
  const s = [];
  let m;
  while ((m = re.exec(ozgunIndex))) s.push(m);
  if (s.length !== 4) throw new Error('adım sayısı ' + s.length);
  const ikon = [ADIM_SVG[3], ADIM_SVG[1], ADIM_SVG[0], ADIM_SVG[4]];
  return s.map((x, i) => {
    const son = i === s.length - 1;
    return `            <li class="${K(son ? 'step/a:div:23' : 'step/a:div:3')}">
${son ? '' : `              <div class="${K('step/a:div:4')}" aria-hidden="true"><div class="${K('step/a:div:5')}"></div></div>\n`}              <div class="${K('step/a:div:6')}">${ikon[i]}</div>
              <div class="${K('step/a:div:7')}">
                <h3 class="${K('step/a:h2:0|+uppercase')}"><span data-i18n="${x[3]}">${x[4]}</span> · <span data-i18n="${x[1]}">${x[2]}</span></h3>
                <p class="${K('step/a:p:0')}" data-i18n="${x[5]}">${x[6]}</p>
              </div>
            </li>`;
  }).join('\n');
}

// S8: 3 uzman — team/b kartı; sosyal simge satırı yerine randevu bağlantısı (content/h bağlantı tokenı)
function uzmanlar() {
  const re = /<article class="person"[^>]*>([\s\S]*?)<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[1];
    const img = ic.match(/<img ([^>]*)>/)[1].replace(/ srcset="[^"]*"/, '').replace(/ sizes="[^"]*"/, '').replace(/ width="\d+" height="\d+"/, ' width="560" height="700"');
    const badge = ic.match(/<span class="person-badge" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const area = ic.match(/<p class="label" data-i18n="([^"]+)">([^<]*)<\/p>/);
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const bio = ic.match(/<\/h3>\s*<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const btn = ic.match(/<a class="btn[^"]*" href="#randevu" (data-book-staff="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/);
    out.push(`          <article class="${K('team/b:div:3')}">
            <div class="${K('team/b:div:4')}">
              <img class="${K('team/b:img:0')}" ${img}>
              <div class="${K('team/b:div:5')}">
                <h3 class="${K('team/b:h2:0')}" data-i18n="${h3[1]}">${h3[2]}</h3>
                <p class="${K('team/b:h3:0')}"><span data-i18n="${area[1]}">${area[2]}</span>${badge ? ` · <span data-i18n="${badge[1]}">${badge[2]}</span>` : ''}</p>
                <p class="${K('team/b:p:1')}" data-i18n="${bio[1]}">${bio[2]}</p>
                <span class="${K('team/b:span:0')}"><a class="${K('content/h:a:0|ton|-mt-3')}" href="#randevu" ${btn[1]}><span data-i18n="${btn[2]}">${btn[3]}</span>${OK}</a></span>
              </div>
            </div>
          </article>`);
  }
  if (out.length !== 3) throw new Error('uzman sayısı ' + out.length);
  return out.join('\n');
}

// S12: pricing/b tablosu + alt satır + "Neler dahil" (pricing/a liste tokenları) + kurumsal şerit (content/e)
function planlar() {
  const plan = (n) => {
    const art = ozgunIndex.match(new RegExp(`<article class="plan[^"]*"[^>]*>\\s*<div class="plan-top"><p class="label" data-i18n="plan${n}.label">[\\s\\S]*?<\\/article>`))[0];
    return {
      label: art.match(/data-i18n="(plan\d\.label)">([^<]*)</),
      price: art.match(/<p class="price">([\s\S]*?)<\/p>/)[1].replace(/<small( data-i18n="[^"]+")?>([^<]*)<\/small>/, '<span class="text-base"$1>$2</span>'),
      sub: art.match(/<p class="plan-sub" data-i18n="([^"]+)">([^<]*)<\/p>/),
      f1: art.match(/<span data-i18n="(plan\d\.f1)">([^<]*)<\/span>/),
      btn: art.match(/<a class="btn btn--primary" href="#randevu" (data-book-type="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/),
    };
  };
  const P = [1, 2, 3].map(plan);
  const satirTd = [[0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [15, 16, 17, 18, 19]]; // ilk, ara, son satırın td tokenları
  const rows = P.map((p, r) => {
    const td = satirTd[r].map((i) => `pricing/b:td:${i}`);
    return `              <tr>
                <td class="${K(td[0])} font-medium text-gray-900 dark:text-white" data-i18n="${p.label[1]}">${p.label[2]}</td>
                <td class="${K(td[1])}" data-i18n="${p.sub[1]}">${p.sub[2]}</td>
                <td class="${K(td[2])}" data-i18n="${p.f1[1]}">${p.f1[2]}</td>
                <td class="${K(td[3])} whitespace-nowrap">${p.price.trim()}</td>
                <td class="${K(td[4])}"><a class="${K('pricing/b:a:0|ton|-md:mb-2|-lg:mb-0')} p-2" href="#randevu" ${p.btn[1]} data-i18n-attr="aria-label:${p.btn[2]}" aria-label="${p.btn[3]}">${OK.replace('w-4 h-4 ml-2', 'w-4 h-4')}</a></td>
              </tr>`;
  }).join('\n');
  const incl = (tur) => {
    const ul = oge(ozgunIndex, `<ul class="incl-list incl-list--${tur}">`, 'ul');
    const lis = [...ul.matchAll(/<li><svg[\s\S]*?<\/svg><span data-i18n="([^"]+)">([^<]*)<\/span><\/li>/g)];
    const ik = tur === 'yes' ? CHECK : CIZGI;
    return lis.map((l, i) => `                <li class="${K(i === lis.length - 1 ? 'pricing/a:p:3' : 'pricing/a:p:1')}"><span class="${K('pricing/a:span:0')}">${ik}</span><span data-i18n="${l[1]}">${l[2]}</span></li>`).join('\n');
  };
  const strip = ozgunIndex.match(/<div class="strip"[^>]*>\s*<div><b data-i18n="([^"]+)">([^<]*)<\/b><span data-i18n="([^"]+)">([^<]*)<\/span><\/div>\s*<a [^>]*data-i18n="([^"]+)">([^<]*)<\/a>/);
  return `        <div class="${K('pricing/b:div:2|+relative')}">
          <table class="${K('pricing/b:table:0')}">
            <caption class="sr-only" data-i18n="pricing.title">Görüşme ücretleri</caption>
            <thead>
              <tr>
                <th scope="col" class="${K('pricing/b:th:0')}" data-i18n="pricing.colPlan">Plan</th>
                <th scope="col" class="${K('pricing/b:th:1')}" data-i18n="pricing.colFor">Kimin için</th>
                <th scope="col" class="${K('pricing/b:th:1')}" data-i18n="pricing.colIncl">Kapsam</th>
                <th scope="col" class="${K('pricing/b:th:1')}" data-i18n="pricing.colPrice">Ücret</th>
                <th scope="col" class="${K('pricing/b:th:4')}"><span class="sr-only" data-i18n="nav.book">Randevu al</span></th>
              </tr>
            </thead>
            <tbody>
${rows}
            </tbody>
          </table>
        </div>
        <div class="${K('pricing/b:div:3')}">
          <a class="${K('pricing/b:a:0|ton')}" href="#ucret-dahil"><span data-i18n="incl.title">Neler dahil, neler değil?</span>${OK}</a>
          <a class="${K('pricing/b:button:0|ton')}" href="#randevu" ${P[0].btn[1]} data-i18n="${P[0].btn[2]}">${P[0].btn[3]}</a>
        </div>
        <div id="ucret-dahil" class="lg:w-2/3 w-full mx-auto mt-16">
          <h3 class="${K('feature/c:h2:0')}" data-i18n="incl.title">Neler dahil, neler değil?</h3>
          <p class="${K('feature/c:p:0')}" data-i18n="incl.text">Sonradan ek ücret çıkmaması için baştan netleştiriyoruz.</p>
          <div class="flex flex-wrap -m-4 mt-4">
            <div class="p-4 md:w-1/2 w-full">
              <div class="${K('pricing/a:div:5')}">
                <h4 class="${K('pricing/a:h2:0|+uppercase|+mb-4')}" data-i18n="incl.yes">Dahil</h4>
                <ul>
${incl('yes')}
                </ul>
              </div>
            </div>
            <div class="p-4 md:w-1/2 w-full">
              <div class="${K('pricing/a:div:5')}">
                <h4 class="${K('pricing/a:h2:0|+uppercase|+mb-4')}" data-i18n="incl.no">Dahil değil</h4>
                <ul>
${incl('no')}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="${K('content/e:div:0|-container|-px-5|-py-24|-mx-auto|+lg:w-2/3|+w-full|+mx-auto|+mt-16')}">
          <h3 class="${K('content/e:h2:0')}" data-i18n="${strip[1]}">${strip[2]}</h3>
          <div class="${K('content/e:div:1')}">
            <p class="${K('content/e:p:0')}" data-i18n="${strip[3]}">${strip[4]}</p>
            <div class="${K('content/e:div:2')}">
              <a class="${K('content/e:button:0|ton')}" href="#iletisim" data-contact-topic="corporate" data-i18n="${strip[5]}">${strip[6]}</a>
            </div>
          </div>
        </div>`;
}

// S14: blog/c kartı. Özet ve tarih blog/index.html'deki iki dilli bloklardan, yazar makaledeki byline'dan.
const OZETLER = {};
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">[\s\S]*?<span class="cat">([\s\S]*?)<\/span>(<time[\s\S]*?<\/time>)<span>([\s\S]*?)<\/span><\/p>\s*<h2>([\s\S]*?)<\/h2>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { cat: m[2], time: m[3], read: m[4], title: m[5], ex: m[6] };
})();
const YAZAR = {};
for (const f of Object.keys(OZETLER)) {
  const a = adresler(oku(path.join(OZGUN, 'blog', f)));
  const b = a.match(/<div class="byline">\s*<img src="([^"]+)"[^>]*>\s*<div><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/div>/);
  YAZAR[f] = { img: b[1].replace(/^\.\.\//, ''), ad: b[2], rol: b[3] };
}
function blogKarti({ href, cat, title, ex, time, read, yazar, kok, hTag }) {
  return `          <article class="${K('blog/c:div:2')}">
            <span class="${K('blog/c:span:0|+uppercase')}">${cat}</span>
            <${hTag} class="${K('blog/c:h2:0')}"><a class="hover:underline" href="${href}">${title}</a></${hTag}>
            <p class="${K('blog/c:p:0')}">${ex}</p>
            <div class="${K('blog/c:div:3')}">
              <a class="${K('blog/c:a:0|ton')}" href="${href}" tabindex="-1" aria-hidden="true"><span data-i18n="blog.readMore">Devamını oku</span>${OK}</a>
              <span class="${K('blog/c:span:1|ton')}">${time}</span>
              <span class="${K('blog/c:span:2|ton')}">${read}</span>
            </div>
            <div class="${K('blog/c:a:1')}">
              <img class="${K('blog/c:img:0')}" src="${kok}${yazar.img}" width="560" height="700" loading="lazy" decoding="async" alt="">
              <span class="${K('blog/c:span:3')}">
                <span class="${K('blog/c:span:4')}">${yazar.ad}</span>
                <span class="${K('blog/c:span:5|ton|+uppercase')}">${yazar.rol}</span>
              </span>
            </div>
          </article>`;
}
function blogKartlari() {
  const re = /<article class="post-(?:feature|row)"[^>]*>\s*<a href="([^"]+)">([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2], dosya = m[1].replace(/^blog\//, ''), oz = OZETLER[dosya];
    const cat = ic.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const title = ic.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    out.push(blogKarti({ href: m[1], hTag: 'h3', kok: '', yazar: YAZAR[dosya], cat: `<span data-i18n="${cat[1]}">${cat[2]}</span>`,
      title: `<span data-i18n="${title[1]}">${title[2]}</span>`, ex: oz.ex, time: oz.time, read: oz.read }));
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

// S15: SSS — feature/d metin tipografisi + kart kenarı
function sss() {
  const re = /<details class="faq"([^>]*)>\s*<summary><h3 data-i18n="([^"]+)">([^<]*)<\/h3><span class="faq-icon" aria-hidden="true"><\/span><\/summary>\s*<div class="faq-a"><p data-i18n="([^"]+)">([^<]*)<\/p><\/div>\s*<\/details>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const acik = / open/.test(m[1]) ? ' open' : '';
    out.push(`          <div class="${K('feature/d:div:2|-lg:w-1/2|-md:w-full|+w-full')}">
            <details class="faq ${K('feature/d:div:3|-flex|-sm:flex-row|-flex-col|~p-8>p-6|+block')}"${acik}>
              <summary class="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 class="${K('feature/d:h2:0|-mb-3')}" data-i18n="${m[2]}">${m[3]}</h3>
                <span class="faq-icon ${K('feature/d:div:4|~w-16>w-8|~h-16>h-8|-sm:mr-8|-sm:mb-0|-mb-4')}" aria-hidden="true"><svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"></path></svg></span>
              </summary>
              <div class="faq-a"><p class="${K('feature/d:p:0|+mt-3')}" data-i18n="${m[4]}">${m[5]}</p></div>
            </details>
          </div>`);
  }
  if (out.length !== 10) throw new Error('SSS sayısı ' + out.length);
  return out.join('\n');
}

// S17: çalışma saatleri — pricing/b tablo hücre tokenları
function saatler() {
  const re = /<tr data-dow="(\d)"><th scope="row" data-i18n="([^"]+)">([^<]*)<\/th><td( data-i18n="[^"]+")?>([^<]*)<\/td><\/tr>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const td = out.length === 0 ? ['pricing/b:td:0', 'pricing/b:td:0'] : out.length === 6 ? ['pricing/b:td:15', 'pricing/b:td:16'] : ['pricing/b:td:5', 'pricing/b:td:6'];
    out.push(`                <tr data-dow="${m[1]}"><th scope="row" class="${K(td[0])} font-normal text-left" data-i18n="${m[2]}">${m[3]}</th><td class="${K(td[1])} text-right"${m[4] || ''}>${m[5]}</td></tr>`);
  }
  if (out.length !== 7) throw new Error('saat satırı ' + out.length);
  return out.join('\n');
}

/* ---------- JS'e bağlı bloklar: özgün işaretleme korunur, sınıflar tw.css'te Tailblocks tokenlarıyla ---------- */
function bloklar() {
  const araclar = ['<div class="tool" role="tabpanel" id="tool-bmi"', '<div class="tool" role="tabpanel" id="tool-kcal"', '<div class="tool" role="tabpanel" id="tool-water"'].map((a) => oge(ozgunIndex, a, 'div')).join('\n');
  const randevu = oge(ozgunIndex, '<div class="booking" data-booking>', 'div');
  const i = ozgunIndex.indexOf('  <!-- ================= Recipe dialog');
  const sonek = ozgunIndex.slice(i, ozgunIndex.indexOf('</body>')).trimEnd();
  const R = (s) => reveal(s);
  return { araclar: R(araclar), randevu: R(randevu), sonek: R(sonek) };
}

function tokenlar(html, yer) {
  html = html.replace(/\{\{k:([^}]+)\}\}/g, (m, spec) => K(spec));
  html = html.replace(/\{\{toggle\}\}/g, TOGGLE);
  html = html.replace(/\{\{logo\}\}/g, () => LOGO(K('header/a:svg:0')));
  html = html.replace(/\{\{ok\}\}/g, OK).replace(/\{\{tirnak\}\}/g, TIRNAK);
  html = html.replace(/\{\{ikon:(\w+)\}\}/g, (m, k) => IKON[k]);
  html = html.replace(/\{\{asteria\}\}/g, ASTERIA);
  html = html.replace(/\{\{h\}\}/g, yer.h).replace(/\{\{r\}\}/g, yer.r).replace(/\{\{blog\}\}/g, yer.blog)
    .replace(/\{\{brand\}\}/g, yer.brand).replace(/\{\{top\}\}/g, yer.top).replace(/\{\{blogcur\}\}/g, yer.blogcur || '');
  const kalan = html.match(/\{\{[^}]+\}\}/);
  if (kalan) throw new Error('doldurulmamış yer tutucu: ' + kalan[0]);
  return html;
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  const dol = { hizmetler: hizmetler(), notlar: notlar(), adimlar: adimlar(), uzmanlar: uzmanlar(), planlar: planlar(),
    blogkartlari: blogKartlari(), sss: sss(), saatler: saatler(), ...bloklar() };
  govde = govde.replace(/\{\{(hizmetler|notlar|adimlar|uzmanlar|planlar|blogkartlari|sss|saatler|araclar|randevu|sonek)\}\}/g, (m, k) => dol[k]);
  const yer = { h: '', r: '', blog: 'blog/', brand: '#top', top: '#top' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
}

/* ---------- Alt sayfalar: blog dizini (blog/c), makaleler ve KVKK (content/e tipografisi) ---------- */
function postKart(article, hTag, kok) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const dosya = href.replace(/^.*\//, '');
  const oz = OZETLER[dosya];
  return blogKarti({ href, hTag, kok, yazar: YAZAR[dosya], cat: oz.cat, title: oz.title, ex: oz.ex, time: oz.time, read: oz.read });
}
function kartlar(ic, hTag, kok) {
  const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
  return arts.map((a) => postKart(a, hTag, kok)).join('\n');
}
const KIRINTI = (ol) => ol.replace(/<ol class="crumbs">/, '<ol class="crumbs flex flex-wrap gap-x-2 text-sm">')
  .replace(/<a href/g, `<a class="${K('content/e:a:0|ton|-inline-flex|-items-center|-ml-4')} hover:underline" href`);

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const kok = blogda ? '../' : '';
  const yer = blogda
    ? { r: '../', h: '../index.html', blog: './', brand: '../index.html', top: '#main', blogcur: rel === 'blog/index.html' ? ' aria-current="true"' : '' }
    : { r: '', h: 'index.html', blog: 'blog/', brand: 'index.html', top: '#main' };
  let body = src.slice(src.indexOf('<body'));
  const sonekBas = body.indexOf('  <!-- ================= Floating actions + chat');
  const sonek = sonekBas > 0 ? body.slice(sonekBas, body.indexOf('</body>')).trimEnd() : (() => {
    const j = body.indexOf('<aside class="floating-actions"');
    return body.slice(j, body.indexOf('</body>')).trimEnd();
  })();
  const crumbs = body.match(/<nav data-i18n-attr="aria-label:crumbs\.aria"[^>]*>\s*<ol class="crumbs">[\s\S]*?<\/ol>\s*<\/nav>/)[0];
  let main;

  if (rel === 'blog/index.html') {
    const h1 = body.match(/<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>/);
    const lede = body.match(/<p class="lede"([^>]*)>([\s\S]*?)<\/p>/);
    const ic = oge(body, '<div class="posts-grid">', 'div');
    main = `  <main id="main">
    <section class="page-top ${K('blog/c:section:0')}" aria-labelledby="blog-title">
      <div class="${K('blog/c:div:0')}">
        <div class="${K('contact/c:div:1|~mb-12>mb-20')}">
          ${KIRINTI(crumbs).replace('<nav ', '<nav class="flex justify-center mb-4" ')}
          <h1 id="blog-title" class="${K('contact/c:h1:0')}"${h1[1]}>${h1[2]}</h1>
          <p class="${K('contact/c:p:0')}"${lede[1]}>${lede[2]}</p>
        </div>
        <div class="${K('blog/c:div:1')}">
${kartlar(ic, 'h2', kok)}
        </div>
      </div>
    </section>
  </main>`;
  } else {
    // Makale / KVKK: content/e düzeni — sol md:w-2/5 başlık + meta + içindekiler, sağ md:w-3/5 metin
    const art = oge(body, '<article class="panel page-top"', 'article');
    const labelled = art.match(/aria-labelledby="([^"]+)"/)[1];
    const headEl = oge(art, '<header class="article-head">', 'header');
    const meta = headEl.match(/<p class="post-meta">([\s\S]*?)<\/p>/);
    const label = headEl.match(/<p class="label">([\s\S]*?)<\/p>/);
    const h1 = headEl.match(/<h1 id="([^"]+)">([\s\S]*?)<\/h1>/);
    const lede = headEl.match(/<p class="lede">([\s\S]*?)<\/p>/);
    const byline = headEl.match(/<div class="byline">\s*<img src="([^"]+)"[^>]*>\s*<div><b>([\s\S]*?)<\/b><span>([\s\S]*?)<\/span><\/div>\s*<\/div>/);
    const cover = art.match(/<figure class="article-cover">\s*(<img [^>]*>)\s*<\/figure>/);
    const toc = oge(art, '<aside class="toc"', 'aside');
    const layout = oge(art, '<div class="article-layout">', 'div');
    let yazi = layout.slice(layout.indexOf('</aside>') + 8).replace(/^\s*<div>/, '').replace(/<\/div>\s*<\/div>\s*$/, '');
    // Makaledeki CTA: content/e satırı (düğme + bağlantı)
    yazi = yazi.replace(/<aside class="article-cta">\s*<h2 class="h3"([^>]*)>([\s\S]*?)<\/h2>\s*<p([^>]*)>([\s\S]*?)<\/p>\s*<a class="btn btn--primary" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/aside>/,
      `<aside class="article-cta ${K('cta/b:div:2|-lg:w-2/6|-md:w-1/2|-md:ml-auto|-mt-10|-md:mt-0|+mt-12')}">
              <h2 class="${K('cta/b:h2:0|~mb-5>mb-2')}"$1>$2</h2>
              <p class="${K('content/e:p:0')}"$3>$4</p>
              <div class="${K('content/e:div:2')}"><a class="${K('content/e:button:0|ton')}" href="$5"$6>$7</a></div>
            </aside>`);
    if (rel === 'kvkk.html') {
      // Bu şablonda Google Fonts yüklenmiyor; metindeki yazı tipi cümlesi kaldırıldı (DURUM.md)
      yazi = yazi.replace(/ Yazı tipleri Google Fonts üzerinden yüklendiği için tarayıcınızın IP adresi Google’a iletilir\./, '')
        .replace(/ Because fonts are loaded from Google Fonts, your browser’s IP address is shared with Google\./, '');
      if (/Google Fonts/.test(yazi)) throw new Error('KVKK Google Fonts cümlesi kalmadı mı?');
    }
    const metaHtml = meta
      ? `<p class="post-meta flex flex-wrap items-center gap-3 mb-4"><span class="${K('blog/c:span:0|+uppercase')}">${meta[1].match(/<span class="cat">([\s\S]*?<\/span>)<\/span>/)[1]}</span><span class="${K('blog/c:span:1|ton|-ml-auto|-mr-3')}">${meta[1].match(/<time[\s\S]*?<\/time>/)[0]}</span><span class="${K('blog/c:span:2|ton')}">${meta[1].match(/<\/time><span>([\s\S]*?)<\/span>$/)[1]}</span></p>`
      : `<p class="mb-4"><span class="${K('blog/c:span:0|+uppercase')}">${label[1]}</span></p>`;
    const bylineHtml = byline ? `
            <div class="${K('blog/c:a:1|+mt-6')}">
              <img class="${K('blog/c:img:0')}" src="${byline[1]}" width="560" height="700" alt="">
              <span class="${K('blog/c:span:3')}"><span class="${K('blog/c:span:4')}">${byline[2]}</span><span class="${K('blog/c:span:5|ton|+uppercase')}">${byline[3]}</span></span>
            </div>` : '';
    const tocHtml = toc.replace(/<aside class="toc"/, `<nav class="toc mt-10 hidden md:block"`).replace(/<\/aside>$/, '</nav>')
      .replace(/<p class="label"([^>]*)>([\s\S]*?)<\/p>/, `<p class="${K('footer/a:h2:0|+uppercase')}"$1>$2</p>`)
      .replace(/<ol /g, '<ol class="space-y-2 text-sm" ').replace(/<a href/g, `<a class="${K('footer/a:a:1')}" href`);
    main = `  <main id="main">
    <article class="page-top ${K('content/e:section:0')}" aria-labelledby="${labelled}">
      <div class="${K('content/e:div:0')}">
        <div class="w-full mb-10">${KIRINTI(crumbs)}</div>
        <div class="md:w-2/5 w-full md:pr-6">
          <div class="md:sticky md:top-8">
            ${metaHtml}
            <h1 id="${h1[1]}" class="${K('content/e:h2:0|-md:w-2/5|+mb-4')}">${h1[2]}</h1>
            <p class="${K('content/e:p:0')}">${lede[1]}</p>${bylineHtml}
            ${tocHtml}
          </div>
        </div>
        <div class="${K('content/e:div:1|+w-full|+mt-10|+md:mt-0')}">
${cover ? `          <figure class="mb-10 rounded-lg overflow-hidden">${cover[1].replace('<img ', `<img class="${K('feature/c:img:0')}" `)}</figure>\n` : ''}          ${yazi.trim()}
        </div>
      </div>
    </article>`;
    // İlgili yazılar: blog/c
    const rel2 = body.match(/<section class="panel panel--alt related"[\s\S]*?<\/section>/);
    if (rel2) {
      const baslik = rel2[0].match(/<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>/);
      const tum = rel2[0].match(/<a class="link-arrow" href="([^"]+)"( data-i18n="article\.back")>([\s\S]*?)<\/a>/);
      const ic = oge(rel2[0], '<div class="posts-grid">', 'div');
      main += `

    <section class="related ${K('blog/c:section:0')}" aria-labelledby="related-title">
      <div class="${K('blog/c:div:0')}">
        <div class="${K('contact/c:div:1|~mb-12>mb-20')}">
          <h2 id="related-title" class="${K('contact/c:h1:0')}"${baslik[1]}>${baslik[2]}</h2>
        </div>
        <div class="${K('blog/c:div:1')}">
${kartlar(ic, 'h3', kok)}
        </div>
        <div class="flex justify-center mt-16"><a class="${K('hero/a:button:0|ton')}" href="${tum[1]}"${tum[2]}>${tum[3]}</a></div>
      </div>
    </section>`;
    }
    main += '\n  </main>';
  }
  let govde = `<body class="bg-white text-gray-600 dark:bg-gray-900 dark:text-gray-400">\n${parca('header')}\n${main}\n\n${parca('footer')}\n\n${reveal(sonek)}\n</body>\n</html>\n`;
  govde = govde.replace(/\{\{ikon:wa\}\}/g, IKON.wa);
  const html = head(src, false) + tokenlar(govde, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
const kullanim = {};
for (const [b, s] of Object.entries(KULLANIM)) kullanim[b] = [...s];
fs.writeFileSync(path.join(__dirname, 'bloklar/kullanim.json'), JSON.stringify(kullanim));
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
