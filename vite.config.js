import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    assetsDir: 'assets'
  },
  publicDir: '../public'
})
