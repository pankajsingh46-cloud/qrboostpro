/* ============================================
   QRBoost Pro - JavaScript Utilities
   ============================================ */
'use strict';

const Utils = {
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  rafThrottle(func) {
    let ticking = false;
    return function(...args) {
      if (!ticking) {
        requestAnimationFrame(() => { func.apply(this, args); ticking = false; });
        ticking = true;
      }
    };
  },
  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  }
};

// --- RIPPLE EFFECT ---
class RippleEffect {
  constructor(element, options = {}) {
    this.el = element;
    this.options = { color: 'rgba(255, 255, 255, 0.4)', duration: 600, ...options };
    if (getComputedStyle(this.el).position === 'static') this.el.style.position = 'relative';
    this.el.style.overflow = 'hidden';
    this.init();
  }
  init() {
    this.el.addEventListener('mousedown', (e) => {
      const rect = this.el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute; background: ${this.options.color}; border-radius: 50%; pointer-events: none;
        width: 100px; height: 100px; margin-top: -50px; margin-left: -50px;
        left: ${e.clientX - rect.left}px; top: ${e.clientY - rect.top}px;
        transform: scale(0); opacity: 1; transition: all ${this.options.duration}ms ease-out;
      `;
      this.el.appendChild(ripple);
      requestAnimationFrame(() => { ripple.style.transform = 'scale(4)'; ripple.style.opacity = '0'; });
      setTimeout(() => ripple.remove(), this.options.duration);
    });
  }
}

// --- MAGNETIC BUTTON ---
class MagneticEffect {
  constructor(element, options = {}) {
    this.el = element;
    this.options = { strength: 0.2, ...options };
    this.init();
  }
  init() {
    if (Utils.isTouchDevice()) return;
    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const moveX = (e.clientX - (rect.left + rect.width / 2)) * this.options.strength;
      const moveY = (e.clientY - (rect.top + rect.height / 2)) * this.options.strength;
      this.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    this.el.addEventListener('mouseleave', () => { this.el.style.transform = 'translate(0px, 0px)'; });
  }
}

// --- NUMBER COUNTER ---
class CounterAnimation {
  constructor(element, options = {}) {
    this.el = element;
    this.target = parseFloat((this.el.getAttribute('data-count') || '0').replace(/,/g, ''));
    this.options = { duration: 2000, suffix: this.el.getAttribute('data-suffix') || '', ...options };
  }
  start() {
    const startTime = performance.now();
    const animate = (currentTime) => {
      let progress = Math.min((currentTime - startTime) / this.options.duration, 1);
      progress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(this.target * progress);
      this.el.textContent = currentVal.toLocaleString() + this.options.suffix;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }
}

window.Utils = Utils; window.RippleEffect = RippleEffect; 
window.MagneticEffect = MagneticEffect; window.CounterAnimation = CounterAnimation;