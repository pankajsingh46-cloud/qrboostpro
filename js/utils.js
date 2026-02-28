/* ============================================
   QRBoost Pro - JavaScript Utilities & Premium Effects
   ============================================ */

'use strict';

// ============================================
// 1. CORE UTILITIES
// ============================================
const Utils = {
  /**
   * Throttle function - limits execution rate
   */
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

  /**
   * Debounce function - delays execution
   */
  debounce(func, wait, immediate = false) {
    let timeout;
    return function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  },

  /**
   * Request Animation Frame throttle for smooth scrolling
   */
  rafThrottle(func) {
    let ticking = false;
    return function(...args) {
      if (!ticking) {
        requestAnimationFrame(() => {
          func.apply(this, args);
          ticking = false;
        });
        ticking = true;
      }
    };
  },

  /**
   * Check if device supports touch
   */
  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Smooth scroll utility
   */
  ScrollUtils: {
    toElement(element, offset = 80) {
      if (!element) return;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
};

// ============================================
// 2. MAGNETIC EFFECT (For Premium Buttons)
// ============================================
class MagneticEffect {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      strength: 0.2, // Default pull strength
      ...options
    };
    this.init();
  }

  init() {
    if (Utils.isTouchDevice()) return; // Disable on mobile

    this.el.addEventListener('mousemove', (e) => {
      const rect = this.el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) * this.options.strength;
      const moveY = (e.clientY - centerY) * this.options.strength;
      
      this.el.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    this.el.addEventListener('mouseleave', () => {
      this.el.style.transform = 'translate(0px, 0px)';
    });
  }
}

// ============================================
// 3. RIPPLE EFFECT (Water drop effect on click)
// ============================================
class RippleEffect {
  constructor(element, options = {}) {
    this.el = element;
    this.options = {
      color: 'rgba(255, 255, 255, 0.4)',
      duration: 600,
      ...options
    };
    
    // Ensure parent has hidden overflow and relative positioning
    const computedStyle = getComputedStyle(this.el);
    if (computedStyle.position === 'static') {
      this.el.style.position = 'relative';
    }
    this.el.style.overflow = 'hidden';
    
    this.init();
  }

  init() {
    this.el.addEventListener('mousedown', (e) => {
      const rect = this.el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      
      // Ripple styling
      ripple.style.position = 'absolute';
      ripple.style.background = this.options.color;
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.marginTop = '-50px';
      ripple.style.marginLeft = '-50px';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transform = 'scale(0)';
      ripple.style.opacity = '1';
      ripple.style.transition = `transform ${this.options.duration}ms ease-out, opacity ${this.options.duration}ms ease-out`;

      this.el.appendChild(ripple);

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(4)';
        ripple.style.opacity = '0';
      });

      // Cleanup
      setTimeout(() => {
        ripple.remove();
      }, this.options.duration);
    });
  }
}

// ============================================
// 4. COUNTER ANIMATION (For Stats & Dashboard)
// ============================================
class CounterAnimation {
  constructor(element, options = {}) {
    this.el = element;
    
    // Get target value from attributes
    const rawValue = this.el.getAttribute('data-value') || this.el.getAttribute('data-count') || '0';
    this.target = parseFloat(rawValue.replace(/,/g, ''));
    
    this.options = {
      duration: 2000,
      suffix: this.el.getAttribute('data-suffix') || '',
      decimals: parseInt(this.el.getAttribute('data-decimals')) || 0,
      ...options
    };
  }

  start() {
    const startTime = performance.now();
    const startValue = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      let progress = Math.min(elapsed / this.options.duration, 1);
      
      // Easing (easeOutExpo)
      progress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentVal = startValue + (this.target - startValue) * progress;
      
      // Format number
      let displayVal = currentVal.toFixed(this.options.decimals);
      
      // Add commas for large numbers if no decimals
      if (this.options.decimals === 0) {
        displayVal = Math.floor(currentVal).toLocaleString();
      }

      this.el.textContent = displayVal + this.options.suffix;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Ensure final exact value
        let finalDisplay = this.target.toFixed(this.options.decimals);
        if (this.options.decimals === 0) {
          finalDisplay = this.target.toLocaleString();
        }
        this.el.textContent = finalDisplay + this.options.suffix;
      }
    };

    requestAnimationFrame(animate);
  }
}

// ============================================
// GLOBAL EXPORTS
// ============================================
window.Utils = Utils;
window.MagneticEffect = MagneticEffect;
window.RippleEffect = RippleEffect;
window.CounterAnimation = CounterAnimation;