// Kaynak (Landwind demo) ile sonuç arasında blok yüksekliği ve tipografi ölçeği karşılaştırması — node test/olcu.js
// Girdi: test/kaynak-olcu.json (test/referans.js üretir). Çıktı: test/olcu-sonuc.json + konsolda tablo.
'use strict';
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8801/50-website/template5/';
const KAYNAK = require('./kaynak-olcu.json');
// Landwind blok adı → sonuçtaki karşılığı
const BLOK = {
  header: '#site-header nav',
  hero: '#top',
  ozellik: '#hizmetler',            // üst kapsayıcı (bg-gray-50) ölçülür
  istatistik: '.facts',
  alinti: '[data-i18n-attr="aria-label:quote.aria"]',
  fiyat: '#ucretler',
  sss: '#sss',
  cta: '[aria-labelledby="cta-title"]',
  footer: '.site-footer',
};

(async () => {
  const browser = await chromium.launch();
  const sonuc = {};
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(() => { try { localStorage.setItem('mizan-theme', 'light'); sessionStorage.setItem('mizan-demo-seen', '1'); } catch (e) {} });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: 'networkidle' });
    const olc = await page.evaluate((BLOK) => {
      const px = (el, sel) => { const x = el && el.querySelector(sel); return x ? parseFloat(getComputedStyle(x).fontSize) : null; };
      const out = {};
      for (const [ad, sel] of Object.entries(BLOK)) {
        let el = document.querySelector(sel);
        if (ad === 'ozellik') el = el.parentElement.parentElement;
        const r = el.getBoundingClientRect();
        const o = { h: Math.round(r.height), h1: px(el, 'h1'), h2: px(el, 'h2'), h3: px(el, 'h3'), p: px(el, 'p') };
        if (ad === 'fiyat') {
          // Landwind'in kendi fiyat bloğuna denk gelen kısım: bölüm üstü → üç kartın altı + bölümün alt dolgusu
          const kartlar = el.querySelector('.lg\\:grid-cols-3');
          const pb = parseFloat(getComputedStyle(el.firstElementChild).paddingBottom);
          o.hLandwind = Math.round(kartlar.getBoundingClientRect().bottom - r.top + pb);
          o.h3 = parseFloat(getComputedStyle(kartlar.querySelector('h3')).fontSize);
        }
        if (ad === 'ozellik') o.h2 = px(el, 'h2'), o.p = parseFloat(getComputedStyle(el.querySelector('#hizmetler p')).fontSize);
        if (ad === 'sss') o.h3 = parseFloat(getComputedStyle(el.querySelector('h3 button')).fontSize);
        if (ad === 'footer') o.h3 = px(el, 'h2'); // Landwind footer sütun başlığı h3, sonuçta h2 (belge ana hatları için)
        out[ad] = o;
      }
      return out;
    }, BLOK);
    sonuc[w] = olc;
    await ctx.close();
  }
  await browser.close();

  const satirlar = [];
  for (const w of ['1440', '390']) {
    const k = Object.fromEntries(KAYNAK[w].map((x) => [x.ad, x]));
    for (const ad of Object.keys(BLOK)) {
      const s = sonuc[w][ad], q = k[ad];
      const hS = ad === 'fiyat' ? s.hLandwind : s.h;
      const fark = ((hS - q.h) / q.h) * 100;
      const tip = ['h1', 'h2', 'h3', 'p'].filter((t) => q[t] != null).map((t) => `${t} ${q[t]}→${s[t]}`).join(', ');
      const tipOk = ['h1', 'h2', 'h3', 'p'].filter((t) => q[t] != null).every((t) => s[t] != null && Math.abs(s[t] - q[t]) / q[t] <= 0.05);
      satirlar.push({ w, ad, kaynak: q.h, sonuc: hS, tumBolum: s.h, fark: +fark.toFixed(1), yukseklikOk: Math.abs(fark) <= 5, tip, tipOk });
    }
  }
  fs.writeFileSync(path.join(__dirname, 'olcu-sonuc.json'), JSON.stringify({ sonuc, satirlar }, null, 2));
  for (const r of satirlar) console.log(`${r.w}\t${r.ad.padEnd(10)}\t${r.kaynak}\t${r.sonuc}\t${r.fark}%\t${r.yukseklikOk ? 'OK' : '--'}\t${r.tipOk ? 'tip OK' : 'tip --'}\t${r.tip}`);
})().catch((e) => { console.error(e); process.exit(1); });
