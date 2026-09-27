// flowbite.com/blocks sayfalarının yapısını keşfet
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://flowbite.com/blocks/marketing/header/', { waitUntil: 'networkidle' });
  const info = await p.evaluate(() => {
    const hs = [...document.querySelectorAll('h2')].slice(0, 8);
    return hs.map(h => {
      let sec = h.parentElement; for (let i=0;i<4 && sec && !sec.querySelector('iframe'); i++) sec = sec.parentElement;
      return { t: h.textContent.trim(), html: (sec ? sec.outerHTML : '').slice(0, 1800) };
    });
  });
  console.log(JSON.stringify(info, null, 1));
  await b.close();
})();
