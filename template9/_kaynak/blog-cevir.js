// Mizan blog/*.html → AstroPaper içerik klasörü (astro/src/content/posts/<slug>.md)
// Metin birebir taşınır: TR ve EN gövde, kaynakça, bilgi kutuları, tablolar.
// Çalıştır: node blog-cevir.js   (kaynak: ../../diyetisyen-animasyon-v2/blog, yalnızca okunur)
'use strict';
const fs = require('fs');
const path = require('path');
const { parse } = require('node-html-parser');
const GithubSlugger = require('github-slugger').default;

const SRC = path.resolve(__dirname, '../../diyetisyen-animasyon-v2/blog');
const OUT = path.resolve(__dirname, 'astro/src/content/posts');

// Promttaki etiket kümesi: beslenme, insulin-direnci, su, protein, akdeniz, etiket-okuma
const TAGS = {
  'insulin-direnci-beslenme': ['insulin-direnci', 'beslenme'],
  'aralikli-oruc-16-8': ['beslenme'],
  'gunluk-su-ihtiyaci': ['su', 'beslenme'],
  'akdeniz-tipi-beslenme': ['akdeniz', 'beslenme'],
  'protein-ihtiyaci': ['protein', 'beslenme'],
  'etiket-okuma-rehberi': ['etiket-okuma', 'beslenme'],
};
// Kapak görseli adı (assets/img/<ad>-900|1800.webp)
const COVER = {
  'insulin-direnci-beslenme': 'blog-insulin',
  'aralikli-oruc-16-8': 'blog-aralikli-oruc',
  'gunluk-su-ihtiyaci': 'blog-su',
  'akdeniz-tipi-beslenme': 'blog-akdeniz',
  'protein-ihtiyaci': 'blog-protein',
  'etiket-okuma-rehberi': 'blog-etiket',
};
const TOC = {
  tr: { heading: 'Bu yazıda', summary: 'İçindekileri aç' },
  en: { heading: 'In this article', summary: 'Open table of contents' },
};

const q = (s) => JSON.stringify(s);
const both = (el) => ({
  tr: el.querySelector('[data-lang-block="tr"]').text.trim(),
  en: el.querySelector('[data-lang-block="en"]').text.trim(),
});

function esc(text, inTable) {
  let t = text.replace(/\\/g, '\\\\').replace(/([*_`\[\]])/g, '\\$1').replace(/<(?=[a-zA-Z/!])/g, '&lt;');
  if (inTable) t = t.replace(/\|/g, '\\|');
  return t;
}
function inline(node, inTable) {
  if (node.nodeType === 3) return esc(node.text.replace(/\s+/g, ' '), inTable);
  const kids = () => node.childNodes.map((c) => inline(c, inTable)).join('');
  switch (node.rawTagName && node.rawTagName.toLowerCase()) {
    case 'strong': case 'b': return '**' + kids() + '**';
    case 'em': case 'i': return '*' + kids() + '*';
    case 'a': return '[' + kids() + '](' + node.getAttribute('href') + ')';
    case 'br': return '  \n';
    case 'span': return kids();
    default: throw new Error('Beklenmeyen satır içi öğe: ' + node.rawTagName);
  }
}
const para = (el, inTable) => {
  let s = el.childNodes.map((c) => inline(c, inTable)).join('').trim();
  // Satır başındaki "12." gibi ifadeler sıralı listeye dönmesin
  if (/^\d+\. /.test(s)) s = s.replace(/^(\d+)\./, '$1\\.');
  if (/^[-+#>] /.test(s)) s = '\\' + s;
  return s;
};

function table(t) {
  const head = t.querySelectorAll('thead th').map((th) => para(th, true));
  const rows = t.querySelectorAll('tbody tr').map((tr) => tr.querySelectorAll('td,th').map((td) => para(td, true)));
  const line = (cells) => '| ' + cells.join(' | ') + ' |';
  // AstroPaper'ın ResponsiveTable.astro sarmalayıcısının sınıfları (dar ekranda tablo kendi içinde kayar)
  return [
    '<div class="overflow-hidden [&_table]:my-0 [&_table]:min-w-xl"><div class="relative w-full overflow-x-auto">',
    '',
    line(head),
    line(head.map(() => '---')),
    ...rows.map(line),
    '',
    '</div></div>',
  ].join('\n');
}

function blocks(container, headings) {
  const out = [];
  for (const el of container.childNodes) {
    if (el.nodeType === 3) { if (el.text.trim()) throw new Error('Serbest metin: ' + el.text); continue; }
    const tag = el.rawTagName.toLowerCase();
    const cls = el.getAttribute('class') || '';
    if (tag === 'h2' || tag === 'h3') {
      const text = el.text.trim();
      headings.push({ depth: +tag[1], text });
      out.push('#'.repeat(+tag[1]) + ' ' + para(el));
    } else if (tag === 'p') {
      out.push(para(el));
    } else if (tag === 'ul' || tag === 'ol') {
      out.push(el.querySelectorAll(':scope > li').map((li, i) => (tag === 'ol' ? `${i + 1}. ` : '- ') + para(li)).join('\n'));
    } else if (tag === 'div' && /\bcallout\b/.test(cls)) {
      const label = el.querySelector('.label').text.trim();
      const body = el.querySelectorAll('p:not(.label)').map((p) => '> ' + para(p)).join('\n>\n');
      out.push(`> [!${/callout--warn/.test(cls) ? 'warning' : 'note'}] ${label}\n${body}`);
    } else if (tag === 'div' && /\btable-scroll\b/.test(cls)) {
      out.push(table(el.querySelector('table')));
    } else if (tag === 'table') {
      out.push(table(el));
    } else {
      throw new Error('Beklenmeyen blok: ' + tag + '.' + cls);
    }
  }
  return out;
}

const raporlar = [];
fs.mkdirSync(OUT, { recursive: true });
for (const file of fs.readdirSync(SRC).filter((f) => f.endsWith('.html') && f !== 'index.html').sort()) {
  const slug = file.replace(/\.html$/, '');
  const root = parse(fs.readFileSync(path.join(SRC, file), 'utf8'));
  const html = root.querySelector('html');
  const ld = JSON.parse(root.querySelector('script[type="application/ld+json"]').text)['@graph'][0];
  const head = root.querySelector('.article-head');
  const cat = both(head.querySelector('.post-meta .cat'));
  const read = both(head.querySelectorAll('.post-meta > span').pop());
  const title = both(head.querySelector('h1'));
  const lede = both(head.querySelector('.lede'));
  const byline = head.querySelector('.byline');
  const author = both(byline.querySelector('b'));
  const role = both(byline.querySelector('div > span'));
  const coverImg = root.querySelector('.article-cover img');
  const prose = { tr: root.querySelector('.prose[data-lang-block="tr"]'), en: root.querySelector('.prose[data-lang-block="en"]') };
  const sources = root.querySelector('.prose.sources');

  const slugger = new GithubSlugger();
  const govde = {};
  for (const L of ['tr', 'en']) {
    const hs = [];
    const b = blocks(prose[L], hs);
    slugger.slug(TOC[L].heading); // "Bu yazıda" başlığı da kimlik alır (Astro ile aynı sıra)
    // Kimlikler astro/src/utils/rehypeLangHeadingIds.ts ile aynı kuralla: <dil>-<github-slugger>
    const ids = hs.map((h) => `${L}-${slugger.slug(h.text)}`);
    const toc = [
      `## ${TOC[L].heading}`,
      '',
      '<details>',
      `<summary>${TOC[L].summary}</summary>`,
      '',
      hs.map((h, i) => `${h.depth === 3 ? '  ' : ''}- [${esc(h.text)}](#${ids[i]})`).join('\n'),
      '',
      '</details>',
    ].join('\n');
    govde[L] = [`<div data-lang-block="${L}" lang="${L}">`, '', esc(lede[L]), '', toc, '', b.join('\n\n'), '', '</div>'].join('\n');
  }
  const kaynakca = sources.querySelectorAll('ol > li').map((li, i) => `${i + 1}. ${para(li)}`).join('\n');
  const cover = COVER[slug];
  const kapak = `<img src="../assets/img/${cover}-1800.webp" srcset="../assets/img/${cover}-900.webp 900w, ../assets/img/${cover}-1800.webp 1800w" sizes="(min-width: 768px) 736px, 100vw" width="1800" height="1125" fetchpriority="high" decoding="async" alt=${q(coverImg.getAttribute('alt'))} data-alt-en=${q(coverImg.getAttribute('data-alt-en'))}>`;

  const fm = [
    '---',
    `title: ${q(title.tr)}`,
    `titleEn: ${q(title.en)}`,
    `description: ${q(root.querySelector('meta[name="description"]').getAttribute('content'))}`,
    `descriptionEn: ${q(html.getAttribute('data-desc-en'))}`,
    `lede: ${q(lede.tr)}`,
    `ledeEn: ${q(lede.en)}`,
    `pubDatetime: ${ld.datePublished}T09:00:00+03:00`,
    `dateModifiedLd: ${q(ld.dateModified)}`,
    `author: ${q(author.tr)}`,
    `authorEn: ${q(author.en)}`,
    `authorRole: ${q(role.tr)}`,
    `authorRoleEn: ${q(role.en)}`,
    `category: ${q(cat.tr)}`,
    `categoryEn: ${q(cat.en)}`,
    `readingTime: ${q(read.tr)}`,
    `readingTimeEn: ${q(read.en)}`,
    `cover: ${q(cover)}`,
    `coverAlt: ${q(coverImg.getAttribute('alt'))}`,
    `coverAltEn: ${q(coverImg.getAttribute('data-alt-en'))}`,
    `tags: [${TAGS[slug].map(q).join(', ')}]`,
    '---',
  ].join('\n');
  const md = [
    fm,
    '',
    kapak,
    '',
    govde.tr,
    '',
    govde.en,
    '',
    `<h2 id="kaynaklar" data-i18n="article.sources">${sources.querySelector('.label').text.trim()}</h2>`,
    '',
    kaynakca,
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, slug + '.md'), md);

  // Kelime sayımı (test/protokol.js derlenmiş sayfayla karşılaştırır)
  const words = (s) => s.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
  raporlar.push({ slug, tr: words(prose.tr.text), en: words(prose.en.text), kaynak: words(sources.querySelector('ol').text), lede: words(lede.tr) + words(lede.en) });
}
fs.writeFileSync(path.join(__dirname, 'test/blog-kelime.json'), JSON.stringify(raporlar, null, 1));
console.log(raporlar);
