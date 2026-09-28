import type { UIStrings } from "../types";

// AstroPaper arayüz metinlerinin Türkçesi (en.ts ile aynı anahtarlar).
// Sayfada her metin data-i18n="ap.<grup>.<anahtar>" taşır; İngilizcesi
// public/assets/js/i18n.js → MIZAN_I18N_EN içinde en.ts'teki özgün metinlerdir.
export default {
  nav: {
    home: "Ana sayfa",
    posts: "Yazılar",
    tags: "Etiketler",
    about: "Hakkımızda",
    archives: "Arşiv",
    search: "Ara",
  },
  post: {
    publishedAt: "Yayın tarihi",
    updatedAt: "Güncellendi",
    sharePostIntro: "Bu yazıyı paylaşın:",
    sharePostOn: "Bu yazıyı {{platform}} ile paylaşın",
    sharePostViaEmail: "Bu yazıyı e-postayla paylaşın",
    tagLabel: "Etiketler",
    backToTop: "Başa dön",
    goBack: "Geri dön",
    editPage: "Sayfayı düzenle",
    previousPost: "Önceki yazı",
    nextPost: "Sonraki yazı",
  },
  pagination: {
    prev: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
  },
  home: {
    socialLinks: "Bize ulaşın",
    featured: "Öne çıkanlar",
    recentPosts: "Son yazılar",
    allPosts: "Tüm yazılar",
  },
  footer: {
    copyright: "Telif",
    allRightsReserved: "Tüm hakları saklıdır.",
  },
  pages: {
    tagTitle: "Etiket",
    tagDesc: "Bu etiketi taşıyan bütün yazılar:",

    tagsTitle: "Etiketler",
    tagsDesc: "Yazılarda kullanılan bütün etiketler.",

    postsTitle: "Yazılar",
    postsDesc: "Yayımladığımız bütün yazılar.",

    archivesTitle: "Arşiv",
    archivesDesc: "Bütün yazılar, yayın tarihine göre.",

    searchTitle: "Ara",
    searchDesc: "Yazılarda arayın ...",
  },
  a11y: {
    skipToContent: "İçeriğe geç",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    toggleTheme: "Temayı değiştir",
    searchPlaceholder: "Yazılarda ara...",
    noResults: "Sonuç bulunamadı",
    goToPreviousPage: "Önceki sayfaya git",
    goToNextPage: "Sonraki sayfaya git",
  },
  notFound: {
    title: "404 Sayfa bulunamadı",
    message: "Sayfa bulunamadı",
    goHome: "Ana sayfaya dön",
  },
} satisfies UIStrings;
