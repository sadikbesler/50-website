import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

// Mizan: görünen her metin data-i18n anahtarıyla gelir (Türkçesi HTML'de, İngilizcesi i18n.js'te).
const t = (key: string, tr: string) => `<span data-i18n="${key}">${tr}</span>`;

// Ana sayfada bölüm bağlantıları salt çapa (#hizmetler); alt sayfalarda ana sayfaya gider.
const section = (isHome: boolean, id: string) => (isHome ? `#${id}` : getPermalink(`/#${id}`));

const PHONE = '+905555555555';
const WHATSAPP = 'https://wa.me/905555555555';
const EMAIL = 'randevu@mizanbeslenme.com';
const INSTAGRAM = 'https://instagram.com/mizanbeslenme';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=Moda+Caddesi+Kad%C4%B1k%C3%B6y+%C4%B0stanbul';
const external = { target: '_blank', rel: 'noopener noreferrer' };

export const headerData = (isHome = false) => ({
  links: [
    { text: t('nav.services', 'Hizmetler'), href: section(isHome, 'hizmetler') },
    { text: t('nav.team', 'Uzmanlar'), href: section(isHome, 'uzmanlar') },
    { text: t('nav.tools', 'Araçlar'), href: section(isHome, 'araclar') },
    { text: t('nav.recipes', 'Tarifler'), href: section(isHome, 'tarifler') },
    { text: t('nav.pricing', 'Ücretler'), href: section(isHome, 'ucretler') },
    { text: t('nav.blog', 'Blog'), href: getBlogPermalink() },
    { text: t('nav.contact', 'İletişim'), href: section(isHome, 'iletisim') },
  ],
  actions: [{ text: 'Randevu al', href: section(isHome, 'randevu'), 'data-i18n': 'nav.book' }],
});

export const footerData = (isHome = false) => ({
  links: [
    {
      title: t('footer.clinic', 'Klinik'),
      links: [
        { text: t('nav.services', 'Hizmetler'), href: section(isHome, 'hizmetler') },
        { text: t('nav.team', 'Uzmanlar'), href: section(isHome, 'uzmanlar') },
        { text: t('nav.pricing', 'Ücretler'), href: section(isHome, 'ucretler') },
        { text: t('nav.book', 'Randevu al'), href: section(isHome, 'randevu') },
      ],
    },
    {
      title: t('footer.resources', 'Kaynaklar'),
      links: [
        { text: t('footer.bmi', 'VKİ ve kalori hesaplama'), href: section(isHome, 'araclar') },
        { text: t('nav.program', 'Örnek program'), href: section(isHome, 'program') },
        { text: t('nav.recipes', 'Tarifler'), href: section(isHome, 'tarifler') },
        { text: t('nav.blog', 'Blog'), href: getBlogPermalink() },
        { text: t('nav.faq', 'SSS'), href: section(isHome, 'sss') },
      ],
    },
    {
      title: t('nav.contact', 'İletişim'),
      links: [
        {
          text: '<span data-address>Moda Cad. No: 48, Kat 3, Kadıköy / İstanbul</span>',
          href: MAPS,
          attrs: { 'data-maps': true, ...external },
        },
        { text: '0555 555 55 55', href: `tel:${PHONE}`, attrs: { 'data-tel': true, 'data-phone-text': true } },
        { text: EMAIL, href: `mailto:${EMAIL}`, attrs: { 'data-mail': true } },
        { text: 'Instagram', href: INSTAGRAM, attrs: external },
      ],
    },
  ],
  secondaryLinks: [{ text: t('footer.kvkk', 'KVKK aydınlatma metni'), href: getPermalink('/kvkk') }],
  socialLinks: [
    { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: INSTAGRAM, attrs: external },
    { ariaLabel: 'WhatsApp', icon: 'tabler:brand-whatsapp', href: WHATSAPP, attrs: { 'data-wa': true, ...external } },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span class="block mb-2" data-i18n="footer.disclaimer">Bu sitedeki içerikler genel bilgilendirme amaçlıdır; tanı ve tedavinin yerine geçmez. Sağlık sorunlarınız için hekiminize danışın, acil durumlarda 112’yi arayın.</span>
    © <span data-year>2026</span> Mizan Beslenme · <span lang="en">Designed by</span> <a class="text-blue-600 underline dark:text-muted" href="https://www.asteriasoft.co/" target="_blank" rel="noopener">Asteria Soft</a> · <span data-i18n="footer.theme">Tema</span>: <a class="text-blue-600 underline dark:text-muted" href="https://github.com/arthelokyo/astrowind" target="_blank" rel="noopener noreferrer">AstroWind</a> (MIT)
  `,
});
