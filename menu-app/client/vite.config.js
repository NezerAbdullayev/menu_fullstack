import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Admin səhifələri lazy chunk-lardadır. Ən böyük chunk react + antd nüvəsidir (~610 kB),
    // ona görə hədd 700 kB: yeni böyük asılılıq əlavə olunsa xəbərdarlıq görünəcək.
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
