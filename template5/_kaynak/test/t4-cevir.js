// Bir kerelik: template4'ün işlevsel parça iskeletlerini (sözleşme seçicileri, i18n anahtarları) okuyup
// Flowbite 4 anlamsal sınıflarını Tailwind v3 / Flowbite v2 klasik sınıflarına çevirir → _kaynak/sayfa/parca-*.html
// (template4 yalnızca okunur.) Çıktılar sonra elle Landwind kalıbına uyarlandı.
'use strict';
const fs = require('fs'), path = require('path');
const T4 = path.resolve(__dirname, '../../../template4/_kaynak/sayfa');
const MAP = [
  [/\bhover:text-heading\b/g, 'hover:text-gray-900 dark:hover:text-white'],
  [/\bhover:bg-neutral-tertiary\b/g, 'hover:bg-gray-200 dark:hover:bg-gray-600'],
  [/\bafter:text-fg-disabled\b/g, 'after:text-gray-200 dark:after:text-gray-500'],
  [/\btext-fg-brand-strong\b/g, 'text-purple-800 dark:text-purple-300'],
  [/\btext-fg-brand\b/g, 'text-purple-600 dark:text-purple-400'],
  [/\btext-fg-success\b/g, 'text-green-500 dark:text-green-200'],
  [/\bbg-success-soft\b/g, 'bg-green-100 dark:bg-green-800'],
  [/\bbg-success\b/g, 'bg-green-500'],
  [/\bborder-buffer\b/g, 'border-white dark:border-gray-800'],
  [/\bbg-brand-softer\b/g, 'bg-purple-100 dark:bg-purple-900'],
  [/\bbg-neutral-tertiary\b/g, 'bg-gray-100 dark:bg-gray-600'],
  [/\bbg-neutral-primary-soft\b/g, 'bg-white dark:bg-gray-800'],
  [/\baria-invalid:border-danger\b/g, 'aria-[invalid=true]:border-red-500'],
  [/\bin-\[\.is-done\]:/g, 'group-[.is-done]:'],
  [/\btext-heading\b/g, 'text-gray-900 dark:text-white'],
  [/\btext-body\b/g, 'text-gray-500 dark:text-gray-400'],
  [/\bborder-default\b/g, 'border-gray-200 dark:border-gray-700'],
  [/\brounded-base\b/g, 'rounded-lg'],
];
for (const ad of ['araclar', 'randevu', 'dialoglar', 'sohbet', 'program', 'tarifler']) {
  let s = fs.readFileSync(path.join(T4, `parca-${ad}.html`), 'utf8');
  for (const [re, to] of MAP) s = s.replace(re, to);
  const kalan = (s.match(/class="[^"]*"/g) || []).join(' ').match(/\b(bg-neutral-[\w-]+|bg-brand[\w-]*|fg-[\w-]+|text-fg[\w-]*|border-brand[\w-]*|ring-brand[\w-]*)\b/g);
  fs.writeFileSync(path.join(__dirname, '../sayfa', `parca-${ad}.html`), s);
  console.log(ad, kalan ? [...new Set(kalan)] : 'temiz');
}
