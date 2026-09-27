// hyperui.dev önizlemelerinin (iframe kaynağı olan /examples/... sayfaları) ekran görüntüleri
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '../../_referans');
const LIST = [
  ['marketing/headers', 2, 1], ['marketing/banners', 3, 1], ['application/stats', 4, 1],
  ['marketing/feature-grids', 1, 1], ['marketing/cards', 2, 0], ['application/steps', 4, 1],
  ['marketing/sections', 4, 0], ['marketing/team-sections', 2, 1], ['application/tabs', 4, 1],
  ['application/tabs', 5, 1], ['application/inputs', 1, 1], ['application/range-inputs', 1, 0],
  ['marketing/blog-cards', 1, 1], ['application/button-groups', 1, 1], ['application/modals', 2, 1],
  ['marketing/pricing', 1, 0], ['application/steps', 1, 1], ['application/radio-groups', 1, 1],
  ['application/radio-groups', 2, 1], ['application/empty-states', 1, 1], ['marketing/blog-cards', 3, 1],
  ['marketing/faqs', 2, 1], ['marketing/ctas', 1, 1], ['marketing/contact-forms', 5, 1],
  ['marketing/footers', 10, 1], ['application/toasts', 1, 1], ['marketing/announcements', 1, 1],
];
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  for (const [grp, n, dark] of LIST) {
    const g = grp.split('/')[1];
    for (const v of dark ? ['', '-dark'] : ['']) {
      const url = `https://www.hyperui.dev/examples/${grp}/${n}${v}.html`;
      await page.goto(url, { waitUntil: 'networkidle' });
      // modals: open the dialog like the preview button does
      if (g === 'modals') await page.evaluate(() => document.querySelector('dialog').showModal());
      await page.waitForTimeout(300);
      const file = path.join(OUT, `kaynak-${g}-${n}${v}.jpg`);
      await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 70 });
      console.log('ok', file.split('/').pop());
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
