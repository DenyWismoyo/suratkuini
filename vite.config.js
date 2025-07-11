// FILE: vite.config.js (VERSI DISEDERHANAKAN)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Tidak ada konfigurasi css/postcss di sini
export default defineConfig({
  plugins: [react()],
})