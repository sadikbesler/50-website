// axe color-contrast ayrıntısı: node test/kontrast.js <yol> <tema>
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
(async () => {
  const [yol = '', tema = 'light', lang = 'tr'] = process.argv.slice(2);
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(([t, l]) => { localStorage.setItem('mizan-theme', t); localStorage.setItem('mizan-lang', l); sessionStorage.setItem('mizan-demo-seen', '1'); }, [tema, lang]);
  const p = await ctx.newPage(); await p.goto('http://localhost:8801/50-website/template4/' + yol, { waitUntil: 'networkidle' });
  if (process.argv[5]) await p.evaluate(process.argv[5]);
  await p.evaluate(AXE);
  const r = await p.evaluate(async () => (await axe.run(document, { runOnly: ['color-contrast'] })).violations.flatMap((v) => v.nodes.map((n) => n.target.join(' ') + ' | ' + (n.any[0] && n.any[0].data ? JSON.stringify([n.any[0].data.fgColor, n.any[0].data.bgColor, n.any[0].data.contrastRatio]) : ''))));
  console.log(r.join('\n') || 'yok'); await b.close();
})();
