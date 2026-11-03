import { defineConfig } from 'vite';
import { unplugin as stylex } from '@stylexjs/unplugin';
export default defineConfig({
  plugins: [stylex.vite({ dev: false, useCSSLayers: true })],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'index' },
    rollupOptions: {
      output: { banner: "'use client';" },
      external: [
        'react',
        'react/jsx-runtime',
        '@stylexjs/stylex',
        '@bolerish/wisp-core',
      ],
    },
  },
});
