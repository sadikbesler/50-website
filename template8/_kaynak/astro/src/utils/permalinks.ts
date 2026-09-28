import slugify from 'limax';

import { SITE, APP_BLOG } from 'astrowind:config';

import { trim } from '~/utils/utils';

export const trimSlash = (s: string) => trim(trim(s, '/'));
const createPath = (...params: string[]) => {
  const paths = params
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');
  return '/' + paths + (SITE.trailingSlash && paths ? '/' : '');
};

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN = trimSlash(APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`);

/** */
export const getCanonical = (path = ''): string | URL => {
  // Mizan: `build.format: 'file'` — `Astro.url.pathname` ana sayfada `…/index.html` döner;
  // kanonik adres dizin biçiminde (`…/template8/`, `…/blog/`) kalır.
  const url = String(new URL(path.replace(/\/index(\.html)?$/, '/'), SITE.site));
  if (url.endsWith('/') && (path.endsWith('/') || /\/index(\.html)?$/.test(path))) return url;
  if (SITE.trailingSlash == false && path && url.endsWith('/')) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith('/')) {
    return url + '/';
  }
  return url;
};

/** */
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'blog':
      permalink = getBlogPermalink();
      break;

    case 'asset':
      permalink = getAsset(slug);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** */
export const getAsset = (path: string): string =>
  '/' +
  [BASE_PATHNAME, path]
    .map((el) => trimSlash(el))
    .filter((el) => !!el)
    .join('/');

/** */
const definitivePermalink = (permalink: string): string => toFileFormat(createPath(BASE_PATHNAME, permalink));

/**
 * Mizan: `build.format: 'file'` çıktısıyla aynı adresler — GitHub Pages ve yerel
 * önizleme (python http.server) uzantısız adresi `.html`'e çevirmez.
 *   /base            → /base/            (ana sayfa, index.html)
 *   /base/blog       → /base/blog/       (blog listesi, blog/index.html)
 *   /base/kvkk       → /base/kvkk.html
 *   /base/#randevu   → olduğu gibi
 */
const toFileFormat = (path: string): string => {
  const base = '/' + trimSlash(BASE_PATHNAME);
  if (path === base || path === base + '/' || path === '/') return base === '/' ? '/' : base + '/';
  if (path.includes('#') || path.includes('?') || /\.[a-z0-9]+$/i.test(path)) return path;
  if (/\/index$/.test(path)) return path.replace(/index$/, '');
  // Blog listesi dizin olarak yayınlanır (blog/index.html)
  if (BLOG_BASE && path === `${base === '/' ? '' : base}/${BLOG_BASE}`) return path + '/';
  return path + '.html';
};
