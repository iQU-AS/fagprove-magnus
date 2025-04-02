import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // For prod
  base: '/static/',
  plugins: [react()],
})