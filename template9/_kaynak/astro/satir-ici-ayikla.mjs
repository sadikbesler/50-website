// Derleme sonrası (npm run build): dist/**/*.html içindeki satır içi <style> blokları (Astro <Font>
// bileşeninin @font-face kuralları) dist/_astro/inline.<özet>.css dosyasına taşınır ve <link> ile bağlanır.
// Neden: sayfalardaki CSP "style-src 'self'" satır içi stile izin vermez ('unsafe-inline' eklenmedi).
// Satır içi <script> (type="application/ld+json" dışında) kalırsa derleme hata verir.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIST = path.resolve("dist");
const BASE = "/50-website/template9/";
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
let n = 0;
for (const file of walk(DIST).filter((f) => f.endsWith(".html"))) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_, css) => {
    const hash = crypto.createHash("sha256").update(css).digest("hex").slice(0, 10);
    const name = `inline.${hash}.css`;
    const out = path.join(DIST, "_astro", name);
    if (!fs.existsSync(out)) fs.writeFileSync(out, css);
    n++;
    return `<link rel="stylesheet" href="${BASE}_astro/${name}">`;
  });
  const bad = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/g)];
  if (bad.length) throw new Error(`${path.relative(DIST, file)}: satır içi betik kaldı → ${bad[0][0].slice(0, 80)}`);
  if (/\sstyle="/.test(html)) throw new Error(`${path.relative(DIST, file)}: style="" özniteliği kaldı (CSP)`);
  fs.writeFileSync(file, html);
}
console.log(`satır içi stil → dosya: ${n} blok`);
