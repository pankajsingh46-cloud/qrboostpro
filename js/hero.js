// ========== INITIALIZE ==========

let heroInstance = null;
let heroParticles = null;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Hero Parallax & Mouse tracking
  heroInstance = new HeroSection();
  
  // 2. Initialize Stats Counters
  new HeroCounters();
  
  // 3. Activate Premium Particle System
  const particleContainer = document.querySelector('.hero__particles');
  if (particleContainer) {
    heroParticles = new ParticleSystem(particleContainer, {
      count: 45,
      color: 'rgba(124, 58, 237, 0.4)', // Fits the lavender/purple theme perfectly
      speed: 0.3,
      minSize: 2,
      maxSize: 5
    });
  }

  // 4. Activate Text Reveal Animation for main headline
  const titleLines = document.querySelectorAll('.hero__title-text');
  titleLines.forEach((line, index) => {
    // Reveal line by line with delay
    new TextRevealAnimation(line, {
      delay: 200 + (index * 150),
      splitBy: 'words',
      duration: 800
    });
  });

  // 5. Activate Water Ripple Effect on Buttons
  const rippleBtns = document.querySelectorAll('[data-ripple]');
  rippleBtns.forEach(btn => {
    // Fallback safety check to make sure RippleEffect exists in utils.js
    if (typeof RippleEffect !== 'undefined') {
      new RippleEffect(btn, { color: 'rgba(255, 255, 255, 0.3)', duration: 600 });
    }
  });
  
  console.log('✅ Phase 1: Hero & Header module completely initialized with Premium Effects');
});

// Export
window.HeroSection = HeroSection;
window.TextRevealAnimation = TextRevealAnimation;
window.HeroCounters = HeroCounters;
window.ParticleSystem = ParticleSystem;
window.heroInstance = heroInstance;