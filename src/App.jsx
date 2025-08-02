import React, { useEffect, useState, useMemo, Suspense } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";

import useAuthStore from "./stores/authStore";
import useLocationStore from "./stores/locationStore";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ToastContainer } from "react-toastify";
import { preloadCache, cacheManager } from "./services/cachedAPI";

// Lazy load components to reduce initial bundle size
const RoutesComponent = React.lazy(() => import("./routes/RoutesComponent"));
const GlobalLoader = React.lazy(() => import("./components/common/GlobalLoader"));

// Import CSS asynchronously to prevent render blocking
import("react-toastify/dist/ReactToastify.css");

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
const PRELOAD_DELAY = 100; // Reduced from 500ms
const CLEANUP_DELAY = 1000; // Reduced from 2000ms

// Memoized loader logic
const useLoaderLogic = () => {
  return useMemo(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (!lastVisit || (now - parseInt(lastVisit)) > THIRTY_MINUTES) {
      localStorage.setItem('lastVisit', now.toString());
      return true;
    }
    return false;
  }, []);
};

// Custom hook for preload logic
const usePreloadLogic = () => {
  const [preloadStatus, setPreloadStatus] = useState({
    started: false,
    completed: false,
    failed: false
  });

  useEffect(() => {
    if (preloadStatus.started) return;
    
    let isCancelled = false;
    
    const preloadEssentialData = async () => {
      if (isCancelled) return;
      
      setPreloadStatus(prev => ({ ...prev, started: true }));
      console.log('⚡ Starting essential data preload...');
      
      try {
        const results = await preloadCache.preloadEssentials();
        
        if (isCancelled) return;
        
        console.log('⚡ Preload completed:', results);
        setPreloadStatus(prev => ({ 
          ...prev, 
          completed: true,
          failed: !results.categories || !results.products
        }));
        
     
        
      } catch (error) {
        if (isCancelled) return;
        
        console.error('❌ Preload failed:', error);
        setPreloadStatus(prev => ({ 
          ...prev, 
          completed: true,
          failed: true
        }));
      }
    };

    const preloadTimer = setTimeout(preloadEssentialData, PRELOAD_DELAY);
    
    return () => {
      isCancelled = true;
      clearTimeout(preloadTimer);
    };
  }, [preloadStatus.started]);

  return preloadStatus;
};

// Main App Component
function App() {
  const shouldShowLoader = useLoaderLogic();
  const [isLoading, setIsLoading] = useState(shouldShowLoader);
  const [fadeOut, setFadeOut] = useState(false);
  const preloadStatus = usePreloadLogic();

  // Memoized auth initialization
  useEffect(() => {
    const initializeAuth = useAuthStore.getState().initializeAuth;
    initializeAuth();
  }, []);

  // Optimized location initialization
  useEffect(() => {
    let isCancelled = false;
    
    const initializeLocation = async () => {
  
      const locationState = useLocationStore.getState();
      
      try {
        await locationState.initializeLocation();
      
      } catch (error) {
        
      }
    };

    initializeLocation();
    
    return () => {
      isCancelled = true;
    };
  }, []);

  // Optimized cache cleanup
  useEffect(() => {
    const cleanupTimer = setTimeout(() => {

      cacheManager.cleanupExpired();
      
      if (import.meta.env.DEV) {
        const stats = cacheManager.getStats();
      }
    }, CLEANUP_DELAY);
    
    return () => clearTimeout(cleanupTimer);
  }, []);

  // Optimized loading management
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
       
        return stats;
      },
      clear: () => {
        cacheManager.clearAll();
       
      },
      refresh: async () => {
       
        const results = await cacheManager.refreshAll();

        return results;
      },
      preload: async () => {

        const results = await preloadCache.preloadEssentials();

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
    limit: 3 // Limit number of toasts
  }), []);

  return (
    <CurrencyProvider>
      {/* Conditional Global Loader with Suspense */}
      {/* {isLoading && (
        <Suspense fallback={<div className="loading-fallback"></div>}>
          <GlobalLoader fadeOut={fadeOut} />
        </Suspense>
      )} */}

      {/* Main App Content */}
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
            <RoutesComponent />
        {/* <Suspense fallback={
          <div className="">
            <div className="loader">جاري تحميل الصفحة...</div>
          </div>
        }>
      
        </Suspense> */}
        <ToastContainer {...toastConfig} />
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;