// Sayfanın belirli bir y aralığının görüntüsü: node test/kadraj.js <seçici> <üstPay> <yükseklik> <w> <tema> <ad>
'use strict';
const { chromium } = require('playwright');
const [sel, pay = '0', yuk = '900', w = '1440', tema = 'light', ad = 'k'] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: +w, height: +yuk } });
  await ctx.addInitScript((t) => { try { localStorage.setItem('mizan-theme', t); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, tema);
  const p = await ctx.newPage();
  await p.goto('http://localhost:8801/50-website/template6/' + (process.env.YOL || ''), { waitUntil: 'networkidle' });
  await p.evaluate(([s, d]) => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + scrollY + d); }, [sel, +pay]);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/f350cb70-f43b-4552-bf8d-3e0be1b18d8b/scratchpad/${ad}.jpg`, type: 'jpeg', quality: 60 });
  await b.close();
})();
