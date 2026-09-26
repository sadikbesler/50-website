/* Mizan Beslenme — two small celebrations (canvas-confetti): booking confirmed, daily water goal reached */
(function () {
  'use strict';

  var M = window.Mizan;
  if (!M || typeof window.confetti !== 'function') return;

  var root = document.documentElement;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var DONE_TITLE = '#randevu [data-step="done"] .bstep-title';
  var active = null;

  /* No confetti when the OS asks for less motion or the "Hareketi duraklat" button is on */
  function allowed() {
    if (reduceQuery.matches) return false;
    return !root.classList.contains('film-paused') && M.read('mizan-motion') !== 'off';
  }

  /* canvas-confetti only parses #rrggbb, so normalise the current theme's tokens through a 2D context */
  var probe = document.createElement('canvas').getContext('2d');
  function brandColors() {
    var css = getComputedStyle(root);
    return ['--olive', '--sage-2', '--terra', '--bmi-3'].map(function (name) {
      var value = css.getPropertyValue(name).trim();
      if (!probe) return value;
      probe.fillStyle = '#000';
      probe.fillStyle = value;
      return probe.fillStyle;
    });
  }

  function clamp(n) { return Math.min(1, Math.max(0, n)); }

  /* One decorative canvas per burst; it leaves the DOM when the animation ends.
     useWorker is a confetti.create() option (the default confetti() always tries a blob worker, which CSP blocks). */
  function burst(opts, r) {
    if (!active) {
      var canvas = document.createElement('canvas');
      canvas.className = 'mizan-confetti';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      active = { canvas: canvas, fire: window.confetti.create(canvas, { resize: true, useWorker: false }) };
    }
    var run = active;
    var box = run.canvas.getBoundingClientRect();
    opts.origin = {
      x: clamp((r.left + r.width / 2 - box.left) / box.width),
      y: clamp((r.top + r.height / 2 - box.top) / box.height)
    };
    opts.colors = brandColors();
    opts.disableForReducedMotion = true;
    /* Frames stop in a background tab; the guard still clears the canvas within 3 s */
    clearTimeout(run.guard);
    run.guard = setTimeout(run.fire.reset, 2900);
    run.fire(opts).then(function () {
      clearTimeout(run.guard);
      run.canvas.remove();
      if (active === run) active = null;
    });
  }

  /* The done step scrolls smoothly into view; fire once the heading stops moving */
  function whenSettled(sel, cb) {
    var last = null, still = 0, start = Date.now();
    (function check() {
      var el = document.querySelector(sel);
      if (!el) return;
      var top = el.getBoundingClientRect().top;
      still = last !== null && Math.abs(top - last) < 1 ? still + 1 : 0;
      last = top;
      if (still >= 3 || Date.now() - start > 1200) cb(el); else requestAnimationFrame(check);
    })();
  }

  document.addEventListener('mizan:booked', function () {
    if (!allowed()) return;
    whenSettled(DONE_TITLE, function (title) {
      /* The h3 spans the whole column; aim at the words themselves */
      var range = document.createRange();
      range.selectNodeContents(title);
      if (allowed()) burst({ particleCount: 90, spread: 70, startVelocity: 38, ticks: 150 }, range.getBoundingClientRect());
    });
  });

  /* First time today's glass goal is reached: a smaller burst from the glass, once per clinic day */
  document.addEventListener('mizan:water-goal', function (e) {
    var key = 'mizan-water-celebrated-' + M.time.now().key;
    if (M.read(key)) return;
    M.store(key, '1');
    if (allowed() && e.detail && e.detail.glass) {
      burst({ particleCount: 40, spread: 60, startVelocity: 24, ticks: 120, scalar: 0.8 }, e.detail.glass.getBoundingClientRect());
    }
  });
})();
