import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { MetaDataOpenGraph } from '~/types';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { getAsset } from '~/utils/permalinks';

/** Mizan: public/ yolu → base önekli yol (`/assets/img/x.webp` → `/50-website/template8/assets/img/x.webp`). */
export const publicPath = (src: string): string => {
  const base = getAsset('/');
  return src.startsWith(base + '/') ? src : getAsset(src);
};

/**
 * Mizan: public/assets/img içindeki aynı görselin boyut kopyalarından srcset üretir
 * (`blog-su-900.webp` → `…-900.webp 900w, …-1800.webp 1800w`). Yeni görsel üretilmez.
 */
let _publicImages: string[] | undefined;
export const publicSrcset = (src: string): string | undefined => {
  const m = /^(.*\/)?([^/]+?)-(\d+)\.(webp|jpg|jpeg|png)$/.exec(src);
  if (!m) return undefined;
  _publicImages ??= readdirSync(path.resolve(process.cwd(), 'public/assets/img'));
  const [, , name, , ext] = m;
  const dir = publicPath(src).replace(/[^/]+$/, '');
  const sizes = _publicImages
    .filter((f) => f.startsWith(`${name}-`) && f.endsWith(`.${ext}`))
    .map((f) => f.slice(name.length + 1, -(ext.length + 1)))
    .filter((w) => /^\d+$/.test(w))
    .map(Number)
    .sort((a, b) => a - b);
  return sizes.length > 1 ? sizes.map((w) => `${dir}${name}-${w}.${ext} ${w}w`).join(', ') : undefined;
};

// Lazy-loaded glob of local images. The glob runs once and is cached.
let _localImages: Record<string, () => Promise<unknown>> | undefined;

const loadLocalImages = () => {
  if (_localImages) return _localImages;
  try {
    _localImages = import.meta.glob(
      '~/assets/images/**/*.{jpeg,jpg,png,tiff,webp,gif,svg,JPEG,JPG,PNG,TIFF,WEBP,GIF,SVG}'
    );
  } catch {
    _localImages = {};
  }
  return _localImages;
};

/**
 * Resolve an image reference to either ImageMetadata (local) or a string URL (remote/public).
 * Accepts:
 *   - `null` / `undefined`         → returned as-is
 *   - `ImageMetadata`              → returned as-is (already imported)
 *   - `"http(s)://…"` or `"/path"` → returned as-is (external or public/)
 *   - `"~/assets/images/…"`        → resolved to its ImageMetadata via the glob
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  if (typeof imagePath !== 'string') return imagePath;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('/'))
    return imagePath;
  if (!imagePath.startsWith('~/assets/images')) return imagePath;

  const images = loadLocalImages();
  const key = imagePath.replace('~/', '/src/');
  const loader = images[key];

  if (typeof loader !== 'function') return null;
  return ((await loader()) as { default: ImageMetadata }).default;
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 626;

/**
 * Adapt OpenGraph images to absolute, optimized URLs.
 * Used by Metadata.astro to produce social-card-ready URLs.
 */
export const adaptOpenGraphImages = async (
  openGraph: MetaDataOpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<MetaDataOpenGraph> => {
  if (!openGraph?.images?.length) return openGraph;

  const adaptedImages = await Promise.all(
    openGraph.images.map(async (image) => {
      if (!image?.url) return { url: '' };

      const resolved = await findImage(image.url);
      if (!resolved) return { url: '' };

      // Mizan: public/ altındaki hazır görseller (og-image.jpg, blog kapakları) işlenmeden,
      // base yolu eklenmiş mutlak adresle verilir.
      if (typeof resolved === 'string' && resolved.startsWith('/')) {
        return {
          url: String(new URL(publicPath(resolved), astroSite)),
          width: image.width,
          height: image.height,
        };
      }

      // Generate an optimized JPG via Astro's image service (Sharp by default).
      const optimized = await getImage({
        src: resolved,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        format: 'jpg',
      });

      return {
        url: String(new URL(optimized.src, astroSite)),
        width: Number(optimized.attributes.width) || OG_WIDTH,
        height: Number(optimized.attributes.height) || OG_HEIGHT,
      };
    })
  );

  return { ...openGraph, images: adaptedImages };
};

/**
 * Mizan: widget'ların HTML görsel yuvası için <img> dizesi. `altKey` verilirse
 * site.js alt metnini dile göre değiştirir (data-i18n-attr). Satır içi stil yok (CSP).
 */
export const imgHtml = ({
  src,
  alt,
  altKey,
  cls = '',
  sizes,
  width,
  height,
  eager = false,
  extra = '',
}: {
  src: string;
  alt: string;
  altKey?: string;
  cls?: string;
  sizes?: string;
  width: number;
  height: number;
  eager?: boolean;
  extra?: string;
}): string => {
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const srcset = publicSrcset(src);
  return [
    `<img src="${publicPath(src)}"`,
    srcset ? ` srcset="${srcset}"` : '',
    srcset && sizes ? ` sizes="${sizes}"` : '',
    ` width="${width}" height="${height}"`,
    eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"',
    ' decoding="async"',
    ` alt="${esc(alt)}"`,
    altKey ? ` data-i18n-attr="alt:${altKey}"` : '',
    cls ? ` class="${cls}"` : '',
    extra ? ` ${extra}` : '',
    '>',
  ].join('');
};
