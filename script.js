(() => {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Glitch "амплитуда" через CSS vars
  const root = document.documentElement;
  function pulseGlitch() {
    const gx = (Math.random() * 2.2).toFixed(2) + 'px';
    const gy = (Math.random() * 1.6).toFixed(2) + 'px';
    root.style.setProperty('--gx', gx);
    root.style.setProperty('--gy', gy);
  }
  if (!prefersReduced) {
    pulseGlitch();
    setInterval(pulseGlitch, 180);
  }

  // Reveal on scroll (signal in)
  const revealEls = [...document.querySelectorAll('.reveal')];
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  }

  // Cursor
  const c1 = document.querySelector('.cursor');
  const c2 = document.querySelector('.cursor--soft');
  if (!prefersReduced && c1 && c2) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    let sx = x, sy = y;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    }, { passive: true });

    function raf() {
      // hard cursor
      x += (tx - x) * 0.35;
      y += (ty - y) * 0.35;
      // soft cursor
      sx += (tx - sx) * 0.12;
      sy += (ty - sy) * 0.12;

      c1.style.transform = `translate(${x}px, ${y}px)`;
      c2.style.transform = `translate(${sx}px, ${sy}px)`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Hover distortion hint
    const hoverTargets = document.querySelectorAll('a, button, summary');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        c1.style.boxShadow = '0 0 26px rgba(168,255,62,.55)';
        c2.style.opacity = '1';
      });
      el.addEventListener('mouseleave', () => {
        c1.style.boxShadow = '0 0 18px rgba(168,255,62,.35)';
        c2.style.opacity = '.8';
      });
    });
  }

  // Subtle "signal shake" on CTA click (tiny, usable)
  const ctas = document.querySelectorAll('.btn--primary');
  ctas.forEach(btn => {
    btn.addEventListener('click', () => {
      if (prefersReduced) return;
      document.body.animate([
        { transform: 'translate(0,0)' },
        { transform: 'translate(1px,-1px)' },
        { transform: 'translate(-1px,1px)' },
        { transform: 'translate(0,0)' }
      ], { duration: 160, iterations: 1 });
    });
  });
})();
