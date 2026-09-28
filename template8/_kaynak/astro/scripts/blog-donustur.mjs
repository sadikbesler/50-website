// Mizan: diyetisyen-v2'deki 6 makaleyi ve KVKK metnini Markdown'a çevirir.
// Girdi: _kaynak/ozgun/ (özgün sayfaların kopyası) · Çıktı: src/data/post/*.md, src/pages/kvkk.md
// Metin aynen taşınır: paragraflar, başlıklar, listeler, tablolar Markdown'a; "callout"
// kutuları özgün HTML dilimi olarak kalır. Başlık kimlikleri (tr-…/en-…) özgünle karşılaştırılır.
// Çalıştır: node scripts/blog-donustur.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';

const here = path.dirname(fileURLToPath(import.meta.url));
const OZGUN = path.resolve(here, '../../ozgun');
const POST_DIR = path.resolve(here, '../src/data/post');
const PAGES_DIR = path.resolve(here, '../src/pages');

const TR_HARF = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
const mizanSlug = (t) =>
  t.toLowerCase().replace(/[’'“”"]/g, '').replace(/[çğıöşü]/g, (m) => TR_HARF[m]).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const uyarilar = [];

/* ---------- küçük hast yardımcıları ---------- */
const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);
const cls = (n) => (n.properties && n.properties.className) || [];
const attr = (n, a) => (n.properties ? n.properties[a] : undefined);
function* walk(n) {
  yield n;
  for (const c of n.children || []) yield* walk(c);
}
const find = (root, pred) => { for (const n of walk(root)) if (pred(n)) return n; return null; };
const findAll = (root, pred) => [...walk(root)].filter(pred);
const byLang = (n, lang) => find(n, (x) => isEl(x) && attr(x, 'dataLangBlock') === lang);
const txt = (n) => (n ? toText(n).replace(/\s+/g, ' ').trim() : '');
const trEn = (n) => ({ tr: txt(byLang(n, 'tr')), en: txt(byLang(n, 'en')) });

/* ---------- Markdown yazımı ---------- */
function esc(s, { inTable = false } = {}) {
  let r = s.replace(/\\/g, '\\\\').replace(/([*_`\[\]~<])/g, '\\$1');
  if (inTable) r = r.replace(/\|/g, '\\|');
  return r;
}
function inline(n, opts) {
  if (n.type === 'text') return esc(n.value, opts);
  if (!isEl(n)) return '';
  const inner = n.children.map((c) => inline(c, opts)).join('');
  switch (n.tagName) {
    case 'strong':
    case 'b':
      return `**${inner}**`;
    case 'em':
    case 'i':
      return `*${inner}*`;
    case 'a':
      return `[${inner}](${attr(n, 'href')})`;
    case 'br':
      return '<br>';
    default:
      uyarilar.push(`bilinmeyen satır içi öğe <${n.tagName}>`);
      return inner;
  }
}
// Satır başında blok sözdizimine dönüşebilecek karakterleri etkisizleştir.
const satirBasi = (s) => s.replace(/^(\d+)\. /, '$1\\. ').replace(/^([#>+-]) /, '\\$1 ');

function block(n, src) {
  if (n.type === 'text') {
    if (n.value.trim()) uyarilar.push(`blok düzeyinde metin: ${n.value.trim().slice(0, 40)}`);
    return null;
  }
  if (!isEl(n)) return null;
  const t = n.tagName;
  if (/^h[1-6]$/.test(t)) return `${'#'.repeat(+t[1])} ${n.children.map((c) => inline(c)).join('')}`;
  if (t === 'p') return satirBasi(n.children.map((c) => inline(c)).join(''));
  if (t === 'ul' || t === 'ol') {
    let i = 0;
    return n.children
      .filter((c) => isEl(c, 'li'))
      .map((li) => `${t === 'ol' ? `${++i}.` : '-'} ${li.children.map((c) => inline(c)).join('').trim()}`)
      .join('\n');
  }
  if (t === 'table') {
    const rows = findAll(n, (x) => isEl(x, 'tr'));
    const cells = (tr) => tr.children.filter((c) => isEl(c, 'th') || isEl(c, 'td')).map((c) => c.children.map((x) => inline(x, { inTable: true })).join('').trim());
    const head = cells(rows[0]);
    const out = [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`];
    for (const r of rows.slice(1)) out.push(`| ${cells(r).join(' | ')} |`);
    return out.join('\n');
  }
  if (t === 'div' && cls(n).includes('table-scroll')) {
    const tbl = n.children.find((c) => isEl(c, 'table'));
    return block(tbl, src);
  }
  if (t === 'div' && cls(n).includes('callout')) {
    // Özgün HTML dilimi, tek satırda (Markdown içinde tek bir HTML bloğu olarak kalır)
    return src.slice(n.position.start.offset, n.position.end.offset).replace(/\n\s*/g, ' ');
  }
  uyarilar.push(`bilinmeyen blok öğe <${t} class="${cls(n).join(' ')}">`);
  return src.slice(n.position.start.offset, n.position.end.offset);
}

function proseToMd(prose, src, lang) {
  const parts = prose.children.map((c) => block(c, src)).filter((x) => x != null);
  // Başlık kimliklerini özgünle karşılaştır
  for (const h of findAll(prose, (x) => isEl(x) && /^h[1-6]$/.test(x.tagName))) {
    const beklenen = attr(h, 'id');
    const uretilen = `${lang}-${mizanSlug(txt(h))}`;
    if (beklenen && beklenen !== uretilen) uyarilar.push(`kimlik farkı: ${beklenen} ≠ ${uretilen}`);
  }
  return parts.join('\n\n');
}

const y = (v) => JSON.stringify(v); // JSON dizesi geçerli bir YAML dizesidir

function metaOf(tree) {
  const html = find(tree, (x) => isEl(x, 'html'));
  const meta = (name) => { const m = find(tree, (x) => isEl(x, 'meta') && (attr(x, 'name') === name || attr(x, 'property') === name)); return m ? attr(m, 'content') : undefined; };
  return {
    titleTr: txt(find(tree, (x) => isEl(x, 'title'))),
    titleEn: attr(html, 'dataTitleEn'),
    descTr: meta('description'),
    descEn: attr(html, 'dataDescEn'),
  };
}

/* ---------- 6 makale ---------- */
const dosyalar = readdirSync(path.join(OZGUN, 'blog')).filter((f) => f.endsWith('.html') && f !== 'index.html');
for (const dosya of dosyalar) {
  const slug = dosya.replace(/\.html$/, '');
  const src = readFileSync(path.join(OZGUN, 'blog', dosya), 'utf8');
  const tree = fromHtml(src);
  const m = metaOf(tree);
  const ld = JSON.parse(txt(find(tree, (x) => isEl(x, 'script') && attr(x, 'type') === 'application/ld+json')) || '{}');
  const posting = (ld['@graph'] || []).find((g) => g['@type'] === 'BlogPosting') || {};

  const head = find(tree, (x) => isEl(x, 'header') && cls(x).includes('article-head'));
  const metaP = find(head, (x) => isEl(x, 'p') && cls(x).includes('post-meta'));
  const cat = trEn(find(metaP, (x) => isEl(x, 'span') && cls(x).includes('cat')));
  const time = find(metaP, (x) => isEl(x, 'time'));
  const read = trEn(metaP.children.filter((c) => isEl(c, 'span') && !cls(c).includes('cat')).pop());
  const title = trEn(find(head, (x) => isEl(x, 'h1')));
  const lede = trEn(find(head, (x) => isEl(x, 'p') && cls(x).includes('lede')));
  const byline = find(head, (x) => isEl(x) && cls(x).includes('byline'));
  const author = trEn(find(byline, (x) => isEl(x, 'b')));
  const role = trEn(byline.children.find((c) => isEl(c, 'div')).children.filter((c) => isEl(c, 'span')).pop());
  const authorImg = attr(find(byline, (x) => isEl(x, 'img')), 'src').replace(/^\.\.\//, '/');
  const cover = find(tree, (x) => isEl(x, 'img') && find(tree, (f) => isEl(f, 'figure') && cls(f).includes('article-cover') && f.children.includes(x)));

  // Blog listesindeki kart özeti (= meta açıklaması) özgün blog/index.html'den
  const idx = fromHtml(readFileSync(path.join(OZGUN, 'blog', 'index.html'), 'utf8'));
  const kart = find(idx, (x) => isEl(x, 'a') && attr(x, 'href') === dosya);
  const kartOzet = trEn(kart.children.filter((c) => isEl(c, 'p')).pop());

  const proseTr = find(tree, (x) => isEl(x, 'div') && cls(x).includes('prose') && attr(x, 'dataLangBlock') === 'tr');
  const proseEn = find(tree, (x) => isEl(x, 'div') && cls(x).includes('prose') && attr(x, 'dataLangBlock') === 'en');
  const sources = find(tree, (x) => isEl(x, 'div') && cls(x).includes('sources'));
  const sourcesLabel = find(sources, (x) => isEl(x, 'p'));
  const sourcesList = find(sources, (x) => isEl(x, 'ol'));

  const fm = [
    '---',
    `publishDate: ${attr(time, 'dateTime')}`,
    `updateDate: ${posting.dateModified || attr(time, 'dateTime')}`,
    `title: ${y(title.tr)}`,
    `excerpt: ${y(kartOzet.tr)}`,
    `lede: ${y(lede.tr)}`,
    `image: ${y(attr(cover, 'src').replace(/^\.\.\//, '/'))}`,
    `imageAlt: ${y(attr(cover, 'alt'))}`,
    `category: ${y(cat.tr)}`,
    `author: ${y(author.tr)}`,
    `authorRole: ${y(role.tr)}`,
    `authorImage: ${y(authorImg)}`,
    `readingTimeText: ${y(read.tr)}`,
    'metadata:',
    `  title: ${y(m.titleTr)}`,
    `  description: ${y(m.descTr)}`,
    'en:',
    `  title: ${y(title.en)}`,
    `  excerpt: ${y(kartOzet.en)}`,
    `  lede: ${y(lede.en)}`,
    `  category: ${y(cat.en)}`,
    `  imageAlt: ${y(attr(cover, 'dataAltEn'))}`,
    `  author: ${y(author.en)}`,
    `  authorRole: ${y(role.en)}`,
    `  readingTimeText: ${y(read.en)}`,
    `  metaTitle: ${y(m.titleEn)}`,
    `  metaDescription: ${y(m.descEn)}`,
    '---',
  ].join('\n');

  const body = [
    '<div class="mizan-prose" data-lang-block="tr" lang="tr">',
    proseToMd(proseTr, src, 'tr'),
    '</div>',
    '<div class="mizan-prose" data-lang-block="en" lang="en">',
    proseToMd(proseEn, src, 'en'),
    '</div>',
    '<div class="mizan-sources">',
    src.slice(sourcesLabel.position.start.offset, sourcesLabel.position.end.offset),
    block(sourcesList, src),
    '</div>',
  ].join('\n\n');

  writeFileSync(path.join(POST_DIR, `${slug}.md`), `${fm}\n\n${body}\n`);
  console.log('makale →', `src/data/post/${slug}.md`);
}

/* ---------- KVKK ---------- */
{
  const src = readFileSync(path.join(OZGUN, 'kvkk.html'), 'utf8');
  const tree = fromHtml(src);
  const m = metaOf(tree);
  const head = find(tree, (x) => isEl(x, 'header') && cls(x).includes('article-head'));
  const label = trEn(find(head, (x) => isEl(x, 'p') && cls(x).includes('label')));
  const title = trEn(find(head, (x) => isEl(x, 'h1')));
  const lede = trEn(find(head, (x) => isEl(x, 'p') && cls(x).includes('lede')));
  const proseTr = find(tree, (x) => isEl(x, 'div') && cls(x).includes('prose') && attr(x, 'dataLangBlock') === 'tr');
  const proseEn = find(tree, (x) => isEl(x, 'div') && cls(x).includes('prose') && attr(x, 'dataLangBlock') === 'en');

  // Bu şablon yazı tiplerini Google Fonts'tan değil, site içinden sunar (Astro Fonts API).
  // Artık doğru olmayan tek cümle iki dilde de çıkarılır (DURUM.md "Kaynaktan farklar").
  const cikar = [
    ' Yazı tipleri Google Fonts üzerinden yüklendiği için tarayıcınızın IP adresi Google’a iletilir.',
    ' Because fonts are loaded from Google Fonts, your browser’s IP address is shared with Google.',
  ];
  const temizle = (s) => { for (const c of cikar) s = s.replace(c, ''); return s; };
  const trMd = temizle(proseToMd(proseTr, src, 'tr'));
  const enMd = temizle(proseToMd(proseEn, src, 'en'));
  for (const c of cikar) if (!src.includes(c.trim())) uyarilar.push(`KVKK: çıkarılacak cümle bulunamadı: ${c}`);

  const fm = [
    '---',
    `title: ${y(title.tr)}`,
    "layout: '~/layouts/MarkdownLayout.astro'",
    `label: ${y(label.tr)}`,
    `lede: ${y(lede.tr)}`,
    `metaTitle: ${y(m.titleTr)}`,
    `description: ${y(m.descTr)}`,
    'en:',
    `  title: ${y(title.en)}`,
    `  label: ${y(label.en)}`,
    `  lede: ${y(lede.en)}`,
    `  metaTitle: ${y(m.titleEn)}`,
    `  metaDescription: ${y(m.descEn)}`,
    '---',
  ].join('\n');
  const body = [
    '<div class="mizan-prose" data-lang-block="tr" lang="tr">',
    trMd,
    '</div>',
    '<div class="mizan-prose" data-lang-block="en" lang="en">',
    enMd,
    '</div>',
  ].join('\n\n');
  writeFileSync(path.join(PAGES_DIR, 'kvkk.md'), `${fm}\n\n${body}\n`);
  console.log('kvkk →', 'src/pages/kvkk.md');
}

if (uyarilar.length) {
  console.log('\nUYARILAR:\n' + uyarilar.map((u) => ' - ' + u).join('\n'));
  process.exitCode = 1;
} else console.log('\nuyarı yok');
