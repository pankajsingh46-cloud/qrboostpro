/* ============================================
   QRBoost Pro - Header Module
   ============================================ */

'use strict';

class Header {
  constructor(options = {}) {
    this.header = document.querySelector('.header');
    if (!this.header) return;

    this.options = {
      scrollThreshold: 50,
      hideOnScroll: false,
      shrinkOnScroll: true,
      solidOnScroll: true,
      ...options
    };

    // State
    this.lastScrollY = 0;
    this.ticking = false;
    this.isOpen = false;

    // Elements
    this.hamburger = this.header.querySelector('.header__hamburger');
    this.mobileMenu = this.header.querySelector('.header__mobile-menu');
    this.progressBar = this.header.querySelector('.header__progress');
    this.mobileLinks = this.header.querySelectorAll('.header__mobile-link');

    this.init();
  }

  init() {
    this.bindEvents();
    this.checkScrollPosition();
    this.initMagneticButtons();
    
    // Add loaded class for entrance animation
    requestAnimationFrame(() => {
      this.header.classList.add('is-loaded');
    });
  }

  bindEvents() {
    // Scroll event with throttling
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.onScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });

    // Hamburger click
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Mobile link clicks
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu on resize
    window.addEventListener('resize', Utils.debounce(() => {
      if (window.innerWidth > 1024 && this.isOpen) {
        this.closeMenu();
      }
    }, 150));
  }

  onScroll() {
    const scrollY = window.pageYOffset;
    const { scrollThreshold, hideOnScroll, shrinkOnScroll, solidOnScroll } = this.options;

    // Update progress bar
    this.updateProgressBar();

    // Shrink effect
    if (shrinkOnScroll) {
      this.header.classList.toggle('header--shrink', scrollY > scrollThreshold);
    }

    // Solid background effect
    if (solidOnScroll) {
      this.header.classList.toggle('header--solid', scrollY > scrollThreshold);
      this.header.classList.toggle('header--glass', scrollY <= scrollThreshold);
    }

    // Hide on scroll down, show on scroll up
    if (hideOnScroll && scrollY > this.lastScrollY && scrollY > scrollThreshold * 2) {
      this.header.classList.add('header--hidden');
    } else {
      this.header.classList.remove('header--hidden');
    }

    this.lastScrollY = scrollY;
  }

  checkScrollPosition() {
    // Initial check
    this.onScroll();
  }

  updateProgressBar() {
    if (!this.progressBar) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    
    this.progressBar.style.width = `${Math.min(progress, 100)}%`;
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    this.isOpen = true;
    this.hamburger?.classList.add('is-active');
    this.mobileMenu?.classList.add('is-open');
    this.header.classList.add('header--menu-open');
    
    // Prevent body scroll
    Utils.lockScroll();
    
    // Add overlay click handler
    this.mobileMenu?.addEventListener('click', this.onOverlayClick.bind(this));
  }

  closeMenu() {
    this.isOpen = false;
    this.hamburger?.classList.remove('is-active');
    this.mobileMenu?.classList.remove('is-open');
    this.header.classList.remove('header--menu-open');
    
    // Restore body scroll
    Utils.unlockScroll();
    
    // Remove overlay click handler
    this.mobileMenu?.removeEventListener('click', this.onOverlayClick.bind(this));
  }

  onOverlayClick(e) {
    if (e.target === this.mobileMenu) {
      this.closeMenu();
    }
  }

  initMagneticButtons() {
    // Add magnetic effect to primary CTA button
    const primaryBtn = this.header.querySelector('.header__btn--primary');
    if (primaryBtn && !Utils.isTouchDevice()) {
      new MagneticEffect(primaryBtn, { strength: 0.2 });
    }
  }

  // Public method to update header state
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
  }
}

// ========== DROPDOWN HOVER EFFECT ==========

class HeaderDropdown {
  constructor() {
    this.dropdowns = document.querySelectorAll('.header__nav-item--dropdown');
    this.init();
  }

  init() {
    this.dropdowns.forEach(item => {
      const link = item.querySelector('.header__nav-link');
      const dropdown = item.querySelector('.header__dropdown');

      if (!link || !dropdown) return;

      // Calculate position on hover
      item.addEventListener('mouseenter', () => {
        this.positionDropdown(dropdown);
      });
    });
  }

  positionDropdown(dropdown) {
    const rect = dropdown.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // Adjust if dropdown goes off screen
    if (rect.right > windowWidth - 20) {
      dropdown.style.left = 'auto';
      dropdown.style.right = '0';
      dropdown.style.transform = 'translateY(10px)';
    }
  }
}

// ========== ACTIVE LINK TRACKER ==========

class ActiveLinkTracker {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
    this.init();
  }

  init() {
    if (!this.sections.length || !this.navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.setActiveLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
      }
    );

    this.sections.forEach(section => observer.observe(section));
  }

  setActiveLink(sectionId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('is-active', href === sectionId);
    });
  }
}

// ========== INITIALIZE ==========

let headerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  headerInstance = new Header({
    scrollThreshold: 50,
    hideOnScroll: false,
    shrinkOnScroll: true,
    solidOnScroll: true
  });

  new HeaderDropdown();
  new ActiveLinkTracker();
  
  console.log('✅ Header module initialized');
});

// Export for external use
window.Header = Header;
window.headerInstance = headerInstance;