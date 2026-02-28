/* ============================================
   QRBoost Pro - Header Module
   ============================================ */
'use strict';

class Header {
  constructor() {
    this.header = document.querySelector('.header');
    this.hamburger = document.querySelector('.header__hamburger');
    this.mobileMenu = document.querySelector('.header__mobile-menu');
    this.mobileLinks = document.querySelectorAll('.header__mobile-link');
    this.isOpen = false;
    if (!this.header) return;
    this.init();
  }

  init() {
    // Scroll Shrink & Glass effect
    window.addEventListener('scroll', Utils.rafThrottle(() => {
      const isScrolled = window.pageYOffset > 50;
      this.header.classList.toggle('header--shrink', isScrolled);
      this.header.classList.toggle('header--solid', isScrolled);
      this.header.classList.toggle('header--glass', !isScrolled);
    }));

    // Hamburger Menu
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu on link click
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => { if (this.isOpen) this.toggleMenu(); });
    });
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('is-active', this.isOpen);
    this.mobileMenu.classList.toggle('is-open', this.isOpen);
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }
}

document.addEventListener('DOMContentLoaded', () => new Header());