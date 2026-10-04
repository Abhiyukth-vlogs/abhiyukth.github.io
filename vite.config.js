import { defineConfig } from 'vite';

export default defineConfig({
  // Base path configured for GitHub Pages repository subpath
  base: '/abhiyukth.github.io/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: false
  }
});
