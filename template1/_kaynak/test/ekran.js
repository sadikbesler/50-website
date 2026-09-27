/* Hızlı ekran görüntüsü: node ekran.js <yol> <genişlik> <çıktı.jpg> [dark] [lang]
   Konsol hatalarını da yazar. */
const { chromium } = require('playwright');
const [,, rel, w, out, theme, lang] = process.argv;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +w < 600 ? 844 : 900 } });
  await ctx.addInitScript(([t, l]) => { try { localStorage.setItem('mizan-theme', t || 'light'); if (l) localStorage.setItem('mizan-lang', l); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, [theme, lang]);
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('http://localhost:8801/50-website/template1/' + rel, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await p.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach(i => { i.loading = 'eager'; }));
  await p.evaluate(() => Promise.all(Array.from(document.images).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); }))));
  await p.waitForTimeout(500);
  const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.body.scrollHeight]);
  await p.screenshot({ path: out, type: 'jpeg', quality: 70, fullPage: true });
  console.log('hatalar:', errs.length ? errs.join(' | ') : 'yok', '| scrollWidth/innerWidth/height:', sw.join('/'));
  await b.close();
})();
