// Mizan: metin yardımcıları. Türkçe metinler diyetisyen-v2'den çıkarılan sözlükten gelir
// (scripts/tr-metinler.mjs → src/data/tr-metinler.json); İngilizceleri public/assets/js/i18n.js'te.
import OZGUN from '~/data/tr-metinler.json';

/** Bu şablonda eklenen anahtarlar (İngilizceleri i18n.js sonundaki "template8" bloğunda). */
export const YENI_TR: Record<string, string> = {
  'a11y.rss': 'RSS akışı',
  'footer.theme': 'Tema',
  'article.share': 'Paylaş:',
  'article.updated': 'Güncellendi',
  'incl.yesTitle': 'Dahil',
  'incl.noTitle': 'Dahil değil',
  '404.error': 'Hata',
  '404.title': 'Aradığınız sayfayı bulamadık.',
  '404.text': 'Bağlantı değişmiş ya da sayfa kaldırılmış olabilir. Ana sayfadan randevu, tarif ve yazılara ulaşabilirsiniz.',
  '404.back': 'Ana sayfaya dön',
};

const SOZLUK = { ...(OZGUN as Record<string, string>), ...YENI_TR };

/** Anahtarın Türkçe metni (yoksa derleme durur: eksik çeviri sessizce kalmasın). */
export const tr = (key: string): string => {
  const v = SOZLUK[key];
  if (v == null) throw new Error(`Mizan metni bulunamadı: ${key}`);
  return v;
};

export const escHtml = (v: string) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** `<span data-i18n="key">Türkçe</span>` — widget'ların HTML metin yuvaları için. */
export const t = (key: string, attrs = '') => `<span data-i18n="${key}"${attrs ? ` ${attrs}` : ''}>${escHtml(tr(key))}</span>`;

/** İki dilli metin (makale alanları): site.js görünmeyen dili gizler. */
export const trEn = (trText?: string, enText?: string) =>
  enText
    ? `<span data-lang-block="tr">${escHtml(trText ?? '')}</span><span data-lang-block="en">${escHtml(enText)}</span>`
    : escHtml(trText ?? '');

const TR_DATE = new Intl.DateTimeFormat('tr-TR', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const EN_DATE = new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });

/** AstroWind'in kısa tarih biçimi, iki dilde. */
export const dateTrEn = (d: Date) => trEn(TR_DATE.format(d), EN_DATE.format(d));
