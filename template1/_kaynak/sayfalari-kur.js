/* Alt sayfaları Preline bloklarıyla yeniden kurar:
   - blog/index.html  → "Image Post Card Grid with Category Meta"
   - blog/<yazı>.html → "Centered Editorial Article Page with Sticky Share Bar" (paylaşım: yalnızca WhatsApp + bağlantıyı kopyala)
   - kvkk.html        → aynı makale bloğunun tipografisi
   İçerik (başlıklar, metinler, JSON-LD, meta) salt okunur kaynak siteden (diyetisyen-animasyon-v2) DOM ile okunur.
   Üst menü, footer ve sohbet parçaları template1/index.html'den alınır, bağlantılar alt sayfaya göre düzeltilir.
   Çalıştırma: cd _kaynak && node sayfalari-kur.js */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, '..', 'diyetisyen-animasyon-v2');
const POSTS = ['insulin-direnci-beslenme', 'aralikli-oruc-16-8', 'gunluk-su-ihtiyaci', 'akdeniz-tipi-beslenme', 'protein-ihtiyaci', 'etiket-okuma-rehberi'];

const read = f => fs.readFileSync(f, 'utf8').replace(/asteria-web\/diyetisyen-animasyon-v2/g, '50-website/template1').replace(/diyetisyen-animasyon-v2/g, 'template1');
const index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const between = (s, a, b) => { const i = s.indexOf(a); const j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('parça yok: ' + a); return s.slice(i, j + b.length); };

const PART = {
  skip: between(index, '<a class="sr-only focus:not-sr-only', '</a>'),
  header: between(index, '<!-- ========== S1 · HEADER', '<!-- ========== END HEADER ========== -->'),
  footer: between(index, '<!-- ========== S18 · FOOTER', '<!-- ========== END FOOTER ========== -->'),
  floating: between(index, '<!-- ========== S19 ·', '</aside>'),
  toast: '<div class="toast" id="toast" role="status" aria-live="polite"></div>'
};

/* Ana sayfa parçasındaki bağlantıları alt sayfaya göre çevirir. p: '../' (blog) ya da '' (kök) */
function relink(html, p, blogIndexHref, isBlog) {
  return html
    .replace(/href="#top" data-i18n="footer\.top"/g, 'href="#main" data-i18n="footer.top"')
    .replace(/(<a class="p-2 flex items-center[^"]*" )href="#blog"/, (m, a) => a + 'href="' + blogIndexHref + '"' + (isBlog ? ' aria-current="true"' : ''))
    .replace(/href="#top"/g, 'href="' + p + 'index.html"')
    .replace(/href="#([a-z][^"]*)"/g, (m, id) => id === 'main' ? m : 'href="' + p + 'index.html#' + id + '"')
    .replace(/href="blog\/"/g, 'href="' + blogIndexHref + '"')
    .replace(/href="kvkk\.html"/g, 'href="' + p + 'kvkk.html"')
    .replace(/href="sitemap\.xml"/g, 'href="' + p + 'sitemap.xml"')
    .replace(/src="assets\//g, 'src="' + p + 'assets/');
}

/* Kaynak <head>: sinematik katman ve eski stiller çıkar, tw.css ve preline.js girer */
function head(srcHtml, p) {
  let h = srcHtml.slice(srcHtml.indexOf('<head>'), srcHtml.indexOf('</head>') + 7);
  h = h
    .replace(/\s*<link rel="preconnect"[^>]*>/g, '')
    .replace(/\s*<link rel="preload"[^>]*hero-gezegen[^>]*>/g, '')
    .replace(/\s*<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/g, '')
    .replace(/<link rel="stylesheet" href="([.\/]*)assets\/css\/site\.css">/, '<link rel="stylesheet" href="$1assets/css/tw.css">')
    .replace(/\s*<link rel="stylesheet" href="[.\/]*assets\/css\/(premium|motion)\.css">/g, '')
    .replace(/\s*<!-- Sinematik katman[^>]*-->/g, '')
    .replace(/\s*<script src="[.\/]*assets\/vendor\/[^"]*\.min\.js" defer><\/script>/g, '')
    .replace(/\s*<script src="[.\/]*assets\/js\/motion\.js" defer><\/script>/g, '')
    .replace(/(<script src="([.\/]*)assets\/js\/chat\.js" defer><\/script>)/, '$1\n  <script src="$2assets/vendor/preline/preline.js" defer></script>')
    .replace(/<meta name="theme-color" content="[^"]*">/, '<meta name="theme-color" content="#ffffff">');
  if (!/tw\.css/.test(h) || !/preline\.js/.test(h)) throw new Error('head dönüşümü eksik');
  return h;
}
const htmlTag = s => s.match(/<html[^>]*>/)[0];

const SVG = 'xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const SLASH = '<svg class="shrink-0 mx-2 size-5 text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M6 13L10 3" stroke="currentColor" stroke-linecap="round"/></svg>';
const WA = '<svg class="shrink-0 size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88a9.83 9.83 0 0 1 6.99 2.9 9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.9-11.9a11.82 11.82 0 0 0-3.49-8.4Z"/></svg>';

/* Preline breadcrumb ("slash separators") */
function crumbs(items) {
  const li = items.map((it, i) => i === items.length - 1
    ? '<li class="inline-flex items-center text-sm font-semibold text-foreground truncate" aria-current="page">' + it.html + '</li>'
    : '<li class="inline-flex items-center"><a class="flex items-center text-sm text-muted-foreground-1 hover:text-primary-focus focus:outline-hidden focus:text-primary-focus" href="' + it.href + '"' + (it.key ? ' data-i18n="' + it.key + '"' : '') + '>' + it.html + '</a>' + SLASH + '</li>').join('\n            ');
  return '<nav class="mb-6" data-i18n-attr="aria-label:crumbs.aria" aria-label="Sayfa yolu">\n          <ol class="flex items-center whitespace-nowrap overflow-hidden">\n            ' + li + '\n          </ol>\n        </nav>';
}

/* "Image Post Card Grid with Category Meta" kartı */
function card(c, p) {
  return `<a class="group flex flex-col bg-layer border border-layer-line shadow-2xs rounded-xl hover:shadow-md focus:outline-hidden focus:shadow-md transition" href="${c.href}">
            <div class="aspect-video w-full overflow-hidden rounded-t-xl">
              <img class="size-full object-cover" src="${c.src}" width="${c.w}" height="${c.h}" loading="lazy" decoding="async" alt="${c.alt}"${c.altEn ? ' data-alt-en="' + c.altEn + '"' : ''}>
            </div>
            <div class="p-4 md:p-5">
              <p class="mt-2 text-xs uppercase text-muted-foreground-2">${c.cat}${c.read ? ' · ' + c.read : ''}</p>
              <h${c.hl || 3} class="mt-2 text-lg font-medium text-foreground group-hover:text-primary-hover">${c.title}</h${c.hl || 3}>
            </div>
          </a>`;
}

function page(srcHtml, p, blogIndexHref, isBlog, mainHtml, extraBodyEnd) {
  return `<!DOCTYPE html>
${htmlTag(srcHtml)}
${head(srcHtml, p)}
<body>
  ${relink(PART.skip, p, blogIndexHref, isBlog)}

  ${relink(PART.header, p, blogIndexHref, isBlog)}

${mainHtml}

  ${relink(PART.footer, p, blogIndexHref, isBlog)}
${extraBodyEnd || ''}
  ${relink(PART.floating, p, blogIndexHref, isBlog)}

  ${PART.toast}
</body>
</html>
`;
}

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ javaScriptEnabled: false });
  const pg = await ctx.newPage();
  const dom = async (html, fn) => { await pg.setContent(html, { waitUntil: 'domcontentloaded' }); return pg.evaluate(fn); };

  /* ---------- Makaleler ---------- */
  for (const slug of POSTS) {
    const src = read(path.join(SRC, 'blog', slug + '.html'));
    const d = await dom(src, () => {
      const q = s => document.querySelector(s);
      const meta = q('.article-head .post-meta');
      const cover = q('.article-cover img');
      return {
        crumb: q('.crumbs li[aria-current]').innerHTML,
        cat: meta.querySelector('.cat').innerHTML,
        time: meta.querySelector('time').outerHTML,
        read: meta.lastElementChild.innerHTML,
        h1: q('#post-title').innerHTML,
        lede: q('.article-head .lede').innerHTML,
        byImg: q('.byline img').getAttribute('src'),
        byName: q('.byline b').innerHTML,
        byRole: q('.byline b + span').innerHTML,
        cover: { src: cover.getAttribute('src'), srcset: cover.getAttribute('srcset'), sizes: cover.getAttribute('sizes'), w: cover.getAttribute('width'), h: cover.getAttribute('height'), alt: cover.getAttribute('alt'), altEn: cover.getAttribute('data-alt-en') },
        tr: q('.prose[data-lang-block="tr"]').innerHTML,
        en: q('.prose[data-lang-block="en"]').innerHTML,
        sources: q('.prose.sources').innerHTML,
        related: Array.from(document.querySelectorAll('.related .post-card a')).map(a => {
          const img = a.querySelector('img');
          return { href: a.getAttribute('href'), src: img.getAttribute('src'), w: img.getAttribute('width'), h: img.getAttribute('height'), alt: img.getAttribute('alt'), altEn: img.getAttribute('data-alt-en'), cat: a.querySelector('.cat').innerHTML, title: a.querySelector('h3').innerHTML };
        })
      };
    });
    const main = `  <main id="main">
    <div>
      <!-- Blog Article: Preline "Centered Editorial Article Page with Sticky Share Bar" (FREE) -->
      <article class="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto" aria-labelledby="post-title">
        <div class="max-w-2xl">
        ${crumbs([{ href: '../index.html', key: 'crumbs.home', html: 'Ana sayfa' }, { href: './', key: 'nav.blog', html: 'Blog' }, { html: d.crumb }])}
          <!-- Avatar Media -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
              <div class="shrink-0">
                <img class="size-12 rounded-full object-cover" src="${d.byImg}" width="48" height="48" alt="">
              </div>
              <div class="grow">
                <div class="flex justify-between items-center gap-x-2">
                  <div>
                    <span class="sm:mb-1 block text-start font-semibold text-foreground">${d.byName}</span>
                    <ul class="text-xs text-muted-foreground-1">
                      <li class="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:inset-e-2 before:-translate-y-1/2 before:size-1 before:bg-surface-2 before:rounded-full">${d.byRole}</li>
                      <li class="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:inset-e-2 before:-translate-y-1/2 before:size-1 before:bg-surface-2 before:rounded-full">${d.time}</li>
                      <li class="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:inset-e-2 before:-translate-y-1/2 before:size-1 before:bg-surface-2 before:rounded-full">${d.read}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- End Avatar Media -->
          <!-- Content -->
          <div class="space-y-5 md:space-y-8">
            <div class="space-y-3">
              <h1 id="post-title" class="text-2xl font-bold md:text-3xl text-foreground">${d.h1}</h1>
              <p class="text-lg text-foreground">${d.lede}</p>
            </div>
            <figure>
              <img class="w-full object-cover rounded-xl" src="${d.cover.src}" srcset="${d.cover.srcset}" sizes="(min-width: 672px) 672px, 100vw" width="${d.cover.w}" height="${d.cover.h}" fetchpriority="high" decoding="async" alt="${d.cover.alt}" data-alt-en="${d.cover.altEn}">
            </figure>
            <div class="prose-preline" data-lang-block="tr" lang="tr">${d.tr}</div>
            <div class="prose-preline" data-lang-block="en" lang="en">${d.en}</div>
            <div class="prose-preline sources">${d.sources}</div>
            <aside class="flex flex-col gap-y-3 bg-card border border-card-line rounded-xl p-5 md:p-6">
              <h2 class="text-lg font-semibold text-foreground" data-i18n="article.ctaTitle">Size özel bir plan ister misiniz?</h2>
              <p class="text-foreground" data-i18n="article.ctaText">Bu yazıdaki öneriler geneldir. Kendi tahlillerinize ve günlük düzeninize göre bir plan için randevu alabilirsiniz.</p>
              <p><a class="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus" href="../index.html#randevu" data-i18n="article.ctaBtn">Randevu al</a></p>
            </aside>
            <div>
              <a class="m-1 inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-surface text-foreground hover:bg-surface-1 focus:outline-hidden focus:bg-surface-1" href="./">${d.cat}</a>
            </div>
          </div>
          <!-- End Content -->
        </div>
      </article>
      <!-- Sticky Share Group: yalnızca WhatsApp ve bağlantıyı kopyala -->
      <div class="sticky bottom-6 inset-x-0 z-30 text-center pointer-events-none">
        <div class="pointer-events-auto inline-block bg-layer shadow-md rounded-full py-3 px-4" role="group" data-i18n-attr="aria-label:share.aria" aria-label="Paylaş">
          <div class="flex items-center gap-x-1.5">
            <a class="flex items-center gap-x-2 text-sm text-muted-foreground-1 hover:text-foreground focus:outline-hidden focus:text-foreground" href="https://wa.me/" target="_blank" rel="noopener noreferrer" data-share-wa>
              ${WA}
              <span class="sr-only sm:not-sr-only" data-i18n="share.wa">WhatsApp</span>
            </a>
            <div class="block h-3 border-e border-line-3 mx-3"></div>
            <button type="button" class="flex items-center gap-x-2 text-sm text-muted-foreground-1 hover:text-foreground focus:outline-hidden focus:text-foreground" data-copy-link>
              <svg class="shrink-0 size-4" ${SVG}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              <span class="sr-only sm:not-sr-only" data-i18n="share.copy">Bağlantıyı kopyala</span>
            </button>
          </div>
        </div>
      </div>
      <!-- End Sticky Share Group -->
    </div>

    <!-- Diğer yazılar: "Image Post Card Grid with Category Meta" -->
    <section class="bg-background-1" aria-labelledby="related-title">
      <div class="max-w-340 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div class="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
          <h2 id="related-title" class="text-2xl font-bold md:text-4xl md:leading-tight text-foreground" data-i18n="article.related">Diğer yazılar</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 lg:mb-14">
          ${d.related.map(c => card(c, '../')).join('\n          ')}
        </div>
        <div class="text-center">
          <div class="inline-block bg-layer border border-layer-line shadow-2xs rounded-full">
            <div class="py-3 px-4 flex items-center gap-x-2">
              <p class="text-muted-foreground-2" data-i18n="blog.more">Daha fazlasını mı arıyorsunuz?</p>
              <a class="inline-flex items-center gap-x-1.5 text-primary decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="./">
                <span data-i18n="article.back">Tüm yazılar</span>
                <svg class="shrink-0 size-4" ${SVG}><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>`;
    fs.writeFileSync(path.join(ROOT, 'blog', slug + '.html'), page(src, '../', './', true, main));
    console.log('makale', slug, d.related.length, 'ilgili yazı');
  }

  /* ---------- Blog listesi ---------- */
  {
    const src = read(path.join(SRC, 'blog', 'index.html'));
    const d = await dom(src, () => Array.from(document.querySelectorAll('.posts-grid .post-card a')).map(a => {
      const img = a.querySelector('img');
      const meta = a.querySelector('.post-meta');
      return { href: a.getAttribute('href'), src: img.getAttribute('src'), w: img.getAttribute('width'), h: img.getAttribute('height'), alt: img.getAttribute('alt'), altEn: img.getAttribute('data-alt-en'), cat: meta.querySelector('.cat').innerHTML, read: meta.lastElementChild.innerHTML, title: a.querySelector('h2').innerHTML, hl: 2 };
    }));
    const main = `  <main id="main">
    <!-- Card Blog: Preline "Image Post Card Grid with Category Meta" (FREE) -->
    <section class="max-w-340 px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto" aria-labelledby="blog-title">
      ${crumbs([{ href: '../index.html', key: 'crumbs.home', html: 'Ana sayfa' }, { html: '<span data-i18n="nav.blog">Blog</span>' }])}
      <div class="max-w-2xl text-center mx-auto mb-10 lg:mb-14">
        <h1 id="blog-title" class="text-2xl font-bold md:text-4xl md:leading-tight text-foreground" data-i18n="blogpage.title">Beslenme yazıları</h1>
        <p class="mt-1 text-muted-foreground-2" data-i18n="blogpage.lede">Danışanlarımızın en sık sorduğu konuları, güncel bilimsel kaynaklara dayanarak diyetisyenlerimiz yazıyor ve kontrol ediyor.</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 lg:mb-14">
        ${d.map(c => card(c, '../')).join('\n        ')}
      </div>
      <div class="text-center">
        <div class="inline-block bg-layer border border-layer-line shadow-2xs rounded-full">
          <div class="py-3 px-4 flex items-center gap-x-2">
            <p class="text-muted-foreground-2" data-i18n="article.ctaTitle">Size özel bir plan ister misiniz?</p>
            <a class="inline-flex items-center gap-x-1.5 text-primary decoration-2 hover:underline focus:outline-hidden focus:underline font-medium" href="../index.html#randevu">
              <span data-i18n="article.ctaBtn">Randevu al</span>
              <svg class="shrink-0 size-4" ${SVG}><path d="m9 18 6-6-6-6"/></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>`;
    fs.writeFileSync(path.join(ROOT, 'blog', 'index.html'), page(src, '../', './', true, main));
    console.log('blog listesi', d.length, 'kart');
  }

  /* ---------- KVKK ---------- */
  {
    const src = read(path.join(SRC, 'kvkk.html'));
    const d = await dom(src, () => {
      const q = s => document.querySelector(s);
      return { label: q('.article-head .label').innerHTML, h1: q('#kvkk-title').innerHTML, lede: q('.article-head .lede').innerHTML, tr: q('.prose[data-lang-block="tr"]').innerHTML, en: q('.prose[data-lang-block="en"]').innerHTML };
    });
    const main = `  <main id="main">
    <!-- Makale bloğunun tipografisi: Preline "Centered Editorial Article Page" -->
    <article class="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto" aria-labelledby="kvkk-title">
      <div class="max-w-2xl">
      ${crumbs([{ href: 'index.html', key: 'crumbs.home', html: 'Ana sayfa' }, { html: 'KVKK' }])}
        <div class="space-y-5 md:space-y-8">
          <div class="space-y-3">
            <p class="text-xs uppercase text-muted-foreground-2">${d.label}</p>
            <h1 id="kvkk-title" class="text-2xl font-bold md:text-3xl text-foreground">${d.h1}</h1>
            <p class="text-lg text-foreground">${d.lede}</p>
          </div>
          <div class="prose-preline" data-lang-block="tr" lang="tr">${d.tr}</div>
          <div class="prose-preline" data-lang-block="en" lang="en">${d.en}</div>
        </div>
      </div>
    </article>
  </main>`;
    fs.writeFileSync(path.join(ROOT, 'kvkk.html'), page(src, '', 'blog/', false, main));
    console.log('kvkk');
  }
  await b.close();
})();
