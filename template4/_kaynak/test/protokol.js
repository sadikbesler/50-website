// 0.9 test protokolü — template4 (Flowbite). Çalıştır: node test/protokol.js
// Sonuçlar: test/sonuc.json + _referans/sonuc-*.jpg
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8801/50-website/template4/';
const REF = path.join(__dirname, '../../_referans');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
const SONUC = {};
const kayit = (ad, gecti, not) => { SONUC[ad] = { gecti: !!gecti, not }; console.log(gecti ? 'GEÇTİ ' : 'KALDI ', ad, not != null ? JSON.stringify(not).slice(0, 400) : ''); };

const SECICILER = ['#site-header', '#next-slot', '#hizmetler', '#yaklasim', '#uzmanlar', '#araclar', '#program', '#tarifler', '#ucretler', '#randevu', '#blog', '#sss', '#iletisim',
  '#recipe-dialog', '#cancel-dialog', '#booking-form', '#cancel-form', '#x-email-err', '#x-ref-err', '#faq-schema',
  '#chat', '#chat-toggle', '#chat-log', '#chat-form', '#chat-input',
  '[data-close]', '[data-booking]', '[data-stepper]', '.bstep[data-step]', '[data-calendar]', '[data-slots]', '[data-prev]', '[data-next]', '[data-goto]',
  '[data-summary]', '[data-sum]', '[data-sum-fee]', '[data-review]', '[data-submit]', '[data-prep]', '[data-tz-note]', '[data-clock]', '[data-clock-date]',
  '[data-next-time]', '[data-next-meta]', '[data-next-book]', '[data-book-area]', '[data-book-type]', '[data-book-staff]', '[data-open-cancel]', '[data-cancel-status]',
  'form[data-tool]', '[data-result]', 'input[type=range][data-sync]', '#araclar [role=tab]',
  '[data-plan]', '[data-days]', '[data-day]', '[data-meals]', '[data-macros]', '[data-total]', '[data-tip]', '[data-program-book]',
  '[data-recipes]', '[data-recipe]', '[data-recipe-filters]', '[data-cat]', '[data-recipe-img]', '[data-recipe-content]', '.dialog-scroll', '.servings',
  '[data-chat-close]', '[data-chat-badge]', '[data-intent]', '[data-i18n]', '[data-i18n-attr]',
  '.facts', '.notes-panel', '#manifesto', '.sky', '.site-footer', '.floating-actions'];

async function yeniSayfa(browser, { w = 1440, h = 900, tema = 'light', lang = null, demoGoster = false, js = true, reduce = false, clock = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: js, reducedMotion: reduce ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(([t, l, d]) => {
    try {
      if (!sessionStorage.getItem('__init')) {
        sessionStorage.setItem('__init', '1');
        localStorage.setItem('mizan-theme', t);
        if (l) localStorage.setItem('mizan-lang', l); else localStorage.removeItem('mizan-lang');
        if (!d) sessionStorage.setItem('mizan-demo-seen', '1');
      }
    } catch (e) {}
  }, [tema, lang, demoGoster]);
  const page = await ctx.newPage();
  if (clock) await page.clock.install({ time: clock });
  page._hatalar = [];
  page.on('console', (m) => { if (m.type() === 'error') page._hatalar.push(m.text()); });
  page.on('pageerror', (e) => page._hatalar.push(String(e)));
  return { ctx, page };
}
async function tembel(page) {
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(300);
}
const jpg = (ad) => ({ path: path.join(REF, ad), type: 'jpeg', quality: 70 });
async function eleman(page, sel, ad) {
  const el = await page.$(sel);
  if (!el) { console.log('  (yok) ' + sel); return; }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(150);
  await el.screenshot(jpg(ad));
}
async function axeKos(page) {
  await page.evaluate(AXE);
  return page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ornek: v.nodes.slice(0, 2).map((x) => x.target.join(' ')) }));
  });
}

(async () => {
  const browser = await chromium.launch();

  /* 1–2. Konsol ve taşma */
  const sayfalar = ['', 'blog/index.html', 'blog/insulin-direnci-beslenme.html', 'kvkk.html'];
  const konsol = {}, tasma = {};
  for (const s of sayfalar) {
    for (const w of [1440, 390]) {
      const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900 });
      await page.goto(BASE + s, { waitUntil: 'networkidle' });
      await tembel(page);
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      tasma[(s || 'index') + '@' + w] = sw;
      if (w === 1440) konsol[s || 'index'] = page._hatalar.slice();
      await ctx.close();
    }
  }
  kayit('1 konsol', Object.values(konsol).every((a) => a.length === 0), konsol);
  kayit('2 tasma', Object.values(tasma).every(([a, b]) => a <= b), tasma);

  /* 3. Sözleşme + 4. Randevu */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const eksik0 = await page.evaluate((L) => L.filter((s) => !document.querySelector(s)), SECICILER);
    // .servings (tarif penceresi) ve [data-intent] (sohbet hapları) çalışma anında üretilir — özgün sitede de öyle
    await page.locator('[data-recipe]').first().click();
    await page.click('#recipe-dialog [data-close]');
    await page.click('#chat-toggle'); await page.waitForSelector('[data-intent]'); await page.click('[data-chat-close]');
    const eksik = await page.evaluate((L) => L.filter((s) => !document.querySelector(s)), SECICILER);
    kayit('3 sozlesme', eksik.length === 0, { eksik, ilkYuklemedeOlmayan: eksik0 });

    // Boş formda hata mesajları (adım 3)
    await page.click('[data-next="2"]');
    await page.waitForSelector('.cal-day');
    const calOk = await page.evaluate(() => !!document.querySelector('.cal-day') && !!document.querySelector('.slot'));
    kayit('3 sozlesme (.cal-day/.slot)', calOk);
    // ilk uygun gün + ilk saat
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    await page.click('[data-next="3"]');
    await page.waitForSelector('[data-step="3"]:not([hidden])');
    await page.click('[data-next="4"]');
    const hatalar = await page.evaluate(() => ['b-name-err', 'b-phone-err', 'b-email-err', 'b-kvkk-err'].map((id) => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    await eleman(page, '[data-booking]', 'sonuc-input-field-hata.jpg');
    // baştan: İlk görüşme → Kilo yönetimi → uzman (herhangi) → ilk gün → ilk saat
    await page.click('[data-goto="1"]');
    await page.check('input[name="type"][value="first"]', { force: true });
    await page.check('input[name="area"][value="weight"]', { force: true });
    await page.check('input[name="staff"][value="any"]', { force: true });
    await page.click('[data-next="2"]');
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    await page.click('[data-next="3"]');
    await page.fill('#b-name', 'Test Kişi');
    await page.fill('#b-email', 'test@example.com');
    await page.fill('#b-phone', '05321234567');
    await page.check('input[name="kvkk"]');
    await page.click('[data-next="4"]');
    await page.waitForSelector('[data-step="4"]:not([hidden])');
    const ozet = await page.evaluate(() => document.querySelectorAll('[data-review] .review-row').length);
    await eleman(page, '[data-booking]', 'sonuc-randevu-ozet.jpg');
    await page.click('[data-submit]');
    await page.waitForSelector('[data-step="done"]:not([hidden])', { timeout: 10000 });
    const done = await page.evaluate(() => {
      const d = document.querySelector('[data-step="done"]');
      return { ref: (d.querySelector('.ref span') || {}).textContent, ics: [...d.querySelectorAll('button')].some((b) => /takvim|\.ics|ics/i.test(b.textContent)), gcal: !!d.querySelector('a[href*="calendar.google.com"]') };
    });
    await eleman(page, '[data-booking]', 'sonuc-randevu-onay.jpg');
    await eleman(page, '[data-step="done"]', 'sonuc-toast-success-onay.jpg');
    // .ics indirme
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('[data-step="done"] .btn--primary')]);
    // İptal penceresi
    await page.click('[data-open-cancel]');
    const iptalAcik = await page.evaluate(() => document.getElementById('cancel-dialog').open);
    await page.click('#cancel-form button[type="submit"]');
    const iptalHata = await page.evaluate(() => !!document.getElementById('x-ref-err').textContent.trim() && !!document.getElementById('x-email-err').textContent.trim());
    await page.waitForTimeout(200);
    await page.screenshot(jpg('sonuc-modal-iptal.jpg'));
    kayit('4 randevu', hatalar === 4 && ozet >= 7 && /^MZ-/.test(done.ref || '') && done.gcal && dl && iptalAcik && iptalHata,
      { bosFormHata: hatalar, ozetSatir: ozet, done, ics: dl ? dl.suggestedFilename() : null, iptalAcik, iptalHata });
    await ctx.close();
  }

  /* 5. Araçlar */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + '#araclar', { waitUntil: 'networkidle' });
    await page.fill('#bmi-height', '170'); await page.dispatchEvent('#bmi-height', 'change');
    await page.fill('#bmi-weight', '70'); await page.dispatchEvent('#bmi-weight', 'change');
    await page.waitForTimeout(300);
    const vki = await page.textContent('[data-result="bmi"] .result-num');
    await page.click('#tab-kcal');
    await page.waitForTimeout(200);
    const kcal = await page.textContent('[data-result="kcal"] .result-num');
    await page.click('#tab-water');
    await page.waitForTimeout(200);
    await page.click('[data-result="water"] .glass >> nth=2');
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('#tab-water');
    const dolu = await page.evaluate(() => document.querySelectorAll('[data-result="water"] .glass.is-full').length);
    kayit('5 araclar', vki.trim() === '24,2' && /\d/.test(kcal) && dolu === 3, { vki, kcal, doluBardakYenilemeSonrasi: dolu });
    await ctx.close();
  }

  /* 6. Program ve tarifler */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + '#program', { waitUntil: 'networkidle' });
    const t0 = await page.textContent('[data-total]');
    const g0 = await page.textContent('[data-meals]');
    await page.click('[data-day]:not([aria-selected="true"]) >> nth=0');
    const g1 = await page.textContent('[data-meals]');
    await page.click('[data-plan="sport"]');
    const t1 = await page.textContent('[data-total]');
    const n0 = await page.locator('[data-recipe]').count();
    await page.click('[data-cat="breakfast"]');
    const n1 = await page.locator('[data-recipe]').count();
    await page.click('[data-cat="all"]');
    // porsiyonu 2 olan tarifi bul, aç, 3'e çıkar
    let scaled = null;
    const cards = await page.locator('[data-recipe]').count();
    for (let i = 0; i < cards && !scaled; i++) {
      await page.locator('[data-recipe]').nth(i).click();
      await page.waitForSelector('#recipe-dialog[open]');
      const s = +(await page.textContent('#recipe-dialog .servings output'));
      if (s === 2) {
        const q0 = await page.textContent('#recipe-dialog .ingredients li:first-child .qty');
        await page.click('#recipe-dialog .servings .icon-btn:last-child');
        const q1 = await page.textContent('#recipe-dialog .ingredients li:first-child .qty');
        scaled = { q0, q1, porsiyon: await page.textContent('#recipe-dialog .servings output') };
        await page.screenshot(jpg('sonuc-modal-porsiyon.jpg'));
      }
      await page.click('#recipe-dialog [data-close]');
    }
    kayit('6 program-tarif', g0 !== g1 && t0 !== t1 && n1 < n0 && scaled && scaled.q0 !== scaled.q1 && scaled.porsiyon === '3', { gunDegisti: g0 !== g1, toplam: [t0, t1], tarif: [n0, n1], scaled });
    await ctx.close();
  }

  /* 7. Sohbet */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('#chat-toggle');
    await page.waitForTimeout(400);
    const acik = await page.evaluate(() => document.body.classList.contains('chat-open') && !document.getElementById('chat').inert);
    const sor = async (t) => {
      const n = await page.locator('#chat-log .msg--bot:not(.typing)').count();
      await page.fill('#chat-input', t); await page.press('#chat-input', 'Enter');
      await page.waitForFunction((k) => document.querySelectorAll('#chat-log .msg--bot:not(.typing)').length > k, n, { timeout: 8000 });
      return page.evaluate(() => { const b = document.querySelectorAll('#chat-log .msg--bot:not(.typing)'); return b[b.length - 1].textContent; });
    };
    const fiyat = await sor('ücretler');
    const randevu = await sor('randevu');
    await page.screenshot(jpg('sonuc-sohbet.jpg'));
    const cb1 = await sor('beni arayın');
    const cb2 = await sor('Test Kişi');
    const cb3 = await sor('05321234567');
    kayit('7 sohbet', acik && /1\.800/.test(fiyat) && /\d{2}:\d{2}/.test(randevu) && /demo/i.test(cb3), { acik, fiyat: fiyat.slice(0, 80), randevu: randevu.slice(0, 80), cb: [cb1.slice(0, 50), cb2.slice(0, 50), cb3.slice(0, 80)] });
    await ctx.close();
  }

  /* 8. Dil ve tema */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('randevu').scrollIntoView());
    await page.click('#site-header [data-lang="en"]');
    await page.waitForTimeout(300);
    const trKalan = await page.evaluate(() => {
      const re = /[çğıöşüÇĞİÖŞÜ]/;
      const izin = /Selin|Emre|Zeynep|Tunalı|Karaca|Aksoy|Kadıköy|İstanbul|Türkiye|Moda|mizan|Mizan|Beslenme|KVKK|Dyt|Uzm|Çar|Pzt|Cmt|Sal|Per|Cum|şakşuka|ayran|simit|köfte|cacık|kısır/;
      const out = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode, t = n.textContent.trim();
        if (!t || !re.test(t)) continue;
        const p = n.parentElement;
        if (p.closest('script,style,[hidden],[aria-hidden="true"],[lang="tr"]')) continue;
        if (getComputedStyle(p).display === 'none') continue;
        if (izin.test(t) && t.replace(new RegExp(izin.source, 'g'), '').match(re) === null) continue;
        out.push(t.slice(0, 60));
      }
      return out;
    });
    const enUrl = page.url();
    // Dil değişiminden sonra initFlowbite() yeniden çalıştı: carousel "sonraki" tek slayt ilerlemeli
    const car0 = await page.evaluate(() => FlowbiteInstances.getInstance('Carousel', 'notes-carousel').getActiveItem().position);
    await page.click('#notes-carousel [data-carousel-next]');
    await page.waitForTimeout(100);
    const car1 = await page.evaluate(() => FlowbiteInstances.getInstance('Carousel', 'notes-carousel').getActiveItem().position);
    const carGorunen = await page.evaluate(() => [...document.querySelectorAll('#notes-carousel [data-carousel-item]')].findIndex((x) => x.classList.contains('translate-x-0')));
    const carousel = { once: car0, sonra: car1, gorunen: carGorunen };
    await page.click('#site-header [data-theme-toggle]');
    const koyu = await page.evaluate(() => document.documentElement.classList.contains('dark') && document.documentElement.dataset.theme === 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    const korundu = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    await page.click('#site-header [data-lang="tr"]');
    await page.click('#site-header [data-theme-toggle]');
    const geri = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    // ?lang=en
    const { ctx: c2, page: p2 } = await yeniSayfa(browser);
    await p2.goto(BASE + '?lang=en', { waitUntil: 'networkidle' });
    const qEn = await p2.evaluate(() => document.documentElement.lang + ' | ' + document.querySelector('#hero-title').textContent.trim().replace(/\s+/g, ' '));
    await c2.close();
    kayit('8 dil-tema', carousel.sonra === carousel.once + 1 && carousel.gorunen === carousel.sonra && trKalan.length === 0 && /lang=en/.test(enUrl) && koyu && korundu.dark && korundu.lang === 'en' && !geri.dark && geri.lang === 'tr' && /^en/.test(qEn),
      { trKalan, enUrl, carousel, koyu, korundu, geri, qEn });
    await ctx.close();
  }

  /* 9. Erişilebilirlik (axe) */
  {
    const sonuc = {};
    for (const [ad, yol, tema] of [['index-acik', '', 'light'], ['index-koyu', '', 'dark'], ['makale', 'blog/insulin-direnci-beslenme.html', 'light'], ['makale-koyu', 'blog/insulin-direnci-beslenme.html', 'dark']]) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true });
      await page.goto(BASE + yol, { waitUntil: 'networkidle' });
      await tembel(page);
      sonuc[ad] = await axeKos(page);
      await ctx.close();
    }
    // Etkileşim durumları: takvim + saat seçili, tarif penceresi, sohbet, İngilizce
    for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true, lang: tema === 'dark' ? 'en' : null });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.click('[data-next="2"]'); await page.waitForSelector('.slot');
      await page.click('.cal-day:not([disabled])'); await page.click('.slot:not([disabled])');
      sonuc['takvim-' + tema] = await axeKos(page);
      await page.locator('[data-recipe]').first().click(); await page.waitForTimeout(200);
      sonuc['tarif-penceresi-' + tema] = await axeKos(page);
      await page.click('#recipe-dialog [data-close]');
      await page.click('#chat-toggle'); await page.waitForSelector('[data-intent]');
      sonuc['sohbet-' + tema] = await axeKos(page);
      await ctx.close();
    }
    const ciddi = Object.fromEntries(Object.entries(sonuc).map(([k, v]) => [k, v.filter((x) => x.impact === 'serious' || x.impact === 'critical')]));
    kayit('9 axe', Object.values(ciddi).every((v) => v.length === 0), { ciddi, tum: sonuc });
  }

  /* 10. Hareket azaltma */
  {
    const { ctx, page } = await yeniSayfa(browser, { reduce: true });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await tembel(page);
    const r = await page.evaluate(() => ({
      sonsuz: document.getAnimations().filter((a) => a.effect && a.effect.getTiming().iterations === Infinity).map((a) => (a.effect.target && a.effect.target.className) || '?'),
      gizli: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).opacity === '0').map((s) => s.id || s.className)
    }));
    kayit('10 hareket-azaltma', r.sonsuz.length === 0 && r.gizli.length === 0, r);
    await ctx.close();
  }

  /* 11. JS kapalı */
  {
    const { ctx, page } = await yeniSayfa(browser, { js: false });
    await page.goto(BASE, { waitUntil: 'load' });
    const r = await page.evaluate(() => ({
      gizliBolum: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).visibility === 'hidden').map((s) => s.id || s.className),
      metin: document.body.innerText.length,
      notGorsel: [...document.querySelectorAll('.notes-panel img')].filter((i) => i.getBoundingClientRect().height > 50).length,
      bosSonuc: [...document.querySelectorAll('[data-result],[data-recipes],[data-meals]')].filter((e) => !e.textContent.trim()).length
    }));
    await page.screenshot(jpg('sonuc-jskapali-1440.jpg'), { fullPage: false });
    kayit('11 js-kapali', r.gizliBolum.length === 0 && r.metin > 5000 && r.notGorsel === 7, r);
    await ctx.close();
  }

  /* 12. Ekran görüntüleri */
  const bilesenler = [
    ['#site-header', 'blok-header'], ['#top', 'blok-hero'], ['.facts', 'blok-feature'], ['#hizmetler', 'card-with-image'], ['.notes-panel', 'carousel'],
    ['#yaklasim', 'timeline-vertical'], ['#manifesto', 'blok-content'], ['#uzmanlar', 'blok-team'], ['#araclar', 'tabs-underline'], ['#program', 'tabs-pills'],
    ['#tarifler', 'card-recipes'], ['[data-recipe-filters]', 'buttons'], ['#ucretler', 'blok-pricing'], ['#randevu', 'stepper'],
    ['[data-step="1"]', 'radio-advanced'], ['#blog', 'blok-blog'], ['#sss', 'blok-faq'], ['.sky', 'blok-cta'], ['#iletisim', 'blok-contact'], ['.site-footer', 'blok-footer']
  ];
  for (const tema of ['light', 'dark']) {
    const ek = tema === 'dark' ? '-dark' : '';
    const { ctx, page } = await yeniSayfa(browser, { tema, demoGoster: true });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await tembel(page);
    await eleman(page, '.demo-bar', `sonuc-banner${ek}.jpg`);
    await page.click('.demo-bar-btn');
    await page.screenshot({ ...jpg(`sonuc-1440${ek}.jpg`), fullPage: true });
    for (const [sel, ad] of bilesenler) await eleman(page, sel, `sonuc-${ad}${ek}.jpg`);
    // Takvim ve saatler
    await page.click('[data-next="2"]');
    await page.waitForSelector('.slot');
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    await eleman(page, '[data-step="2"]', `sonuc-datepicker${ek}.jpg`);
    // Bildirim
    await page.evaluate(() => window.Mizan.toast('Referans kodu kopyalandı'));
    await page.waitForTimeout(350);
    await eleman(page, '#toast', `sonuc-toast-success${ek}.jpg`);
    // Tarif penceresi
    await page.locator('[data-recipe]').first().click();
    await page.waitForTimeout(300);
    await page.screenshot(jpg(`sonuc-modal${ek}.jpg`));
    await page.click('#recipe-dialog [data-close]');
    // Sohbet
    await page.click('#chat-toggle');
    await page.waitForTimeout(500);
    await page.screenshot(jpg(`sonuc-chat-drawer${ek}.jpg`));
    await ctx.close();
  }
  for (const tema of ['light', 'dark']) {
    const ek = tema === 'dark' ? '-dark' : '';
    const { ctx, page } = await yeniSayfa(browser, { w: 390, h: 844, tema });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await tembel(page);
    await page.screenshot({ ...jpg(`sonuc-390${ek}.jpg`), fullPage: true });
    const tog = '[data-collapse-toggle="mobile-menu-2"]';
    await page.click(tog);
    await page.waitForTimeout(200);
    const menu = await page.evaluate((t) => ({ acik: getComputedStyle(document.getElementById('mobile-menu-2')).display !== 'none', aria: document.querySelector(t).getAttribute('aria-expanded') }), tog);
    await page.screenshot(jpg(`sonuc-navbar-mobil${ek}.jpg`));
    await page.click('#mobile-menu-2 a[href="#tarifler"]');
    await page.waitForTimeout(300);
    const kapali = await page.evaluate(() => getComputedStyle(document.getElementById('mobile-menu-2')).display === 'none');
    if (!ek) kayit('ek: mobil menu (Flowbite collapse)', menu.acik && menu.aria === 'true' && kapali, { menu, kapali });
    await ctx.close();
  }
  // Boş gün: seçili günün saatleri geçince
  {
    const { ctx, page } = await yeniSayfa(browser, { clock: new Date('2026-09-28T08:00:00+03:00') });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('[data-next="2"]');
    await page.waitForSelector('.slot');
    const secili = await page.evaluate(() => (document.querySelector('.cal-day[aria-pressed="true"]') || {}).dataset);
    await page.clock.fastForward('11:59:00');
    await page.clock.runFor(2000);
    const bos = await page.evaluate(() => !!document.querySelector('.slots-empty'));
    await eleman(page, '[data-slots]', 'sonuc-bos-gun.jpg');
    kayit('ek: bos gun durumu', bos, { secili: secili && secili.date });
    await ctx.close();
  }
  // Alt sayfalar
  for (const [yol, ad] of [['blog/index.html', 'blog'], ['blog/insulin-direnci-beslenme.html', 'makale'], ['kvkk.html', 'kvkk']]) {
    for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { tema });
      await page.goto(BASE + yol, { waitUntil: 'networkidle' });
      await tembel(page);
      await page.screenshot({ ...jpg(`sonuc-${ad}-1440${tema === 'dark' ? '-dark' : ''}.jpg`), fullPage: true });
      await ctx.close();
    }
  }

  fs.writeFileSync(path.join(__dirname, 'sonuc.json'), JSON.stringify(SONUC, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
