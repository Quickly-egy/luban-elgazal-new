import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000, // 10 دقائق
    },
    mutations: {
      retry: 1,
    },
  },
});


const Devtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then(mod => ({
        default: mod.ReactQueryDevtools,
      }))
    )
  : null;

if (import.meta.env.DEV) {
  import('./services/testShippingOutput.js');
  import('./services/testCityValidation.js');
}

// تطبيق مزود QueryClient
const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <App />
    {Devtools && (
      <Suspense fallback={null}>
        <Devtools initialIsOpen={false} />
      </Suspense>
    )}
  </QueryClientProvider>
);

// تنفيذ التطبيق
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>
);
