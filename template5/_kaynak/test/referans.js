// Landwind demosunun referans görüntüleri ve ölçüleri — node test/referans.js
// Çıktı: _referans/kaynak-*.jpg + test/kaynak-olcu.json (bölüm yükseklikleri, tipografi)
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const URL = 'https://demo.themesberg.com/landwind/';
const REF = path.join(__dirname, '../../_referans');
const jpg = (ad) => ({ path: path.join(REF, ad), type: 'jpeg', quality: 70 });

// Landwind index.html blok sırası (bölüm → seçici)
const BLOKLAR = ['header', 'hero', 'logolar', 'ozellik', 'istatistik', 'alinti', 'fiyat', 'sss', 'cta', 'footer'];

async function olc(page) {
  return page.evaluate((adlar) => {
    const els = [document.querySelector('header nav'), ...document.querySelectorAll('body > section'), document.querySelector('body > footer')];
    const px = (el, sel) => { const x = el && el.querySelector(sel); return x ? parseFloat(getComputedStyle(x).fontSize) : null; };
    return els.map((el, i) => ({
      ad: adlar[i],
      h: Math.round(el.getBoundingClientRect().height),
      h1: px(el, 'h1'), h2: px(el, 'h2'), h3: px(el, 'h3'), p: px(el, 'p'),
    }));
  }, BLOKLAR);
}

(async () => {
  const browser = await chromium.launch();
  const sonuc = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    for (const tema of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await ctx.newPage();
      await page.goto(URL, { waitUntil: 'networkidle' });
      if (tema === 'dark') await page.evaluate(() => document.documentElement.classList.add('dark'));
      await page.waitForTimeout(500);
      const ek = tema === 'dark' ? '-dark' : '';
      await page.screenshot({ ...jpg(`kaynak-${w}${ek}.jpg`), fullPage: true });
      if (tema === 'light') sonuc[w] = await olc(page);
      if (w === 1440) {
        // her blok ayrı (fixed header'ı blok görüntülerinde gizle)
        const els = await page.$$('body > section, body > footer');
        await page.evaluate(() => { document.querySelector('header').style.position = 'static'; });
        for (let i = 0; i < els.length; i++) {
          await els[i].scrollIntoViewIfNeeded();
          await els[i].screenshot(jpg(`kaynak-blok-${BLOKLAR[i + 1]}${ek}.jpg`));
        }
        await (await page.$('header')).screenshot(jpg(`kaynak-blok-header${ek}.jpg`));
      }
      if (w === 390 && tema === 'light') {
        await page.click('[data-collapse-toggle="mobile-menu-2"]');
        await page.waitForTimeout(300);
        await page.screenshot(jpg('kaynak-390-menu.jpg'));
      }
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(__dirname, 'kaynak-olcu.json'), JSON.stringify(sonuc, null, 2));
  console.log(JSON.stringify(sonuc, null, 1));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
