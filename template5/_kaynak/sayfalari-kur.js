// template5 sayfa kurucusu (Landwind). Tekrar çalıştırılabilir:
//   node sayfalari-kur.js && npx tailwindcss -i tw.css -o ../assets/css/tw.css --minify
// Girdiler:
//   _kaynak/sayfa/*.html            Landwind index.html bloklarıyla (ve Flowbite v2.5.2 belge örnekleriyle) yazılmış şablonlar
//   indirilen/landwind/index.html   Landwind SVG'leri buradan sırayla kopyalanır (data-icon="lw:<n>")
//   bilesenler/*.html               Flowbite belge örnekleri (data-icon="fb:<dosya>:<n>")
//   node_modules/flowbite-icons     Flowbite simge seti, MIT (data-icon="<ad>" [data-v="solid"])
//   ../../diyetisyen-animasyon-v2   Özgün site (yalnızca okunur): head, hizmetler, adımlar, notlar, uzmanlar, SSS, ücret maddeleri, blog, makaleler, KVKK
// Çıktılar: template5/index.html, template5/blog/*.html, template5/kvkk.html
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const N = 5;
const HEDEF = path.resolve(__dirname, '..');
const OZGUN = path.resolve(HEDEF, '../diyetisyen-animasyon-v2');
const SAYFA = path.join(__dirname, 'sayfa');
const FBI = path.join(__dirname, 'node_modules/flowbite-icons/src');

const oku = (p) => fs.readFileSync(p, 'utf8');
const parca = (ad) => oku(path.join(SAYFA, `parca-${ad}.html`));

/* ---------- Sınıf dizileri: Landwind index.html + Flowbite v2.5.2 belge örnekleri (blue → Landwind'in purple'ı) ---------- */
const C = {
  // Landwind bölüm kalıbı (fiyat / SSS / özellik blokları)
  wrap: 'max-w-screen-xl px-4 py-8 mx-auto lg:py-24 lg:px-6',
  head: 'max-w-screen-md mx-auto mb-8 text-center lg:mb-12',
  headC: 'max-w-screen-md mx-auto mb-8 text-center lg:mb-12',
  h2: 'mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white',
  lede: 'mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400',
  // Landwind istatistik bloğu bağlantısı ("Explore Legality Guide"); koyu: purple-500 → 400 (kontrast)
  lwLink: 'inline-flex items-center text-base font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300',
  statIcon: 'w-10 h-10 mb-2 text-purple-600 md:w-12 md:h-12 dark:text-purple-400',
  // Landwind nav bağlantısı; "Home" etkin görünümü aria-current ile (site.js kaydırma izleyicisi / blog sayfaları)
  navLink: 'block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-purple-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700 [&[aria-current]]:text-white [&[aria-current]]:bg-purple-700 [&[aria-current]]:rounded lg:[&[aria-current]]:bg-transparent lg:[&[aria-current]]:text-purple-700 dark:[&[aria-current]]:text-white',
  langBtn: 'px-2.5 py-2 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 aria-pressed:text-gray-900 aria-pressed:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 dark:aria-pressed:bg-gray-700 dark:aria-pressed:text-white',
  // customize/dark-mode "theme-toggle"
  themeBtn: 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5',
  // components/buttons "Default" → Purple (Landwind "Download") / "Alternative"
  btn: 'inline-flex items-center justify-center gap-2 text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none dark:focus:ring-purple-800 disabled:cursor-not-allowed disabled:opacity-50',
  btnAlt: 'inline-flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-purple-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
  btnOn: 'aria-pressed:text-white aria-pressed:bg-purple-700 aria-pressed:border-purple-700 aria-pressed:hover:bg-purple-800 aria-pressed:hover:text-white dark:aria-pressed:bg-purple-600 dark:aria-pressed:border-purple-600 dark:aria-pressed:text-white',
  // components/card
  card: 'bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',
  cardPad: 'block p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700',
  cardH: 'mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white',
  cardBtn: 'inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-purple-700 rounded-lg hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800',
  badge: 'bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300',
  // forms/input-field (+ "Validation" aria-invalid ile)
  label: 'block mb-2 text-sm font-medium text-gray-900 dark:text-white',
  input: 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500',
  textarea: 'block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500',
  invalid: 'aria-[invalid=true]:bg-red-50 aria-[invalid=true]:border-red-500 aria-[invalid=true]:text-red-900 aria-[invalid=true]:focus:ring-red-500 aria-[invalid=true]:focus:border-red-500 dark:aria-[invalid=true]:bg-gray-700 dark:aria-[invalid=true]:border-red-500 dark:aria-[invalid=true]:text-red-400',
  // forms/range "Default range"
  range: 'w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700',
  // forms/radio "Bordered" (girdi etiketin içinde)
  radioB: 'flex items-center ps-4 border border-gray-200 rounded cursor-pointer bg-white dark:bg-gray-800 dark:border-gray-700',
  radioBIn: 'w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
  radioBTx: 'w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300',
  // forms/radio "Advanced layout" (peer-checked → has-[:checked], girdi etiketin içinde ve sr-only: klavyeyle seçilebilsin)
  radioA: 'inline-flex items-center gap-3 w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:has-[:checked]:text-purple-300 dark:has-[:checked]:border-purple-400 has-[:checked]:border-purple-600 has-[:checked]:text-purple-700 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-purple-300 dark:has-[:focus-visible]:ring-purple-800 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
  // forms/checkbox
  check: 'w-4 h-4 shrink-0 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600',
  // components/tabs "Tabs with underline" (etkin: aria-selected)
  tabsWrap: 'text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700',
  tab: 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 aria-selected:text-purple-600 aria-selected:border-purple-600 dark:aria-selected:text-purple-400 dark:aria-selected:border-purple-400',
  // components/tabs "Pills tabs" (etkin: aria-checked)
  pill: 'inline-block px-4 py-3 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white aria-checked:text-white aria-checked:bg-purple-600 aria-checked:hover:bg-purple-600 aria-checked:hover:text-white',
  // components/list-group "Default list group"
  list: 'text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white',
  hoursRow: 'text-gray-700 dark:text-gray-300 [&.is-today]:font-semibold [&.is-today]:text-gray-900 [&.is-today]:bg-gray-100 dark:[&.is-today]:bg-gray-600 dark:[&.is-today]:text-white',
  hoursTh: 'px-4 py-2 text-left font-medium border-b border-gray-200 dark:border-gray-600',
  hoursTd: 'px-4 py-2 text-right border-b border-gray-200 dark:border-gray-600',
  // components/modal "Default modal" (koyu gövde metni gray-400 → 300: gray-700 zeminde kontrast)
  modal: 'm-auto w-[calc(100%-2rem)] max-w-2xl p-0 bg-transparent backdrop:bg-gray-900/50 dark:backdrop:bg-gray-900/80',
  modalBox: 'relative bg-white rounded-lg shadow dark:bg-gray-700 p-4 md:p-5',
  modalHead: 'flex items-center justify-between gap-4 pb-4 border-b rounded-t md:pb-5 dark:border-gray-600',
  modalTitle: 'text-xl font-semibold text-gray-900 dark:text-white',
  modalClose: 'text-gray-500 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex shrink-0 justify-center items-center dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white',
  btn2: 'inline-flex items-center justify-center gap-2 py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-purple-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700',
  // components/stepper "Default stepper" (etkin / tamamlanan: purple)
  stepLi: 'group flex items-center [&.is-current]:text-purple-600 [&.is-done]:text-purple-600 dark:[&.is-current]:text-purple-400 dark:[&.is-done]:text-purple-400',
  stepLine: "md:w-full sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700",
  // Landwind footer
  fH: 'mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white',
  fUl: 'text-gray-500 dark:text-gray-400',
  fSocial: 'text-gray-500 hover:text-gray-900 dark:hover:text-white dark:text-gray-400',
};
C.cfLabel = C.label; C.cfInput = C.input; C.cfInvalid = C.invalid;

/* ---------- Simgeler ---------- */
const svgNorm = (s) => s.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/> </g, '><').trim();
function setClass(svg, cls, ek) {
  svg = svg.replace(/^<svg([^>]*?)\s(class|id)="[^"]*"/, '<svg$1').replace(/^<svg([^>]*?)\s(class|id)="[^"]*"/, '<svg$1');
  svg = svg.replace(/^<svg/, `<svg class="${cls}"${ek || ''}`);
  if (!/aria-hidden=/.test(svg.slice(0, svg.indexOf('>')))) svg = svg.replace(/^<svg/, '<svg aria-hidden="true"');
  return svg;
}
const ICONS = {};
for (const v of ['outline', 'solid']) {
  for (const grp of fs.readdirSync(path.join(FBI, v))) {
    for (const f of fs.readdirSync(path.join(FBI, v, grp))) ICONS[`${v}/${f.replace(/\.svg$/, '')}`] = path.join(FBI, v, grp, f);
  }
}
const LW = oku(path.join(__dirname, 'indirilen/landwind/index.html')).match(/<svg[\s\S]*?<\/svg>/g);
const FBCACHE = {};
function kaynakSvg(spec, v) {
  if (spec.startsWith('lw:')) { const s = LW[Number(spec.slice(3)) - 1]; if (!s) throw new Error('landwind svg yok: ' + spec); return s; }
  if (spec.startsWith('fb:')) {
    const [, dosya, sira] = spec.split(':');
    if (!FBCACHE[dosya]) FBCACHE[dosya] = oku(path.join(__dirname, 'bilesenler', dosya + '.html')).match(/<svg[\s\S]*?<\/svg>/g) || [];
    const s = FBCACHE[dosya][Number(sira) - 1]; if (!s) throw new Error('flowbite belge svg yok: ' + spec); return s;
  }
  const f = ICONS[`${v || 'outline'}/${spec}`];
  if (!f) throw new Error('Flowbite simgesi yok: ' + (v || 'outline') + '/' + spec);
  return oku(f);
}
function simgeler(html) {
  return html.replace(/<svg data-icon="([^"]+)"([^>]*)><\/svg>/g, (m, spec, rest) => {
    const cls = (rest.match(/class="([^"]*)"/) || [])[1] || '';
    const v = (rest.match(/data-v="([^"]*)"/) || [])[1];
    const ek = rest.replace(/\s*class="[^"]*"/, '').replace(/\s*data-v="[^"]*"/, '');
    return setClass(svgNorm(kaynakSvg(spec, v)), cls, ek);
  });
}

// Özgün footer'daki Asteria Soft imzası (SVG), sınıflar tw.css'te
const ASTERIA = oku(path.join(OZGUN, 'index.html')).match(/<svg class="asteria-logo"[\s\S]*?<\/svg>/)[0];

function tokenlar(html, yer) {
  html = html.replace(/\{\{c:(\w+)\}\}/g, (m, k) => { if (!(k in C)) throw new Error('sınıf tokenı yok: ' + k); return C[k]; });
  html = html.replace(/\{\{asteria\}\}/g, ASTERIA);
  if (yer) {
    html = html.replace(/\{\{r\}\}/g, yer.r).replace(/\{\{h\}\}/g, yer.h).replace(/\{\{blog\}\}/g, yer.blog)
      .replace(/\{\{blogCurrent\}\}/g, yer.blogCurrent || '');
    // Alt sayfalarda sayfa içi bağlantılar ana sayfaya gider
    if (yer.r) html = html.replace(/href="#(randevu|araclar|tarifler|program|blog|iletisim|uzmanlar|sss|ucretler|hizmetler|top)"/g, `href="${yer.h}#$1"`).replace(/href="kvkk\.html"/g, `href="${yer.r}kvkk.html"`);
  }
  html = simgeler(html);
  const kalan = html.match(/\{\{[^}]+\}\}/);
  if (kalan) throw new Error('doldurulmamış yer tutucu: ' + kalan[0]);
  return html;
}

/* ---------- 0.2 adres dönüşümü ---------- */
const adresler = (s) => s.replace(/asteria-web\/diyetisyen-animasyon-v2/g, `50-website/template${N}`).replace(/diyetisyen-animasyon-v2/g, `template${N}`);

/* ---------- <head>: sinematik katman ve Google Fonts kaldırılır (Landwind özel font yüklemez), Tailwind + Flowbite 1.4.7 bağlanır ---------- */
function head(src, anaSayfa) {
  let h = src.slice(0, src.indexOf('<body'));
  h = h.replace(/\s*<link rel="preload" as="image" href="assets\/img\/hero-gezegen-ilk\.jpg"[^>]*>/, '');
  h = h.replace(/\s*<link rel="preconnect" href="https:\/\/fonts\.(googleapis|gstatic)\.com"[^>]*>/g, '');
  h = h.replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/[^"]*">/g, '');
  h = h.replace(/assets\/css\/site\.css/, 'assets/css/tw.css');
  h = h.replace(/\s*<link rel="stylesheet" href="(\.\.?\/)?assets\/css\/(premium|motion)\.css">/g, '');
  h = h.replace(/\s*<!-- Sinematik katman[^>]*-->/g, '');
  h = h.replace(/\s*<script src="(\.\.?\/)?assets\/(vendor\/(gsap|ScrollTrigger|Flip|SplitText|CustomEase|lenis)\.min|js\/motion)\.js" defer><\/script>/g, '');
  // Flowbite 1.4.7 (Landwind'in kullandığı sürüm) + Mizan köprüsü, sitenin kendi betiklerinden sonra
  h = h.replace(/(\n(\s*)<script src="((?:\.\.?\/)?)assets\/js\/chat\.js" defer><\/script>)/,
    '$1\n$2<script src="$3assets/vendor/flowbite/flowbite.js" defer></script>\n$2<script src="$3assets/js/flowbite-baglanti.js" defer></script>');
  h = h.replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#ffffff">');
  if (anaSayfa) {
    const t = `Diyetisyen web sitesi · Template ${N} (Landwind)`;
    const d = 'Landwind açılış sayfası düzeninde (Tailwind CSS + Flowbite) kurulmuş bir diyetisyen sitesi. Online randevu, hesaplama araçları, tarifler ve blog aynen çalışır.';
    h = h.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${t}"`).replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${t}"`);
    h = h.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${d}"`).replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${d}"`);
  }
  if (/sinematik|gsap|lenis|motion\.js|premium\.css|site\.css|fonts\.googleapis\.com\/css/i.test(h)) throw new Error('head temizlenmedi');
  if (!/flowbite\.js/.test(h)) throw new Error('flowbite betiği eklenmedi');
  return h;
}

/* ---------- Özgün içerik ---------- */
const ozgunIndex = adresler(oku(path.join(OZGUN, 'index.html')));
const ozgunBlog = adresler(oku(path.join(OZGUN, 'blog/index.html')));
const CFG = (() => { const ctx = { window: {} }; vm.runInNewContext(oku(path.join(OZGUN, 'assets/js/config.js')), ctx); return ctx.window.MIZAN_CONFIG; })();
// data-i18n anahtarı → Türkçe metin (özgün index.html)
const TR = {};
for (const m of ozgunIndex.matchAll(/data-i18n="([\w.]+)"[^>]*>([^<]*)</g)) if (!(m[1] in TR)) TR[m[1]] = m[2];
const tr = (k) => { if (!(k in TR)) throw new Error('özgünde anahtar yok: ' + k); return TR[k]; };
const sp = (k, cls) => `<span${cls ? ` class="${cls}"` : ''} data-i18n="${k}">${tr(k)}</span>`;

// S4 · Landwind onay listesi: başlık + tek satırlık açıklama (hizmetin etiketleri) + sonda o hizmete bağlantı
function hizmetler() {
  const re = /<article class="service[^"]*"[^>]*>\s*<a href="#randevu" (data-book-[a-z]+="[^"]+")>([\s\S]*?)<\/a>\s*<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[2];
    const h3 = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const tags = [...ic.matchAll(/<li( data-i18n="[^"]+")?>([^<]*)<\/li>/g)].map((t) => `<span${t[1] || ''}>${t[2]}</span>`);
    out.push(`              <li class="flex space-x-3">
                <svg data-icon="lw:11" class="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"></svg>
                <span class="flex-1 min-w-0">
                  <span class="block text-base font-medium leading-tight text-gray-900 dark:text-white" data-i18n="${h3[1]}">${h3[2]}</span>
                  <span class="block mt-1 text-sm font-light">${tags.join(' · ')}</span>
                </span>
                <a href="#randevu" ${m[1]} class="inline-flex items-center self-center text-sm font-medium text-purple-600 shrink-0 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300">${sp('services.bookShort')}<svg data-icon="lw:19" class="w-4 h-4 ml-1"></svg></a>
              </li>`);
  }
  if (out.length !== 6) throw new Error('hizmet sayısı ' + out.length);
  return out.join('\n');
}

// S6 · Landwind onay listesi: 4 adım (başlık · süre + açıklama)
function adimlar() {
  const re = /<li class="step"[^>]*><span class="node"[^>]*><\/span><span class="label" data-i18n="([^"]+)">([^<]*)<\/span><h3 data-i18n="([^"]+)">([^<]*)<\/h3><p data-i18n="([^"]+)">([^<]*)<\/p><\/li>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    out.push(`              <li class="flex space-x-3">
                <svg data-icon="lw:11" class="flex-shrink-0 w-5 h-5 text-purple-500 dark:text-purple-400"></svg>
                <span>
                  <span class="block text-base font-medium leading-tight text-gray-900 dark:text-white"><span data-i18n="${m[3]}">${m[4]}</span> <span class="font-light text-gray-500 dark:text-gray-400">· <span data-i18n="${m[1]}">${m[2]}</span></span></span>
                  <span class="block mt-1 text-sm font-light" data-i18n="${m[5]}">${m[6]}</span>
                </span>
              </li>`);
  }
  if (out.length !== 4) throw new Error('adım sayısı ' + out.length);
  return out.join('\n');
}

// S5 · components/gallery "Default gallery" (7 görsel, kare kırpma) + altyazı
function notlar() {
  const re = /<figure class="note[^"]*" data-note[^>]*>\s*<img src="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="(alt:[^"]+)">\s*<figcaption data-i18n="([^"]+)">([^<]*)<\/figcaption>\s*<\/figure>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    out.push(`          <figure>
            <img class="w-full h-auto rounded-lg aspect-square object-cover" src="${m[1]}" width="720" height="720" loading="lazy" decoding="async" alt="${m[2]}" data-i18n-attr="${m[3]}">
            <figcaption class="mt-2 text-sm text-center text-gray-500 dark:text-gray-400" data-i18n="${m[4]}">${m[5]}</figcaption>
          </figure>`);
  }
  if (out.length !== 7) throw new Error('not sayısı ' + out.length);
  return out.join('\n');
}

// S8 · components/card "Card with image"
function uzmanlar() {
  const re = /<article class="person"[^>]*>([\s\S]*?)<\/article>/g;
  const out = [];
  let m;
  while ((m = re.exec(ozgunIndex))) {
    const ic = m[1];
    const img = ic.match(/<img src="([^"]+)" srcset="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="([^"]+)"/);
    const badge = ic.match(/<span class="person-badge" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const area = ic.match(/<p class="label" data-i18n="([^"]+)">([^<]*)<\/p>/);
    const name = ic.match(/<h3 class="h3" data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const bio = ic.match(/<\/h3>\s*<p data-i18n="([^"]+)">([^<]*)<\/p>/);
    const facts = [...ic.matchAll(/<div><dt data-i18n="([^"]+)">([^<]*)<\/dt><dd data-i18n="([^"]+)">([^<]*)<\/dd><\/div>/g)];
    const btn = ic.match(/<a class="btn[^"]*" href="#randevu" (data-book-staff="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/);
    out.push(`          <article class="{{c:card}} flex flex-col">
            <div class="relative">
              <img class="rounded-t-lg w-full aspect-square object-cover object-top" src="${img[1]}" srcset="${img[2]}" sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" width="900" height="1125" loading="lazy" decoding="async" alt="${img[3]}" data-i18n-attr="${img[4]}">
${badge ? `              <span class="absolute top-4 left-4 {{c:badge}}" data-i18n="${badge[1]}">${badge[2]}</span>\n` : ''}            </div>
            <div class="flex flex-col flex-1 p-5">
              <p class="mb-1 text-sm font-medium text-purple-600 dark:text-purple-400" data-i18n="${area[1]}">${area[2]}</p>
              <h3 class="{{c:cardH}}" data-i18n="${name[1]}">${name[2]}</h3>
              <p class="mb-4 font-normal text-gray-700 dark:text-gray-400" data-i18n="${bio[1]}">${bio[2]}</p>
              <dl class="mb-5 {{c:list}}">
${facts.map((f, i) => `                <div class="flex justify-between gap-4 w-full px-4 py-2${i < facts.length - 1 ? ' border-b border-gray-200 dark:border-gray-600' : ''}"><dt class="font-normal text-gray-500 dark:text-gray-300" data-i18n="${f[1]}">${f[2]}</dt><dd class="text-right" data-i18n="${f[3]}">${f[4]}</dd></div>`).join('\n')}
              </dl>
              <a href="#randevu" ${btn[1]} class="mt-auto self-start {{c:cardBtn}}"><span data-i18n="${btn[2]}">${btn[3]}</span><svg data-icon="fb:card-image-example:1" class="rtl:rotate-180 w-3.5 h-3.5 ms-2"></svg></a>
            </div>
          </article>`);
  }
  if (out.length !== 3) throw new Error('uzman sayısı ' + out.length);
  return out.join('\n');
}

// S12 · Landwind "Pricing Card" × 3 — tür, süre ve ücret config.js'ten
const fiyatTR = (n) => n.toLocaleString('tr-TR');
const OZELLIK = {
  first: ['plan1.f1', 'plan1.f2', 'plan1.f3', 'plan1.f4'],
  control: ['plan2.f2', 'plan2.f3', 'plan1.f3', 'plan2.f5'],
  online: ['plan1.f3', 'plan1.f4', 'plan2.f3', 'plan2.f5'],
};
const onay = (k) => `                <li class="flex items-center space-x-3">
                  <svg data-icon="lw:26" class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"></svg>
                  ${sp(k)}
                </li>`;
function fiyatKartlari() {
  return ['first', 'control', 'online'].map((tip) => {
    const t = CFG.types[tip];
    const meta = tr(`type.${tip}Meta`);
    if (!meta.startsWith(t.minutes + ' dk')) throw new Error(`süre config ile uyuşmuyor: ${tip} ${meta}`);
    if (tr(`price.${tip}`) !== fiyatTR(t.price) + ' TL') throw new Error(`ücret config ile uyuşmuyor: ${tip}`);
    return `          <!-- Pricing Card -->
          <div class="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
            <h3 class="mb-4 text-2xl font-semibold" data-i18n="type.${tip}">${tr('type.' + tip)}</h3>
            <p class="font-light text-gray-500 sm:text-lg dark:text-gray-400" data-i18n="type.${tip}Desc">${tr(`type.${tip}Desc`)}</p>
            <div class="flex flex-wrap items-baseline justify-center my-8">
              <span class="mr-2 text-5xl font-extrabold" data-i18n="price.n.${tip}">${fiyatTR(t.price)}</span>
              <span class="text-gray-500 dark:text-gray-400">TL / <span data-i18n="type.${tip}Meta">${meta}</span></span>
            </div>
            <!-- List -->
            <ul role="list" class="mb-8 space-y-4 text-left">
${OZELLIK[tip].map(onay).join('\n')}
            </ul>
            <a href="#randevu" data-book-type="${tip}" class="mt-auto text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-purple-900" data-i18n="services.book">${tr('services.book')}</a>
          </div>`;
  }).join('\n');
}
// Paketler (özgün "Aylık takip" ve "3 aylık program" kartları), aynı kart tokenları
function paketler() {
  return [2, 3].map((n) => {
    const art = ozgunIndex.match(new RegExp(`<article class="plan[^"]*"[^>]*>\\s*<div class="plan-top"><p class="label" data-i18n="plan${n}\\.label">[\\s\\S]*?<\\/article>`))[0];
    const price = art.match(/<p class="price">([\s\S]*?)<\/p>/)[1].replace(/<small>/, '<span class="text-gray-500 dark:text-gray-400">').replace(/<small data-i18n="([^"]+)">/, '<span class="text-gray-500 dark:text-gray-400" data-i18n="$1">').replace(/<\/small>/, '</span>').replace(/<span data-i18n="(price\.p\d)">/, '<span class="mr-2 text-4xl font-extrabold" data-i18n="$1">');
    const feats = [...art.matchAll(/data-i18n="(plan\d\.f\d)"/g)].map((x) => x[1]);
    const btn = art.match(/<a class="btn[^"]*" href="#randevu" (data-book-type="[^"]+") data-i18n="([^"]+)">([^<]*)<\/a>/);
    return `            <div class="flex flex-col p-6 text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
              <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h4 class="text-2xl font-semibold" data-i18n="plan${n}.label">${tr(`plan${n}.label`)}</h4>
                <p class="flex items-baseline">${price.trim()}</p>
              </div>
              <p class="mt-2 font-light text-gray-500 sm:text-lg dark:text-gray-400" data-i18n="plan${n}.sub">${tr(`plan${n}.sub`)}</p>
              <ul role="list" class="grid gap-4 my-8 text-left sm:grid-cols-2">
${feats.map(onay).join('\n')}
              </ul>
              <a href="#randevu" ${btn[1]} class="mt-auto self-start text-white bg-purple-600 hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-purple-900" data-i18n="${btn[2]}">${btn[3]}</a>
            </div>`;
  }).join('\n');
}
function dahil(evet) {
  const keys = [...ozgunIndex.matchAll(new RegExp(`data-i18n="(incl\\.${evet ? 'y' : 'n'}\\d)"`, 'g'))].map((x) => x[1]);
  return keys.map((k) => evet ? onay(k) : `                <li class="flex items-center space-x-3">
                  <svg data-icon="minus" class="flex-shrink-0 w-5 h-5 text-gray-400 dark:text-gray-500"></svg>
                  ${sp(k)}
                </li>`).join('\n');
}

// S15 · Landwind SSS accordion (Flowbite data-accordion); her soru .faq sarmalayıcısında (FAQPage JSON-LD'yi site.js üretir)
function sssHtml() {
  const re = /<details class="faq"[^>]*>\s*<summary><h3 data-i18n="(faq\.q\d+)">([\s\S]*?)<\/h3>[\s\S]*?<p data-i18n="(faq\.a\d+)">([\s\S]*?)<\/p><\/div>\s*<\/details>/g;
  const out = [];
  let m, i = 0;
  while ((m = re.exec(ozgunIndex))) {
    i++;
    const acik = i === 1;
    const renk = acik ? 'text-gray-900 bg-white dark:bg-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400';
    out.push(`            <div class="faq">
              <h3 id="accordion-flush-heading-${i}">
                <button type="button" class="flex items-center justify-between w-full py-5 font-medium text-left ${renk} border-b border-gray-200 dark:border-gray-700" data-accordion-target="#accordion-flush-body-${i}" aria-expanded="${acik}" aria-controls="accordion-flush-body-${i}">
                  <span data-i18n="${m[1]}">${m[2]}</span>
                  <svg data-icon="lw:${acik ? 41 : 42}" data-accordion-icon="" class="w-6 h-6 ${acik ? 'rotate-180 ' : ''}shrink-0"></svg>
                </button>
              </h3>
              <div id="accordion-flush-body-${i}" class="faq-a${acik ? '' : ' hidden'}" aria-labelledby="accordion-flush-heading-${i}">
                <div class="py-5 border-b border-gray-200 dark:border-gray-700">
                  <p class="mb-2 text-gray-500 dark:text-gray-400" data-i18n="${m[3]}">${m[4]}</p>
                </div>
              </div>
            </div>`);
  }
  if (out.length !== 10) throw new Error('SSS sayısı ' + out.length);
  return out.join('\n');
}

// Blog: components/card "Card with image"
const YAZAR = {};
for (const f of fs.readdirSync(path.join(OZGUN, 'blog')).filter((x) => x.endsWith('.html') && x !== 'index.html')) {
  const s = oku(path.join(OZGUN, 'blog', f));
  const m = s.match(/<div class="byline">\s*<img src="\.\.\/([^"]+)"[^>]*>\s*<div><b>([\s\S]*?)<\/b>/);
  if (!m) throw new Error('byline yok: ' + f);
  YAZAR[f] = { img: m[1], ad: m[2] };
}
const OZETLER = {};
(function () {
  const re = /<article class="post-card"[^>]*>\s*<a href="([^"]+)">\s*<figure><img src="([^"]+)"[\s\S]*?<time datetime="([^"]+)"><span data-lang-block="tr">([^<]*)<\/span><span data-lang-block="en">([^<]*)<\/span><\/time>[\s\S]*?<p><span data-lang-block="tr">([\s\S]*?)<\/span><span data-lang-block="en">([\s\S]*?)<\/span><\/p>/g;
  let m;
  while ((m = re.exec(ozgunBlog))) OZETLER[m[1]] = { img: m[2].replace(/^\.\.\//, ''), dt: m[3], dtr: m[4], den: m[5], tr: m[6], en: m[7] };
})();
function blogKart({ href, img, alt, meta, title, hTag, ex, r }) {
  return `          <article class="{{c:card}} flex flex-col">
            <a href="${href}" tabindex="-1" aria-hidden="true"><img class="rounded-t-lg w-full aspect-[16/10] object-cover" src="${r}${img}" width="900" height="563" loading="lazy" decoding="async" ${alt}></a>
            <div class="flex flex-col flex-1 p-5">
              <p class="mb-2 post-meta">${meta}</p>
              <${hTag} class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"><a href="${href}" class="hover:underline">${title}</a></${hTag}>
              <p class="mb-4 font-normal text-gray-700 dark:text-gray-400">${ex}</p>
              <a href="${href}" class="mt-auto self-start {{c:cardBtn}}"><span data-i18n="blog.readMore">Devamını oku</span><svg data-icon="fb:card-image-example:1" class="rtl:rotate-180 w-3.5 h-3.5 ms-2"></svg></a>
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
    const img = ic.match(/<img src="([^"]+)"[^>]*alt="([^"]*)" data-i18n-attr="([^"]+)"/);
    const cat = ic.match(/<span class="cat" data-i18n="([^"]+)">([^<]*)<\/span>/);
    const read = ic.match(/<span data-i18n="(post\d\.read)">([^<]*)<\/span>/);
    const title = ic.match(/<h3 data-i18n="([^"]+)">([^<]*)<\/h3>/);
    const ex = ic.match(/<p data-i18n="(post\d\.excerpt)">([^<]*)<\/p>/);
    const dosya = m[1].replace(/^blog\//, '');
    const oz = OZETLER[dosya];
    const ozet = ex ? { key: ex[1], tr: ex[2] } : { key: `post${n}.excerpt`, tr: oz.tr };
    out.push(blogKart({
      href: m[1], hTag: 'h3', r: '', img: img[1], alt: `alt="${img[2]}" data-i18n-attr="${img[3]}"`,
      meta: `<span data-i18n="${cat[1]}">${cat[2]}</span><time datetime="${oz.dt}"><span data-lang-block="tr">${oz.dtr}</span><span data-lang-block="en">${oz.den}</span></time><span data-i18n="${read[1]}">${read[2]}</span>`,
      title: `<span data-i18n="${title[1]}">${title[2]}</span>`,
      ex: `<span data-i18n="${ozet.key}">${ozet.tr}</span>`,
    }));
  }
  if (out.length !== 6) throw new Error('blog kartı sayısı ' + out.length);
  return out.join('\n');
}

function anaSayfa() {
  let govde = oku(path.join(SAYFA, 'index.govde.html'));
  govde = govde.replace(/<!-- @parca (\w+) -->/g, (m, ad) => parca(ad));
  const doldur = { hizmetler, adimlar, notlar, uzmanlar, fiyatkartlari: fiyatKartlari, paketler, dahil: () => dahil(true), dahildegil: () => dahil(false), sss: sssHtml, blogkartlari: blogKartlari };
  govde = govde.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in doldur ? doldur[k]() : m));
  const yer = { r: '', h: '', blog: 'blog/' };
  const html = head(ozgunIndex, true) + tokenlar(govde, yer) + '\n</html>\n';
  fs.writeFileSync(path.join(HEDEF, 'index.html'), html);
}

/* ---------- Alt sayfalar (blog/*.html, kvkk.html): aynı header/footer, Landwind tipografisi ---------- */
// components/breadcrumb "Default breadcrumb"
function breadcrumbs(ol) {
  const lis = ol.match(/<li[\s\S]*?<\/li>/g);
  const items = lis.map((li, i) => {
    const ic = li.replace(/^<li[^>]*>/, '').replace(/<\/li>$/, '');
    const sep = '<svg data-icon="fb:default-breadcrumb-example:2" class="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"></svg>';
    if (/^<a /.test(ic)) {
      const a = ic.replace(/<a href/, '<a class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-purple-600 dark:text-gray-400 dark:hover:text-white" href');
      return `<li class="inline-flex items-center">${i ? `<div class="flex items-center">${sep}${a}</div>` : a.replace(/(<a [^>]*>)/, '$1<svg data-icon="fb:default-breadcrumb-example:1" class="w-3 h-3 me-2.5"></svg>')}</li>`;
    }
    return `<li aria-current="page"><div class="flex items-center">${sep}<span class="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">${ic}</span></div></li>`;
  });
  return `<ol class="inline-flex flex-wrap items-center gap-y-1 space-x-1 md:space-x-2 rtl:space-x-reverse">${items.join('')}</ol>`;
}
function postKart(article, hTag, r) {
  const href = article.match(/<a href="([^"]+)">/)[1];
  const img = article.match(/<img src="\.\.\/([^"]+)"[^>]*?(alt="[^"]*"(?: data-i18n-attr="[^"]*")?(?: data-alt-en="[^"]*")?)/);
  const meta = article.match(/<p class="post-meta">([\s\S]*?)<\/p>/)[1].replace(/<span class="cat">([\s\S]*?<\/span>)<\/span>/, '<span>$1</span>');
  const title = article.match(/<h([23])>([\s\S]*?)<\/h\1>/)[2];
  const ex = article.match(/<\/h[23]>\s*<p>([\s\S]*?)<\/p>/)[1];
  return blogKart({ href, hTag, r, img: img[1], alt: img[2], meta, title, ex });
}
function kartlar(html, hTag, r) {
  return html.replace(/<div class="posts-grid">([\s\S]*?)\n        <\/div>/, (m, ic) => {
    const arts = ic.match(/<article class="post-card"[\s\S]*?<\/article>/g);
    return '<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">\n' + arts.map((a) => postKart(a, hTag, r)).join('\n') + '\n        </div>';
  });
}

function altSayfa(rel) {
  const src = adresler(oku(path.join(OZGUN, rel)));
  const blogda = rel.startsWith('blog/');
  const yer = blogda ? { r: '../', h: '../index.html', blog: './', blogCurrent: ' aria-current="page"' } : { r: '', h: 'index.html', blog: 'blog/' };
  let body = src.slice(src.indexOf('<body'));

  body = body.replace(/<a class="skip-link"[\s\S]*?(?=\n  <main id="main">)/, parca('header').trim());
  body = body.replace(/\n    <footer class="panel site-footer">[\s\S]*?<\/footer>/, '');
  body = body.replace(/<\/main>/, '</main>\n\n' + parca('footer'));
  body = body.replace(/<aside class="floating-actions"[\s\S]*?<\/aside>\s*(<div class="toast" id="toast"[^>]*><\/div>)?/, parca('sohbet').trim() + '\n');
  body = body.replace(/<body>/, '<body class="bg-white dark:bg-gray-900">');

  body = body.replace(/ data-reveal(="[^"]*")?/g, '');
  body = body.replace(/<ol class="crumbs">([\s\S]*?)<\/ol>/, (m) => breadcrumbs(m));
  body = body.replace(/<nav (data-i18n-attr="aria-label:crumbs\.aria")/, '<nav class="flex mb-8" $1');
  // Landwind başlığı sabit: ilk bölüme üst boşluk (hero'daki pt-20 lg:pt-28 gibi)
  body = body.replace(/<(article|section) class="panel page-top"/, '<$1 class="bg-white dark:bg-gray-900"');
  body = body.replace(/ class="wrap"/, ' class="max-w-screen-xl px-4 pt-24 pb-8 mx-auto lg:pt-28 lg:pb-24 lg:px-6"');
  body = body.replace(/ class="wrap"/g, ` class="${C.wrap}"`);

  if (rel === 'blog/index.html') {
    body = body.replace(/<header class="sec-head sec-head--split">\s*<div class="sec-head">\s*<h1 class="h2" id="blog-title"([^>]*)>([\s\S]*?)<\/h1>\s*<\/div>\s*<p class="lede"([^>]*)>([\s\S]*?)<\/p>\s*<\/header>/,
      `<div class="${C.headC}">\n          <h1 id="blog-title" class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl dark:text-white"$1>$2</h1>\n          <p class="${C.lede}"$3>$4</p>\n        </div>`);
    body = kartlar(body, 'h2', '../');
  } else {
    body = body.replace(/(<table[\s\S]*?<\/table>)/g, '<div class="table-wrap">$1</div>');
    body = body.replace(/<h2 class="h3" data-i18n="article\.ctaTitle">/, '<h2 data-i18n="article.ctaTitle">');
    body = body.replace(/<a class="btn btn--primary" href="([^"]+)" data-i18n="article\.ctaBtn">/, '<a href="$1" data-i18n="article.ctaBtn">');
    body = body.replace(/<section class="panel panel--alt related"/, '<section class="related bg-gray-50 dark:bg-gray-800"');
    body = body.replace(/<header class="sec-head sec-head--split">\s*<h2 class="h2" id="related-title"([^>]*)>([\s\S]*?)<\/h2>\s*<a class="link-arrow" href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>\s*<\/header>/,
      `<div class="flex flex-wrap items-end justify-between gap-4 mb-8">\n          <h2 id="related-title" class="${C.h2} mb-0"$1>$2</h2>\n          <a class="${C.lwLink}" href="$3"><span$4>$5</span><svg data-icon="lw:19" class="w-5 h-5 ml-1"></svg></a>\n        </div>`);
    body = kartlar(body, 'h3', '../');
    // KVKK: özgün sayfa başlığı
    body = body.replace(/<header class="sec-head">\s*<p class="eyebrow-tag"([^>]*)>([\s\S]*?)<\/p>\s*<h1 class="h2"([^>]*)>([\s\S]*?)<\/h1>/, `<header class="article-head">\n          <p class="text-lg font-medium text-purple-600 dark:text-purple-400"$1>$2</p>\n          <h1 class="mt-3 mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl dark:text-white"$3>$4</h1>`);
  }
  const eski = body.match(/class="(panel[^"]*|sec-head[^"]*|h2|h3|eyebrow-tag|btn btn--[^"]*)"/);
  if (eski) console.warn('  uyarı: eski sınıf kaldı →', rel, eski[0]);
  const html = head(src, false) + tokenlar(body, yer);
  fs.writeFileSync(path.join(HEDEF, rel), html);
}

anaSayfa();
const alt = ['kvkk.html', ...fs.readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html')).map((f) => 'blog/' + f)];
alt.forEach(altSayfa);
console.log('kuruldu: index.html +', alt.length, 'alt sayfa');
