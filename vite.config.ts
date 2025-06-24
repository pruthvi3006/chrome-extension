import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills(),
  ],
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content.tsx'),
        
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife', // Ensures output is IIFE, not ES module
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: 'buffer',
    },
  },
});
