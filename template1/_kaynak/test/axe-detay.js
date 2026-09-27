/* axe ayrıntı: node axe-detay.js <yol> [dark] — ciddi/kritik ihlallerin tüm düğümlerini yazar */
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const AXE = fs.readFileSync(path.resolve(__dirname, '../indirilen/axe/package/axe.min.js'), 'utf8');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(t => { try { localStorage.setItem('mizan-theme', t); } catch (e) {} }, process.argv[3] || 'light');
  const p = await ctx.newPage();
  await p.goto('http://localhost:8801/50-website/template1/' + (process.argv[2] || ''), { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
  await p.waitForTimeout(800);
  await p.evaluate(AXE);
  const r = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.filter(v => /serious|critical/.test(v.impact)).map(v => v.id + '\n  ' + v.nodes.map(n => n.target.join(' ') + ' :: ' + (n.any[0] ? n.any[0].message : '')).join('\n  ')));
  console.log(r.join('\n') || 'yok');
  await b.close();
})();
