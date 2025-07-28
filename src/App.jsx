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

  // Initialize auth store from localStorage - only run once
  useEffect(() => {
    const initializeAuth = useAuthStore.getState().initializeAuth;
    initializeAuth();
  }, []); // Empty dependency array - only run once

  // Initialize location detection - only run once
  useEffect(() => {
    const locationState = useLocationStore.getState();
    if (!locationState.country && !locationState.countryCode) {
      locationState.initializeLocation();
    }
  }, []); // Empty dependency array - only run once

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

  // Fetch products only if we don't have any - only run once
  // useEffect(() => {
  //   const productsState = useProductsStore.getState();
  //   if (productsState.allProducts.length === 0) {
  //     productsState.fetchProducts();
  //   }
  // }, []); // Empty dependency array - only run once

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
