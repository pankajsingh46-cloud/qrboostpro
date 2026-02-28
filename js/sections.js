/* ============================================
   QRBoost Pro - Sections Module (Premium Features Activated)
   ============================================ */

'use strict';

// ============================================
// 1. PROBLEMS SECTION (Flashlight Glow & 3D Tilt)
// ============================================
class ProblemsSection {
  constructor() {
    this.section = document.querySelector('.problems');
    if (!this.section) return;
    this.cards = this.section.querySelectorAll('.problems__card');
    this.init();
  }

  init() {
    this.init3DEffect();
  }

  init3DEffect() {
    this.cards.forEach(card => {
      // Mouse aane par 3D rotate
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Intensity of 3D effect (Boss demanded stronger effect)
        const rotateX = ((y - centerY) / centerY) * -12; 
        const rotateY = ((x - centerX) / centerX) * 12;
        
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      // Mouse hatne par reset
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
      });
    });
  }
}

// ============================================
// 2. FEATURES SECTION (Viewport Stagger Reveal)
// ============================================
class FeaturesSection {
  constructor() {
    this.cards = document.querySelectorAll('.feature-card');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const delay = parseInt(card.dataset.delay || 0) * 150; // Delay for wave effect
          
          setTimeout(() => {
            card.classList.add('is-visible');
          }, delay);
          observer.unobserve(card); // Sirf ek baar animate hoga
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    this.cards.forEach(card => observer.observe(card));
  }
}

// ============================================
// 3. PROCESS TIMELINE (Scroll Auto-Fill Line)
// ============================================
class ProcessTimeline {
  constructor() {
    this.section = document.querySelector('.process');
    this.timeline = document.querySelector('.process__timeline');
    this.lineProgress = document.querySelector('.process__line-progress');
    this.steps = document.querySelectorAll('.process__step');
    if (!this.section || !this.timeline) return;
    this.init();
  }

  init() {
    window.addEventListener('scroll', Utils.rafThrottle(() => this.updateProgress()));
    this.updateProgress(); // Initial check on load
  }

  updateProgress() {
    const rect = this.timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate scroll percentage for the line
    const startTrigger = windowHeight * 0.6; 
    const distance = startTrigger - rect.top;
    
    let progress = (distance / rect.height) * 100;
    progress = Math.max(0, Math.min(100, progress)); // Clamp 0 to 100
    
    if(this.lineProgress) {
      this.lineProgress.style.height = `${progress}%`;
    }

    // Highlight steps
    this.steps.forEach((step, index) => {
      const stepTrigger = (index / (this.steps.length - 1)) * 100;
      if (progress >= stepTrigger - 5) {
        step.classList.add('is-active', 'is-visible');
        if (progress > stepTrigger + 10) step.classList.add('is-complete');
      } else {
        step.classList.remove('is-active', 'is-complete');
      }
    });
  }
}

// ============================================
// 4. DASHBOARD MOCKUP (Alive Counters & Tabs)
// ============================================
class DashboardMockup {
  constructor() {
    this.section = document.querySelector('.dashboard');
    this.bars = document.querySelectorAll('.dashboard__chart-bar');
    this.tabs = document.querySelectorAll('.dashboard__card-tab');
    this.counters = document.querySelectorAll('.dashboard__stat-value[data-count]');
    if (!this.section) return;
    this.init();
  }

  init() {
    // 1. Observer to animate when scrolled into view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateCounters();
        this.animateBars();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(this.section);

    // 2. Tab Switch Logic (Randomize chart data to look alive)
    this.tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        this.tabs.forEach(t => t.classList.remove('is-active'));
        e.target.classList.add('is-active');
        this.randomizeBars();
      });
    });
  }

  animateCounters() {
    this.counters.forEach(counter => {
      if (typeof CounterAnimation !== 'undefined') {
        new CounterAnimation(counter, { duration: 2500 }).start();
      }
    });
  }

  animateBars() {
    this.bars.forEach((bar, index) => {
      setTimeout(() => bar.classList.add('is-visible'), index * 100);
    });
  }

  randomizeBars() {
    this.bars.forEach(bar => {
      bar.style.transform = 'scaleY(0)'; // Drop down
      setTimeout(() => {
        const randomHeight = Math.floor(Math.random() * 60) + 30; // 30% to 90%
        bar.style.height = `${randomHeight}%`;
        bar.style.transform = 'scaleY(1)'; // Rise up
      }, 300);
    });
  }
}

// ============================================
// 5. PRICING SECTION (Smooth Toggle)
// ============================================
class PricingSection {
  constructor() {
    this.toggle = document.querySelector('.pricing__toggle');
    this.amounts = document.querySelectorAll('.pricing__amount');
    if (!this.toggle) return;
    this.isYearly = false;
    // Base pricing data
    this.prices = { starter: { monthly: 0, yearly: 0 }, pro: { monthly: 29, yearly: 24 } };
    this.init();
  }

  init() {
    this.toggle.addEventListener('click', () => {
      this.isYearly = !this.isYearly;
      this.toggle.classList.toggle('is-yearly', this.isYearly);
      
      document.querySelector('[data-period="monthly"]').classList.toggle('is-active', !this.isYearly);
      document.querySelector('[data-period="yearly"]').classList.toggle('is-active', this.isYearly);

      // Animate amount change
      this.amounts.forEach(amount => {
        const plan = amount.dataset.plan;
        if (!plan) return;
        
        amount.style.opacity = '0';
        amount.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
          amount.textContent = this.isYearly ? this.prices[plan].yearly : this.prices[plan].monthly;
          amount.style.opacity = '1';
          amount.style.transform = 'scale(1)';
        }, 200);
      });
    });
  }
}

// ============================================
// 6. TESTIMONIALS (Premium 3D Stacked Slider)
// ============================================
class TestimonialsSlider {
  constructor() {
    this.slider = document.querySelector('.testimonials__slider');
    this.cards = document.querySelectorAll('.testimonial-card');
    if (!this.slider || this.cards.length === 0) return;
    
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.updateStack();
    
    // Auto Play
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      this.updateStack();
    }, 4000);
  }

  updateStack() {
    this.cards.forEach((card, index) => {
      // Card transition styles for smooth swap
      card.style.position = 'absolute';
      card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.width = '100%';
      card.style.maxWidth = '500px';
      card.style.left = '50%';
      card.style.marginLeft = '-250px'; // Center align

      if (index === this.currentIndex) {
        // Active Card (Front)
        card.style.transform = 'translateX(0) scale(1) translateY(0)';
        card.style.opacity = '1';
        card.style.zIndex = '10';
        card.style.filter = 'blur(0px)';
      } else if (index === (this.currentIndex + 1) % this.cards.length) {
        // Next Card (Behind & Right)
        card.style.transform = 'translateX(40px) scale(0.9) translateY(20px)';
        card.style.opacity = '0.6';
        card.style.zIndex = '5';
        card.style.filter = 'blur(2px)';
      } else {
        // Hidden / Previous Card (Behind & Left)
        card.style.transform = 'translateX(-40px) scale(0.8) translateY(40px)';
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.filter = 'blur(4px)';
      }
    });
  }
}

// ============================================
// 7. FOOTER & GLOBAL ANIMATIONS
// ============================================
class GlobalInteractions {
  constructor() {
    this.initBackToTop();
    this.initScrollAnimations();
    this.initCurrentYear();
  }

  initBackToTop() {
    const btn = document.querySelector('.footer__back-to-top');
    if (!btn) return;
    
    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.pageYOffset > 500) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }, 100));

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  initScrollAnimations() {
    const scrollElements = document.querySelectorAll('[data-animate]');
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollObserver.unobserve(entry.target); // Trigger once
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    scrollElements.forEach(el => scrollObserver.observe(el));
  }

  initCurrentYear() {
    const yearEl = document.querySelector('[data-year]');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }
}

// ============================================
// INITIALIZATION MASTER BLOCK
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  new ProblemsSection();
  new FeaturesSection();
  new ProcessTimeline();
  new DashboardMockup();
  new PricingSection();
  new TestimonialsSlider();
  new GlobalInteractions();

  console.log('✅ ALL SECTIONS: 3D Interactions, Scroll Events & Sliders Activated!');
});
// ============================================
// 8. PAGE LOADER (FIX FOR STUCK SPINNER)
// ============================================
class PageLoader {
  constructor() {
    this.loader = document.querySelector('.page-loading');
    if (!this.loader) return;
    this.init();
  }

  init() {
    // Window load hone par loader hide karo
    window.addEventListener('load', () => {
      setTimeout(() => this.hideLoader(), 300);
    });
    
    // Fallback: Agar kisi wajah se window load event miss ho jaye, toh 2 sec baad hata do
    setTimeout(() => this.hideLoader(), 2000);
  }

  hideLoader() {
    this.loader.classList.add('is-hidden');
    setTimeout(() => this.loader.remove(), 500);
  }
}

// Initialize Page Loader
document.addEventListener('DOMContentLoaded', () => {
  new PageLoader();
});