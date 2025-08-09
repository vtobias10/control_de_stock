// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,           // escucha en 0.0.0.0 para acceder desde la LAN
    port: 5173,
    strictPort: true,
    // Si el HMR no conecta desde la notebook, descomenta y pon tu IP:
    // hmr: { host: '192.168.100.17', port: 5173, protocol: 'ws' },

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
  // Opcional: para `npm run preview` accesible desde la red (usa 4173)
  preview: {
    host: true,
  },
})
