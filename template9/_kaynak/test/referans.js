// AstroPaper demo referansları. README'deki demo (https://astro-paper.pages.dev) bu ağdan açılmadı (DNS engelli IP döndürüyor);
// demo bu depodan yayınlandığı için değiştirilmemiş depo _kaynak/indirilen/astro-paper-orijinal'de derlenip 8839'da sunuldu.
// Çıktı: _referans/kaynak-<sayfa>-<genişlik>(-dark).jpg (JPEG q70, genişlik ≤1440) + kaynak-olcum.json
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const REF = path.resolve(__dirname, '../../_referans');
const DEMO = process.env.DEMO || 'http://localhost:8839';
const SAYFALAR = [
  ['anasayfa', '/'],
  ['posts', '/posts/'],
  ['makale', '/posts/how-to-configure-astropaper-theme/'],
  ['tags', '/tags/'],
  ['etiket', '/tags/docs/'],
  ['archives', '/archives/'],
  ['search', '/search/?q=astro'],
  ['about', '/about/'],
];
(async () => {
  const br = await chromium.launch();
  const olcum = {};
  for (const w of [1440, 390]) for (const tema of ['light', 'dark']) {
    const ctx = await br.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1 });
    await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) {} }, tema);
    const page = await ctx.newPage();
    for (const [ad, yol] of SAYFALAR) {
      await page.goto(DEMO + yol, { waitUntil: 'networkidle' });
      await page.waitForTimeout(ad === 'search' ? 1500 : 400);
      const f = path.join(REF, `kaynak-${ad}-${w}${tema === 'dark' ? '-dark' : ''}.jpg`);
      await page.screenshot({ path: f, fullPage: true, type: 'jpeg', quality: 70 });
      if (w === 1440) {
        olcum[`${ad}-${tema}`] = await page.evaluate(() => {
          const cs = (el) => el ? getComputedStyle(el) : null;
          const pick = (sel) => { const e = document.querySelector(sel); const c = cs(e); return c && { font: c.fontFamily, size: c.fontSize, weight: c.fontWeight, color: c.color, lh: c.lineHeight, ls: c.letterSpacing, w: Math.round(e.getBoundingClientRect().width) }; };
          return {
            body: { bg: cs(document.body).backgroundColor, color: cs(document.body).color, font: cs(document.body).fontFamily, size: cs(document.body).fontSize, lh: cs(document.body).lineHeight },
            main: pick('#main-content'), h1: pick('main h1'), h2: pick('main h2'), cardLink: pick('main li a'), p: pick('main p'),
            header: pick('header a'), nav: pick('#menu-items a'), footer: pick('footer'), tag: pick('main ul li a[href*="/tags/"]'),
            searchInput: pick('.pagefind-ui__search-input'),
            vars: ['--background', '--foreground', '--accent', '--muted', '--muted-foreground', '--border'].map((v) => v + ':' + getComputedStyle(document.documentElement).getPropertyValue(v).trim()),
          };
        });
      }
      console.log('ok', path.basename(f));
    }
    await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, 'kaynak-olcum.json'), JSON.stringify(olcum, null, 1));
  await br.close();
})().catch((e) => { console.error(e); process.exit(1); });
