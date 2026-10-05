import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiTarget = new URL(env.VITE_API_URL || 'http://localhost:5000/api').origin

  return {
    plugins: [react()],
    base: process.env.GITHUB_ACTIONS ? '/mycarrent/' : '/',
    server: {
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
