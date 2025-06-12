import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: new URL('src/content.tsx', import.meta.url).pathname,
        panel: new URL('public/iframe.html', import.meta.url).pathname
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === 'content' ? 'content.js' : '[name].js'
      }
    }
  }
});
