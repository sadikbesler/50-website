// Hızlı ekran görüntüsü: node test/ekran.js [genislik] [tema] [yol] [çıktı]
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const [w = '1440', tema = 'light', yol = '', ad = 'deneme'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +w < 500 ? 844 : 900 } });
  await ctx.addInitScript((t) => { try { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, tema);
  const p = await ctx.newPage();
  const hatalar = [];
  p.on('console', (m) => { if (m.type() === 'error') hatalar.push(m.text()); });
  p.on('pageerror', (e) => hatalar.push(String(e)));
  await p.goto('http://localhost:8801/50-website/template5/' + yol, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(400);
  await p.screenshot({ path: path.join(__dirname, '../../_referans', ad + '.jpg'), type: 'jpeg', quality: 70, fullPage: true });
  console.log('hatalar:', hatalar, 'sw:', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.body.scrollHeight]));
  await b.close();
})();
