const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://flowbite.com/docs/components/card/', { waitUntil: 'load', timeout: 90000 });
  await p.waitForTimeout(2500);
  const r = await p.evaluate(() => {
    const ifr = [...document.querySelectorAll('iframe')].slice(0,3).map(f => (f.id||'') + ' ' + f.className + ' ' + (f.getAttribute('src')||'').slice(0,80) + ' srcdoc=' + !!f.getAttribute('srcdoc'));
    const prev = [...document.querySelectorAll('[class*=code-preview], [data-component], .code-preview-wrapper')].slice(0,3).map(e => e.tagName + '.' + e.className.slice(0,120));
    return { ifr, prev, header: !!document.querySelector('header'), navs: [...document.querySelectorAll('body > header, body > nav, header.sticky, nav.fixed, .sticky')].map(e=>e.tagName+'.'+e.className.slice(0,60)).slice(0,5) };
  });
  console.log(JSON.stringify(r, null, 1));
  await b.close();
})();
