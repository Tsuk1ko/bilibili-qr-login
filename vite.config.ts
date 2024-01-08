import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { startApiServer } from './server/utils';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
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
    define: {
      __TRUST_ORIGIN__: JSON.stringify(process.env.TRUST_ORIGIN || (mode === 'development' ? '*' : '')),
    },
  };
});
