// Tailblocks referansları: https://tailblocks.cc, tema "green", her blok açık ve koyu modda.
// Çıktı: _referans/kaynak-<kategori>-<harf>(-dark).jpg (JPEG q70, genişlik ≤1440). 390 genişlik için "phone" görünümü de alınır.
const { chromium } = require('playwright');
const path = require('path');
const REF = path.resolve(__dirname, '../../_referans');
const BLOKLAR = ['HeaderA', 'HeroA', 'StatisticA', 'ContentH', 'GalleryA', 'StepA', 'TestimonialB', 'TeamB', 'PricingA',
  'ContactC', 'FeatureC', 'BlogA', 'PricingB', 'ContactB', 'BlogC', 'ContentE', 'FeatureD', 'CTAB', 'FooterA'];
const ad = (b) => { const m = b.match(/^(CTA|[A-Z][a-z]+)([A-Z])$/); return `${m[1].toLowerCase()}-${m[2].toLowerCase()}`; };
(async () => {
  const br = await chromium.launch();
  const page = await br.newPage({ viewport: { width: 1440, height: 900 } });
  // Reklam/analitik istekleri engellenir (sayfanın üstüne reklam kutusu biniyordu)
  await page.route(/googlesyndication|doubleclick|adservice|googletagmanager|google-analytics|fundingchoices|googleadservices/, (r) => r.abort());
  await page.goto('https://tailblocks.cc', { waitUntil: 'networkidle' });
  await page.click('button.theme-button[data-theme="green"]');
  await page.click('button.opener'); // kenar çubuğunu kapat
  // Sitenin kendi yüzen öğeleri (GitHub, klavye ipucu, reklam) bloğun üstüne biner; görüntüden önce gizlenir
  await page.addStyleTag({ content: '.github,.keyboard-nav,body > *:not(#root),html > *:not(head):not(body){display:none!important}' });
  await page.waitForTimeout(500);
  const olcum = {};
  const gorunumler = [['desktop', ''], ['phone', '-390']];
  for (const [gor, ek] of gorunumler) {
  await page.click(`button.device[data-view="${gor}"]`); await page.waitForTimeout(500);
  for (const dark of [false, true]) {
    const aktif = await page.evaluate(() => document.querySelector('.app').classList.contains('dark-mode'));
    if (aktif !== dark) { await page.click('button.mode'); await page.waitForTimeout(400); }
    for (const b of BLOKLAR) {
      await page.evaluate((b) => { document.querySelector(`.block-item[block-name="${b}"]`).click(); }, b);
      await page.waitForTimeout(700);
      const fr = page.frameLocator('.view iframe');
      const el = fr.locator('body > div > div > *').first();
      await el.waitFor();
      const f = path.join(REF, `kaynak-${ad(b)}${ek}${dark ? '-dark' : ''}.jpg`);
      await el.screenshot({ path: f, type: 'jpeg', quality: 70 });
      olcum[`${b}${ek}${dark ? '-dark' : ''}`] = await el.evaluate((e) => {
        const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height), bg: cs.backgroundColor, color: cs.color, font: cs.fontFamily };
      });
      console.log('ok', f.split('/').pop(), olcum[`${b}${ek}${dark ? '-dark' : ''}`].w);
    }
  }
  }
  require('fs').writeFileSync(path.join(__dirname, 'kaynak-olcum.json'), JSON.stringify(olcum, null, 1));
  await br.close();
})();
