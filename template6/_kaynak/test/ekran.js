// Hızlı bakış: node test/ekran.js [yol] [ek] [tema]
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const [yol = '', ek = 'taslak', tema = 'light'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript((t) => { try { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, tema);
    const p = await ctx.newPage();
    const err = [];
    p.on('console', (m) => m.type() === 'error' && err.push(m.text()));
    p.on('pageerror', (e) => err.push(String(e)));
    await p.goto('http://localhost:8801/50-website/template6/' + yol, { waitUntil: 'networkidle' });
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
    await p.waitForTimeout(500);
    await p.screenshot({ path: path.join('/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/f350cb70-f43b-4552-bf8d-3e0be1b18d8b/scratchpad', `${ek}-${w}.jpg`), type: 'jpeg', quality: 60, fullPage: true });
    console.log(w, 'hatalar:', err, 'sw', await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth, document.body.scrollHeight]));
    await ctx.close();
  }
  await b.close();
})();
