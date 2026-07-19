import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

// ponytail: static output (default), single vite alias to the shared data package.
export default defineConfig({
  site: 'https://colombiaendatos.co',
  vite: {
    resolve: {
      alias: {
        '@data': fileURLToPath(new URL('./data', import.meta.url)),
      },
    },
  },
});
