import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RoutesComponent from "./routes/RoutesComponent";
import useAuthStore from "./stores/authStore";
import useProductsStore from "./stores/productsStore";
import useLocationStore from "./stores/locationStore";

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

  // Fetch products only if we don't have any - only run once
  useEffect(() => {
    const productsState = useProductsStore.getState();
    if (productsState.allProducts.length === 0) {
      productsState.fetchProducts();
    }
  }, []); // Empty dependency array - only run once

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <RoutesComponent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
