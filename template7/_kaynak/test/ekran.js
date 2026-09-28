// Sonuç görüntüleri: node test/ekran.js [1440|390] [light|dark] [seçici=ad …]
// Argümansız: tam sayfa 1440/390 × açık/koyu + blok başına sonuc-<kategori>-<harf>(-dark).jpg
const { chromium } = require('playwright');
const path = require('path');
const URL = 'http://localhost:8801/50-website/template7/';
const REF = path.resolve(__dirname, '../../_referans');
const BOLUM = [
  ['#site-header', 'header-a'], ['#top', 'hero-a'], ['.facts', 'statistic-a'], ['#hizmetler', 'content-h'], ['.notes-panel', 'gallery-a'],
  ['#yaklasim', 'step-a'], ['#manifesto', 'testimonial-b'], ['#uzmanlar', 'team-b'], ['#araclar', 'pricing-a'], ['#program', 'feature-c'],
  ['#tarifler', 'blog-a'], ['#ucretler', 'pricing-b'], ['#randevu', 'contact-b'], ['#blog', 'blog-c'], ['#sss', 'feature-d'],
  ['.sky', 'cta-b'], ['#iletisim', 'contact-c'], ['.site-footer', 'footer-a'],
];
(async () => {
  const br = await chromium.launch();
  const tek = process.argv[2];
  for (const w of tek ? [+tek] : [1440, 390]) for (const tema of (process.argv[3] ? [process.argv[3]] : ['light', 'dark'])) {
    const ctx = await br.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 }, colorScheme: tema, deviceScaleFactor: 1 });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} });
    const page = await ctx.newPage();
    const hatalar = [];
    page.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
    page.on('pageerror', (e) => hatalar.push(String(e)));
    await page.goto(URL, { waitUntil: 'networkidle' });
    // tembel görseller yüklensin
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(600);
    const ek = tema === 'dark' ? '-dark' : '';
    await page.screenshot({ path: path.join(REF, `sonuc-${w}${ek}.jpg`), fullPage: true, type: 'jpeg', quality: 70 });
    if (w === 1440 || tek) {
      for (const [sel, ad] of BOLUM) {
        const el = page.locator(sel).first();
        await el.screenshot({ path: path.join(REF, `sonuc-${ad}${w === 390 ? '-390' : ''}${ek}.jpg`), type: 'jpeg', quality: 70 });
      }
    }
    console.log(w, tema, 'konsol hatası:', hatalar.length, hatalar.slice(0, 3).join(' | '));
    await ctx.close();
  }
  await br.close();
})();
