import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    // Drop the inline modulepreload polyfill so the built index.html has no
    // inline <script>; this keeps a strict `script-src 'self'` CSP clean.
    // (Targets are modern browsers with native modulepreload support.)
    modulePreload: { polyfill: false },
  },
});
