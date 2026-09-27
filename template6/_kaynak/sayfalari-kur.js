// template6 sayfa kurucusu (Tailwind Toolbox "Landing Page"). Tekrar çalıştırılabilir:
//   node sayfalari-kur.js && npx tailwindcss -c tailwind.config.js -i tw.css -o ../assets/css/tw.css --minify
// Girdiler:
//   _kaynak/sayfa/*.html                         — kaynağın sınıflarıyla yazılmış sayfa şablonları
//   _kaynak/indirilen/Landing-Page/index.html    — dalga SVG'leri ve unDraw çizimleri buradan BİREBİR kesilir
//   diyetisyen-animasyon-v2/*.html (salt okunur) — head, içerik ve JS'e bağlı bloklar (araçlar, randevu, program,
//                                                  tarifler, SSS, iletişim, pencereler, sohbet) buradan alınır
// Çıktılar: template6/index.html, template6/blog/*.html, template6/kvkk.html
'use strict';
const fs = require('fs');
const path = require('path');

const N = 6;
const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const KAYNAK = fs.readFileSync(path.join(__dirname, 'indirilen/Landing-Page/index.html'), 'utf8').replace(/\r\n/g, '\n'); // depo CRLF
// Kaynak <head>: <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700" rel="stylesheet" />
const FONT = 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,700&amp;display=swap';

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, `50-website/template${N}`).replace(/diyetisyen-animasyon-v2/g, `template${N}`);
const reveal = (s) => s.replace(/ data-reveal(="[^"]*")?/g, '');

/* ---------- Kaynağın sınıf dizileri (index.html'den birebir; yalnızca dark: ve odak halkası eklendi) ---------- */
const FOCUS = 'focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-300';
const HOVER = 'transform transition hover:scale-105 duration-300 ease-in-out';
const C = {
  // <section class="bg-white border-b py-8"> (+ koyu karşılık)
  sec: 'bg-white border-b py-8 text-gray-800 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100',
  // <h2 class="w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800">
  h2: 'w-full my-2 text-5xl font-bold leading-tight text-center text-gray-800 dark:text-gray-100',
  // Bölüm açıklaması (kaynakta bölüm açıklaması yok; kaynağın paragraf tokenı "text-gray-600 mb-8")
  lede: 'max-w-3xl mx-auto px-6 text-center text-gray-600 mb-8 dark:text-gray-300',
  // "Title" satırı: <h3 class="text-3xl text-gray-800 font-bold leading-none mb-3"> / <p class="text-gray-600 mb-8">
  h3row: 'text-3xl text-gray-800 font-bold leading-none mb-3 dark:text-gray-100',
  prow: 'text-gray-600 mb-8 dark:text-gray-300',
  // Kart sütunu ve parçaları ("xGETTING STARTED" kartları)
  col: 'w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink',
  top: 'flex-1 bg-white rounded-t rounded-b-none overflow-hidden shadow dark:bg-gray-800',
  bot: 'flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6 dark:bg-gray-800',
  kLabel: 'w-full text-gray-600 text-xs md:text-sm px-6 uppercase dark:text-gray-300',
  kTitle: 'w-full font-bold text-xl text-gray-800 px-6 dark:text-gray-100',
  kText: 'text-gray-800 text-base px-6 mb-5 dark:text-gray-100',
  // Düğmeler: gradyan (kart/fiyat) ve beyaz (hero/CTA); <button> yerine <a> olduğu için inline-block
  btnG: `inline-block mx-auto lg:mx-0 hover:underline gradient text-white font-bold rounded-full my-6 py-4 px-8 shadow-lg ${FOCUS} ${HOVER}`,
  btnW: `inline-block mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg ${FOCUS} ${HOVER}`,
  // Hero'nun ikinci düğmesi: kaynağın #navAction ilk hâli ("bg-white text-gray-800 … shadow opacity-75")
  btnW2: `inline-block mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow opacity-75 ${FOCUS} ${HOVER}`,
};
const BAR = '        <div class="w-full mb-4">\n          <div class="h-1 mx-auto gradient w-64 opacity-25 my-0 py-0 rounded-t"></div>\n        </div>';
const JUSTIFY = ['justify-start', 'justify-center', 'justify-end']; // kaynaktaki üç kartın düğme hizası

/* ---------- Kaynaktan birebir kesilen SVG'ler ---------- */
function kes(bas, son) {
  const i = KAYNAK.indexOf(bas);
  if (i < 0) throw new Error('kaynakta yok: ' + bas);
  const j = KAYNAK.indexOf(son, i);
  return KAYNAK.slice(i, j + son.length);
}
const dekor = (svg) => svg.replace(/^<svg /, '<svg aria-hidden="true" focusable="false" ').replace(/\s*<title>[^<]*<\/title>/, '');
// Hero altındaki dalga: dolu (#FFFFFF) katman bir sonraki bölümün zemini → koyu temada gray-900 (.wave-fill-white)
const DALGA_HERO = kes('<div class="relative -mt-12 lg:-mt-24">', '</svg>\n    </div>')
  .replace('<div class="relative -mt-12 lg:-mt-24">', '<div class="relative -mt-12 lg:-mt-24" aria-hidden="true">')
  .replace('<svg viewBox="0 0 1428 174"', '<svg focusable="false" viewBox="0 0 1428 174"')
  .replace('<g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF"', '<g class="wave-fill-white" transform="translate(-4.000000, 76.000000)" fill="#FFFFFF"');
// CTA üstündeki dalga: "wave" katmanı önceki bölümün rengi (#f8fafc) → koyu temada gray-800 (.wave-fill-prev)
const DALGA_CTA = kes('<svg class="wave-top"', '</svg>')
  .replace('<svg class="wave-top"', '<svg class="wave-top" aria-hidden="true" focusable="false"')
  .replace('<g class="wave" fill="#f8fafc">', '<g class="wave wave-fill-prev" fill="#f8fafc">');
const UNDRAW = {
  1: dekor(kes('<svg class="w-full sm:h-64 mx-auto" viewBox="0 0 1177 598.5"', '</svg>')),
  2: dekor(kes('<svg class="w-5/6 sm:h-64 mx-auto" viewBox="0 0 1176.60617 873.97852"', '</svg>')),
};
if (!/fill="#FFFFFF"/.test(DALGA_HERO) || !/wave-fill-prev/.test(DALGA_CTA)) throw new Error('dalga kesilemedi');

/* ---------- Logo: kaynaktaki "h-8 fill-current inline" SVG yuvasına Mizan işareti ("m" oyuk, rengi currentColor) ---------- */
const LOGO = (id) => `<svg class="h-8 fill-current inline align-[-0.3em] me-1" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><mask id="logo-m-${id}"><rect width="64" height="64" fill="#fff"/><text x="32" y="44" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="40" fill="#000">m</text></mask><rect width="64" height="64" rx="16" mask="url(#logo-m-${id})"/></svg>`;

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
function head(src, anaSayfa, kok) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace(/<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '<link rel="preload" as="image" href="assets/img/hero-gezegen-son.jpg" fetchpriority="high">');
  h = h.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"/, `href="${FONT}"`);
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  // Kaynağın index.html sonundaki iki küçük betiği (kaydırınca beyazlaşan menü + açılır menü) → ayrı dosya (CSP: satır içi betik yok)
  h = h.replace(/(\n(\s*)<script src="((?:\.\.?\/)?)assets\/js\/site\.js" defer><\/script>)/, '$1\n$2<script src="$3assets/js/toolbox-nav.js" defer></script>');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#d53369">');
  if (anaSayfa) {
    const t = `Diyetisyen web sitesi · Template ${N} (Tailwind Toolbox Landing Page)`;
    const d = 'Tailwind Toolbox’ın pembe-altın gradyanlı, dalga ayraçlı landing tasarımıyla kurulmuş diyetisyen sitesi. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/gsap|lenis|motion\.js|premium\.css|site\.css|hero-gezegen-ilk/i.test(h)) throw new Error('head temizlenmedi');
  if (!/toolbox-nav\.js/.test(h)) throw new Error('toolbox-nav.js eklenmedi');
  return h;
}

function tokenlar(html, yer) {
  html = html.replace(/\{\{c:(\w+)\}\}/g, (m, k) => { if (!(k in C)) throw new Error('sınıf tokenı yok: ' + k); return C[k]; });
  html = html.replace(/\{\{bar\}\}/g, BAR);
  html = html.replace(/\{\{logo:(\w)\}\}/g, (m, id) => LOGO(id));
  html = html.replace(/\{\{wave:hero\}\}/g, '    ' + DALGA_HERO).replace(/\{\{wave:cta\}\}/g, '    ' + DALGA_CTA);
  html = html.replace(/\{\{undraw:(\d)\}\}/g, (m, n) => '            ' + UNDRAW[n]);
  html = html.replace(/\{\{h\}\}/g, yer.h).replace(/\{\{r\}\}/g, yer.r).replace(/\{\{blog\}\}/g, yer.blog)
    .replace(/\{\{brand\}\}/g, yer.brand).replace(/\{\{top\}\}/g, yer.top).replace(/\{\{blogcur\}\}/g, yer.blogcur || '');
  html = html.replace(/\{\{asteria\}\}/g, ASTERIA);
  const kalan = html.match(/\{\{[^}]+\}\}/);
  if (kalan) throw new Error('doldurulmamış yer tutucu: ' + kalan[0]);
  return html;
}

/* ---------- Özgün içerik ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));
const ASTERIA = oge(ozgunIndex, '<a class="footer-credit"', 'a').replace('class="footer-credit"', 'class="footer-credit inline-flex items-center gap-2 text-gray-600 hover:text-pink-500 dark:text-gray-300"');
const SKY_IKON = (() => {
  const sky = oge(ozgunIndex, '<section class="panel sky"', 'section');
  const s = sky.match(/<svg[\s\S]*?<\/svg>/g);
  const cls = (x) => x.replace(/^<svg /, '<svg class="w-5 h-5 shrink-0" ');
  return { wa: cls(s[0]), tel: cls(s[1]), map: cls(s[2]) };
})();

// S4: 6 hizmet kartı — kaynağın "xGETTING STARTED" kartı; küçük etiket = hizmet alanı (etiketler)
function hizmetler() {
  const re = /<article class="service[^"]*"[^>]*>\s*<a href="#randevu" (data-book-[a-z]+="[^"]+")>([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2], j = JUSTIFY[out.length % 3];
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const p = ic.match(/<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const tags = [...ic.matchAll(/<li( data-i18n="[^"]+")?>([^<]*)<\/li>/g)].map((t) => `<span${t[1] || ''}>${t[2]}</span>`).join(' · ');
    const foot = ic.match(/<span class="mono" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const book = ic.match(/<span class="link-arrow" data-i18n="([^"]+)">([^<]*)<\/span>/);
    out.push(`        <article class="${C.col}">
          <div class="${C.top}">
            <div class="flex flex-wrap no-underline hover:no-underline">
              <p class="${C.kLabel}">${tags}</p>
              <h3 class="${C.kTitle}" data-i18n="${h3[1]}">${h3[2]}</h3>
              <p class="${C.kText}" data-i18n="${p[1]}">${p[2]}</p>
            </div>
          </div>
          <div class="${C.bot}">
            <p class="text-gray-600 text-xs md:text-sm dark:text-gray-300" data-i18n="${foot[1]}">${foot[2]}</p>
            <div class="flex items-center ${j}">
              <a href="#randevu" ${m[1]} class="${C.btnG}" data-i18n="${book[1]}">${book[2]}</a>
            </div>
          </div>
        </article>`);
  }
  if (out.length !== 6) throw new Error('hizmet sayısı ' + out.length);
  return out.join('\n');
}

// S8: 3 uzman kartı — aynı kart; üstte fotoğraf
function uzmanlar() {
  const re = /<article class="person"[^>]*>([\s\S]*?)<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[1], j = JUSTIFY[out.length % 3];
    const img = ic.match(/<img ([^>]*)>/)[1].replace(/ width="\d+" height="\d+"/, ' width="900" height="1125"');
    const badge = ic.match(/<span class="person-badge" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const area = ic.match(/<p class="label" data-i18n="([^"]+)">([^<]*)<\/p>/);
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const bio = ic.match(/<\/h3>\s*<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const dl = ic.match(/<dl class="person-facts">([\s\S]*?)<\/dl>/)[1]
      .replace(/<div><dt /g, '<div class="flex gap-3 border-b border-gray-200 py-2 last:border-b-0 dark:border-gray-700"><dt class="w-16 shrink-0 text-gray-600 text-xs md:text-sm uppercase pt-0.5 dark:text-gray-300" ')
      .replace(/<dd /g, '<dd class="text-gray-800 dark:text-gray-100" ');
    const btn = ic.match(/<a class="btn[^"]*" href="#randevu" (data-book-staff="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/);
    out.push(`        <article class="${C.col}">
          <div class="${C.top}">
            <img class="w-full h-72 object-cover object-top mb-6" ${img}>
            <div class="flex flex-wrap">
              <p class="${C.kLabel}"><span data-i18n="${area[1]}">${area[2]}</span>${badge ? ` · <span data-i18n="${badge[1]}">${badge[2]}</span>` : ''}</p>
              <h3 class="${C.kTitle}" data-i18n="${h3[1]}">${h3[2]}</h3>
              <p class="${C.kText}" data-i18n="${bio[1]}">${bio[2]}</p>
              <dl class="w-full px-6 mb-5 text-sm">${dl.trim().replace(/\s*\n\s*/g, '')}</dl>
            </div>
          </div>
          <div class="${C.bot}">
            <div class="flex items-center ${j}">
              <a href="#randevu" ${btn[1]} class="${C.btnG}" data-i18n="${btn[2]}">${btn[3]}</a>
            </div>
          </div>
        </article>`);
  }
  if (out.length !== 3) throw new Error('uzman sayısı ' + out.length);
  return out.join('\n');
}

// S5: 7 not kartı (data-note: site.js masaüstünde sürüklemeyi bağlar)
function notlar() {
  const re = /<figure class="note[^"]*" data-note[^>]*>\s*<img ([^>]*)>\s*<figcaption data-i18n="([^"]+)">([^<]*)<\/figcaption>\s*<\/figure>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) out.push(`          <figure class="note" data-note>\n            <img ${m[1]}>\n            <figcaption data-i18n="${m[2]}">${m[3]}</figcaption>\n          </figure>`);
  if (out.length !== 7) throw new Error('not sayısı ' + out.length);
  return out.join('\n');
}

// S12 altı: iki takip paketi — kaynağın yan fiyat kartı
function paketler() {
  const out = [];
  for (const n of [2, 3]) {
    const art = ozgunIndex.match(new RegExp(`<article class="plan[^"]*"[^>]*>\\s*<div class="plan-top"><p class="label" data-i18n="plan${n}.label">[\\s\\S]*?<\\/article>`))[0];
    const label = art.match(/data-i18n="(plan\d\.label)">([^<]*)</);
    const price = art.match(/<p class="price">([\s\S]*?)<\/p>/)[1].replace('<small', '<span class="text-base"').replace('</small>', '</span>').replace('<small>', '<span class="text-base">');
    const sub = art.match(/<p class="plan-sub" data-i18n="([^"]+)">([^<]*)<\/p>/);
    const feats = [...art.matchAll(/<span data-i18n="(plan\d\.f\d)">([^<]*)<\/span>/g)].map((f) => `                <li class="border-b py-4 dark:border-gray-700" data-i18n="${f[1]}">${f[2]}</li>`).join('\n');
    const btn = art.match(/<a class="btn btn--primary" href="#randevu" (data-book-type="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/);
    out.push(`          <article class="flex flex-col w-full md:w-1/3 bg-white rounded shadow dark:bg-gray-900">
            <div class="flex-1 bg-white text-gray-600 rounded-t rounded-b-none overflow-hidden shadow dark:bg-gray-900 dark:text-gray-300">
              <h4 class="px-8 pt-8 text-3xl font-bold text-center text-gray-800 dark:text-gray-100" data-i18n="${label[1]}">${label[2]}</h4>
              <p class="px-8 pb-6 text-center border-b-4 dark:border-gray-700" data-i18n="${sub[1]}">${sub[2]}</p>
              <ul class="w-full text-center text-sm">
${feats}
              </ul>
            </div>
            <div class="flex-none mt-auto bg-white rounded-b rounded-t-none overflow-hidden shadow p-6 dark:bg-gray-900">
              <p class="w-full pt-6 text-3xl text-gray-600 font-bold text-center dark:text-gray-300">${price.trim()}</p>
              <div class="flex items-center justify-center">
                <a href="#randevu" ${btn[1]} class="${C.btnG}" data-i18n="${btn[2]}">${btn[3]}</a>
              </div>
            </div>
          </article>`);
  }
  return out.join('\n');
}

// S14: 6 yazı kartı. Özet ve tarih blog/index.html'deki iki dilli bloklardan.
const OZETLER = {};
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">[\s\S]*?(<time[\s\S]*?<\/time>)[\s\S]*?<\/h2>\s*<p>([\s\S]*?)<\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { time: m[2], ex: m[3] };
})();
function yaziKarti({ href, img, meta, title, hTag, ex, read, i }) {
  return `        <article class="${C.col}">
          <div class="${C.top}">
            <a href="${href}" class="flex flex-wrap no-underline hover:no-underline ${FOCUS}">
              ${img.replace(/^<img /, '<img class="w-full aspect-[16/10] object-cover mb-4" ')}
              <p class="post-meta w-full px-6">${meta}</p>
              <${hTag} class="${C.kTitle} hover:underline">${title}</${hTag}>
              <p class="${C.kText}">${ex}</p>
            </a>
          </div>
          <div class="${C.bot}">
            <div class="flex items-center ${JUSTIFY[i % 3]}">
              <a href="${href}" class="${C.btnG}" tabindex="-1" aria-hidden="true">${read}</a>
            </div>
          </div>
        </article>`;
}
function blogKartlari() {
  const re = /<article class="post-(?:feature|row)"[^>]*>\s*<a href="([^"]+)">([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2], dosya = m[1].replace(/^blog\//, ''), oz = OZETLER[dosya];
    const img = ic.match(/<img [^>]*>/)[0].replace(/ srcset="[^"]*"| sizes="[^"]*"/g, '').replace(/ width="\d+" height="\d+"/, ' width="900" height="563"').replace(/-1800\.webp/, '-900.webp');
    const cat = ic.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const read = ic.match(/<span data-i18n="(post\d\.read)">([^<]*)<\/span>/);
    const title = ic.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    out.push(yaziKarti({
      href: m[1], img, hTag: 'h3', i: out.length,
      meta: `<span data-i18n="${cat[1]}">${cat[2]}</span>${oz.time}<span data-i18n="${read[1]}">${read[2]}</span>`,
      title: `<span data-i18n="${title[1]}">${title[2]}</span>`,
      ex: oz.ex, read: '<span data-i18n="blog.readMore">Devamını oku</span>',
    }));
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

/* ---------- JS'e bağlı bloklar: özgün işaretleme korunur, sınıflar tw.css'te kaynağın tokenlarıyla ---------- */
function bloklar() {
  const araclar = oge(ozgunIndex, '<div class="tools-head">', 'div').replace(/<div class="tools-head">\s*([\s\S]*)\s*<\/div>$/, '$1')
    + '\n' + ['<div class="tool" role="tabpanel" id="tool-bmi"', '<div class="tool" role="tabpanel" id="tool-kcal"', '<div class="tool" role="tabpanel" id="tool-water"'].map((a) => oge(ozgunIndex, a, 'div')).join('\n');
  const program = oge(ozgunIndex, '<div class="program-top">', 'div') + '\n' + oge(ozgunIndex, '<div class="program" id="program-print">', 'div')
    + '\n' + ozgunIndex.match(/<p class="disclaimer"[^>]*>[\s\S]*?<\/p>/)[0];
  const tarifler = oge(ozgunIndex, '<div class="filter-row"', 'div') + '\n' + oge(ozgunIndex, '<div class="recipes" data-recipes>', 'div');
  const randevu = oge(ozgunIndex, '<div class="booking" data-booking>', 'div');
  const ucretek = oge(ozgunIndex, '<div class="strip"', 'div') + '\n' + oge(ozgunIndex, '<div class="incl">', 'div');
  const sss = '<div class="faq-grid">\n' + oge(ozgunIndex, '<div class="faq-help"', 'div') + '\n' + oge(ozgunIndex, '<div class="faq-list" data-faq-list>', 'div') + '\n</div>';
  const iletisim = oge(ozgunIndex, '<div class="contact-grid">', 'div');
  const i = ozgunIndex.indexOf('  <!-- ================= Recipe dialog');
  const sonek = ozgunIndex.slice(i, ozgunIndex.indexOf('</body>')).trimEnd();
  const R = (s) => reveal(s)
    .replace(/ class="tab" role="tab"/g, ' class="pill" role="tab"')
    .replace(/<p class="eyebrow-tag"[^>]*>[^<]*<\/p>\s*/g, '');
  return { araclar: R(araclar), program: R(program), tarifler: R(tarifler), randevu: R(randevu), ucretek: R(ucretek), sss: R(sss), iletisim: R(iletisim), sonek: R(sonek) };
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  const b = bloklar();
  const dol = { hizmetler: hizmetler(), uzmanlar: uzmanlar(), notlar: notlar(), paketler: paketler(), blogkartlari: blogKartlari(), ...b };
  govde = govde.replace(/\{\{(hizmetler|uzmanlar|notlar|paketler|blogkartlari|araclar|program|tarifler|randevu|ucretek|sss|iletisim|sonek)\}\}/g, (m, k) => dol[k]);
  govde = govde.replace(/\{\{ikon:(\w+)\}\}/g, (m, k) => SKY_IKON[k]);
  const yer = { h: '', r: '', blog: 'blog/', brand: '#top', top: '#top' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
}

/* ---------- Alt sayfalar: gradyan başlık bandı + kaynağın dalgası + beyaz içerik bölümü ---------- */
function postKart(article, hTag, i) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const img = article.match(/<img [^>]*>/)[0];
  const meta = article.match(/<p class="post-meta">([\s\S]*?)<\/p>/)[1].replace(/<span class="cat">([\s\S]*?<\/span>)<\/span>/, '<span>$1</span>');
  const title = article.match(/<h([23])>([\s\S]*?)<\/h\1>/)[2];
  const exM = article.match(/<\/h[23]>\s*<p>([\s\S]*?)<\/p>/);
  const ex = exM ? exM[1] : (OZETLER[href] || {}).ex || '';
  return yaziKarti({ href, img, meta, title, hTag, ex, i, read: '<span data-i18n="blog.readMore">Devamını oku</span>' });
}
function kartlar(html, hTag) {
  return html.replace(/<div class="posts-grid">([\s\S]*?)\n        <\/div>/, (m, ic) => {
    const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
    return arts.map((a, i) => postKart(a, hTag, i)).join('\n');
  });
}

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const yer = blogda
    ? { r: '../', h: '../index.html', blog: './', brand: '../index.html', top: '#main', blogcur: rel === 'blog/index.html' ? ' aria-current="true"' : '' }
    : { r: '', h: 'index.html', blog: 'blog/', brand: 'index.html', top: '#main' };
  let body = src.slice(src.indexOf('<body'));

  body = body.replace(/<body>/, '<body class="leading-normal tracking-normal text-white gradient">');
  body = body.replace(/<a class="skip-link"[\s\S]*?(?=\n  <main id="main">)/, parca('header').trim());
  body = body.replace(/\n    <footer class="panel site-footer">[\s\S]*?<\/footer>/, '');
  body = body.replace(/<\/main>/, '</main>\n\n' + parca('footer'));
  body = reveal(body);

  // Başlık bandı (kaynağın hero'su: pt-24, beyaz yazı) → dalga → beyaz bölüm
  body = body.replace(/<(article|section) class="panel page-top"([^>]*)>\s*<div class="wrap">/,
    '<$1 class="page-top"$2>\n      <div class="pt-24 pb-16 lg:pb-24"><div class="container px-3 mx-auto text-center">');
  const bantSonu = rel === 'blog/index.html' ? /(<\/header>)(\s*<div class="posts-grid">)/ : /(<\/header>)(\s*<(?:figure class="article-cover"|div class="article-layout"))/;
  if (!bantSonu.test(body)) throw new Error('bant sonu yok: ' + rel);
  body = body.replace(bantSonu, `$1\n      </div></div>\n{{wave:hero}}\n      <div class="${C.sec.replace('border-b ', '')}"><div class="container mx-auto ${rel === 'blog/index.html' ? 'flex flex-wrap ' : ''}px-2 pt-4 pb-12">$2`);
  body = body.replace(/\n      <\/div>\n    <\/(article|section)>/, '\n      </div></div>\n    </$1>');

  body = body.replace(/<ol class="crumbs">/, '<ol class="crumbs flex flex-wrap justify-center gap-x-2 text-sm uppercase tracking-loose">');
  body = body.replace(/<nav (data-i18n-attr="aria-label:crumbs\.aria")/, '<nav class="mb-6" $1');

  if (rel === 'blog/index.html') {
    body = body.replace(/<header class="sec-head sec-head--split">\s*<div class="sec-head">\s*<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>\s*<\/div>\s*<p class="lede"([^>]*)>([\s\S]*?)<\/p>\s*<\/header>/,
      '<header>\n          <h1 id="blog-title" class="my-4 text-5xl font-bold leading-tight"$1>$2</h1>\n          <p class="leading-normal text-2xl mb-8 max-w-3xl mx-auto"$3>$4</p>\n        </header>');
    body = kartlar(body, 'h2');
  } else {
    body = body.replace(/<a class="btn btn--primary" href="([^"]+)" data-i18n="article\.ctaBtn">/, `<a class="${C.btnW}" href="$1" data-i18n="article.ctaBtn">`);
    // İlgili yazılar: bölüm kalıbı + kaynak kartları
    body = body.replace(/<section class="panel panel--alt related"([^>]*)>\s*<div class="wrap">\s*<header class="sec-head sec-head--split">\s*<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>\s*<a class="link-arrow" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/header>/,
      `<section class="related ${C.sec}"$1>\n      <div class="container mx-auto flex flex-wrap pt-4 pb-12">\n        <h2 id="related-title" class="${C.h2}"$2>$3</h2>\n{{bar}}\n        <div class="posts-grid">`
        .replace('{{bar}}', BAR) + '\n      <!--ilgili-->');
    body = body.replace(/(<!--ilgili-->)([\s\S]*?<div class="posts-grid">[\s\S]*?\n        <\/div>)/, (m, isaret, rest) => rest.replace(/^\s*\n/, '\n'));
    body = kartlar(body, 'h3');
    const tum = src.match(/<a class="link-arrow" href="([^"]+)"( data-i18n="article\.back")>([\s\S]*?)<\/a>/);
    if (tum) body = body.replace(/(<section class="related[\s\S]*?)(\n      <\/div>\n    <\/section>)/, `$1\n        <div class="w-full text-center"><a class="${C.btnG}" href="${tum[1]}"${tum[2]}>${tum[3]}</a></div>$2`);
  }
  if (/class="(panel|sec-head|h2|wrap)"/.test(body)) console.warn('  uyarı: eski sınıf kaldı →', rel, (body.match(/class="(panel[^"]*|sec-head[^"]*|h2|wrap)"/) || [])[0]);
  const html = head(src, false) + tokenlar(body, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
