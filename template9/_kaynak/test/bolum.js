// Bölüm görüntüsü: node test/bolum.js <yol> <seçici,seçici…> <genişlik> <tema> [önek]
const { chromium } = require('playwright');
const path = require('path');
const [yol = '', secs = '#top', w = '1440', tema = 'light', onek = 'tmp'] = process.argv.slice(2);
(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext({ viewport: { width: +w, height: +w < 500 ? 844 : 900 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(([t]) => { try { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, [tema]);
  const page = await ctx.newPage();
  await page.goto('http://localhost:8801/50-website/template9/' + yol, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 20)); } window.scrollTo(0, 0); });
  let i = 0;
  for (const s of secs.split(',')) {
    const el = page.locator(s).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    const f = path.resolve(__dirname, '../../_referans', `${onek}-${i++}.jpg`);
    await el.screenshot({ path: f, type: 'jpeg', quality: 70 });
    console.log(s, '→', path.basename(f));
  }
  await br.close();
})();
