import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],
  base: isGitHubPages ? '/customer-mangement/' : '/',
  build: {
    outDir: isGitHubPages
      ? path.resolve(__dirname, 'dist-pages')
      : path.resolve(__dirname, '../src/main/resources/static'),
    emptyOutDir: !isGitHubPages ? false : true,
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
