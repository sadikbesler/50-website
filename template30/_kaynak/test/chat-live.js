// Sohbette gerçek zamanlı sıçrama ölçümü (animasyonlar durdurulmaz).
// Her değişimde, AutoAnimate animasyonları kurduktan hemen sonra (t≈0)
// kalan mesajların konumu değişimden önceki konumla karşılaştırılır.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const W = +(process.env.W || 1440);
  const ctx = await b.newContext({ viewport: { width: W, height: W < 800 ? 844 : 900 }, isMobile: W < 800, hasTouch: W < 800, locale: 'tr-TR', timezoneId: 'Europe/Istanbul' });
  await ctx.addInitScript(() => { try { sessionStorage.setItem('mizan-planet-seen', '1'); } catch (e) {} });
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto(process.argv[2] || 'http://localhost:8801/50-website/template30/', { waitUntil: 'load' }); await p.waitForTimeout(2500);
  const d = await p.$('.demo-bar-btn'); if (d) await d.click();
  await p.evaluate(() => document.querySelector('#uzmanlar').scrollIntoView()); await p.waitForTimeout(800);
  await p.click('#chat-toggle'); await p.waitForTimeout(1200);
  await p.evaluate(() => {
    const log = document.getElementById('chat-log');
    window.__rows = [];
    let last = new Map();
    // Günlüğün içerik koordinatı: günlük ya da sayfa kayınca değişmez
    const pos = (e) => e.getBoundingClientRect().top - log.getBoundingClientRect().top + log.scrollTop;
    const seen = (e) => { const r = e.getBoundingClientRect(), L = log.getBoundingClientRect(); return r.bottom > L.top && r.top < L.bottom; };
    window.__panel = [];
    const snap = () => { const m = new Map(); Array.from(log.children).forEach((e) => { if (!('__aa_del' in e)) m.set(e, pos(e)); }); window.__panel.push(Math.round(document.getElementById('chat').getBoundingClientRect().top)); return m; };
    // Değişimden önceki konumlar: her karede güncellenir
    const tick = () => { last = snap(); requestAnimationFrame(tick); };
    tick();
    new MutationObserver((recs) => {
      if (recs.every((r) => [...r.addedNodes, ...r.removedNodes].every((n) => n.nodeName === 'SPAN' && n.hidden))) return;
      let max = 0, n = 0, who = null;
      Array.from(log.children).forEach((e) => {
        if (!last.has(e) || '__aa_del' in e || !seen(e)) return;
        n++;
        const j = Math.abs(pos(e) - last.get(e));
        if (j > max) { max = j; const a = e.getAnimations().find((x) => !(x instanceof CSSAnimation)); who = e.className + ' ' + (a ? a.effect.getKeyframes().map((k) => k.transform).join('→') + ' ' + a.playState + '@' + Math.round(a.currentTime || 0) : 'anim yok'); }
      });
      const cls = (list) => [...list].map((x) => (x.className || x.nodeName) + ('__aa_del' in x ? '(kopya)' : '')).join(',');
      window.__rows.push({ ekle: recs.map((r) => cls(r.addedNodes)).filter(Boolean).join(';'), cikar: recs.map((r) => cls(r.removedNodes)).filter(Boolean).join(';'), kalan: n, maxSicrama: Math.round(max), kim: who, logScroll: log.scrollTop, sayfaY: Math.round(scrollY) });
    }).observe(log, { childList: true });
  });
  const pill = async (intent) => { const el = await p.$(`#chat-log .quick [data-intent="${intent}"]`) || await p.$('#chat-log .quick [data-intent]'); await el.click(); };
  // 1) Sayfa az önce kaydırıldı, günlük henüz taşmadı
  await p.evaluate(() => window.scrollBy(0, 1200)); await p.waitForTimeout(60);
  await pill('price'); await p.waitForTimeout(2200);
  // 2) Günlük taştı; sonraki sorular
  await pill('hours'); await p.waitForTimeout(2200);
  // 3) Yanıt beklenirken sayfa sürekli kaydırılıyor
  await pill('location');
  await p.evaluate(() => new Promise((res) => { let y = scrollY, i = 0; const t = setInterval(() => { y -= 30; window.scrollTo(0, y); if (++i > 90) { clearInterval(t); res(); } }, 16); }));
  await p.waitForTimeout(1500);
  // 4) Kullanıcı günlüğü en üste kaydırıp soru soruyor
  // (insan gibi: en üste kaydırır, okur, en alta döner, sonra tıklar)
  await p.evaluate(() => { document.getElementById('chat-log').scrollTop = 0; }); await p.waitForTimeout(400);
  await p.evaluate(() => { const l = document.getElementById('chat-log'); l.scrollTop = l.scrollHeight; }); await p.waitForTimeout(120);
  await pill('book'); await p.waitForTimeout(2200);
  // 5) Panel kapatılıp sayfa kaydırıldı, panel yeniden açıldı ve hemen soru
  await p.click('#chat-toggle'); await p.waitForTimeout(600);
  await p.evaluate(() => window.scrollBy(0, 2000)); await p.waitForTimeout(300);
  await p.click('#chat-toggle'); await p.waitForTimeout(450);
  await pill('price'); await p.waitForTimeout(2200);
  const rows = await p.evaluate(() => window.__rows);
  console.log('panelin üst kenarı (tüm kareler):', [...new Set(await p.evaluate(() => window.__panel))].join(','));
  rows.forEach((r, i) => console.log(i, JSON.stringify(r)));
  console.log('en büyük sıçrama:', Math.max(...rows.map((r) => r.maxSicrama)), 'px; hata:', errs.length);
  await b.close();
})();
