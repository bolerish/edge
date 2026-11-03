import { test, expect } from '@playwright/test';

const routes = [
  '/docs/',
  '/docs/installation/',
  '/docs/usage/',
  '/docs/materials/',
  '/docs/accessibility/',
  '/docs/api/',
  '/playground/',
];

test('public routes render content before JavaScript and hydrate without errors', async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const route of routes) {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    expect(await response.text()).toContain('<h1');
    await page.goto(route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (route === '/docs/' || route === '/playground/')
      await page.screenshot({
        path: `../.private/${route === '/docs/' ? 'site-docs' : 'site-playground'}.png`,
        fullPage: true,
      });
    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-bolerish-theme',
      'dark',
    );
  }
  expect(errors).toEqual([]);
});

test('one light changes real borders while input and button retain native interactions', async ({
  page,
}) => {
  await page.goto('/playground/');
  const card = page.getByTestId('surface-card');
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing card');
  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('270.0deg');
  await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('90.0deg');
  expect(
    await card.evaluate(
      (node) => getComputedStyle(node, '::after').backgroundImage,
    ),
  ).toContain('conic-gradient');
  expect(
    await card.evaluate(
      (node) => getComputedStyle(node, '::after').pointerEvents,
    ),
  ).toBe('none');
  await page.getByRole('button', { name: 'More detail' }).click();
  await expect(
    page.getByText('Your markup, styling and interactions stay in your app.'),
  ).toBeVisible();
  const input = page.getByRole('textbox', { name: 'Search workspace' });
  await input.fill('still my input');
  await input.evaluate((node: HTMLInputElement) =>
    node.setSelectionRange(2, 7),
  );
  await page.mouse.move(box.x + 4, box.y + 40);
  await expect(input).toBeFocused();
  expect(
    await input.evaluate((node: HTMLInputElement) => [
      node.selectionStart,
      node.selectionEnd,
    ]),
  ).toEqual([2, 7]);
  await input.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Button documentation' }),
  ).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Try button' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Clicked 1 time.');
});

test('materials and modes update without further pointer movement', async ({
  page,
}) => {
  await page.goto('/playground/');
  const card = page.getByTestId('surface-card');
  await page.getByRole('button', { name: 'Static', exact: true }).click();
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await expect
    .poll(() =>
      page
        .getByTestId('surface-input')
        .evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('135.0deg');
  const strength = await card.evaluate((node) =>
    Number(node.style.getPropertyValue('--wisp-strength')),
  );
  await page.getByRole('button', { name: '03 Matte' }).click();
  await expect
    .poll(() =>
      card.evaluate((node) =>
        Number(node.style.getPropertyValue('--wisp-strength')),
      ),
    )
    .toBeCloseTo(strength * 0.3, 2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await page.getByRole('button', { name: 'Mouse', exact: true }).click();
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing card');
  await page.mouse.move(box.x + 2, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('270.0deg');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await card.evaluate((node) => getComputedStyle(node, '::after').opacity),
  ).toBe('0');
});

test('mobile navigation supports Escape and pages stay inside the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto('/docs/');
  const menu = page.getByRole('button', { name: 'Open navigation' });
  await menu.click();
  await expect(page.locator('#mobile-navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-navigation')).toBeHidden();
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .locator('#mobile-navigation')
    .getByRole('link', { name: 'Usage', exact: true })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Usage');
  await expect(page.locator('#mobile-navigation')).toBeHidden();
});

test('copy reports actual clipboard success and gives a fallback on denial', async ({
  page,
}) => {
  await page.goto('/docs/installation/');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          (window as unknown as { copied: string }).copied = text;
        },
      },
    }),
  );
  const copy = page.getByRole('button', { name: /^Copy / }).first();
  await copy.click();
  await expect(copy).toHaveText('Copied');
  expect(
    await page.evaluate(() => (window as unknown as { copied: string }).copied),
  ).toContain('pnpm');
  await page.evaluate(() =>
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error('Denied');
        },
      },
    }),
  );
  await copy.click();
  await expect(page.getByRole('status').first()).toContainText(
    'Copy unavailable',
  );
});
