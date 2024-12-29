
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const base = process.env.NODE_ENV === 'production' ? '/js/' : '/';

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, '../static/js'),
    rollupOptions: {
      input: {
        "404": resolve(__dirname, 'src/pages/404/index.html'),
        "post": resolve(__dirname, 'src/pages/post/index.html'),
        "search": resolve(__dirname, 'src/pages/search/index.html'),
        "search-placeholder": resolve(__dirname, 'src/pages/search-placeholder/index.html'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})