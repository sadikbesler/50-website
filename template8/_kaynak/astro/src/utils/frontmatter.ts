import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';
import type { RehypePlugin, RemarkPlugin } from '@astrojs/markdown-remark';

export const readingTimeRemarkPlugin: RemarkPlugin = () => {
  return function (tree, file) {
    const textOnPage = toString(tree);
    const readingTime = Math.ceil(getReadingTime(textOnPage).minutes);

    if (typeof file?.data?.astro?.frontmatter !== 'undefined') {
      file.data.astro.frontmatter.readingTime = readingTime;
    }
  };
};

export const responsiveTablesRehypePlugin: RehypePlugin = () => {
  return function (tree) {
    if (!tree.children) return;

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];

      if (child.type === 'element' && child.tagName === 'table') {
        tree.children[i] = {
          type: 'element',
          tagName: 'div',
          properties: {
            // Mizan: CSP satır içi stile izin vermez; `style="overflow:auto"` yerine sınıf.
            className: ['overflow-auto'],
          },
          children: [child],
        };

        i++;
      }
    }
  };
};

/**
 * Mizan: makalelerde TR ve EN metin aynı dosyada, `<div data-lang-block="tr|en">`
 * blokları içinde durur. Başlık kimlikleri özgün sitedekiyle aynı kalsın diye
 * (`#tr-1-veri-sorumlusu`, `#en-your-rights` …) bloğun diliyle öneklenir.
 */
const TR_HARF: Record<string, string> = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u' };
export const mizanSlug = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[’'“”"]/g, '')
    .replace(/[çğıöşü]/g, (m) => TR_HARF[m])
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const langHeadingIdsRemarkPlugin: RemarkPlugin = () => {
  return function (tree) {
    let lang: string | null = null;
    for (const node of (tree as { children: Array<Record<string, unknown>> }).children) {
      if (node.type === 'html') {
        const value = String(node.value);
        const open = /data-lang-block="(tr|en)"/.exec(value);
        if (open && !/<\/div>\s*$/.test(value)) lang = open[1];
        else if (/^<\/div>\s*$/.test(value.trim())) lang = null;
        continue;
      }
      if (node.type === 'heading' && lang) {
        const data = (node.data ??= {}) as { hProperties?: Record<string, unknown> };
        data.hProperties = { ...(data.hProperties ?? {}), id: `${lang}-${mizanSlug(toString(node as never))}` };
      }
    }
  };
};
