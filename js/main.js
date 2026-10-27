// La Comuna · «Bon dia»: el círculo azul de su logo se abre al cargar, crece con el scroll hasta llenar la pantalla
// y luego los platos aterrizan uno a uno sobre el mantel azul
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = () => document.documentElement.lang;
  const T = (es, ca, en) => (L() === 'ca' ? ca : L() === 'en' ? en : es);

  // ---------- abierto ahora (cada día de 8 a 16 h) ----------
  function status() {
    const el = document.getElementById('status'), sp = el.querySelector('span');
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Madrid' })), m = d.getHours() * 60 + d.getMinutes();
    const open = m >= 480 && m < 960;
    el.classList.toggle('open', open);
    sp.textContent = open ? T('Abierto ahora · hasta las 16:00', 'Obert ara · fins a les 16:00', 'Open now · until 4 pm') : m < 480 ? T('Abrimos a las 8:00', 'Obrim a les 8:00', 'We open at 8 am') : T('Mañana desde las 8:00', 'Demà des de les 8:00', 'Tomorrow from 8 am');
  }

  // ---------- círculo de la portada ----------
  function disc() {
    const pin = document.querySelector('.hero-pin'), disc = document.getElementById('disc'), ring = document.querySelector('.ring'), txt = document.querySelector('.hero-txt'), img = disc.querySelector('img');
    let g = {}, grow = reduce ? 1 : 0, prog = 0;
    const geo = () => {
      const W = pin.clientWidth, H = pin.clientHeight, mob = W < 860;
      const cx = mob ? W * .5 : W * .72, cy = mob ? H * .3 : H * .52, r0 = mob ? Math.min(W * .4, H * .23) : Math.min(W * .24, H * .37);
      g = { cx, cy, r0, rMax: Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) };
      [pin, disc].forEach((n) => { n.style.setProperty('--cx', cx + 'px'); n.style.setProperty('--cy', cy + 'px'); });
      pin.style.setProperty('--r0', r0 + 'px'); draw();
    };
    const draw = () => {
      const e = 1 - Math.pow(1 - prog, 3), r = g.r0 * grow + (g.rMax - g.r0) * e;
      disc.style.setProperty('--r', r + 'px');
      ring.style.opacity = String(Math.max(0, 1 - prog * 3) * grow);
      txt.style.opacity = String(Math.max(0, 1 - prog * 2.2));
      txt.style.transform = `translateY(${-prog * 60}px)`;
      img.style.transform = `scale(${1.12 - .12 * e})`;
    };
    new ResizeObserver(geo).observe(pin); geo();
    const ringTxt = () => (document.getElementById('ringT').textContent = T('CAFÉ DE ESPECIALIDAD · BRUNCH · BARRI VELL · GIRONA · ', 'CAFÈ D’ESPECIALITAT · BRUNCH · BARRI VELL · GIRONA · ', 'SPECIALTY COFFEE · BRUNCH · OLD TOWN · GIRONA · '));
    document.addEventListener('langchange', ringTxt); ringTxt();
    if (reduce || typeof gsap === 'undefined') { grow = 1; draw(); return; }
    const o = { v: 0 };
    gsap.to(o, { v: 1, duration: 1.6, ease: 'expo.out', delay: .05, onUpdate: () => { grow = o.v; draw(); } });
    gsap.to(ring, { rotate: 360, duration: 40, repeat: -1, ease: 'none' });
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: (s) => { prog = s.progress; draw(); } });
  }

  // ---------- la mesa: los platos aterrizan ----------
  function mesa() {
    if (reduce || typeof gsap === 'undefined') return;
    const pls = gsap.utils.toArray('.pl');
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.mesa', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    pls.forEach((p, i) => {
      const a = (i / pls.length) * Math.PI * 2 + .6;
      tl.fromTo(p, { x: Math.cos(a) * innerWidth * .9, y: Math.sin(a) * innerHeight * .9, rotate: (i % 2 ? 1 : -1) * 70, scale: 1.25 },
        { x: 0, y: 0, rotate: (i % 2 ? 1 : -1) * (4 + i * 2), scale: 1, ease: 'power3.out', duration: 1 }, i * .35);
    });
    tl.fromTo('.mesa-h', { scale: .8, opacity: .2 }, { scale: 1, opacity: 1, duration: 1.6, ease: 'power2.out' }, .2);
  }

  function init() {
    status(); setInterval(status, 60000); document.addEventListener('langchange', status);
    disc(); mesa();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
