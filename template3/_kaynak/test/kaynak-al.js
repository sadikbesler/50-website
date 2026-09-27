// daisyui.com referans görüntüleri: node test/kaynak-al.js
// Her bileşen sayfasındaki ilk örnek (ya da promtun adını verdiği örnek) emerald ve forest temasında,
// ayrıca /docs/themes/ sayfasındaki emerald ve forest önizlemeleri → _referans/kaynak-*.jpg
'use strict';
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '../../_referans');

// [dosya adı, sayfa, örnek başlığı (null = ilk örnek)]
const LIST = [
  ['navbar', 'navbar', 'Responsive (dropdown menu on small screen, center menu on large screen)'],
  ['dropdown', 'dropdown', null],
  ['swap', 'swap', 'Swap icons with rotate effect'],
  ['hero-figure', 'hero', 'Hero with figure'],
  ['hero-centered', 'hero', 'Centered hero'],
  ['hero-overlay', 'hero', 'Hero with overlay image'],
  ['stat', 'stat', null],
  ['card', 'card', null],
  ['card-side', 'card', 'Card with image on side'],
  ['carousel', 'carousel', null],
  ['timeline', 'timeline', 'Vertical timeline with text on both sides and icon'],
  ['avatar', 'avatar', null],
  ['tab-box', 'tab', 'tabs-box'],
  ['tab-lift', 'tab', 'tabs-lift'],
  ['range', 'range', null],
  ['fieldset', 'fieldset', null],
  ['input', 'input', null],
  ['textarea', 'textarea', null],
  ['select', 'select', null],
  ['checkbox', 'checkbox', null],
  ['list', 'list', null],
  ['badge', 'badge', null],
  ['filter', 'filter', null],
  ['modal', 'modal', 'Dialog modal with a close button at corner'],
  ['steps', 'steps', null],
  ['collapse', 'collapse', 'With arrow icon'],
  ['join', 'join', null],
  ['footer', 'footer', 'Footer with a logo section'],
  ['chat', 'chat', null],
  ['toast', 'toast', null],
  ['alert', 'alert', 'Success color'],
  ['loading', 'loading', null],
  ['progress', 'progress', 'Primary color'],
  ['button', 'button', null],
  ['menu', 'menu', null],
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [ad, slug, baslik] of (process.argv[2] === 'tema' ? [] : LIST)) {
    await page.goto(`https://daisyui.com/components/${slug}/`, { waitUntil: 'networkidle' });
    for (const tema of ['emerald', 'forest']) {
      const id = await page.evaluate(([baslik, tema]) => {
        document.documentElement.setAttribute('data-theme', tema);
        const pv = [...document.querySelectorAll('.component-preview')];
        let hedef = pv[0];
        if (baslik) {
          hedef = pv.find((p) => {
            const t = p.querySelector('.component-preview-title, h2, h3');
            if (t && t.textContent.trim() === baslik) return true;
            let n = p.previousElementSibling;
            while (n && !/^H[23]$/.test(n.tagName)) n = n.previousElementSibling;
            return n && n.textContent.trim() === baslik;
          }) || pv.find((p) => (p.textContent || '').includes(baslik)) || pv[0];
        }
        pv.forEach((p) => p.removeAttribute('data-hedef'));
        hedef.setAttribute('data-hedef', '1');
        return hedef.id;
      }, [baslik, tema]);
      const el = await page.$('[data-hedef="1"] .preview') || await page.$('[data-hedef="1"]');
      if (slug === 'modal') {
        await page.evaluate(() => { const d = document.querySelector('[data-hedef="1"] dialog'); if (d) d.showModal(); });
        await page.waitForTimeout(400);
        await page.screenshot({ path: path.join(OUT, `kaynak-${ad}${tema === 'forest' ? '-forest' : ''}.jpg`), type: 'jpeg', quality: 70 });
        await page.evaluate(() => { const d = document.querySelector('[data-hedef="1"] dialog'); if (d) d.close(); });
        console.log('ok', ad, tema, id);
        continue;
      }
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(250);
      await el.screenshot({ path: path.join(OUT, `kaynak-${ad}${tema === 'forest' ? '-forest' : ''}.jpg`), type: 'jpeg', quality: 70 });
      console.log('ok', ad, tema, id);
    }
  }
  // Tema önizlemeleri
  await page.goto('https://daisyui.com/docs/themes/', { waitUntil: 'networkidle' });
  for (const tema of ['emerald', 'forest']) {
    const kart = await page.$(`[data-theme="${tema}"].cursor-pointer`);
    if (kart) {
      await kart.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await kart.screenshot({ path: path.join(OUT, `kaynak-tema-${tema}.jpg`), type: 'jpeg', quality: 70 });
      console.log('ok tema', tema);
    } else console.log('YOK tema kartı', tema);
  }
  // Tema sayfası tam görünüm (liste)
  await page.screenshot({ path: path.join(OUT, 'kaynak-temalar-1440.jpg'), type: 'jpeg', quality: 70 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://daisyui.com/components/navbar/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'emerald'));
  await page.screenshot({ path: path.join(OUT, 'kaynak-navbar-390.jpg'), type: 'jpeg', quality: 70 });
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
