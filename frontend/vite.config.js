import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
    define: {
      'process.env.ALLOWED_ORIGINS': JSON.stringify(['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001']),
    },
  },
  // In production on Vercel, the built frontend is served as static files.
  // API requests go directly to the backend (Render) using VITE_API_BASE_URL.
});