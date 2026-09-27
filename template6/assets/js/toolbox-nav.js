/* template6 — Tailwind Toolbox "Landing Page" (MIT) index.html sonundaki iki betik.
   CSP satır içi betiğe izin vermediği için ayrı dosyada; sınıf değişimleri kaynaktakiyle birebir aynı:
   - Kaydırma > 10 px: #header bg-white + shadow, .toggleColour text-white → text-gray-800,
     #navAction bg-white/text-gray-800 → gradient/text-white, #nav-content bg-gray-100 → bg-white.
   - #nav-toggle açılır menüyü aç/kapat; menü ve düğme dışına tıklayınca kapat.
   Eklenenler: kaynakta id="header" olan öğe burada #site-header (özellik sözleşmesi); ilk yüklemede de bir kez
   çalışır (derin bağlantıyla sayfa ortasında açılınca menü düz görünsün); aria-expanded, Escape ile kapatma ve
   menüdeki bir bağlantıya dokununca kapanma (tek sayfalık site). Koyu tema karşılıkları tw.css'te. */
(function () {
  'use strict';
  var scrollpos = window.scrollY;
  var header = document.getElementById('site-header');
  var navcontent = document.getElementById('nav-content');
  var navaction = document.getElementById('navAction');
  var toToggle = document.querySelectorAll('.toggleColour');
  if (!header || !navcontent || !navaction) return;

  function onScroll() {
    /*Apply classes for slide in bar*/
    scrollpos = window.scrollY;

    if (scrollpos > 10) {
      header.classList.add('bg-white');
      navaction.classList.remove('bg-white');
      navaction.classList.add('gradient');
      navaction.classList.remove('text-gray-800');
      navaction.classList.add('text-white');
      //Use to switch toggleColour colours
      for (var i = 0; i < toToggle.length; i++) {
        toToggle[i].classList.add('text-gray-800');
        toToggle[i].classList.remove('text-white');
      }
      header.classList.add('shadow');
      navcontent.classList.remove('bg-gray-100');
      navcontent.classList.add('bg-white');
    } else {
      header.classList.remove('bg-white');
      navaction.classList.remove('gradient');
      navaction.classList.add('bg-white');
      navaction.classList.remove('text-white');
      navaction.classList.add('text-gray-800');
      //Use to switch toggleColour colours
      for (var j = 0; j < toToggle.length; j++) {
        toToggle[j].classList.add('text-white');
        toToggle[j].classList.remove('text-gray-800');
      }

      header.classList.remove('shadow');
      navcontent.classList.remove('bg-white');
      navcontent.classList.add('bg-gray-100');
    }
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /*Toggle dropdown list*/
  /*https://gist.github.com/slavapas/593e8e50cf4cc16ac972afcbad4f70c8*/
  var navMenuDiv = navcontent;
  var navMenu = document.getElementById('nav-toggle');
  var M = window.Mizan;

  function setOpen(open) {
    navMenuDiv.classList.toggle('hidden', !open);
    if (navMenu) {
      navMenu.setAttribute('aria-expanded', String(open));
      var key = open ? 'a11y.menuClose' : 'a11y.menuOpen';
      navMenu.setAttribute('data-i18n-attr', 'aria-label:' + key);
      if (M && M.t) navMenu.setAttribute('aria-label', M.t(key));
    }
  }
  function checkParent(t, elm) {
    while (t && t.parentNode) {
      if (t == elm) return true;
      t = t.parentNode;
    }
    return false;
  }
  document.addEventListener('click', function (e) {
    var target = e.target;
    //Nav Menu
    if (!checkParent(target, navMenuDiv)) {
      // click NOT on the menu
      if (checkParent(target, navMenu)) {
        // click on the link
        setOpen(navMenuDiv.classList.contains('hidden'));
      } else {
        // click both outside link and outside menu, hide menu
        setOpen(false);
      }
    } else if (target.closest && target.closest('a')) {
      setOpen(false);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !navMenuDiv.classList.contains('hidden') && navMenu && getComputedStyle(navMenu.parentNode).display !== 'none') {
      setOpen(false);
      navMenu.focus();
    }
  });
})();
