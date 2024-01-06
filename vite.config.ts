import { rename } from 'fs/promises';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vercel from 'vite-plugin-vercel';
import svgLoader from 'vite-svg-loader';
import { startApiServer } from './server/utils';
import type { ViteVercelConfig } from 'vite-plugin-vercel';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') startApiServer();
  return {
    plugins: [vue(), svgLoader(), vercel()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:3000',
      },
    },
    vercel: {
      prerender: async () => {
        await rename('dist', '.vercel/output/static');
        return {};
      },
    } as ViteVercelConfig,
  };
});
