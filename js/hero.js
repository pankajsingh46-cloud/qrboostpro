/* ============================================
   QRBoost Pro - Hero Effects
   ============================================ */
'use strict';

class ParticleSystem {
  constructor(container) {
    this.container = container;
    this.particles = [];
    this.init();
  }
  init() {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 2;
      p.style.cssText = `position:absolute; width:${size}px; height:${size}px; background:rgba(124,58,237,0.4); border-radius:50%; opacity:${Math.random()*0.5+0.2}; pointer-events:none;`;
      this.particles.push({ el: p, x: Math.random()*100, y: Math.random()*100, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2 });
      this.container.appendChild(p);
    }
    this.animate();
  }
  animate() {
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x < 0) p.x=100; if(p.x > 100) p.x=0; if(p.y < 0) p.y=100; if(p.y > 100) p.y=0;
      p.el.style.left = `${p.x}%`; p.el.style.top = `${p.y}%`;
    });
    requestAnimationFrame(() => this.animate());
  }
}

class TextReveal {
  constructor(el, delay = 0) {
    const text = el.innerText;
    el.innerHTML = '';
    text.split(' ').forEach((word, i) => {
      const span = document.createElement('span');
      span.style.cssText = 'display:inline-block; overflow:hidden; vertical-align:bottom; margin-right:8px;';
      const inner = document.createElement('span');
      inner.innerText = word;
      inner.style.cssText = `display:inline-block; transform:translateY(100%); opacity:0; transition:all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay + (i*50)}ms;`;
      span.appendChild(inner); el.appendChild(span);
      setTimeout(() => { inner.style.transform = 'translateY(0)'; inner.style.opacity = '1'; }, 100);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Particles
  const pCont = document.querySelector('.hero__particles');
  if (pCont) new ParticleSystem(pCont);

  // 2. Text Reveal
  document.querySelectorAll('.text-reveal-word').forEach(el => new TextReveal(el, 500));

  // 3. Setup global Ripples & Magnetics
  document.querySelectorAll('[data-ripple]').forEach(btn => new RippleEffect(btn));
  document.querySelectorAll('.hero__btn--primary').forEach(btn => new MagneticEffect(btn));
});