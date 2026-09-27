// Kaynak demonun referans görüntüleri (0.4/1). Çalıştır: node test/referans.js
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const REF = path.join(__dirname, '../../_referans');
const URL = 'https://tailwindtoolbox.github.io/Landing-Page/';
const jpg = (ad) => ({ path: path.join(REF, ad), type: 'jpeg', quality: 70 });
(async () => {
  const b = await chromium.launch();
  const olc = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
    await p.goto(URL, { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await p.screenshot(jpg(`kaynak-nav-once-${w}.jpg`));
    const once = await p.evaluate(() => { const h = document.getElementById('header'), a = document.getElementById('navAction'), s = getComputedStyle(h); return { bg: s.backgroundColor, shadow: s.boxShadow, brand: getComputedStyle(document.querySelector('.toggleColour')).color, action: [getComputedStyle(a).backgroundImage, getComputedStyle(a).color] }; });
    await p.screenshot({ ...jpg(`kaynak-${w}.jpg`), fullPage: true });
    await p.evaluate(() => window.scrollTo(0, 600));
    await p.waitForTimeout(400);
    await p.screenshot(jpg(`kaynak-nav-sonra-${w}.jpg`));
    const sonra = await p.evaluate(() => { const h = document.getElementById('header'), a = document.getElementById('navAction'), s = getComputedStyle(h); return { bg: s.backgroundColor, shadow: s.boxShadow, brand: getComputedStyle(document.querySelector('.toggleColour')).color, action: [getComputedStyle(a).backgroundImage, getComputedStyle(a).color] }; });
    if (w === 390) {
      await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(200);
      await p.click('#nav-toggle'); await p.waitForTimeout(200);
      await p.screenshot(jpg('kaynak-nav-mobil-acik-390.jpg'));
    }
    // bölüm ölçüleri
    const bolum = await p.evaluate(() => [...document.querySelectorAll('body > div, body > section, body > svg, body > footer')].map((e) => [e.tagName + '.' + (e.className.baseVal ?? e.className).split(' ')[0], Math.round(e.getBoundingClientRect().height)]));
    const tip = await p.evaluate(() => ['h1', 'h2', 'h3', 'p', 'button'].map((s) => { const e = document.querySelector(s), c = getComputedStyle(e); return [s, c.fontSize, c.lineHeight, c.fontWeight, c.fontFamily.split(',')[0]]; }));
    olc[w] = { once, sonra, bolum, tip };
  }
  console.log(JSON.stringify(olc, null, 1));
  require('fs').writeFileSync(path.join(__dirname, 'kaynak-olcum.json'), JSON.stringify(olc, null, 2));
  await b.close();
})();
