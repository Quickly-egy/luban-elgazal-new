import React, { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RoutesComponent from "./routes/RoutesComponent";
import useAuthStore from "./stores/authStore";
import useProductsStore from "./stores/productsStore";
import useLocationStore from "./stores/locationStore";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ToastContainer } from "react-toastify";
import GlobalLoader from "./components/common/GlobalLoader";
import { preloadCache, cacheManager } from "./services/cachedAPI";
import "react-toastify/dist/ReactToastify.css";

// مكون للتمرير لأعلى عند تغيير المسار
function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const queryClient = new QueryClient();

function App() {
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
  useEffect(() => {
    const initializeAuth = useAuthStore.getState().initializeAuth;
    initializeAuth();
  }, []);

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
    
    return () => clearTimeout(cleanupTimer);
  }, []);

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
  );
}

export default App;
