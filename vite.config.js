import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  public: 'public',
  server: {
    port: 5173,
    open: false
  },
  build: {
    outDir: 'dist',
    minify: 'terser'
  }
})
