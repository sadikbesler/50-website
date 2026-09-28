import Slugger from "github-slugger";
import { visit } from "unist-util-visit";

/**
 * Mizan: makalelerde iki dilin gövdesi aynı sayfada (<div data-lang-block="tr|en">).
 * Bu eklenti dil bloğundaki başlıklara diyetisyen-v2'deki gibi "tr-…"/"en-…" önekli kimlik verir.
 * Böylece Pagefind alt sonuçları dile göre süzülebilir. Kimlik yoksa Astro'nun kendi
 * rehypeHeadingIds'i (aynı github-slugger) çalışırdı; o, var olan kimliğe dokunmaz.
 * _kaynak/blog-cevir.js içindekiler bağlantılarını aynı kuralla üretir.
 */
type Node = { type: string; value?: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] };

export default function rehypeLangHeadingIds() {
  return (tree: Node) => {
    const slugger = new Slugger();
    let lang: string | null = null;
    let depth = 0;
    for (const node of tree.children ?? []) {
      if (node.type === "raw" && node.value) {
        const open = (node.value.match(/<div\b/g) ?? []).length;
        const m = /data-lang-block="(tr|en)"/.exec(node.value);
        if (m && depth === 0) lang = m[1];
        depth += open - (node.value.match(/<\/div>/g) ?? []).length;
        if (depth <= 0) {
          depth = 0;
          if (!m) lang = null;
        }
        continue;
      }
      if (!lang || node.type !== "element" || !/^h[2-6]$/.test(node.tagName ?? "")) continue;
      if (typeof node.properties?.id === "string") continue;
      let text = "";
      visit(node as never, "text", (t: Node) => {
        text += t.value ?? "";
      });
      node.properties = { ...node.properties, id: `${lang}-${slugger.slug(text)}` };
    }
  };
}
