import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          utils: ['axios', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 600
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
