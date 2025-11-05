/**
 * Global Page Loader
 * Displays a loading animation when pages load
 * Uses brand color #0a7cff
 */

(function() {
  'use strict';

  // Initialize loader on DOM content loaded
  function initPageLoader() {
    const loader = document.getElementById('page-loader');
    
    if (!loader) {
      console.warn('Page loader element not found');
      return;
    }

    // Show loader immediately
    loader.classList.remove('hidden');

    // Hide loader when page is fully loaded
    window.addEventListener('load', function() {
      hideLoader();
    });

    // Fallback: Hide loader after maximum time (10 seconds)
    setTimeout(function() {
      hideLoader();
    }, 10000);
  }

  // Function to hide the loader
  function hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('hidden');
      
      // Remove from DOM after transition completes
      setTimeout(function() {
        if (loader.classList.contains('hidden')) {
          loader.style.display = 'none';
        }
      }, 300); // Match the CSS transition duration
    }
  }

  // Function to show the loader (useful for dynamic content loading)
  function showLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.style.display = 'flex';
      setTimeout(function() {
        loader.classList.remove('hidden');
      }, 10);
    }
  }

  // Export functions to global scope for reuse
  window.pageLoader = {
    show: showLoader,
    hide: hideLoader
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageLoader);
  } else {
    initPageLoader();
  }

  // Handle navigation with links (SPA-like behavior)
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    
    // Check if it's an internal link that should trigger loader
    if (link && 
        link.href && 
        !link.href.startsWith('javascript:') && 
        !link.href.startsWith('#') &&
        !link.target &&
        !link.download &&
        link.hostname === window.location.hostname) {
      
      // Show loader before navigation
      showLoader();
    }
  });

})();

