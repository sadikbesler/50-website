// 0.9 test protokolü (ORTAK KURALLAR) + AutoAnimate'e özgü denetimler.
// Kullanım: node protokol.js [taban-url]   → sonuçlar test/protokol-sonuc.json
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8801/50-website/template30/';
const REF = path.resolve(__dirname, '../../_referans');
const AXE = fs.readFileSync(path.resolve(__dirname, '../indirilen/axe-core/axe.min.js'), 'utf8');
const out = [];
const rec = (no, ad, gecti, not) => { out.push({ no, ad, gecti, not }); console.log((gecti ? 'GEÇTİ ' : 'KALDI ') + no + ' ' + ad + (not ? ' — ' + (typeof not === 'string' ? not : JSON.stringify(not)) : '')); };
const PAGES = ['', 'blog/index.html', 'blog/protein-ihtiyaci.html', 'kvkk.html'];
const CONTRACT = ['#site-header', '#next-slot', '#hizmetler', '#yaklasim', '#uzmanlar', '#araclar', '#program', '#tarifler', '#ucretler', '#randevu', '#blog', '#sss', '#iletisim',
  '#recipe-dialog', '#cancel-dialog', '#booking-form', '#cancel-form', '#x-email-err', '#x-ref-err', '#faq-schema',
  '#chat', '#chat-toggle', '#chat-log', '#chat-form', '#chat-input',
  '[data-close]', '[data-booking]', '[data-stepper]', '.bstep[data-step]', '[data-calendar]', '[data-slots]', '[data-prev]', '[data-next]', '[data-goto]',
  '[data-summary]', '[data-sum]', '[data-sum-fee]', '[data-review]', '[data-submit]', '[data-prep]', '[data-tz-note]', '[data-clock]', '[data-clock-date]',
  '[data-next-time]', '[data-next-meta]', '[data-next-book]', '[data-book-area]', '[data-book-type]', '[data-book-staff]', '[data-open-cancel]', '[data-cancel-status]',
  'form[data-tool]', '[data-result]', 'input[type=range][data-sync]', '#araclar [role=tab]',
  '[data-plan]', '[data-days]', '[data-day]', '[data-meals]', '[data-macros]', '[data-total]', '[data-tip]', '[data-program-book]',
  '[data-recipes]', '[data-recipe]', '[data-recipe-filters]', '[data-cat]', '[data-recipe-img]', '[data-recipe-content]', '.dialog-scroll', '.servings',
  '[data-chat-close]', '[data-chat-badge]', '[data-intent]', '[data-i18n]', '[data-i18n-attr]'];

async function main() {
  const browser = await chromium.launch();
  const mk = async (opts = {}) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'tr-TR', timezoneId: 'Europe/Istanbul', ...opts });
    await ctx.addInitScript(() => { try { sessionStorage.setItem('mizan-planet-seen', '1'); } catch (e) {} });
    return ctx;
  };
  const open = async (ctx, p = '', errs) => {
    const page = await ctx.newPage();
    if (errs) {
      page.on('pageerror', (e) => errs.push(p + ': ' + String(e)));
      page.on('console', (m) => { if (m.type() === 'error') errs.push(p + ': ' + m.text()); });
    }
    await page.goto(BASE + p, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const demo = await page.$('.demo-bar-btn');
    if (demo) await demo.click();
    return page;
  };
  const scrollThrough = (page) => page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    window.scrollTo(0, 0); await new Promise((r) => setTimeout(r, 300));
  });
  const T = async (no, ad, fn) => { try { await fn(); } catch (e) { rec(no, ad, false, 'hata: ' + String(e).slice(0, 200)); } };

  // 1) Konsol + 2) Taşma
  await T('1', 'Konsol hatası 0 (4 sayfa, hareket açık ve azaltılmış)', async () => {
    const errs = [];
    for (const rm of ['no-preference', 'reduce']) {
      const ctx = await mk({ reducedMotion: rm });
      for (const p of PAGES) { const page = await open(ctx, p, errs); await scrollThrough(page); await page.close(); }
      await ctx.close();
    }
    rec('1', 'Konsol hatası 0 (4 sayfa, hareket açık ve azaltılmış)', errs.length === 0, errs.length ? errs.slice(0, 5) : '0 hata');
  });
  await T('2', 'Yatay taşma yok (1440 ve 390)', async () => {
    const bad = [];
    for (const w of [1440, 390]) {
      const ctx = await mk({ viewport: { width: w, height: w === 390 ? 844 : 900 }, isMobile: w === 390, hasTouch: w === 390 });
      for (const p of PAGES) {
        const page = await open(ctx, p);
        await scrollThrough(page);
        const r = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
        if (r[0] > r[1]) bad.push(`${w} ${p || 'index'}: ${r[0]}>${r[1]}`);
        await page.close();
      }
      await ctx.close();
    }
    rec('2', 'Yatay taşma yok (1440 ve 390)', !bad.length, bad.length ? bad : '8/8 sayfa temiz');
  });

  const ctx = await mk();
  const errs = [];
  let page = await open(ctx, '', errs);

  // 3) Sözleşme
  await T('3', 'Seçici sözleşmesi', async () => {
    // Çalışma anında üretilenler ilgili an denetlenir (özgünde de böyle):
    // .cal-day/.slot randevu 2. adımda, .servings tarif penceresinde, [data-intent] sohbet açılınca
    const RUNTIME = ['.servings', '[data-intent]'];
    const missing = await page.evaluate((L) => L.filter((s) => !document.querySelector(s)), CONTRACT.filter((s) => !RUNTIME.includes(s)));
    await page.evaluate(() => document.querySelector('#randevu').scrollIntoView());
    await page.click('[data-next="2"]');
    await page.waitForTimeout(600);
    const rt = await page.evaluate(() => ['.cal-day', '.slot'].filter((s) => !document.querySelector(s)));
    await page.click('[data-prev="1"]');
    await page.evaluate(() => document.querySelector('#tarifler').scrollIntoView());
    await page.click('[data-recipes] .recipe-card');
    await page.waitForTimeout(400);
    if (!(await page.$('.servings'))) rt.push('.servings');
    await page.keyboard.press('Escape');
    await page.click('#chat-toggle');
    await page.waitForTimeout(500);
    if (!(await page.$('[data-intent]'))) rt.push('[data-intent]');
    await page.click('#chat-toggle');
    rec('3', 'Seçici sözleşmesi', !missing.length && !rt.length, missing.concat(rt).length ? missing.concat(rt) : `${CONTRACT.length} seçici tamam (.cal-day/.slot, .servings, [data-intent] çalışma anında)`);
  });

  // 4) Randevu (demo)
  await T('4', 'Randevu akışı (demo), .ics, iptal penceresi, boş form hataları', async () => {
    const notes = [];
    await page.evaluate(() => document.querySelector('#randevu').scrollIntoView());
    await page.click('input[name="type"][value="first"]', { force: true });
    await page.click('input[name="area"][value="weight"]', { force: true });
    await page.click('input[name="staff"][value="any"]', { force: true });
    await page.click('[data-next="2"]');
    await page.waitForTimeout(700);
    await page.$$eval('[data-calendar] .cal-day:not([disabled])', (a) => a[0].click());
    await page.waitForTimeout(700);
    await page.$$eval('[data-slots] .slot:not([disabled])', (a) => a.filter((b) => b.style.position !== 'absolute')[0].click());
    await page.click('[data-next="3"]');
    await page.waitForTimeout(400);
    // boş formda hatalar
    await page.click('[data-next="4"]');
    const emptyErr = await page.evaluate(() => ['b-name-err', 'b-phone-err', 'b-email-err', 'b-kvkk-err'].map((id) => document.getElementById(id).textContent.trim()).filter(Boolean).length);
    notes.push('boş form hata sayısı ' + emptyErr + '/4');
    await page.fill('#b-name', 'Test Kişi');
    await page.fill('#b-email', 'test@example.com');
    await page.fill('#b-phone', '05321234567');
    await page.check('input[name="kvkk"]', { force: true });
    await page.click('[data-next="4"]');
    await page.waitForTimeout(400);
    const review = await page.$eval('[data-review]', (e) => e.textContent.includes('Test Kişi'));
    notes.push('özet ' + (review ? 'var' : 'yok'));
    await page.click('[data-submit]');
    await page.waitForFunction(() => !document.querySelector('[data-step="done"]').hidden, null, { timeout: 8000 });
    const done = await page.evaluate(() => { const d = document.querySelector('[data-step="done"]'); return { text: d.textContent.slice(0, 80), ics: Array.from(d.querySelectorAll('button, a')).some((b) => /\.ics/.test(b.textContent)), google: !!d.querySelector('a[href*="calendar.google"]') }; });
    notes.push('onay ekranı; .ics ' + (done.ics ? 'var' : 'yok') + '; Google Takvim ' + (done.google ? 'var' : 'yok'));
    await page.click('[data-open-cancel]');
    await page.waitForTimeout(300);
    const dlg = await page.$eval('#cancel-dialog', (d) => d.open);
    await page.$eval('#cancel-form', (f) => f.requestSubmit ? f.requestSubmit() : f.submit());
    await page.waitForTimeout(200);
    const cErr = await page.evaluate(() => [document.getElementById('x-ref-err').textContent.trim(), document.getElementById('x-email-err').textContent.trim()].filter(Boolean).length);
    notes.push('iptal penceresi ' + (dlg ? 'açıldı' : 'açılmadı') + ', boş iptal hataları ' + cErr + '/2');
    await page.keyboard.press('Escape');
    rec('4', 'Randevu akışı (demo), .ics, iptal penceresi, boş form hataları', emptyErr === 4 && review && done.ics && dlg && cErr === 2, notes.join('; '));
  });

  // 5) Araçlar
  await T('5', 'Araçlar: VKİ 170/70 = 24,2; kalori; su bardağı yenilemede kalıyor', async () => {
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
    await page.evaluate(() => document.querySelector('#araclar').scrollIntoView());
    await page.evaluate(() => document.getElementById('tab-bmi').click());
    await page.fill('#bmi-height', '170'); await page.dispatchEvent('#bmi-height', 'change');
    await page.fill('#bmi-weight', '70'); await page.dispatchEvent('#bmi-weight', 'change');
    await page.waitForTimeout(300);
    const bmi = await page.$eval('[data-result="bmi"] .result-num', (e) => e.textContent.trim());
    await page.evaluate(() => document.getElementById('tab-kcal').click());
    await page.waitForTimeout(300);
    const kcal = await page.$eval('[data-result="kcal"] .result-num', (e) => e.textContent.trim()).catch(() => '');
    await page.evaluate(() => document.getElementById('tab-water').click());
    await page.waitForTimeout(300);
    await page.click('[data-result="water"] .glass[data-i="3"]');
    const before = await page.$$eval('[data-result="water"] .glass.is-full', (a) => a.length);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
    const after = await page.$$eval('[data-result="water"] .glass.is-full', (a) => a.length);
    rec('5', 'Araçlar: VKİ 170/70 = 24,2; kalori; su bardağı yenilemede kalıyor', bmi === '24,2' && !!kcal && before === 4 && after === 4, `VKİ ${bmi}; kalori ${kcal}; bardak ${before} → yenileme sonrası ${after}`);
  });

  // 6) Program ve tarifler
  await T('6', 'Program gün/hedef; tarif filtresi, pencere, porsiyon 2→3', async () => {
    await page.evaluate(() => document.querySelector('#program').scrollIntoView());
    const m0 = await page.$eval('[data-meals]', (e) => e.innerText);
    const d0 = await page.$eval('[data-days] [aria-selected="true"]', (e) => e.dataset.day);
    await page.click(`[data-days] [data-day="${(+d0 + 1) % 7}"]`);
    await page.waitForTimeout(500);
    const m1 = await page.$eval('[data-meals]', (e) => Array.from(e.children).filter((c) => c.style.position !== 'absolute').map((c) => c.innerText).join('\n'));
    await page.click('[data-plan="sport"]');
    await page.waitForTimeout(500);
    const m2 = await page.$eval('[data-meals]', (e) => Array.from(e.children).filter((c) => c.style.position !== 'absolute').map((c) => c.innerText).join('\n'));
    await page.evaluate(() => document.querySelector('#tarifler').scrollIntoView());
    const n0 = await page.$$eval('[data-recipes] .recipe-card', (a) => a.length);
    await page.click('[data-cat="breakfast"]');
    await page.waitForTimeout(400);
    const n1 = await page.$$eval('[data-recipes] .recipe-card', (a) => a.length);
    await page.click('[data-cat="all"]');
    await page.waitForTimeout(900);
    await page.click('[data-recipes] .recipe-card');
    await page.waitForTimeout(500);
    const dlg = await page.$eval('#recipe-dialog', (d) => d.open);
    const serv0 = await page.$eval('#recipe-dialog .servings output', (o) => +o.textContent);
    // porsiyonu 2'ye getir, sonra 3
    for (let i = 0; i < 12 && (await page.$eval('#recipe-dialog .servings output', (o) => +o.textContent)) > 2; i++) await page.click('#recipe-dialog .servings .icon-btn:first-child');
    for (let i = 0; i < 12 && (await page.$eval('#recipe-dialog .servings output', (o) => +o.textContent)) < 2; i++) await page.click('#recipe-dialog .servings .icon-btn:last-child');
    const q2 = await page.$$eval('#recipe-dialog .ingredients .qty', (a) => a.map((x) => x.textContent));
    await page.click('#recipe-dialog .servings .icon-btn:last-child');
    const q3 = await page.$$eval('#recipe-dialog .ingredients .qty', (a) => a.map((x) => x.textContent));
    await page.keyboard.press('Escape');
    const scaled = q2.some((q, i) => q !== q3[i]);
    rec('6', 'Program gün/hedef; tarif filtresi, pencere, porsiyon 2→3', m0 !== m1 && m1 !== m2 && n0 === 9 && n1 < n0 && dlg && scaled,
      `gün değişti: ${m0 !== m1}; hedef değişti: ${m1 !== m2}; tarif ${n0} → ${n1}; pencere ${dlg ? 'açık' : 'kapalı'} (başlangıç ${serv0} porsiyon); 2→3: "${q2[0]}" → "${q3[0]}"`);
  });

  // 7) Sohbet
  await T('7', 'Sohbet: ücretler, randevu, beni arayın (demo)', async () => {
    await page.evaluate(() => { sessionStorage.removeItem('mizan-chat'); });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
    await page.click('#chat-toggle');
    await page.waitForTimeout(600);
    const ask = async (text) => {
      const n = await page.$$eval('#chat-log .msg--bot:not(.typing)', (a) => a.length);
      await page.fill('#chat-input', text); await page.press('#chat-input', 'Enter');
      await page.waitForFunction((n) => document.querySelectorAll('#chat-log .msg--bot:not(.typing)').length > n && !document.querySelector('#chat-log .typing'), n, { timeout: 8000 });
      await page.waitForTimeout(300);
      return page.$$eval('#chat-log .msg--bot:not(.typing)', (a) => a.filter((m) => m.style.position !== 'absolute').pop().innerText);
    };
    const price = await ask('ücretler');
    const slot = await ask('randevu');
    await ask('beni arayın');
    await ask('Test Kişi');
    const cb = await ask('05321234567');
    const ok = /1\.800/.test(price) && /\d{2}:\d{2}/.test(slot) && /demo/i.test(cb);
    rec('7', 'Sohbet: ücretler, randevu, beni arayın (demo)', ok, `ücret: ${/1\.800/.test(price)}; saat: ${(slot.match(/\d{2}:\d{2}/) || ['yok'])[0]}; geri arama: "${cb.slice(0, 50)}…"`);
  });

  // 8) Dil ve tema
  await T('8', 'TR↔EN (sayfa ortasında), açık↔koyu, yenilemede korunuyor; ?lang=en Türkçe kalan 0', async () => {
    await page.evaluate(() => document.querySelector('#program').scrollIntoView());
    await page.waitForTimeout(400);
    await page.click('#site-header [data-lang="en"]');
    await page.waitForTimeout(500);
    const en = await page.evaluate(() => [document.documentElement.lang, document.querySelector('#program h2').innerText]);
    await page.click('#site-header [data-theme-toggle]');
    await page.waitForTimeout(300);
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
    const kept = await page.evaluate(() => [document.documentElement.lang, document.documentElement.getAttribute('data-theme')]);
    await page.click('#site-header [data-lang="tr"]');
    await page.click('#site-header [data-theme-toggle]');
    await page.waitForTimeout(300);
    const back = await page.evaluate(() => [document.documentElement.lang, document.documentElement.getAttribute('data-theme')]);
    // ?lang=en: görünen metinde Türkçe harf taşıyan düğüm (marka ve kişi adları hariç)
    const p2 = await ctx.newPage();
    await p2.goto(BASE + '?lang=en', { waitUntil: 'load' }); await p2.waitForTimeout(1500);
    const trLeft = await p2.evaluate(() => {
      const skip = /Mizan|Selin Karaca|Emre Aksoy|Zeynep Tunalı|Türkçe|İstanbul|Kadıköy|Moda|Caferağa|Beşiktaş|Şişli|Nişantaşı|Bağdat|Çiğdem|Türkiye/;
      // İngilizce cümle içinde bilinçli bırakılmış yemek adları (özgün içerik; halloumi, bulgur gibi)
      const dish = /\b(köfte|kısır|cacık)\b/gi;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const bad = [];
      while (w.nextNode()) {
        const n = w.currentNode, t = n.nodeValue.trim();
        if (!t || skip.test(t)) continue;
        if (/[ğüşöçıİĞÜŞÖÇ]/.test(t) && !/[ğüşöçıİĞÜŞÖÇ]/.test(t.replace(dish, ''))) { window.__dishes = (window.__dishes || 0) + 1; continue; }
        if (!/[ğüşöçıİĞÜŞÖÇ]/.test(t)) continue;
        const el = n.parentElement;
        if (el.closest('script,style,[lang="tr"],[hidden],template,noscript')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        bad.push(t.slice(0, 40));
      }
      return { bad, dishes: window.__dishes || 0 };
    });
    await p2.close();
    const dishes = trLeft.dishes;
    const left = trLeft.bad;
    const ok = en[0] === 'en' && theme === 'dark' && kept[0] === 'en' && kept[1] === 'dark' && back[0] === 'tr' && back[1] === 'light' && left.length === 0;
    rec('8', 'TR↔EN (sayfa ortasında), açık↔koyu, yenilemede korunuyor; ?lang=en Türkçe kalan 0', ok, `EN başlık "${en[1].replace(/\s+/g, ' ')}"; tema ${theme}; yenileme sonrası ${kept.join('/')}; geri ${back.join('/')}; ?lang=en Türkçe kalan ${left.length}${left.length ? ': ' + left.slice(0, 5).join(' | ') : ''} (İngilizce cümlede yemek adı köfte/kısır/cacık: ${dishes} düğüm, özgün içerik)`);
  });

  // 9) Erişilebilirlik (axe)
  await T('9', 'axe: ana sayfa açık/koyu + makale — ciddi/kritik 0', async () => {
    const res = {};
    for (const [ad, p, theme] of [['ana-açık', '', 'light'], ['ana-koyu', '', 'dark'], ['makale', 'blog/protein-ihtiyaci.html', 'light']]) {
      const c = await mk({ reducedMotion: 'reduce' });
      await c.addInitScript((t) => { try { localStorage.setItem('mizan-theme', t); } catch (e) {} }, theme);
      const pg = await open(c, p);
      await pg.evaluate(AXE);
      const r = await pg.evaluate(async () => { const x = await axe.run(document, { resultTypes: ['violations'] }); return x.violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length })); });
      res[ad] = r;
      await c.close();
    }
    const serious = Object.entries(res).flatMap(([k, v]) => v.filter((x) => x.impact === 'serious' || x.impact === 'critical').map((x) => `${k}: ${x.id} (${x.n})`));
    const rest = Object.entries(res).flatMap(([k, v]) => v.filter((x) => x.impact !== 'serious' && x.impact !== 'critical').map((x) => `${k}: ${x.id}/${x.impact} (${x.n})`));
    rec('9', 'axe: ana sayfa açık/koyu + makale — ciddi/kritik 0', !serious.length, serious.length ? serious : ('ciddi/kritik 0' + (rest.length ? '; kalan: ' + rest.join(', ') : '; kalan ihlal yok')));
  });

  // 10) Hareket azaltma (+ AutoAnimate hiçbir şey oynatmıyor)
  await T('10', 'Hareket azaltma: içerik görünür, sonsuz animasyon yok, AutoAnimate kapalı', async () => {
    const c = await mk({ reducedMotion: 'reduce' });
    const pg = await open(c, '');
    await scrollThrough(pg);
    const r = await pg.evaluate(async () => {
      const hidden = Array.from(document.querySelectorAll('main section, main h2, main p, main img')).filter((e) => {
        if (e.closest('[hidden], dialog, .bstep, [role="tabpanel"][hidden]')) return false;
        const cs = getComputedStyle(e);
        return cs.opacity === '0' || cs.visibility === 'hidden';
      }).map((e) => e.tagName + (e.id ? '#' + e.id : '') + '.' + String(e.className).slice(0, 30));
      const infinite = document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity).length;
      // Listeler değişirken WAAPI (AutoAnimate) animasyonu oluşmamalı
      const isAA = (a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition);
      let aa = 0;
      const count = () => { aa += document.getAnimations().filter(isAA).length; };
      document.querySelector('[data-days] [data-day="4"]').click(); await Promise.resolve(); count();
      document.querySelector('[data-plan="balance"]').click(); await Promise.resolve(); count();
      const w = document.getElementById('bmi-weight'); w.value = '95'; w.dispatchEvent(new Event('change', { bubbles: true })); await Promise.resolve(); count();
      document.querySelector('[data-next="2"]').click(); await new Promise((r) => setTimeout(r, 200));
      document.querySelectorAll('[data-calendar] .cal-day:not([disabled])')[1].click(); await Promise.resolve(); count();
      return { hidden, infinite, aa, aaAttr: document.querySelectorAll('[data-aa]').length };
    });
    await c.close();
    rec('10', 'Hareket azaltma: içerik görünür, sonsuz animasyon yok, AutoAnimate kapalı', !r.hidden.length && !r.infinite && !r.aa && !r.aaAttr, `gizli kalan ${r.hidden.length}${r.hidden.length ? ' ' + r.hidden.slice(0, 4).join(',') : ''}; sonsuz animasyon ${r.infinite}; liste değişiminde WAAPI animasyonu ${r.aa}; data-aa ${r.aaAttr}`);
  });

  // 11) JS kapalı
  await T('11', 'JS kapalı: içerik okunabiliyor, gizli bölüm yok', async () => {
    const c = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
    const pg = await c.newPage();
    await pg.goto(BASE, { waitUntil: 'load' });
    const r = await pg.evaluate(() => {
      const ids = ['top', 'hizmetler', 'yaklasim', 'uzmanlar', 'araclar', 'program', 'tarifler', 'ucretler', 'randevu', 'blog', 'sss', 'iletisim'];
      const bad = ids.filter((id) => { const e = document.getElementById(id); if (!e) return true; const cs = getComputedStyle(e); return cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0' || e.getBoundingClientRect().height < 50; });
      const h1 = document.querySelector('h1'); const hv = h1 && getComputedStyle(h1).opacity !== '0' && getComputedStyle(h1).visibility !== 'hidden';
      return { bad, h1: hv, text: document.body.innerText.length };
    });
    await pg.screenshot({ path: path.join(REF, 'sonuc-js-kapali-1440.jpg'), type: 'jpeg', quality: 70 });
    await c.close();
    rec('11', 'JS kapalı: içerik okunabiliyor, gizli bölüm yok', !r.bad.length && r.h1, `gizli/eksik bölüm ${r.bad.length ? r.bad.join(',') : 'yok'}; h1 görünür ${r.h1}; metin ${r.text} karakter`);
  });

  // 12) Ekran görüntüleri
  await T('12', 'Ekran görüntüleri (sonuc-1440, sonuc-390)', async () => {
    for (const w of [1440, 390]) {
      const c = await mk({ viewport: { width: w, height: w === 390 ? 844 : 900 }, reducedMotion: 'reduce', isMobile: w === 390 });
      const pg = await open(c, '');
      await scrollThrough(pg);
      await pg.screenshot({ path: path.join(REF, `sonuc-${w}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
      await c.close();
    }
    rec('12', 'Ekran görüntüleri (sonuc-1440, sonuc-390)', fs.existsSync(path.join(REF, 'sonuc-1440.jpg')) && fs.existsSync(path.join(REF, 'sonuc-390.jpg')), 'tam sayfa, hareket azaltılmış (sabitleme boşlukları olmadan düzen)');
  });

  rec('ek', 'Protokol boyunca ana sayfa konsol hatası', errs.length === 0, errs.length ? errs.slice(0, 5) : '0');
  fs.writeFileSync(path.join(__dirname, 'protokol-sonuc.json'), JSON.stringify(out, null, 1));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
