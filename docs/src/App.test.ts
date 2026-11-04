import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const routes = [
  '/docs/',
  '/docs/react/',
  '/docs/react/usage/',
  '/docs/styles/',
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
  // Pointer coordinates may be rounded while layout boxes retain subpixels.
  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => Number.parseFloat(node.style.getPropertyValue('--wisp-angle'))),
    )
    .toBeCloseTo(270, 0);
  await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => Number.parseFloat(node.style.getPropertyValue('--wisp-angle'))),
    )
    .toBeCloseTo(90, 0);
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
  await expect(light).toHaveValue('dynamic');
  await expect(surface).toHaveValue('raised');
  await light.selectOption('static');
  await page.getByRole('combobox', { name: 'Direction', exact: true }).selectOption('fixed');
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
  await page.getByRole('combobox', { name: 'Direction', exact: true }).selectOption('fixed');
  await page.keyboard.press('Escape');
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await light.selectOption('dynamic');
  await page.keyboard.press('Escape');
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing card');
  await page.mouse.move(box.x + 2, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => Number.parseFloat(node.style.getPropertyValue('--wisp-angle'))),
    )
    .toBeCloseTo(270, 0);
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
  ).toBe('pnpm install --frozen-lockfile\npnpm dev');
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
  page, browserName,
}) => {
  await page.goto('/');
  // macOS WebKit uses Option+Tab to include links in keyboard navigation.
  await page.keyboard.press(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
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
  await page.locator('.preferences').getByRole('combobox', { name: 'Motion' }).selectOption('static');
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Docs', exact: true }).click();
  await page.reload();
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Style' })).toHaveValue('matte');
  await expect(page.locator('.preferences').getByRole('combobox', { name: 'Motion' })).toHaveValue('static');
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
    ['installation', 'Installation'], ['usage', 'Usage'], ['materials', 'Styles'],
    ['accessibility', 'Accessibility'], ['api', 'API reference'],
    ['react/materials', 'Styles'], ['react/accessibility', 'Accessibility'],
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
  await expect(groups.nth(1).getByRole('link')).toHaveText(['Styles', 'Accessibility']);
  await expect(groups.nth(2).getByRole('link')).toHaveText(['Installation', 'Usage', 'API reference']);
  await groups.nth(1).getByRole('link', { name: 'Styles', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/styles\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Styles');
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


test('static random direction is stable across appearance updates', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('combobox', { name: 'Motion', exact: true }).selectOption('static');
  await page.getByRole('combobox', { name: 'Direction', exact: true }).selectOption('random');
  const card = page.getByTestId('hero-surface');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).not.toBe('');
  const angle = await card.evaluate(node => node.style.getPropertyValue('--wisp-angle'));
  await page.getByRole('combobox', { name: 'Style', exact: true }).selectOption('matte');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe(angle);
  await page.getByRole('combobox', { name: 'Direction', exact: true }).selectOption('fixed');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
});


test('home and docs navigate without reloading or resetting the theme and header', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  const brand = page.locator('.wordmark');
  const before = await brand.boundingBox();
  await page.evaluate(() => { (window as unknown as { navigationMarker: boolean }).navigationMarker = true; });
  let documents = 0;
  page.on('request', request => { if (request.isNavigationRequest()) documents++; });
  await page.getByRole('link', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/\/docs\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  await expect(page.locator('html')).toHaveAttribute('data-bolerish-theme', 'dark');
  expect(await page.evaluate(() => (window as unknown as { navigationMarker: boolean }).navigationMarker)).toBe(true);
  expect((await brand.boundingBox())?.x).toBe(before?.x);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Light that reveals your interface.');
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Getting started');
  expect(documents).toBe(0);
});


test('scrolling and opening search keep the header in the same horizontal position', async ({ page }) => {
  await page.goto('/');
  const brand = page.locator('.wordmark');
  const initial = await brand.boundingBox();
  expect(await page.locator('html').evaluate(node => getComputedStyle(node).scrollbarGutter)).toBe('stable');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect.poll(async () => (await brand.boundingBox())?.x).toBe(initial?.x);
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  await expect.poll(async () => (await brand.boundingBox())?.x).toBe(initial?.x);
  await page.keyboard.press('Escape');
  await page.getByRole('link', { name: 'Docs', exact: true }).click();
  await expect.poll(async () => (await brand.boundingBox())?.x).toBe(initial?.x);
});


test('surface decoration aligns with the host border instead of drawing an inner ring', async ({ page }) => {
  await page.goto('/');
  const orbit = page.locator('.hero-example-orbit').first();
  await expect.poll(() => orbit.evaluate(node => {
    const host = getComputedStyle(node);
    const after = getComputedStyle(node, '::after');
    return Number.parseFloat(after.top) + Number.parseFloat(host.borderTopWidth);
  })).toBe(0);
});


test('border offsets follow asymmetric host borders and hidden startup stays consistent', async ({ page, browser }) => {
  const staticContext = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await staticContext.newPage();
  await staticPage.goto('http://127.0.0.1:4183/');
  expect(await staticPage.locator('.hero-example-orbit').first().evaluate(node => getComputedStyle(node, '::after').opacity)).toBe('0');
  await staticContext.close();
  await page.goto('/');
  const orbit = page.locator('.hero-example-orbit').first();
  expect(await orbit.evaluate(node => getComputedStyle(node, '::after').opacity)).toBe('0');
  await orbit.evaluate(node => {
    (node as HTMLElement).style.borderWidth = '2px 3px 4px 5px';
    window.dispatchEvent(new Event('resize'));
  });
  await expect.poll(() => orbit.evaluate(node => {
    const after = getComputedStyle(node, '::after');
    return [after.top, after.right, after.bottom, after.left];
  })).toEqual(['-2px', '-3px', '-4px', '-5px']);
  expect(await orbit.evaluate(node => getComputedStyle(node, '::after').backgroundImage)).not.toContain('0.533');
});


test('large-card center crossings fade before the edge direction reverses', async ({ page }) => {
  await page.goto('/');
  const surface = page.getByTestId('hero-surface');
  await surface.evaluate(node => {
    Object.assign((node as HTMLElement).style, { position: 'fixed', left: '100px', top: '100px', width: '766px', height: '316px', zIndex: '100' });
    window.dispatchEvent(new Event('resize'));
  });
  for (const x of [463, 503]) {
    await page.mouse.move(x, 258);
    await expect.poll(() => surface.evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')))).toBeLessThan(0.02);
  }
  await page.mouse.move(865, 258);
  await expect.poll(() => surface.evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')))).toBeGreaterThan(0.7);
});


test('the reading journey and document titles work without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const journey = [
    ['/docs/', 'Getting started · bolerish/edge'],
    ['/docs/react/', 'React · Installation · bolerish/edge'],
    ['/docs/react/usage/', 'React · Usage · bolerish/edge'],
    ['/docs/styles/', 'Guides · Styles · bolerish/edge'],
    ['/docs/accessibility/', 'Guides · Accessibility · bolerish/edge'],
    ['/docs/react/api/', 'React · API reference · bolerish/edge'],
  ] as const;
  await page.goto('http://127.0.0.1:4183/docs/');
  for (const [index, [path, title]] of journey.entries()) {
    await expect(page).toHaveURL(`http://127.0.0.1:4183${path}`);
    await expect(page).toHaveTitle(title);
    const reading = page.getByRole('navigation', { name: 'Continue reading' });
    if (index > 0) await expect(reading.locator('[rel="prev"]')).toHaveAttribute('href', journey[index - 1]![0]);
    if (index < journey.length - 1) await reading.locator('[rel="next"]').click();
    else await expect(reading.locator('[rel="next"]')).toHaveCount(0);
  }
  await context.close();
});

test('shared light demo preserves native controls and displays its executable source', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/react/usage/');
  const demo = page.getByRole('group', { name: 'Shared light controls', exact: true });
  const card = demo.getByRole('article');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await demo.getByRole('combobox', { name: 'Motion' }).selectOption('dynamic');
  const bounds = await card.boundingBox();
  if (!bounds) throw new Error('Missing demo card');
  await page.mouse.move(bounds.x + 1, bounds.y + bounds.height / 2);
  await expect.poll(() => card.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--wisp-angle')))).toBeCloseTo(270, 0);
  await demo.getByRole('textbox', { name: 'Project name' }).fill('My project');
  await expect(demo.getByRole('textbox', { name: 'Project name' })).toHaveValue('My project');
  await demo.getByRole('button', { name: 'Save project (0)', exact: true }).click();
  await expect(demo.getByRole('button', { name: 'Save project (1)', exact: true })).toBeVisible();
  expect(await demo.getByText('This ordinary element has no lighting decoration.', { exact: true }).evaluate(node => node.style.getPropertyValue('--wisp-strength'))).toBe('');
  const source = await readFile(new URL('./examples/shared-light.example.tsx', import.meta.url), 'utf8');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; } },
  }));
  await page.getByRole('button', { name: 'Copy One light, your components', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toBe(source);
});

test('style comparison shares a light with opposing recessed and softer matte edges', async ({ page }) => {
  await page.goto('/docs/styles/');
  const demo = page.getByRole('group', { name: 'Style comparison', exact: true });
  await demo.getByRole('combobox', { name: 'Motion' }).selectOption('static');
  const cards = demo.getByRole('article');
  await expect(cards).toHaveCount(3);
  await expect.poll(() => cards.nth(0).evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await expect.poll(() => cards.nth(1).evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('135.0deg');
  const raised = await cards.nth(0).evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')));
  await expect.poll(() => cards.nth(2).evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')))).toBeCloseTo(raised * 0.3, 2);
});

test('component and hook tables expose complete searchable options', async ({ page }) => {
  await page.goto('/docs/react/api/');
  for (const caption of ['Lighting props', 'useLight options']) {
    const table = page.getByRole('table', { name: caption, exact: true });
    for (const option of ['motion', 'staticDirection', 'radius', 'intensity'])
      await expect(table.getByRole('rowheader', { name: option, exact: true })).toBeVisible();
  }
  for (const caption of ['Lighting.Surface props', 'useSurface options']) {
    const table = page.getByRole('table', { name: caption, exact: true });
    for (const option of ['edgeStyle', 'theme', 'color', 'shadowColor', 'borderWidth', 'intensity', 'pseudoElement'])
      await expect(table.getByRole('rowheader', { name: option, exact: true })).toBeVisible();
  }
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  const query = dialog.getByRole('textbox', { name: 'Search titles and content' });
  await query.fill('shadowColor');
  await expect(dialog.locator('a[href="/docs/react/api/#lighting-surface"]')).toBeVisible();
  await expect(dialog.locator('a[href="/docs/react/api/#use-surface"]')).toBeVisible();
  await query.fill('One light, your components');
  await expect(dialog.locator('a[href="/docs/react/usage/#share-one-light"]')).toBeVisible();
});

test('existing section anchors remain in the catalog after rewriting the pages', async ({ page }) => {
  const anchors = {
    '/docs/': ['choose-your-framework'],
    '/docs/react/': ['package-installation', 'prepare-the-workspace', 'load-the-stylesheet', 'create-your-first-surface'],
    '/docs/react/usage/': ['share-one-light', 'keep-your-styles', 'wrap-inputs-you-own', 'connect-existing-components', 'refresh-after-layout-changes'],
    '/docs/styles/': ['raised', 'recessed', 'matte', 'apply-the-wisp-theme', 'customize-the-highlight'],
    '/docs/accessibility/': ['choose-an-input-mode', 'preserve-native-interactions', 'understand-rendering-cost'],
    '/docs/react/api/': ['lighting', 'lighting-surface', 'use-light', 'refresh', 'use-surface', 'rendering-and-cleanup'],
  };
  for (const [path, ids] of Object.entries(anchors)) {
    await page.goto(path);
    for (const id of ids) await expect(page.locator(`section[id="${id}"]`)).toHaveCount(1);
  }
});

test('decoration slots preserve consumer pseudo-elements and switch without extra DOM', async ({ page }) => {
  await page.goto('/docs/react/usage/');
  const ownAfter = page.locator('.edge-example-after');
  const ownBefore = page.locator('.edge-example-before');
  expect(await ownAfter.evaluate(node => getComputedStyle(node, '::after').content)).toBe('"Saved"');
  expect(await ownBefore.evaluate(node => getComputedStyle(node, '::before').content)).toBe('"Ready"');
  expect(await ownAfter.evaluate(node => getComputedStyle(node, '::before').backgroundImage)).toContain('conic-gradient');
  expect(await ownBefore.evaluate(node => getComputedStyle(node, '::after').backgroundImage)).toContain('conic-gradient');
  const host = page.getByTestId('decoration-slot');
  await expect.poll(() => host.evaluate(node => node.style.getPropertyValue('--wisp-inset-top'))).toBe('-2px');
  const geometry = await host.evaluate(node => {
    const decoration = getComputedStyle(node, '::before');
    return [decoration.top, decoration.right, decoration.bottom, decoration.left, decoration.borderRadius, decoration.padding, decoration.pointerEvents];
  });
  expect(geometry).toEqual(['-2px', '-3px', '-4px', '-5px', '16px', '2px', 'none']);
  await host.evaluate(node => { node.dataset.identity = 'original'; });
  await page.getByRole('button', { name: 'Use after decoration', exact: true }).click();
  await expect(host).toHaveAttribute('data-identity', 'original');
  expect(await host.evaluate(node => node.childElementCount)).toBe(0);
  expect(await host.evaluate(node => getComputedStyle(node, '::before').content)).toBe('none');
  expect(await host.evaluate(node => getComputedStyle(node, '::after').backgroundImage)).toContain('conic-gradient');
  await page.getByRole('button', { name: 'Use before decoration', exact: true }).click();
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await host.evaluate(node => getComputedStyle(node, '::before').opacity)).toBe('0');
  expect(await ownAfter.evaluate(node => getComputedStyle(node, '::after').content)).toBe('"Saved"');
});

test('search matches the shared layout and filters real document categories', async ({ page }) => {
  await page.goto('/docs/');
  await expect(page.locator('.example-preview')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Copy / })).toHaveCount(0);
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  await expect(dialog.getByRole('status')).toHaveText('Search documentation or choose a category.');
  await expect(dialog.locator('.search-results a')).toHaveCount(0);
  const query = dialog.getByRole('textbox', { name: 'Search titles and content' });
  await expect(query).toBeFocused();
  const inputBox = await query.boundingBox();
  const categoriesBox = await dialog.getByRole('navigation', { name: 'Search sections' }).boundingBox();
  expect(categoriesBox!.y).toBeGreaterThan(inputBox!.y + inputBox!.height);
  await dialog.getByRole('button', { name: '#React', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(3);
  await expect(dialog.locator('.search-results a').filter({ hasText: 'React ·' })).toHaveCount(3);
  await query.fill('shadowColor');
  await expect(dialog.locator('a[href="/docs/react/api/#use-surface"]')).toBeVisible();
  await dialog.getByRole('button', { name: '#Guides', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(1);
  await expect(dialog.locator('a[href="/docs/styles/#customize-the-highlight"]')).toBeVisible();
  await query.fill('no-matching-document-987');
  await expect(dialog.getByRole('status')).toContainText('No documents found');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '#All', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(query).toHaveValue('');
  await page.setViewportSize({ width: 390, height: 844 });
  const bounds = await dialog.boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390);
});
