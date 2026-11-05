import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const stylesheet = fileURLToPath(new URL('./src/edge.css', import.meta.url));
const surfaceStyles: Plugin = {
  name: 'edge-stylesheet',
  buildStart() {
    this.addWatchFile(stylesheet);
  },
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'assets/edge.css', source: readFileSync(stylesheet, 'utf8') });
    this.emitFile({ type: 'asset', fileName: 'style.css.d.ts', source: 'export {};\n' });
  },
};

export default defineConfig({
  plugins: [surfaceStyles],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: { external: ['@bolerish/edge-core'] },
  },
});
