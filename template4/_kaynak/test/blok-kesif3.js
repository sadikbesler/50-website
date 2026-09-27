const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://flowbite.com/blocks/marketing/header/', { waitUntil: 'load' });
  await p.waitForTimeout(3000);
  const btn = p.locator('button', { hasText: 'Show code' }).first();
  await btn.scrollIntoViewIfNeeded();
  const before = await p.evaluate(() => document.querySelectorAll('pre, code, textarea').length);
  await btn.click();
  await p.waitForTimeout(2500);
  const after = await p.evaluate(() => {
    const s = document.querySelector('div.px-4.mx-auto.max-w-8xl');
    const els = [...document.querySelectorAll('pre, code, textarea, .code-preview, [class*=code]')].slice(0, 12).map(e => e.tagName + '.' + e.className.toString().slice(0, 80) + ' len=' + e.textContent.length);
    return { n: document.querySelectorAll('pre, code, textarea').length, els, btns: [...s.querySelectorAll('button')].map(x => x.textContent.trim()).slice(0, 12), iframes: s.querySelectorAll('iframe').length };
  });
  console.log(before, JSON.stringify(after, null, 1));
  await p.screenshot({ path: '/private/tmp/claude-501/-Users-sadikbesler-Desktop-claude-frontend-50/fbaf1e09-7717-45d0-873c-57c30a28e5ac/scratchpad/showcode.jpg', type: 'jpeg', quality: 60 });
  await b.close();
})();
