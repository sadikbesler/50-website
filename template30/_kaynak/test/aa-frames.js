// Her AutoAnimate hedefinde değişim anını dondurup kare kare çeker ve
// sıçrama ölçer. Kareler _referans/sonuc-aa-<ad>.jpg şeridine birleşir;
// ölçümler _kaynak/test/aa-olcum.json'a yazılır.
// Yöntem: hedefte ilk değişimde (AutoAnimate kendi gözlemcisinde
// animasyonları kurduktan hemen sonra) bütün WAAPI animasyonları
// duraklatılır, currentTime ile ilerletilip kare alınır. O sırada GSAP'ın
// zaman çizelgesi de durdurulur.
// Sıçrama: yer değiştiren öğenin t=0'daki konumu değişimden önceki
// konumuyla, animasyonun sonundaki konumu da bittikten sonraki konumuyla
// aynı olmalı (fark px).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8801/50-website/template30/';
const REF = path.resolve(__dirname, '../../_referans');
const TMP = path.resolve(__dirname, '../indirilen/kareler');
fs.mkdirSync(TMP, { recursive: true });
const TIMES = [0, 60, 125, 190, 250, 375];
const report = {};

const HELPERS = () => {
  const isAA = (a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition) && a.effect && a.effect.target;
  // Sohbette günlüğün içerik koordinatı (günlük ya da sayfa kayınca değişmez)
  const box = (e) => { const r = e.getBoundingClientRect(); const c = e.closest('#chat-log'); if (!c) return { x: r.left, y: r.top }; const L = c.getBoundingClientRect(); return { x: r.left - L.left, y: r.top - L.top + c.scrollTop }; };
  window.__arm = (sel) => {
    const target = document.querySelector(sel);
    window.__frozen = null;
    window.__before = new Map();
    target.querySelectorAll('*').forEach((e) => window.__before.set(e, box(e)));
    // list-motion.js'in sohbette konum tazelemek için ekleyip çıkardığı gizli yoklama öğesi sayılmaz
    const probe = (n) => n.nodeName === 'SPAN' && n.hidden && !n.childNodes.length;
    const mo = new MutationObserver((records) => {
      if (records.every((r) => [...r.addedNodes, ...r.removedNodes].every(probe))) return;
      mo.disconnect();
      const anims = document.getAnimations().filter((a) => isAA(a) && target.contains(a.effect.target));
      anims.forEach((a) => a.pause());
      if (window.gsap) gsap.globalTimeline.pause();
      window.__anims = anims;
      window.__frozen = anims.map((a) => {
        const t = a.effect.target;
        const kf = a.effect.getKeyframes();
        const kind = kf.length === 3 ? 'giriş' : (t.style.position === 'absolute' && t.style.pointerEvents === 'none') ? 'çıkış' : 'yer değiştirme';
        a.__kind = kind;
        return { kind, cls: String(t.className || t.tagName), from: kf[0].transform };
      });
    });
    mo.observe(target, { childList: true, subtree: true });
  };
  window.__seek = (t) => (window.__anims || []).forEach((a) => { a.currentTime = Math.min(t, a.effect.getComputedTiming().endTime - 0.01); });
  // Yer değiştiren öğelerde başlangıç ve bitiş sıçraması (px)
  window.__jumps = () => {
    // Yalnızca görünen öğeler (sohbette günlüğün kırptığı mesajlar sayılmaz)
    const vis = (e) => { const r = e.getBoundingClientRect(); const c = e.closest('#chat-log'); const L = c ? c.getBoundingClientRect() : { top: 0, bottom: innerHeight }; return r.bottom > L.top && r.top < L.bottom; };
    const moving = (window.__anims || []).filter((a) => a.__kind === 'yer değiştirme' && vis(a.effect.target));
    window.__seek(0);
    const start = moving.map((a) => { const b = window.__before.get(a.effect.target); const n = box(a.effect.target); return b ? Math.hypot(n.x - b.x, n.y - b.y) : 0; });
    window.__seek(1e6);
    const ends = moving.map((a) => box(a.effect.target));
    (window.__anims || []).forEach((a) => a.finish());
    const end = moving.map((a, i) => { const n = box(a.effect.target); return Math.hypot(n.x - ends[i].x, n.y - ends[i].y); });
    const r = (v) => Math.round(v * 10) / 10;
    return { kayan: moving.length, maxBaslangic: r(Math.max(0, ...start)), maxBitis: r(Math.max(0, ...end)) };
  };
  window.__release = () => { (window.__anims || []).forEach((a) => a.finish()); window.__anims = []; if (window.gsap) gsap.globalTimeline.resume(); };
};

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('mizan-planet-seen', '1'); } catch (e) {} });
  const errors = [];
  const open = async () => {
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto(BASE, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    const demo = await page.$('.demo-bar-btn');
    if (demo) await demo.click();
    await page.evaluate(HELPERS);
    return page;
  };

  // ---- Deney: AutoAnimate tarif ızgarasında olsaydı (tileScroll ile) ----
  // Sayfaya geçici olarak bağlanır; filtre gibi kahvaltı dışı kartlar
  // çıkarılır, kalanlar yeniden dizilir. Kalıcı kodda bu bağlantı yok.
  {
    const page = await open();
    await page.evaluate(() => { const el = document.querySelector('[data-recipe-filters]'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 120); });
    await page.waitForTimeout(1800);
    report.deney_tarif_tileScroll = await page.evaluate(async () => {
      const grid = document.querySelector('[data-recipes]');
      window.autoAnimate(grid, { duration: 250, easing: 'ease-out' });
      await new Promise((r) => setTimeout(r, 1500));
      window.__arm('[data-recipes]');
      const gsapY = Array.from(grid.querySelectorAll('.recipe-card')).map((c) => Math.round(gsap.getProperty(c, 'y') * 10) / 10);
      Array.from(grid.querySelectorAll('.recipe-card')).forEach((c, i) => { if (i % 3) c.remove(); });
      await Promise.resolve();
      await new Promise((r) => requestAnimationFrame(r));
      const j = window.__jumps();
      window.__release();
      return { gsapY, ...j };
    });
    console.log('deney tarif', JSON.stringify(report.deney_tarif_tileScroll));
    await page.close();
  }

  const page = await open();
  async function frames(name, sel, trigger, clipSel) {
    await page.evaluate((s) => window.__arm(s), sel);
    await trigger();
    await page.waitForFunction(() => window.__frozen !== null, null, { timeout: 12000 });
    const info = await page.evaluate(() => window.__frozen);
    const clip = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); const y = Math.max(0, r.y - 12); return { x: Math.max(0, r.x - 12), y, width: Math.min(r.width + 24, 1440), height: Math.min(r.height + 24, 900 - y) }; }, clipSel || sel);
    const shots = [];
    for (const t of TIMES) {
      await page.evaluate((t) => window.__seek(t), t);
      const f = path.join(TMP, `${name}-${t}.png`);
      await page.screenshot({ path: f, clip });
      shots.push({ f, t });
    }
    const jumps = await page.evaluate(() => window.__jumps());
    await page.evaluate(() => window.__release());
    await page.waitForTimeout(450);
    const counts = info.reduce((m, a) => { m[a.kind] = (m[a.kind] || 0) + 1; return m; }, {});
    report[name] = { dagilim: counts, sicrama: jumps, ornek: info.slice(0, 6) };
    await strip(name, shots, clip);
    console.log(name, JSON.stringify(counts), JSON.stringify(jumps));
  }

  async function strip(name, shots, clip) {
    const cols = clip.width > 700 ? 3 : 6;
    const cell = Math.floor((1440 - 16 * (cols + 1)) / cols);
    const imgs = shots.map((s) => `<figure><img src="data:image/png;base64,${fs.readFileSync(s.f).toString('base64')}"><figcaption>${s.t} ms</figcaption></figure>`).join('');
    const p2 = await ctx.newPage();
    await p2.setViewportSize({ width: 1440, height: 900 });
    await p2.setContent(`<style>body{margin:0;background:#f4f1ea;font:600 15px system-ui}main{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:16px;padding:16px}figure{margin:0}img{width:100%;display:block;border:1px solid #ccc}figcaption{padding:4px 0}h1{font-size:16px;margin:16px 16px 0}</style><h1>AutoAnimate · ${name} · değişim anı (duration 250 ms, ease-out)</h1><main>${imgs}</main>`);
    await p2.waitForTimeout(100);
    await p2.screenshot({ path: path.join(REF, `sonuc-aa-${name}.jpg`), type: 'jpeg', quality: 70, fullPage: true });
    await p2.close();
  }

  const goTo = async (sel, offset = 120) => {
    await page.evaluate(([s, o]) => { const el = document.querySelector(s); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - o); }, [sel, offset]);
    await page.waitForTimeout(1800);
  };
  const setVal = async (sel, v) => { await page.fill(sel, String(v)); await page.dispatchEvent(sel, 'change'); };
  const settle = () => page.waitForTimeout(500);

  // 1) Program: gün ve hedef
  await goTo('#program [data-days]');
  await frames('program-gun', '[data-meals]', () => page.click('[data-days] [data-day="3"]'), '#program-print');
  report.gunler_tiklama = await page.evaluate(() => new Promise((res) => {
    const days = document.querySelector('[data-days]');
    const btn = days.querySelector('[data-day="5"]');
    btn.click();
    Promise.resolve().then(() => res({ ayniDugme: days.querySelector('[data-day="5"]') === btn, aaAnimasyon: document.getAnimations().filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition) && a.effect && days.contains(a.effect.target)).length }));
  }));
  await settle();
  await frames('program-hedef', '[data-meals]', () => page.click('[data-plan="sport"]'), '#program-print');

  // 2) Araçlar
  await goTo('#araclar');
  await setVal('#bmi-weight', 70); await settle();
  await frames('arac-vki', '[data-result="bmi"]', () => setVal('#bmi-weight', 95));
  await page.evaluate(() => document.getElementById('tab-kcal').click());
  await setVal('#kcal-age', 80); await settle();
  await goTo('[data-result="kcal"]', 40);
  await frames('arac-kalori', '[data-result="kcal"]', () => setVal('#kcal-weight', 36));
  await goTo('#araclar');
  await page.evaluate(() => document.getElementById('tab-water').click());
  await setVal('#water-exercise', 0); await settle();
  await goTo('[data-result="water"]', 40);
  await frames('arac-su', '[data-result="water"]', () => setVal('#water-exercise', 90));
  // Kaydırıcı sürüklerken yalnızca sayılar değişmeli: aynı düğümler, giriş/çıkış yok
  report.kaydirici = await page.evaluate(async () => {
    document.getElementById('tab-bmi').click();
    const out = document.querySelector('[data-result="bmi"]');
    const range = document.querySelector('form[data-tool="bmi"] input[type=range][data-sync="weight"]');
    // 62–66 kg / 168 cm: VKİ 22,0–23,4, kategori aynı kalır; yalnızca sayılar değişmeli
    range.value = '62'; range.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 500));
    const kids0 = Array.from(out.children);
    const seen = new Set();
    for (let v = 62.5; v <= 66; v += 0.5) {
      range.value = String(v);
      range.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((r) => requestAnimationFrame(r));
      document.getAnimations().filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition) && a.effect && out.contains(a.effect.target) && a.effect.getKeyframes().length === 3).forEach((a) => seen.add(a));
    }
    return { ayniCocuklar: kids0.every((k) => k.isConnected) && out.children.length === kids0.length, girisAnimasyonu: seen.size, sonVki: out.querySelector('.result-num').textContent };
  });
  console.log('kaydırıcı', JSON.stringify(report.kaydirici));

  // 3) Randevu saatleri: saat kümesi değişen bir güne geçiş
  await goTo('#randevu');
  await page.click('[data-next="2"]');
  await page.waitForTimeout(1500);
  const times = () => page.$$eval('[data-slots] .slot', (a) => a.filter((b) => b.style.position !== 'absolute').map((b) => b.dataset.time).join());
  const clickDay = (i) => page.$$eval('[data-calendar] .cal-day:not([disabled])', (a, i) => a[i] && a[i].click(), i);
  const n = await page.$$eval('[data-calendar] .cal-day:not([disabled])', (a) => a.length);
  await clickDay(0); await page.waitForTimeout(700);
  let found = -1;
  for (let i = 1; i < n && found < 0; i++) {
    const cur = await times();
    await clickDay(i); await page.waitForTimeout(700);
    if ((await times()) !== cur) found = i;
  }
  report.randevu_gecis_bulundu = found > 0;
  if (found > 0) {
    await clickDay(found - 1); await page.waitForTimeout(800);
    await frames('randevu-saatler', '[data-slots]', () => clickDay(found), '.datetime');
  }
  // Adım geçişi (hidden): AutoAnimate animasyonu olmamalı
  report.bstep_aa = await page.evaluate(async () => {
    document.querySelector('[data-prev="1"]').click();
    await Promise.resolve();
    return document.getAnimations().filter((a) => !(a instanceof CSSAnimation) && !(a instanceof CSSTransition) && a.effect && a.effect.target && a.effect.target.matches && a.effect.target.matches('.bstep')).length;
  });
  await settle();

  // 4) Sohbet: sayfa kaydırıldıktan hemen sonra hızlı yanıt (sabit panel)
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(800);
  await page.click('#chat-toggle');
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, 3200));
  await page.waitForTimeout(150);
  // Yanıt, sorunun kareleri çekilirken gelmesin: "yazıyor" beklemesi yalnız bu testte uzatılır
  await page.evaluate(() => { const st = window.setTimeout; window.__st = st; window.setTimeout = (fn, ms, ...a) => st(fn, ms >= 300 && ms <= 1200 ? ms + 6000 : ms, ...a); });
  await frames('sohbet-soru', '#chat-log', () => page.click('#chat-log .quick [data-intent="price"]'), '#chat');
  await page.evaluate(() => { window.setTimeout = window.__st; });
  await frames('sohbet-yanit', '#chat-log', async () => {}, '#chat');
  // Sohbet uzayıp kaydırılınca (günlük kendi içinde kayarken) tekrar
  for (const intent of ['hours', 'location']) {
    await page.waitForTimeout(300);
    const pill = await page.$(`#chat-log .quick [data-intent="${intent}"]`);
    if (pill) { await pill.click(); await page.waitForTimeout(2200); }
  }
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(150);
  await page.evaluate(() => { const st = window.setTimeout; window.__st = st; window.setTimeout = (fn, ms, ...a) => st(fn, ms >= 300 && ms <= 1200 ? ms + 6000 : ms, ...a); });
  await frames('sohbet-uzun', '#chat-log', () => page.fill('#chat-input', 'randevu').then(() => page.press('#chat-input', 'Enter')), '#chat');
  await page.evaluate(() => { window.setTimeout = window.__st; });
  report.sohbet_scrollTop = await page.$eval('#chat-log', (e) => e.scrollTop);
  // Sohbette gerçek zamanlı sıçrama ölçümü: test/chat-live.js

  report.hatalar = errors;
  fs.writeFileSync(path.join(__dirname, 'aa-olcum.json'), JSON.stringify(report, null, 1));
  console.log('konsol hatası:', errors.length, errors.slice(0, 3));
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
