// Hızlı sonuç görüntüsü: node test/ekran.js <yol> <genişlik> <light|dark> <çıktı-adı> [en]
const { chromium } = require('playwright');
const path = require('path');
const [yol = '', w = '1440', tema = 'light', ad = 'deneme', dil] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: +w, height: +w < 500 ? 844 : 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t, l]) => { try { localStorage.setItem('mizan-theme', t); if (l) localStorage.setItem('mizan-lang', l); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, [tema, dil]);
  const page = await ctx.newPage();
  const hata = [];
  page.on('console', (m) => { if (m.type() === 'error') hata.push(m.text()); });
  page.on('pageerror', (e) => hata.push(String(e)));
  await page.goto('http://localhost:8801/50-website/template9/' + yol, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(500);
  const f = path.resolve(__dirname, '../../_referans', ad + '.jpg');
  await page.screenshot({ path: f, fullPage: true, type: 'jpeg', quality: 70 });
  console.log(f, 'hata:', hata.length, hata.slice(0, 5).join(' | '), 'sw:', await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]));
  await br.close();
})();
