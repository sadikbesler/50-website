// Mizan: diyetisyen-v2'deki gibi hreflang'lı tek sitemap.xml (TR varsayılan, EN ?lang=en).
// @astrojs/sitemap'in sitemap-index.xml'i yerine; robots.txt buna işaret eder.
import { fetchPosts } from '~/utils/blog';
import { getBlogPermalink, getCanonical, getHomePermalink, getPermalink } from '~/utils/permalinks';

export const prerender = true;

export const GET = async () => {
  const today = new Date().toISOString().slice(0, 10);
  const posts = await fetchPosts();
  const pages: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [
    { loc: String(getCanonical(getHomePermalink())), lastmod: today, changefreq: 'weekly', priority: '1.0' },
    { loc: String(getCanonical(getBlogPermalink())), lastmod: today, changefreq: 'weekly', priority: '0.8' },
    ...posts.map((post) => ({
      loc: String(getCanonical(getPermalink(post.permalink, 'post'))),
      lastmod: (post.updateDate ?? post.publishDate).toISOString().slice(0, 10),
      changefreq: 'monthly',
      priority: '0.7',
    })),
    { loc: String(getCanonical(getPermalink('/kvkk'))), lastmod: today, changefreq: 'yearly', priority: '0.3' },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages
  .map(
    (p) => `  <url>
    <loc>${p.loc}</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${p.loc}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${p.loc}?lang=en"/>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
