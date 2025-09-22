document.addEventListener('DOMContentLoaded', () => {
  // Año en footer (si agregas un span#y en el footer)
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ===== Menú móvil (dropdown) =====
  const headerEl = document.querySelector('header.site');
  const navToggle = document.querySelector('.nav-toggle');
   if (headerEl && navToggle) {
    // 1. Seleccionamos todos los enlaces del menú DENTRO de este bloque.
    const menuLinks = headerEl.querySelectorAll('nav a');
    
    // El resto de tu código de menú
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.addEventListener('click', () => {
      const isOpen = headerEl.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // cerrar si haces click fuera
    document.addEventListener('click', (e) => {
      if (!headerEl.contains(e.target) && headerEl.classList.contains('open')) {
        headerEl.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // 2. Ahora, este código funcionará porque `menuLinks` ya está definida.
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (headerEl.classList.contains('open')) {
          headerEl.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
  // ====== MENÚ MÓVIL ======
  const header = document.getElementById('siteNav');       // <header id="siteNav" class="site">
  if (!header) return;

  const toggleBtn = header.querySelector('.nav-toggle');   // botón ☰

  const open  = () => { header.classList.add('open');  document.body.classList.add('menu-open'); };
  const close = () => { header.classList.remove('open'); document.body.classList.remove('menu-open'); };

  // Abrir/cerrar con el botón
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = header.classList.toggle('open');
      document.body.classList.toggle('menu-open', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Cerrar al hacer clic en cualquier enlace del menú
  header.querySelectorAll('nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href') || '';
      close(); // SIEMPRE cerrar

      // Scroll suave con offset si es ancla interna
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = header.offsetHeight || 0;
          const y = target.getBoundingClientRect().top + window.scrollY - offset - 6;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
  });

  // Cerrar si tocas fuera del header
  document.addEventListener('click', (e) => {
    if (header.classList.contains('open') && !e.target.closest('#siteNav')) close();
  });

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Opcional: cerrar al iniciar scroll
  window.addEventListener('scroll', () => {
    if (header.classList.contains('open')) close();
  }, { passive: true });
});



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

  // Busca / crea el nodo de mensajes
  let statusEl = form.querySelector('.form-msg');
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'form-msg';
    statusEl.setAttribute('aria-live', 'polite');
    statusEl.style.marginTop = '.4rem';
    form.appendChild(statusEl);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    statusEl.textContent = 'Enviando…';
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    try {
      const action = form.getAttribute('action') || '/Api/Envio-Correo.php';
      const res = await fetch(action, {
        method: 'POST',
        body: new FormData(form),
      });

      let data = {};
      try { data = await res.json(); } catch { /* ignore */ }

      if (res.ok && data.ok) {
        statusEl.textContent = '¡Gracias! Te contactaremos en breve.';
        form.reset();
      } else {
        const msg = (data && data.error) || res.statusText || 'No se pudo enviar. Intenta de nuevo.';
        statusEl.textContent = 'Error: ' + msg;
      }
    } catch (err) {
      statusEl.textContent = 'Error de red: ' + (err?.message || err);
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
});
