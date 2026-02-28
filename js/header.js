/* ============================================
   QRBoost Pro - Header Module (Premium Active)
   ============================================ */

'use strict';

class Header {
  constructor(options = {}) {
    this.header = document.querySelector('.header');
    if (!this.header) return;

    this.options = {
      scrollThreshold: 50,
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
    
    // Add loaded class for entrance animation
    requestAnimationFrame(() => {
      this.header.classList.add('is-loaded');
    });
  }

  bindEvents() {
    // Scroll event using requestAnimationFrame for smooth performance
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.checkScrollPosition();
          this.updateProgressBar();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });

    // Mobile Menu Toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when a link is clicked
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.toggleMobileMenu();
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.toggleMobileMenu();
      }
    });
  }

  checkScrollPosition() {
    const scrollY = window.pageYOffset;
    const isScrolled = scrollY > this.options.scrollThreshold;

    // Boss Requirement: Scroll Shrink & Solid Transition
    if (this.options.shrinkOnScroll) {
      this.header.classList.toggle('header--shrink', isScrolled);
    }

    if (this.options.solidOnScroll) {
      this.header.classList.toggle('header--solid', isScrolled);
      this.header.classList.toggle('header--glass', !isScrolled);
    }

    this.lastScrollY = scrollY;
  }

  updateProgressBar() {
    if (!this.progressBar) return;
    
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    this.progressBar.style.width = scrolled + '%';
  }

  toggleMobileMenu() {
    this.isOpen = !this.isOpen;
    
    // Toggle Animated Hamburger
    this.hamburger.classList.toggle('is-active', this.isOpen);
    this.hamburger.setAttribute('aria-expanded', this.isOpen);
    
    // Toggle Menu Visibility
    if (this.mobileMenu) {
      this.mobileMenu.classList.toggle('is-open', this.isOpen);
      this.mobileMenu.setAttribute('aria-hidden', !this.isOpen);
    }

    // Lock body scroll when menu is open
    if (this.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
}

// ========== ACTIVE LINK TRACKER ==========
// Ye scroll karne par automatically Navigation Links ko highlight karega
class ActiveLinkTracker {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.header__nav-link[href^="#"]');
    this.init();
  }

  init() {
    if (!this.sections.length || !this.navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActiveLink(entry.target.id);
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    });

    this.sections.forEach(section => observer.observe(section));
  }

  setActiveLink(sectionId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === sectionId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }
}

// ========== INITIALIZE ==========

let headerInstance = null;
let activeLinkTrackerInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  headerInstance = new Header();
  activeLinkTrackerInstance = new ActiveLinkTracker();
  
  console.log('✅ Header Module: Glassmorphism & Scroll Magic Activated!');
});

// Exports
window.Header = Header;
window.ActiveLinkTracker = ActiveLinkTracker;