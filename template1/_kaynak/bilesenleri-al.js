/* Preline docs sayfalarındaki (ücretsiz, MIT) bileşen örneklerini alır.
   Her örnek için "HTML" sekmesine tıklar, kod alanının metnini okur ve bilesenler/<sayfa>--<örnek>.html'e yazar.
   İstenen örneklerin önizleme panelini _referans/kaynak-<ad>.jpg olarak kaydeder.
   Çalıştırma: node bilesenleri-al.js */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const WANT = {
  'tabs': ['underline-tabs', 'segmented-tabs', 'pills-on-stone-surface', 'brand-color-pills'],
  'range-slider': ['default-range-slider', 'custom-min-and-max'],
  'input': ['input-with-label', 'validation-states', 'default-input'],
  'select': ['select-with-label'],
  'radio': ['inline-radio-group', 'radio-cards'],
  'checkbox': ['default-checkbox', 'checkboxes-with-descriptions'],
  'textarea': ['textarea-with-label'],
  'buttons': ['types', 'solid-color-variants', 'soft-color-variants', 'white-color-variants', 'ghost-color-variants', 'icon-only-buttons', 'loading', 'pill-button'],
  'modal': ['default-modal', 'scrolling-behavior'],
  'stepper': ['default-stepper', 'responsive-stepper', 'linear-stepper', 'success-state'],
  'datepicker': ['single-date-picker'],
  'chat-bubbles': ['conversation', 'messages-with-avatars'],
  'badge': ['soft-color-variants', 'badge-with-status-dot'],
  'alerts': ['soft-color-variants', 'with-supporting-text'],
  'tables': ['default-table'],
  'progress': ['with-title', 'default-progress'],
  'skeleton': ['default-skeleton'],
  'spinners': ['default-spinner', 'typing-dots'],
  'legend-indicator': ['default-legend-indicator'],
  'toasts': ['default-toast'],
  'offcanvas': ['default-offcanvas'],
  'dropdown': ['default-dropdown'],
  'breadcrumb': ['chevron-separators', 'slash-separators'],
  'accordion': [],
  'cards': []
};
/* Önizleme görüntüsü alınacaklar → _referans/kaynak-<ad>.jpg */
const SHOTS = {
  'tabs/underline-tabs': 'arac-sekmeleri', 'tabs/brand-color-pills': 'program-pill-sekmeleri', 'tabs/segmented-tabs': 'program-segmented',
  'range-slider/default-range-slider': 'range-slider', 'buttons/soft-color-variants': 'soft-dugmeler',
  'modal/default-modal': 'modal', 'stepper/default-stepper': 'stepper', 'datepicker/single-date-picker': 'datepicker',
  'chat-bubbles/conversation': 'chat-bubbles', 'input/input-with-label': 'form-girisi', 'progress/with-title': 'progress'
};
const HERE = __dirname;
const REF = path.resolve(HERE, '..', '_referans');
const only = process.argv.slice(2);

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const log = [];
  for (const [page, list] of Object.entries(WANT)) {
    if (only.length && !only.includes(page)) continue;
    const url = 'https://preline.co/docs/' + page + '.html';
    await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
    let slugs = list;
    if (!slugs.length) slugs = await p.evaluate(() => Array.from(document.querySelectorAll('[id$="-tab-html-item"]')).map(t => t.id.replace(/-tab-html-item$/, '')).slice(0, 6));
    for (const slug of slugs) {
      const ok = await p.$('#' + slug + '-tab-html-item');
      if (!ok) { console.log('YOK', page, slug); continue; }
      const key = page + '/' + slug;
      if (SHOTS[key]) {
        const prev = await p.$('#' + slug + '-tab-preview');
        if (prev) {
          await prev.scrollIntoViewIfNeeded();
          await p.waitForTimeout(600);
          await prev.screenshot({ path: path.join(REF, 'kaynak-' + SHOTS[key] + '.jpg'), type: 'jpeg', quality: 70 });
        }
      }
      await p.click('#' + slug + '-tab-html-item');
      await p.waitForTimeout(700);
      const code = await p.evaluate((slug) => {
        const panel = document.getElementById(slug + '-tab-html');
        if (!panel) return null;
        const pre = panel.querySelector('pre code') || panel.querySelector('pre') || panel.querySelector('code');
        return pre ? pre.innerText : panel.innerText;
      }, slug);
      if (!code) { console.log('KOD YOK', key); continue; }
      fs.writeFileSync(path.join(HERE, 'bilesenler', page + '--' + slug + '.html'), '<!-- Kaynak: ' + url + '#' + slug + ' · HTML sekmesinden okundu ' + new Date().toISOString().slice(0, 10) + ' -->\n' + code);
      log.push(key + ' ' + code.length);
    }
  }
  console.log(log.join('\n'));
  await b.close();
})();
