import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages at https://anjumArnab.github.io/me/
// so the production build must resolve assets under that sub-path.
// In dev we serve from the root ('/') for a cleaner localhost URL.
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/me/' : '/',
  plugins: [react()],
}))
