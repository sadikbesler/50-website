const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://flowbite.com/blocks/marketing/header/', { waitUntil: 'networkidle' });
  const out = await p.evaluate(() => {
    const hs = [...document.querySelectorAll('h2')].slice(0, 2);
    return hs.map(h => { let s = h; while (s.parentElement && !s.parentElement.matches('main, body') && !(s.querySelector('iframe') && s.querySelector('code, pre, [data-code], button'))) s = s.parentElement; return s.outerHTML; });
  });
  fs.writeFileSync('/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/fbaf1e09-7717-45d0-873c-57c30a28e5ac/scratchpad/blok0.html', out[0]);
  fs.writeFileSync('/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/fbaf1e09-7717-45d0-873c-57c30a28e5ac/scratchpad/blok1.html', out[1]);
  await b.close();
})();
