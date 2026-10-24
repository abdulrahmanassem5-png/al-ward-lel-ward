import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (
              id.includes('/react/') ||
              id.includes('\\react\\') ||
              id.includes('/react-dom/') ||
              id.includes('\\react-dom\\') ||
              id.includes('/react-router-dom/') ||
              id.includes('\\react-router-dom\\') ||
              id.includes('/react-router/') ||
              id.includes('\\react-router\\')
            ) {
              return 'vendor-react';
            }
            if (
              id.includes('/i18next/') ||
              id.includes('\\i18next\\') ||
              id.includes('/react-i18next/') ||
              id.includes('\\react-i18next\\')
            ) {
              return 'vendor-i18n';
            }
            if (
              id.includes('/lucide-react/') ||
              id.includes('\\lucide-react\\')
            ) {
              return 'vendor-icons';
            }
            if (
              id.includes('/html-to-image/') ||
              id.includes('\\html-to-image\\') ||
              id.includes('/qrcode.react/') ||
              id.includes('\\qrcode.react\\') ||
              id.includes('/canvas-confetti/') ||
              id.includes('\\canvas-confetti\\')
            ) {
              return 'vendor-erp-tools';
            }
          }
        },
      },
    },
  },
});
