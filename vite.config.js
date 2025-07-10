import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://apix.asyadexpress.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        headers: {
          'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1'
        }
      },
      '/shipping-api': {
        target: 'https://apix.asyadexpress.com/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/shipping-api/, ''),
        secure: true,
        headers: {
          'Authorization': 'Bearer FjhXgwWu0znA0yTXX4Z35j8oHNY1KEo1',
          'Content-Type': 'application/json'
        }
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'zustand'],
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000
  },
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})
