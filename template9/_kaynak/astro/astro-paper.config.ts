import { defineAstroPaperConfig } from "./src/types/config";

// Mizan (template9) ayarları. AstroPaper'ın özgün dosyasındaki alanlar korunur,
// yalnızca değerler Mizan'a göre değişir (özgün: _kaynak/indirilen/astro-paper-orijinal).
export default defineAstroPaperConfig({
  site: {
    url: "https://sadikbesler.github.io/50-website/template9/",
    title: "Mizan Beslenme",
    description:
      "Kadıköy Moda’da uzman diyetisyenlerle kilo yönetimi, insülin direnci, sporcu, gebelik ve çocuk beslenmesi. Yüz yüze veya online görüşme için hemen randevu alın.",
    author: "Mizan Beslenme ve Diyet Kliniği",
    profile: "https://sadikbesler.github.io/50-website/template9/about/",
    ogImage: "og.png",
    lang: "tr",
    timezone: "Europe/Istanbul",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 6,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "whatsapp", url: "https://wa.me/905555555555", linkTitle: "WhatsApp" },
    { name: "mail", url: "mailto:randevu@mizanbeslenme.com", linkTitle: "E-posta" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=Bu%20yaz%C4%B1ya%20bak%C4%B1n&body=" },
  ],
});
