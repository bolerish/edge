import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { css: { include: [/edge\.css/] }, include: ['src/**/*.test.{ts,tsx}'] },
});
