(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero image slideshow: crossfade through a sequence of property photos.
  var heroSlides = document.querySelectorAll('.hero-slide-el');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroSlides.length > 1 && !reduceMotion) {
    var current = 0;
    var DWELL_MS = 7000;
    var timer = null;

    function goTo(nextIndex) {
      var prev = heroSlides[current];
      var next = heroSlides[nextIndex];

      next.classList.add('is-active');
      prev.classList.remove('is-active');

      current = nextIndex;
      scheduleNext();
    }

    function scheduleNext() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        goTo((current + 1) % heroSlides.length);
      }, DWELL_MS);
    }

    scheduleNext();
  } else if (heroSlides.length) {
    // Reduced motion / no JS carousel: keep a single static frame visible.
    heroSlides.forEach(function (v, i) {
      if (i !== 0) { v.remove(); }
    });
  }

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild">&#8249;</button>' +
    '<button class="lightbox-close" aria-label="Schließen">&times;</button>' +
    '<img alt="">' +
    '<button class="lightbox-nav lightbox-next" aria-label="Nächstes Bild">&#8250;</button>';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector('img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');
  var lightboxPrev = lightbox.querySelector('.lightbox-prev');
  var lightboxNext = lightbox.querySelector('.lightbox-next');
  var lightboxGroup = [];
  var lightboxIndex = 0;

  function groupFor(img) {
    var thumb = img.closest('.thumb');
    var container = (thumb && thumb.parentElement) || img.parentElement;
    return Array.prototype.slice.call(container.querySelectorAll('.thumb img'));
  }

  function showLightboxIndex(i) {
    lightboxIndex = (i + lightboxGroup.length) % lightboxGroup.length;
    var img = lightboxGroup[lightboxIndex];
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || '';
    var multi = lightboxGroup.length > 1;
    lightboxPrev.hidden = !multi;
    lightboxNext.hidden = !multi;
  }

  function openLightbox(img) {
    lightboxGroup = groupFor(img);
    showLightboxIndex(lightboxGroup.indexOf(img));
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.thumb img').forEach(function (img) {
    img.addEventListener('click', function (e) {
      e.preventDefault();
      openLightbox(img);
    });
  });
  lightboxPrev.addEventListener('click', function () { showLightboxIndex(lightboxIndex - 1); });
  lightboxNext.addEventListener('click', function () { showLightboxIndex(lightboxIndex + 1); });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('is-open')) { return; }
    if (e.key === 'Escape') { closeLightbox(); }
    else if (e.key === 'ArrowLeft') { showLightboxIndex(lightboxIndex - 1); }
    else if (e.key === 'ArrowRight') { showLightboxIndex(lightboxIndex + 1); }
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();
