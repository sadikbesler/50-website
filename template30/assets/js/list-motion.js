/* ==========================================================================
   Mizan Beslenme — liste hareketleri (list-motion.js)

   Sayfa açıkken değişen listelere AutoAnimate bağlanır (formkit, MIT,
   assets/vendor/auto-animate): eklenen öğe belirir, çıkan söner, kalanlar
   yeni yerine kayar.
     [data-slots] + içindeki .slot-list  randevu saatleri
     [data-meals], [data-days]           örnek program
     #chat-log                           sohbet mesajları, hızlı yanıtlar
     [data-result]                       araç sonuçları
   Listeler Mizan.patchList() ile yerinde güncellenir (site.js); böylece
   yalnızca gerçekten gelen, giden ya da yeri değişen öğe hareket eder.

   Burada olmayanlar:
   - Tarif ızgarası [data-recipes]: kartları GSAP tileScroll kaydırmaya
     bağlı sürekli oynatıyor. AutoAnimate'in önbelleğe aldığı konum bu
     yüzden bayat kalıyor ve kartlar kayma başında/sonunda sıçrıyordu
     (ölçüm: DURUM.md). Filtre geçişi motion.js'teki GSAP girişinde kaldı.
   - Randevu adımları (.bstep): hidden niteliğiyle açılıp kapanıyor;
     AutoAnimate yalnızca çocuk ekleme/çıkarmayı izliyor (MutationObserver
     childList). Adım geçişini motion.js canlandırıyor.

   Hareket azaltma: AutoAnimate tercihi bağlandığı anda okur ve açıksa
   hiçbir şey kurmaz. Sayfa açıkken tercih değişirse burada kapatılıp
   açılır (baştan "azalt" ile açılan sayfada yenileme gerekir).
   ========================================================================== */
(function () {
  'use strict';
  if (!window.autoAnimate) return;

  var OPTS = { duration: 250, easing: 'ease-out' };
  var TARGETS = '[data-slots], [data-meals], [data-days], #chat-log, [data-result]';
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var live = [];
  var nested = new WeakMap();

  /* Hareket azaltma açıkken AutoAnimate gözlemci kurmaz; o denetleyiciler
     sonradan açılamayacağı için listeye alınmaz. */
  function attach(el) {
    var ctl = window.autoAnimate(el, OPTS);
    /* data-aa: sohbetteki CSS giriş animasyonu bununla susturuluyor */
    el.toggleAttribute('data-aa', ctl.isEnabled());
    if (ctl.isEnabled()) live.push([el, ctl]);
    return ctl;
  }
  var log = document.getElementById('chat-log');
  var logCtl = null;
  Array.prototype.forEach.call(document.querySelectorAll(TARGETS), function (el) {
    var ctl = attach(el);
    if (el === log) logCtl = ctl;
  });

  /* Sohbet paneli sabit konumlu (position: fixed). AutoAnimate konumları
     sayfanın kaydırma payını ekleyerek saklıyor; panel yerinden kımıldamadığı
     hâlde sayfa kayınca saklı konum eskiyor ve sonraki mesajda eski mesajlar
     kaydırma mesafesi kadar uzaktan kayarak geliyordu (ölçüm: 1368 px).
     Günlüğün kendi kaydırması 0'dan çıkınca da ölçü tabanı değişiyor.
     Bu yüzden konumlar sessizce tazelenir (panel açıkken her kaydırma
     karesinde, kaydırma durunca ve panel geçişi bitince): denetleyici bir
     anlığına kapatılıp günlüğe boş bir öğe eklenip çıkarılır; AutoAnimate
     kapalıyken gördüğü değişimde hiçbir şey oynatmaz, yalnızca konumları
     yeniden ölçer. Kalan tek durum: yanıt hızlı bir sayfa kaydırmasının tam
     ortasına düşerse AutoAnimate'in kendi adjustScroll'u 1–2 karelik
     (30–60 px) bir kayma bırakabiliyor (DURUM.md). */
  if (log && logCtl && logCtl.isEnabled()) {
    var timer = null;
    var queued = false;
    var busy = function () {
      return log.getAnimations({ subtree: true }).some(function (a) {
        return !(a instanceof CSSAnimation) && !(a instanceof CSSTransition) && a.playState !== 'finished' && a.playState !== 'idle';
      });
    };
    /* Oynayan bir animasyon varken dokunulmaz (disable onu keserdi);
       AutoAnimate o animasyon bitince konumları kendisi günceller. */
    var remeasure = function () {
      if (!logCtl.isEnabled() || busy()) return false;
      logCtl.disable();
      var probe = document.createElement('span');
      probe.hidden = true;
      log.appendChild(probe);
      log.removeChild(probe);
      /* AutoAnimate'in gözlemcisi bu değişimi bu mikro görevden önce işler */
      Promise.resolve().then(function () { logCtl.enable(); });
      return true;
    };
    var settle = function () { if (!remeasure()) timer = setTimeout(settle, 150); };
    /* Panel açıkken her kaydırma karesinde (yanıt kaydırma sürerken de
       gelebilir), her durumda da kaydırma durduktan sonra bir kez. */
    var onScroll = function () {
      clearTimeout(timer);
      timer = setTimeout(settle, 150);
      if (queued || !document.body.classList.contains('chat-open')) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; remeasure(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    log.addEventListener('scroll', onScroll, { passive: true });
    /* Panel açılıp kapanırken 0,4 sn kayıp ölçekleniyor; bitince de ölç */
    var panel = document.getElementById('chat');
    if (panel) {
      panel.addEventListener('transitionend', function (e) {
        if (e.target === panel && e.propertyName === 'transform') { clearTimeout(timer); settle(); }
      });
    }
  }

  /* Saat düğmeleri grupların içindeki .slot-list'te duruyor; grup
     eklendikçe kendi listesi de bağlanır, grup gidince bırakılır.
     AutoAnimate'in çıkış kopyaları (__aa_del) atlanır. */
  var slots = document.querySelector('[data-slots]');
  if (slots) {
    var lists = function (node) {
      if (node.nodeType !== 1) return [];
      var found = Array.prototype.slice.call(node.querySelectorAll('.slot-list'));
      if (node.matches('.slot-list')) found.push(node);
      return found;
    };
    lists(slots).forEach(function (l) { nested.set(l, attach(l)); });
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if ('__aa_del' in n) return;
          lists(n).forEach(function (l) { if (!nested.has(l)) nested.set(l, attach(l)); });
        });
        Array.prototype.forEach.call(r.removedNodes, function (n) {
          if (n.isConnected) return;
          lists(n).forEach(function (l) {
            var ctl = nested.get(l);
            if (!ctl) return;
            ctl.destroy();
            nested.delete(l);
            live = live.filter(function (t) { return t[1] !== ctl; });
          });
        });
      });
    }).observe(slots, { childList: true, subtree: true });
  }

  if (mq.addEventListener) {
    mq.addEventListener('change', function () {
      live.forEach(function (t) {
        if (mq.matches) t[1].disable(); else t[1].enable();
        t[0].toggleAttribute('data-aa', t[1].isEnabled());
      });
    });
  }
})();
