import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getUniqueTags } from "@/utils/getUniqueTags";

// diyetisyen-v2'nin sitemap.xml biçimi (hreflang tr/en) + AstroPaper sayfaları (etiketler, arşiv, arama, hakkımızda).
// @astrojs/sitemap yerine: her adres ?lang=en karşılığıyla birlikte yazılır.
const SITE = "https://sadikbesler.github.io/50-website/template9/";

export const GET: APIRoute = async () => {
  const posts = getSortedPosts(await getCollection("posts"));
  const tags = getUniqueTags(posts);
  const today = new Date().toISOString().slice(0, 10);
  const urls: [string, string, string, string][] = [
    ["", today, "weekly", "1.0"],
    ["blog/", today, "weekly", "0.8"],
    ...posts.map((p): [string, string, string, string] => [
      `blog/${p.id}.html`,
      p.data.dateModifiedLd ?? p.data.pubDatetime.toISOString().slice(0, 10),
      "monthly",
      "0.7",
    ]),
    ["about/", today, "monthly", "0.6"],
    ["tags/", today, "weekly", "0.5"],
    ...tags.map(({ tag }): [string, string, string, string] => [`tags/${tag}/`, today, "weekly", "0.4"]),
    ["archives/", today, "weekly", "0.4"],
    ["search/", today, "monthly", "0.3"],
    ["kvkk.html", "2026-09-17", "yearly", "0.3"],
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    ([path, lastmod, freq, prio]) => `  <url>
    <loc>${SITE}${path}</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${SITE}${path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${path}?lang=en"/>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
