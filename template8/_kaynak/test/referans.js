// AstroWind canlı demosunun referans görüntüleri → _referans/kaynak-*.jpg
// Çalıştır: node referans.js
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const DEMO = 'https://astrowind.vercel.app';
const REF = path.join(__dirname, '../../_referans');
const SAYFALAR = [
  ['/', 'ana'],
  ['/homes/personal', 'personal'],
  ['/pricing', 'pricing'],
  ['/about', 'about'],
  ['/contact', 'contact'],
  ['/blog', 'blog'],
  ['/get-started-website-with-astro-tailwind-css', 'makale'],
];

(async () => {
  fs.mkdirSync(REF, { recursive: true });
  const browser = await chromium.launch();
  const olcum = {};
  for (const [yol, ad] of SAYFALAR) {
    for (const w of [1440, 390]) {
      for (const tema of ['light', 'dark']) {
        const ctx = await browser.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
        await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch (e) {} }, tema);
        const page = await ctx.newPage();
        await page.goto(DEMO + yol, { waitUntil: 'networkidle', timeout: 60000 });
        // Kaydırarak tembel görselleri ve "intersect" animasyonlarını tetikle
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(800);
        const dosya = `kaynak-${ad}-${w}${tema === 'dark' ? '-dark' : ''}.jpg`;
        await page.screenshot({ path: path.join(REF, dosya), fullPage: true, type: 'jpeg', quality: 70 });
        if (w === 1440 && tema === 'light') {
          olcum[ad] = await page.evaluate(() => {
            const cs = (el, props) => { if (!el) return null; const s = getComputedStyle(el); return Object.fromEntries(props.map((p) => [p, s[p]])); };
            return {
              body: cs(document.body, ['fontFamily', 'fontSize', 'color', 'backgroundColor', 'letterSpacing']),
              h1: cs(document.querySelector('h1'), ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color']),
              h2: cs(document.querySelector('main h2'), ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color']),
              btnPrimary: cs(document.querySelector('.btn-primary'), ['backgroundColor', 'color', 'borderRadius', 'paddingTop', 'paddingLeft', 'fontSize', 'fontWeight']),
              header: cs(document.querySelector('#header > div:last-child'), ['paddingTop', 'maxWidth']),
              kart: cs(document.querySelector('.rounded-lg.shadow, .shadow-lg'), ['borderRadius', 'boxShadow', 'backgroundColor']),
            };
          });
        }
        console.log('kaydedildi', dosya);
        await ctx.close();
      }
    }
  }
  fs.writeFileSync(path.join(__dirname, 'kaynak-olcum.json'), JSON.stringify(olcum, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
