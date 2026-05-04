import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'public/build',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        clusterMap: 'src/clusterMap.js',
        showPageMap: 'src/showPageMap.js'
      }
    }
  }
});
