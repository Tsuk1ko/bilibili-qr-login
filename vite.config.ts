import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vercel from 'vite-plugin-vercel';
import { startApiServer } from './server/utils';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') startApiServer();
  return {
    plugins: [vue(), vercel()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:3000',
      },
    },
  };
});
