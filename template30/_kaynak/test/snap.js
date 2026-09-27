// Listelerin DOM çıktısını birçok durumda kaydeder (hareket azaltma açık:
// GSAP ve AutoAnimate devre dışı, yalnızca işleyiş karşılaştırılır).
// Kullanım: node snap.js <url> <çıktı.json>
const { chromium } = require('playwright');
const fs = require('fs');
const [url, out] = process.argv.slice(2);

const norm = (h) => h.replace(/ (style|data-film-[\w-]+|data-aa)="[^"]*"/g, '');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const snaps = {};
  const grab = async (name, sel) => { snaps[name] = norm(await page.$eval(sel, (e) => e.innerHTML)); };
  const all = async (p) => {
    await grab(p + 'recipes', '[data-recipes]');
    await grab(p + 'meals', '[data-meals]');
    await grab(p + 'days', '[data-days]');
    for (const k of ['bmi', 'kcal', 'water']) await grab(p + 'res-' + k, `[data-result="${k}"]`);
  };
  await all('init/');

  for (const cat of ['breakfast', 'main', 'soup', 'snack', 'dessert', 'all']) {
    await page.click(`[data-cat="${cat}"]`);
    await grab('recipes/' + cat, '[data-recipes]');
  }
  for (const plan of ['lose', 'balance', 'sport']) {
    await page.click(`[data-plan="${plan}"]`);
    for (let d = 0; d < 7; d++) {
      await page.click(`[data-days] [data-day="${d}"]`);
      await grab(`plan/${plan}/${d}/meals`, '[data-meals]');
      await grab(`plan/${plan}/${d}/days`, '[data-days]');
    }
  }
  // Klavyeyle gün değiştirme: odak yeni seçili günde mi?
  await page.focus('[data-days] [data-day="2"]');
  await page.keyboard.press('ArrowRight');
  snaps['plan/kbd-focus'] = await page.evaluate(() => document.activeElement && document.activeElement.dataset.day);

  const setVal = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'change'); };
  await page.evaluate(() => document.getElementById('tab-bmi').click());
  await setVal('#bmi-height', 170); await setVal('#bmi-weight', 70);
  await grab('tools/bmi-170-70', '[data-result="bmi"]');
  await setVal('#bmi-weight', 95); await grab('tools/bmi-170-95', '[data-result="bmi"]');
  await setVal('#bmi-weight', 20); await grab('tools/bmi-invalid', '[data-result="bmi"]');
  await setVal('#bmi-weight', 70);
  await page.evaluate(() => document.getElementById('tab-kcal').click());
  await setVal('#kcal-age', 40); await grab('tools/kcal-40', '[data-result="kcal"]');
  await setVal('#kcal-weight', 40); await grab('tools/kcal-floor', '[data-result="kcal"]');
  await page.evaluate(() => document.getElementById('tab-water').click());
  await setVal('#water-weight', 80); await grab('tools/water-80', '[data-result="water"]');
  await page.click('[data-result="water"] .glass[data-i="2"]');
  await grab('tools/water-glass3', '[data-result="water"]');
  await setVal('#water-exercise', 90); await grab('tools/water-ex90', '[data-result="water"]');
  await page.click('[data-result="water"] .glass[data-i="4"]');
  await grab('tools/water-glass5', '[data-result="water"]');
  await setVal('#water-exercise', 0); await grab('tools/water-ex0', '[data-result="water"]');

  // Randevu: 2. adım, birkaç gün, tür/uzman değişimi, saat seçimi
  await page.evaluate(() => document.querySelector('#randevu').scrollIntoView());
  await page.click('[data-next="2"]');
  await page.waitForTimeout(150);
  await grab('slots/step2', '[data-slots]');
  const dayCount = await page.$$eval('[data-calendar] .cal-day:not([disabled])', (a) => a.length);
  for (let i = 0; i < Math.min(6, dayCount); i++) {
    await page.$$eval('[data-calendar] .cal-day:not([disabled])', (a, i) => a[i].click(), i);
    await grab('slots/day' + i, '[data-slots]');
  }
  await page.$$eval('[data-slots] .slot:not([disabled])', (a) => a[1] && a[1].click());
  await grab('slots/picked', '[data-slots]');
  for (const [type, staff] of [['control', 'emre'], ['online', 'zeynep'], ['first', 'any']]) {
    await page.click('[data-prev="1"]');
    await page.click(`input[name="type"][value="${type}"]`, { force: true });
    await page.click(`input[name="staff"][value="${staff}"]`, { force: true });
    await page.click('[data-next="2"]');
    await page.waitForTimeout(100);
    await grab(`slots/${type}-${staff}`, '[data-slots]');
    await page.$$eval('[data-calendar] .cal-day:not([disabled])', (a) => a[2] && a[2].click());
    await grab(`slots/${type}-${staff}-d2`, '[data-slots]');
  }

  await page.click('#site-header [data-lang="en"]');
  await page.waitForTimeout(200);
  await all('en/');
  await grab('en/slots', '[data-slots]');

  snaps.__errors = errors;
  fs.writeFileSync(out, JSON.stringify(snaps, null, 1));
  console.log(Object.keys(snaps).length, 'durum kaydedildi; hata:', errors.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
