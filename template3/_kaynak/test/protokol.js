// 0.9 test protokolü + promt 3 kabul testleri — template3 (daisyUI). Çalıştır: node test/protokol.js [yalniz=<ad,ad>]
// Sonuçlar: test/sonuc.json + _referans/sonuc-*.jpg
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8801/50-website/template3/';
const REF = path.join(__dirname, '../../_referans');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
const SONUC_DOSYA = path.join(__dirname, 'sonuc.json');
const SONUC = fs.existsSync(SONUC_DOSYA) ? JSON.parse(fs.readFileSync(SONUC_DOSYA, 'utf8')) : {};
const YALNIZ = (process.argv.find((a) => a.startsWith('yalniz=')) || '').slice(7).split(',').filter(Boolean);
const kos = (ad) => !YALNIZ.length || YALNIZ.includes(ad);
const kayit = (ad, gecti, not) => { SONUC[ad] = { gecti: !!gecti, not }; console.log(gecti ? 'GEÇTİ ' : 'KALDI ', ad, not != null ? JSON.stringify(not).slice(0, 600) : ''); };

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
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ornek: v.nodes.slice(0, 3).map((x) => x.target.join(' ')) }));
  });
}
const DIL = '#site-header .navbar-end [data-lang="en"]';
const DIL_TR = '#site-header .navbar-end [data-lang="tr"]';

(async () => {
  const browser = await chromium.launch();

  /* 1–2. Konsol ve taşma */
  if (kos('1')) {
    const sayfalar = ['', 'blog/index.html', 'blog/insulin-direnci-beslenme.html', 'kvkk.html'];
    const konsol = {}, tasma = {};
    for (const s of sayfalar) {
      for (const w of [1440, 390]) {
        for (const lang of [null, 'en']) {
          const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900, lang });
          await page.goto(BASE + s, { waitUntil: 'networkidle' });
          await tembel(page);
          const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
          tasma[(s || 'index') + '@' + w + (lang ? '-en' : '')] = sw;
          if (w === 1440 && !lang) konsol[s || 'index'] = page._hatalar.slice();
          await ctx.close();
        }
      }
    }
    kayit('1 konsol', Object.values(konsol).every((a) => a.length === 0), konsol);
    kayit('2 tasma', Object.values(tasma).every(([a, b]) => a <= b), tasma);
  }

  /* 3. Sözleşme + 4. Randevu */
  if (kos('3')) {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const eksik0 = await page.evaluate((L) => L.filter((s) => !document.querySelector(s)), SECICILER);
    await page.locator('[data-recipe]').first().click();
    await page.click('#recipe-dialog [data-close]');
    await page.click('#chat-toggle'); await page.waitForSelector('[data-intent]'); await page.click('[data-chat-close]');
    const eksik = await page.evaluate((L) => L.filter((s) => !document.querySelector(s)), SECICILER);
    kayit('3 sozlesme', eksik.length === 0, { eksik, ilkYuklemedeOlmayan: eksik0 });

    await page.click('[data-next="2"]');
    await page.waitForSelector('.cal-day');
    const cal = await page.evaluate(() => ({
      calDay: !!document.querySelector('.cal-day.btn.btn-sm'),
      secili: !!document.querySelector('.cal-day.btn-primary[aria-pressed="true"]'),
      kapali: document.querySelectorAll('.cal-day.btn-disabled').length,
      slot: !!document.querySelector('.slot.btn.btn-outline'),
    }));
    kayit('3 sozlesme (.cal-day/.slot + daisyUI sınıfları)', cal.calDay && cal.secili && cal.kapali > 0 && cal.slot, cal);
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    const slotSecili = await page.evaluate(() => !!document.querySelector('.slot.btn-primary[aria-pressed="true"]'));
    await page.click('[data-next="3"]');
    await page.waitForSelector('[data-step="3"]:not([hidden])');
    await page.click('[data-next="4"]');
    const hatalar = await page.evaluate(() => ['b-name-err', 'b-phone-err', 'b-email-err', 'b-kvkk-err'].map((id) => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    await eleman(page, '[data-booking]', 'sonuc-fieldset-hata.jpg');
    await page.click('[data-goto="1"]');
    await page.check('input[name="type"][value="first"]');
    await page.check('input[name="area"][value="weight"]');
    await page.check('input[name="staff"][value="any"]');
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
    const yukleniyor = await page.evaluate(() => { const s = document.querySelector('[data-submit] .loading'); return s && getComputedStyle(s).display !== 'none'; });
    await page.waitForSelector('[data-step="done"]:not([hidden])', { timeout: 10000 });
    const done = await page.evaluate(() => {
      const d = document.querySelector('[data-step="done"]');
      return { alert: !!d.querySelector('.alert.alert-success'), ref: (d.querySelector('.ref span') || {}).textContent, gcal: !!d.querySelector('a[href*="calendar.google.com"]'), adimlar: [...document.querySelectorAll('[data-stepper] .step-primary')].length };
    });
    await eleman(page, '[data-booking]', 'sonuc-randevu-onay.jpg');
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('[data-step="done"] .btn-primary')]);
    await page.click('[data-open-cancel]');
    const iptalAcik = await page.evaluate(() => document.getElementById('cancel-dialog').open);
    await page.click('#cancel-form button[type="submit"]');
    const iptalHata = await page.evaluate(() => !!document.getElementById('x-ref-err').textContent.trim() && !!document.getElementById('x-email-err').textContent.trim());
    await page.waitForTimeout(250);
    await page.screenshot(jpg('sonuc-modal-iptal.jpg'));
    kayit('4 randevu', hatalar === 4 && ozet >= 7 && done.alert && /^MZ-/.test(done.ref || '') && done.gcal && dl && iptalAcik && iptalHata && slotSecili && yukleniyor,
      { bosFormHata: hatalar, ozetSatir: ozet, done, slotSecili, yukleniyorGorundu: yukleniyor, ics: dl ? dl.suggestedFilename() : null, iptalAcik, iptalHata });
    await ctx.close();
  }

  /* 5. Araçlar */
  if (kos('5')) {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + '#araclar', { waitUntil: 'networkidle' });
    await page.fill('#bmi-height', '170'); await page.dispatchEvent('#bmi-height', 'change');
    await page.fill('#bmi-weight', '70'); await page.dispatchEvent('#bmi-weight', 'change');
    await page.waitForTimeout(300);
    const vki = await page.textContent('[data-result="bmi"] .result-num');
    const vkiOlcek = await page.evaluate(() => ({ progress: !!document.querySelector('[data-result="bmi"] progress.progress'), radial: !!document.querySelector('#araclar .radial-progress'), stat: document.querySelectorAll('[data-result="bmi"] > .stat').length }));
    await eleman(page, '#tool-bmi', 'sonuc-stat-vki.jpg');
    await page.click('#tab-kcal');
    await page.waitForTimeout(200);
    const kcal = await page.textContent('[data-result="kcal"] .result-num');
    await page.click('#tab-water');
    await page.waitForTimeout(200);
    await page.click('[data-result="water"] .water-glass >> nth=2');
    await page.reload({ waitUntil: 'networkidle' });
    await page.click('#tab-water');
    const dolu = await page.evaluate(() => document.querySelectorAll('[data-result="water"] .water-glass.is-full').length);
    kayit('5 araclar', vki.trim() === '24,2' && /\d/.test(kcal) && dolu === 3 && vkiOlcek.progress && !vkiOlcek.radial, { vki, kcal, doluBardakYenilemeSonrasi: dolu, vkiOlcek });
    await ctx.close();
  }

  /* 6. Program ve tarifler */
  if (kos('6')) {
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
    await eleman(page, '#tarifler', 'sonuc-filter-secili.jpg');
    await page.click('[data-cat="all"]');
    const n2 = await page.locator('[data-recipe]').count();
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
        await page.waitForTimeout(250);
        await page.screenshot(jpg('sonuc-modal.jpg'));
      }
      await page.click('#recipe-dialog [data-close]');
    }
    kayit('6 program-tarif', g0 !== g1 && t0 !== t1 && n1 < n0 && n2 === n0 && scaled && scaled.q0 !== scaled.q1 && scaled.porsiyon === '3', { gunDegisti: g0 !== g1, toplam: [t0, t1], tarif: [n0, n1, n2], scaled });
    await ctx.close();
  }

  /* 7. Sohbet */
  if (kos('7')) {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('#chat-toggle');
    await page.waitForTimeout(400);
    const acik = await page.evaluate(() => document.body.classList.contains('chat-open') && !document.getElementById('chat').inert);
    const sor = async (t) => {
      const n = await page.locator('#chat-log .msg--bot:not(.typing)').count();
      await page.fill('#chat-input', t); await page.press('#chat-input', 'Enter');
      await page.waitForFunction((k) => document.querySelectorAll('#chat-log .msg--bot:not(.typing)').length > k, n, { timeout: 8000 });
      return page.evaluate(() => { const b = document.querySelectorAll('#chat-log .msg--bot:not(.typing) .chat-bubble'); return b[b.length - 1].textContent; });
    };
    const fiyat = await sor('ücretler');
    const randevu = await sor('randevu');
    const yapi = await page.evaluate(() => ({
      bot: !!document.querySelector('#chat-log .chat.chat-start > .chat-bubble'),
      kullanici: !!document.querySelector('#chat-log .chat.chat-end > .chat-bubble'),
      header: !!document.querySelector('#chat-log .chat > .chat-header'),
      footer: !!document.querySelector('#chat-log .chat > .chat-footer'),
      kokSinifi: document.getElementById('chat').className,
    }));
    await page.screenshot(jpg('sonuc-chat.jpg'));
    const cb1 = await sor('beni arayın');
    const cb2 = await sor('Test Kişi');
    const cb3 = await sor('05321234567');
    kayit('7 sohbet', acik && /1\.800/.test(fiyat) && /\d{2}:\d{2}/.test(randevu) && /demo/i.test(cb3) && yapi.bot && yapi.kullanici && yapi.header && /chat-widget/.test(yapi.kokSinifi) && !/(^| )chat( |$)/.test(yapi.kokSinifi),
      { acik, fiyat: fiyat.slice(0, 80), randevu: randevu.slice(0, 80), cb: [cb1.slice(0, 50), cb2.slice(0, 50), cb3.slice(0, 80)], yapi });
    await ctx.close();
  }

  /* 8. Dil ve tema */
  if (kos('8')) {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('randevu').scrollIntoView());
    await page.click(DIL);
    await page.waitForTimeout(300);
    const trKalan = await page.evaluate(() => {
      const re = /[çğıöşüÇĞİÖŞÜ]/;
      const izin = /Selin|Emre|Zeynep|Tunalı|Karaca|Aksoy|Kadıköy|İstanbul|Türkiye|Moda|mizan|Mizan|Beslenme|KVKK|Dyt|Uzm|Çar|Pzt|Cmt|Sal|Per|Cum|şakşuka|ayran|simit|köfte|cacık|kısır|Türkçe/;
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
      // aria-label'dan gelen görünür radyo metinleri (daisyUI btn/filter radyoları)
      document.querySelectorAll('input[type=radio][aria-label]').forEach((i) => { const t = i.getAttribute('aria-label'); if (re.test(t) && !izin.test(t)) out.push('radio:' + t); });
      return out;
    });
    const enUrl = page.url();
    await page.click('#site-header [data-theme-toggle]');
    const koyu = await page.evaluate(() => document.documentElement.dataset.theme === 'dark' && getComputedStyle(document.querySelector('#site-header .swap-on')).opacity === '1');
    await page.reload({ waitUntil: 'networkidle' });
    const korundu = await page.evaluate(() => ({ tema: document.documentElement.dataset.theme, lang: document.documentElement.lang }));
    await page.click(DIL_TR);
    await page.click('#site-header [data-theme-toggle]');
    const geri = await page.evaluate(() => ({ tema: document.documentElement.dataset.theme, lang: document.documentElement.lang }));
    const { ctx: c2, page: p2 } = await yeniSayfa(browser);
    await p2.goto(BASE + '?lang=en', { waitUntil: 'networkidle' });
    const qEn = await p2.evaluate(() => document.documentElement.lang + ' | ' + document.querySelector('#hero-title').textContent.trim().replace(/\s+/g, ' '));
    await c2.close();
    kayit('8 dil-tema', trKalan.length === 0 && /lang=en/.test(enUrl) && koyu && korundu.tema === 'dark' && korundu.lang === 'en' && geri.tema === 'light' && geri.lang === 'tr' && /^en/.test(qEn),
      { trKalan, enUrl, koyu, korundu, geri, qEn });
    await ctx.close();
  }

  /* 9. Erişilebilirlik (axe) */
  if (kos('9')) {
    const sonuc = {};
    for (const [ad, yol, tema] of [['index-acik', '', 'light'], ['index-koyu', '', 'dark'], ['makale', 'blog/insulin-direnci-beslenme.html', 'light'], ['makale-koyu', 'blog/insulin-direnci-beslenme.html', 'dark'], ['blog-listesi', 'blog/index.html', 'light'], ['kvkk-koyu', 'kvkk.html', 'dark']]) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true });
      await page.goto(BASE + yol, { waitUntil: 'networkidle' });
      await tembel(page);
      sonuc[ad] = await axeKos(page);
      await ctx.close();
    }
    for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true, lang: tema === 'dark' ? 'en' : null });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.click('[data-next="2"]'); await page.waitForSelector('.slot');
      await page.click('.cal-day:not([disabled])'); await page.click('.slot:not([disabled])');
      sonuc['takvim-' + tema] = await axeKos(page);
      await page.click('[data-cat="soup"]');
      await page.locator('[data-recipe]').first().click(); await page.waitForTimeout(250);
      sonuc['tarif-penceresi-' + tema] = await axeKos(page);
      await page.click('#recipe-dialog [data-close]');
      await page.waitForTimeout(600); // modal kapanış geçişi (daisyUI) bitsin
      await page.click('#tab-water'); await page.waitForTimeout(150);
      sonuc['su-araci-' + tema] = await axeKos(page);
      await page.click('#chat-toggle'); await page.waitForSelector('[data-intent]');
      await page.waitForTimeout(500); // sohbet kabuğunun açılış geçişi bitsin
      sonuc['sohbet-' + tema] = await axeKos(page);
      await ctx.close();
    }
    const ciddi = Object.fromEntries(Object.entries(sonuc).map(([k, v]) => [k, v.filter((x) => x.impact === 'serious' || x.impact === 'critical')]));
    kayit('9 axe', Object.values(ciddi).every((v) => v.length === 0), { ciddi, tum: sonuc });
  }

  /* 10. Hareket azaltma */
  if (kos('10')) {
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
  if (kos('11')) {
    const { ctx, page } = await yeniSayfa(browser, { js: false });
    await page.goto(BASE, { waitUntil: 'load' });
    const r = await page.evaluate(() => ({
      gizliBolum: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).visibility === 'hidden').map((s) => s.id || s.className),
      metin: document.body.innerText.length,
      tema: document.documentElement.dataset.theme,
      bosSonuc: [...document.querySelectorAll('[data-result],[data-recipes],[data-meals]')].filter((e) => !e.textContent.trim()).length
    }));
    await page.screenshot(jpg('sonuc-jskapali-1440.jpg'));
    kayit('11 js-kapali', r.gizliBolum.length === 0 && r.metin > 5000 && r.tema === 'light', r);
    await ctx.close();
  }

  /* K1. Tema renkleri: emerald / forest ile getComputedStyle karşılaştırması */
  if (kos('k1')) {
    const olc = () => {
      const card = document.querySelector('.card.bg-base-100');
      const btn = document.querySelector('.btn.btn-primary');
      const cs = (e, p) => getComputedStyle(e)[p];
      return { cardBg: cs(card, 'backgroundColor'), cardText: cs(card, 'color'), primaryBg: cs(btn, 'backgroundColor'), primaryText: cs(btn, 'color'), radiusBox: cs(card, 'borderTopLeftRadius'), radiusField: cs(btn, 'borderTopLeftRadius') };
    };
    const refPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await refPage.goto('https://daisyui.com/components/card/', { waitUntil: 'networkidle' });
    const ref = {};
    for (const t of ['emerald', 'forest']) {
      // daisyui.com'un kendi sayfası: "Card" önizlemesindeki kart ve btn-primary
      await refPage.evaluate((t) => document.documentElement.setAttribute('data-theme', t), t);
      await refPage.waitForTimeout(800); // btn renk geçişi (0,2 sn) bitsin
      ref[t] = await refPage.evaluate(([t, src]) => {
        const pv = document.querySelector('.component-preview .preview');
        const card = pv.querySelector('.card'), btn = pv.querySelector('.btn-primary');
        const cs = (e, p) => getComputedStyle(e)[p];
        return { cardBg: cs(card, 'backgroundColor'), cardText: cs(card, 'color'), primaryBg: cs(btn, 'backgroundColor'), primaryText: cs(btn, 'color'), radiusBox: cs(card, 'borderTopLeftRadius'), radiusField: cs(btn, 'borderTopLeftRadius') };
      }, [t]);
    }
    await refPage.close();
    const biz = {};
    for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { tema });
      await page.goto(BASE + '#hizmetler', { waitUntil: 'networkidle' });
      biz[tema] = await page.evaluate(olc);
      await ctx.close();
    }
    const esit = (a, b) => Object.keys(a).every((k) => a[k] === b[k]);
    kayit('k1 tema-renkleri', esit(biz.light, ref.emerald) && esit(biz.dark, ref.forest), { light: biz.light, emerald: ref.emerald, dark: biz.dark, forest: ref.forest });
  }

  /* K2. Modal ve collapse klavyeyle */
  if (kos('k2')) {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + '#tarifler', { waitUntil: 'networkidle' });
    // Tarif penceresi: kart odakta → Enter açar, Tab pencere içinde kalır, Esc kapatır, odak karta döner
    await page.focus('[data-recipe]:first-child');
    await page.keyboard.press('Enter');
    await page.waitForSelector('#recipe-dialog[open]');
    const acikModal = await page.evaluate(() => ({ modal: document.getElementById('recipe-dialog').matches(':modal'), odakIcinde: document.getElementById('recipe-dialog').contains(document.activeElement) }));
    let disari = 0;
    // Pencere dışındaki sayfa öğesine odak geçmemeli (tarayıcı arayüzüne geçiş = body, doğal davranış)
    for (let i = 0; i < 25; i++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => { const a = document.activeElement; return a && a !== document.body && !document.getElementById('recipe-dialog').contains(a); })) disari++; }
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const kapandi = await page.evaluate(() => ({ acik: document.getElementById('recipe-dialog').open, odak: document.activeElement.matches('[data-recipe]') }));
    // Kapat düğmesi: Enter ile
    await page.keyboard.press('Enter');
    await page.waitForSelector('#recipe-dialog[open]');
    await page.focus('#recipe-dialog [data-close]');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(150);
    const kapatDugmesi = await page.evaluate(() => !document.getElementById('recipe-dialog').open);
    // İptal penceresi: [data-open-cancel] Enter
    await page.focus('[data-open-cancel]');
    await page.keyboard.press('Enter');
    const iptal = await page.evaluate(() => document.getElementById('cancel-dialog').open && document.getElementById('cancel-dialog').contains(document.activeElement));
    await page.keyboard.press('Escape');
    // Filter: klavye (ok tuşu) kategori değiştirir
    // Filtre: gerçek klavye akışı — bölüm başlığından Tab ile gruba gir, Space ile seç, ok tuşuyla değiştir
    await page.evaluate(() => { const h = document.getElementById('recipes-title'); h.tabIndex = -1; h.focus(); });
    const f0 = await page.locator('[data-recipe]').count();
    await page.keyboard.press('Tab');
    const f0odak = await page.evaluate(() => document.activeElement.dataset.cat);
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);
    const f1 = await page.locator('[data-recipe]').count();
    const f1cat = f0odak + '→' + await page.evaluate(() => document.querySelector('[data-cat]:checked').dataset.cat);
    // Collapse (SSS): summary odakta → Enter açar/kapar, Space de
    await page.focus('#sss details:nth-of-type(2) summary');
    const c0 = await page.evaluate(() => document.querySelector('#sss details:nth-of-type(2)').open);
    await page.keyboard.press('Enter');
    const c1 = await page.evaluate(() => document.querySelector('#sss details:nth-of-type(2)').open);
    await page.keyboard.press('Space');
    const c2 = await page.evaluate(() => document.querySelector('#sss details:nth-of-type(2)').open);
    await page.keyboard.press('Enter');
    const gorunur = await page.evaluate(() => getComputedStyle(document.querySelector('#sss details:nth-of-type(2) .collapse-content')).visibility);
    await eleman(page, '#sss', 'sonuc-collapse-klavye.jpg');
    // Özet (collapse) — dar ekranda kapalı başlar, klavyeyle açılır
    const { ctx: c3, page: p3 } = await yeniSayfa(browser, { w: 390, h: 844 });
    await p3.goto(BASE + '#randevu', { waitUntil: 'networkidle' });
    await p3.focus('[data-summary] summary');
    const o0 = await p3.evaluate(() => document.querySelector('[data-summary]').open);
    await p3.keyboard.press('Enter');
    const o1 = await p3.evaluate(() => document.querySelector('[data-summary]').open);
    await c3.close();
    kayit('k2 modal-collapse-klavye', acikModal.modal && acikModal.odakIcinde && disari === 0 && !kapandi.acik && kapandi.odak && kapatDugmesi && iptal && f1 < f0 && !c0 && c1 && !c2 && gorunur === 'visible' && !o0 && o1,
      { acikModal, tabDisariCikis: disari, kapandi, kapatDugmesi, iptal, filtre: [f0, f1, f1cat], sss: [c0, c1, c2, gorunur], ozet390: [o0, o1] });
    await ctx.close();
  }

  /* 12. Ekran görüntüleri */
  if (kos('12')) {
    const bilesenler = [
      ['#site-header', 'navbar'], ['#top', 'hero-figure'], ['.facts', 'stat'], ['#hizmetler', 'card'], ['.notes-panel', 'carousel'],
      ['#yaklasim', 'timeline'], ['#manifesto', 'hero-centered'], ['#uzmanlar', 'avatar'], ['#araclar', 'tab-box'], ['#program', 'tab-lift'],
      ['#tarifler', 'filter'], ['#ucretler', 'badge'], ['#randevu', 'steps'], ['#blog', 'card-side'], ['#sss', 'collapse'], ['.sky', 'hero-overlay'],
      ['#iletisim', 'fieldset'], ['.site-footer', 'footer']
    ];
    for (const tema of ['light', 'dark']) {
      const ek = tema === 'dark' ? '-dark' : '';
      const { ctx, page } = await yeniSayfa(browser, { tema, demoGoster: true });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await tembel(page);
      await eleman(page, '.demo-bar', `sonuc-demo-bar${ek}.jpg`);
      await page.click('.demo-bar-btn');
      await page.screenshot({ ...jpg(`sonuc-1440${ek}.jpg`), fullPage: true });
      for (const [sel, ad] of bilesenler) await eleman(page, sel, `sonuc-${ad}${ek}.jpg`);
      await page.click('[data-next="2"]');
      await page.waitForSelector('.slot');
      await page.click('.cal-day:not([disabled])');
      await page.click('.slot:not([disabled])');
      await eleman(page, '[data-step="2"]', `sonuc-randevu-takvim${ek}.jpg`);
      await page.evaluate(() => window.Mizan.toast('Referans kodu kopyalandı'));
      await page.waitForTimeout(300);
      await page.screenshot({ ...jpg(`sonuc-toast${ek}.jpg`), clip: { x: 900, y: 0, width: 540, height: 200 } });
      await page.locator('[data-recipe]').first().click();
      await page.waitForTimeout(300);
      await page.screenshot(jpg(`sonuc-modal${ek}.jpg`));
      await page.click('#recipe-dialog [data-close]');
      await page.click('#chat-toggle');
      await page.waitForTimeout(500);
      await page.fill('#chat-input', 'ücretler'); await page.press('#chat-input', 'Enter');
      await page.waitForTimeout(1500);
      await page.screenshot(jpg(`sonuc-chat${ek}.jpg`));
      await ctx.close();
    }
    for (const tema of ['light', 'dark']) {
      const ek = tema === 'dark' ? '-dark' : '';
      const { ctx, page } = await yeniSayfa(browser, { w: 390, h: 844, tema });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await tembel(page);
      await page.screenshot({ ...jpg(`sonuc-390${ek}.jpg`), fullPage: true });
      await page.click('#menu-btn');
      await page.waitForTimeout(250);
      const menu = await page.evaluate(() => ({ acik: getComputedStyle(document.getElementById('mobile-menu')).display !== 'none', inert: document.getElementById('mobile-menu').inert, expanded: document.getElementById('menu-btn').getAttribute('aria-expanded') }));
      await page.screenshot(jpg(`sonuc-navbar-mobil${ek}.jpg`));
      await page.click('#menu-btn');
      await page.waitForTimeout(400); // daisyUI dropdown kapanış geçişi (0,2 sn, display allow-discrete)
      const tiklaKapali = await page.evaluate(() => getComputedStyle(document.getElementById('mobile-menu')).display === 'none');
      await page.click('#menu-btn');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(400);
      const escKapali = await page.evaluate(() => getComputedStyle(document.getElementById('mobile-menu')).display === 'none');
      await page.click('#menu-btn');
      await page.click('#mobile-menu a[href$="#tarifler"]');
      await page.waitForTimeout(400);
      const linkKapali = await page.evaluate(() => getComputedStyle(document.getElementById('mobile-menu')).display === 'none');
      if (!ek) kayit('ek: mobil menu (dropdown)', menu.acik && !menu.inert && menu.expanded === 'true' && tiklaKapali && escKapali && linkKapali, { menu, tiklaKapali, escKapali, linkKapali });
      await ctx.close();
    }
    {
      const { ctx, page } = await yeniSayfa(browser, { clock: new Date('2026-09-28T08:00:00+03:00') });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await page.click('[data-next="2"]');
      await page.waitForSelector('.slot');
      await page.clock.fastForward('11:59:00');
      await page.clock.runFor(2000);
      const bos = await page.evaluate(() => !!document.querySelector('.slots-empty'));
      await eleman(page, '[data-slots]', 'sonuc-bos-gun.jpg');
      kayit('ek: bos gun durumu', bos, null);
      await ctx.close();
    }
    for (const [yol, ad] of [['blog/index.html', 'blog'], ['blog/insulin-direnci-beslenme.html', 'makale'], ['kvkk.html', 'kvkk']]) {
      for (const tema of ['light', 'dark']) {
        const { ctx, page } = await yeniSayfa(browser, { tema });
        await page.goto(BASE + yol, { waitUntil: 'networkidle' });
        await tembel(page);
        await page.screenshot({ ...jpg(`sonuc-${ad}-1440${tema === 'dark' ? '-dark' : ''}.jpg`), fullPage: true });
        await ctx.close();
      }
    }
  }

  fs.writeFileSync(SONUC_DOSYA, JSON.stringify(SONUC, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
