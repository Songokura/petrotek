(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var VER = (function () { var m = /[?&]v=([\w-]+)/.exec((d.currentScript && d.currentScript.src) || ''); return m ? m[1] : '1'; })();
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var ease = function (t) { return t * t * (3 - 2 * t); };

  /* ---------- WhatsApp ---------- */
  var WA_URL = 'https://wa.me/77016239947';
  var WA = {
    hero: 'Здравствуйте! Прошу рассчитать стоимость резервуара. Тип и объём:',
    rvs: 'Здравствуйте! Прошу рассчитать стоимость: вертикальный стальной резервуар РВС. Объём:',
    rgs: 'Здравствуйте! Прошу рассчитать стоимость: горизонтальный стальной резервуар РГС. Объём:',
    dr: 'Здравствуйте! Прошу рассчитать стоимость: дренажная ёмкость. Объём:',
    w: 'Здравствуйте! Прошу рассчитать стоимость: ёмкость для воды и технических жидкостей. Объём:',
    p: 'Здравствуйте! Прошу рассчитать стоимость ёмкости объёмом от 25 до 100 м³. Тип и объём:',
    n1: 'Здравствуйте! Прошу рассчитать стоимость комплектующих: люки. Размеры и количество:',
    n2: 'Здравствуйте! Прошу рассчитать стоимость комплектующих: патрубки. Размеры и количество:',
    n3: 'Здравствуйте! Прошу рассчитать стоимость комплектующих: днища. Размеры и количество:',
    form: 'Здравствуйте! Заявка на расчёт резервуара.',
    f1: 'Имя', f2: 'Телефон', f3: 'Тип и объём', f4: 'Комментарий'
  };
  var lang = 'ru';
  function waText(k) { var kk = window.SITE_KK; return (lang === 'kk' && kk && kk['wa.' + k]) || WA[k]; }
  function setWA() {
    $$('[data-wa]').forEach(function (a) { a.href = WA_URL + '?text=' + encodeURIComponent(waText(a.getAttribute('data-wa'))); });
  }

  /* ---------- языки ---------- */
  var els = $$('[data-i18n]'), elsA = $$('[data-i18n-aria]'), elsP = $$('[data-i18n-ph]'), RU = {}, RUA = {}, RUP = {};
  els.forEach(function (el) { var k = el.getAttribute('data-i18n'); if (!(k in RU)) RU[k] = el.innerHTML; });
  elsA.forEach(function (el) { RUA[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
  elsP.forEach(function (el) { RUP[el.getAttribute('data-i18n-ph')] = el.getAttribute('placeholder'); });
  var RU_TITLE = d.title, RU_DESC = null;
  function applyLang(l) {
    lang = l;
    var D = l === 'kk' ? (window.SITE_KK || {}) : null;
    els.forEach(function (el) { var k = el.getAttribute('data-i18n'); if (D && D[k] != null) { if (el.hasAttribute('data-i18n-html')) el.innerHTML = D[k]; else el.textContent = D[k]; } else el.innerHTML = RU[k]; });
    elsA.forEach(function (el) { var k = el.getAttribute('data-i18n-aria'); el.setAttribute('aria-label', (D && D[k]) || RUA[k]); });
    elsP.forEach(function (el) { var k = el.getAttribute('data-i18n-ph'); el.setAttribute('placeholder', (D && D[k]) || RUP[k]); });
    d.title = (D && D['meta.title']) || RU_TITLE;
    var md = $('meta[name="description"]');
    if (md) { if (RU_DESC == null) RU_DESC = md.content; md.content = (D && D['meta.desc']) || RU_DESC; }
    root.lang = l;
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    setWA();
    window.dispatchEvent(new Event('resize'));
  }
  function setLang(l, save) {
    if (save) { try { localStorage.setItem('lang', l); } catch (e) {} }
    if (l === 'kk' && !window.SITE_KK) {
      var s = d.createElement('script');
      /* у каждой страницы свой словарь: data-kk на <html> (privacy.html -> privacy-kk), по умолчанию kk */
      s.src = 'assets/lang/' + (root.getAttribute('data-kk') || 'kk') + '.js?v=' + VER;
      s.onload = function () { applyLang('kk'); };
      d.head.appendChild(s);
    } else applyLang(l);
  }
  $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); }); });
  (function () {
    var q = /[?&]lang=(ru|kk)/.exec(location.search), st = null;
    try { st = localStorage.getItem('lang'); } catch (e) {}
    var l = q ? q[1] : (st === 'kk' ? 'kk' : 'ru');
    if (l === 'kk') setLang('kk', false); else setWA();
  })();

  /* ---------- плавная прокрутка ---------- */
  var lenis = null, ticks = [];
  if (window.Lenis && !reduce) lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 });
  (function raf(t) {
    if (lenis) lenis.raf(t);
    for (var i = 0; i < ticks.length; i++) ticks[i](t);
    requestAnimationFrame(raf);
  })(performance.now());
  function scrollToY(y) { if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' }); }
  var hdr = $('#hdr');
  d.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id.length < 2) return;
    var t = $(id);
    if (!t) return;
    e.preventDefault();
    closeMenu();
    var y = t.getBoundingClientRect().top + window.pageYOffset - (t.classList.contains('hero') || t.classList.contains('sog') ? 0 : (hdr ? hdr.offsetHeight - 1 : 0));
    scrollToY(Math.max(0, y));
    history.replaceState(null, '', id);
  });

  /* ---------- шапка и меню ---------- */
  function onScroll() { if (hdr) hdr.classList.toggle('scrolled', window.pageYOffset > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = $('#burger');
  function closeMenu() { if (!root.classList.contains('menu-open')) return; root.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); if (lenis) lenis.start(); d.body.style.overflow = ''; }
  if (burger) burger.addEventListener('click', function () {
    var o = !root.classList.contains('menu-open');
    if (!o) return closeMenu();
    root.classList.add('menu-open'); burger.setAttribute('aria-expanded', 'true'); if (lenis) lenis.stop(); d.body.style.overflow = 'hidden';
  });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  $$('.nav-btns a').forEach(function (a) { a.addEventListener('click', closeMenu); });

  /* ---------- герой: камера вдоль типоряда ---------- */
  (function () {
    var sec = $('#top'), scene = $('#scene'), svg = $('#world'), wg = $('#wg');
    if (!svg) return;
    var row = JSON.parse(svg.getAttribute('data-row')), U = 10;
    var ks = $$('.k>g', svg), tks = $$('.tk', svg), pat = d.getElementById('pHatch');
    var copy = $('#hero-copy'), top = $('#hero-top'), sub = $('#hero-sub'), btns = $('.hero-btns', copy), hudV = $('#hud-v'), scale = $('#scale'), mark = $('#scale-mark');
    var vw = 0, vh = 0, mob = false, gy = 0, K = [], p = 0, lastW = -1, scaleW = 0;
    var L0 = Math.log(50), L1 = Math.log(20000), LG = Math.log(20000);
    var A = 0.05, B = 0.5, C = 0.58, E = 0.94;
    function key(a, b, h) {
      var s = vw / ((b - a) * U);
      if (h) s = Math.min(s, (gy - 84) / (h * U));
      return { s: s, cx: (a + b) / 2 };
    }
    function measure() {
      var r = scene.getBoundingClientRect();
      vw = r.width; vh = r.height; mob = window.innerWidth <= 900;
      svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
      svg.setAttribute('preserveAspectRatio', 'none');
      if (mob) {
        gy = vh - 40;
        var s = Math.min(vw / (24.8 * U), (gy - 4) / (9.3 * U));
        K = [{ s: s, cx: 38.5 }];
      } else {
        var a = -2.6, b = 51.6, s0 = vw / ((b - a) * U);
        var bb = btns.getBoundingClientRect().bottom - scene.getBoundingClientRect().top - (parseFloat(sub.style.transform.replace(/[^\d.-]/g, '')) || 0);
        var cap = (vh - bb - 12) / ((4.3 + 6.1) * U);
        var igb = sub.getBoundingClientRect().bottom - scene.getBoundingClientRect().top - (parseFloat(sub.style.transform.replace(/[^\d.-]/g, '')) || 0);
        cap = Math.min(cap, (vh - igb - 44) / ((2.1 + 6.1) * U));
        if (cap < s0) s0 = Math.max(cap, s0 * 0.64);
        gy = vh - 6.1 * U * s0;
        K = [{ s: s0, cx: (a + b) / 2 }, key(-9, 157), key(104, 158, 25.6)];
      }
      scaleW = scale.offsetWidth;
      render();
    }
    function cam(q) {
      if (K.length === 1) return K[0];
      var i, t;
      if (q <= A) return K[0];
      if (q < B) { i = 0; t = (q - A) / (B - A); }
      else if (q <= C) return K[1];
      else if (q < E) { i = 1; t = (q - C) / (E - C); }
      else return K[2];
      t = ease(t);
      var k0 = K[i], k1 = K[i + 1];
      return { s: Math.exp(Math.log(k0.s) + (Math.log(k1.s) - Math.log(k0.s)) * t), cx: k0.cx + (k1.cx - k0.cx) * (i === 0 ? t : ease(t)) };
    }
    function fmt(v) {
      v = v < 100 ? Math.round(v) : v < 1000 ? Math.round(v / 10) * 10 : v < 10000 ? Math.round(v / 100) * 100 : Math.round(v / 500) * 500;
      return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    function render() {
      var c = cam(p), s = c.s, inv = 1 / s;
      var tx = vw / 2 - c.cx * U * s;
      wg.setAttribute('transform', 'translate(' + tx.toFixed(2) + ' ' + gy.toFixed(2) + ') scale(' + s.toFixed(4) + ')');
      var tr = 'scale(' + inv.toFixed(4) + ')';
      for (var i = 0; i < ks.length; i++) ks[i].setAttribute('transform', tr);
      if (pat) pat.setAttribute('patternTransform', tr);
      for (i = 0; i < tks.length; i++) tks[i].classList.toggle('sm', (row[i].x1 - row[i].x0) * U * s < 58);
      if (mob) return;
      var pm = clamp((p - A) / (E - A), 0, 1), v = Math.exp(L0 + (L1 - L0) * pm);
      hudV.textContent = fmt(v);
      mark.style.transform = 'translateX(' + (Math.log(v) / LG * scaleW).toFixed(1) + 'px)';
      var f = clamp((p - 0.02) / 0.14, 0, 1), f2 = clamp((p - 0.6) / 0.12, 0, 1);
      sub.style.opacity = (1 - f).toFixed(3);
      sub.style.transform = 'translateY(' + (-30 * f).toFixed(1) + 'px)';
      sub.style.pointerEvents = f > 0.6 ? 'none' : '';
      sub.style.visibility = f >= 1 ? 'hidden' : '';
      top.style.opacity = (1 - f2).toFixed(3);
      top.style.transform = 'translateY(' + (-46 * f2).toFixed(1) + 'px)';
      top.style.visibility = f2 >= 1 ? 'hidden' : '';
    }
    measure();
    window.addEventListener('resize', function () { if (window.innerWidth !== lastW || !mob) { lastW = window.innerWidth; measure(); } });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(measure);
    function prog() {
      if (mob) { p = 0; return; }
      var r = sec.getBoundingClientRect(), range = r.height - window.innerHeight;
      var np = range > 0 ? clamp(-r.top / range, 0, 1) : 0;
      if (np !== p) { p = np; render(); }
    }
    ticks.push(prog);
    $$('.scale-stop').forEach(function (b) {
      b.addEventListener('click', function () {
        if (mob) return;
        var v = +b.getAttribute('data-v');
        var pm = clamp((Math.log(Math.max(v, 50)) - L0) / (L1 - L0), 0, 1);
        var q = v <= 100 ? 0 : A + pm * (E - A) + (v >= 20000 ? 0.03 : 0);
        scrollToY(sec.offsetTop + q * (sec.offsetHeight - window.innerHeight));
      });
    });
    /* перекрестие */
    var cross = $('#cross'), pin = $('.hero-pin');
    if (cross && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      pin.addEventListener('pointermove', function (e) {
        var r = pin.getBoundingClientRect();
        cross.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        cross.style.setProperty('--my', (e.clientY - r.top) + 'px');
        cross.classList.toggle('on', !(e.target.closest && e.target.closest('a,button,.hero-copy')));
      });
      pin.addEventListener('pointerleave', function () { cross.classList.remove('on'); });
    }
    /* пауза фонового вращения и бегущей ленты вне экрана */
    if ('IntersectionObserver' in window) {
      $$('.plan, .tape-tr').forEach(function (pl) {
        new IntersectionObserver(function (en) { pl.style.animationPlayState = en[0].isIntersecting ? 'running' : 'paused'; }).observe(pl.parentNode);
      });
    }
  })();

  /* ---------- раскрытие блоков ---------- */
  (function () {
    var rv = $$('.rv');
    if (!('IntersectionObserver' in window)) { rv.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        var el = x.target, sib = $$('.rv', el.parentNode).indexOf(el);
        el.style.transitionDelay = (Math.max(0, sib) * 0.08) + 's';
        el.classList.add('in');
        io.unobserve(el);
        if (el.classList.contains('sheet')) days();
        setTimeout(function () { el.style.transitionDelay = ''; }, 1400);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(function (e) { io.observe(e); });
    function days() {
      var n = $('#days-n');
      if (!n || reduce) return;
      var t0 = performance.now();
      (function step(t) {
        var k = clamp((t - t0) / 1600, 0, 1);
        n.textContent = Math.round(45 * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }
  })();

  /* ---------- согласование: три шага ---------- */
  (function () {
    var sog = $('#soglasovanie');
    if (!sog) return;
    function upd() {
      if (window.innerWidth <= 900) return;
      var r = sog.getBoundingClientRect(), range = r.height - window.innerHeight;
      var q = range > 0 ? clamp(-r.top / range, 0, 1) : 0;
      var s = q < 0.3 ? 1 : q < 0.64 ? 2 : 3;
      if (sog.getAttribute('data-step') !== String(s)) sog.setAttribute('data-step', s);
    }
    window.addEventListener('scroll', upd, { passive: true }); upd();
    $$('.sog-list li', sog).forEach(function (li) {
      li.addEventListener('mouseenter', function () { if (window.innerWidth > 900) sog.setAttribute('data-step', li.getAttribute('data-s')); });
    });
  })();

  /* ---------- этапы: вальцовка листа ---------- */
  (function () {
    var et = $('#et'), roll = $('#roll');
    if (!et || !roll) return;
    var fig = $('.et-fig', et), lis = $$('.et-list li', et), last = '';
    function fit() { roll.style.setProperty('--rs', Math.min(1.3, fig.clientWidth / 660, fig.clientHeight / 480).toFixed(3)); }
    function upd() {
      var vh = window.innerHeight, mid = vh * (window.innerWidth <= 900 ? 0.84 : 0.56), step = 1, i;
      for (i = 0; i < lis.length; i++) if (lis[i].getBoundingClientRect().top < mid) step = i + 1;
      var r4 = lis[3].getBoundingClientRect();
      var pr = clamp((mid - r4.top) / (r4.height * 0.85), 0, 1);
      if (step < 4) pr = 0;
      if (step > 4) pr = 1;
      var key = step + '|' + pr.toFixed(3);
      if (key === last) return;
      last = key;
      et.setAttribute('data-step', step);
      roll.style.setProperty('--p', ease(pr).toFixed(4));
      roll.classList.toggle('marks', step >= 2);
      roll.classList.toggle('stamp', step >= 3);
      roll.classList.toggle('rolling', pr > 0.03);
      roll.classList.toggle('weld', pr > 0.97 && step === 4);
      roll.classList.toggle('done', step >= 5);
    }
    fit(); upd();
    window.addEventListener('resize', function () { fit(); last = ''; upd(); });
    window.addEventListener('scroll', upd, { passive: true });
  })();

  /* ---------- форма ---------- */
  (function () {
    var form = $('#form');
    if (!form) return;
    var ph = $('#f-phone'), err = $('#f-err'), ok = $('#form-ok');
    ph.addEventListener('input', function () { ph.classList.remove('bad'); err.hidden = true; });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var digits = ph.value.replace(/\D/g, '');
      if (digits.length < 10) { ph.classList.add('bad'); err.hidden = false; ph.focus(); return; }
      var v = function (id) { return ($(id).value || '').trim() || '-'; };
      var text = waText('form') + '\n' + waText('f1') + ': ' + v('#f-name') + '\n' + waText('f2') + ': ' + ph.value.trim() + '\n' + waText('f3') + ': ' + v('#f-type') + '\n' + waText('f4') + ': ' + v('#f-msg');
      ok.hidden = false;
      window.open(WA_URL + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  })();

})();
