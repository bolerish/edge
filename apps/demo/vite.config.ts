import { defineConfig } from 'vite';
import { unplugin as stylex } from '@stylexjs/unplugin';
export default defineConfig({
  plugins: [stylex.vite({ useCSSLayers: { before: ['reset'] } })],
});
