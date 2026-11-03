import { test, expect } from '@playwright/test';

const routes = [
  '/docs/',
  '/docs/react/',
  '/docs/react/usage/',
  '/docs/materials/',
  '/docs/accessibility/',
  '/docs/react/api/',
  '/',
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
    if (route === '/docs/' || route === '/')
      await page.screenshot({
        path: `../.private/${route === '/docs/' ? 'site-docs' : 'site-home'}.png`,
        fullPage: true,
      });
    const darkTheme = page.getByRole('button', { name: 'Switch to dark theme' });
    if (await darkTheme.isVisible()) await darkTheme.click();
    await expect(page.locator('html')).toHaveAttribute(
      'data-bolerish-theme',
      'dark',
    );
  }
  expect(errors).toEqual([]);
});

test('one light changes preview borders while project actions stay inactive', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.getByTestId('surface-card');
  await card.scrollIntoViewIfNeeded();
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
  const input = page.getByRole('textbox', { name: 'Search projects' });
  await expect(input).toHaveJSProperty('readOnly', true);
  await input.focus();
  await page.mouse.move(box.x + 4, box.y + 40);
  await expect(input).toBeFocused();
  await expect(page.getByRole('button', { name: 'New project' })).toBeDisabled();
  await expect(page.getByRole('rowheader')).toHaveCount(3);
});

test('materials and modes update without further pointer movement', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.getByTestId('surface-card');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const light = page.getByRole('combobox', { name: 'Motion', exact: true });
  const surface = page.getByRole('combobox', { name: 'Style', exact: true });
  await expect(light).toHaveValue('pointer');
  await expect(surface).toHaveValue('raised');
  await light.selectOption('static');
  await page.keyboard.press('Escape');
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
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await surface.selectOption('matte');
  await page.keyboard.press('Escape');
  await expect
    .poll(() =>
      card.evaluate((node) =>
        Number(node.style.getPropertyValue('--wisp-strength')),
      ),
    )
    .toBeCloseTo(strength * 0.3, 2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await light.selectOption('static');
  await page.keyboard.press('Escape');
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await light.selectOption('pointer');
  await page.keyboard.press('Escape');
  await card.scrollIntoViewIfNeeded();
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
  await page.goto('/docs/react/');
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
  ).toBe('npm install @bolerish/edge');
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

test('preview data stays fixed and getting started leads to React installation', async ({
  page,
}) => {
  await page.goto('/');
  const input = page.getByRole('textbox', { name: 'Search projects' });
  await expect(input).toHaveJSProperty('readOnly', true);
  await expect(page.getByRole('button', { name: 'New project' })).toBeDisabled();
  await expect(page.getByRole('rowheader')).toHaveText([
    'Website refresh', 'Design system', 'Mobile app',
  ]);
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  const integrations = page.getByRole('list', { name: 'Framework integrations' });
  await expect(integrations.getByRole('listitem')).toHaveCount(4);
  await expect(integrations.getByRole('link')).toHaveCount(1);
  await expect(integrations.getByText('Coming soon', { exact: true })).toHaveCount(3);
  await integrations.getByRole('link', { name: /Start with React/ }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/react\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Installation',
  );
});

test('SSG documents include highlighted code and remain readable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4183/docs/');
  await page.getByRole('link', { name: /Start with React/ }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4183/docs/react/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Installation',
  );
  await expect(page.locator('.token.keyword').first()).toBeVisible();
  await expect(page.locator('pre').last()).toContainText('Lighting.Surface');
  await page.goto('http://127.0.0.1:4183/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Light that reveals your interface.',
  );
  await expect(page.getByRole('rowheader')).toHaveCount(3);
  await context.close();
});

test('skip link, code scrolling, zoom reflow and high-contrast code stay usable', async ({
  page,
}) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Skip to content' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.goto('/docs/react/');
  const code = page.locator('pre').last();
  await code.focus();
  await expect(code).toBeFocused();
  expect(
    await code.evaluate((node) => getComputedStyle(node).outlineStyle),
  ).toBe('solid');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page
      .locator('.token.keyword')
      .first()
      .evaluate((node) => getComputedStyle(node).color),
  ).not.toBe('transparent');
  await page.emulateMedia({ forcedColors: 'none' });
  for (const route of ['/', '/docs/react/']) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});


test('header settings persist across documentation navigation and reloads', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('combobox', { name: 'Style' }).selectOption('matte');
  await page.getByRole('combobox', { name: 'Motion' }).selectOption('static');
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Docs', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Style' })).toHaveValue('matte');
  await expect(page.getByRole('combobox', { name: 'Motion' })).toHaveValue('static');
});

test('documentation search finds section content and supports keyboard dismissal', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Search documentation', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  const query = dialog.getByRole('textbox', { name: 'Search titles and content' });
  await query.fill('stationary');
  await expect(dialog.getByRole('link', { name: /Refresh after layout changes/ })).toBeVisible();
  await query.fill('no-such-document-987');
  await expect(dialog.getByRole('status')).toContainText('No documents found');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog).toBeVisible();
  await query.fill('installation');
  await dialog.getByRole('link', { name: /^Installation/ }).click();
  await expect(page).toHaveURL(/\/docs\/react\/$/);
});

test('API navigation follows the URL hash after hydration and in-page navigation', async ({ page }) => {
  await page.goto('/docs/react/api/#use-surface');
  const sidebar = page.locator('.sidebar');
  const toc = page.locator('.table-of-contents');
  await expect(sidebar.getByRole('link', { name: 'API reference', exact: true }))
    .toHaveAttribute('aria-current', 'page');
  await expect(toc.getByRole('link', { name: 'useSurface(light, options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
  await page.locator('.table-of-contents').getByRole('link', { name: 'useLight(options?)', exact: true }).click();
  await expect(toc.getByRole('link', { name: 'useLight(options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
  await expect(toc.getByRole('link', { name: 'useSurface(light, options?)', exact: true }))
    .not.toHaveAttribute('aria-current');
});


test('previous guide URLs preserve their content and API anchors', async ({ page }) => {
  for (const [slug, title] of [
    ['installation', 'Installation'], ['usage', 'Usage'], ['materials', 'Materials'],
    ['accessibility', 'Accessibility'], ['api', 'API reference'],
    ['react/materials', 'Materials'], ['react/accessibility', 'Accessibility'],
  ] as const) {
    await page.goto(`/docs/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.sidebar').getByRole('link', { name: title, exact: true }))
      .toHaveAttribute('aria-current', 'page');
  }
  await page.goto('/docs/api/#use-surface');
  await expect(page.locator('.table-of-contents').getByRole('link', { name: 'useSurface(light, options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
});


test('framework search uses canonical React guides and contextual labels', async ({ page }) => {
  await page.goto('/docs/getting-started/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  await page.getByRole('button', { name: 'Search documentation' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Search titles and content' }).fill('React installation');
  const result = dialog.getByRole('link', { name: /^Installation/ });
  await expect(result).toContainText('React · Installation');
  await expect(result).toHaveAttribute('href', '/docs/react/');
});


test('shared guides appear before framework-specific documentation', async ({ page }) => {
  await page.goto('/docs/');
  const groups = page.locator('.sidebar .nav-group');
  await expect(groups).toHaveCount(3);
  await expect(groups.nth(0).getByRole('link')).toHaveText(['Getting started']);
  await expect(groups.nth(1).getByRole('link')).toHaveText(['Materials', 'Accessibility']);
  await expect(groups.nth(2).getByRole('link')).toHaveText(['Installation', 'Usage', 'API reference']);
  await groups.nth(1).getByRole('link', { name: 'Materials', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/materials\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Materials');
});

test('hero compares lighting and package-manager tabs expose matching commands', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Lighting (on|off)/ })).toHaveCount(0);
  for (const [manager, command] of [
    ['npm', 'npm install'],
    ['pnpm', 'pnpm add'],
    ['Yarn', 'yarn add'],
    ['Bun', 'bun add'],
  ]) {
    await page.getByRole('tab', { name: manager, exact: true }).click();
    await expect(page.getByRole('tabpanel',{name:manager,exact:true})).toContainText(
      `${command} @bolerish/edge`,
    );
  }

});


test('Frozen retains the first pointer position and persists the selected mode', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  const motion = page.getByRole('combobox', { name: 'Motion', exact: true });
  await expect(motion.locator('option')).toHaveText(['Static', 'Dynamic', 'Frozen']);
  await motion.selectOption('frozen');
  await page.keyboard.press('Escape');
  const card = page.getByTestId('hero-surface');
  await page.mouse.move(700, 200);
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).not.toBe('315.0deg');
  const angle = await card.evaluate(node => node.style.getPropertyValue('--wisp-angle'));
  await page.mouse.move(100, 500);
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe(angle);
  await page.reload();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(motion).toHaveValue('frozen');
});
