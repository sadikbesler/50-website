/* Preline FREE bloklarını kaynağından alır.
   Her blok için: sayfayı açar, başlığı bulur, FREE/PRO etiketini okur,
   "HTML" sekmesine tıklar, kod alanının metnini okur ve bloklar/<ad>.html'e yazar.
   Ardından önizleme iframe'ini 1440 ve 390 genişlikte açıp _referans/kaynak-<ad>.jpg olarak kaydeder
   ve hesaplanan font-family değerini kaydeder.
   Çalıştırma: node bloklari-al.js [ad ...] */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BLOCKS = [
  ['ust-menu', 'marketing/website-headers', 'Website Header with Offcanvas Menu'],
  ['hero', 'marketing/hero-sections', 'Full-Bleed Image Hero with Text Overlay'],
  ['kisa-bilgiler', 'marketing/marketing-stats', 'Stat Card Group'],
  ['hizmetler', 'marketing/icon-blocks', 'Icon Blocks with Hover Background'],
  ['mevsim-notlari', 'marketing/gallery-grids', 'Masonry Image Grid with Four Columns'],
  ['yaklasim', 'marketing/feature-sections', 'Feature Steps Section'],
  ['manifesto', 'marketing/hero-sections', 'Center-Aligned Dark Hero'],
  ['uzmanlar', 'marketing/team-sections', 'Team Profile Card Grid with Bios and Social Links'],
  ['tarifler', 'blog-articles/blog-listing-sections', 'Article Card Grid with Hover Zoom Images'],
  ['ucretler', 'marketing/pricing-cards', 'Pricing Card Grid'],
  ['blog', 'blog-articles/blog-listing-sections', 'Image Post Card Grid with Category Meta'],
  ['makale', 'blog-articles/blog-article-pages', 'Centered Editorial Article Page with Sticky Share Bar'],
  ['sss', 'marketing/faq-sections', 'Centered FAQ Accordion'],
  ['afiyet', 'marketing/feature-sections', 'Feature Cards over Background Image'],
  ['iletisim', 'marketing/contact-pages', 'Split Contact Page with Contact Details'],
  ['footer', 'marketing/website-footers', 'Five-Column Footer with Language Dropdown']
];

const HERE = __dirname;
const REF = path.resolve(HERE, '..', '_referans');
const only = process.argv.slice(2);

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const manifest = fs.existsSync(path.join(HERE, 'bloklar/manifest.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'bloklar/manifest.json'), 'utf8')) : {};
  for (const [name, fam, title] of BLOCKS) {
    if (only.length && !only.includes(name)) continue;
    const url = 'https://preline.co/blocks/' + fam + '/';
    const p = await ctx.newPage();
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    const info = await p.evaluate((title) => {
      const hs = Array.from(document.querySelectorAll('.hs-panel-root h2'));
      const h = hs.find(x => {
        const a = x.querySelector('a');
        const txt = (a ? a.childNodes[0].textContent : x.textContent).replace(/\s+/g, ' ').trim();
        return txt === title;
      });
      if (!h) return { error: 'başlık yok', titles: hs.map(x => x.textContent.replace(/\s+/g, ' ').trim()) };
      const root = h.closest('.hs-panel-root');
      const badge = (h.querySelector('span') || {}).textContent;
      const hasCopy = /Copy Code/.test(root.innerText);
      const iframe = root.querySelector('iframe[id$="-tab-preview-iframe"]');
      return { id: h.id, plan: root.getAttribute('data-block-preview-plan'), badge: (badge || '').trim(), hasCopy, iframeSrc: iframe ? (iframe.getAttribute('src') || iframe.getAttribute('data-src')) : null };
    }, title);
    if (info.error) { console.log('HATA', name, info.error, info.titles); await p.close(); continue; }
    if (info.plan !== 'free' || !/free/i.test(info.badge) || !info.hasCopy) { console.log('ÜCRETLİ/ŞÜPHELİ, ATLANDI', name, JSON.stringify(info)); await p.close(); continue; }
    await p.click('#' + info.id + '-tab-html-item');
    await p.waitForTimeout(1500);
    const code = await p.evaluate((id) => {
      const panel = document.getElementById(id + '-tab-html');
      if (!panel) return null;
      const pre = panel.querySelector('pre code') || panel.querySelector('pre') || panel.querySelector('code');
      return pre ? pre.innerText : panel.innerText;
    }, info.id);
    if (!code || code.length < 50) { console.log('KOD OKUNAMADI', name, info.id); await p.close(); continue; }
    fs.writeFileSync(path.join(HERE, 'bloklar', name + '.html'), '<!-- Kaynak: ' + url + '#' + info.id + ' · "' + title + '" · ' + info.badge.toUpperCase() + ' · HTML sekmesinden okundu ' + new Date().toISOString().slice(0, 10) + ' -->\n' + code);
    const src = new URL(info.iframeSrc, url).href;
    const shots = {};
    for (const [w, h, suf] of [[1440, 900, ''], [390, 844, '-390']]) {
      const q = await b.newPage({ viewport: { width: w, height: h } });
      await q.goto(src, { waitUntil: 'networkidle', timeout: 90000 });
      await q.waitForTimeout(1200);
      const f = await q.evaluate(() => {
        const pick = document.querySelector('h1, h2, h3, p, a') || document.body;
        return { body: getComputedStyle(document.body).fontFamily, el: getComputedStyle(pick).fontFamily, loaded: Array.from(document.fonts).filter(x => x.status === 'loaded').map(x => x.family + ' ' + x.weight) };
      });
      shots[w] = f;
      const file = path.join(REF, 'kaynak-' + name + suf + '.jpg');
      await q.screenshot({ path: file, type: 'jpeg', quality: 70, fullPage: true });
      await q.close();
    }
    manifest[name] = { title, url: url + '#' + info.id, plan: info.plan, badge: info.badge, preview: src, fonts: shots, bytes: code.length };
    console.log('ALINDI', name, info.badge, code.length, 'bayt', '| font:', shots[1440].body);
    await p.close();
  }
  fs.writeFileSync(path.join(HERE, 'bloklar/manifest.json'), JSON.stringify(manifest, null, 2));
  await b.close();
})();
