import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',  // or 'modules' based on your browser compatibility requirements
    outDir: 'dist',  // Directory where the build output will go
    rollupOptions: {
      output: {
        manualChunks: {
          // Optionally, break up large dependencies into separate chunks to improve performance
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',  // Ensures the app listens on all interfaces for public access
    port: 5173,       // Default port, you can change it if needed
  },
})
