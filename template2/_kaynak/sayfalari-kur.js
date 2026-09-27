// template2 sayfa kurucusu (HyperUI). Tekrar çalıştırılabilir:
//   node sayfalari-kur.js
// Girdiler: _kaynak/sayfa/*.html (HyperUI işaretlemesiyle yazılmış şablonlar) ve
// diyetisyen-animasyon-v2 içindeki özgün sayfalar (yalnızca okunur; head, SSS, blog ve makale içerikleri buradan alınır).
// Çıktılar: template2/index.html, template2/blog/*.html, template2/kvkk.html
'use strict';
const fs = require('fs');
const path = require('path');

const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const HUI = path.join(__dirname, 'indirilen/hyperui/public/examples');
const HERO = path.join(__dirname, 'node_modules/heroicons/24/outline');
const FONT = 'https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&amp;display=swap';

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));

/* ---------- HyperUI sınıf dizileri (her biri adı geçen dosyadan birebir) ---------- */
const C = {
  wrap: 'mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8', // feature-grids/1, team-sections/2, contact-forms/5
  h2: 'text-3xl/tight font-bold text-gray-900 sm:text-4xl dark:text-white', // feature-grids/1
  lede: 'mt-4 text-lg text-pretty text-gray-700 dark:text-gray-200', // feature-grids/1
  label: 'text-sm font-medium text-gray-700 dark:text-gray-200', // application/inputs/1
  input: 'mt-0.5 w-full rounded border-gray-300 shadow-sm sm:text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-white', // application/inputs/1
  invalid: 'aria-invalid:border-red-500', // application/toasts/2 (Error) kenar rengi
  range: 'mt-3 h-3.5 w-full appearance-none rounded-full bg-gray-300 [&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[6px] [&::-webkit-slider-thumb]:border-gray-500 [&::-webkit-slider-thumb]:bg-gray-200 dark:bg-gray-700', // application/range-inputs/1
  radioCard: 'flex items-center justify-between gap-4 rounded border border-gray-300 bg-white p-3 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 has-checked:border-blue-600 has-checked:ring-1 has-checked:ring-blue-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-blue-600 dark:border-gray-600 dark:bg-gray-900 dark:hover:bg-gray-800', // application/radio-groups/1 ve 2
  radioInput: 'size-5 shrink-0 border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600', // application/radio-groups/2
  radioDisabled: 'has-disabled:cursor-not-allowed has-disabled:opacity-50',
  check: 'mt-0.5 size-4 shrink-0 rounded border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-900 dark:ring-offset-gray-900 dark:checked:bg-blue-600', // radio-groups/2 input tokenları
  statCard: 'rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900', // application/stats/4
  statIcon: 'rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  statValue: 'text-2xl font-medium text-gray-900 dark:text-white',
  statLabel: 'text-sm text-gray-500 dark:text-gray-400',
  tab: 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-700 aria-selected:border-blue-600 aria-selected:text-blue-600 aria-selected:hover:text-blue-700 dark:text-gray-300 dark:hover:text-gray-200 dark:aria-selected:text-blue-400 dark:aria-selected:hover:text-blue-300', // application/tabs/4
  pill: 'rounded-full bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600', // application/tabs/5 (seçili değil)
  pillChecked: 'aria-checked:bg-blue-600 aria-checked:text-white aria-checked:hover:bg-blue-700 dark:aria-checked:bg-blue-600 dark:aria-checked:text-white dark:aria-checked:hover:bg-blue-700', // application/tabs/5 (seçili)
  btnGroup: 'border border-gray-200 px-3 py-2 font-medium whitespace-nowrap text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:z-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:pointer-events-auto disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-offset-gray-900', // application/button-groups/1
  btnGroupOn: 'aria-pressed:bg-gray-100 aria-pressed:text-gray-900 dark:aria-pressed:bg-gray-800 dark:aria-pressed:text-white',
  cta: 'group inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400', // marketing/blog-cards/3
  cfLabel: 'block text-sm font-medium text-gray-900 dark:text-white', // marketing/contact-forms/5
  cfInput: 'mt-1 w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white', // marketing/contact-forms/5
  modal: 'm-auto w-[calc(100%-2rem)] max-w-xl rounded-lg bg-white p-0 shadow-lg backdrop:bg-black/50 dark:bg-gray-900 dark:backdrop:bg-white/50', // application/modals/2
  modalClose: '-me-4 -mt-4 shrink-0 rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 dark:focus:ring-indigo-300 dark:focus:ring-offset-gray-900 dark:focus-visible:ring-indigo-300 dark:focus-visible:ring-offset-gray-900', // application/modals/2
  hoursRow: 'text-gray-700 [&.is-today]:font-semibold [&.is-today]:text-gray-900 dark:text-gray-200 dark:[&.is-today]:text-white',
  hoursTh: 'py-2 text-start [font-weight:inherit]',
  blogCard: 'overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900 dark:shadow-gray-700/25', // marketing/blog-cards/3
  blogTitle: 'text-lg font-medium text-gray-900 dark:text-white',
  blogExcerpt: 'mt-2 line-clamp-3 text-sm/relaxed text-gray-500 dark:text-gray-400',
};
const ARROW = '<span aria-hidden="true" class="block transition-all group-hover:ms-0.5 rtl:rotate-180">&rarr;</span>';

/* ---------- Simgeler ---------- */
const svgNorm = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
function setClass(svg, cls) {
  svg = svg.replace(/^<svg([^>]*?)\sclass="[^"]*"/, '<svg$1');
  svg = svg.replace(/^<svg/, `<svg class="${cls}"`);
  if (!/aria-hidden=/.test(svg.slice(0, svg.indexOf('>')))) svg = svg.replace(/^<svg/, '<svg aria-hidden="true"');
  return svg;
}
function heroicon(ad, cls, sw) {
  const f = path.join(HERO, `${ad}.svg`);
  if (!fs.existsSync(f)) throw new Error('heroicon yok: ' + ad);
  let s = svgNorm(oku(f)).replace(/\sdata-slot="icon"/, '');
  if (sw) s = s.replace(/stroke-width="[^"]*"/, `stroke-width="${sw}"`);
  return setClass(s, cls);
}
const huiCache = {};
function huiIcon(spec, cls) {
  const [dosya, sira] = spec.split(':');
  if (!huiCache[dosya]) {
    const html = oku(path.join(HUI, `${dosya}.html`));
    const body = html.slice(html.indexOf('<body'));
    huiCache[dosya] = body.match(/<svg[\s\S]*?<\/svg>/g) || [];
  }
  const s = huiCache[dosya][Number(sira) - 1];
  if (!s) throw new Error('HyperUI svg yok: ' + spec);
  return setClass(svgNorm(s), cls);
}
function simgeler(html) {
  return html.replace(/<svg data-icon="([^"]+)"([^>]*)><\/svg>/g, (m, spec, rest) => {
    const cls = (rest.match(/class="([^"]*)"/) || [])[1] || '';
    const sw = (rest.match(/data-sw="([^"]*)"/) || [])[1];
    return spec.startsWith('hui:') ? huiIcon(spec.slice(4), cls) : heroicon(spec, cls, sw);
  });
}
// WhatsApp simgesi özgün siteden (HyperUI'de yok)
const WA_PATH = (oku(path.join(OZGUN, 'index.html')).match(/<a class="fab fab-wa"[\s\S]*?<path d="([^"]+)"/) || [])[1];
const waIcon = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;
// Marka işareti: headers/2 logo yuvası (h-8, currentColor) — sahte logo yerine Mizan "m" işareti
const LOGO_MARK = '<svg class="h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><text x="16" y="23" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-style="italic" font-size="21" fill="#fff">m</text></svg>';
const LOGO_FULL = '<svg class="h-8" viewBox="0 0 118 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mizan Beslenme"><rect width="32" height="32" rx="8" fill="currentColor"/><text x="16" y="23" text-anchor="middle" font-family="Georgia, \'Times New Roman\', serif" font-style="italic" font-size="21" fill="#fff">m</text><text x="40" y="23" font-family="\'Google Sans Flex\', sans-serif" font-weight="700" font-size="21" fill="currentColor">mizan</text></svg>';

function tokenlar(html, yer) {
  html = html.replace(/\{\{c:(\w+)\}\}/g, (m, k) => { if (!(k in C)) throw new Error('sınıf tokenı yok: ' + k); return C[k]; });
  html = html.replace(/\{\{arrow\}\}/g, ARROW);
  html = html.replace(/\{\{check\}\}/g, huiIcon('marketing/pricing/1:1', 'size-5 shrink-0 text-indigo-700'));
  html = html.replace(/\{\{minus\}\}/g, heroicon('minus', 'size-5 shrink-0 text-gray-400'));
  html = html.replace(/\{\{wa-icon:([^}]+)\}\}/g, (m, cls) => waIcon(cls));
  html = html.replace(/\{\{logo-mark\}\}/g, LOGO_MARK).replace(/\{\{logo-full\}\}/g, LOGO_FULL);
  if (yer) html = html.replace(/\{\{r\}\}/g, yer.r).replace(/\{\{h\}\}/g, yer.h).replace(/\{\{blog\}\}/g, yer.blog);
  return simgeler(html);
}

/* ---------- 0.2 adres dönüşümü ---------- */
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, '50-website/template2').replace(/diyetisyen-animasyon-v2/g, 'template2');

/* ---------- <head>: sinematik katmanı kaldır, HyperUI stil dosyası ve fontu bağla ---------- */
function head(src, anaSayfa) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace('<html lang="tr" class="no-js"', '<html lang="tr" class="no-js font-sans antialiased"');
  h = h.replace(/\s*<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '');
  h = h.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"/, `href="${FONT}"`);
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#ffffff">');
  if (anaSayfa) {
    const t = 'Diyetisyen web sitesi · Template 2 (HyperUI)';
    const d = 'HyperUI’nin JS gerektirmeyen Tailwind bileşenleriyle kurulmuş, sade ve kurumsal bir diyetisyen sitesi. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/sinematik|gsap|lenis|motion\.js|premium\.css|site\.css/i.test(h)) throw new Error('head temizlenmedi');
  return h;
}

/* ---------- Ana sayfa: SSS ve blog kartları özgün içerikten ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));

function sssHtml() {
  const re = /<details class="faq"[^>]*>\s*<summary><h3 data-i18n="(faq\.q\d+)">([\s\S]*?)<\/h3>[\s\S]*?<p data-i18n="(faq\.a\d+)">([\s\S]*?)<\/p><\/div>\s*<\/details>/g;
  const out = [];
  let m, ilk = true;
  while ((m = re.exec(ozgunIndex))) {
    out.push(`              <details class="faq group py-4 [&_summary::-webkit-details-marker]:hidden"${ilk ? ' open' : ''}>
                <summary class="flex cursor-pointer items-center justify-between gap-1.5 text-gray-900 dark:text-white">
                  <h3 class="text-lg font-medium" data-i18n="${m[1]}">${m[2]}</h3>
                  <svg data-icon="hui:marketing/faqs/2:1" class="size-5 shrink-0 transition-transform duration-300 group-open:-rotate-180"></svg>
                </summary>
                <p class="faq-a pt-4 text-gray-900 dark:text-white" data-i18n="${m[3]}">${m[4]}</p>
              </details>`);
    ilk = false;
  }
  if (out.length !== 10) throw new Error('SSS sayısı ' + out.length);
  return out.join('\n');
}

const OZETLER = {}; // blog/index.html'deki özetler: href → {tr, en}
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">[\s\S]*?<p><span data-lang-block="tr">([\s\S]*?)<\/span><span data-lang-block="en">([\s\S]*?)<\/span><\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { tr: m[2], en: m[3] };
})();

function blogKartlari() {
  const re = /<article class="post-(?:feature|row)"[^>]*>\s*<a href="([^"]+)">([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m, n = 0;
  while ((m = re.exec(ozgunIndex))) {
    n++;
    const icerik = m[2];
    const img = icerik.match(/<img src="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="(alt:[^"]+)"/);
    const src = img[1].replace(/-1800\.webp/, '-900.webp');
    const cat = icerik.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const read = icerik.match(/<span data-i18n="(post\d\.read)">([^<]*)<\/span>/);
    const title = icerik.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const ex = icerik.match(/<p data-i18n="(post\d\.excerpt)">([^<]*)<\/p>/);
    const dosya = m[1].replace(/^blog\//, '');
    const ozet = ex ? { key: ex[1], tr: ex[2] } : { key: `post${n}.excerpt`, tr: OZETLER[dosya].tr };
    out.push(`          <article class="${C.blogCard}">
            <img src="${src}" width="900" height="563" loading="lazy" decoding="async" class="h-56 w-full object-cover" alt="${img[2]}" data-i18n-attr="${img[3]}">
            <div class="p-4 sm:p-6">
              <p class="post-meta"><span data-i18n="${cat[1]}">${cat[2]}</span><span data-i18n="${read[1]}">${read[2]}</span></p>
              <a href="${m[1]}">
                <h3 class="mt-0.5 ${C.blogTitle}" data-i18n="${title[1]}">${title[2]}</h3>
              </a>
              <p class="${C.blogExcerpt}" data-i18n="${ozet.key}">${ozet.tr}</p>
              <a href="${m[1]}" class="${C.cta} mt-4"><span data-i18n="blog.readMore">Devamını oku</span>${ARROW}</a>
            </div>
          </article>`);
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  govde = govde.replace('{{sss}}', sssHtml()).replace('{{blogkartlari}}', blogKartlari());
  const yer = { r: '', h: '', blog: 'blog/' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
  return html;
}

/* ---------- Alt sayfalar (blog/*.html, kvkk.html) ---------- */
function breadcrumbs(ol) {
  const lis = ol.match(/<li[\s\S]*?<\/li>/g);
  const sep = `<li class="rtl:rotate-180">${huiIcon('application/breadcrumbs/1:1', 'size-4')}</li>`;
  const items = lis.map((li) => li
    .replace(/<a href/, '<a class="block transition-colors hover:text-gray-900 dark:hover:text-white" href'));
  return `<ol class="flex flex-wrap items-center gap-1 text-sm text-gray-700 dark:text-gray-200">${items.join(sep)}</ol>`;
}
function postCard(article, hTag) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const img = article.match(/<img ([^>]*)>/)[1];
  const meta = article.match(/<p class="post-meta">([\s\S]*?)<\/p>/)[1];
  const title = article.match(/<h([23])>([\s\S]*?)<\/h\1>/)[2];
  const ex = article.match(/<\/h[23]>\s*<p>([\s\S]*?)<\/p>/)[1];
  return `<article class="${C.blogCard}">
            <img ${img} class="h-56 w-full object-cover">
            <div class="p-4 sm:p-6">
              <p class="post-meta">${meta.replace(/ class="cat"/, '')}</p>
              <a href="${href}">
                <${hTag} class="mt-0.5 ${C.blogTitle}">${title}</${hTag}>
              </a>
              <p class="${C.blogExcerpt}">${ex}</p>
              <a href="${href}" class="${C.cta} mt-4"><span data-i18n="blog.readMore">Devamını oku</span>${ARROW}</a>
            </div>
          </article>`;
}
function kartlar(html, hTag) {
  return html.replace(/<div class="posts-grid">([\s\S]*?)\n        <\/div>/, (m, ic) => {
    const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
    return '<div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">\n          ' + arts.map((a) => postCard(a, hTag)).join('\n          ') + '\n        </div>';
  });
}

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const yer = blogda ? { r: '../', h: '../index.html', blog: './' } : { r: '', h: 'index.html', blog: 'blog/' };
  let body = src.slice(src.indexOf('<body'));

  // Üst menü + mobil menü
  body = body.replace(/<a class="skip-link"[\s\S]*?(?=\n  <main id="main">)/, parca('header').trim());
  // Footer main'in dışına, sohbet ve bildirim kabuğu
  body = body.replace(/\n    <footer class="panel site-footer">[\s\S]*?<\/footer>/, '');
  body = body.replace(/<\/main>/, '</main>\n\n' + parca('footer'));
  body = body.replace(/<aside class="floating-actions"[\s\S]*?<\/aside>\s*(<div class="toast" id="toast"[^>]*><\/div>)?/, parca('sohbet').trim() + '\n');
  body = body.replace(/<body>/, '<body class="bg-white dark:bg-gray-900">');

  // İçerik: kaydırma animasyonu nitelikleri yok (HyperUI'de yok)
  body = body.replace(/ data-reveal(="[^"]*")?/g, '');
  body = body.replace(/<ol class="crumbs">([\s\S]*?)<\/ol>/, (m) => breadcrumbs(m));
  body = body.replace(/<(article|section) class="panel page-top"/, `<$1 class="${C.wrap}"`);
  body = body.replace(/ class="wrap"/g, '');

  if (rel === 'blog/index.html') {
    body = body.replace(/<header class="sec-head sec-head--split">\s*<div class="sec-head">\s*<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>\s*<\/div>\s*<p class="lede"([^>]*)>([\s\S]*?)<\/p>\s*<\/header>/,
      `<div class="mx-auto mt-8 max-w-lg text-center">\n          <h1 id="blog-title" class="${C.h2}"$1>$2</h1>\n          <p class="${C.lede}"$3>$4</p>\n        </div>`);
    body = kartlar(body, 'h2');
  } else {
    // İlgili yazılar bölümü
    body = body.replace(/<section class="panel panel--alt related"/, `<section class="related border-t border-gray-100 dark:border-gray-800"`);
    body = body.replace(/(<section class="related[^>]*>\s*)<div>/, `$1<div class="${C.wrap}">`);
    body = body.replace(/<header class="sec-head sec-head--split">\s*<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>\s*<a class="link-arrow" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/header>/,
      `<div class="flex flex-wrap items-end justify-between gap-4">\n          <h2 id="related-title" class="${C.h2}"$1>$2</h2>\n          <a class="${C.cta}" href="$3"><span$4>$5</span>${ARROW}</a>\n        </div>`);
    body = kartlar(body, 'h3');
    body = body.replace(/<h2 class="h3" data-i18n="article.ctaTitle">/, '<h2 data-i18n="article.ctaTitle">');
    body = body.replace(/<a class="btn btn--primary" href="([^"]+)" data-i18n="article.ctaBtn">/, '<a href="$1" data-i18n="article.ctaBtn">');
    // Tablolar yatay kaydırılabilsin (prose .table-wrap)
    body = body.replace(/(<table[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>');
  }
  if (/class="(panel|sec-head|h2|h3|btn btn--primary btn--sm header-cta)"/.test(body)) console.warn('  uyarı: eski sınıf kaldı →', rel, (body.match(/class="(panel[^"]*|sec-head[^"]*|h2|h3)"/) || [])[0]);
  const html = head(src, false) + tokenlar(body, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
console.log('blog özetleri (i18n EN için):', JSON.stringify(Object.fromEntries(Object.entries(OZETLER).map(([k, v]) => [k, v.en])), null, 1));
