import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const root = fileURLToPath(new URL('.', import.meta.url));

// Every page is a separate HTML entry so ordinary links work after build.
export const pages = ['index', 'shop', 'cart', 'checkout', 'confirmation', 'help', 'team'];

export default defineConfig({
  // GitHub Pages project subpath. Change only if the repository name changes.
  base: '/gatherbox/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Keep images as separate files rather than inline data URIs.
    assetsInlineLimit: 0,
    rolldownOptions: {
      input: Object.fromEntries(pages.map((page) => [page, resolve(root, `${page}.html`)])),
    },
  },
});
