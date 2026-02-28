/* ============================================
   QRBoost Pro - Sections Interactivity
   ============================================ */
'use strict';

class SectionsEngine {
  constructor() {
    this.init3DCards();
    this.initScrollReveal();
    this.initTestimonialStack();
    this.initPricingToggle();
    this.initPageLoader();
  }

  // 1. Flashlight 3D Cards (Problems Section)
  init3DCards() {
    document.querySelectorAll('.problems__card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left, y = e.clientY - rect.top;
        const rotX = ((y - rect.height/2) / (rect.height/2)) * -15;
        const rotY = ((x - rect.width/2) / (rect.width/2)) * 15;
        card.style.setProperty('--rotate-x', `${rotX}deg`);
        card.style.setProperty('--rotate-y', `${rotY}deg`);
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
      });
    });
  }

  // 2. Stagger Reveal & Number Counters
  initScrollReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          
          // Fade Up logic
          if(el.hasAttribute('data-animate')) el.classList.add('is-visible');
          
          // Delay logic for Features
          if(el.classList.contains('feature-card')) {
            setTimeout(() => el.classList.add('is-visible'), parseInt(el.dataset.delay || 0) * 150);
          }

          // Trigger Counters
          if(el.hasAttribute('data-count')) {
            new CounterAnimation(el).start();
            el.removeAttribute('data-count'); // Run once
          }
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-animate], .feature-card, .dashboard__stat-value').forEach(el => observer.observe(el));
  }

  // 3. 3D Stacked Testimonials
  initTestimonialStack() {
    const cards = document.querySelectorAll('.testimonial-card');
    if(!cards.length) return;
    let current = 0;

    const update = () => {
      cards.forEach((c, i) => {
        c.style.position = 'absolute'; c.style.left = '50%'; c.style.marginLeft = '-50%'; c.style.maxWidth = '100%';
        if (i === current) {
          c.style.transform = 'translateX(0) scale(1) translateY(0)'; c.style.opacity = '1'; c.style.zIndex = '10'; c.style.filter = 'blur(0px)';
        } else if (i === (current + 1) % cards.length) {
          c.style.transform = 'translateX(40px) scale(0.9) translateY(20px)'; c.style.opacity = '0.6'; c.style.zIndex = '5'; c.style.filter = 'blur(2px)';
        } else {
          c.style.transform = 'translateX(-40px) scale(0.8) translateY(40px)'; c.style.opacity = '0'; c.style.zIndex = '1'; c.style.filter = 'blur(4px)';
        }
      });
    };
    update();
    setInterval(() => { current = (current + 1) % cards.length; update(); }, 4000);
  }

  // 4. Pricing Toggle
  initPricingToggle() {
    const toggle = document.querySelector('.pricing__toggle');
    if(!toggle) return;
    let isYearly = false;
    toggle.addEventListener('click', () => {
      isYearly = !isYearly;
      toggle.classList.toggle('is-yearly', isYearly);
      // Dummy logic to animate price change visually
      document.querySelectorAll('.pricing__amount').forEach(el => {
        el.style.transform = 'scale(0.5)'; el.style.opacity = '0';
        setTimeout(() => {
          if(el.dataset.plan === 'pro') el.innerText = isYearly ? '24' : '29';
          el.style.transform = 'scale(1)'; el.style.opacity = '1';
        }, 200);
      });
    });
  }

  // 5. Page Loader Fix
  initPageLoader() {
    const loader = document.querySelector('.page-loading');
    if(loader) window.addEventListener('load', () => { setTimeout(() => { loader.classList.add('is-hidden'); setTimeout(() => loader.remove(), 500); }, 300); });
  }
}

document.addEventListener('DOMContentLoaded', () => new SectionsEngine());