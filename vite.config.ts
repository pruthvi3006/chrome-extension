import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'index.html'), // or your entry HTML
      },
      output: {
        // important for browser extensions
        assetFileNames: 'assets/[name].[ext]',
        entryFileNames: '[name].js',
      }
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
})
