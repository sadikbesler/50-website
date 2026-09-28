import {
  defineConfig,
  envField,
  fontProviders,
  svgoOptimizer,
} from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import rehypeCallouts from "rehype-callouts";
import rehypeLangHeadingIds from "./src/utils/rehypeLangHeadingIds";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";

// template9 — Mizan. Farklar (DURUM.md'de gerekçeleriyle):
// - site/base: GitHub Pages alt klasörü (0.7 Astro kuralı).
// - build.format "preserve": kvkk.astro → kvkk.html, blog/[slug].astro → blog/<slug>.html
//   (0.7'nin "file" isteğiyle aynı adresler) ve index.astro → klasör/index.html
//   ("file" blog/index.astro'yu blog.html yapar; blog/ bağlantısı kırılırdı).
// - inlineStylesheets "never" + assetsInlineLimit 0: satır içi <style>/<script> kalmasın (CSP).
// - @astrojs/sitemap yerine Mizan'ın hreflang'lı sitemap.xml'i src/pages/sitemap.xml.ts'te üretilir.
// - i18n: tek dil "tr" (EN, Mizan'ın site.js'i ile çalışma anında).
// - rehypeLangHeadingIds: makale başlık kimlikleri tr-…/en-… (diyetisyen-v2 kuralı; arama alt sonuçları dile göre süzülür).
export default defineConfig({
  site: "https://sadikbesler.github.io",
  base: "/50-website/template9",
  trailingSlash: "ignore",
  build: {
    format: "preserve",
    inlineStylesheets: "never",
  },
  integrations: [mdx()],
  i18n: {
    locales: ["tr"],
    defaultLocale: "tr",
    routing: {
      prefixDefaultLocale: false,
    },
  },
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
      rehypePlugins: [rehypeCallouts, rehypeLangHeadingIds],
    }),
    shikiConfig: {
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: { assetsInlineLimit: 0 },
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      // Türkçe harfler (ğ ş ı İ) latin-ext alt kümesinde.
      subsets: ["latin", "latin-ext"],
      formats: ["woff", "ttf"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    svgOptimizer: svgoOptimizer(),
  },
});
