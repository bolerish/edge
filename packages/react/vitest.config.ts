import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import { unplugin as stylex } from '@stylexjs/unplugin';

const stylexCompiler: Plugin = stylex.vite({ dev: false, useCSSLayers: true });
// Its HMR polling interval waits for an HTTP server close event. Vitest does
// not start that server, so use the compiler without the development-server hook.
stylexCompiler.configureServer = undefined;

export default defineConfig({
  plugins: [stylexCompiler],
  test: { include: ['src/**/*.test.{ts,tsx}'] },
});
