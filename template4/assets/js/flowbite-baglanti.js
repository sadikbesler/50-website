/* template4 — Flowbite köprüsü.
   Flowbite JS (assets/vendor/flowbite/flowbite.min.js) yalnızca iki şey için: üst menünün mobil collapse'ı ve mevsim notları carousel'i.
   Sekmeler (tools.js / content.js), pencereler (<dialog>), takvim (booking.js) ve sohbet (chat.js) sitenin kendi kodunda kalır.
   - Dil değiştikten sonra initFlowbite() yeniden çağrılır. Flowbite'ın initCarousels'ı her çağrıda önceki/sonraki ve
     gösterge düğmelerine yeni dinleyici ekler (eskileri kaldırmaz); çift kaymayı önlemek için bu düğmeler önce klonlanır
     ve etkin slayt korunur.
   - Mobil menüde bir bağlantıya dokununca menü kapanır.
   - Sohbet çekmecesinin arka planına tıklamak sohbeti kapatır. */
(function () {
  'use strict';
  var M = window.Mizan;

  function reinit() {
    if (typeof window.initFlowbite !== 'function') return;
    document.querySelectorAll('[data-carousel]').forEach(function (car) {
      var inst = window.FlowbiteInstances && window.FlowbiteInstances.getInstance('Carousel', car.id);
      var active = inst && inst.getActiveItem() ? inst.getActiveItem().position : 0;
      car.querySelectorAll('[data-carousel-item]').forEach(function (it, i) {
        it.setAttribute('data-carousel-item', i === active ? 'active' : '');
      });
      car.querySelectorAll('[data-carousel-prev],[data-carousel-next],[data-carousel-slide-to]').forEach(function (b) {
        b.replaceWith(b.cloneNode(true));
      });
    });
    window.initFlowbite();
  }
  if (M && M.onLang) M.onLang(reinit);

  var menu = document.getElementById('mobile-menu-2');
  var wide = window.matchMedia('(min-width: 1280px)');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (!e.target.closest('a') || wide.matches) return;
      var c = window.FlowbiteInstances && window.FlowbiteInstances.getInstance('Collapse', 'mobile-menu-2');
      if (c && c._visible) c.collapse();
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
