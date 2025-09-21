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


// ========== SCROLL SUAVE EN ANCLAS ==========
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id && id.length > 1) {
    const el = document.querySelector(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});


// ========== NAVBAR AUTO-HIDE SOLO APARECE EN EL TOP ==========
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('siteNav');
  if (!nav) return;

  const TOP_VISIBLE = 120;
  let ticking = false;

  const applyState = () => {
    const y = window.scrollY || 0;

    // Si el menú móvil está abierto, no ocultes el header
    if (nav.classList.contains('open')) {
      nav.classList.add('nav-solid');
      nav.classList.remove('nav-hidden');
      return;
    }

    // Sólido al mínimo scroll
    nav.classList.toggle('nav-solid', y > 8);

    // Oculto si pasas el umbral; visible cerca del top
    nav.classList.toggle('nav-hidden', y > TOP_VISIBLE);
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        applyState();
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  applyState(); // estado inicial
});


// ========== ENVIO DEL FORMULARIO AL CORREO ==========

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const btn = document.getElementById('sendBtn');
  const msg = document.getElementById('formMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.error || 'No se pudo enviar el mensaje.');
      }

      msg.textContent = '¡Gracias! Te contactaremos muy pronto.';
      msg.style.color = '#0f766e';
      form.reset();
    } catch (err) {
      console.error(err);
      msg.textContent = 'Hubo un problema al enviar. Intenta de nuevo o escríbenos por WhatsApp.';
      msg.style.color = '#b91c1c';
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
});

