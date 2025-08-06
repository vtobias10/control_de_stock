// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Cualquier petición que empiece con /api
      '/api': {
        target: 'http://localhost:3000',  // tu backend corre en el puerto 3000
        changeOrigin: true,
        secure: false,                     // si usas HTTPS local, pon true
        rewrite: (path) => path.replace(/^\/api/, '/api')
      },
    },
  },
})
