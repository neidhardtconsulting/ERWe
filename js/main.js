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

  // Hero video carousel: crossfade through a sequence of background videos.
  var heroVideos = document.querySelectorAll('.hero-video-el');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroVideos.length > 1 && !reduceMotion) {
    var current = 0;
    var DWELL_MS = 7000;
    var timer = null;

    function goTo(nextIndex) {
      var prev = heroVideos[current];
      var next = heroVideos[nextIndex];

      next.currentTime = 0;
      next.preload = 'auto';
      var playPromise = next.play();
      if (playPromise && playPromise.catch) { playPromise.catch(function () {}); }
      next.classList.add('is-active');

      prev.classList.remove('is-active');
      window.setTimeout(function () {
        prev.pause();
        prev.preload = 'none';
      }, 1500);

      current = nextIndex;
      scheduleNext();
    }

    function scheduleNext() {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        goTo((current + 1) % heroVideos.length);
      }, DWELL_MS);
    }

    scheduleNext();
  } else if (heroVideos.length) {
    // Reduced motion / no JS carousel: keep a single static frame visible.
    heroVideos.forEach(function (v, i) {
      if (i === 0) { v.pause(); } else { v.remove(); }
    });
  }

  var lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<button class="lightbox-close" aria-label="Schließen">&times;</button><img alt="">';
  document.body.appendChild(lightbox);
  var lightboxImg = lightbox.querySelector('img');
  var lightboxClose = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.thumb img').forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) { closeLightbox(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLightbox(); }
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
