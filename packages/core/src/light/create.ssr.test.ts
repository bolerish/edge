// @vitest-environment node
import { expect, it } from 'vitest';
it('creates and configures a light without any browser globals', async () => {
  expect(typeof window).toBe('undefined');
  const { createLight } = await import('./create.js');
  const light = createLight();
  light.configure({ mode: 'static' });
  light.refresh();
  expect(typeof light.mount).toBe('function');
});
