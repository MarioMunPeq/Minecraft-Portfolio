import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    mdx({
      jsxImportSource: 'react',
    }),
  ],
  base: '/Minecraft-Portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
