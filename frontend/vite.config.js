import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../src/main/resources/static'),
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8082',
      '/report1': 'http://localhost:8082',
      '/customers': 'http://localhost:8082',
      '/register': 'http://localhost:8082',
    },
  },
});
