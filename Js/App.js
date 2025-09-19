document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // Menú móvil
  const navToggle = document.querySelector('.nav-toggle');
  const navUl = document.querySelector('nav ul');
  if (navToggle && navUl) {
    navToggle.addEventListener('click', () => {
      const visible = getComputedStyle(navUl).display !== 'none';
      navUl.style.display = visible ? 'none' : 'flex';
    });
  }

  // Formularios (placeholder sin backend)
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

  // ===== Carrusel de FONDO (imágenes o videos) =====
  const bgWrap = document.querySelector('.bg-slides');
  if (bgWrap) {
    const items = Array.from(bgWrap.querySelectorAll('.bg-item'));
    const dotsWrap = document.querySelector('.bg-dots');
    const prev = document.querySelector('.bg-prev');
    const next = document.querySelector('.bg-next');

    // ancho según número de slides
    bgWrap.style.width = `${items.length * 100}%`;
    items.forEach(el => el.style.flex = '0 0 100%');

    // dots
    items.forEach((_,i)=>{
      const b = document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click', ()=>go(i, true));
      dotsWrap.appendChild(b);
    });

    let idx = 0, timer;
    function update(){
      bgWrap.style.transform = `translateX(-${idx*100}%)`;
      dotsWrap.querySelectorAll('button').forEach((d,i)=>d.classList.toggle('active', i===idx));
      // reproducir/pausar videos según visibilidad
      items.forEach((el,i)=>{
        if(el.tagName === 'VIDEO'){ i===idx ? el.play().catch(()=>{}) : el.pause(); }
      });
    }
    function go(i, stop){
      idx = (i + items.length) % items.length;
      update();
      if(stop) resetAuto();
    }
    function nextSlide(){ go(idx+1); }
    function prevSlide(){ go(idx-1); }
    function resetAuto(){ clearInterval(timer); timer = setInterval(nextSlide, 5500); }

    next.addEventListener('click', ()=>go(idx+1, true));
    prev.addEventListener('click', ()=>go(idx-1, true));

    update();
    resetAuto();
  }
});
