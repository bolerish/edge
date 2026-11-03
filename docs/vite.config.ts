import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // The entire site is a client application; the library retains its own boundary.
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
          warning.message.includes('use client')
        )
          return;
        warn(warning);
      },
    },
  },
});
