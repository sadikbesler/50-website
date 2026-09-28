// Mizan: derlemeden önce görselleri ve ikonları şablon klasöründen (template8/assets)
// Astro'nun public/ klasörüne kopyalar. public/assets/img ve public/assets/icons
// git'e girmez (.gitignore); tek kopya template8/assets altında durur.
// Mizan JS dosyaları ise kaynak olarak public/assets/js içinde tutulur.
import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const kaynak = path.resolve(here, '../../../assets');
const hedef = path.resolve(here, '../public/assets');

for (const klasor of ['img', 'icons']) {
  const from = path.join(kaynak, klasor);
  if (!existsSync(from)) throw new Error(`Bulunamadı: ${from}`);
  mkdirSync(path.join(hedef, klasor), { recursive: true });
  cpSync(from, path.join(hedef, klasor), { recursive: true });
  console.log(`[varlik-esitle] ${klasor}: ${readdirSync(from).length} dosya`);
}
