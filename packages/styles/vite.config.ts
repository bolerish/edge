import { defineConfig, type Plugin } from 'vite';
import { unplugin as stylex } from '@stylexjs/unplugin';

const stylesheetTypes: Plugin = {
  name: 'wisp-stylesheet-types',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'style.css.d.ts', source: 'export {};\n' });
  },
};

export default defineConfig({
  plugins: [stylex.vite({ dev: false, useCSSLayers: true }), stylesheetTypes],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['@bolerish/wisp-core'] },
  },
});
