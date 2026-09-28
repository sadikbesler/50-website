# Mizan: diyetisyen-v2 ana sayfasındaki JS'e bağlı işaretlemeyi (0.3 sözleşmesi) Astro bileşenlerine dilimler.
# Özgün id / data-* / data-i18n nitelikleri aynen kalır; yalnızca şu dönüşümler yapılır:
#  - data-reveal nitelikleri silinir (0.6; AstroWind'in kendi "intersect" animasyonu kapsayıcıda)
#  - düğme sınıfları AstroWind'in btn-primary / btn-secondary yardımcılarına çevrilir
#  - göreli bağlantılar (kvkk.html) base önekli yola çevrilir
# Çalıştır: python3 scripts/mizan-parcalar.py
import re, pathlib
kok = pathlib.Path(__file__).resolve().parent.parent
src = (kok / '../ozgun/index.html').resolve().read_text()

def dilim(bas, son, dahil_son=True):
    i = src.index(bas)
    j = src.index(son, i)
    return src[i:j + (len(son) if dahil_son else 0)]

def donustur(h):
    h = re.sub(r'\s*<!--.*?-->', '', h, flags=re.S).strip()
    h = re.sub(r' data-reveal(="d\d")?', '', h)
    rep = [
        ('class="btn btn--primary btn--sm header-cta"', 'class="btn-primary py-2.5 px-5 md:px-5 text-sm"'),
        ('class="btn btn--primary btn--block"', 'class="btn-primary w-full"'),
        ('class="btn btn--primary btn--sm"', 'class="btn-primary py-2.5 px-5 md:px-5 text-sm"'),
        ('class="btn btn--ghost btn--sm"', 'class="btn-secondary py-2.5 px-5 md:px-5 text-sm"'),
        ('class="btn btn--primary"', 'class="btn-primary"'),
        ('class="btn btn--ghost"', 'class="btn-secondary"'),
        ('href="kvkk.html"', 'href={kvkk}'),
    ]
    for a, b in rep:
        h = h.replace(a, b)
    assert 'btn--' not in h, re.findall(r'class="[^"]*btn--[^"]*"', h)
    # girintiyi 2 boşluğa indir
    satirlar = h.split('\n')
    en_az = min((len(s) - len(s.lstrip()) for s in satirlar[1:] if s.strip()), default=0)
    return '\n'.join([satirlar[0]] + [s[en_az:] for s in satirlar[1:]])

bilesenler = {
    'Araclar': (dilim('<div class="tools-head">', '<!-- ================= Program', dahil_son=False), None),
    'Program': (dilim('<div class="program-top">', '<p class="disclaimer"'), None),
    'Tarifler': (dilim('<div class="filter-row"', '<div class="recipes" data-recipes></div>'), None),
    'Saat': (dilim('<div class="clock-card"', '</div>\n        </header>', dahil_son=False) + '</div>', None),
    'Randevu': (dilim('<div class="booking" data-booking>', '<!-- ================= Blog', dahil_son=False), None),
    'IletisimFormu': (dilim('<form class="form-card" id="contact-form"', '</form>'), None),
    'Pencereler': (dilim('<!-- ================= Recipe dialog', '<!-- ================= Floating actions', dahil_son=False), None),
    'Sohbet': (dilim('<aside class="floating-actions"', '<div class="toast"', dahil_son=False), None),
}
# Program dilimi disclaimer paragrafıyla birlikte bitsin
bilesenler['Program'] = (dilim('<div class="program-top">', '</p>\n      </div>\n    </section>', dahil_son=False) + '</p>', None)

for ad, (h, _) in bilesenler.items():
    h = re.sub(r'\s*<!--.*?-->\s*$', '', h.rstrip(), flags=re.S).rstrip()
    # section/wrap kapanışlarını at (dilimler bölüm içeriğinde biter)
    h = re.sub(r'\s*</div>\s*</section>$', '', h)
    govde = donustur(h)
    on = "---\n// Mizan: diyetisyen-v2 işaretlemesi (scripts/mizan-parcalar.py ile üretildi; elle düzenlemeyin).\n"
    if '{kvkk}' in govde:
        on += "import { getPermalink } from '~/utils/permalinks';\nconst kvkk = getPermalink('/kvkk');\n"
    on += "---\n\n"
    (kok / 'src/components/mizan' / f'{ad}.astro').write_text(on + govde + '\n')
    print(ad, len(govde))
