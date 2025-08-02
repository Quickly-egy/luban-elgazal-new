import React, { useEffect, useMemo, Suspense } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import useAuthStore from "./stores/authStore";
import useLocationStore from "./stores/locationStore";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { ToastContainer } from "react-toastify";
import { preloadCache, cacheManager } from "./services/cachedAPI";
import "react-toastify/dist/ReactToastify.css";

// Lazy loaded components
const RoutesComponent = React.lazy(() => import("./routes/RoutesComponent"));

const ScrollToTopOnRouteChange = React.memo(() => {
  const { pathname } = useLocation();
  useEffect(() => {
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [pathname]);
  return null;
});
ScrollToTopOnRouteChange.displayName = 'ScrollToTopOnRouteChange';

const PRELOAD_DELAY = 100;
const CLEANUP_DELAY = 1000;

function App() {
  // Initialize auth
  useEffect(() => useAuthStore.getState().initializeAuth(), []);

  // Initialize location
  useEffect(() => {
    const initLocation = async () => {
      try {
        await useLocationStore.getState().initializeLocation();
        console.log("✅ Location initialized");
      } catch (err) {
        console.error("❌ Location failed", err);
      }
    };
    initLocation();
  }, []);

  // Preload data
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await preloadCache.preloadEssentials();
        const failed = !res.categories || !res.products;
        console.log(failed ? "⚠️ Some data failed" : "✅ Preload complete", res);
      } catch (err) {
        console.error("❌ Preload error", err);
      }
    }, PRELOAD_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup cache
  useEffect(() => {
    const timer = setTimeout(() => {
      cacheManager.cleanupExpired();
      import.meta.env.DEV && console.log("📊 Cache stats", cacheManager.getStats());
    }, CLEANUP_DELAY);
    return () => clearTimeout(timer);
  }, []);

  // Dev helpers
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    window.cacheManager = {
      stats: cacheManager.getStats,
      clear: () => {
        cacheManager.clearAll();
        console.log("🗑️ Cache cleared");
      },
      refresh: async () => {
        const res = await cacheManager.refreshAll();
        console.log("🔄 Refreshed", res);
        return res;
      },
      preload: async () => {
        const res = await preloadCache.preloadEssentials();
        console.log("⚡ Preloaded manually", res);
        return res;
      },
    };
    return () => { delete window.cacheManager; };
  }, []);

  const toastOptions = useMemo(() => ({
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    limit: 3,
  }), []);

  return (
    <CurrencyProvider>
      <BrowserRouter>
        <ScrollToTopOnRouteChange />
        <Suspense fallback={<div>Loading...</div>}>
          <RoutesComponent />
        </Suspense>
        <ToastContainer {...toastOptions} />
      </BrowserRouter>
    </CurrencyProvider>
  );
}

export default App;
