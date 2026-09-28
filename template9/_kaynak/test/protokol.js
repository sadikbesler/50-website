// 0.9 test protokolü + promt 9 kabul maddeleri — template9 (AstroPaper). Çalıştır: node test/protokol.js
// Sonuçlar: test/sonuc.json + _referans/sonuc-*.jpg
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');

const BASE = 'http://localhost:8801/50-website/template9/';
const REF = path.join(__dirname, '../../_referans');
const DIST = path.join(__dirname, '../astro/dist');
const AXE = fs.readFileSync(path.join(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
const SONUC = {};
const kayit = (ad, gecti, not) => { SONUC[ad] = { gecti: !!gecti, not }; console.log(gecti ? 'GEÇTİ ' : 'KALDI ', ad, not != null ? JSON.stringify(not).slice(0, 500) : ''); };

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
  '#top', '.facts', '.notes-panel', '#manifesto', '.sky', '.site-footer', '.floating-actions'];

const SAYFALAR = [
  ['', 'index'], ['blog/index.html', 'blog'], ['blog/2/', 'blog-2'], ['blog/insulin-direnci-beslenme.html', 'makale'], ['kvkk.html', 'kvkk'],
  ['tags/', 'tags'], ['tags/insulin-direnci/', 'etiket'], ['archives/', 'archives'], ['search/', 'search'], ['about/', 'about'],
];

async function yeniSayfa(browser, { w = 1440, h = 900, tema = 'light', lang = null, demoGoster = false, js = true, reduce = false, clock = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: js, reducedMotion: reduce ? 'reduce' : 'no-preference', deviceScaleFactor: 1 });
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
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 25)); } window.scrollTo(0, 0); });
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
const durum = (url) => new Promise((res) => {
  http.get(url, (r) => { r.resume(); res(r.statusCode); }).on('error', () => res(0));
});
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

(async () => {
  const browser = await chromium.launch();

  /* 1–2. Konsol (CSP ihlalleri dahil) ve taşma — bütün sayfa türleri */
  const konsol = {}, tasma = {};
  for (const [s, ad] of SAYFALAR) {
    for (const w of [1440, 390]) {
      const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900 });
      await page.goto(BASE + s, { waitUntil: 'networkidle' });
      await tembel(page);
      tasma[ad + '@' + w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      if (w === 1440) konsol[ad] = page._hatalar.slice();
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

  /* 8. Dil ve tema (ana sayfa + bütün alt sayfalar EN'de Türkçe metin kalmıyor) */
  {
    const trKalanBul = (page) => page.evaluate(() => {
      const re = /[çğıöşüÇĞİÖŞÜ]/;
      const izin = /Selin|Emre|Zeynep|Tunalı|Karaca|Aksoy|Kadıköy|İstanbul|Türkiye|Moda|mizan|Mizan|Beslenme|KVKK|Dyt|Uzm|Çar|Pzt|Cmt|Sal|Per|Cum|şakşuka|ayran|simit|köfte|cacık|kısır|Özgür|5\/2-ç/;
      const out = [];
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) {
        const n = w.currentNode, t = n.textContent.trim();
        if (!t || !re.test(t)) continue;
        const p = n.parentElement;
        if (p.closest('script,style,[hidden],[aria-hidden="true"],[lang="tr"],.sr-only,.pagefind-ui__result-excerpt')) continue;
        if (getComputedStyle(p).display === 'none' || !p.getClientRects().length) continue;
        if (izin.test(t) && t.replace(new RegExp(izin.source, 'g'), '').match(re) === null) continue;
        out.push(t.slice(0, 60));
      }
      return out;
    });
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.getElementById('randevu').scrollIntoView());
    await page.click('#site-header [data-lang="en"]');
    await page.waitForTimeout(300);
    const trKalan = { index: await trKalanBul(page) };
    const enUrl = page.url();
    await page.click('#site-header [data-theme-toggle]');
    const koyu = await page.evaluate(() => document.documentElement.classList.contains('dark') && document.documentElement.dataset.theme === 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    const korundu = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    for (const [s, ad] of SAYFALAR.slice(1)) {
      await page.goto(BASE + s, { waitUntil: 'networkidle' });
      if (ad === 'search') { await page.fill('.pagefind-ui__search-input', 'insulin'); await page.waitForTimeout(1200); }
      trKalan[ad] = await trKalanBul(page);
    }
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.click('#site-header [data-lang="tr"]');
    await page.click('#site-header [data-theme-toggle]');
    const geri = await page.evaluate(() => ({ dark: document.documentElement.classList.contains('dark'), lang: document.documentElement.lang }));
    const { ctx: c2, page: p2 } = await yeniSayfa(browser);
    await p2.goto(BASE + '?lang=en', { waitUntil: 'networkidle' });
    const qEn = await p2.evaluate(() => document.documentElement.lang + ' | ' + document.querySelector('#hero-title').textContent.trim().replace(/\s+/g, ' '));
    await c2.close();
    const bos = Object.values(trKalan).every((a) => a.length === 0);
    kayit('8 dil-tema', bos && /lang=en/.test(enUrl) && koyu && korundu.dark && korundu.lang === 'en' && !geri.dark && geri.lang === 'tr' && /^en/.test(qEn),
      { trKalan, enUrl, koyu, korundu, geri, qEn });
    await ctx.close();
  }

  /* 9. Erişilebilirlik (axe) */
  {
    const sonuc = {};
    for (const [ad, yol, tema] of [['index-acik', '', 'light'], ['index-koyu', '', 'dark'], ['makale', 'blog/insulin-direnci-beslenme.html', 'light'], ['makale-koyu', 'blog/insulin-direnci-beslenme.html', 'dark'],
      ['blog', 'blog/', 'light'], ['etiket-koyu', 'tags/beslenme/', 'dark'], ['arsiv', 'archives/', 'light'], ['hakkimizda-koyu', 'about/', 'dark'], ['kvkk', 'kvkk.html', 'light']]) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true });
      await page.goto(BASE + yol, { waitUntil: 'networkidle' });
      await tembel(page);
      sonuc[ad] = await axeKos(page);
      await ctx.close();
    }
    for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { tema, reduce: true });
      await page.goto(BASE + 'search/?q=ins%C3%BClin', { waitUntil: 'networkidle' });
      await page.waitForSelector('.pagefind-ui__result', { timeout: 8000 }).catch(() => null);
      sonuc['arama-' + tema] = await axeKos(page);
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
    const r = await page.evaluate(() => ({
      sonsuz: document.getAnimations().filter((a) => a.effect && a.effect.getTiming().iterations === Infinity).map((a) => (a.effect.target && a.effect.target.className) || '?'),
      gizli: [...document.querySelectorAll('main section')].filter((s) => s.getBoundingClientRect().height < 10 || getComputedStyle(s).opacity === '0').map((s) => s.id || s.className),
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
      notlar: document.querySelectorAll('.notes-panel li').length,
      yazilar: document.querySelectorAll('#blog li a[href$=".html"]').length,
      enGizli: [...document.querySelectorAll('[data-lang-block="en"]')].every((e) => getComputedStyle(e).display === 'none'),
    }));
    await page.screenshot(jpg('sonuc-jskapali-1440.jpg'));
    kayit('11 js-kapali', r.gizliBolum.length === 0 && r.metin > 5000 && r.notlar === 7 && r.yazilar === 6 && r.enGizli, r);
    await ctx.close();
  }

  /* KABUL 1: /search "insülin" → insülin makalesi */
  {
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + 'search/', { waitUntil: 'networkidle' });
    await page.waitForSelector('.pagefind-ui__search-input');
    await page.fill('.pagefind-ui__search-input', 'insülin');
    await page.waitForSelector('.pagefind-ui__result-link', { timeout: 8000 });
    await page.waitForTimeout(600);
    const r = await page.evaluate(() => ({
      linkler: [...document.querySelectorAll('.pagefind-ui__result-title .pagefind-ui__result-link')].map((a) => a.getAttribute('href')),
      mesaj: (document.querySelector('.pagefind-ui__message') || {}).textContent,
      url: location.search,
    }));
    await page.screenshot({ ...jpg('sonuc-search-insulin-1440.jpg'), fullPage: true });
    const hedef = '/50-website/template9/blog/insulin-direnci-beslenme.html';
    const ilk = r.linkler[0] || '';
    const st = ilk ? await durum('http://localhost:8801' + ilk.split('#')[0]) : 0;
    kayit('kabul: arama "insülin"', ilk === hedef && st === 200, { ...r, ilkSonucDurum: st });
    await ctx.close();
  }

  /* KABUL 2: etiket sayfaları üretiliyor */
  {
    const beklenen = ['beslenme', 'insulin-direnci', 'su', 'protein', 'akdeniz', 'etiket-okuma'];
    const r = {};
    for (const t of beklenen) r[t] = [fs.existsSync(path.join(DIST, 'tags', t, 'index.html')), await durum(BASE + 'tags/' + t + '/')];
    const { ctx, page } = await yeniSayfa(browser);
    await page.goto(BASE + 'tags/', { waitUntil: 'networkidle' });
    const liste = await page.evaluate(() => [...document.querySelectorAll('main ul li a')].map((a) => a.textContent.trim()));
    await page.goto(BASE + 'tags/insulin-direnci/', { waitUntil: 'networkidle' });
    const kart = await page.evaluate(() => [...document.querySelectorAll('main li a[href$=".html"]')].map((a) => a.getAttribute('href')));
    await ctx.close();
    kayit('kabul: etiket sayfalari', beklenen.every((t) => r[t][0] && r[t][1] === 200) && liste.length === 6 && kart.some((h) => h.endsWith('insulin-direnci-beslenme.html')), { r, liste, insulinEtiketi: kart });
  }

  /* KABUL 3: bütün iç bağlantılar 200 (dist'teki her HTML; bağlantı + kaynak + #parça) */
  {
    const sayfalar = walk(DIST).filter((f) => f.endsWith('.html'));
    const kontrol = new Map(); // url → durum
    const idler = new Map(); // sayfa yolu → id kümesi
    const parcaHata = [];
    const idOku = (rel) => {
      if (idler.has(rel)) return idler.get(rel);
      const f = path.join(DIST, rel === '' ? 'index.html' : rel.replace(/\/$/, '/index.html'));
      const s = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
      const set = new Set([...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
      idler.set(rel, set);
      return set;
    };
    let toplam = 0;
    for (const f of sayfalar) {
      const html = fs.readFileSync(f, 'utf8');
      const rel = path.relative(DIST, f);
      const pageUrl = new URL(rel.replace(/index\.html$/, ''), BASE);
      for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
        const raw = m[1].replace(/&amp;/g, '&');
        if (/^(mailto:|tel:|data:|javascript:)/.test(raw)) continue;
        const u = new URL(raw, pageUrl);
        if (u.origin !== 'http://localhost:8801' || !u.pathname.startsWith('/50-website/template9/')) continue;
        toplam++;
        const key = u.origin + u.pathname;
        if (!kontrol.has(key)) kontrol.set(key, await durum(key));
        if (u.hash && u.hash.length > 1) {
          const hedefRel = u.pathname.replace('/50-website/template9/', '') || '';
          const id = decodeURIComponent(u.hash.slice(1));
          const ids = idOku(hedefRel === '' ? '' : hedefRel);
          // Ana sayfadaki bazı hedefler (#randevu vb.) ve JS'in eklediği kimlikler statik HTML'de var olmalı
          if (!ids.has(id)) parcaHata.push(`${rel} → ${raw}`);
        }
      }
    }
    const kotu = [...kontrol].filter(([, s]) => s !== 200);
    kayit('kabul: ic baglantilar 200', kotu.length === 0 && parcaHata.length === 0, { sayfa: sayfalar.length, baglanti: toplam, benzersiz: kontrol.size, kotu, parcaHata: parcaHata.slice(0, 20) });
  }

  /* KABUL 4 (promt 8 ile ortak kural): makale metni kelime kaybı olmadan taşındı.
     İki taraf aynı yöntemle sayılır (JS kapalı; metin düğümleri boşlukla birleştirilir):
     özgün = diyetisyen-v2 TR+EN gövde + TR/EN giriş paragrafı, sonuç = #article TR+EN bloğu − AstroPaper içindekiler. */
  {
    const slugs = JSON.parse(fs.readFileSync(path.join(__dirname, 'blog-kelime.json'), 'utf8')).map((x) => x.slug);
    const { ctx, page } = await yeniSayfa(browser, { js: false });
    const SAY = `(el) => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let t = []; while (w.nextNode()) t.push(w.currentNode.textContent); return t.join(' ').replace(/\\s+/g, ' ').trim().split(' ').filter(Boolean).length; }`;
    const r = {};
    for (const slug of slugs) {
      await page.goto('http://localhost:8801/50-website/diyetisyen-animasyon-v2/blog/' + slug + '.html', { waitUntil: 'load' });
      const ozgun = await page.evaluate((f) => {
        const say = eval(f);
        const q = (s) => document.querySelector(s);
        return { govde: say(q('.prose[data-lang-block="tr"]')) + say(q('.prose[data-lang-block="en"]')) + say(q('.article-head .lede')), kaynak: say(q('.prose.sources ol')) };
      }, SAY);
      await page.goto(BASE + 'blog/' + slug + '.html', { waitUntil: 'load' });
      const sonuc = await page.evaluate((f) => {
        const say = eval(f);
        const blok = (L) => {
          const el = document.querySelector(`#article [data-lang-block="${L}"]`).cloneNode(true);
          el.querySelectorAll('details, h2:first-of-type').forEach((n) => n.remove()); // AstroPaper içindekiler
          return say(el);
        };
        return { govde: blok('tr') + blok('en'), kaynak: say(document.querySelector('#kaynaklar + ol')) };
      }, SAY);
      r[slug] = { ozgun, sonuc };
    }
    await ctx.close();
    kayit('kabul: makale kelime sayisi', Object.values(r).every((x) => x.ozgun.govde === x.sonuc.govde && x.ozgun.kaynak === x.sonuc.kaynak), r);
  }

  /* 12. Ekran görüntüleri */
  const bolumler = [['#site-header', 'header'], ['#top', 'hero'], ['.facts', 'facts'], ['#hizmetler', 'hizmetler'], ['#uzmanlar', 'uzmanlar'], ['#araclar', 'araclar'],
    ['#program', 'program'], ['#tarifler', 'tarifler'], ['#ucretler', 'ucretler'], ['#randevu', 'randevu'], ['#blog', 'recent-posts'], ['#sss', 'sss'], ['#iletisim', 'iletisim'], ['.site-footer', 'footer']];
  for (const tema of ['light', 'dark']) {
    const ek = tema === 'dark' ? '-dark' : '';
    for (const w of [1440, 390]) {
      const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900, tema, demoGoster: w === 1440 });
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await tembel(page);
      if (w === 1440) {
        await eleman(page, '.demo-bar', `sonuc-demo-seridi${ek}.jpg`);
        await page.click('.demo-bar-btn');
      }
      await page.screenshot({ ...jpg(`sonuc-${w}${ek}.jpg`), fullPage: true });
      if (w === 1440) {
        for (const [sel, ad] of bolumler) await eleman(page, sel, `sonuc-bolum-${ad}${ek}.jpg`);
        await page.click('[data-next="2"]');
        await page.waitForSelector('.slot');
        await page.click('.cal-day:not([disabled])');
        await page.click('.slot:not([disabled])');
        await eleman(page, '[data-step="2"]', `sonuc-takvim${ek}.jpg`);
        await page.locator('[data-recipe]').first().click();
        await page.waitForTimeout(300);
        await page.screenshot(jpg(`sonuc-tarif-penceresi${ek}.jpg`));
        await page.click('#recipe-dialog [data-close]');
        await page.click('#chat-toggle');
        await page.waitForTimeout(500);
        await page.screenshot(jpg(`sonuc-sohbet-acik${ek}.jpg`));
      } else {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.click('#menu-btn');
        await page.waitForTimeout(200);
        const menu = await page.evaluate(() => ({ acik: getComputedStyle(document.getElementById('menu-items')).display !== 'none', aria: document.getElementById('menu-btn').getAttribute('aria-expanded') }));
        await page.screenshot(jpg(`sonuc-nav-mobil-acik${ek}.jpg`));
        if (!ek) kayit('ek: mobil menu', menu.acik && menu.aria === 'true', menu);
      }
      await ctx.close();
    }
  }
  // Kaynaktaki sayfalarla aynı adlandırma: sonuc-<sayfa>-<genişlik>(-dark).jpg ↔ kaynak-<sayfa>-…
  const eslesme = [['anasayfa', ''], ['posts', 'blog/'], ['makale', 'blog/insulin-direnci-beslenme.html'], ['tags', 'tags/'], ['etiket', 'tags/beslenme/'], ['archives', 'archives/'], ['search', 'search/?q=ins%C3%BClin'], ['about', 'about/'], ['kvkk', 'kvkk.html']];
  for (const [ad, yol] of eslesme) {
    for (const w of [1440, 390]) for (const tema of ['light', 'dark']) {
      const { ctx, page } = await yeniSayfa(browser, { w, h: w === 390 ? 844 : 900, tema });
      await page.goto(BASE + yol, { waitUntil: 'networkidle' });
      if (ad === 'search') await page.waitForSelector('.pagefind-ui__result', { timeout: 8000 }).catch(() => null);
      await tembel(page);
      await page.screenshot({ ...jpg(`sonuc-${ad}-${w}${tema === 'dark' ? '-dark' : ''}.jpg`), fullPage: true });
      await ctx.close();
    }
  }

  fs.writeFileSync(path.join(__dirname, 'sonuc.json'), JSON.stringify(SONUC, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
