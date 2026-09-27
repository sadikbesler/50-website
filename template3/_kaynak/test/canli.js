// Canlı adres kontrolü: node test/canli.js
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const yol of ['', 'blog/', 'blog/insulin-direnci-beslenme.html', 'kvkk.html']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('mizan-theme', 'dark'); } catch (e) {} });
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', (e) => errs.push(String(e)));
    const r = await p.goto('https://sadikbesler.github.io/50-website/template3/' + yol, { waitUntil: 'networkidle' });
    out[yol || 'index'] = await p.evaluate(() => ({
      tema: document.documentElement.dataset.theme,
      kartBg: (document.querySelector('.card') && getComputedStyle(document.querySelector('.card')).backgroundColor) || null,
      outfit: [...document.fonts].some((f) => f.family.includes('Outfit') && f.status === 'loaded'),
      sonraki: (document.querySelector('[data-next-time]') || {}).textContent || null,
    }));
    out[yol || 'index'].http = r.status();
    out[yol || 'index'].hata = errs;
    await ctx.close();
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
