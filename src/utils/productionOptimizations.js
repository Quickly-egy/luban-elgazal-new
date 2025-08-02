// Production optimizations for better performance

// Remove console logs in production
export const removeConsoleLogs = () => {
  if (process.env.NODE_ENV === 'production') {
    // Override console methods
    console.log = () => {};
    console.warn = () => {};
    console.error = () => {};
    console.info = () => {};
    console.debug = () => {};
  }
};

// Optimize bundle size
export const optimizeBundle = () => {
  // Remove unused CSS
  const unusedCSS = document.querySelectorAll('style[data-unused]');
  unusedCSS.forEach(style => style.remove());
  
  // Remove unused scripts
  const unusedScripts = document.querySelectorAll('script[data-unused]');
  unusedScripts.forEach(script => script.remove());
};

// Optimize images
export const optimizeImages = () => {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading="lazy" to images that don't have it
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Add decoding="async" for better performance
    if (!img.decoding) {
      img.decoding = 'async';
    }
  });
};

// Optimize fonts
export const optimizeFonts = () => {
  // Preload critical fonts
  const criticalFonts = [
    'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap'
  ];
  
  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    document.head.appendChild(link);
  });
};

// Optimize third-party scripts
export const optimizeThirdPartyScripts = () => {
  // Load non-critical scripts asynchronously
  const asyncScripts = [
    // Add any third-party scripts here
  ];
  
  asyncScripts.forEach(script => {
    const scriptElement = document.createElement('script');
    scriptElement.src = script;
    scriptElement.async = true;
    scriptElement.defer = true;
    document.head.appendChild(scriptElement);
  });
};

// Optimize CSS delivery
export const optimizeCSSDelivery = () => {
  // Inline critical CSS
  const criticalCSS = `
    /* Add critical CSS here */
    body { font-family: 'Cairo', sans-serif; }
    .app { min-height: 100vh; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalCSS;
  document.head.appendChild(style);
};

// Optimize service worker
export const optimizeServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  }
};

// Initialize all production optimizations
export const initProductionOptimizations = () => {
  removeConsoleLogs();
  optimizeBundle();
  optimizeImages();
  optimizeFonts();
  optimizeThirdPartyScripts();
  optimizeCSSDelivery();
  optimizeServiceWorker();
}; 