// Flowbite v2.5.2 belge örneklerini (Tailwind v3 sınıflı) id ile _kaynak/bilesenler/<id>.html dosyasına döker.
'use strict';
const fs = require('fs'), path = require('path');
const DOK = path.join(__dirname, '../indirilen/flowbite-2.5.2/content');
const IST = {
  'components/stepper': ['default-stepper-example'], 'components/chat-bubble': ['chat-bubble-example'],
  'components/tabs': ['tabs-underline-example', 'tabs-pill-example'], 'components/timeline': ['default-timeline-example'],
  'components/modal': ['default-modal-example'], 'components/card': ['default-card-example', 'card-image-example'],
  'components/toast': ['toast-colors-example'], 'components/banner': ['bottom-banner-example'],
  'components/badge': ['default-badge-example'], 'components/breadcrumb': ['default-breadcrumb-example'],
  'components/buttons': ['default-button-example'], 'components/drawer': ['default-drawer-example'],
  'components/progress': ['default-progress-example'], 'components/skeleton': ['default-skeleton-example'],
  'components/alerts': ['default-alert-example'], 'components/avatar': ['avatar-placeholder-initials-example'],
  'components/list-group': ['default-list-group-example'], 'components/gallery': ['default-gallery-example'],
  'forms/input-field': ['default-input-field-example', 'input-field-validation-example'],
  'forms/radio': ['radio-bordered-example', 'radio-advanced-example'], 'forms/checkbox': ['default-checkbox-example'],
  'forms/range': ['default-range-example'], 'forms/select': ['default-select-example'], 'forms/textarea': ['default-textarea-example'],
  'forms/number-input': ['control-number-input'],
};
for (const [dosya, idler] of Object.entries(IST)) {
  const md = fs.readFileSync(path.join(DOK, dosya + '.md'), 'utf8');
  for (const id of idler) {
    const m = md.match(new RegExp('\\{\\{< example id="' + id + '"[^>]*>\\}\\}([\\s\\S]*?)\\{\\{< /example >\\}\\}'));
    if (!m) { console.log('YOK', id); continue; }
    fs.writeFileSync(path.join(__dirname, '../bilesenler', id + '.html'), `<!-- Flowbite v2.5.2 · content/${dosya}.md · #${id} (MIT) -->\n` + m[1].trim() + '\n');
  }
}
// Koyu tema düğmesi: customize/dark-mode.md
const dm = fs.readFileSync(path.join(DOK, 'customize/dark-mode.md'), 'utf8');
const t = dm.match(/<button id="theme-toggle"[\s\S]*?<\/button>/);
if (t) fs.writeFileSync(path.join(__dirname, '../bilesenler', 'dark-mode-toggle.html'), '<!-- Flowbite v2.5.2 · content/customize/dark-mode.md (MIT) -->\n' + t[0] + '\n');
console.log(fs.readdirSync(path.join(__dirname, '../bilesenler')).join(' '));
