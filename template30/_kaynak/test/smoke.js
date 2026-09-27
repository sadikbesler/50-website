const { chromium } = require('playwright');
(async () => {
  const base = 'http://localhost:8801/50-website/template30/';
  const b = await chromium.launch();
  for (const rm of ['no-preference', 'reduce']) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
    for (const path of ['', 'blog/index.html', 'blog/protein-ihtiyaci.html', 'kvkk.html']) {
      const p = await ctx.newPage();
      const errs = [];
      p.on('pageerror', e => errs.push(String(e)));
      p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
      p.on('requestfailed', r => errs.push('reqfail: ' + r.url()));
      await p.goto(base + path, { waitUntil: 'load' });
      await p.waitForTimeout(1500);
      const info = await p.evaluate(() => ({
        aa: typeof window.autoAnimate,
        attached: Array.from(document.querySelectorAll('[data-aa]')).map(e => e.id || Object.keys(e.dataset).filter(k => k !== 'aa').join('/') || e.className),
        pos: Array.from(document.querySelectorAll('[data-slots],[data-recipes],[data-meals],[data-days],#chat-log,[data-result]')).map(e => getComputedStyle(e).position).join(',')
      }));
      console.log(rm, path || 'index', JSON.stringify(info), 'hatalar:', errs.length ? errs : 0);
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
})();
