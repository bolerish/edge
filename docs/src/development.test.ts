import { test, expect } from '@playwright/test';
import { createServer } from 'vite';

test('development serves styled content before JavaScript and hydrates it on refresh', async ({
  browser,
  request,
  page,
}) => {
  const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
  await server.listen();
  const address = server.httpServer?.address();
  if (!address || typeof address === 'string')
    throw new Error('Missing development server address');
  const origin = `http://127.0.0.1:${address.port}`;
  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  try {
    const agentIndex = await request.get(origin + '/llms.txt');
    expect(agentIndex.ok()).toBe(true);
    expect(await agentIndex.text()).toContain('/docs/react/api/index.md');
    const agentApi = await request.get(origin + '/docs/react/api/index.md');
    expect(agentApi.headers()['content-type']).toContain('text/markdown');
    expect(await agentApi.text()).toContain('const ref = useSurface<HTMLElement>(options);');
    const staticPage = await noScript.newPage();
    for (const path of ['/docs/', '/']) {
      const response = await request.get(origin + path);
      const html = await response.text();
      expect(html).toContain(`data-path="${path}"`);
      expect(html).toContain('<h1');
      expect(html).toContain('rel="stylesheet"');
      await staticPage.goto(origin + path);
      await expect(staticPage.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(staticPage.locator('.site-header')).toHaveCSS('display', 'flex');
      if (path === '/') {
        await expect(staticPage.getByTestId('hero-surface')).toHaveCSS('position', 'absolute');
        await expect(staticPage.locator('.code-block').first()).toHaveCSS(
          'border-top-width',
          '1px',
        );
        await expect(staticPage.locator('body')).toHaveCSS(
          'background-color',
          'rgb(255, 255, 255)',
        );
      }
    }
    await page.addInitScript(() => {
      localStorage.setItem('edge:preferences:v1', JSON.stringify({ theme: 'dark' }));
    });
    await page.goto(origin + '/docs/');
    await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
    await page.reload();
    await expect(page.locator('#root')).toHaveAttribute('data-path', '/docs/');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(8, 9, 10)');
    expect(errors).toEqual([]);
  } finally {
    await noScript.close();
    await server.close();
  }
});
