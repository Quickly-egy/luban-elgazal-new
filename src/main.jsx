import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// إزالة ReactQueryDevtools من الإنتاج
const ReactQueryDevtools = 
  import.meta.env.DEV 
    ? React.lazy(() => import('@tanstack/react-query-devtools').then(module => ({ 
        default: module.ReactQueryDevtools 
      })))
    : null

// إزالة ملفات الاختبار من الإنتاج
if (import.meta.env.DEV) {
  // تحميل ملفات الاختبار فقط في وضع التطوير
  import('./services/testShippingOutput.js')
  import('./services/testCityValidation.js')
}

// تحسين إعدادات QueryClient للأداء
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 دقائق
      cacheTime: 10 * 60 * 1000, // 10 دقائق
      // إضافة إعدادات إضافية للأداء
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <App />
    {/* تحميل ReactQueryDevtools فقط في وضع التطوير */}
    {import.meta.env.DEV && ReactQueryDevtools && (
      <React.Suspense fallback={null}>
        <ReactQueryDevtools initialIsOpen={false} />
      </React.Suspense>
    )}
  </QueryClientProvider>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppWithProviders />
  </React.StrictMode>,
)