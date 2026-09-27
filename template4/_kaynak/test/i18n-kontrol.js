// Sayfalardaki data-i18n / data-i18n-attr anahtarlarından i18n.js EN'de olmayanları listeler
const fs = require('fs'), path = require('path'), vm = require('vm');
const H = path.resolve(__dirname, '../..');
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(H, 'assets/js/i18n.js'), 'utf8'), ctx);
const EN = ctx.window.MIZAN_I18N_EN;
const files = ['index.html', 'kvkk.html', ...fs.readdirSync(path.join(H, 'blog')).map((f) => 'blog/' + f)];
const eksik = new Set();
for (const f of files) {
  const s = fs.readFileSync(path.join(H, f), 'utf8');
  for (const m of s.matchAll(/data-i18n="([^"]+)"/g)) if (!(m[1] in EN)) eksik.add(m[1] + '  (' + f + ')');
  for (const m of s.matchAll(/data-i18n-attr="([^"]+)"/g)) m[1].split(';').forEach((p) => { const k = p.split(':')[1]; if (!(k in EN)) eksik.add(k + '  (' + f + ')'); });
}
console.log([...eksik].join('\n') || 'eksik yok');
