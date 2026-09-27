// flowbite.com/blocks: her ailedeki blokların ücretsiz/PRO durumunu kaydet; istenen ücretsiz blokların
// "Show code" ile görünen kodunu _kaynak/bloklar/<ad>.html'e, önizlemesini _referans/kaynak-<ad>(-dark).jpg'e al.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const REF = path.join(__dirname, '../../_referans'), OUT = path.join(__dirname, '../bloklar');
const ISTENEN = [
  ['header', 'Default header navigation', 'blok-header'],
  ['hero', 'Default hero section', 'blok-hero'],
  ['hero', 'Visual image with heading', 'blok-hero-gorsel'],
  ['feature', 'Default feature list', 'blok-feature'],
  ['content', 'Heading with description', 'blok-content'],
  ['team', 'Team member cards', 'blok-team'],
  ['pricing', 'Default pricing cards', 'blok-pricing'],
  ['blog', 'Default blog card', 'blok-blog'],
  ['faq', 'Default example', 'blok-faq'],
  ['cta', 'Heading with CTA button', 'blok-cta'],
  ['contact', 'Default contact form', 'blok-contact'],
  ['footer', 'Sitemap with logo and social media', 'blok-footer'],
];
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage();
  const rapor = {};
  for (const [aile, ad, dosya] of ISTENEN.filter((x) => !process.argv[2] || x[2] === process.argv[2])) {
    const url = `https://flowbite.com/blocks/marketing/${aile}/`;
    await p.goto(url, { waitUntil: 'load', timeout: 90000 });
    await p.waitForTimeout(3000);
    {
      rapor[aile] = await p.evaluate(() => [...document.querySelectorAll('div.px-4.mx-auto.max-w-8xl')].filter(s => s.querySelector('h2') && s.querySelector('iframe')).map(s => ({
        ad: s.querySelector('h2').firstChild.textContent.trim(),
        durum: [...s.querySelectorAll('button')].some(x => /Show code/.test(x.textContent)) ? 'ucretsiz' : (/Unlock the code/.test(s.textContent) ? 'PRO' : '?'),
      })));
    }
    const bilgi = rapor[aile].find(x => x.ad === ad);
    if (!bilgi) { console.log('YOK', aile, ad, rapor[aile].map(x => x.ad)); continue; }
    if (bilgi.durum !== 'ucretsiz') { console.log('KİLİTLİ', aile, ad, bilgi.durum); continue; }
    await p.evaluate(([ad, dosya]) => { const s = [...document.querySelectorAll('div.px-4.mx-auto.max-w-8xl')].find(s => s.querySelector('h2') && s.querySelector('h2').firstChild.textContent.trim() === ad && s.querySelector('iframe')); s.setAttribute('data-mz', dosya); }, [ad, dosya]);
    const sec = p.locator(`[data-mz="${dosya}"]`);
    await p.evaluate(() => document.querySelectorAll('body *').forEach((e) => { const s = getComputedStyle(e); if ((s.position === 'fixed' || s.position === 'sticky') && !e.closest('[data-mz]')) e.style.visibility = 'hidden'; }));
    await sec.scrollIntoViewIfNeeded();
    const frame = sec.locator('iframe').first();
    await p.waitForTimeout(800);
    await frame.screenshot({ path: path.join(REF, `kaynak-${dosya}.jpg`), type: 'jpeg', quality: 70 });
    // koyu önizleme: iframe belgesine .dark sınıfı (sayfadaki koyu düğmesi aynı işi yapar)
    const fh = await frame.elementHandle(); const fr = await fh.contentFrame();
    await fr.evaluate(() => { document.documentElement.classList.add('dark'); });
    await p.waitForTimeout(400);
    await frame.screenshot({ path: path.join(REF, `kaynak-${dosya}-dark.jpg`), type: 'jpeg', quality: 70 });
    await fr.evaluate(() => { document.documentElement.classList.remove('dark'); });
    // Show code → görünen kod
    await sec.locator('button', { hasText: 'Show code' }).click();
    await p.waitForTimeout(700);
    await p.waitForSelector('pre.prism-code', { timeout: 15000 });
    const kod = await p.evaluate(() => { const c = document.querySelectorAll('pre.prism-code'); return c.length === 1 ? c[0].textContent : null; });
    if (!kod) { console.log('KOD GÖRÜNMEDİ', ad); continue; }
    fs.writeFileSync(path.join(OUT, `${dosya}.html`), `<!-- Flowbite Blocks · ${ad} · ${url} · "Show code" ile görünen ücretsiz kod, ${new Date().toISOString().slice(0, 10)} -->\n` + kod);
    bilgi.kodAlindi = true;
    console.log('ok', aile, ad, kod.length);
  }
  if (!process.argv[2]) fs.writeFileSync(path.join(OUT, 'durum.json'), JSON.stringify(rapor, null, 1));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
