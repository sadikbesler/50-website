// Flowbite belge sayfalarından örnek önizlemelerinin ekran görüntüleri → _referans/kaynak-<ad>(-dark).jpg
// Her belgenin ilk örneği + promtta adı geçen varyant (başlık kimliğiyle).
const { chromium } = require('playwright');
const path = require('path');
const REF = path.join(__dirname, '../../_referans');
const L = [
  // [dosya adı, yol, başlık kimliği (boşsa ilk örnek), iframe içinde tıklanacak düğme]
  ['navbar', 'components/navbar', ''],
  ['navbar-mobil', 'components/navbar', '', null, 390],
  ['card', 'components/card', ''],
  ['card-with-image', 'components/card', 'card-with-image'],
  ['carousel', 'components/carousel', ''],
  ['timeline', 'components/timeline', ''],
  ['timeline-vertical', 'components/timeline', 'vertical-timeline'],
  ['tabs', 'components/tabs', ''],
  ['tabs-underline', 'components/tabs', 'tabs-with-underline'],
  ['tabs-pills', 'components/tabs', 'pills-tabs'],
  ['range', 'forms/range', ''],
  ['input-field', 'forms/input-field', ''],
  ['list-group', 'components/list-group', ''],
  ['buttons', 'components/buttons', ''],
  ['modal', 'components/modal', ''],
  ['stepper', 'components/stepper', ''],
  ['datepicker', 'components/datepicker', 'inline-datepicker'],
  ['checkbox', 'forms/checkbox', ''],
  ['radio', 'forms/radio', ''],
  ['radio-advanced', 'forms/radio', 'advanced-layout'],
  ['toast', 'components/toast', ''],
  ['toast-success', 'components/toast', 'colors'],
  ['accordion', 'components/accordion', ''],
  ['chat-bubble', 'components/chat-bubble', ''],
  ['drawer', 'components/drawer', ''],
  ['banner', 'components/banner', ''],
];
(async () => {
  const b = await chromium.launch();
  for (const [ad, yol, bas, tik, gen] of L.filter((x) => !process.argv[2] || L.findIndex((y) => y[0] === process.argv[2]) <= L.indexOf(x))) {
    const p = await b.newPage({ viewport: { width: gen || 1440, height: 900 } });
    await p.goto(`https://flowbite.com/docs/${yol}/`, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(2000);
    await p.evaluate(() => document.querySelectorAll('body *').forEach((e) => { const s = getComputedStyle(e); if ((s.position === 'fixed' || s.position === 'sticky') && !e.closest('.code-preview-wrapper')) e.style.visibility = 'hidden'; }));
    const idx = await p.evaluate((bas) => {
      const w = [...document.querySelectorAll('.code-preview-wrapper')];
      if (!bas) return 0;
      const h = document.getElementById(bas);
      if (!h) return -1;
      return w.findIndex((x) => h.compareDocumentPosition(x) & Node.DOCUMENT_POSITION_FOLLOWING);
    }, bas);
    if (idx < 0) { console.log('BAŞLIK YOK', ad, bas); await p.close(); continue; }
    const wrap = p.locator('.code-preview-wrapper').nth(idx);
    await wrap.scrollIntoViewIfNeeded();
    const frame = wrap.locator('iframe').first();
    await p.waitForFunction((i) => { const f = document.querySelectorAll('.code-preview-wrapper')[i].querySelector('iframe'); return f && f.offsetHeight > 20; }, idx, { timeout: 15000 }).catch(() => {});
    const fr = await (await frame.elementHandle()).contentFrame();
    if (tik) { await fr.locator(tik).first().click(); await p.waitForTimeout(900); }
    const hedef = wrap.locator('.code-preview').first();
    for (const koyu of [false, true]) {
      await fr.evaluate((k) => document.documentElement.classList.toggle('dark', k), koyu);
      await p.waitForTimeout(350);
      await hedef.screenshot({ path: path.join(REF, `kaynak-${ad}${koyu ? '-dark' : ''}.jpg`), type: 'jpeg', quality: 70 });
    }
    console.log('ok', ad);
    await p.close();
  }
  await b.close();
})().catch((e) => { console.error(e); process.exit(1); });
