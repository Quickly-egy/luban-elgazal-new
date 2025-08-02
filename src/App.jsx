<<<<<<< HEAD
import React, { useEffect, useState, useMemo, Suspense } from "react";
=======
import React, { useEffect, useState } from "react";
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
import { BrowserRouter, useLocation } from "react-router-dom";

import useAuthStore from "./stores/authStore";
import useLocationStore from "./stores/locationStore";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ToastContainer } from "react-toastify";
<<<<<<< HEAD
import { preloadCache, cacheManager } from "./services/cachedAPI";
=======
import GlobalLoader from "./components/common/GlobalLoader";
import { preloadCache, cacheManager } from "./services/cachedAPI";
import "react-toastify/dist/ReactToastify.css";
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

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
<<<<<<< HEAD
  const shouldShowLoader = useLoaderLogic();
  const [isLoading, setIsLoading] = useState(shouldShowLoader);
  const [fadeOut, setFadeOut] = useState(false);
  const preloadStatus = usePreloadLogic();

  // Memoized auth initialization
=======
  // Check if user has visited recently (within last 30 minutes)
  const shouldShowLoader = () => {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
    
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

  // Initialize auth store from localStorage - only run once
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
  useEffect(() => {
    const initializeAuth = useAuthStore.getState().initializeAuth;
    initializeAuth();
  }, []);

<<<<<<< HEAD
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
=======
  // Initialize location detection - always fetch fresh data
  useEffect(() => {
    const initializeLocation = async () => {
      console.log('🚀 Always initializing fresh location detection in App...');
      const locationState = useLocationStore.getState();
      
      // Always fetch fresh location data - no caching
      console.log('📍 Fetching fresh location data every time...');
        await locationState.initializeLocation();
    };

    initializeLocation();
  }, []);

  // Preload essential cache data
  useEffect(() => {
    const preloadEssentialData = async () => {
      if (preloadStatus.started) return; // Prevent multiple preloads
      
      setPreloadStatus(prev => ({ ...prev, started: true }));
      console.log('⚡ Starting essential data preload...');
      
      try {
        // تحميل البيانات الأساسية في الخلفية
        const results = await preloadCache.preloadEssentials();
        
        console.log('⚡ Preload completed:', results);
        setPreloadStatus(prev => ({ 
          ...prev, 
          completed: true,
          failed: !results.categories || !results.products
        }));
        
        // إذا نجح التحميل المسبق، يمكن إشعار المكونات
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

    // Start preloading after a short delay to let the app initialize
    const preloadTimer = setTimeout(preloadEssentialData, 500);
    
    return () => clearTimeout(preloadTimer);
  }, []);

  // Cache cleanup on app start
  useEffect(() => {
    // تنظيف البيانات منتهية الصلاحية عند بدء التطبيق
    const cleanupTimer = setTimeout(() => {
      console.log('🧹 Running cache cleanup...');
      cacheManager.cleanupExpired();
      
      // طباعة إحصائيات الـ cache للمطورين
      if (process.env.NODE_ENV === 'development') {
        const stats = cacheManager.getStats();
        console.log('📊 Cache stats:', stats);
      }
    }, 2000);
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
    
    return () => clearTimeout(cleanupTimer);
  }, []);

<<<<<<< HEAD
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
=======
  // Global loading management
  useEffect(() => {
    // Only run loading logic if we should show the loader
    if (!isLoading) return;

    const handleLoad = () => {
      // Minimum loading time to show the loader
      const minLoadingTime = 1500;
      const startTime = Date.now();
      
      const finishLoading = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        setTimeout(() => {
          // Start fade out animation
          setFadeOut(true);
          
          // Hide loader completely after fade out
          setTimeout(() => {
            setIsLoading(false);
          }, 800); // Match the CSS fade out duration
        }, remainingTime);
      };

      // Check if document is already loaded
      if (document.readyState === 'complete') {
        finishLoading();
      } else {
        // Wait for window load event
        window.addEventListener('load', finishLoading, { once: true });
        
        // Fallback timeout
        const fallbackTimer = setTimeout(finishLoading, 4000);
        
        return () => {
          window.removeEventListener('load', finishLoading);
          clearTimeout(fallbackTimer);
        };
      }
    };

    handleLoad();
  }, [isLoading]);

  // Development cache management (only in development mode)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Add global cache management functions for development
      window.cacheManager = {
        stats: () => {
          const stats = cacheManager.getStats();
          console.table(stats);
          return stats;
        },
        clear: () => {
          cacheManager.clearAll();
          console.log('🗑️ All cache cleared from dev tools');
        },
        refresh: async () => {
          console.log('🔄 Refreshing all cache from dev tools...');
          const results = await cacheManager.refreshAll();
          console.log('✅ Cache refresh completed:', results);
          return results;
        },
        preload: async () => {
          console.log('⚡ Force preloading from dev tools...');
          const results = await preloadCache.preloadEssentials();
          console.log('✅ Preload completed:', results);
          return results;
        }
      };
      
      console.log('🛠️ Cache management tools available in window.cacheManager');
    }
    
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete window.cacheManager;
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        {/* Global Loader */}
        {isLoading && <GlobalLoader fadeOut={fadeOut} />}
        
        {/* Main App Content */}
        <BrowserRouter>
          <ScrollToTopOnRouteChange />
          <RoutesComponent />
          <ToastContainer />
        </BrowserRouter>
      </CurrencyProvider>
    </QueryClientProvider>
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df
  );
}

export default App;