import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // ✅ لو هتتعامل مع endpoint زي: https://apix.asyadexpress.com/v2/orders
      '/api': {
        target: 'https://apix.asyadexpress.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),

        // ❌ مهم: لا تضع Authorization هنا
        // الهيدر Authorization يجب أن يُرسل من الكود عند تنفيذ request (axios/fetch)
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios', 'zustand']
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
