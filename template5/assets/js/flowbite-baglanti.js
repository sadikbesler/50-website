/* template5 — Landwind / Flowbite 1.4.7 köprüsü.
   Flowbite JS (assets/vendor/flowbite/flowbite.js, Landwind'in kullandığı 1.x) yalnızca iki iş için: üst menünün mobil
   collapse'ı (data-collapse-toggle) ve SSS akordeonu (data-accordion). Flowbite 1.4.7 örnekleri dışarı açmadığı için
   menü, tetikleyici düğmeye tıklanarak kapatılır. Sekmeler (tools.js / content.js), pencereler (<dialog>), takvim
   (booking.js) ve sohbet (chat.js) sitenin kendi kodunda kalır.
   - Mobil menüde bir bağlantıya dokununca menü kapanır.
   - Sohbet çekmecesinin arka planına tıklamak sohbeti kapatır. */
(function () {
  'use strict';
  var menu = document.getElementById('mobile-menu-2');
  var toggle = document.querySelector('[data-collapse-toggle="mobile-menu-2"]');
  var wide = window.matchMedia('(min-width: 1024px)');
  if (menu && toggle) {
    menu.addEventListener('click', function (e) {
      if (!e.target.closest('a') || wide.matches) return;
      if (toggle.getAttribute('aria-expanded') === 'true') toggle.click();
    });
  }

  var backdrop = document.querySelector('[data-chat-backdrop]');
  if (backdrop) {
    backdrop.addEventListener('click', function () {
      var x = document.querySelector('[data-chat-close]');
      if (x) x.click();
    });
  }
})();
