/* ============================================
   QRBoost Pro - JavaScript Utilities
   ============================================ */

'use strict';

// ========== PERFORMANCE UTILITIES ==========

/**
 * Throttle function - limits execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function - delays execution until after wait period
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @param {boolean} immediate - Trigger on leading edge
 */
function debounce(func, wait, immediate = false) {
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
}

/**
 * Request Animation Frame throttle
 * @param {Function} func - Function to throttle
 */
function rafThrottle(func) {
  let rafId = null;
  return function(...args) {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      func.apply(this, args);
      rafId = null;
    });
  };
}

// ========== SCROLL UTILITIES ==========

const ScrollUtils = {
  /**
   * Get current scroll position
   */
  getPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  },

  /**
   * Smooth scroll to element
   * @param {string|Element} target - Selector or element
   * @param {number} offset - Offset from top
   */
  toElement(target, offset = 0) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    if (!element) return;
    
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  },

  /**
   * Smooth scroll to top
   */
  toTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  /**
   * Check if element is in viewport
   * @param {Element} element - DOM element
   * @param {number} offset - Offset from edges
   */
  isInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= -offset &&
      rect.left >= -offset &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
  },

  /**
   * Get scroll percentage
   */
  getPercentage() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return (scrollTop / docHeight) * 100;
  }
};

// ========== INTERSECTION OBSERVER UTILITY ==========

class ViewportObserver {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      once: true,
      ...options
    };
    this.observers = new Map();
  }

  /**
   * Observe elements with callback
   * @param {string|NodeList|Array} elements - Elements to observe
   * @param {Function} onEnter - Callback when element enters
   * @param {Function} onExit - Callback when element exits
   */
  observe(elements, onEnter, onExit = null) {
    const elementList = typeof elements === 'string' 
      ? document.querySelectorAll(elements) 
      : elements;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onEnter(entry.target, entry);
          if (this.options.once) {
            observer.unobserve(entry.target);
          }
        } else if (onExit) {
          onExit(entry.target, entry);
        }
      });
    }, this.options);

    elementList.forEach(el => observer.observe(el));
    return observer;
  }

  /**
   * Auto-animate elements with data-animate attribute
   */
  initAutoAnimations() {
    this.observe('[data-animate]', (element) => {
      element.classList.add('is-visible');
    });
  }
}

// ========== COUNTER ANIMATION ==========

class CounterAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      duration: 2000,
      start: 0,
      end: parseInt(element.dataset.value) || 0,
      prefix: element.dataset.prefix || '',
      suffix: element.dataset.suffix || '',
      separator: element.dataset.separator || ',',
      decimals: parseInt(element.dataset.decimals) || 0,
      easing: 'easeOutExpo',
      ...options
    };
    this.hasAnimated = false;
  }

  // Easing functions
  static easings = {
    linear: t => t,
    easeOutQuad: t => t * (2 - t),
    easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
    easeOutCubic: t => (--t) * t * t + 1,
    easeOutQuart: t => 1 - (--t) * Math.pow(t, 3)
  };

  /**
   * Format number with separators
   */
  formatNumber(num) {
    const { prefix, suffix, separator, decimals } = this.options;
    const fixedNum = num.toFixed(decimals);
    const parts = fixedNum.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + parts.join('.') + suffix;
  }

  /**
   * Start the counter animation
   */
  start() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    const { duration, start, end, easing } = this.options;
    const easingFn = CounterAnimation.easings[easing] || CounterAnimation.easings.easeOutExpo;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);
      const currentValue = start + (end - start) * easedProgress;

      this.element.textContent = this.formatNumber(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Reset counter
   */
  reset() {
    this.hasAnimated = false;
    this.element.textContent = this.formatNumber(this.options.start);
  }
}

// ========== MAGNETIC BUTTON EFFECT ==========

class MagneticEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      strength: 0.3,
      radius: 100,
      ...options
    };
    this.init();
  }

  init() {
    this.element.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  onMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    if (distance < this.options.radius) {
      const { strength } = this.options;
      this.element.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
    }
  }

  onMouseLeave() {
    this.element.style.transform = 'translate(0, 0)';
  }
}

// ========== TYPING EFFECT ==========

class TypeWriter {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      strings: JSON.parse(element.dataset.strings || '[]'),
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursor: true,
      cursorChar: '|',
      ...options
    };
    this.currentStringIndex = 0;
    this.currentCharIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    if (this.options.cursor) {
      this.cursorElement = document.createElement('span');
      this.cursorElement.className = 'typewriter-cursor';
      this.cursorElement.textContent = this.options.cursorChar;
      this.element.appendChild(this.cursorElement);
    }
    this.type();
  }

  type() {
    const { strings, typeSpeed, backSpeed, backDelay, loop } = this.options;
    const currentString = strings[this.currentStringIndex];
    
    let timeout = typeSpeed;
    
    if (this.isDeleting) {
      this.currentCharIndex--;
      timeout = backSpeed;
    } else {
      this.currentCharIndex++;
    }

    // Update text
    const textContent = currentString.substring(0, this.currentCharIndex);
    this.element.childNodes[0].textContent = textContent;

    // Check if word is complete
    if (!this.isDeleting && this.currentCharIndex === currentString.length) {
      timeout = backDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentCharIndex === 0) {
      this.isDeleting = false;
      this.currentStringIndex = (this.currentStringIndex + 1) % strings.length;
      if (!loop && this.currentStringIndex === 0) return;
    }

    setTimeout(() => this.type(), timeout);
  }
}

// ========== RIPPLE EFFECT ==========

class RippleEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      color: 'rgba(255, 255, 255, 0.3)',
      duration: 600,
      ...options
    };
    this.init();
  }

  init() {
    this.element.addEventListener('click', this.create.bind(this));
  }

  create(e) {
    const rect = this.element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${this.options.color};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple ${this.options.duration}ms ease-out;
      pointer-events: none;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    
    this.element.style.position = 'relative';
    this.element.style.overflow = 'hidden';
    this.element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), this.options.duration);
  }
}

// ========== PARALLAX EFFECT ==========

class ParallaxEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      speed: 0.5,
      direction: 'vertical',
      ...options
    };
    this.init();
  }

  init() {
    window.addEventListener('scroll', rafThrottle(this.update.bind(this)));
    this.update();
  }

  update() {
    const rect = this.element.getBoundingClientRect();
    const scrolled = window.pageYOffset;
    const rate = scrolled * this.options.speed;
    
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      if (this.options.direction === 'vertical') {
        this.element.style.transform = `translateY(${rate}px)`;
      } else {
        this.element.style.transform = `translateX(${rate}px)`;
      }
    }
  }
}

// ========== TAB MANAGER ==========

class TabManager {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;
    this.options = {
      activeClass: 'is-active',
      animationDuration: 300,
      ...options
    };
    this.init();
  }

  init() {
    this.tabs = this.container.querySelectorAll('[data-tab]');
    this.panels = this.container.querySelectorAll('[data-panel]');
    
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
  }

  switchTab(tabId) {
    const { activeClass } = this.options;
    
    // Update tabs
    this.tabs.forEach(tab => {
      tab.classList.toggle(activeClass, tab.dataset.tab === tabId);
    });
    
    // Update panels with animation
    this.panels.forEach(panel => {
      if (panel.dataset.panel === tabId) {
        panel.classList.add(activeClass);
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(10px)';
        requestAnimationFrame(() => {
          panel.style.transition = `opacity ${this.options.animationDuration}ms, transform ${this.options.animationDuration}ms`;
          panel.style.opacity = '1';
          panel.style.transform = 'translateY(0)';
        });
      } else {
        panel.classList.remove(activeClass);
      }
    });
  }
}

// ========== UTILITY EXPORTS ==========

const Utils = {
  throttle,
  debounce,
  rafThrottle,
  ScrollUtils,
  ViewportObserver,
  CounterAnimation,
  MagneticEffect,
  TypeWriter,
  RippleEffect,
  ParallaxEffect,
  TabManager,

  /**
   * Check if device is touch enabled
   */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Get CSS variable value
   */
  getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },

  /**
   * Set CSS variable value
   */
  setCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  },

  /**
   * Lock body scroll
   */
  lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
  },

  /**
   * Unlock body scroll
   */
  unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  },

  /**
   * Get scrollbar width
   */
  getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.cssText = 'visibility:hidden;overflow:scroll;position:absolute;top:-9999px;width:100px';
    document.body.appendChild(outer);
    const width = outer.offsetWidth - outer.clientWidth;
    outer.remove();
    return width;
  },

  /**
   * Generate unique ID
   */
  generateId(prefix = 'id') {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Wait for specified milliseconds
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * Check if element exists
   */
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  }
};

// Make available globally
window.Utils = Utils;
window.ScrollUtils = ScrollUtils;
window.ViewportObserver = ViewportObserver;
window.CounterAnimation = CounterAnimation;
window.MagneticEffect = MagneticEffect;
window.TypeWriter = TypeWriter;
window.RippleEffect = RippleEffect;
window.ParallaxEffect = ParallaxEffect;
window.TabManager = TabManager;

console.log('✅ QRBoost Pro - Utils loaded successfully');