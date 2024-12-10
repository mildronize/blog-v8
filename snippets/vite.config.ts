
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const base = process.env.NODE_ENV === 'production' ? '/js/' : '/';

export default defineConfig({
  base,
  build: {
    emptyOutDir: true,
    outDir: resolve(__dirname, '../static/js'),
    rollupOptions: {
      input: {
        "404": resolve(__dirname, 'src/pages/404/index.html'),
        "post": resolve(__dirname, 'src/pages/post/index.html'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`
      }
    }
  }
})