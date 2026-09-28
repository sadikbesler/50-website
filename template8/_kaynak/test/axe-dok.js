// axe kontrast ayrıntısı: node axe-dok.js <tema> [sohbet]
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
(async () => {
  const [, , tema = 'light', ek] = process.argv;
  const b = await chromium.launch(); const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript((t) => { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); }, tema);
  const p = await ctx.newPage(); await p.goto('http://localhost:8801/50-website/template8/', { waitUntil: 'networkidle' });
  if (ek) { await p.click('#chat-toggle'); await p.waitForSelector('[data-intent]'); }
  await p.evaluate(AXE);
  const r = await p.evaluate(async () => (await axe.run(document, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ') + ' | ' + n.any.map((a) => a.message).join(';').slice(0, 140))));
  console.log(r.join('\n')); await b.close();
})();
