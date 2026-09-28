#!/usr/bin/env python3
"""template9 ana sayfası: _kaynak/sayfa/index.sablon.astro → astro/src/pages/index.astro

1. diyetisyen-v2 index.html'den (yalnızca okunur) etkileşimli bölümlerin işaretlemesi alınır
   (araçlar, program, tarifler, randevu, SSS, iletişim, pencereler; 0.3 sözleşmesi aynen kalsın diye).
2. Aynı dosyadan data-i18n anahtarı → Türkçe metin sözlüğü çıkarılır (astro/src/data/tr.json).
   site.js Türkçe metni HTML'den topladığı için sayfaya anahtar değil metnin kendisi basılmalı.
Çalıştır: python3 _kaynak/anasayfa-kur.py
"""
import html
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.normpath(os.path.join(HERE, '../../diyetisyen-animasyon-v2/index.html'))
src = open(SRC, encoding='utf-8').read()


def between(start, end):
    i = src.index(start)
    j = src.index(end, i)
    return src[i:j]


parts = {
    'araclar': between('<div class="tools-head">', '      </div>\n    </section>\n\n    <!-- ================= Program'),
    'program': between('<div class="program-top">', '      </div>\n    </section>\n\n    <!-- ================= Recipes'),
    'tarifler': between('<div class="filter-row"', '      </div>\n    </section>\n\n\n    <!-- ================= Şerit'),
    'clock': between('<div class="clock-card"', '        </header>\n\n        <div class="booking" data-booking>'),
    'randevu': between('<div class="booking" data-booking>', '      </div>\n    </section>\n\n    <!-- ================= Blog'),
    'faq': between('<div class="faq-list" data-faq-list>', '      </div>\n    </section>\n\n    <!-- ================= Sky'),
    'iletisim': between('<div class="contact-grid">', '      </div>\n    </section>\n\n    <!-- ================= Footer'),
    'dialogs': between('<!-- ================= Recipe dialog', '  <!-- ================= Floating actions'),
}
for k, v in list(parts.items()):
    v = re.sub(r'\s+data-reveal(="d\d")?', '', v)
    if k == 'program':
        # AstroPaper sadeliği: yalnızca hizmet ve uzman görselleri kalır
        v = re.sub(r'\s*<figure class="program-media">.*?</figure>', '', v, flags=re.S)
    if k == 'clock':
        v = v.rstrip() + '\n'
    assert '{' not in v and '}' not in v, k
    parts[k] = v.rstrip()

# data-i18n → Türkçe metin (etiketin düz metni; iç içe öğe yoksa)
tr = {}
for m in re.finditer(r'<(\w+)[^>]*\sdata-i18n="([^"]+)"[^>]*>(.*?)</\1>', src, flags=re.S):
    key, inner = m.group(2), m.group(3)
    if '<' in inner:
        continue
    text = html.unescape(re.sub(r'\s+', ' ', inner).strip())
    tr.setdefault(key, text)
# data-i18n-attr="alt:x;aria-label:y" → aynı öğedeki özniteliğin değeri
for m in re.finditer(r'<\w+([^>]*)>', src):
    attrs = m.group(1)
    a = re.search(r'data-i18n-attr="([^"]+)"', attrs)
    if not a:
        continue
    for pair in a.group(1).split(';'):
        name, _, key = pair.partition(':')
        v = re.search(r'\s' + re.escape(name.strip()) + r'="([^"]*)"', attrs)
        if v:
            tr.setdefault(key.strip(), html.unescape(v.group(1)))

os.makedirs(os.path.join(HERE, 'astro/src/data'), exist_ok=True)
with open(os.path.join(HERE, 'astro/src/data/tr.json'), 'w', encoding='utf-8') as f:
    json.dump(tr, f, ensure_ascii=False, indent=1, sort_keys=True)

tpl = open(os.path.join(HERE, 'sayfa/index.sablon.astro'), encoding='utf-8').read()
out = re.sub(r'\{\{parca:(\w+)\}\}', lambda m: parts[m.group(1)], tpl)
assert '{{parca' not in out
with open(os.path.join(HERE, 'astro/src/pages/index.astro'), 'w', encoding='utf-8') as f:
    f.write(out)
print('index.astro yazıldı;', len(tr), 'Türkçe anahtar')

# ---- KVKK: diyetisyen-v2 kvkk.html gövdesi → astro/src/data/kvkk.html (sayfa: src/pages/kvkk.astro) ----
K = open(os.path.normpath(os.path.join(HERE, '../../diyetisyen-animasyon-v2/kvkk.html')), encoding='utf-8').read()
toc = {L: re.search(r'<ol data-lang-block="%s">(.*?)</ol>' % L, K, re.S).group(1) for L in ('tr', 'en')}
prose = {L: re.search(r'<div class="prose" data-lang-block="%s" lang="%s">(.*?)\n            </div>' % (L, L), K, re.S).group(1) for L in ('tr', 'en')}
# Bu şablon yazı tipini Google Fonts'tan çekmiyor (Astro Fonts API ile siteden sunuluyor): ilgili cümle çıkarılır
prose['tr'] = prose['tr'].replace(' Yazı tipleri Google Fonts üzerinden yüklendiği için tarayıcınızın IP adresi Google’a iletilir.', '')
prose['en'] = prose['en'].replace(' Because fonts are loaded from Google Fonts, your browser’s IP address is shared with Google.', '')
assert 'Google Fonts' not in prose['tr'] + prose['en']
# Bilgi kutusu → AstroPaper'ın rehype-callouts (obsidian) "note" kutusu işaretlemesi
def callout(m):
    return ('<div class="callout" data-callout="note"><div class="callout-title"><div class="callout-title-text">%s</div></div>'
            '<div class="callout-content"><p>%s</p></div></div>' % (m.group(1), m.group(2)))
TOC_T = {'tr': ('Bu yazıda', 'İçindekileri aç'), 'en': ('In this article', 'Open table of contents')}
kv = []
for L in ('tr', 'en'):
    body = re.sub(r'<div class="callout"><p class="label">(.*?)</p><p>(.*?)</p></div>', callout, prose[L])
    kv.append('<div data-lang-block="%s" lang="%s">\n<h2 id="%s-toc">%s</h2>\n<details><summary>%s</summary><ul>%s</ul></details>\n%s\n</div>'
              % (L, L, L, TOC_T[L][0], TOC_T[L][1], toc[L], body.strip()))
with open(os.path.join(HERE, 'astro/src/data/kvkk.html'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(kv) + '\n')
print('kvkk.html yazıldı')
