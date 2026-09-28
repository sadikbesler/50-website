# Mizan: diyetisyen-v2 JS dosyalarını public/assets/js'e alır ve template8 yamalarını uygular.
# Kaynak yalnızca okunur (claude-frontend-50/diyetisyen-animasyon-v2/assets/js).
# Yamalar (0.6 / 0.7):
#   boot.js  — "Gezegen yükleyicisi" bloğu silinir; <html class="dark"> ilk boyamadan önce konur;
#              theme-color AstroWind zemin rengine (#FFFFFF / #08090A) çekilir.
#   site.js  — applyTheme: html.dark + CustomEvent('mizan:theme'); theme-color aynı değerler.
#   config.js — siteUrl template8 adresi (0.2).
#   i18n.js  — bu şablonda eklenen metinlerin İngilizcesi ("template8" bloğu).
# Çalıştır: python3 scripts/js-yamalari.py
import pathlib, shutil

kok = pathlib.Path(__file__).resolve().parent.parent
kaynak = (kok / '../../../diyetisyen-animasyon-v2/assets/js').resolve()
hedef = kok / 'public/assets/js'
hedef.mkdir(parents=True, exist_ok=True)
for ad in ['boot', 'config', 'i18n', 'site', 'booking', 'tools', 'content', 'chat']:
    shutil.copyfile(kaynak / f'{ad}.js', hedef / f'{ad}.js')

def yama(ad, degisimler):
    p = hedef / f'{ad}.js'
    s = p.read_text()
    for eski, yeni in degisimler:
        assert s.count(eski) == 1, f'{ad}.js: bulunamadı → {eski[:60]}'
        s = s.replace(eski, yeni)
    p.write_text(s)

# boot.js
p = hedef / 'boot.js'
s = p.read_text()
i = s.index('  /* Gezegen yükleyicisi')
j = s.rindex('})();')
p.write_text(s[:i].rstrip() + '\n' + s[j:])
yama('boot', [
    ('/* Runs before first paint: sets theme, language and the cinematic layer so the page never flashes. */',
     '/* Runs before first paint: sets theme and language so the page never flashes. */'),
    ("  d.setAttribute('data-theme', theme);\n",
     "  d.setAttribute('data-theme', theme);\n  d.classList.toggle('dark', theme === 'dark');\n"),
    ("theme === 'dark' ? '#0B0C0A' : '#1E231D'", "theme === 'dark' ? '#08090A' : '#FFFFFF'"),
])

# site.js
yama('site', [
    ("    root.setAttribute('data-theme', theme);\n    if (themeMeta)",
     "    root.setAttribute('data-theme', theme);\n"
     "    root.classList.toggle('dark', theme === 'dark');\n"
     "    document.dispatchEvent(new CustomEvent('mizan:theme', { detail: theme }));\n"
     "    if (themeMeta)"),
    ("theme === 'dark' ? '#0B0C0A' : '#1E231D'", "theme === 'dark' ? '#08090A' : '#FFFFFF'"),
])

# config.js (0.2 adres dönüşümü)
yama('config', [
    ("siteUrl: 'https://sadikbesler.github.io/asteria-web/diyetisyen-animasyon-v2/'",
     "siteUrl: 'https://sadikbesler.github.io/50-website/template8/'"),
])

# i18n.js
yama('i18n', [
    ("  'kvkk.label': 'Legal'\n};",
     """  'kvkk.label': 'Legal',

  /* template8 (AstroWind): bu şablonda eklenen metinler */
  'a11y.rss': 'RSS feed',
  'footer.theme': 'Theme',
  'article.share': 'Share:',
  'article.updated': 'Updated',
  'incl.yesTitle': 'Included',
  'incl.noTitle': 'Not included',
  '404.error': 'Error',
  '404.title': 'We couldn’t find that page.',
  '404.text': 'The link may have changed or the page may have been removed. From the home page you can book, and find recipes and articles.',
  '404.back': 'Back to the home page'
};"""),
])
print('JS yamaları uygulandı:', ', '.join(sorted(x.name for x in hedef.glob('*.js'))))
