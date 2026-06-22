import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    // Drop the inline modulepreload polyfill so the built index.html has no
    // inline <script>; this keeps a strict `script-src 'self'` CSP clean.
    modulePreload: { polyfill: false },
    rollupOptions: {
      output: {
        manualChunks: {
          // The 3D stack is the heaviest dependency. It's only imported by the
          // lazily-loaded Scene, so this whole chunk loads after first paint.
          three: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'postprocessing',
          ],
        },
      },
    },
  },
});
