import React, { useEffect, useState, useMemo, Suspense } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import useAuthStore from "./stores/authStore";
import useLocationStore from "./stores/locationStore";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ToastContainer } from "react-toastify";
import { preloadCache, cacheManager } from "./services/cachedAPI";
import "react-toastify/dist/ReactToastify.css";

// Lazy load components to reduce initial bundle size
const RoutesComponent = React.lazy(() => import("./routes/RoutesComponent"));
const GlobalLoader = React.lazy(() => import("./components/common/GlobalLoader"));

// Memoized ScrollToTop component to prevent unnecessary re-renders
const ScrollToTopOnRouteChange = React.memo(() => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [pathname]);

  return null;
});

ScrollToTopOnRouteChange.displayName = 'ScrollToTopOnRouteChange';

// Constants moved outside component to prevent recreation
const THIRTY_MINUTES = 30 * 60 * 1000;
const MIN_LOADING_TIME = 1500;
const FADE_OUT_DURATION = 800;
const PRELOAD_DELAY = 100;
const CLEANUP_DELAY = 1000;

// Main App Component
function App() {
  const shouldShowLoader = () => {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (!lastVisit || (now - parseInt(lastVisit)) > thirtyMinutes) {
      localStorage.setItem('lastVisit', now.toString());
      return true;
    }
    return false;
  };

  const [isLoading, setIsLoading] = useState(shouldShowLoader());
  const [fadeOut, setFadeOut] = useState(false);
  const [preloadStatus, setPreloadStatus] = useState({
    started: false,
    completed: false,
    failed: false
  });

  // Initialize auth store from localStorage
  useEffect(() => {
    const initializeAuth = useAuthStore.getState().initializeAuth;
    initializeAuth();
  }, []);

  // Initialize location detection
  useEffect(() => {
    const initializeLocation = async () => {
      console.log('🚀 Initializing location detection...');
      const locationState = useLocationStore.getState();
      
      try {
        await locationState.initializeLocation();
        console.log('✅ Location initialized successfully');
      } catch (error) {
        console.error('❌ Location initialization failed:', error);
      }
    };

    initializeLocation();
  }, []);

  // Preload essential cache data
  useEffect(() => {
    const preloadEssentialData = async () => {
      if (preloadStatus.started) return;
      
      setPreloadStatus(prev => ({ ...prev, started: true }));
      console.log('⚡ Starting essential data preload...');
      
      try {
        const results = await preloadCache.preloadEssentials();
        
        console.log('⚡ Preload completed:', results);
        setPreloadStatus(prev => ({ 
          ...prev, 
          completed: true,
          failed: !results.categories || !results.products
        }));
        
        if (results.categories && results.products) {
          console.log('✅ Essential data cached and ready!');
        } else {
          console.log('⚠️ Some essential data failed to preload, but app will continue normally');
        }
        
      } catch (error) {
        console.error('❌ Preload failed:', error);
        setPreloadStatus(prev => ({ 
          ...prev, 
          completed: true,
          failed: true
        }));
      }
    };

    const preloadTimer = setTimeout(preloadEssentialData, PRELOAD_DELAY);
    
    return () => clearTimeout(preloadTimer);
  }, [preloadStatus.started]);

  // Cache cleanup on app start
  useEffect(() => {
    const cleanupTimer = setTimeout(() => {
      console.log('🧹 Running cache cleanup...');
      cacheManager.cleanupExpired();
      
      if (import.meta.env.DEV) {
        const stats = cacheManager.getStats();
        console.log('📊 Cache stats:', stats);
      }
    }, CLEANUP_DELAY);

    return () => clearTimeout(cleanupTimer);
  }, []);

  // Loading management
  useEffect(() => {
    if (!isLoading) return;

    let isCancelled = false;
    const startTime = Date.now();

    const finishLoading = () => {
      if (isCancelled) return;
      
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
      
      setTimeout(() => {
        if (isCancelled) return;
        setFadeOut(true);
        
        setTimeout(() => {
          if (isCancelled) return;
          setIsLoading(false);
        }, FADE_OUT_DURATION);
      }, remainingTime);
    };

    if (document.readyState === 'complete') {
      finishLoading();
    } else {
      const handleLoad = () => finishLoading();
      window.addEventListener('load', handleLoad, { once: true });
      
      const fallbackTimer = setTimeout(finishLoading, 4000);
      
      return () => {
        isCancelled = true;
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }

    return () => {
      isCancelled = true;
    };
  }, [isLoading]);

  // Development tools (only in dev mode)
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    window.cacheManager = {
      stats: () => {
        const stats = cacheManager.getStats();
        console.log('📊 Cache stats:', stats);
        return stats;
      },
      clear: () => {
        cacheManager.clearAll();
        console.log('🗑️ Cache cleared');
      },
      refresh: async () => {
        console.log('🔄 Refreshing cache...');
        const results = await cacheManager.refreshAll();
        console.log('✅ Cache refreshed:', results);
        return results;
      },
      preload: async () => {
        console.log('⚡ Manual preload...');
        const results = await preloadCache.preloadEssentials();
        console.log('✅ Manual preload completed:', results);
        return results;
      }
    };
    
    return () => {
      delete window.cacheManager;
    };
  }, []);

  // Memoized ToastContainer configuration
  const toastConfig = useMemo(() => ({
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    limit: 3
  }), []);

  // Show loading screen
  if (isLoading) {
    return (
      <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <GlobalLoader />
        </Suspense>
      </div>
    );
  }

  return (
    <CurrencyProvider>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <Suspense fallback={<div>Loading...</div>}>
          <RoutesComponent />
        </Suspense>
        <ToastContainer {...toastConfig} />
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;