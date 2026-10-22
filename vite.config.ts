import { defineConfig } from 'vite';
export default defineConfig({
  // Keep fonts as same-origin files so the strict font-src policy needs no data URLs.
  build: { assetsInlineLimit: 0 },
});
