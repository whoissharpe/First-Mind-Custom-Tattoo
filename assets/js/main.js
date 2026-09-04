/* FIRSTMIND Custom Tattoo — site behaviour
   ------------------------------------------------------------------
   Motion is transform/opacity only, and every effect is switched off
   when the visitor asks for reduced motion.
   ------------------------------------------------------------------ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────
     GALLERY SOURCE OF TRUTH
     To use real shop photos: drop them in assets/img/ and edit this
     list. `span` makes a tile twice as wide on desktop.
     ───────────────────────────────────────────────────────────── */
  var PHOTOS = [
    { src: 'assets/img/work-rose.png',        w: 1000, h: 1250, span: false, caption: 'Neo-traditional',      alt: 'A neo-traditional rose tattoo on a forearm with bold black linework and deep red shading.' },
    { src: 'assets/img/work-blackgrey.png',   w: 1000, h: 1250, span: false, caption: 'Black & grey',         alt: 'A black-and-grey tattoo of a mountain range and compass on an upper arm.' },
    { src: 'assets/img/work-station.png',     w: 1000, h: 1000, span: false, caption: 'In the studio',        alt: 'An overhead view of a tattoo workstation with a machine, ink caps and a stencil.' },
    { src: 'assets/img/work-fineline.png',    w: 1000, h: 1250, span: false, caption: 'Fine line',            alt: 'A fine-line botanical tattoo of wildflower stems on a shoulder.' },
    { src: 'assets/img/work-traditional.png', w: 1000, h: 1000, span: false, caption: 'American traditional', alt: 'An American traditional swallow and anchor tattoo with heavy outlines and solid red fill.' },
    { src: 'assets/img/work-moth.png',        w: 1000, h: 1000, span: false, caption: 'Colour work',          alt: 'A colourful neo-traditional moth tattoo on a forearm in teal, mustard and burnt orange.' },
    { src: 'assets/img/work-flash.png',       w: 1000, h: 1250, span: false, caption: 'Flash',                alt: 'Hand-drawn tattoo flash sheets pinned to the studio wall.' },
    { src: 'assets/img/studio-artist.png',    w: 1200, h: 800,  span: true,  caption: 'At the chair',         alt: 'A tattoo artist at work, machine in hand, under warm lamp light.' }
  ];

  /* Any photo that fails to load keeps its reserved box rather than
     collapsing to raw alt text (which can blow out a grid track). The
     transparent source replaces the browser's broken-image icon. */
  var BLANK = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

  function markMissing(e) {
    var img = e.target || e;
    img.classList.add('is-missing');
    if (img.src !== BLANK) img.src = BLANK;
  }

  document.querySelectorAll('img[width][height]').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) markMissing(img);
    img.addEventListener('error', markMissing);
  });

  /* ───────────────────────── Build the gallery ───────────────────────── */
  var gallery = document.getElementById('gallery');

  if (gallery) {
    PHOTOS.forEach(function (photo, i) {
      var li = document.createElement('li');
      if (photo.span) li.className = 'span-2';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'shot';
      // Uniform tiles keep the grid rows even; object-fit crops to suit.
      btn.style.aspectRatio = photo.span ? '8 / 5' : '4 / 5';
      btn.setAttribute('aria-label', 'View larger: ' + photo.caption);
      btn.dataset.index = String(i);

      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt;
      img.width = photo.w;
      img.height = photo.h;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', markMissing);

      var cap = document.createElement('span');
      cap.className = 'shot-cap';
      cap.textContent = photo.caption;

      btn.appendChild(img);
      btn.appendChild(cap);
      li.appendChild(btn);
      gallery.appendChild(li);
    });
  }

  /* ───────────────── Hero photo: only apply once it loads ───────────────── */
  var heroImg = document.getElementById('heroImg');
  if (heroImg) {
    var probe = new Image();
    probe.onload = function () { heroImg.classList.add('has-photo'); };
    probe.src = 'assets/img/hero-wide.png';
  }

  var ctaMedia = document.querySelector('.cta-media');
  if (ctaMedia) {
    var ctaProbe = new Image();
    ctaProbe.onload = function () { ctaMedia.classList.add('has-photo'); };
    ctaProbe.src = 'assets/img/work-station.png';
  }

  /* ───────────────────────── Scroll reveal ───────────────────────── */
  var revealTargets = document.querySelectorAll(
    '.reveal, .hero-title .line, .section-head, .split-media, .split-body, .styles li, .steps li'
  );

  function markRevealed(el) {
    el.classList.add('is-revealed');
    var delay = el.querySelector('[data-reveal-delay]');
    if (delay) el.style.setProperty('--d', delay.dataset.revealDelay);
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-revealed'); });
  } else {
    revealTargets.forEach(function (el) {
      var d = el.querySelector('[data-reveal-delay]') || el;
      if (d.dataset && d.dataset.revealDelay) el.style.setProperty('--d', d.dataset.revealDelay);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) { io.observe(el); });

    // Hero is above the fold — reveal on the next frame rather than on scroll.
    requestAnimationFrame(function () {
      document.querySelectorAll('.hero .reveal, .hero-title .line')
        .forEach(function (el) { el.classList.add('is-revealed'); });
    });
  }

  /* ───────────────────────── Sticky header ───────────────────────── */
  var header = document.getElementById('siteHeader');
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ───────────────────────── Mobile nav ───────────────────────── */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function setNav(open) {
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) nav.querySelector('a').focus();
  }

  navToggle.addEventListener('click', function () {
    setNav(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setNav(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false);
      navToggle.focus();
    }
  });

  // Leaving the mobile breakpoint with the menu open would otherwise
  // leave the body scroll-locked.
  window.matchMedia('(min-width: 781px)').addEventListener('change', function (e) {
    if (e.matches && nav.classList.contains('is-open')) setNav(false);
  });

  /* ───────────────── Hero parallax (pointer only) ───────────────── */
  if (!reduceMotion && heroImg && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var px = 0, py = 0, raf = null;

    window.addEventListener('mousemove', function (e) {
      px = (e.clientX / window.innerWidth - 0.5) * 14;
      py = (e.clientY / window.innerHeight - 0.5) * 14;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        heroImg.style.setProperty('translate', px.toFixed(2) + 'px ' + py.toFixed(2) + 'px');
        raf = null;
      });
    }, { passive: true });
  }

  /* ───────────────────────── Lightbox ───────────────────────── */
  var lb      = document.getElementById('lightbox');
  var lbImg   = document.getElementById('lbImg');
  var lbCap   = document.getElementById('lbCap');
  var lbClose = document.getElementById('lbClose');
  var lbPrev  = document.getElementById('lbPrev');
  var lbNext  = document.getElementById('lbNext');
  var current = 0;
  var lastFocused = null;

  function show(i) {
    current = (i + PHOTOS.length) % PHOTOS.length;
    var p = PHOTOS[current];
    lbImg.src = p.src;
    lbImg.alt = p.alt;
    lbCap.textContent = p.caption + ' · ' + (current + 1) + ' of ' + PHOTOS.length;
  }

  function openLb(i) {
    lastFocused = document.activeElement;
    show(i);
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    pauseMarquee(true);
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLb() {
    lb.classList.remove('is-open');
    pauseMarquee(false);
    document.body.style.overflow = '';
    window.setTimeout(function () { lb.hidden = true; }, reduceMotion ? 0 : 300);
    if (lastFocused) lastFocused.focus();
  }

  if (gallery) {
    gallery.addEventListener('click', function (e) {
      var btn = e.target.closest('.shot');
      if (btn) openLb(Number(btn.dataset.index));
    });
  }

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { show(current - 1); });
  lbNext.addEventListener('click', function () { show(current + 1); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb) closeLb();
  });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape')     { closeLb(); }
    if (e.key === 'ArrowLeft')  { show(current - 1); }
    if (e.key === 'ArrowRight') { show(current + 1); }

    // Keep focus inside the dialog while it is open.
    if (e.key === 'Tab') {
      var focusables = [lbClose, lbPrev, lbNext];
      var idx = focusables.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? idx - 1 : idx + 1;
      focusables[(next + focusables.length) % focusables.length].focus();
    }
  });

  /* ── Marquee: stop the motion while the lightbox or menu is open ── */
  var marquee = document.getElementById('marquee');
  function pauseMarquee(paused) {
    if (marquee) marquee.classList.toggle('is-paused', paused);
  }

  /* ───────────────────────── Footer year ───────────────────────── */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
