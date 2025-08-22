import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    host: '0.0.0.0'
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    allowedHosts: ['gestalis.onrender.com', 'localhost', '127.0.0.1']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
