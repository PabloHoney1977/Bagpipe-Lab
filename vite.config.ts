import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the same build works from a GitHub Pages
  // project subpath and from Capacitor's local file serving.
  base: './',
  plugins: [react()],
})
