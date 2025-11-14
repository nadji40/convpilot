/**
 * Header Scroll Effect
 * Adds a glass effect and border to the header when scrolling
 * Uses brand color #0a7cff for the border
 */

(function() {
  'use strict';

  // Configuration
  const SCROLL_THRESHOLD = 50; // Pixels to scroll before effect triggers
  const THROTTLE_DELAY = 16; // ~60fps

  let lastScrollY = 0;
  let ticking = false;

  /**
   * Initialize the header scroll effect
   */
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) {
      console.warn('Header element not found');
      return;
    }

    // Check scroll position on load
    checkScroll();

    // Listen for scroll events with throttling for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Listen for resize events (might affect scroll position)
    window.addEventListener('resize', handleScroll, { passive: true });
  }

  /**
   * Handle scroll event with throttling
   */
  function handleScroll() {
    lastScrollY = window.scrollY || window.pageYOffset;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkScroll();
        ticking = false;
      });
      
      ticking = true;
    }
  }

  /**
   * Check scroll position and update header class
   */
  function checkScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;

    if (lastScrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderScroll);
  } else {
    initHeaderScroll();
  }

  // Export functions to global scope for reuse
  window.headerScroll = {
    init: initHeaderScroll,
    checkScroll: checkScroll
  };

})();

