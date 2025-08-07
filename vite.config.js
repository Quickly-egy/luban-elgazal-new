import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    
    // ضغط الملفات
    compression({ 
      algorithm: 'gzip',
      ext: '.gz'
    }),
    
    // مصور الحزم (اختياري)
    process.env.NODE_ENV === 'production' && visualizer({ 
      filename: 'dist/bundle-analyzer.html',
      open: false
    })
  ].filter(Boolean),

  build: {
    // تحسين الضغط
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    rollupOptions: {
      output: {
        // تقسيم الحزم
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'utils': ['axios', 'zustand']
        }
      }
    },
    
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 500
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },

  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'zustand']
  }
})