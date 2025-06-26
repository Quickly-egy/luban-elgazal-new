import React, { useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RoutesComponent from "./routes/RoutesComponent";
import useAuthStore from "./stores/authStore";
import useProductsStore from "./stores/productsStore";

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
  const initializeAuth = useAuthStore(state => state.initializeAuth);
  const fetchProducts = useProductsStore(state => state.fetchProducts);

  useEffect(() => {
    // Initialize auth store from localStorage
    initializeAuth();
    // تحميل المنتجات عند بدء التطبيق
    fetchProducts();
  }, [initializeAuth, fetchProducts]);

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
