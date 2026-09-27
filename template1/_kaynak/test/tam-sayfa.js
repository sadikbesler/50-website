/* _referans/sonuc-1440.jpg ve sonuc-390.jpg: ana sayfanın tam görüntüsü (görseller önceden yüklenir) */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  for (const [w, h, name, theme] of [[1440, 900, 'sonuc-1440.jpg', 'light'], [390, 844, 'sonuc-390.jpg', 'light'], [1440, 900, 'sonuc-1440-koyu.jpg', 'dark']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(t => { try { localStorage.setItem('mizan-theme', t); localStorage.setItem('mizan-lang', 'tr'); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} }, theme);
    const p = await ctx.newPage();
    await p.goto('http://localhost:8801/50-website/template1/', { waitUntil: 'networkidle' });
    await p.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
      await Promise.all(Array.from(document.images).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 6000); })));
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(600);
    await p.screenshot({ path: path.resolve(__dirname, '../../_referans', name), type: 'jpeg', quality: 70, fullPage: true });
    await ctx.close();
  }
  await b.close();
})();
