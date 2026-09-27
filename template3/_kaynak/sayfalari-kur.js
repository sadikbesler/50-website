// template3 sayfa kurucusu (daisyUI 5). Tekrar çalıştırılabilir:
//   node sayfalari-kur.js
// Girdiler: _kaynak/sayfa/*.html (daisyUI bileşen işaretlemesiyle yazılmış şablonlar) ve
// diyetisyen-animasyon-v2 içindeki özgün sayfalar (yalnızca okunur; head, hizmetler, SSS, blog ve makale içerikleri buradan).
// Çıktılar: template3/index.html, template3/blog/*.html, template3/kvkk.html
'use strict';
const fs = require('fs');
const path = require('path');

const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const HERO = path.join(__dirname, 'node_modules/heroicons');
// daisyui.com önizlemelerindeki başlık yazı tipi (Outfit); gövde sistem yazı tipi
const FONT = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400..700&amp;display=swap';

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));

/* ---------- Ortak sınıf dizileri ---------- */
const C = {
  sec: 'py-16 sm:py-20',
  wrap: 'mx-auto max-w-6xl px-4 sm:px-6',
  head: 'mx-auto mb-10 max-w-2xl text-center',
  h2: 'text-3xl font-bold sm:text-4xl',
  lede: 'pt-4 text-lg text-pretty text-base-content/80',
};

/* ---------- Simgeler ---------- */
const svgNorm = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
function setClass(svg, cls) {
  svg = svg.replace(/^<svg([^>]*?)\sclass="[^"]*"/, '<svg$1');
  svg = svg.replace(/^<svg/, `<svg class="${cls}"`);
  if (!/aria-hidden=/.test(svg.slice(0, svg.indexOf('>')))) svg = svg.replace(/^<svg/, '<svg aria-hidden="true"');
  return svg;
}
function heroicon(ad, cls) {
  const [set, isim] = ad.includes(':') ? ad.split(':') : ['24/outline', ad];
  const f = path.join(HERO, set, `${isim}.svg`);
  if (!fs.existsSync(f)) throw new Error('heroicon yok: ' + ad);
  const s = svgNorm(oku(f)).replace(/\sdata-slot="icon"/, '');
  return setClass(s, cls);
}
const simgeler = (html) => html.replace(/<svg data-icon="([^"]+)"([^>]*)><\/svg>/g, (m, ad, rest) => heroicon(ad, (rest.match(/class="([^"]*)"/) || [])[1] || ''));

// WhatsApp simgesi özgün siteden (heroicons'ta yok)
const WA_PATH = (oku(path.join(OZGUN, 'index.html')).match(/<a class="fab fab-wa"[\s\S]*?<path d="([^"]+)"/) || [])[1];
const waIcon = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;
// daisyUI timeline örneğindeki simge (20px solid check-circle), birebir
const TL_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 text-primary" aria-hidden="true"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd"/></svg>';
// daisyUI "Pricing Card" örneğindeki onay simgesi, birebir; çarpı aynı çizgi tokenlarıyla
const CHECK = '<svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
const CROSS = '<svg xmlns="http://www.w3.org/2000/svg" class="size-4 me-2 inline-block text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';

function tokenlar(html, yer) {
  html = html.replace(/\{\{c:(\w+)\}\}/g, (m, k) => { if (!(k in C)) throw new Error('sınıf tokenı yok: ' + k); return C[k]; });
  html = html.replace(/\{\{tl-icon\}\}/g, TL_ICON).replace(/\{\{check\}\}/g, CHECK).replace(/\{\{cross\}\}/g, CROSS);
  html = html.replace(/\{\{wa-icon:([^}]+)\}\}/g, (m, cls) => waIcon(cls));
  if (yer) html = html.replace(/\{\{r\}\}/g, yer.r).replace(/\{\{h\}\}/g, yer.h).replace(/\{\{blog\}\}/g, yer.blog);
  if (/\{\{[^}]+\}\}/.test(html)) throw new Error('çözülmemiş token: ' + html.match(/\{\{[^}]+\}\}/)[0]);
  return simgeler(html);
}

/* ---------- 0.2 adres dönüşümü ---------- */
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, '50-website/template3').replace(/diyetisyen-animasyon-v2/g, 'template3');

/* ---------- <head>: sinematik katmanı kaldır, daisyUI stil dosyası ve başlık yazı tipi ---------- */
function head(src, anaSayfa) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace(/\s*<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '');
  h = h.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"/, `href="${FONT}"`);
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  if (anaSayfa) {
    const t = 'Diyetisyen web sitesi · Template 3 (daisyUI)';
    const d = 'daisyUI bileşenleriyle kurulmuş, yeşil tonlu ve samimi bir diyetisyen sitesi: açık temada emerald, koyu temada forest. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/sinematik|gsap|lenis|motion\.js|premium\.css|site\.css|hero-gezegen/i.test(h)) throw new Error('head temizlenmedi');
  if (!/data-theme="light"/.test(h)) throw new Error('html data-theme yok');
  return h;
}

/* ---------- Ana sayfa içerikleri özgün dosyalardan ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));

function hizmetlerHtml() {
  const re = /<article class="service[^"]*"[^>]*>\s*<a href="#randevu" (data-book-[a-z]+="[^"]+")>\s*<figure class="service-media">\s*<img ([^>]*)>\s*<\/figure>\s*<div class="service-body">\s*<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>\s*<p data-i18n="([^"]+)">([^<]*)<\/p>\s*<ul class="tags">([\s\S]*?)<\/ul>\s*<div class="service-foot"><span class="mono" data-i18n="([^"]+)">([^<]*)<\/span>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const img = m[2].replace(/\ssizes="[^"]*"/, ' sizes="(min-width: 1024px) 22rem, (min-width: 640px) 50vw, 100vw"');
    const tags = m[7].match(/<li data-i18n="[^"]+">[^<]*<\/li>/g).map((li) => li.replace('<li ', '<li class="badge badge-outline badge-sm" ')).join('');
    out.push(`          <article class="card bg-base-100 shadow-sm">
            <figure><img ${img} class="aspect-[4/3] w-full object-cover"></figure>
            <div class="card-body">
              <h3 class="card-title" data-i18n="${m[3]}">${m[4]}</h3>
              <p class="text-pretty" data-i18n="${m[5]}">${m[6]}</p>
              <ul class="flex flex-wrap gap-1.5">${tags}</ul>
              <div class="card-actions mt-2 items-center justify-between">
                <span class="text-sm opacity-80" data-i18n="${m[8]}">${m[9]}</span>
                <a class="btn btn-primary" href="#randevu" ${m[1]} data-i18n="services.book">Randevu al</a>
              </div>
            </div>
          </article>`);
  }
  if (out.length !== 6) throw new Error('hizmet sayısı ' + out.length);
  return out.join('\n');
}

function sssHtml() {
  const re = /<details class="faq"[^>]*>\s*<summary><h3 data-i18n="(faq\.q\d+)">([\s\S]*?)<\/h3>[\s\S]*?<p data-i18n="(faq\.a\d+)">([\s\S]*?)<\/p><\/div>\s*<\/details>/g;
  const out = [];
  let m, ilk = true;
  while ((m = re.exec(ozgunIndex))) {
    out.push(`          <details class="faq collapse collapse-arrow join-item border border-base-300"${ilk ? ' open' : ''}>
            <summary class="collapse-title font-semibold"><h3 class="text-base" data-i18n="${m[1]}">${m[2]}</h3></summary>
            <div class="collapse-content text-sm"><p class="faq-a" data-i18n="${m[3]}">${m[4]}</p></div>
          </details>`);
    ilk = false;
  }
  if (out.length !== 10) throw new Error('SSS sayısı ' + out.length);
  return out.join('\n');
}

const OZETLER = {}; // blog/index.html'deki özetler: dosya → {tr, en}
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">[\s\S]*?<p><span data-lang-block="tr">([\s\S]*?)<\/span><span data-lang-block="en">([\s\S]*?)<\/span><\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { tr: m[2], en: m[3] };
})();

// card card-side (küçük ekranda dikey: "Responsive card")
function kartSide({ href, img, meta, hTag, baslik, ozet, eager }) {
  return `          <article class="card bg-base-100 shadow-sm sm:card-side">
            <figure class="sm:w-48 sm:shrink-0"><img ${img} class="aspect-video h-full w-full object-cover sm:aspect-auto"${eager ? '' : ''}></figure>
            <div class="card-body">
              <p class="post-meta">${meta}</p>
              <${hTag} class="card-title"><a class="link link-hover" href="${href}">${baslik}</a></${hTag}>
              <p class="text-sm text-pretty">${ozet}</p>
            </div>
          </article>`;
}

function blogKartlari() {
  const re = /<article class="post-(?:feature|row)"[^>]*>\s*<a href="([^"]+)">([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m, n = 0;
  while ((m = re.exec(ozgunIndex))) {
    n++;
    const ic = m[2];
    const img = ic.match(/<img src="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="(alt:[^"]+)"/);
    const src = img[1].replace(/-1800\.webp/, '-900.webp');
    const cat = ic.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const read = ic.match(/<span data-i18n="(post\d\.read)">([^<]*)<\/span>/);
    const title = ic.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const ex = ic.match(/<p data-i18n="(post\d\.excerpt)">([^<]*)<\/p>/);
    const dosya = m[1].replace(/^blog\//, '');
    const ozet = ex ? { key: ex[1], tr: ex[2] } : { key: `post${n}.excerpt`, tr: OZETLER[dosya].tr };
    out.push(kartSide({
      href: m[1],
      img: `src="${src}" width="900" height="563" loading="lazy" decoding="async" alt="${img[2]}" data-i18n-attr="${img[3]}"`,
      meta: `<span data-i18n="${cat[1]}">${cat[2]}</span><span data-i18n="${read[1]}">${read[2]}</span>`,
      hTag: 'h3',
      baslik: `<span data-i18n="${title[1]}">${title[2]}</span>`,
      ozet: `<span data-i18n="${ozet.key}">${ozet.tr}</span>`,
    }));
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  govde = govde.replace('{{hizmetler}}', hizmetlerHtml()).replace('{{sss}}', sssHtml()).replace('{{blogkartlari}}', blogKartlari());
  const yer = { r: '', h: '', blog: 'blog/' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
}

/* ---------- Alt sayfalar (blog/*.html, kvkk.html) ---------- */
function postKart(article, hTag) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const img = article.match(/<img ([^>]*)>/)[1];
  const meta = article.match(/<p class="post-meta">([\s\S]*?)<\/p>/)[1].replace(/ class="cat"/, '');
  const baslik = article.match(/<h([23])>([\s\S]*?)<\/h\1>/)[2];
  const ozet = article.match(/<\/h[23]>\s*<p>([\s\S]*?)<\/p>/)[1];
  return kartSide({ href, img, meta, hTag, baslik, ozet });
}
function kartlar(html, hTag) {
  return html.replace(/<div class="posts-grid">([\s\S]*?)\n        <\/div>/, (m, ic) => {
    const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
    return '<div class="grid gap-6 lg:grid-cols-2">\n' + arts.map((a) => postKart(a, hTag)).join('\n') + '\n        </div>';
  });
}

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const yer = blogda ? { r: '../', h: '../index.html', blog: './' } : { r: '', h: 'index.html', blog: 'blog/' };
  let body = src.slice(src.indexOf('<body'));

  // Üst menü (navbar), footer, sohbet ve bildirim ortak parçalardan
  body = body.replace(/<a class="skip-link"[\s\S]*?(?=\n  <main id="main">)/, parca('header').trim());
  body = body.replace(/\n    <footer class="panel site-footer">[\s\S]*?<\/footer>/, '');
  body = body.replace(/<\/main>/, '</main>\n\n' + parca('footer'));
  body = body.replace(/<aside class="floating-actions"[\s\S]*?(<div class="toast" id="toast"[^>]*><\/div>)/, parca('sohbet').trim());
  if (!/chat-widget/.test(body)) throw new Error('sohbet yerleşmedi: ' + rel);
  body = body.replace(/<body>/, '<body class="bg-base-100 text-base-content">');

  body = body.replace(/ data-reveal(="[^"]*")?/g, '');
  // breadcrumbs
  body = body.replace(/<nav (data-i18n-attr="aria-label:crumbs\.aria")/, '<nav class="breadcrumbs text-sm" $1');
  body = body.replace(/<ol class="crumbs">/, '<ol>');
  body = body.replace(/<(article|section) class="panel page-top"/, `<$1 class="py-10"`);
  body = body.replace(/(<(?:article|section) class="py-10"[^>]*>\s*)<div class="wrap">/, `$1<div class="${C.wrap}">`);
  // Yazar: avatar
  body = body.replace(/<div class="byline">\s*<img ([^>]*)>/, '<div class="byline">\n            <div class="avatar"><div class="w-12 rounded-full"><img $1></div></div>');
  // İçindekiler: menu
  body = body.replace(/<aside class="toc"/, '<aside class="toc rounded-box bg-base-200 p-4"');
  body = body.replace(/<p class="label" data-i18n="article\.toc">/, '<p class="text-sm font-semibold" data-i18n="article.toc">');
  body = body.replace(/<ol data-lang-block="(tr|en)"><li><a href="#/g, '<ol class="menu menu-sm w-full p-0" data-lang-block="$1"><li><a href="#');

  if (rel === 'blog/index.html') {
    body = body.replace(/<header class="sec-head sec-head--split">\s*<div class="sec-head">\s*<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>\s*<\/div>\s*<p class="lede"([^>]*)>([\s\S]*?)<\/p>\s*<\/header>/,
      `<header class="${C.head} mt-6">\n          <h1 id="blog-title" class="${C.h2}"$1>$2</h1>\n          <p class="${C.lede}"$3>$4</p>\n        </header>`);
    body = kartlar(body, 'h2');
  } else if (blogda) {
    // Yazı sonu çağrısı: card bg-neutral
    body = body.replace(/<aside class="article-cta">\s*<h2 class="h3" data-i18n="article\.ctaTitle">([\s\S]*?)<\/h2>\s*<p data-i18n="article\.ctaText">([\s\S]*?)<\/p>\s*<a class="btn btn--primary" href="([^"]+)" data-i18n="article\.ctaBtn">([\s\S]*?)<\/a>\s*<\/aside>/,
      `<aside class="article-cta card mt-10 bg-neutral text-neutral-content">\n              <div class="card-body">\n                <h2 class="card-title" data-i18n="article.ctaTitle">$1</h2>\n                <p data-i18n="article.ctaText">$2</p>\n                <div class="card-actions"><a class="btn btn-primary" href="$3" data-i18n="article.ctaBtn">$4</a></div>\n              </div>\n            </aside>`);
    if (!/article-cta card/.test(body)) throw new Error('article-cta dönüşmedi: ' + rel);
    // İlgili yazılar
    body = body.replace(/<section class="panel panel--alt related"([^>]*)>\s*<div class="wrap">/, `<section class="related bg-base-200 py-16"$1>\n      <div class="${C.wrap}">`);
    body = body.replace(/<header class="sec-head sec-head--split">\s*<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>\s*<a class="link-arrow" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/header>/,
      `<header class="mb-8 flex flex-wrap items-end justify-between gap-4">\n          <h2 id="related-title" class="${C.h2}"$1>$2</h2>\n          <a class="btn btn-outline" href="$3"$4>$5</a>\n        </header>`);
    body = kartlar(body, 'h3');
    body = body.replace(/(<table[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>');
  }
  body = body.replace(/<p class="label"><span data-lang-block="tr">/, '<p class="text-sm font-semibold opacity-80"><span data-lang-block="tr">');
  body = body.replace(/<p class="label" data-i18n="article\.sources">/, '<p class="font-semibold" data-i18n="article.sources">');
  const kalan = body.match(/class="(panel[^"]*|sec-head[^"]*|h2|h3|wrap|btn btn--[a-z]+[^"]*|link-arrow|crumbs)"/);
  if (kalan) console.warn('  uyarı: eski sınıf kaldı →', rel, kalan[0]);
  const html = head(src, false) + tokenlar(body, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
if (process.argv[2] === 'ozet') console.log(JSON.stringify(Object.fromEntries(Object.entries(OZETLER).map(([k, v]) => [k, v.en])), null, 1));
