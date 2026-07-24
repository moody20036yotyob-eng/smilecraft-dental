import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true
      }
    }
  },
  build: {
    // Split vendor chunks so browsers can cache them separately
    rollupOptions: {
      output: {
        manualChunks: {
          'react-core':   ['react', 'react-dom', 'react-router-dom'],
          'framer':       ['framer-motion'],
        }
      }
    },
    // Warn when any chunk exceeds 250 KB
    chunkSizeWarningLimit: 250,
  }
})
