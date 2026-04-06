import { defineConfig } from 'vite'
import { resolve } from 'path'

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
