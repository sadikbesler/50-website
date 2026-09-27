// Bölüm bölüm görüntü: node test/parca.js <seçici,...> [genişlik] [tema] [ek]
'use strict';
const { chromium } = require('playwright');
const [secs, w = '1440', tema = 'light', ek = ''] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: 900 } });
  await ctx.addInitScript((t) => { try { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, tema);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8801/50-website/template6/' + (process.env.YOL || ''), { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
  let i = 0;
  for (const s of secs.split(',')) {
    const el = await p.$(s);
    if (!el) { console.log('yok', s); continue; }
    await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
    await el.screenshot({ path: `/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/f350cb70-f43b-4552-bf8d-3e0be1b18d8b/scratchpad/p${ek}${i++}.jpg`, type: 'jpeg', quality: 60 });
  }
  await b.close();
})();
