import { resolve } from "node:path";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [react()],
  root: resolve(process.cwd(), 'test/kitchen-sink')
})
