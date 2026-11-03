import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const stylesheet = fileURLToPath(import.meta.resolve('@bolerish/wisp-styles/style.css'));
const sharedStyles: Plugin = {
  name: 'wisp-shared-styles',
  buildStart() {
    this.addWatchFile(stylesheet);
  },
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'assets/stylex.css', source: readFileSync(stylesheet, 'utf8') });
  },
};

export default defineConfig({
  plugins: [sharedStyles],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: {
      output: { banner: "'use client';" },
      external: ['react', 'react/jsx-runtime', '@bolerish/wisp-core', '@bolerish/wisp-styles'],
    },
  },
});
