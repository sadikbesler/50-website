// Hızlı bakış: node bak.js <yol> <çıktı.jpg> [genişlik] [tema] [lang]
// Konsol hatalarını yazar, tam sayfa ekran görüntüsü alır (hareket azaltılmış).
'use strict';
const { chromium } = require('playwright');
const [, , yol = '', cikti = '/tmp/bak.jpg', w = '1440', tema = 'light', lang = ''] = process.argv;
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: +w, height: +w < 500 ? 844 : 900 }, reducedMotion: 'reduce' });
  await ctx.addInitScript(([t, l]) => {
    try {
      localStorage.setItem('mizan-theme', t);
      if (l) localStorage.setItem('mizan-lang', l); else localStorage.removeItem('mizan-lang');
      sessionStorage.setItem('mizan-demo-seen', '1');
    } catch (e) {}
  }, [tema, lang]);
  const page = await ctx.newPage();
  const hatalar = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') hatalar.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => hatalar.push('pageerror: ' + e));
  await page.goto('http://localhost:8801/50-website/template8/' + yol, { waitUntil: 'networkidle' });
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(400);
  const bilgi = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth, h: document.body.scrollHeight, title: document.title }));
  await page.screenshot({ path: cikti, fullPage: true, type: 'jpeg', quality: 60 });
  console.log(JSON.stringify(bilgi));
  console.log(hatalar.length ? hatalar.join('\n') : 'konsol temiz');
  await browser.close();
})();
