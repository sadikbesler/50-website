import type { APIRoute } from "astro";
import { getAssetPath } from "@/utils/withBase";

// AstroPaper robots.txt.ts; site haritası Mizan'ın sitemap.xml'i.
const getRobotsTxt = (sitemapURL: URL) => `
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL(getAssetPath("sitemap.xml"), site);
  return new Response(getRobotsTxt(sitemapURL));
};
