import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    visualizer({ 
      open: true,
      filename: 'stats.html',
      gzipSize: true,
      brotliSize: true
    })
  ],
=======
  plugins: [react()],
>>>>>>> 844a7b1cd1b3a4faeac33d8bee234977e640f2df

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          
          // Routing
          'router': ['react-router-dom'],
          
          // State management
          'state': ['zustand'],
          
          // HTTP client
          'http': ['axios'],
          
          // UI libraries
          'ui': ['react-icons', 'framer-motion'],
          
          // Forms and validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          
          // PDF and printing
          'pdf': ['@react-pdf/renderer', 'jspdf', 'html2canvas'],
          
          // Notifications
          'notifications': ['react-toastify'],
          
          // Slider
          'slider': ['swiper'],
          
          // Utilities
          'utils': ['transliteration']
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    // إزالة الكود الميت
    esbuild: {
      drop: ['console', 'debugger'],
      pure: ['console.log', 'console.info', 'console.debug']
    }
  },
  
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'zustand',
      'axios',
      'react-icons',
      'framer-motion'
    ],
    exclude: [
      '@react-pdf/renderer',
      'jspdf',
      'html2canvas'
    ]
  }
})
