/* ============================================
   QRBoost Pro - Sections Module (Unified)
   ============================================ */

'use strict';

// ============================================
// PROBLEMS SECTION - Horizontal Scroll + 3D Cards
// ============================================

class ProblemsSection {
  constructor(options = {}) {
    this.section = document.querySelector('.problems');
    if (!this.section) return;

    this.options = {
      cardSelector: '.problems__card',
      scrollSelector: '.problems__scroll',
      navPrevSelector: '.problems__nav-btn--prev',
      navNextSelector: '.problems__nav-btn--next',
      dotSelector: '.problems__nav-dot',
      rotateIntensity: 10,
      ...options
    };

    // Elements
    this.scroll = this.section.querySelector(this.options.scrollSelector);
    this.cards = this.section.querySelectorAll(this.options.cardSelector);
    this.prevBtn = this.section.querySelector(this.options.navPrevSelector);
    this.nextBtn = this.section.querySelector(this.options.navNextSelector);
    this.dots = this.section.querySelectorAll(this.options.dotSelector);

    // State
    this.currentIndex = 0;
    this.cardWidth = 0;
    this.scrollPosition = 0;

    this.init();
  }

  init() {
    this.calculateDimensions();
    this.bindEvents();
    this.init3DEffect();
    this.updateNavigation();
    
    console.log('✅ Problems section initialized');
  }

  calculateDimensions() {
    if (this.cards.length > 0) {
      const card = this.cards[0];
      const style = getComputedStyle(card);
      const gap = parseInt(getComputedStyle(this.scroll).gap) || 24;
      this.cardWidth = card.offsetWidth + gap;
    }
  }

  bindEvents() {
    // Navigation buttons
    this.prevBtn?.addEventListener('click', () => this.scrollPrev());
    this.nextBtn?.addEventListener('click', () => this.scrollNext());

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.scrollToIndex(index));
    });

    // Scroll tracking
    this.scroll?.addEventListener('scroll', Utils.throttle(() => {
      this.onScroll();
    }, 50));

    // Resize
    window.addEventListener('resize', Utils.debounce(() => {
      this.calculateDimensions();
      this.updateNavigation();
    }, 200));

    // Keyboard navigation
    this.section.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.scrollPrev();
      if (e.key === 'ArrowRight') this.scrollNext();
    });
  }

  init3DEffect() {
    const { rotateIntensity } = this.options;

    this.cards.forEach(card => {
      // Mouse move for 3D rotation
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -rotateIntensity;
        const rotateY = ((x - centerX) / centerX) * rotateIntensity;
        
        // Update CSS custom properties
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      // Reset on mouse leave
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
      });
    });
  }

  onScroll() {
    const scrollLeft = this.scroll.scrollLeft;
    const maxScroll = this.scroll.scrollWidth - this.scroll.clientWidth;
    
    // Calculate current index
    this.currentIndex = Math.round(scrollLeft / this.cardWidth);
    
    // Update dots
    this.updateDots();
    
    // Update buttons
    this.updateNavigation();
  }

  scrollPrev() {
    if (this.currentIndex > 0) {
      this.scrollToIndex(this.currentIndex - 1);
    }
  }

  scrollNext() {
    if (this.currentIndex < this.cards.length - 1) {
      this.scrollToIndex(this.currentIndex + 1);
    }
  }

  scrollToIndex(index) {
    if (!this.scroll || index < 0 || index >= this.cards.length) return;
    
    const scrollPosition = index * this.cardWidth;
    this.scroll.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    
    this.currentIndex = index;
  }

  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === this.currentIndex);
    });
  }

  updateNavigation() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.cards.length - 1;
    }
  }
}

// ============================================
// FEATURES SECTION - Grid with Viewport Animations
// ============================================

class FeaturesSection {
  constructor(options = {}) {
    this.section = document.querySelector('.features');
    if (!this.section) return;

    this.options = {
      cardSelector: '.feature-card',
      staggerDelay: 100,
      threshold: 0.15,
      ...options
    };

    // Elements
    this.cards = this.section.querySelectorAll(this.options.cardSelector);

    this.init();
  }

  init() {
    this.initScrollAnimations();
    this.initHoverEffects();
    
    console.log('✅ Features section initialized');
  }

  initScrollAnimations() {
    const { staggerDelay, threshold } = this.options;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add staggered delay
          const card = entry.target;
          const delay = parseInt(card.dataset.delay || index) * staggerDelay;
          
          setTimeout(() => {
            card.classList.add('is-visible');
          }, delay);
          
          observer.unobserve(card);
        }
      });
    }, {
      threshold,
      rootMargin: '0px 0px -50px 0px'
    });

    this.cards.forEach((card, index) => {
      // Set delay attribute if not present
      if (!card.dataset.delay) {
        card.dataset.delay = index;
      }
      observer.observe(card);
    });
  }

  initHoverEffects() {
    this.cards.forEach(card => {
      const icon = card.querySelector('.feature-card__icon');
      if (!icon) return;

      // Add hover tracking for glow effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });
  }
}

// ============================================
// UNIVERSAL SECTION ANIMATIONS
// ============================================

class SectionAnimations {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.init();
  }

  init() {
    this.initSectionHeaders();
    this.initParallaxElements();
  }

  initSectionHeaders() {
    const headers = document.querySelectorAll('.problems__header, .features__header');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate children
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
              child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
            }, index * 100);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    headers.forEach(header => {
      header.style.opacity = '0';
      observer.observe(header);
    });
  }

  initParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (Utils.prefersReducedMotion()) return;

    window.addEventListener('scroll', Utils.rafThrottle(() => {
      const scrollY = window.pageYOffset;
      
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.5;
        const rect = el.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const offset = (scrollY - el.offsetTop) * speed;
          el.style.transform = `translateY(${offset}px)`;
        }
      });
    }));
  }
}

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================

class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('[data-counter]');
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
    const value = parseFloat(element.dataset.counter);
    const suffix = element.dataset.suffix || '';
    const prefix = element.dataset.prefix || '';
    const decimals = parseInt(element.dataset.decimals) || 0;
    const duration = parseInt(element.dataset.duration) || 2000;

    const counter = new CounterAnimation(element, {
      end: value,
      prefix,
      suffix,
      decimals,
      duration
    });
    
    counter.start();
  }
}

// ============================================
// PROCESS TIMELINE - Scroll Tracking
// ============================================

class ProcessTimeline {
  constructor(options = {}) {
    this.section = document.querySelector('.process');
    if (!this.section) return;

    this.options = {
      stepSelector: '.process__step',
      lineSelector: '.process__line-progress',
      threshold: 0.5,
      ...options
    };

    // Elements
    this.steps = this.section.querySelectorAll(this.options.stepSelector);
    this.lineProgress = this.section.querySelector(this.options.lineSelector);
    this.timeline = this.section.querySelector('.process__timeline');

    // State
    this.currentStep = 0;
    this.isVisible = false;

    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.setupStepObserver();
    this.bindScrollEvents();
    
    console.log('✅ Process timeline initialized');
  }

  setupScrollObserver() {
    // Observe when section enters viewport
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    sectionObserver.observe(this.section);
  }

  setupStepObserver() {
    const { threshold } = this.options;

    // Create observer for each step
    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const step = entry.target;
        const stepIndex = parseInt(step.dataset.step) || 0;

        if (entry.isIntersecting) {
          // Mark as visible
          step.classList.add('is-visible');
          
          // Update active state
          this.updateActiveStep(stepIndex);
        }
      });
    }, {
      threshold,
      rootMargin: '-10% 0px -10% 0px'
    });

    this.steps.forEach((step, index) => {
      step.dataset.step = index;
      stepObserver.observe(step);
    });
  }

  bindScrollEvents() {
    // Update line progress on scroll
    window.addEventListener('scroll', Utils.throttle(() => {
      if (this.isVisible) {
        this.updateLineProgress();
      }
    }, 16));
  }

  updateActiveStep(activeIndex) {
    this.steps.forEach((step, index) => {
      // Remove all states
      step.classList.remove('is-active', 'is-complete');
      
      if (index < activeIndex) {
        // Completed steps
        step.classList.add('is-complete');
      } else if (index === activeIndex) {
        // Current active step
        step.classList.add('is-active');
      }
    });

    this.currentStep = activeIndex;
  }

  updateLineProgress() {
    if (!this.lineProgress || !this.timeline) return;

    const timelineRect = this.timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the timeline is visible
    const timelineTop = timelineRect.top;
    const timelineHeight = timelineRect.height;
    
    // Progress calculation
    let progress = 0;
    
    if (timelineTop < windowHeight) {
      const visibleAmount = Math.min(windowHeight - timelineTop, timelineHeight);
      progress = (visibleAmount / timelineHeight) * 100;
    }
    
    // Clamp progress
    progress = Math.max(0, Math.min(100, progress));
    
    this.lineProgress.style.height = `${progress}%`;
  }
}

// ============================================
// DASHBOARD MOCKUP
// ============================================

class DashboardMockup {
  constructor() {
    this.section = document.querySelector('.dashboard');
    if (!this.section) return;
    
    this.mockup = this.section.querySelector('.dashboard__mockup');
    this.chartBars = this.section.querySelectorAll('.dashboard__chart-bar');
    this.statValues = this.section.querySelectorAll('[data-stat]');
    this.tabs = this.section.querySelectorAll('.dashboard__card-tab');
    
    this.init();
  }
  
  init() {
    this.setupObserver();
    this.setupTabs();
    this.animateStats();
    console.log('✅ Dashboard mockup initialized');
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate chart bars
          setTimeout(() => {
            this.chartBars.forEach(bar => bar.classList.add('is-visible'));
          }, 300);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    
    if (this.mockup) {
      observer.observe(this.mockup);
    }
  }
  
  setupTabs() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const parent = tab.closest('.dashboard__card-tabs');
        parent.querySelectorAll('.dashboard__card-tab').forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        
        // Re-animate chart on tab change
        this.chartBars.forEach(bar => {
          bar.classList.remove('is-visible');
          setTimeout(() => bar.classList.add('is-visible'), 50);
        });
      });
    });
  }
  
  animateStats() {
    const stats = this.section.querySelectorAll('.dashboard__stat-value[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const count = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const prefix = el.dataset.prefix || '';
          
          this.countUp(el, count, prefix, suffix);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
  }
  
  countUp(element, target, prefix = '', suffix = '') {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      
      element.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// ============================================
// PRICING SECTION
// ============================================

class PricingSection {
  constructor() {
    this.section = document.querySelector('.pricing');
    if (!this.section) return;
    
    this.toggle = this.section.querySelector('.pricing__toggle');
    this.monthlyLabel = this.section.querySelector('[data-period="monthly"]');
    this.yearlyLabel = this.section.querySelector('[data-period="yearly"]');
    this.amounts = this.section.querySelectorAll('.pricing__amount');
    this.cards = this.section.querySelectorAll('.pricing__card');
    
    this.isYearly = false;
    this.prices = {
      starter: { monthly: 0, yearly: 0 },
      pro: { monthly: 29, yearly: 24 },
      enterprise: { monthly: 99, yearly: 79 }
    };
    
    this.init();
  }
  
  init() {
    this.setupToggle();
    this.setupObserver();
    console.log('✅ Pricing section initialized');
  }
  
  setupToggle() {
    if (!this.toggle) return;
    
    this.toggle.addEventListener('click', () => {
      this.isYearly = !this.isYearly;
      this.toggle.classList.toggle('is-yearly', this.isYearly);
      this.updateLabels();
      this.updatePrices();
    });
    
    // Label clicks
    this.monthlyLabel?.addEventListener('click', () => this.setPeriod(false));
    this.yearlyLabel?.addEventListener('click', () => this.setPeriod(true));
  }
  
  setPeriod(isYearly) {
    this.isYearly = isYearly;
    this.toggle.classList.toggle('is-yearly', isYearly);
    this.updateLabels();
    this.updatePrices();
  }
  
  updateLabels() {
    this.monthlyLabel?.classList.toggle('is-active', !this.isYearly);
    this.yearlyLabel?.classList.toggle('is-active', this.isYearly);
  }
  
  updatePrices() {
    this.amounts.forEach(amount => {
      const plan = amount.dataset.plan;
      const price = this.prices[plan];
      if (!price) return;
      
      const newPrice = this.isYearly ? price.yearly : price.monthly;
      
      // Animate price change
      amount.style.transform = 'scale(0.8)';
      amount.style.opacity = '0';
      
      setTimeout(() => {
        amount.textContent = newPrice;
        amount.style.transform = 'scale(1)';
        amount.style.opacity = '1';
      }, 150);
    });
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('is-visible');
            }, index * 150);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
    
    this.cards.forEach(card => observer.observe(card));
  }
}

// ============================================
// TESTIMONIALS SLIDER
// ============================================

class TestimonialsSlider {
  constructor() {
    this.section = document.querySelector('.testimonials');
    if (!this.section) return;
    
    this.slider = this.section.querySelector('.testimonials__slider');
    this.cards = this.section.querySelectorAll('.testimonial-card');
    this.prevBtn = this.section.querySelector('.testimonials__nav-btn--prev');
    this.nextBtn = this.section.querySelector('.testimonials__nav-btn--next');
    this.dots = this.section.querySelectorAll('.testimonials__dot');
    
    this.currentIndex = 0;
    this.cardsPerView = this.getCardsPerView();
    this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
    this.isDragging = false;
    this.startX = 0;
    this.scrollLeft = 0;
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  init() {
    this.setupNavigation();
    this.setupDrag();
    this.setupTouch();
    this.setupDots();
    this.startAutoPlay();
    this.setupObserver();
    
    window.addEventListener('resize', () => {
      this.cardsPerView = this.getCardsPerView();
      this.maxIndex = Math.max(0, this.cards.length - this.cardsPerView);
      this.goToSlide(Math.min(this.currentIndex, this.maxIndex));
    });
    
    console.log('✅ Testimonials slider initialized');
  }
  
  getCardsPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }
  
  setupNavigation() {
    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());
  }
  
  setupDrag() {
    if (!this.slider) return;
    
    this.slider.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.startX = e.pageX - this.slider.offsetLeft;
      this.scrollLeft = this.currentIndex;
      this.slider.style.cursor = 'grabbing';
      this.stopAutoPlay();
    });
    
    this.slider.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
    });
    
    this.slider.addEventListener('mouseup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.slider.style.cursor = 'grab';
      
      const x = e.pageX - this.slider.offsetLeft;
      const diff = this.startX - x;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      this.startAutoPlay();
    });
    
    this.slider.addEventListener('mouseleave', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.slider.style.cursor = 'grab';
      }
    });
  }
  
  setupTouch() {
    if (!this.slider) return;
    
    let touchStartX = 0;
    
    this.slider.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      this.stopAutoPlay();
    }, { passive: true });
    
    this.slider.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
      
      this.startAutoPlay();
    }, { passive: true });
  }
  
  setupDots() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
  }
  
  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startAutoPlay();
        } else {
          this.stopAutoPlay();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.section);
  }
  
  prev() {
    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }
  
  next() {
    if (this.currentIndex < this.maxIndex) {
      this.goToSlide(this.currentIndex + 1);
    } else {
      this.goToSlide(0);
    }
  }
  
  goToSlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
    
    const cardWidth = this.cards[0]?.offsetWidth || 0;
    const gap = 24; // var(--space-6)
    const offset = this.currentIndex * (cardWidth + gap);
    
    this.slider.style.transform = `translateX(-${offset}px)`;
    
    this.updateDots();
    this.updateButtons();
  }
  
  updateDots() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === this.currentIndex);
    });
  }
  
  updateButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= this.maxIndex;
    }
  }
  
  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.next();
    }, 5000);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// ============================================
// CTA SECTION
// ============================================

class CTASection {
  constructor() {
    this.section = document.querySelector('.cta');
    if (!this.section) return;
    
    this.content = this.section.querySelector('.cta__content');
    this.buttons = this.section.querySelectorAll('.cta__btn');
    
    this.init();
  }
  
  init() {
    this.setupObserver();
    this.setupMagneticButtons();
    console.log('✅ CTA section initialized');
  }
  
  setupObserver() {
    if (!this.content) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          
          // Animate children
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '0';
              child.style.transform = 'translateY(20px)';
              
              requestAnimationFrame(() => {
                child.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
              });
            }, index * 100);
          });
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(this.content);
  }
  
  setupMagneticButtons() {
    if (Utils.isTouchDevice()) return;
    
    this.buttons.forEach(btn => {
      // Assuming MagneticEffect is defined elsewhere (e.g. hero.js or utils.js)
      if (typeof window.MagneticEffect !== 'undefined') {
        new window.MagneticEffect(btn, { strength: 0.2, radius: 100 });
      }
    });
  }
}

// ============================================
// FOOTER
// ============================================

class Footer {
  constructor() {
    this.footer = document.querySelector('.footer');
    this.backToTop = document.querySelector('.footer__back-to-top');
    this.newsletterForm = document.querySelector('.footer__newsletter-form');
    
    if (!this.footer) return;
    
    this.init();
  }
  
  init() {
    this.setupBackToTop();
    this.setupNewsletter();
    this.setCurrentYear();
    console.log('✅ Footer initialized');
  }
  
  setupBackToTop() {
    if (!this.backToTop) return;
    
    // Show/hide based on scroll
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.pageYOffset > 500) {
        this.backToTop.classList.add('is-visible');
      } else {
        this.backToTop.classList.remove('is-visible');
      }
    }, 100));
    
    // Click handler
    this.backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  setupNewsletter() {
    if (!this.newsletterForm) return;
    
    this.newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = this.newsletterForm.querySelector('input');
      const email = input.value.trim();
      
      if (email && this.validateEmail(email)) {
        // Show success (in real app, would send to server)
        input.value = '';
        this.showNotification('Thanks for subscribing!', 'success');
      } else {
        this.showNotification('Please enter a valid email', 'error');
      }
    });
  }
  
  validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 24px;
      padding: 12px 24px;
      background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
      color: white;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      transform: translateY(20px);
      opacity: 0;
      transition: transform 0.3s ease, opacity 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
      notification.style.transform = 'translateY(0)';
      notification.style.opacity = '1';
    });
    
    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateY(20px)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
  
  setCurrentYear() {
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }
}

// ============================================
// SCROLL ANIMATIONS CONTROLLER
// ============================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll('[data-animate]');
    if (!this.elements.length) return;
    
    this.init();
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => observer.observe(el));
    console.log('✅ Scroll animations initialized');
  }
}

// ============================================
// PAGE LOADER
// ============================================

class PageLoader {
  constructor() {
    this.loader = document.querySelector('.page-loading');
    if (!this.loader) return;
    
    this.init();
  }
  
  init() {
    // Hide loader when page is fully loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hideLoader();
      }, 500);
    });
    
    // Fallback - hide after 3 seconds even if not fully loaded
    setTimeout(() => {
      this.hideLoader();
    }, 3000);
  }
  
  hideLoader() {
    this.loader.classList.add('is-hidden');
    
    // Remove from DOM after transition
    setTimeout(() => {
      this.loader.remove();
    }, 500);
  }
}

// ============================================
// SMOOTH ANCHOR SCROLL
// ============================================

class SmoothAnchorScroll {
  constructor() {
    this.init();
  }
  
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        
        // Skip if just "#" or certain patterns
        if (href === '#' || href === '#login' || href === '#signup') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          
          const headerHeight = 80; // Account for fixed header
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }
}

// ============================================
// UNIFIED INITIALIZATION (RUNS ONCE)
// ============================================

let problemsInstance = null;
let featuresInstance = null;
let processTimelineInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  // Phase 2 Initialization
  problemsInstance = new ProblemsSection();
  featuresInstance = new FeaturesSection();
  new SectionAnimations();
  new StatsCounter();
  
  // Phase 3 Initialization
  processTimelineInstance = new ProcessTimeline();
  new DashboardMockup();
  new PricingSection();
  new TestimonialsSlider();
  
  // Phase 4 Initialization
  new CTASection();
  new Footer();
  new ScrollAnimations();
  new PageLoader();
  new SmoothAnchorScroll();
  
  console.log('🚀 QRBoost Pro - All Sections Ready!');
});

// ============================================
// EXPORTS TO WINDOW
// ============================================

window.ProblemsSection = ProblemsSection;
window.FeaturesSection = FeaturesSection;
window.problemsInstance = problemsInstance;
window.featuresInstance = featuresInstance;

window.ProcessTimeline = ProcessTimeline;
window.processTimelineInstance = processTimelineInstance;

window.DashboardMockup = DashboardMockup;
window.PricingSection = PricingSection;
window.TestimonialsSlider = TestimonialsSlider;

window.CTASection = CTASection;
window.Footer = Footer;
window.ScrollAnimations = ScrollAnimations;