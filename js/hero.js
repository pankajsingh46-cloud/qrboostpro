/* ============================================
   QRBoost Pro - Hero Module
   ============================================ */

'use strict';

class HeroSection {
  constructor(options = {}) {
    this.hero = document.querySelector('.hero');
    if (!this.hero) return;

    this.options = {
      parallaxStrength: 0.03,
      mouseParallax: true,
      scrollParallax: true,
      ...options
    };

    // Elements
    this.shapes = this.hero.querySelectorAll('.hero__shape');
    this.parallaxContainer = this.hero.querySelector('.hero__parallax');
    this.gradient = this.hero.querySelector('.hero__gradient');
    this.content = this.hero.querySelector('.hero__content');
    this.scrollIndicator = this.hero.querySelector('.hero__scroll');
    this.magneticButtons = this.hero.querySelectorAll('.hero__btn--primary');

    // State
    this.mouseX = 0;
    this.mouseY = 0;
    this.scrollY = 0;
    this.rafId = null;

    this.init();
  }

  init() {
    this.bindEvents();
    this.initMagneticButtons();
    this.initScrollIndicator();
    this.initTypewriter();
    this.startAnimationLoop();
    
    console.log('✅ Hero section initialized');
  }

  bindEvents() {
    // Mouse move for parallax
    if (this.options.mouseParallax) {
      document.addEventListener('mousemove', Utils.throttle((e) => {
        this.onMouseMove(e);
      }, 16));
    }

    // Scroll for parallax
    if (this.options.scrollParallax) {
      window.addEventListener('scroll', Utils.rafThrottle(() => {
        this.onScroll();
      }), { passive: true });
    }

    // Resize
    window.addEventListener('resize', Utils.debounce(() => {
      this.onResize();
    }, 150));

    // Visibility change (pause animations when hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  onMouseMove(e) {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalize to -1 to 1
    this.mouseX = (clientX / innerWidth - 0.5) * 2;
    this.mouseY = (clientY / innerHeight - 0.5) * 2;
  }

  onScroll() {
    this.scrollY = window.pageYOffset;
  }

  onResize() {
    // Recalculate positions if needed
  }

  startAnimationLoop() {
    const animate = () => {
      this.updateParallax();
      this.rafId = requestAnimationFrame(animate);
    };
    animate();
  }

  updateParallax() {
    const { parallaxStrength, mouseParallax, scrollParallax } = this.options;
    
    // Calculate transforms
    let translateX = 0;
    let translateY = 0;

    // Mouse parallax
    if (mouseParallax) {
      translateX = this.mouseX * 30 * parallaxStrength * 100;
      translateY = this.mouseY * 30 * parallaxStrength * 100;
    }

    // Scroll parallax
    if (scrollParallax) {
      translateY += this.scrollY * 0.3;
    }

    // Apply to gradient
    if (this.gradient) {
      this.gradient.style.transform = `translate(${translateX}px, ${translateY}px)`;
    }

    // Apply to individual shapes with different strengths
    this.shapes.forEach((shape, index) => {
      const strength = (index + 1) * 0.5;
      const shapeTranslateX = this.mouseX * 20 * strength;
      const shapeTranslateY = this.mouseY * 20 * strength;
      
      if (!shape.classList.contains('hero__shape--geo')) {
        shape.style.transform = `translate(${shapeTranslateX}px, ${shapeTranslateY}px)`;
      }
    });
  }

  pauseAnimations() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resumeAnimations() {
    if (!this.rafId) {
      this.startAnimationLoop();
    }
  }

  initMagneticButtons() {
    if (Utils.isTouchDevice()) return;

    this.magneticButtons.forEach(btn => {
      new MagneticEffect(btn, { 
        strength: 0.3,
        radius: 80
      });
    });
  }

  initScrollIndicator() {
    if (!this.scrollIndicator) return;

    this.scrollIndicator.addEventListener('click', () => {
      const nextSection = this.hero.nextElementSibling;
      if (nextSection) {
        Utils.ScrollUtils.toElement(nextSection, 80);
      }
    });

    // Hide scroll indicator after scrolling
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.pageYOffset > 100) {
        this.scrollIndicator.style.opacity = '0';
        this.scrollIndicator.style.pointerEvents = 'none';
      } else {
        this.scrollIndicator.style.opacity = '1';
        this.scrollIndicator.style.pointerEvents = 'auto';
      }
    }, 100));
  }

  initTypewriter() {
    const typewriterElement = this.hero.querySelector('[data-typewriter]');
    if (!typewriterElement) return;

    new TypeWriter(typewriterElement, {
      strings: JSON.parse(typewriterElement.dataset.strings || '[]'),
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2500,
      loop: true
    });
  }
}

// ========== TEXT REVEAL ANIMATION ==========

class TextRevealAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      delay: 0,
      duration: 800,
      splitBy: 'words', // 'words', 'chars', 'lines'
      ...options
    };
    this.init();
  }

  init() {
    this.splitText();
    this.animate();
  }

  splitText() {
    const text = this.element.textContent;
    this.element.textContent = '';

    if (this.options.splitBy === 'chars') {
      text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'text-reveal-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(100%)';
        this.element.appendChild(span);
      });
    } else if (this.options.splitBy === 'words') {
      text.split(' ').forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'text-reveal-word';
        span.textContent = word;
        span.style.display = 'inline-block';
        span.style.overflow = 'hidden';
        
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.style.opacity = '0';
        inner.style.transform = 'translateY(100%)';
        inner.textContent = word;
        
        span.appendChild(inner);
        this.element.appendChild(span);
        
        if (i < text.split(' ').length - 1) {
          this.element.appendChild(document.createTextNode(' '));
        }
      });
    }
  }

  animate() {
    const { delay, duration } = this.options;
    const items = this.element.querySelectorAll('.text-reveal-char, .text-reveal-word > span');

    items.forEach((item, index) => {
      setTimeout(() => {
        item.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, delay + index * 30);
    });
  }
}

// ========== COUNTER ANIMATION FOR TRUST INDICATORS ==========

class HeroCounters {
  constructor() {
    this.counters = document.querySelectorAll('.hero__trust-number[data-value]');
    if (!this.counters.length) return;
    
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const counter = new CounterAnimation(element, {
      duration: 2000,
      easing: 'easeOutExpo'
    });
    counter.start();
  }
}

// ========== PARTICLE SYSTEM (Optional Enhancement) ==========

class ParticleSystem {
  constructor(container, options = {}) {
    this.container = container;
    if (!this.container) return;

    this.options = {
      count: 30,
      color: 'rgba(0, 102, 255, 0.3)',
      minSize: 2,
      maxSize: 6,
      speed: 0.5,
      ...options
    };

    this.particles = [];
    this.init();
  }

  init() {
    this.createParticles();
    this.animate();
  }

  createParticles() {
    const { count, color, minSize, maxSize } = this.options;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * (maxSize - minSize) + minSize;

      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        pointer-events: none;
        opacity: ${Math.random() * 0.5 + 0.2};
      `;

      this.particles.push({
        element: particle,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * this.options.speed,
        vy: (Math.random() - 0.5) * this.options.speed
      });

      this.container.appendChild(particle);
    }
  }

  animate() {
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = 100;
      if (p.x > 100) p.x = 0;
      if (p.y < 0) p.y = 100;
      if (p.y > 100) p.y = 0;

      p.element.style.left = `${p.x}%`;
      p.element.style.top = `${p.y}%`;
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ========== INITIALIZE ==========

let heroInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  heroInstance = new HeroSection();
  new HeroCounters();
  
  console.log('✅ Hero module initialized');
});

// Export
window.HeroSection = HeroSection;
window.TextRevealAnimation = TextRevealAnimation;
window.HeroCounters = HeroCounters;
window.heroInstance = heroInstance;