import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('agent documents preserve versioned guides, code and API tables without UI chrome', async ({ request }) => {
  const { version } = JSON.parse(await readFile(new URL('../../packages/react/package.json', import.meta.url), 'utf8'));
  const indexResponse = await request.get('/llms.txt');
  expect(indexResponse.ok()).toBe(true);
  const index = await indexResponse.text();
  expect(index).toContain(`@bolerish/edge ${version}`);
  const fullResponse = await request.get('/llms-full.txt');
  expect(fullResponse.ok()).toBe(true);
  const full = await fullResponse.text();
  const links = [...index.matchAll(/\]\((https:\/\/edge\.bolerish\.com\/docs\/[^)]*index\.md)\)/g)];
  expect(links).toHaveLength(10);
  for (const [, url] of links) {
    const response = await request.get(new URL(url!).pathname);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('text/markdown');
    const body = await response.text();
    expect(body).toContain(`Package: @bolerish/edge ${version}`);
    expect(body).toMatch(/^# /);
    expect(full).toContain(body.trim());
  }
  expect(full).toContain('npm install @bolerish/edge');
  expect(full).toContain('pnpm add @bolerish/edge');
  expect(full).toContain('```tsx');
  expect(full).toContain('<Edge.Provider>');
  expect(full).toContain('const ref = useSurface<HTMLElement>(options);');
  expect(full).toContain('| Prop / option | Type | Default | Description |');
  expect(full).toContain("'system' \\| 'dynamic' \\| 'static'");
  expect(full).not.toContain('__EDGE_STYLE__');
  expect(full).not.toContain('Copy prompt');
  expect(full).not.toContain('New project');
  const html = await (await request.get('/docs/react/api/')).text();
  expect(html).toContain('rel="alternate" type="text/markdown" href="/docs/react/api/index.md"');
  expect(html).toContain('rel="describedby" type="text/plain" href="/llms.txt"');
});
