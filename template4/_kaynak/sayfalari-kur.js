// template4 sayfa kurucusu (Flowbite). Tekrar çalıştırılabilir:
//   node sayfalari-kur.js
// Girdiler: _kaynak/sayfa/*.html (Flowbite blok/bileşen işaretlemesiyle yazılmış şablonlar),
// _kaynak/bloklar/*.html ("Show code" ile alınan ücretsiz blok kodu; simgeler buradan kopyalanır),
// node_modules/flowbite-icons (Flowbite'ın kendi simge seti, MIT) ve
// diyetisyen-animasyon-v2 içindeki özgün sayfalar (yalnızca okunur; head, hizmetler, notlar, SSS, blog ve makale içerikleri buradan).
// Çıktılar: template4/index.html, template4/blog/*.html, template4/kvkk.html
'use strict';
const fs = require('fs');
const path = require('path');

const N = 4;
const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const BLOK = path.join(__dirname, 'bloklar');
const FBI = path.join(__dirname, 'node_modules/flowbite-icons/src');
// Flowbite quickstart (Tailwind v4): Inter 300–800
const FONT = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap';

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));

/* ---------- Flowbite sınıf dizileri (her biri adı geçen blok / belge örneğinden) ----------
   Bloklar Tailwind v3 ile çizildiği için v4'te aynı görünsün diye çevrildi:
   rounded-lg→rounded (8px), rounded→rounded-xs (4px), shadow-sm→shadow-xs, tracking-tight→tracking-[-0.025em]. */
const TT = 'tracking-[-0.025em]';
const C = {
  // blocks/team, blocks/pricing, blocks/blog: bölüm kabı ve ortalanmış başlık
  wrap: 'py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6',
  head: 'mx-auto max-w-screen-sm text-center mb-8 lg:mb-16',
  h2: `mb-4 text-4xl ${TT} font-extrabold text-gray-900 dark:text-white`,
  lede: 'font-light text-gray-500 sm:text-xl dark:text-gray-400',
  // blocks/feature: sola yaslı başlık
  headL: 'max-w-screen-md mb-8 lg:mb-16',
  ledeL: 'text-gray-500 sm:text-xl dark:text-gray-400',
  // blocks/header "Default header navigation" bağlantıları (lg → xl: 7 Türkçe bağlantı lg'ye sığmıyor); "Home" etkin görünümü aria-current ile
  navLink: 'block py-2 pr-4 pl-3 text-gray-700 rounded-xs border-b border-gray-100 hover:bg-gray-50 xl:hover:bg-transparent xl:border-0 xl:hover:text-primary-700 xl:p-0 dark:text-gray-400 xl:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white xl:dark:hover:bg-transparent dark:border-gray-700 aria-[current=true]:text-white aria-[current=true]:bg-primary-700 xl:aria-[current=true]:bg-transparent xl:aria-[current=true]:text-primary-700 dark:aria-[current=true]:text-white',
  // blocks/hero "Default hero section" düğmeleri
  heroBtn: 'inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900',
  heroBtn2: 'inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800',
  // blocks/cta "Heading with CTA button" düğmesi
  ctaBtn: 'text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800',
  // blocks/content "Learn more" bağlantısı
  more: 'inline-flex items-center font-medium text-primary-600 hover:text-primary-800 dark:text-primary-500 dark:hover:text-primary-700',
  // components/buttons "Default button": Default + Secondary
  btn: 'inline-flex items-center justify-center text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none',
  btn2: 'inline-flex items-center justify-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none',
  // components/buttons: seçili filtre = "Default" (brand) görünümü
  btnOn: 'aria-pressed:text-white aria-pressed:bg-brand aria-pressed:border-transparent aria-pressed:hover:bg-brand-strong aria-pressed:hover:text-white',
  // components/card
  card: 'bg-neutral-primary-soft block border border-default rounded-base shadow-xs',
  cardPad: 'bg-neutral-primary-soft block p-6 border border-default rounded-base shadow-xs',
  cardH: 'mb-3 text-2xl font-semibold tracking-tight text-heading leading-8',
  // components/badge (card-with-image "Trending")
  badge: 'inline-flex items-center bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm',
  // forms/input-field "Input fields" + "Validation" (danger)
  label: 'block mb-2.5 text-sm font-medium text-heading',
  input: 'bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body',
  invalid: 'aria-invalid:bg-danger-soft aria-invalid:border-danger-subtle aria-invalid:text-fg-danger-strong aria-invalid:focus:ring-danger aria-invalid:focus:border-danger',
  // forms/range "Range slider example"
  range: 'w-full h-2 bg-neutral-quaternary rounded-full appearance-none cursor-pointer',
  // forms/radio "Bordered" (girdi etiketin içinde)
  radioB: 'flex items-center ps-4 border border-default bg-neutral-primary-soft rounded-base cursor-pointer',
  radioBIn: 'w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none',
  radioBTx: 'w-full py-4 select-none ms-2 text-sm font-medium text-heading',
  // forms/radio "Advanced layout" (peer-checked → has-checked, çünkü girdi etiketin içinde; gizli girdi klavyeyle erişilsin diye sr-only)
  radioA: 'inline-flex items-center justify-between gap-3 w-full p-5 text-body bg-neutral-primary-soft border border-default rounded-base cursor-pointer has-checked:hover:bg-brand-softer has-checked:border-brand-subtle has-checked:bg-brand-softer hover:bg-neutral-secondary-medium has-checked:text-fg-brand-strong has-focus-visible:ring-4 has-focus-visible:ring-brand-medium has-disabled:cursor-not-allowed has-disabled:opacity-50',
  // forms/checkbox "Checkbox example"
  check: 'w-4 h-4 shrink-0 mt-0.5 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft',
  // components/tabs "Tabs with underline" (seçili: .active → aria-selected)
  tabsWrap: 'text-sm font-medium text-center text-body border-b border-default',
  tab: 'inline-block p-4 border-b border-transparent rounded-t-base hover:text-fg-brand hover:border-brand aria-selected:text-fg-brand aria-selected:border-brand',
  // components/tabs "Pills tabs" (seçili: .active → aria-checked / aria-selected)
  pill: 'inline-block px-4 py-2.5 rounded-base hover:text-heading hover:bg-neutral-secondary-soft aria-checked:text-white aria-checked:bg-brand aria-checked:hover:bg-brand aria-checked:hover:text-white',
  // components/list-group "Default list group"
  list: 'text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-base',
  // components/modal "Default modal"
  modal: 'm-auto w-[calc(100%-2rem)] max-w-2xl p-0 bg-transparent backdrop:bg-dark-backdrop/70',
  modalBox: 'relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6',
  modalHead: 'flex items-center justify-between gap-4 border-b border-default pb-4 md:pb-5',
  modalTitle: 'text-lg font-medium text-heading',
  modalClose: 'text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex shrink-0 justify-center items-center',
  // components/stepper "Default stepper"
  stepLi: 'flex items-center [&.is-current]:text-fg-brand [&.is-done]:text-fg-brand',
  stepLine: "md:w-full sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-default after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10",
  // blocks/contact "Default contact form" alanları
  cfLabel: 'block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300',
  cfInput: 'shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500',
  cfInvalid: 'aria-invalid:border-red-500 aria-invalid:bg-red-50 dark:aria-invalid:bg-gray-700 dark:aria-invalid:border-red-500',
  // Çalışma saatleri tablosu: components/list-group satırları (bugün: vurgulu satır)
  hoursRow: 'text-body [&.is-today]:font-semibold [&.is-today]:text-heading [&.is-today]:bg-neutral-secondary-medium',
  hoursTh: 'px-4 py-2 text-start font-medium border-b border-default',
  hoursTd: 'px-4 py-2 text-end border-b border-default',
  // blocks/footer "Sitemap with logo and social media"
  fH: 'mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white',
  fUl: 'text-gray-600 dark:text-gray-400',
  fLink: 'hover:underline',
  fSocial: 'text-gray-500 hover:text-gray-900 dark:hover:text-white',
  // blocks/blog "Default blog card"
  blogCard: 'p-6 bg-white rounded border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700',
  blogBadge: 'bg-primary-100 text-primary-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-xs dark:bg-primary-200 dark:text-primary-800',
  blogTitle: `mb-2 text-2xl font-bold ${TT} text-gray-900 dark:text-white`,
  blogEx: 'mb-5 font-light text-gray-500 dark:text-gray-400',
  blogMore: 'inline-flex items-center font-medium text-primary-600 dark:text-primary-400 hover:underline', // dark:text-primary-500 → 400 (gray-800 kartta 3,98:1)
};

/* ---------- Simgeler ---------- */
// Flowbite Icons: <svg data-icon="ad" [data-v="solid"] class="…"></svg>
const ICONS = {};
for (const v of ['outline', 'solid']) {
  for (const grp of fs.readdirSync(path.join(FBI, v))) {
    for (const f of fs.readdirSync(path.join(FBI, v, grp))) ICONS[`${v}/${f.replace(/\.svg$/, '')}`] = path.join(FBI, v, grp, f);
  }
}
const svgNorm = (s) => s.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
function setClass(svg, cls) {
  svg = svg.replace(/^<svg([^>]*?)\sclass="[^"]*"/, '<svg$1');
  svg = svg.replace(/^<svg/, `<svg class="${cls}"`);
  if (!/aria-hidden=/.test(svg.slice(0, svg.indexOf('>')))) svg = svg.replace(/^<svg/, '<svg aria-hidden="true"');
  return svg;
}
function fbIcon(ad, cls, v) {
  const f = ICONS[`${v || 'outline'}/${ad}`];
  if (!f) throw new Error('Flowbite simgesi yok: ' + (v || 'outline') + '/' + ad);
  return setClass(svgNorm(oku(f)), cls);
}
// Blok simgesi: <svg data-icon="blok:<dosya>:<n>"> → bloklar/blok-<dosya>.html içindeki n'inci <svg>
const blokCache = {};
function blokIcon(spec, cls) {
  const [dosya, sira] = spec.split(':');
  if (!blokCache[dosya]) blokCache[dosya] = oku(path.join(BLOK, `blok-${dosya}.html`)).match(/<svg[\s\S]*?<\/svg>/g) || [];
  const s = blokCache[dosya][Number(sira) - 1];
  if (!s) throw new Error('blok svg yok: ' + spec);
  return setClass(svgNorm(s), cls);
}
function simgeler(html) {
  return html.replace(/<svg data-icon="([^"]+)"([^>]*)><\/svg>/g, (m, spec, rest) => {
    const cls = (rest.match(/class="([^"]*)"/) || [])[1] || '';
    const v = (rest.match(/data-v="([^"]*)"/) || [])[1];
    return spec.startsWith('blok:') ? blokIcon(spec.slice(5), cls) : fbIcon(spec, cls, v);
  });
}
// Marka işareti: blok başlığındaki logo yuvası (img h-6 sm:h-9) — sahte logo yerine Mizan "m" işareti
const LOGO = (cls) => `<svg class="${cls}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="32" height="32" rx="8" fill="currentColor"/><text x="16" y="23" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="21" fill="#fff">m</text></svg>`;

function tokenlar(html, yer) {
  html = html.replace(/\{\{c:(\w+)\}\}/g, (m, k) => { if (!(k in C)) throw new Error('sınıf tokenı yok: ' + k); return C[k]; });
  html = html.replace(/\{\{logo:([^}]+)\}\}/g, (m, cls) => LOGO(cls));
  if (yer) html = html.replace(/\{\{r\}\}/g, yer.r).replace(/\{\{h\}\}/g, yer.h).replace(/\{\{blog\}\}/g, yer.blog);
  return simgeler(html);
}

/* ---------- 0.2 adres dönüşümü ---------- */
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, `50-website/template${N}`).replace(/diyetisyen-animasyon-v2/g, `template${N}`);

/* ---------- <head>: sinematik katmanı kaldır, Flowbite stil + JS ve Inter'i bağla ---------- */
function head(src, anaSayfa) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace(/\s*<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '');
  h = h.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?[^"]*"/, `href="${FONT}"`);
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  // Flowbite JS (navbar collapse + carousel) ve Mizan köprüsü, sitenin kendi betiklerinden sonra
  h = h.replace(/(\n(\s*)<script src="((?:\.\.?\/)?)assets\/js\/chat\.js" defer><\/script>)/,
    '$1\n$2<script src="$3assets/vendor/flowbite/flowbite.min.js" defer></script>\n$2<script src="$3assets/js/flowbite-baglanti.js" defer></script>');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#ffffff">');
  if (anaSayfa) {
    const t = `Diyetisyen web sitesi · Template ${N} (Flowbite)`;
    const d = 'Flowbite’ın ücretsiz blokları ve bileşenleriyle kurulmuş kurumsal bir diyetisyen sitesi. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/sinematik|gsap|lenis|motion\.js|premium\.css|site\.css/i.test(h)) throw new Error('head temizlenmedi');
  if (!/flowbite\.min\.js/.test(h)) throw new Error('flowbite betiği eklenmedi');
  return h;
}

/* ---------- Ana sayfa: özgün içerikten üretilen parçalar ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));

// S4 hizmetler → components/card "Card with image" (6 kart)
function hizmetler() {
  const re = /<article class="service[^"]*"[^>]*>\s*<a href="#randevu" (data-book-[a-z]+="[^"]+")>([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2];
    const img = ic.match(/<img src="([^"]+)" srcset="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="(alt:[^"]+)"/);
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const p = ic.match(/<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const tags = [...ic.matchAll(/<li data-i18n="([^"]+)">([^<]*)<\/li>/g)];
    const foot = ic.match(/<span class="mono" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const book = ic.match(/<span class="link-arrow" data-i18n="([^"]+)">([^<]*)<\/span>/);
    out.push(`          <article class="{{c:card}} flex flex-col">
            <img class="rounded-t-base w-full aspect-[4/3] object-cover" src="${img[1]}" srcset="${img[2]}" sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" width="1200" height="900" loading="lazy" decoding="async" alt="${img[3]}" data-i18n-attr="${img[4]}">
            <div class="flex flex-1 flex-col items-center p-6 text-center">
              <ul class="flex flex-wrap justify-center gap-1.5">
${tags.map((t) => `                <li class="{{c:badge}}" data-i18n="${t[1]}">${t[2]}</li>`).join('\n')}
              </ul>
              <h3 class="mt-3 mb-3 text-2xl font-semibold tracking-tight text-heading" data-i18n="${h3[1]}">${h3[2]}</h3>
              <p class="mb-6 text-body" data-i18n="${p[1]}">${p[2]}</p>
              <p class="mt-auto mb-3 text-sm text-body" data-i18n="${foot[1]}">${foot[2]}</p>
              <a href="#randevu" ${m[1]} class="{{c:btn}}"><span data-i18n="${book[1]}">${book[2]}</span><svg data-icon="arrow-right" class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"></svg></a>
            </div>
          </article>`);
  }
  if (out.length !== 6) throw new Error('hizmet sayısı ' + out.length);
  return out.join('\n');
}

// S5 mevsim notları → components/carousel "Default slider" (data-carousel="static": otomatik geçiş yok)
function notlar() {
  const re = /<figure class="note[^"]*" data-note[^>]*>\s*<img src="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="(alt:[^"]+)">\s*<figcaption data-i18n="([^"]+)">([^<]*)<\/figcaption>\s*<\/figure>/g;
  const items = [], dots = [];
  let m, i = 0;
  while ((m = re.exec(ozgunIndex))) {
    items.push(`          <figure class="hidden duration-700 ease-in-out motion-reduce:transition-none" data-carousel-item${i === 0 ? '="active"' : ''}>
            <img src="${m[1]}" width="720" height="720" loading="lazy" decoding="async" draggable="false" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="${m[2]}" data-i18n-attr="${m[3]}">
            <figcaption class="absolute top-4 start-4 z-10 {{c:badge}} text-sm px-2.5 py-1" data-i18n="${m[4]}">${m[5]}</figcaption>
          </figure>`);
    dots.push(`          <button type="button" class="w-3 h-3 rounded-base" aria-current="${i === 0}" aria-label="${m[5]}" data-i18n-attr="aria-label:${m[4]}" data-carousel-slide-to="${i}"></button>`);
    i++;
  }
  if (items.length !== 7) throw new Error('not sayısı ' + items.length);
  return { items: items.join('\n'), dots: dots.join('\n') };
}

// S15 SSS → blocks/faq "Default example" (iki sütun; soru h3 + cevap p)
function sssHtml() {
  const re = /<details class="faq"[^>]*>\s*<summary><h3 data-i18n="(faq\.q\d+)">([\s\S]*?)<\/h3>[\s\S]*?<p data-i18n="(faq\.a\d+)">([\s\S]*?)<\/p><\/div>\s*<\/details>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    out.push(`              <div class="faq mb-10">
                <h3 class="flex items-center mb-4 text-lg font-medium text-gray-900 dark:text-white">
                  <svg data-icon="blok:faq:1" class="shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400"></svg>
                  <span data-i18n="${m[1]}">${m[2]}</span>
                </h3>
                <p class="faq-a text-gray-500 dark:text-gray-400" data-i18n="${m[3]}">${m[4]}</p>
              </div>`);
  }
  if (out.length !== 10) throw new Error('SSS sayısı ' + out.length);
  const yari = Math.ceil(out.length / 2);
  return `            <div>\n${out.slice(0, yari).join('\n')}\n            </div>\n            <div>\n${out.slice(yari).join('\n')}\n            </div>`;
}

// Yazar bilgisi makale sayfalarının byline'ından: href → {img, tr, en}
const YAZAR = {};
for (const f of fs.readdirSync(path.join(OZGUN, 'blog')).filter((x) => x.endsWith('.html') && x !== 'index.html')) {
  const s = oku(path.join(OZGUN, 'blog', f));
  const m = s.match(/<div class="byline">\s*<img src="\.\.\/([^"]+)"[^>]*>\s*<div><b>([\s\S]*?)<\/b>/);
  if (!m) throw new Error('byline yok: ' + f);
  YAZAR[f] = { img: m[1], ad: m[2] };
}

// S14 ana sayfa blog kartları → blocks/blog "Default blog card"
const OZETLER = {}; // blog/index.html'deki özetler: href → {tr, en}
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">[\s\S]*?<time datetime="([^"]+)"><span data-lang-block="tr">([^<]*)<\/span><span data-lang-block="en">([^<]*)<\/span><\/time>[\s\S]*?<p><span data-lang-block="tr">([\s\S]*?)<\/span><span data-lang-block="en">([\s\S]*?)<\/span><\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { dt: m[2], dtr: m[3], den: m[4], tr: m[5], en: m[6] };
})();
function blogKart({ href, cat, date, title, hTag, ex, read, yazar, r }) {
  return `          <article class="{{c:blogCard}} flex flex-col">
            <div class="flex justify-between items-center gap-3 mb-5 text-gray-500 dark:text-gray-400">
              <span class="{{c:blogBadge}}"><svg data-icon="blok:blog:1" class="mr-1 w-3 h-3"></svg>${cat}</span>
              <span class="text-sm">${date}</span>
            </div>
            <${hTag} class="{{c:blogTitle}}"><a href="${href}">${title}</a></${hTag}>
            <p class="{{c:blogEx}}">${ex}</p>
            <div class="mt-auto flex justify-between items-center gap-3">
              <div class="flex items-center gap-3">
                <img class="w-7 h-7 rounded-full object-cover" src="${r}${yazar.img}" width="28" height="28" loading="lazy" alt="">
                <span class="font-medium text-gray-900 dark:text-white">${yazar.ad}</span>
              </div>
              <a href="${href}" class="{{c:blogMore}} shrink-0">${read}<svg data-icon="blok:blog:2" class="ml-2 w-4 h-4"></svg></a>
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
    const cat = ic.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const read = ic.match(/<span data-i18n="(post\d\.read)">([^<]*)<\/span>/);
    const title = ic.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const ex = ic.match(/<p data-i18n="(post\d\.excerpt)">([^<]*)<\/p>/);
    const dosya = m[1].replace(/^blog\//, '');
    const oz = OZETLER[dosya];
    const ozet = ex ? { key: ex[1], tr: ex[2] } : { key: `post${n}.excerpt`, tr: oz.tr };
    out.push(blogKart({
      href: m[1], hTag: 'h3', r: '',
      cat: `<span data-i18n="${cat[1]}">${cat[2]}</span>`,
      date: `<time datetime="${oz.dt}"><span data-lang-block="tr">${oz.dtr}</span><span data-lang-block="en">${oz.den}</span></time> · <span data-i18n="${read[1]}">${read[2]}</span>`,
      title: `<span data-i18n="${title[1]}">${title[2]}</span>`,
      ex: `<span data-i18n="${ozet.key}">${ozet.tr}</span>`,
      read: '<span data-i18n="blog.readMore">Devamını oku</span>',
      yazar: YAZAR[dosya],
    }));
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  const nt = notlar();
  govde = govde.replace('{{hizmetler}}', hizmetler()).replace('{{notlar}}', nt.items).replace('{{notnokta}}', nt.dots)
    .replace('{{sss}}', sssHtml()).replace('{{blogkartlari}}', blogKartlari());
  const yer = { r: '', h: '', blog: 'blog/' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
  return html;
}

/* ---------- Alt sayfalar (blog/*.html, kvkk.html) ---------- */
// components/breadcrumb "Default breadcrumb"
function breadcrumbs(ol) {
  const lis = ol.match(/<li[\s\S]*?<\/li>/g);
  const items = lis.map((li, i) => {
    const ic = li.replace(/^<li[^>]*>/, '').replace(/<\/li>$/, '');
    const sep = i ? '<svg data-icon="chevron-right" class="rtl:rotate-180 w-3.5 h-3.5 mx-1 text-body"></svg>' : '<svg data-icon="home" class="w-4 h-4 me-1.5"></svg>';
    if (/^<a /.test(ic)) return `<li class="inline-flex items-center">${i ? sep : ''}${ic.replace(/<a href/, `<a class="inline-flex items-center text-sm font-medium text-body hover:text-fg-brand" href`).replace(/(<a [^>]*>)/, i ? '$1' : `$1${sep}`)}</li>`;
    return `<li aria-current="page"><div class="flex items-center">${sep}<span class="inline-flex items-center text-sm font-medium text-body-subtle">${ic}</span></div></li>`;
  });
  return `<ol class="inline-flex flex-wrap items-center gap-y-1 space-x-1 md:space-x-2 rtl:space-x-reverse">${items.join('')}</ol>`;
}
function postKart(article, hTag, r) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const meta = article.match(/<p class="post-meta">([\s\S]*?)<\/p>/)[1];
  const cat = meta.match(/<span class="cat">([\s\S]*?<\/span>)<\/span>/)[1];
  const time = meta.match(/<time[\s\S]*?<\/time>/)[0];
  const read = meta.match(/<\/time><span>([\s\S]*?)<\/span>$/)[1];
  const title = article.match(/<h([23])>([\s\S]*?)<\/h\1>/)[2];
  const ex = article.match(/<\/h[23]>\s*<p>([\s\S]*?)<\/p>/)[1];
  return blogKart({ href, hTag, r, cat, date: `${time} · ${read}`, title, ex, read: '<span data-i18n="blog.readMore">Devamını oku</span>', yazar: YAZAR[href] });
}
function kartlar(html, hTag, r) {
  return html.replace(/<div class="posts-grid">([\s\S]*?)\n        <\/div>/, (m, ic) => {
    const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
    return '<div class="grid gap-8 lg:grid-cols-2">\n' + arts.map((a) => postKart(a, hTag, r)).join('\n') + '\n        </div>';
  });
}

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const yer = blogda ? { r: '../', h: '../index.html', blog: './' } : { r: '', h: 'index.html', blog: 'blog/' };
  let body = src.slice(src.indexOf('<body'));

  body = body.replace(/<a class="skip-link"[\s\S]*?(?=\n  <main id="main">)/, parca('header').trim());
  body = body.replace(/\n    <footer class="panel site-footer">[\s\S]*?<\/footer>/, '');
  body = body.replace(/<\/main>/, '</main>\n\n' + parca('footer'));
  body = body.replace(/<aside class="floating-actions"[\s\S]*?<\/aside>\s*(<div class="toast" id="toast"[^>]*><\/div>)?/, parca('sohbet').trim() + '\n');
  body = body.replace(/<body>/, '<body class="bg-white dark:bg-gray-900">');

  body = body.replace(/ data-reveal(="[^"]*")?/g, '');
  body = body.replace(/<ol class="crumbs">([\s\S]*?)<\/ol>/, (m) => breadcrumbs(m));
  body = body.replace(/<nav (data-i18n-attr="aria-label:crumbs\.aria")/, '<nav class="flex mb-8" $1');
  body = body.replace(/<(article|section) class="panel page-top"/, `<$1 class="bg-white dark:bg-gray-900"`);
  body = body.replace(/ class="wrap"/, ` class="${C.wrap}"`);
  body = body.replace(/ class="wrap"/g, '');

  if (rel === 'blog/index.html') {
    body = body.replace(/<header class="sec-head sec-head--split">\s*<div class="sec-head">\s*<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>\s*<\/div>\s*<p class="lede"([^>]*)>([\s\S]*?)<\/p>\s*<\/header>/,
      `<div class="${C.head}">\n          <h1 id="blog-title" class="${C.h2}"$1>$2</h1>\n          <p class="${C.lede}"$3>$4</p>\n        </div>`);
    body = kartlar(body, 'h2', '../');
  } else {
    // Makale gövdesi: Flowbite Typography (format); uyarı kutuları biçimlendirme dışı (not-format)
    body = body.replace(/<div class="prose"/g, '<div class="format lg:format-lg dark:format-invert max-w-none"');
    body = body.replace(/<div class="prose sources"/g, '<div class="format dark:format-invert max-w-none sources"');
    body = body.replace(/class="callout( callout--warn)?"/g, 'class="callout$1 not-format"');
    body = body.replace(/(<table[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>');
    body = body.replace(/<h2 class="h3" data-i18n="article\.ctaTitle">/, '<h2 data-i18n="article.ctaTitle">');
    body = body.replace(/<a class="btn btn--primary" href="([^"]+)" data-i18n="article\.ctaBtn">/, '<a href="$1" data-i18n="article.ctaBtn">');
    // İlgili yazılar: blocks/blog kartları
    body = body.replace(/<section class="panel panel--alt related"/, '<section class="related bg-neutral-secondary"');
    body = body.replace(/(<section class="related[^>]*>\s*)<div>/, `$1<div class="${C.wrap}">`);
    body = body.replace(/<header class="sec-head sec-head--split">\s*<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>\s*<a class="link-arrow" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/header>/,
      `<div class="flex flex-wrap items-end justify-between gap-4 mb-8">\n          <h2 id="related-title" class="${C.h2} mb-0"$1>$2</h2>\n          <a class="${C.more}" href="$3"><span$4>$5</span><svg data-icon="blok:content:1" class="ml-1 w-6 h-6"></svg></a>\n        </div>`);
    body = kartlar(body, 'h3', '../');
  }
  if (/class="(panel|sec-head|h2|h3|prose|btn btn--primary)"/.test(body)) console.warn('  uyarı: eski sınıf kaldı →', rel, (body.match(/class="(panel[^"]*|sec-head[^"]*|h2|h3|prose)"/) || [])[0]);
  const html = head(src, false) + tokenlar(body, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
