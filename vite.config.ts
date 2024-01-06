import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { startApiServer } from './server/utils';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') startApiServer();
  return {
    plugins: [vue(), svgLoader()],
    server: {
      proxy: {
        '/api': 'http://127.0.0.1:3000',
      },
    },
    build: {
      outDir: 'dist/static',
    },
  };
});
