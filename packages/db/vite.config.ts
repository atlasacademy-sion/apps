import { defineConfig } from 'vite';

import reactSwc from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/db/',
  plugins: [reactSwc(), viteTsconfigPaths(), svgrPlugin()],
  build: {
    outDir: './build',
    emptyOutDir : true,
  }
});
