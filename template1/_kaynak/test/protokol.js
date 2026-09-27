/* 0.9 test protokolü + Promt 1 kabul maddeleri — template1 (Preline UI).
   Çalıştırma: cd _kaynak/test && NODE_PATH=../node_modules node protokol.js
   Önizleme sunucusu: http://localhost:8801/50-website/template1/ */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8801/50-website/template1/';
const HERE = path.resolve(__dirname, '..', '..');
const REF = path.join(HERE, '_referans');
const AXE = fs.readFileSync(path.join(HERE, '_kaynak/indirilen/axe/package/axe.min.js'), 'utf8');
const out = [];
const log = (name, ok, note) => { out.push({ name, ok, note }); console.log((ok ? 'GEÇTİ ' : 'KALDI ') + name + (note ? ' — ' + note : '')); };

const CONTRACT = ['#site-header', '#next-slot', '#hizmetler', '#yaklasim', '#uzmanlar', '#araclar', '#program', '#tarifler', '#ucretler', '#randevu', '#blog', '#sss', '#iletisim',
  '#recipe-dialog', '#cancel-dialog', '#booking-form', '#cancel-form', '#x-email-err', '#x-ref-err', '#faq-schema',
  '#chat', '#chat-toggle', '#chat-log', '#chat-form', '#chat-input',
  '[data-close]', '[data-booking]', '[data-stepper]', '.bstep[data-step]', '[data-calendar]', '[data-slots]', '[data-prev]', '[data-next]', '[data-goto]',
  '[data-summary]', '[data-sum]', '[data-sum-fee]', '[data-review]', '[data-submit]', '[data-prep]', '[data-tz-note]', '[data-clock]', '[data-clock-date]',
  '[data-next-time]', '[data-next-meta]', '[data-next-book]', '[data-book-area]', '[data-book-type]', '[data-book-staff]', '[data-open-cancel]', '[data-cancel-status]',
  'form[data-tool]', '[data-result]', 'input[type=range][data-sync]', '#araclar [role=tab]',
  '[data-plan]', '[data-days]', '[data-day]', '[data-meals]', '[data-macros]', '[data-total]', '[data-tip]', '[data-program-book]',
  '[data-recipes]', '[data-recipe]', '[data-recipe-filters]', '[data-cat]', '[data-recipe-img]', '[data-recipe-content]', '.dialog-scroll',
  '[data-chat-close]', '[data-chat-badge]', '[data-i18n]', '[data-i18n-attr]',
  /* 0.3 bölüm tablosundaki sınıf seçicileri */
  '.facts', '.notes-panel', '#manifesto', '.sky', '.site-footer', '.floating-actions'];
/* Çalışma anında oluşanlar: .servings (tarif penceresi), [data-intent] (sohbet), .cal-day/.slot (randevu 2. adım) — ayrıca kontrol edilir */

async function ctxFor(b, o = {}) {
  const ctx = await b.newContext({ viewport: { width: o.w || 1440, height: o.h || 900 }, reducedMotion: o.rm ? 'reduce' : 'no-preference', javaScriptEnabled: o.js !== false, acceptDownloads: true });
  await ctx.addInitScript(([theme]) => {
    try { if (!localStorage.getItem('mizan-theme')) localStorage.setItem('mizan-theme', theme); } catch (e) {}
  }, [o.theme || 'light']);
  return ctx;
}
async function open(ctx, url) {
  const p = await ctx.newPage();
  p._errs = [];
  p.on('console', m => { if (m.type() === 'error') p._errs.push(m.text()); });
  p.on('pageerror', e => p._errs.push(e.message));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  return p;
}
const jsClick = (p, sel) => p.$eval(sel, e => e.click());
async function axe(p, label) {
  await p.evaluate(AXE);
  const r = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, t: v.nodes.slice(0, 3).map(x => x.target.join(' ')) })));
  const bad = r.filter(v => v.impact === 'serious' || v.impact === 'critical');
  log('axe ' + label, bad.length === 0, bad.length ? JSON.stringify(bad) : ('ciddi/kritik 0; kalan: ' + (r.map(v => v.id + '(' + v.impact + ', ' + v.n + ')').join(', ') || 'yok')));
}

(async () => {
  const b = await chromium.launch();

  /* 1 + 2: konsol ve taşma */
  for (const w of [1440, 390]) {
    const ctx = await ctxFor(b, { w, h: w === 390 ? 844 : 900 });
    for (const u of ['', 'blog/index.html', 'blog/akdeniz-tipi-beslenme.html', 'kvkk.html']) {
      const p = await open(ctx, BASE + u);
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } window.scrollTo(0, 0); });
      await p.waitForTimeout(500);
      const sw = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      log(`konsol ${w} /${u || 'index.html'}`, p._errs.length === 0, p._errs.join(' | '));
      log(`taşma ${w} /${u || 'index.html'}`, sw[0] <= sw[1], `scrollWidth ${sw[0]} / innerWidth ${sw[1]}`);
      await p.close();
    }
    await ctx.close();
  }

  /* 3: sözleşme + Preline yalnızca üç bileşeni başlatıyor mu + 4: randevu */
  {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE);
    const missing = await p.evaluate(L => L.filter(s => !document.querySelector(s)), CONTRACT);
    log('sözleşme seçicileri', missing.length === 0, missing.join(', '));
    const hs = await p.evaluate(() => {
      const names = Object.keys(window).filter(k => /^\$hs.*Collection$/.test(k));
      const used = names.map(k => [k, (window[k] || []).length]).filter(x => x[1] > 0);
      return { used, tabs: document.querySelectorAll('[data-hs-tab]').length, stepper: document.querySelectorAll('[data-hs-stepper]').length, dp: document.querySelectorAll('[data-hs-datepicker]').length };
    });
    const allowed = ['$hsOverlayCollection', '$hsAccordionCollection', '$hsDropdownCollection'];
    const extra = hs.used.filter(x => !allowed.includes(x[0]));
    log('Preline JS yalnızca offcanvas/accordion/dropdown', extra.length === 0 && hs.tabs + hs.stepper + hs.dp === 0, 'örnekler: ' + hs.used.map(x => x.join('=')).join(', ') + `; data-hs-tab ${hs.tabs}, data-hs-stepper ${hs.stepper}, data-hs-datepicker ${hs.dp}`);

    await p.evaluate(() => document.getElementById('randevu').scrollIntoView());
    const def = await p.evaluate(() => ['type', 'area', 'staff'].map(n => document.querySelector('#booking-form input[name="' + n + '"]:checked').value));
    await jsClick(p, '[data-step="1"] [data-next="2"]');
    await p.waitForTimeout(400);
    const stepState = await p.evaluate(() => [...document.querySelectorAll('[data-stepper] li')].map(li => li.className.includes('is-current') ? 'C' : li.className.includes('is-done') ? 'D' : '-').join(''));
    await p.evaluate(() => { const d = [...document.querySelectorAll('[data-calendar] .cal-day')].find(x => !x.disabled && !x.classList.contains('is-disabled')); d.click(); });
    await p.waitForTimeout(400);
    const slot = await p.evaluate(() => { const s = [...document.querySelectorAll('[data-slots] .slot')].find(x => !x.disabled); s.click(); return s.textContent; });
    const look = await p.evaluate(() => {
      const d = document.querySelector('.cal-day[aria-pressed="true"]'); const s = document.querySelector('.slot[aria-pressed="true"]');
      const bg = e => getComputedStyle(e).backgroundColor; const pr = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      return { day: d && bg(d), slot: s && bg(s), radius: d && getComputedStyle(d).borderRadius, size: d && d.getBoundingClientRect().width };
    });
    const contract2 = await p.evaluate(() => !!document.querySelector('.cal-day') && !!document.querySelector('.slot'));
    await jsClick(p, '[data-step="2"] [data-next="3"]');
    await p.waitForTimeout(300);
    await jsClick(p, '[data-step="3"] [data-next="4"]');
    await p.waitForTimeout(300);
    const errs = await p.evaluate(() => ['b-name-err', 'b-phone-err', 'b-email-err', 'b-kvkk-err'].map(id => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    log('randevu: boş formda hata mesajları', errs === 4, errs + '/4 hata mesajı');
    await p.fill('#b-name', 'Test Kişi');
    await p.fill('#b-email', 'test@example.com');
    await p.fill('#b-phone', '05321234567');
    await p.$eval('#booking-form input[name="kvkk"]', e => { e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); });
    await jsClick(p, '[data-step="3"] [data-next="4"]');
    await p.waitForTimeout(400);
    const review = await p.$eval('[data-review]', e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 100));
    await p.evaluate(() => document.querySelector('[data-booking]').scrollIntoView());
    await (await p.$('[data-booking]')).screenshot({ path: path.join(REF, 'sonuc-randevu-ozet.jpg'), type: 'jpeg', quality: 70 });
    await jsClick(p, '[data-submit]');
    await p.waitForSelector('[data-step="done"]:not([hidden])', { timeout: 8000 });
    await p.waitForTimeout(300);
    await (await p.$('[data-booking]')).screenshot({ path: path.join(REF, 'sonuc-randevu-onay.jpg'), type: 'jpeg', quality: 70 });
    const dl = p.waitForEvent('download', { timeout: 5000 }).catch(() => null);
    await p.evaluate(() => [...document.querySelectorAll('[data-step="done"] button')].find(x => /\.ics/.test(x.textContent)).click());
    const d = await dl;
    const icsName = d ? d.suggestedFilename() : '';
    const gcal = await p.$$eval('[data-step="done"] a[href*="calendar.google.com"]', a => a.length);
    log('randevu akışı (demo)', /\.ics$/.test(icsName) && gcal === 1 && contract2 && stepState === 'DC--', `varsayılanlar ${def.join('/')}, stepper ${stepState}, saat ${slot}, özet: "${review}…", .ics ${icsName || 'yok'}, Google ${gcal}`);
    log('takvim/saat Preline görünümü', look.radius === '9999px' || parseFloat(look.radius) >= 20, `seçili gün bg ${look.day}, ${Math.round(look.size)} px, radius ${look.radius}; seçili saat bg ${look.slot}`);
    await jsClick(p, '[data-open-cancel]');
    await p.waitForTimeout(300);
    const cOpen = await p.$eval('#cancel-dialog', d => d.open);
    await p.$eval('#cancel-form', f => f.requestSubmit ? f.requestSubmit() : f.submit());
    await p.waitForTimeout(300);
    const cErr = await p.evaluate(() => ['x-email-err', 'x-ref-err'].map(id => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    await (await p.$('#cancel-dialog')).screenshot({ path: path.join(REF, 'sonuc-modal-iptal.jpg'), type: 'jpeg', quality: 70 });
    log('iptal penceresi', cOpen && cErr === 2, `açık: ${cOpen}, boş gönderimde hata: ${cErr}/2`);
    log('konsol (randevu akışı)', p._errs.length === 0, p._errs.join(' | '));
    await ctx.close();
  }

  /* 5: araçlar */
  {
    const ctx = await ctxFor(b);
    let p = await open(ctx, BASE + '#araclar');
    await p.fill('#bmi-height', '170'); await p.fill('#bmi-weight', '70'); await p.dispatchEvent('#bmi-weight', 'change');
    await p.waitForTimeout(600);
    const bmi = await p.$eval('[data-result="bmi"] .result-num', e => e.textContent);
    log('VKİ 170/70', bmi === '24,2', 'sonuç ' + bmi);
    await p.focus('#tab-bmi'); await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(300);
    const tabKey = await p.evaluate(() => [document.activeElement.id, document.getElementById('tool-kcal').hidden]);
    const kcal = await p.$eval('[data-result="kcal"]', e => (e.querySelector('.result-num') || {}).textContent || '');
    log('kalori formu + sekmeler (tools.js, klavye)', /\d/.test(kcal) && tabKey[0] === 'tab-kcal' && tabKey[1] === false, `hedef ${kcal} kcal; ok tuşuyla odak ${tabKey[0]}`);
    await jsClick(p, '#tab-water');
    await p.waitForTimeout(300);
    await p.evaluate(() => document.querySelectorAll('[data-result="water"] .glass')[1].click());
    await p.close();
    p = await ctx.newPage();
    await p.goto(BASE + '#araclar', { waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    const full = await p.$$eval('[data-result="water"] .glass.is-full', a => a.length);
    log('su bardağı yenilemede kalıyor', full === 2, full + ' bardak dolu');
    await ctx.close();
  }

  /* 6: program + tarifler */
  {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE + '#program');
    const meals0 = await p.$eval('[data-meals]', e => e.textContent);
    await p.evaluate(() => document.querySelectorAll('[data-days] [data-day]')[2].click());
    await p.waitForTimeout(200);
    const meals1 = await p.$eval('[data-meals]', e => e.textContent);
    const tot0 = await p.$eval('[data-total]', e => e.textContent);
    await jsClick(p, '[data-plan="sport"]');
    await p.waitForTimeout(200);
    const tot1 = await p.$eval('[data-total]', e => e.textContent);
    log('program: gün ve hedef', meals0 !== meals1 && tot0 !== tot1, `toplam ${tot0.trim()} → ${tot1.trim()}`);
    const vis = () => p.$$eval('[data-recipes] [data-recipe]', a => a.filter(x => x.offsetParent !== null).length);
    const n0 = await vis();
    await jsClick(p, '[data-cat="breakfast"]');
    await p.waitForTimeout(400);
    const n1 = await vis();
    await jsClick(p, '[data-cat="all"]');
    await p.waitForTimeout(400);
    log('tarif filtresi', n0 !== n1, `${n0} → ${n1}`);
    await p.evaluate(() => document.querySelector('[data-recipes] [data-recipe]').click());
    await p.waitForTimeout(500);
    const dOpen = await p.$eval('#recipe-dialog', d => d.open);
    const ing = () => p.$eval('#recipe-dialog ul.ingredients', e => e.textContent.replace(/\s+/g, ' ').trim());
    const serv = () => p.$eval('#recipe-dialog .servings output', e => +e.textContent);
    while (await serv() > 2) await p.evaluate(() => document.querySelector('#recipe-dialog .servings .icon-btn:first-child').click());
    while (await serv() < 2) await p.evaluate(() => document.querySelector('#recipe-dialog .servings .icon-btn:last-child').click());
    const i2 = await ing();
    await p.evaluate(() => document.querySelector('#recipe-dialog .servings .icon-btn:last-child').click());
    const i3 = await ing();
    await (await p.$('#recipe-dialog')).screenshot({ path: path.join(REF, 'sonuc-modal.jpg'), type: 'jpeg', quality: 70 });
    log('tarif penceresi + porsiyon 2→3', dOpen && i2 !== i3 && await serv() === 3, `pencere açık: ${dOpen}; 2: "${i2.slice(0, 45)}…" 3: "${i3.slice(0, 45)}…"`);
    await p.keyboard.press('Escape');
    await p.waitForTimeout(300);
    log('tarif penceresi Esc ile kapanıyor', !(await p.$eval('#recipe-dialog', d => d.open)));
    log('konsol (program/tarif)', p._errs.length === 0, p._errs.join(' | '));
    await ctx.close();
  }

  /* 7: sohbet */
  {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE);
    const closedHidden = await p.$eval('#chat', e => getComputedStyle(e).display === 'none');
    await jsClick(p, '#chat-toggle');
    await p.waitForTimeout(500);
    const chatOpen = await p.$eval('#chat', e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().height > 0);
    const intents = await p.$$eval('#chat [data-intent]', a => a.length);
    const ask = async (t) => {
      const before = await p.$$eval('#chat-log > *', a => a.length);
      await p.fill('#chat-input', t);
      await p.$eval('#chat-form', f => f.requestSubmit());
      await p.waitForFunction(n => document.querySelectorAll('#chat-log > *').length >= n + 2 && !document.querySelector('#chat-log .typing'), before, { timeout: 8000 }).catch(() => {});
      await p.waitForTimeout(1200);
      return p.$eval('#chat-log', e => { const k = e.querySelectorAll('.msg--bot'); return k[k.length - 1].textContent.replace(/\s+/g, ' ').trim(); });
    };
    const r1 = await ask('ücretler');
    const r2 = await ask('randevu');
    await (await p.$('#chat')).screenshot({ path: path.join(REF, 'sonuc-chat-bubbles.jpg'), type: 'jpeg', quality: 70 });
    const r3 = await ask('beni arayın');
    const r4 = await ask('Test Kişi');
    const r5 = await ask('05321234567');
    log('sohbet kapalıyken gizli, açılıyor', closedHidden && chatOpen && intents > 0, `[data-intent] hızlı yanıt: ${intents}`);
    log('sohbet: ücretler', /TL/.test(r1), r1.slice(0, 90));
    log('sohbet: randevu', /\d{2}:\d{2}/.test(r2), r2.slice(0, 90));
    log('sohbet: beni arayın (demo)', /demo/i.test(r5), [r3, r4, r5].map(x => x.slice(0, 60)).join(' ⇒ '));
    log('konsol (sohbet)', p._errs.length === 0, p._errs.join(' | '));
    await ctx.close();
  }

  /* 8: dil ve tema (+ html.dark senkronu, footer dil menüsü) */
  {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE);
    await p.evaluate(() => document.getElementById('program').scrollIntoView());
    await p.waitForTimeout(400);
    await jsClick(p, '#site-header [data-lang="en"]');
    await p.waitForTimeout(600);
    const en = await p.evaluate(() => [document.documentElement.lang, document.querySelector('#araclar [role=tab] span').textContent]);
    await jsClick(p, '#site-header [data-theme-toggle]');
    await p.waitForTimeout(400);
    const th = await p.evaluate(() => [document.documentElement.dataset.theme, document.documentElement.classList.contains('dark')].join('/'));
    await p.reload({ waitUntil: 'networkidle' });
    await p.waitForTimeout(600);
    const kept = await p.evaluate(() => [document.documentElement.lang, document.documentElement.dataset.theme, document.documentElement.classList.contains('dark')].join(','));
    await jsClick(p, '#site-header [data-lang="tr"]');
    await jsClick(p, '#site-header [data-theme-toggle]');
    await p.waitForTimeout(400);
    const back = await p.evaluate(() => [document.documentElement.lang, document.documentElement.dataset.theme, document.documentElement.classList.contains('dark')].join(','));
    log('dil/tema geçişi + yenilemede korunuyor (html.dark dahil)', en[0] === 'en' && th === 'dark/true' && kept === 'en,dark,true' && back === 'tr,light,false', `orta sayfada EN: ${en.join(' / ')}; tema: ${th}; yenileme: ${kept}; geri: ${back}`);

    /* Footer'daki Preline dropdown ile dil değişimi */
    await p.evaluate(() => document.querySelector('.site-footer').scrollIntoView());
    await p.click('#hs-footer-language-dropdown');
    await p.waitForTimeout(400);
    const menuOpen = await p.$eval('#hs-footer-language-dropdown', e => e.getAttribute('aria-expanded'));
    await (await p.$('.site-footer')).screenshot({ path: path.join(REF, 'sonuc-footer-dil-menusu.jpg'), type: 'jpeg', quality: 70 });
    await p.click('.site-footer [role="menuitem"][data-lang="en"]');
    await p.waitForTimeout(600);
    const f1 = await p.evaluate(() => [document.documentElement.lang, document.querySelector('#hs-footer-language-dropdown [data-lang-block="en"]').hidden, document.querySelector('.site-footer [data-i18n="footer.legal"]').textContent]);
    await p.click('#hs-footer-language-dropdown');
    await p.waitForTimeout(300);
    await p.click('.site-footer [role="menuitem"][data-lang="tr"]');
    await p.waitForTimeout(600);
    const f2 = await p.evaluate(() => document.documentElement.lang);
    log('footer dil menüsü TR/EN değiştiriyor', menuOpen === 'true' && f1[0] === 'en' && f1[1] === false && f1[2] === 'Legal' && f2 === 'tr', `menü açık: ${menuOpen}; seçimden sonra ${f1[0]} ("${f1[2]}"); geri ${f2}`);
    log('konsol (dil/tema)', p._errs.length === 0, p._errs.join(' | '));
    await ctx.close();

    const c2 = await ctxFor(b);
    const q = await open(c2, BASE + '?lang=en');
    const tr = await q.evaluate(() => {
      const re = /[ğĞüÜşŞıİöÖçÇ]/; const res = new Set();
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) {
        const t = n.textContent.trim(); if (!t || !re.test(t)) continue;
        const pe = n.parentElement; if (!pe || pe.closest('script,style,[hidden],template,noscript')) continue;
        if (pe.closest('[lang="tr"]')) continue;
        res.add(t.slice(0, 60));
      }
      return [...res];
    });
    log('?lang=en Türkçe kalan metin (marka/kişi/adres hariç)', true, tr.length + ' düğüm: ' + tr.join(' | '));
    await c2.close();
  }

  /* Kabul: offcanvas menü klavye ve Esc ile */
  {
    const ctx = await ctxFor(b, { w: 390, h: 844 });
    const p = await open(ctx, BASE);
    await p.focus('#hs-header-base-collapse');
    await p.keyboard.press('Enter');
    await p.waitForTimeout(700);
    const o1 = await p.evaluate(() => { const m = document.getElementById('hs-header-base'); return { cls: m.classList.contains('open'), vis: getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().right > 100, exp: document.getElementById('hs-header-base-collapse').getAttribute('aria-expanded'), focusIn: m.contains(document.activeElement) }; });
    await p.screenshot({ path: path.join(REF, 'sonuc-ust-menu-offcanvas-390.jpg'), type: 'jpeg', quality: 70 });
    await p.keyboard.press('Tab');
    const tabIn = await p.evaluate(() => document.getElementById('hs-header-base').contains(document.activeElement));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(700);
    const o2 = await p.evaluate(() => { const m = document.getElementById('hs-header-base'); return { cls: m.classList.contains('open'), exp: document.getElementById('hs-header-base-collapse').getAttribute('aria-expanded') }; });
    /* bağlantıya tıklayınca kapanıyor mu */
    await p.click('#hs-header-base-collapse');
    await p.waitForTimeout(600);
    await p.click('#hs-header-base a[href="#uzmanlar"]');
    await p.waitForTimeout(800);
    const o3 = await p.evaluate(() => document.getElementById('hs-header-base').classList.contains('open'));
    log('offcanvas menü: Enter ile açılıyor, Esc ile kapanıyor', o1.cls && o1.vis && o1.exp === 'true' && tabIn && !o2.cls && o2.exp === 'false' && !o3, `açık: ${JSON.stringify(o1)}, Tab içeride: ${tabIn}; Esc sonrası: ${JSON.stringify(o2)}; bağlantı sonrası açık: ${o3}`);
    log('konsol (offcanvas)', p._errs.length === 0, p._errs.join(' | '));
    await ctx.close();
  }

  /* Kabul: SSS accordion klavyeyle */
  {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE + '#sss');
    const btn = '#faq-h3 .hs-accordion-toggle';
    await p.focus(btn);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(600);
    const a1 = await p.evaluate(() => ({ open: document.getElementById('faq-h3').classList.contains('active'), exp: document.querySelector('#faq-h3 .hs-accordion-toggle').getAttribute('aria-expanded'), h: document.getElementById('faq-c3').getBoundingClientRect().height, other: document.getElementById('faq-h1').classList.contains('active') }));
    await p.keyboard.press('Space');
    await p.waitForTimeout(600);
    const a2 = await p.evaluate(() => ({ open: document.getElementById('faq-h3').classList.contains('active'), exp: document.querySelector('#faq-h3 .hs-accordion-toggle').getAttribute('aria-expanded') }));
    const schema = await p.evaluate(() => JSON.parse(document.getElementById('faq-schema').textContent).mainEntity.length);
    log('SSS accordion klavyeyle (Enter açar, Space kapatır)', a1.open && a1.exp === 'true' && a1.h > 20 && !a2.open && a2.exp === 'false', `Enter: ${JSON.stringify(a1)}; Space: ${JSON.stringify(a2)}; FAQPage JSON-LD soru: ${schema}`);
    await ctx.close();
  }

  /* 9: axe */
  for (const theme of ['light', 'dark']) {
    const ctx = await ctxFor(b, { theme });
    const p = await open(ctx, BASE);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    await p.evaluate(() => document.getElementById('araclar').scrollIntoView());
    await p.waitForTimeout(800);
    await axe(p, 'ana sayfa ' + theme);
    await ctx.close();
  }
  for (const u of ['blog/akdeniz-tipi-beslenme.html', 'blog/index.html', 'kvkk.html']) {
    const ctx = await ctxFor(b);
    const p = await open(ctx, BASE + u);
    await axe(p, u);
    await ctx.close();
  }

  /* 10: hareket azaltma */
  {
    const ctx = await ctxFor(b, { rm: true });
    const p = await open(ctx, BASE);
    await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
    await p.waitForTimeout(600);
    const r = await p.evaluate(() => {
      const inf = document.getAnimations().filter(a => a.effect && a.effect.getComputedTiming().iterations === Infinity).map(a => (a.animationName || a.constructor.name) + ':' + (a.effect.target && a.effect.target.className));
      const hidden = [...document.querySelectorAll('main section')].filter(e => { const s = getComputedStyle(e); return s.visibility === 'hidden' || +s.opacity < 0.99; }).map(e => e.id || e.className).slice(0, 10);
      return { inf, hidden };
    });
    log('hareket azaltma', r.inf.length === 0 && r.hidden.length === 0, `sonsuz animasyon: ${r.inf.length ? r.inf.join(', ') : 0}; görünmeyen bölüm: ${r.hidden.length ? r.hidden.join(', ') : 0}`);
    await ctx.close();
  }

  /* 11: JS kapalı */
  {
    const ctx = await ctxFor(b, { js: false });
    const p = await ctx.newPage();
    await p.goto(BASE, { waitUntil: 'networkidle' });
    const ids = ['top', 'hizmetler', 'yaklasim', 'manifesto', 'uzmanlar', 'araclar', 'program', 'tarifler', 'ucretler', 'randevu', 'blog', 'sss', 'iletisim'];
    const res = [];
    for (const id of ids) res.push([id, await p.locator('#' + id).isVisible()]);
    const hiddenIds = res.filter(x => !x[1]).map(x => x[0]);
    const faqText = await p.locator('#faq-c1').isVisible();
    log('JS kapalı', hiddenIds.length === 0 && faqText, `görünmeyen bölüm: ${hiddenIds.join(', ') || 0}; ilk SSS yanıtı görünür: ${faqText}`);
    await ctx.close();
  }

  await b.close();
  fs.writeFileSync(path.join(__dirname, 'sonuc.json'), JSON.stringify(out, null, 2));
  console.log('\nÖZET: ' + out.filter(x => x.ok).length + ' geçti, ' + out.filter(x => !x.ok).length + ' kaldı');
})();
