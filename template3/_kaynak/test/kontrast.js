// axe color-contrast ayrıntısı: node test/kontrast.js [yol] [light|dark] [en]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
(async () => {
  const [yol = '', tema = 'light', lang = 'tr'] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(([t, l]) => { localStorage.setItem('mizan-theme', t); localStorage.setItem('mizan-lang', l); sessionStorage.setItem('mizan-demo-seen', '1'); }, [tema, lang]);
  const page = await ctx.newPage();
  await page.goto('http://localhost:8801/50-website/template3/' + yol, { waitUntil: 'networkidle' });
  await page.evaluate(AXE);
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['color-contrast'] });
    const out = [];
    res.violations.forEach((v) => v.nodes.forEach((n) => {
      const d = (n.any[0] || {}).data || {};
      out.push([n.target.join(' ').slice(-60), d.fgColor, d.bgColor, d.contrastRatio, d.expectedContrastRatio, (n.html || '').slice(0, 80)]);
    }));
    return out;
  });
  r.forEach((x) => console.log(x.join(' | ')));
  await browser.close();
})();
