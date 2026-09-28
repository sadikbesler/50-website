import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import { getAssetPath } from "./withBase";

function getPostPathSegments(filePath: string | undefined): string[] {
  return (
    filePath
      ?.replace(BLOG_PATH, "")
      .split("/")
      .filter(path => path !== "")
      .filter(path => !path.startsWith("_"))
      .slice(0, -1)
      .map(segment => slugifyStr(segment)) ?? []
  );
}

function getIdSlug(id: string): string {
  const postId = id.split("/");
  return postId.length > 0 ? String(postId[postId.length - 1]) : id;
}

function getPostSlugPath(id: string, filePath: string | undefined): string {
  const pathSegments = getPostPathSegments(filePath);
  const slug = getIdSlug(id);
  return pathSegments.length > 0
    ? [...pathSegments, slug].join("/")
    : String(slug);
}

/**
 * Returns the slug-only path for use as a route param in `getStaticPaths`.
 * e.g. `insulin-direnci-beslenme`
 */
export function getPostSlug(id: string, filePath: string | undefined): string {
  return getPostSlugPath(id, filePath);
}

/**
 * Mizan: makaleler diyetisyen-v2'deki adreslerinde kalır → blog/<slug>.html
 * (AstroPaper'da /posts/<slug>/). Taban (base) önekiyle döner.
 */
export function getPostUrl(
  id: string,
  filePath: string | undefined,
  _locale?: string
): string {
  return getAssetPath(`blog/${getPostSlugPath(id, filePath)}.html`);
}
