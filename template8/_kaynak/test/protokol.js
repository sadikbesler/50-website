// 0.9 test protokolü + promt 8 kabul testleri — template8 (AstroWind).
// Çalıştır: cd _kaynak/test && node protokol.js   → sonuc.json + _referans/sonuc-*.jpg
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const KOK = 'http://localhost:8801';
const BASE = KOK + '/50-website/template8/';
const REF = path.join(__dirname, '../../_referans');
const OZGUN = path.join(__dirname, '../ozgun');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
const SONUC = {};
const kayit = (ad, gecti, not) => {
  SONUC[ad] = { gecti: !!gecti, not };
  console.log(gecti ? 'GEÇTİ ' : 'KALDI ', ad, not != null ? JSON.stringify(not).slice(0, 500) : '');
};
const MAKALELER = ['insulin-direnci-beslenme', 'aralikli-oruc-16-8', 'gunluk-su-ihtiyaci', 'akdeniz-tipi-beslenme', 'protein-ihtiyaci', 'etiket-okuma-rehberi'];

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
  await page.waitForTimeout(400);
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
const kelimeler = (s) => s.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);

(async () => {
  const browser = await chromium.launch();

  /* 1–2. Konsol ve taşma */
  const sayfalar = ['', 'blog/', 'blog/insulin-direnci-beslenme.html', 'kvkk.html'];
  const konsol = {}, tasma = {};
  for (const s of sayfalar) {
    for (const w of [1440, 390]) {
      for (const tema of ['light', 'dark']) {
        const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900, tema });
        await page.goto(BASE + s, { waitUntil: 'networkidle' });
        await tembel(page);
        const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
        tasma[`${s || 'index'}@${w}/${tema}`] = sw;
        konsol[`${s || 'index'}@${w}/${tema}`] = page._hatalar.slice();
        await ctx.close();
      }
    }
  }
  kayit('1 konsol', Object.values(konsol).every((a) => a.length === 0), Object.fromEntries(Object.entries(konsol).filter(([, v]) => v.length)));
  kayit('2 tasma', Object.values(tasma).every(([a, b]) => a <= b), Object.fromEntries(Object.entries(tasma).filter(([, [a, b]]) => a > b)));

  /* 3. Sözleşme + 4. Randevu */
  {
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
    const calOk = await page.evaluate(() => !!document.querySelector('.cal-day') && !!document.querySelector('.slot'));
    kayit('3 sozlesme (.cal-day/.slot)', calOk);
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    await page.click('[data-next="3"]');
    await page.waitForSelector('[data-step="3"]:not([hidden])');
    await page.click('[data-next="4"]');
    const hatalar = await page.evaluate(() => ['b-name-err', 'b-phone-err', 'b-email-err', 'b-kvkk-err'].map((id) => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    await eleman(page, '[data-booking]', 'sonuc-form-hata.jpg');
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
    await page.check('#booking-form input[name="kvkk"]');
    await page.click('[data-next="4"]');
    await page.waitForSelector('[data-step="4"]:not([hidden])');
    const ozet = await page.evaluate(() => document.querySelectorAll('[data-review] .review-row').length);
    await eleman(page, '[data-booking]', 'sonuc-randevu-ozet.jpg');
    await page.click('[data-submit]');
    await page.waitForSelector('[data-step="done"]:not([hidden])', { timeout: 10000 });
    const done = await page.evaluate(() => {
      const d = document.querySelector('[data-step="done"]');
      return { ref: (d.querySelector('.ref span') || {}).textContent, gcal: !!d.querySelector('a[href*="calendar.google.com"]') };
    });
    await eleman(page, '[data-booking]', 'sonuc-randevu-onay.jpg');
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('[data-step="done"] .btn--primary')]);
    await page.click('[data-open-cancel]');
    const iptalAcik = await page.evaluate(() => document.getElementById('cancel-dialog').open);
    await page.click('#cancel-form button[type="submit"]');
    const iptalHata = await page.evaluate(() => !!document.getElementById('x-ref-err').textContent.trim() && !!document.getElementById('x-email-err').textContent.trim());
    await page.waitForTimeout(250);
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
    // Blog bağlantısı: sohbetin ürettiği yazı adresi 200 dönmeli
    const blogCevap = await sor('insülin direnci');
    const blogLink = await page.evaluate(() => { const a = [...document.querySelectorAll('#chat-log a[href*="blog/"]')].pop(); return a ? a.href : null; });
    let blogDurum = null;
    if (blogLink) blogDurum = (await fetch(blogLink.split('?')[0])).status;
    kayit('7 sohbet', acik && /1\.800/.test(fiyat) && /\d{2}:\d{2}/.test(randevu) && /demo/i.test(cb3), { acik, fiyat: fiyat.slice(0, 80), randevu: randevu.slice(0, 80), cb: [cb1.slice(0, 50), cb2.slice(0, 50), cb3.slice(0, 80)], blogCevap: blogCevap.slice(0, 60), blogLink, blogDurum });
    await ctx.close();
  }

  /* 8. Dil ve tema */
  const trKalanBul = () => {
    const re = /[çğıöşüÇĞİÖŞÜ]/;
    const izin = /Selin|Emre|Zeynep|Tunalı|Karaca|Aksoy|Kadıköy|İstanbul|Türkiye|Moda|mizan|Mizan|Beslenme|KVKK|Dyt|Uzm|Çar|Pzt|Cmt|Sal|Per|Cum|şakşuka|ayran|simit|köfte|cacık|kısır|Jäger|5\/2-ç/;
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, t = n.textContent.trim();
      if (!t || !re.test(t)) continue;
      const p = n.parentElement;
      if (p.closest('script,style,[hidden],[aria-hidden="true"],[lang="tr"]')) continue;
      if (getComputedStyle(p).display === 'none' || p.closest('[data-lang-block="tr"]')) continue;
      if (izin.test(t) && t.replace(new RegExp(izin.source, 'g'), '').match(re) === null) continue;
      out.push(t.slice(0, 60));
    }
    return out;
  };
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('randevu').scrollIntoView());
    await page.waitForTimeout(300);
    await page.click('#site-header [data-lang="en"]');
    await page.waitForTimeout(300);
    const trKalan = await page.evaluate(trKalanBul);
    const enUrl = page.url();
    await page.click('#site-header [data-theme-toggle]');
    const koyu = await page.evaluate(() => document.documentElement.classList.contains('dark') && document.documentElement.dataset.theme === 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    const korundu = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    await page.click('#site-header [data-lang="tr"]');
    await page.click('#site-header [data-theme-toggle]');
    const geri = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    // ?lang=en ve alt sayfalar
    const altSayfa = {};
    for (const y of ['', 'blog/', 'blog/protein-ihtiyaci.html', 'kvkk.html']) {
      const { ctx: c2, page: p2 } = await yeniSayfa(browser);
      await p2.goto(BASE + y + '?lang=en', { waitUntil: 'networkidle' });
      altSayfa[y || 'index'] = { lang: await p2.evaluate(() => document.documentElement.lang), title: await p2.title(), trKalan: await p2.evaluate(trKalanBul) };
      await c2.close();
    }
    const altTemiz = Object.values(altSayfa).every((v) => v.lang === 'en' && v.trKalan.length === 0);
    kayit('8 dil-tema', trKalan.length === 0 && /lang=en/.test(enUrl) && koyu && korundu.dark && korundu.lang === 'en' && !geri.dark && geri.lang === 'tr' && altTemiz,
      { trKalan, enUrl, koyu, korundu, geri, altSayfa });
    await ctx.close();
  }

  /* 9. Erişilebilirlik (axe) */
  {
    const sonuc = {};
    for (const [ad, yol, tema] of [['index-acik', '', 'light'], ['index-koyu', '', 'dark'], ['makale', 'blog/insulin-direnci-beslenme.html', 'light'], ['makale-koyu', 'blog/insulin-direnci-beslenme.html', 'dark'], ['blog', 'blog/', 'light'], ['kvkk-koyu', 'kvkk.html', 'dark']]) {
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
    await page.click('#chat-toggle'); await page.waitForTimeout(300);
    const r = await page.evaluate(() => ({
      sonsuz: document.getAnimations().filter((a) => a.effect && a.effect.getTiming().iterations === Infinity).map((a) => (a.effect.target && a.effect.target.className) || '?'),
      gizli: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).opacity === '0').map((s) => s.id || s.className),
      soluk: [...document.querySelectorAll('main section *')].filter((e) => getComputedStyle(e).opacity === '0' && e.getBoundingClientRect().height > 20 && !e.closest('#chat')).length,
    }));
    kayit('10 hareket-azaltma', r.sonsuz.length === 0 && r.gizli.length === 0 && r.soluk === 0, r);
    await ctx.close();
  }

  /* 11. JS kapalı */
  {
    const { ctx, page } = await yeniSayfa(browser, { js: false });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      gizliBolum: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).visibility === 'hidden').map((s) => s.id || s.className),
      soluk: [...document.querySelectorAll('main section > div')].filter((e) => getComputedStyle(e).opacity !== '1').map((e) => (e.closest('section') || {}).id || '?'),
      metin: document.body.innerText.length,
      notGorsel: [...document.querySelectorAll('.notes-panel img')].filter((i) => i.getBoundingClientRect().height > 50).length,
    }));
    await page.screenshot(jpg('sonuc-jskapali-1440.jpg'));
    kayit('11 js-kapali', r.gizliBolum.length === 0 && r.soluk.length === 0 && r.metin > 5000 && r.notGorsel === 7, r);
    await ctx.close();
  }

  /* Kabul A: AstroWind tokenları uygulanıyor mu (kaynak ölçümüyle) */
  {
    const olcum = JSON.parse(fs.readFileSync(path.join(__dirname, 'kaynak-olcum.json'), 'utf8')).ana;
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const cs = (sel, props) => { const s = getComputedStyle(document.querySelector(sel)); return Object.fromEntries(props.map((p) => [p, s[p]])); };
      return {
        body: cs('body', ['fontSize', 'color', 'backgroundColor', 'letterSpacing', 'fontFamily']),
        h1: cs('h1', ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']),
        h2: cs('#hizmetler h2', ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']),
        btnPrimary: cs('.btn-primary', ['backgroundColor', 'color', 'borderRadius', 'paddingTop', 'paddingLeft', 'fontSize', 'fontWeight']),
        sekmeSecili: cs('#araclar [role=tab][aria-selected="true"]', ['backgroundColor', 'color']),
        kart: cs('.tool-card', ['borderRadius', 'backgroundColor']),
      };
    });
    await ctx.close();
    const ayni = (a, b, ks) => ks.every((k) => a[k] === b[k]);
    const fontInter = /^Inter-/.test(r.body.fontFamily);
    const ok = fontInter && ayni(r.body, olcum.body, ['fontSize', 'color', 'backgroundColor', 'letterSpacing']) && ayni(r.h1, olcum.h1, ['fontSize', 'fontWeight', 'letterSpacing'])
      && ayni(r.h2, olcum.h2, ['fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']) && ayni(r.btnPrimary, olcum.btnPrimary, ['backgroundColor', 'color', 'borderRadius', 'fontWeight'])
      && r.sekmeSecili.backgroundColor === olcum.btnPrimary.backgroundColor && r.kart.borderRadius === '8px';
    kayit('kabul: AstroWind tokenlari', ok, { sonuc: r, kaynak: { body: olcum.body, h1: olcum.h1, h2: olcum.h2, btnPrimary: olcum.btnPrimary } });
  }

  /* Kabul B: bütün iç bağlantılar 200 (tarayıcı) */
  {
    const gorulen = new Set();
    const kuyruk = [BASE];
    const kirik = [];
    const kaynaklar = {};
    while (kuyruk.length) {
      const url = kuyruk.shift();
      if (gorulen.has(url)) continue;
      gorulen.add(url);
      const res = await fetch(url, { redirect: 'follow', headers: { connection: 'close' } });
      const govde = Buffer.from(await res.arrayBuffer()); // gövde her zaman tüketilir (soket açık kalmasın)
      if (res.status !== 200) { kirik.push([url, res.status, kaynaklar[url]]); continue; }
      const tip = res.headers.get('content-type') || '';
      if (!/html/.test(tip)) continue;
      const html = govde.toString('utf8');
      const adresler = [
        ...[...html.matchAll(/\s(?:href|src)="([^"]+)"/g)].map((m) => m[1]),
        ...[...html.matchAll(/\ssrcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((x) => x.trim().split(' ')[0])),
      ];
      for (const a of adresler) {
        if (!a || /^(mailto:|tel:|data:|#|javascript:)/.test(a)) continue;
        const tam = new URL(a.replace(/&amp;/g, '&'), url);
        if (tam.origin !== KOK) continue;
        tam.hash = ''; tam.search = '';
        const s = tam.toString();
        if (!gorulen.has(s) && !kuyruk.includes(s)) { kuyruk.push(s); kaynaklar[s] = url.replace(BASE, ''); }
      }
    }
    const sayfaSayisi = [...gorulen].filter((u) => /\/$|\.html$/.test(u)).length;
    kayit('kabul: ic baglantilar 200', kirik.length === 0, { taranan: gorulen.size, sayfa: sayfaSayisi, kirik });
  }

  /* Kabul C: makale metinleri — kelime sayısı ve metin kaynaktakiyle aynı */
  {
    const tablo = {};
    let hepsi = true;
    for (const slug of MAKALELER) {
      const { ctx, page } = await yeniSayfa(browser, { js: false });
      await page.goto('file://' + path.join(OZGUN, 'blog', slug + '.html'));
      const kaynak = await page.evaluate(() => {
          const tc = (s) => [...document.querySelectorAll(s)].map((e) => e.textContent).join(' ');
        const BLOK = 'h1,h2,h3,p,li,th,td';
        const bt = (s) => [...document.querySelectorAll(s)].flatMap((k) => [...k.querySelectorAll(BLOK)].filter((e) => !e.querySelector(BLOK))).map((e) => e.textContent).join(' ');
        return {
          tr: bt('.prose[data-lang-block="tr"]'), en: bt('.prose[data-lang-block="en"]'), kaynakca: bt('.prose.sources ol'),
          baslik: tc('h1 [data-lang-block="tr"]') + ' ' + tc('h1 [data-lang-block="en"]'),
          giris: tc('.article-head .lede [data-lang-block="tr"]') + ' ' + tc('.article-head .lede [data-lang-block="en"]'),
          h2: document.querySelectorAll('.prose[data-lang-block] h2').length, li: document.querySelectorAll('.prose[data-lang-block] li, .sources li').length,
          strong: document.querySelectorAll('.prose strong').length, em: document.querySelectorAll('.prose em').length, table: document.querySelectorAll('.prose table').length,
          td: document.querySelectorAll('.prose td').length, callout: document.querySelectorAll('.prose .callout').length,
          ids: [...document.querySelectorAll('.prose[data-lang-block] h2')].map((h) => h.id),
        };
      });
      await page.goto(BASE + 'blog/' + slug + '.html');
      const sonuc = await page.evaluate(() => {
        const tc = (s) => [...document.querySelectorAll(s)].map((e) => e.textContent).join(' ');
        const BLOK = 'h1,h2,h3,p,li,th,td';
        const bt = (s) => [...document.querySelectorAll(s)].flatMap((k) => [...k.querySelectorAll(BLOK)].filter((e) => !e.querySelector(BLOK))).map((e) => e.textContent).join(' ');
        return {
          tr: bt('.mizan-prose[data-lang-block="tr"]'), en: bt('.mizan-prose[data-lang-block="en"]'), kaynakca: bt('.mizan-sources ol'),
          baslik: tc('h1 [data-lang-block="tr"]') + ' ' + tc('h1 [data-lang-block="en"]'),
          giris: tc('article header p.text-muted [data-lang-block="tr"]') + ' ' + tc('article header p.text-muted [data-lang-block="en"]'),
          h2: document.querySelectorAll('.mizan-prose h2').length, li: document.querySelectorAll('.mizan-prose li, .mizan-sources li').length,
          strong: document.querySelectorAll('.mizan-prose strong').length, em: document.querySelectorAll('.mizan-prose em, .mizan-sources em').length, table: document.querySelectorAll('.mizan-prose table').length,
          td: document.querySelectorAll('.mizan-prose td').length, callout: document.querySelectorAll('.mizan-prose .callout').length,
          ids: [...document.querySelectorAll('.mizan-prose h2')].map((h) => h.id),
        };
      });
      await ctx.close();
      const satir = {};
      let ok = true;
      for (const k of ['tr', 'en', 'kaynakca', 'baslik', 'giris']) {
        const a = kelimeler(kaynak[k]), b = kelimeler(sonuc[k]);
        const esit = a.join(' ') === b.join(' ');
        satir[k] = `${a.length}/${b.length}${esit ? '' : ' METIN FARKLI'}`;
        if (!esit) ok = false;
      }
      for (const k of ['h2', 'li', 'strong', 'table', 'td', 'callout']) { satir[k] = `${kaynak[k]}/${sonuc[k]}`; if (kaynak[k] !== sonuc[k]) ok = false; }
      satir.em = `${kaynak.em}/${sonuc.em}`; if (kaynak.em !== sonuc.em) ok = false;
      satir.kimlikler = kaynak.ids.join() === sonuc.ids.join() ? 'aynı' : 'FARKLI';
      if (satir.kimlikler !== 'aynı') ok = false;
      satir.toplamKelime = `${['tr', 'en', 'kaynakca'].reduce((n, k) => n + kelimeler(kaynak[k]).length, 0)}/${['tr', 'en', 'kaynakca'].reduce((n, k) => n + kelimeler(sonuc[k]).length, 0)}`;
      tablo[slug] = satir;
      if (!ok) hepsi = false;
    }
    kayit('kabul: makale kelime sayilari', hepsi, tablo);
  }

  /* 12. Ekran görüntüleri */
  const bilesenler = [
    ['#site-header', 'Header'], ['#top', 'Hero'], ['.facts', 'Stats'], ['#hizmetler', 'Features'], ['.notes-panel', 'Gallery'],
    ['#yaklasim', 'Steps'], ['#manifesto', 'Note'], ['#uzmanlar', 'Team'], ['#araclar', 'Content-araclar'], ['#program', 'Content-program'],
    ['#tarifler', 'Content-tarifler'], ['#ucretler', 'Pricing'], ['#randevu', 'Content-randevu'], ['#blog', 'BlogLatestPosts'], ['#sss', 'FAQs'],
    ['.sky', 'CallToAction'], ['#iletisim', 'Contact'], ['.site-footer', 'Footer'],
  ];
  for (const tema of ['light', 'dark']) {
    const ek = tema === 'dark' ? '-dark' : '';
    const { ctx, page } = await yeniSayfa(browser, { tema, demoGoster: true, reduce: true });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await tembel(page);
    await eleman(page, '.demo-bar', `sonuc-demo-seridi${ek}.jpg`);
    await page.click('.demo-bar-btn');
    await page.screenshot({ ...jpg(`sonuc-1440${ek}.jpg`), fullPage: true });
    for (const [sel, ad] of bilesenler) await eleman(page, sel, `sonuc-${ad}${ek}.jpg`);
    await page.click('[data-next="2"]');
    await page.waitForSelector('.slot');
    await page.click('.cal-day:not([disabled])');
    await page.click('.slot:not([disabled])');
    await eleman(page, '[data-step="2"]', `sonuc-takvim${ek}.jpg`);
    await page.evaluate(() => window.Mizan.toast('Referans kodu kopyalandı'));
    await page.waitForTimeout(350);
    await eleman(page, '#toast', `sonuc-bildirim${ek}.jpg`);
    await page.locator('[data-recipe]').first().click();
    await page.waitForTimeout(300);
    await page.screenshot(jpg(`sonuc-tarif-penceresi${ek}.jpg`));
    await page.click('#recipe-dialog [data-close]');
    await page.click('#chat-toggle');
    await page.waitForTimeout(500);
    await page.screenshot(jpg(`sonuc-sohbet-acik${ek}.jpg`));
    await ctx.close();
  }
  for (const tema of ['light', 'dark']) {
    const ek = tema === 'dark' ? '-dark' : '';
    const { ctx, page } = await yeniSayfa(browser, { w: 390, h: 844, tema, reduce: true });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await tembel(page);
    await page.screenshot({ ...jpg(`sonuc-390${ek}.jpg`), fullPage: true });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click('[data-aw-toggle-menu]');
    await page.waitForTimeout(250);
    const menu = await page.evaluate(() => ({ acik: getComputedStyle(document.querySelector('#site-header nav')).display !== 'none', aria: document.querySelector('[data-aw-toggle-menu]').getAttribute('aria-expanded'), dil: !!document.querySelector('#site-header [data-lang="en"]').offsetParent }));
    await page.screenshot(jpg(`sonuc-nav-mobil-acik${ek}.jpg`));
    await page.click('#site-header nav a[href="#tarifler"]');
    await page.waitForTimeout(300);
    const kapali = await page.evaluate(() => getComputedStyle(document.querySelector('#site-header nav')).display === 'none');
    if (!ek) kayit('ek: mobil menu', menu.acik && menu.aria === 'true' && menu.dil && kapali, { menu, baglantiylaKapandi: kapali });
    await ctx.close();
  }
  // Boş gün: seçili günün saatleri geçince
  {
    const { ctx, page } = await yeniSayfa(browser, { clock: new Date('2026-09-28T08:00:00+03:00') });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('[data-next="2"]');
    await page.waitForSelector('.slot');
    await page.clock.fastForward('11:59:00');
    await page.clock.runFor(2000);
    const bos = await page.evaluate(() => !!document.querySelector('.slots-empty'));
    await eleman(page, '[data-slots]', 'sonuc-bos-gun.jpg');
    kayit('ek: bos gun durumu', bos);
    await ctx.close();
  }
  // Alt sayfalar
  for (const [yol, ad] of [['blog/', 'blog'], ['blog/insulin-direnci-beslenme.html', 'makale'], ['kvkk.html', 'kvkk']]) {
    for (const w of [1440, 390]) {
      for (const tema of ['light', 'dark']) {
        const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900, tema, reduce: true });
        await page.goto(BASE + yol, { waitUntil: 'networkidle' });
        await tembel(page);
        await page.screenshot({ ...jpg(`sonuc-${ad}-${w}${tema === 'dark' ? '-dark' : ''}.jpg`), fullPage: true });
        await ctx.close();
      }
    }
  }

  fs.writeFileSync(path.join(__dirname, 'sonuc.json'), JSON.stringify(SONUC, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
