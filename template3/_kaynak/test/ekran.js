// Hızlı ekran görüntüsü: node test/ekran.js <yol> <çıktı.jpg> [genişlik] [dark|light] [lang] [selector]
const { chromium } = require('playwright');
(async () => {
  const [yol = '', out = '/tmp/x.jpg', w = '1440', tema = 'light', lang = 'tr', sel = ''] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t, l]) => {
    try { localStorage.setItem('mizan-theme', t); localStorage.setItem('mizan-lang', l); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {}
  }, [tema, lang]);
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto('http://localhost:8801/50-website/template3/' + yol, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(400);
  if (sel) await (await page.$(sel)).screenshot({ path: out, type: 'jpeg', quality: 70 });
  else await page.screenshot({ path: out, fullPage: true, type: 'jpeg', quality: 70 });
  const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  console.log('scroll/inner', sw, 'errors', errs);
  await browser.close();
})();
