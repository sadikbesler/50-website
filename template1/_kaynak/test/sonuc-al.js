/* Her Preline bloğunun Mizan'daki karşılığını _referans/sonuc-<blok>.jpg (1440) ve -390 olarak kaydeder.
   Çalıştırma: NODE_PATH=../node_modules node sonuc-al.js [blok ...] */
const { chromium } = require('playwright');
const path = require('path');
const BASE = 'http://localhost:8801/50-website/template1/';
const REF = path.resolve(__dirname, '..', '..', '_referans');
const SECTIONS = {
  'ust-menu': ['', '#site-header'], 'hero': ['', '#top'], 'kisa-bilgiler': ['', '.facts'], 'hizmetler': ['', '#hizmetler'],
  'mevsim-notlari': ['', '.notes-panel'], 'yaklasim': ['', '#yaklasim'], 'manifesto': ['', '#manifesto'], 'uzmanlar': ['', '#uzmanlar'],
  'arac-sekmeleri': ['', '#araclar'], 'program-pill-sekmeleri': ['', '#program'], 'tarifler': ['', '#tarifler'], 'ucretler': ['', '#ucretler'],
  'stepper': ['', '#randevu'], 'blog': ['', '#blog'], 'sss': ['', '#sss'], 'afiyet': ['', '.sky'], 'iletisim': ['', '#iletisim'],
  'footer': ['', '.site-footer'], 'makale': ['blog/insulin-direnci-beslenme.html', null], 'blog-index': ['blog/', null], 'kvkk': ['kvkk.html', null]
};
const only = process.argv.slice(2);
/* Bölüm çekimlerinde yapışkan başlık ve yüzen düğmeler bölümün üstüne binmesin */
const HIDE = '#site-header{position:static!important}.floating-actions{display:none!important}';
async function prep(p) {
  await p.evaluate(async () => {
    document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
    await Promise.all(Array.from(document.images).map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 5000); })));
  });
  await p.waitForTimeout(400);
}
(async () => {
  const b = await chromium.launch();
  for (const [w, suf] of [[1440, ''], [390, '-390']]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, bypassCSP: true });
    await ctx.addInitScript(() => { try { localStorage.setItem('mizan-theme', 'light'); localStorage.setItem('mizan-lang', 'tr'); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} });
    const p = await ctx.newPage();
    let cur = null;
    for (const [name, [url, sel]] of Object.entries(SECTIONS)) {
      if (only.length && !only.includes(name)) continue;
      if (cur !== url) { await p.goto(BASE + url, { waitUntil: 'networkidle' }); await prep(p); cur = url; }
      const file = path.join(REF, 'sonuc-' + name + suf + '.jpg');
      if (!sel) { await p.screenshot({ path: file, type: 'jpeg', quality: 70, fullPage: true }); continue; }
      if (name === 'stepper') {
        /* adım 2: takvim ve saatler (Datepicker görünümü) */
        await p.click('[data-next="2"]'); await p.waitForTimeout(500);
        await (await p.$('[data-booking]')).screenshot({ path: path.join(REF, 'sonuc-datepicker' + suf + '.jpg'), type: 'jpeg', quality: 70 });
        await p.click('[data-prev="1"]'); await p.waitForTimeout(300);
      }
      const tag = name === 'ust-menu' ? null : await p.addStyleTag({ content: HIDE });
      const el = await p.$(sel);
      await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(200);
      await el.screenshot({ path: file, type: 'jpeg', quality: 70 });
      if (tag) await tag.evaluate(n => n.remove());
    }
    await ctx.close();
  }
  await b.close();
})();
