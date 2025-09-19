document.addEventListener('DOMContentLoaded', () => {
  // Año en footer (si agregas un span#y en el footer)
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Menú móvil (dropdown) =====
  const headerEl = document.querySelector('header.site');
  const navToggle = document.querySelector('.nav-toggle');
  if (headerEl && navToggle) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      const isOpen = headerEl.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // cerrar si haces click fuera
    document.addEventListener('click', (e)=>{
      if (!headerEl.contains(e.target) && headerEl.classList.contains('open')) {
        headerEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // ===== Tarjetas de servicios: toggle en móvil/touch =====
(() => {
  const cards = Array.from(document.querySelectorAll('.service-card'));
  if (!cards.length) return;

  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;

  cards.forEach(card => {
    const faceBtn = card.querySelector('.service-face');
    if (!faceBtn) return;

    // Teclado (accesible) y mouse
    faceBtn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.classList.toggle('open'); }
    });

    if (isTouch) {
      faceBtn.addEventListener('click', e => {
        e.preventDefault();
        const willOpen = !card.classList.contains('open');
        cards.forEach(c => c.classList.remove('open'));
        if (willOpen) card.classList.add('open');
        faceBtn.setAttribute('aria-expanded', String(willOpen));
      });
    }
  });

  // Cerrar si tocas fuera (móvil)
  document.addEventListener('click', e => {
    if (!isTouch) return;
    const anyOpen = document.querySelector('.service-card.open');
    if (anyOpen && !anyOpen.contains(e.target)) {
      anyOpen.classList.remove('open');
      const btn = anyOpen.querySelector('.service-face');
      if (btn) btn.setAttribute('aria-expanded','false');
    }
  });
})();


  // ===== Formularios (placeholder sin backend) =====
  ['leadForm','contactForm'].forEach(id=>{
    const form = document.getElementById(id);
    if(!form) return;
    const msg = form.querySelector('.form-msg');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      if(msg) msg.textContent = '¡Gracias! Hemos recibido tu solicitud.';
      form.reset();
    });
  });

  // ===== Carrusel de FONDO (FADE) =====
  const slidesWrap = document.querySelector('.bg-slides');
  if (slidesWrap) {
    const items = Array.from(slidesWrap.querySelectorAll('.bg-item'));
    const dotsWrap = document.querySelector('.bg-dots');
    const prev = document.querySelector('.bg-prev');
    const next = document.querySelector('.bg-next');

    // Crear dots
    items.forEach((_, i) => {
      const b = document.createElement('button');
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => show(i, true));
      dotsWrap.appendChild(b);
    });

    let idx = 0, timer;
    function show(i, stopAuto=false){
      idx = (i + items.length) % items.length;
      items.forEach((el, k) => {
        el.classList.toggle('active', k === idx);
        // Control de video: play solo en el activo
        if (el.tagName === 'VIDEO') {
          if (k === idx) { el.play().catch(()=>{}); }
          else { el.pause(); el.currentTime = 0; }
        }
      });
      // actualiza dots
      dotsWrap.querySelectorAll('button').forEach((d, k) => d.classList.toggle('active', k === idx));
      if (stopAuto) resetAuto();
    }

    function nextSlide(){ show(idx + 1); }
    function prevSlide(){ show(idx - 1); }
    function resetAuto(){ clearInterval(timer); timer = setInterval(nextSlide, 6000); }

    next.addEventListener('click', () => show(idx + 1, true));
    prev.addEventListener('click', () => show(idx - 1, true));

    // iniciar
    show(0);
    resetAuto();
  }
});
