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

test('appearance controls update the document and persist across navigation', async ({ page }) => {
  await page.goto('/docs/motion/');
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toHaveCount(0);
  const motion = page.getByRole('combobox', { name: 'Motion', exact: true });
  await motion.click();
  await page.getByRole('option', { name: 'Static', exact: true }).click();
  await page.getByRole('combobox', { name: 'Static direction', exact: true }).click();
  await page.getByRole('option', { name: '315°', exact: true }).click();
  const card = page.getByRole('group', { name: 'Motion comparison', exact: true }).getByRole('article');
  const frame = page.locator('.example-preview-result');
  for (const target of [card, frame])
    await expect.poll(() => target.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await page.locator('.sidebar').getByRole('link', { name: 'Style', exact: true }).click();
  await page.getByRole('combobox', { name: 'Style', exact: true }).click();
  await page.getByRole('option', { name: 'Recessed', exact: true }).click();
  await expect.poll(() => page.locator('.reading-navigation a').first().evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('135.0deg');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'Style', exact: true })).toContainText('Recessed');
  await page.locator('.sidebar').getByRole('link', { name: 'Motion', exact: true }).click();
  await expect(motion).toContainText('Static');
  await page.getByRole('group', { name: 'Compare motion', exact: true }).getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Compare motion code', exact: true })).toContainText('motion: "static"');
  await page.goto('/');
  await expect.poll(() => page.getByTestId('surface-card').evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('135.0deg');
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
  const copy = page.getByRole('button', { name: 'Copy npm installation', exact: true });
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

test('getting started owns shared installation and the AI prompt without demos', async ({ page }) => {
  await page.goto('/docs/installation/');
  await expect(page.locator('.example-preview')).toHaveCount(0);
  const install = page.locator('#installation');
  for (const [manager, command] of [
    ['npm', 'npm install @bolerish/edge'], ['pnpm', 'pnpm add @bolerish/edge'],
    ['Yarn', 'yarn add @bolerish/edge'], ['Bun', 'bun add @bolerish/edge'],
  ] as const) {
    await install.getByRole('tab', { name: manager, exact: true }).click();
    await expect(install.getByRole('region', { name: `${manager} installation code`, exact: true })).toContainText(command);
  }
  await expect(install.locator('details')).toHaveCount(0);
  await expect(install.getByRole('tab', { name: 'AI', exact: true })).toHaveCount(0);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; } },
  }));
  await install.getByRole('button', { name: 'Copy prompt', exact: true }).click();
  await expect(install.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  const prompt = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(prompt).toContain('React 18 or 19');
  expect(prompt).toContain('@bolerish/edge/style.css');
  expect(prompt).toContain('Do not add a demo page');
  await expect(install.getByRole('button', { name: 'Copy prompt', exact: true })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async () => { throw new Error('Denied'); } },
  }));
  await install.getByRole('button', { name: 'Copy prompt', exact: true }).click();
  await expect(install.getByRole('status').last()).toContainText('Copy unavailable');
  await expect(install.locator('pre[aria-label="Installation prompt"]')).toContainText(prompt);

  await expect(page.locator('#stylesheet')).toContainText('@import "@bolerish/edge/style.css";');
  await expect(page.getByRole('list', { name: 'Framework integrations' })).toHaveCount(0);
  await page.goto('/docs/react/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Integration');
});

test('static direction presets update every shared surface, code and persisted settings', async ({ page }) => {
  await page.goto('/docs/motion/');
  await page.getByRole('combobox', { name: 'Motion', exact: true }).click();
  await page.getByRole('option', { name: 'Static', exact: true }).click();
  const example = page.getByRole('group', { name: 'Compare motion', exact: true });
  for (const angle of [0, 90, 180, 270, 315]) {
    await example.getByRole('combobox', { name: 'Static direction', exact: true }).click();
    await page.getByRole('option', { name: `${angle}°`, exact: true }).click();
    for (const target of [example.getByRole('article'), page.locator('.example-preview-result')])
      await expect.poll(() => target.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe(`${angle.toFixed(1)}deg`);
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(example.getByRole('region', { name: 'Compare motion code', exact: true })).toContainText(`staticDirection: ${angle}`);
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
  }
  await page.reload();
  await expect(example.getByRole('combobox', { name: 'Static direction', exact: true })).toContainText('315°');
});

test('preview data stays fixed and getting started leads directly to React usage', async ({
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction');
  await page.getByRole('link', { name: 'React Integration', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\/react\/usage\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Integration');
});

test('SSG documents include highlighted code and remain readable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4183/docs/');
  await page.getByRole('link', { name: 'React Integration', exact: true }).click();
  await expect(page).toHaveURL('http://127.0.0.1:4183/docs/react/usage/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Integration',
  );
  await expect(page.locator('.token.tag:visible').first()).toBeVisible();
  await expect(page.locator('pre').first()).toContainText('Edge.Surface');
  await page.goto('http://127.0.0.1:4183/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'A little more alive.',
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
  await page.goto('/docs/react/usage/');
  await page.getByRole('group', { name: 'One light, your components', exact: true }).getByRole('tab', { name: 'Code', exact: true }).click();
  const code = page.locator('pre:visible').last();
  await page.keyboard.press('Tab');
  await code.focus();
  await expect(code).toBeFocused();
  expect(
    await code.evaluate((node) => getComputedStyle(node).outlineStyle),
  ).toBe('solid');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await page
      .locator('.token.tag')
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
  await dialog.locator('a[href="/docs/installation/"]').click();
  await expect(page).toHaveURL(/\/docs\/installation\/$/);
});

test('API navigation follows the URL hash after hydration and in-page navigation', async ({ page }) => {
  await page.goto('/docs/react/api/#use-surface');
  const sidebar = page.locator('.sidebar');
  const toc = page.locator('.table-of-contents');
  await expect(sidebar.getByRole('link', { name: 'API reference', exact: true }))
    .toHaveAttribute('aria-current', 'page');
  await expect(toc.getByRole('link', { name: 'useSurface(options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
  await page.locator('.table-of-contents').getByRole('link', { name: 'useLight(options?)', exact: true }).click();
  await expect(toc.getByRole('link', { name: 'useLight(options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
  await expect(toc.getByRole('link', { name: 'useSurface(options?)', exact: true }))
    .not.toHaveAttribute('aria-current');
});


test('previous guide URLs preserve their content and API anchors', async ({ page }) => {
  for (const [slug, title] of [
    ['installation', 'Installation'], ['usage', 'Usage'], ['materials', 'Style'],
    ['accessibility', 'Accessibility'], ['api', 'API reference'],
    ['react/materials', 'Style'], ['react/accessibility', 'Accessibility'],
  ] as const) {
    await page.goto(`/docs/${slug}/`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    await expect(page.locator('.sidebar').getByRole('link', { name: title, exact: true }))
      .toHaveAttribute('aria-current', 'page');
  }
  await page.goto('/docs/api/#use-surface');
  await expect(page.locator('.table-of-contents').getByRole('link', { name: 'useSurface(options?)', exact: true }))
    .toHaveAttribute('aria-current', 'location');
});


test('framework search uses canonical React guides and contextual labels', async ({ page }) => {
  await page.goto('/docs/getting-started/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction');
  await page.getByRole('button', { name: 'Search documentation' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('textbox', { name: 'Search titles and content' }).fill('React Integration');
  const result = dialog.locator('a[href="/docs/react/usage/"]');
  await expect(result).toContainText('React · Integration');
  await expect(result).toHaveAttribute('href', '/docs/react/usage/');
});


test('shared guides appear before framework-specific documentation', async ({ page }) => {
  await page.goto('/docs/');
  const groups = page.locator('.sidebar .nav-group');
  await expect(groups).toHaveCount(5);
  await expect(groups.nth(0).getByRole('link')).toHaveText(['Introduction', 'Installation']);
  await expect(groups.nth(1).getByRole('link')).toHaveText(['Usage']);
  await expect(groups.nth(1).locator('h2, h3')).toHaveCount(0);
  await expect(groups.nth(2)).toContainText('Styles');
  await expect(groups.nth(2).getByRole('link')).toHaveText(['Style', 'Motion']);
  await expect(groups.nth(3).getByRole('link')).toHaveText(['Integration', 'Accessibility']);
  await expect(groups.nth(4).getByRole('link')).toHaveText(['Integration', 'API reference']);
  await groups.nth(2).getByRole('link', { name: 'Style', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/styles\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Style');
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction');
  await expect(page.locator('html')).toHaveAttribute('data-bolerish-theme', 'dark');
  expect(await page.evaluate(() => (window as unknown as { navigationMarker: boolean }).navigationMarker)).toBe(true);
  expect((await brand.boundingBox())?.x).toBe(before?.x);
  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A little more alive.');
  await page.goForward();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Introduction');
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
    ['/docs/', 'Getting started · Introduction · bolerish/edge'],
    ['/docs/installation/', 'Getting started · Installation · bolerish/edge'],
    ['/docs/usage/', 'Usage · bolerish/edge'],
    ['/docs/react/usage/', 'React · Integration · bolerish/edge'],
    ['/docs/styles/', 'Styles · Style · bolerish/edge'],
    ['/docs/motion/', 'Styles · Motion · bolerish/edge'],
    ['/docs/integration/', 'Guides · Integration · bolerish/edge'],
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

test('shared light demo uses site settings and shows concise integration code', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wisp:preferences:v1', JSON.stringify({ motion: 'static', staticDirection: 315 })));
  await page.goto('/docs/react/usage/');
  const demo = page.getByRole('group', { name: 'Shared light example', exact: true });
  const cards = demo.getByRole('article');
  await expect(cards).toHaveCount(2);
  const card = cards.first();
  await expect.poll(() => cards.nth(1).evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await expect(demo.getByRole('combobox')).toHaveCount(0);
  const bounds = await card.boundingBox();
  if (!bounds) throw new Error('Missing demo card');
  await page.mouse.move(bounds.x + 1, bounds.y + bounds.height / 2);
  await expect.poll(() => card.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--wisp-angle')))).toBeCloseTo(315, 0);
  await expect(demo.getByRole('button')).toHaveCount(0);
  await expect(demo.getByRole('textbox')).toHaveCount(0);
  await expect(demo.getByText('Example card', { exact: true })).toBeVisible();
  await expect(demo.getByText('Another example card', { exact: true })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; } },
  }));
  await page.getByRole('group', { name: 'One light, your components', exact: true }).getByRole('tab', { name: 'Code', exact: true }).click();
  await page.getByRole('button', { name: 'Copy One light, your components', exact: true }).click();
  const copied = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(copied).toContain('<Edge.Provider>');
  expect(copied).toContain('<Edge.Surface>Example card</Edge.Surface>');
  expect(copied).toContain('<Edge.Surface>Another example card</Edge.Surface>');
  expect(copied).not.toContain('saveProject');
  expect(copied).not.toContain('<Input');
  expect(copied).not.toContain('useState');
  expect(copied).not.toContain('style.css');
});

test('style example changes only edge style and retains Bolerish UI colors', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wisp:preferences:v1', JSON.stringify({ motion: 'static', staticDirection: 'fixed' })));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/styles/');
  const demo = page.getByRole('group', { name: 'Style comparison', exact: true });
  await expect(demo.getByRole('combobox', { name: 'Motion' })).toHaveCount(0);
  const card = demo.getByRole('article');
  await expect.poll(() => card.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--wisp-angle')))).not.toBeNaN();
  const initialColor = await card.evaluate(node => getComputedStyle(node).backgroundColor);
  await demo.getByRole('combobox', { name: 'Style', exact: true }).click();
  await page.getByRole('option', { name: 'Recessed', exact: true }).click();
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('135.0deg');
  const strength = await card.evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')));
  await demo.getByRole('combobox', { name: 'Style', exact: true }).click();
  await page.getByRole('option', { name: 'Matte', exact: true }).click();
  await expect.poll(() => card.evaluate(node => Number(node.style.getPropertyValue('--wisp-strength')))).toBeCloseTo(strength * 0.3, 2);
  expect(await card.evaluate(node => getComputedStyle(node).backgroundColor)).toBe(initialColor);
  await page.getByRole('group', { name: 'Compare edge styles', exact: true }).getByRole('tab', { name: 'Code', exact: true }).click();
  const source = page.getByRole('region', { name: 'Compare edge styles code', exact: true });
  await expect(source).toContainText('const light = useLight()');
  await expect(source).not.toContainText('const edgeStyles');
  await expect(source).toContainText('edgeStyle: "matte"');
  await expect(source).not.toContainText('useState');
  await expect(source).not.toContainText('SelectTrigger');
  await expect(source).not.toContainText('#262d20');
});

test('component and hook tables expose complete searchable options', async ({ page }) => {
  await page.goto('/docs/react/api/');
  for (const caption of ['Edge.Provider props', 'useLight options']) {
    const table = page.getByRole('table', { name: caption, exact: true });
    for (const option of ['motion', 'staticDirection', 'radius', 'intensity'])
      await expect(table.getByRole('rowheader', { name: option, exact: true })).toBeVisible();
  }
  for (const caption of ['Edge.Surface props', 'useSurface options']) {
    const table = page.getByRole('table', { name: caption, exact: true });
    for (const option of ['edgeStyle', 'color', 'shadowColor', 'borderWidth', 'intensity', 'pseudoElement'])
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
    '/docs/usage/': ['share-one-light', 'keep-your-styles', 'connect-existing-components', 'package-installation', 'prepare-the-workspace', 'load-the-stylesheet', 'create-your-first-surface', 'wrap-inputs-you-own', 'refresh-after-layout-changes'],
    '/docs/react/usage/': ['share-one-light', 'keep-your-styles', 'wrap-inputs-you-own', 'connect-existing-components', 'refresh-after-layout-changes'],
    '/docs/styles/': ['raised', 'recessed', 'matte', 'apply-the-wisp-theme', 'customize-the-highlight'],
    '/docs/accessibility/': ['choose-an-input-mode', 'preserve-native-interactions', 'understand-rendering-cost'],
    '/docs/react/api/': ['lighting', 'lighting-surface', 'use-light', 'refresh', 'use-surface', 'rendering-and-cleanup'],
  };
  for (const [path, ids] of Object.entries(anchors)) {
    await page.goto(path);
    for (const id of ids) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
});

test('decoration slots preserve consumer pseudo-elements and switch without extra DOM', async ({ page }) => {
  await page.goto('/docs/integration/');
  const example = page.getByRole('group', { name: 'Keep existing pseudo-elements', exact: true });
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  const code = example.getByRole('region', { name: 'Keep existing pseudo-elements code', exact: true });
  await expect(code).toContainText("import { Edge } from '@bolerish/edge'");
  await expect(code).toContainText('pseudoElement="before"');
  await expect(code).not.toContainText('getSurfaceProps');
  await example.getByRole('tab', { name: 'Preview', exact: true }).click();
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
  await page.getByRole('button', { name: 'Search documentation', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Search documentation' });
  await expect(dialog.getByRole('status')).toHaveText('Search documentation or choose a category.');
  await expect(dialog.locator('.search-results a')).toHaveCount(0);
  const query = dialog.getByRole('textbox', { name: 'Search titles and content' });
  await expect(query).toBeFocused();
  const inputBox = await query.boundingBox();
  const categoriesBox = await dialog.getByRole('navigation', { name: 'Search sections' }).boundingBox();
  expect(categoriesBox!.y).toBeGreaterThan(inputBox!.y + inputBox!.height);
  await dialog.getByRole('button', { name: '#Getting started', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(2);
  await expect(dialog.locator('.search-results a').filter({ hasText: 'Getting started ·' })).toHaveCount(2);
  await dialog.getByRole('button', { name: '#Usage', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(1);
  await expect(dialog.locator('a[href="/docs/usage/"]')).toBeVisible();
  await dialog.getByRole('button', { name: '#Guides', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(2);
  await expect(dialog.locator('.search-results a').filter({ hasText: 'Getting started ·' })).toHaveCount(0);
  await dialog.getByRole('button', { name: '#React', exact: true }).click();
  await expect(dialog.locator('.search-results a')).toHaveCount(2);
  await expect(dialog.locator('.search-results a').filter({ hasText: 'React ·' })).toHaveCount(2);
  await query.fill('shadowColor');
  await expect(dialog.locator('a[href="/docs/react/api/#use-surface"]')).toBeVisible();
  await dialog.getByRole('button', { name: '#Styles', exact: true }).click();
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

test('appearance pages expose topic options and examples retain state across preview and code tabs', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('wisp:preferences:v1', JSON.stringify({ motion: 'system', staticDirection: 'fixed' })));
  await page.goto('/docs/motion/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Motion');
  const table = page.getByRole('table', { name: 'Motion values', exact: true });
  for (const name of ['system', 'dynamic', 'static'])
    await expect(table.getByRole('rowheader', { name, exact: true })).toBeVisible();
  const example = page.getByRole('group', { name: 'Compare motion', exact: true });
  await expect(example.getByRole('combobox', { name: 'Static direction', exact: true })).toHaveCount(0);
  await expect(table.getByRole('rowheader', { name: 'radius', exact: true })).toHaveCount(0);
  await example.getByRole('combobox', { name: 'Motion', exact: true }).click();
  await page.getByRole('option', { name: 'Static', exact: true }).click();
  const card = example.getByRole('article');
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe('315.0deg');
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(example.getByRole('region', { name: 'Compare motion code', exact: true })).toContainText('staticDirection');
  await expect(card).toBeHidden();
  await example.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(example.getByRole('combobox', { name: 'Motion', exact: true })).toContainText('Static');
  await example.getByRole('combobox', { name: 'Static direction', exact: true }).click();
  await page.getByRole('option', { name: 'Random per mount', exact: true }).click();
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).not.toBe('315.0deg');
  const angle = await card.evaluate(node => node.style.getPropertyValue('--wisp-angle'));
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  await example.getByRole('tab', { name: 'Preview', exact: true }).click();
  expect(await card.evaluate(node => node.style.getPropertyValue('--wisp-angle'))).toBe(angle);
  await page.goto('/docs/styles/');
  const styleTable = page.getByRole('table', { name: 'Style values', exact: true });
  await expect(styleTable.getByRole('rowheader', { name: 'color', exact: true })).toHaveCount(0);
  for (const name of ['raised', 'recessed', 'matte'])
    await expect(styleTable.getByRole('rowheader', { name, exact: true })).toBeVisible();
});

test('documentation surfaces share page lighting and keep native links and independent demos', async ({ page }) => {
  await page.goto('/docs/');
  const next = page.locator('.reading-navigation [rel="next"]');
  await next.scrollIntoViewIfNeeded();
  const bounds = await next.boundingBox();
  if (!bounds) throw new Error('Missing reading link');
  await page.mouse.move(bounds.x + 2, bounds.y + bounds.height / 2);
  await expect.poll(() => next.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--wisp-angle')))).toBeCloseTo(270, 0);
  await next.click();
  await expect(page).toHaveURL(/\/docs\/installation\/$/);
  const code = page.locator('.code-block').first();
  await code.scrollIntoViewIfNeeded();
  const codeBounds = await code.boundingBox();
  if (!codeBounds) throw new Error('Missing code block');
  await page.mouse.move(codeBounds.x + 2, codeBounds.y + codeBounds.height / 2);
  await expect.poll(() => code.evaluate(node => Number.parseFloat(node.style.getPropertyValue('--wisp-angle')))).toBeCloseTo(270, 0);
  expect(await code.evaluate(node => getComputedStyle(node, '::after').pointerEvents)).toBe('none');
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await code.evaluate(node => getComputedStyle(node, '::after').opacity)).toBe('0');
});

test('code preserves source indentation on desktop and mobile', async ({ page }) => {
  await page.goto('/docs/styles/');
  await page.getByRole('group', { name: 'Compare edge styles', exact: true }).getByRole('tab', { name: 'Code', exact: true }).click();
  const code = page.getByRole('region', { name: 'Compare edge styles code', exact: true });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await code.evaluate(node => getComputedStyle(node).fontSize)).toBe('14px');
    expect(await code.evaluate(node => getComputedStyle(node).tabSize)).toBe('4');
    expect(await code.textContent()).toContain('  Your component');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('usage and integration previews align on desktop and stack without overflow on mobile', async ({ page }) => {
  for (const route of ['/docs/react/usage/', '/docs/integration/']) {
    await page.goto(route);
    const layout = page.locator(route.includes('usage') ? '.shared-light-example' : '.decoration-slot-example');
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const first = await layout.locator(':scope > *').nth(0).boundingBox();
      const second = await layout.locator(':scope > *').nth(1).boundingBox();
      if (!first || !second) throw new Error('Missing preview items');
      if (width === 1440) {
        expect(Math.abs(first.y - second.y)).toBeLessThan(1);
        expect(second.x).toBeGreaterThanOrEqual(first.x + first.width + 15);
      } else {
        expect(second.y).toBeGreaterThanOrEqual(first.y + first.height + 15);
        expect(Math.abs(first.x - second.x)).toBeLessThan(1);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});

test('surface style changes remeasure host border offsets with a stationary pointer', async ({ page }) => {
  await page.goto('/docs/styles/');
  const card = page.getByRole('group', { name: 'Style comparison', exact: true }).getByRole('article');
  await card.evaluate(node => {
    Object.assign(node.style, { boxSizing: 'content-box', width: '200px', height: '120px', borderStyle: 'solid', borderWidth: '1px' });
    node.dataset.identity = 'original';
  });
  await expect.poll(() => card.evaluate(node => node.style.getPropertyValue('--wisp-inset-top'))).toBe('-1px');
  const contentWidth = await card.evaluate(node => node.clientWidth);
  await card.evaluate(node => { node.style.borderWidth = '2px 3px 4px 5px'; });
  expect(await card.evaluate(node => node.clientWidth)).toBe(contentWidth);
  await page.getByRole('combobox', { name: 'Style', exact: true }).click();
  await page.getByRole('option', { name: 'Matte', exact: true }).click();
  await expect(card).toHaveAttribute('data-identity', 'original');
  await expect.poll(() => card.evaluate(node => ['top', 'right', 'bottom', 'left'].map(side => node.style.getPropertyValue(`--wisp-inset-${side}`))))
    .toEqual(['-2px', '-3px', '-4px', '-5px']);
});

test('React Integration teaches components and links advanced hooks to the API', async ({ page }) => {
  await page.goto('/docs/react/usage/');
  await expect(page.getByRole('region', { name: 'Connect an existing host code', exact: true })).toHaveCount(0);
  await expect(page.locator('#connect-existing-components a').first()).toHaveAttribute('href', '/docs/react/api/#use-surface');
  const example = page.getByRole('group', { name: 'One light, your components', exact: true });
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  const code = example.getByRole('region', { name: 'One light, your components code', exact: true });
  await expect(code).toContainText('<Edge.Provider>');
  await expect(code).toContainText('<Edge.Surface');
  await expect(code).not.toContainText('useLight');
  await expect(code).not.toContainText('className');
  await page.locator('#connect-existing-components a').first().click();
  await expect(page.getByRole('region', { name: 'Share one light with existing components code', exact: true })).toContainText('<Edge.Provider><ExistingCard /><ExistingCard /></Edge.Provider>');
});

test('plain CSS follows host color and radius while preserving its layout and background', async ({ page }) => {
  await page.goto('/docs/integration/');
  const host = page.locator('.edge-example-before');
  await page.addStyleTag({ content: '@layer consumer-layout { .edge-consumer-layout { position: absolute; } }' });
  await host.evaluate(node => {
    node.classList.add('edge-consumer-layout');
    node.style.color = 'rgb(12, 123, 234)';
    node.style.backgroundColor = 'rgb(245, 240, 235)';
    node.style.borderRadius = '23px';
  });
  const appearance = await host.evaluate(node => {
    const own = getComputedStyle(node);
    const decoration = getComputedStyle(node, '::after');
    return { color: own.color, background: own.backgroundColor, position: own.position,
      radius: decoration.borderRadius, highlight: decoration.backgroundImage,
      decorationColor: decoration.color, pointer: decoration.pointerEvents };
  });
  expect(appearance.color).toBe('rgb(12, 123, 234)');
  expect(appearance.background).toBe('rgb(245, 240, 235)');
  expect(appearance.position).toBe('absolute');
  expect(appearance.radius).toBe('23px');
  expect(appearance.decorationColor).toBe(appearance.color);
  expect(appearance.highlight).toContain(appearance.color);
  expect(appearance.pointer).toBe('none');
});


test('common Usage teaches shared concepts and leads to the React adapter', async ({ page }) => {
  await page.goto('/docs/installation/');
  await page.getByRole('navigation', { name: 'Continue reading' }).locator('[rel="next"]').click();
  await expect(page).toHaveURL(/\/docs\/usage\/$/);
  const document = page.locator('.document');
  await expect(document.getByRole('heading', { level: 1 })).toHaveText('Usage');
  await expect(document).not.toContainText('Edge.Surface');
  await expect(document.locator('.example-preview, pre')).toHaveCount(0);
  await expect(document).toContainText('currently available adapter');
  await document.getByRole('link', { name: 'React Integration', exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/react\/usage\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Integration');
  await expect(page.getByRole('group', { name: 'Shared light example', exact: true }).getByRole('article')).toHaveCount(2);
});
