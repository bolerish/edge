import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

test('initial HTML exposes the current favicon and logo sharing metadata', async ({ request }) => {
  const favicon = await readFile(new URL('../public/favicon.ico', import.meta.url));
  const version = createHash('sha256').update(favicon).digest('hex').slice(0, 12);
  for (const [path, title] of [
    ['/', 'bolerish/edge · Directional surface lighting'],
    ['/docs/', 'Getting started · Introduction · bolerish/edge'],
    ['/docs/react/api/', 'React · React API overview · bolerish/edge'],
  ]) {
    const response = await request.get(path!);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain(`href="/favicon.ico?v=${version}"`);
    expect(html).toContain(`<meta property="og:title" content="${title}"`);
    expect(html).toContain(`<meta property="og:url" content="https://edge.bolerish.com${path}"`);
    expect(html).toContain(
      '<meta property="og:image" content="https://edge.bolerish.com/logo.webp"',
    );
    expect(html).toContain(
      '<meta name="twitter:image" content="https://edge.bolerish.com/logo.webp"',
    );
  }
  const icon = await request.get(`/favicon.ico?v=${version}`);
  expect(icon.ok()).toBe(true);
  expect(await icon.body()).toEqual(favicon);
  const logo = await request.get('/logo.webp');
  expect(logo.ok()).toBe(true);
  expect(logo.headers()['content-type']).toContain('image/webp');
  expect(await logo.body()).toEqual(
    await readFile(new URL('../public/logo.webp', import.meta.url)),
  );
});
