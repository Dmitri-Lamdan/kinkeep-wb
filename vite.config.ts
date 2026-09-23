import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const objectsApiProxy = {
  '/v1': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: objectsApiProxy,
  },
  preview: {
    proxy: objectsApiProxy,
  },
})
