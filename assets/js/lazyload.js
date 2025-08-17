/*
  Lazy-loading and runtime picture-wrapping script.
  - Observes <img> elements and loads images when they enter the viewport.
  - Wraps existing <img> in a <picture> element with generated WebP/source srcsets
  - Preserves original src as fallback so older browsers work unchanged
  - Uses data attributes and small inline placeholders for better UX
*/
(function () {
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="12"><rect width="100%" height="100%" fill="%23eee"/></svg>';

  function makeSrcset(src, sizes) {
    // src: 'assets/images/foo.jpg' -> produce 'assets/images/foo-800.webp 800w, assets/images/foo-1200.webp 1200w'
    const parts = src.split('.');
    if (parts.length < 2) return '';
    const ext = parts.pop();
    const base = parts.join('.');
    return sizes.map(s => `${base}-${s}.webp ${s}w`).join(', ');
  }

  function buildPicture(img) {
    if (!img || img.__wrapped) return img;
    const src = img.getAttribute('src');
    if (!src) return img;

    const sizes = [800, 1200];
    const picture = document.createElement('picture');

    // WebP source
    const sourceWebp = document.createElement('source');
    sourceWebp.type = 'image/webp';
    sourceWebp.setAttribute('data-srcset', makeSrcset(src, sizes));
    sourceWebp.setAttribute('sizes', '(max-width: 800px) 800px, 1200px');
    picture.appendChild(sourceWebp);

    // Fallback img (keep original attributes)
    const fallback = img.cloneNode(false);
    fallback.setAttribute('data-src', src);
    fallback.setAttribute('src', placeholder);
    fallback.setAttribute('loading', 'lazy');
    // mark as managed
    fallback.__lazy = true;

    picture.appendChild(fallback);

    img.parentNode.replaceChild(picture, img);
    picture.__managed = true;
    return picture;
  }

  function loadImage(img) {
    // img can be <img> inside picture
    if (!img) return;
    if (img.__loaded) return;
    const src = img.getAttribute('data-src');
    if (src) {
      img.src = src;
      img.removeAttribute('data-src');
    }
    // If picture contains source elements with data-srcset, transfer to srcset
    const picture = img.parentNode;
    if (picture && picture.tagName === 'PICTURE') {
      const sources = picture.querySelectorAll('source[data-srcset]');
      sources.forEach(s => {
        s.srcset = s.getAttribute('data-srcset');
        s.removeAttribute('data-srcset');
      });
    }
    img.__loaded = true;
    img.classList.remove('blur-placeholder');
  }

  function init() {
    const imgs = Array.from(document.querySelectorAll('img'));
    imgs.forEach(img => {
      // skip images that are likely icons or already tiny
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      if (img.closest('picture')) return;
      buildPicture(img);
    });

    // IntersectionObserver for lazy loading
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          // if picture -> find img inside
          let img = target;
          if (target.tagName === 'PICTURE') img = target.querySelector('img');
          loadImage(img);
          io.unobserve(target);
        }
      });
    }, { rootMargin: '200px 0px' });

    // Observe all managed pictures
    const managed = document.querySelectorAll('picture.__managed, picture');
    managed.forEach(p => io.observe(p));

    // also observe images created outside picture
    document.addEventListener('click', function (e) {
      // small progressive preload: when user interacts, load nearby images
      const imgsInView = Array.from(document.querySelectorAll('img[data-src]')).slice(0, 4);
      imgsInView.forEach(i => loadImage(i));
    }, { once: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(init, 50);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
