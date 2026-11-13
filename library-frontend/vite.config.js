import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// VITE_BASE_PATH: đường dẫn gốc khi deploy.
//  - Chạy trên máy: để trống → "/"
//  - GitHub Pages:  "/library-management/" (workflow tự đặt)
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    open: true,
  },
});
