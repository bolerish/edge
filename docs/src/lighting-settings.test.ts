import { test, expect } from '@playwright/test';

for (const saved of [
  { direction: 'gather', radius: 100, expectedDirection: 'toward', expectedRange: 100 },
  { direction: 'spread', radius: 100, expectedDirection: 'away', expectedRange: 100 },
  { direction: 'toward', range: 100, radius: 40, expectedDirection: 'toward', expectedRange: 100 },
  { direction: 'away', range: 100, radius: 40, expectedDirection: 'away', expectedRange: 100 },
  { direction: 'unknown', range: 0, radius: 100, expectedDirection: 'toward', expectedRange: 480 },
]) {
  test(`saved ${saved.direction} settings keep their meaning with the renamed API`, async ({
    page,
  }) => {
    await page.addInitScript((saved) => {
      if (localStorage.getItem('edge:preferences:v1') === null) {
        localStorage.setItem(
          'edge:preferences:v1',
          JSON.stringify({ ...saved, edgeStyle: 'recessed', motion: 'dynamic', theme: 'dark' }),
        );
      }
    }, saved);
    await page.goto('/docs/motion/');
    const direction = page.getByRole('combobox', { name: 'direction', exact: true });
    await expect(direction).toHaveText(saved.expectedDirection);
    await expect(page.getByRole('slider', { name: 'range', exact: true })).toHaveAttribute(
      'aria-valuenow',
      String(saved.expectedRange),
    );
    const example = page.getByRole('group', { name: 'Pointer lighting', exact: true });
    const card = example.getByRole('article');
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    if (!box) throw new Error('Missing pointer lighting card');
    await page.mouse.move(box.x + 4, box.y + box.height / 2);
    await expect(card).toHaveCSS(
      '--edge-angle',
      saved.expectedDirection === 'toward' ? '270.0deg' : '90.0deg',
    );
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(
      example.getByRole('region', { name: 'Pointer lighting code', exact: true }),
    ).toContainText(`direction: "${saved.expectedDirection}", range: ${saved.expectedRange}`);
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
    const next = saved.expectedDirection === 'toward' ? 'away' : 'toward';
    await direction.click();
    await page.getByRole('option', { name: next, exact: true }).click();
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('edge:preferences:v1') ?? '{}'),
    );
    expect(stored).toMatchObject({
      direction: next,
      range: saved.expectedRange,
      edgeStyle: 'recessed',
      motion: 'dynamic',
      theme: 'dark',
    });
    expect(stored).not.toHaveProperty('radius');
    await page.reload();
    await expect(direction).toHaveText(next);
    await expect(page.getByRole('slider', { name: 'range', exact: true })).toHaveAttribute(
      'aria-valuenow',
      String(saved.expectedRange),
    );
  });
}

test('direction and range update live surfaces and persist across pages', async ({ page }) => {
  await page.goto('/docs/motion/');
  const surface = page
    .getByRole('group', { name: 'Motion comparison', exact: true })
    .getByRole('article');
  const move = async () => {
    await surface.scrollIntoViewIfNeeded();
    const rect = await surface.boundingBox();
    if (!rect) throw new Error('Missing demo surface');
    await page.mouse.move(rect.x + rect.width + 20, rect.y + rect.height / 2);
  };
  await move();
  await expect(surface).toHaveCSS('--edge-angle', '90.0deg');
  await page.getByRole('combobox', { name: 'direction', exact: true }).click();
  await page.getByRole('option', { name: 'away', exact: true }).click();
  await move();
  await expect(surface).toHaveCSS('--edge-angle', '270.0deg');
  const range = page.getByRole('slider', { name: 'range' });
  await range.focus();
  await range.press('ArrowRight');
  await expect(range).toHaveAttribute('aria-valuenow', '500');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'direction', exact: true })).toHaveText('away');
  await expect(page.getByRole('slider', { name: 'range' })).toHaveAttribute('aria-valuenow', '500');
  await page.goto('/');
  await expect(page.getByRole('slider', { name: 'range' })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'direction', exact: true })).toHaveCount(0);
  await page.goto('/docs/motion/');
  await expect(page.getByRole('combobox', { name: 'direction', exact: true })).toHaveText('away');
  await expect(page.getByRole('slider', { name: 'range' })).toHaveAttribute('aria-valuenow', '500');
  await page
    .getByRole('group', { name: 'Compare motion', exact: true })
    .getByRole('tab', { name: 'Code', exact: true })
    .click();
  await expect(page.locator('pre').filter({ hasText: 'direction: "away"' }).first()).toContainText(
    'range: 500',
  );
});

for (const theme of ['light', 'dark'] as const) {
  for (const edgeStyle of ['raised', 'recessed', 'matte'] as const) {
    test(`${theme} ${edgeStyle}: toward faces the pointer and away faces away`, async ({
      page,
    }) => {
      await page.addInitScript(
        ({ theme, edgeStyle }) => {
          localStorage.setItem(
            'edge:preferences:v1',
            JSON.stringify({
              theme,
              edgeStyle,
              motion: 'dynamic',
              direction: 'toward',
              range: 100,
            }),
          );
        },
        { theme, edgeStyle },
      );
      await page.goto('/docs/motion/');
      const example = page.getByRole('group', { name: 'Pointer lighting', exact: true });
      const card = example.getByRole('article');
      await card.scrollIntoViewIfNeeded();
      const move = async () => {
        await card.scrollIntoViewIfNeeded();
        const box = await card.boundingBox();
        if (!box) throw new Error('Missing direction card');
        await page.mouse.move(box.x + 4, box.y + box.height / 2);
      };
      await move();
      await expect(card).toHaveCSS('--edge-angle', '270.0deg');
      const appearance = await card.evaluate((node) => {
        const css = getComputedStyle(node, '::after');
        return {
          background: css.backgroundImage,
          content: css.content,
          inset: parseFloat(css.top),
          base: parseFloat(node.style.getPropertyValue('--edge-inset-top')),
        };
      });
      expect(appearance.background).toContain('from 230deg');
      expect(appearance.content).toBe('""');
      expect(appearance.inset).toBe(appearance.base + (edgeStyle === 'recessed' ? 1 : 0));
      await page.getByRole('combobox', { name: 'direction', exact: true }).click();
      await page.getByRole('option', { name: 'away', exact: true }).click();
      await move();
      await expect(card).toHaveCSS('--edge-angle', '90.0deg');
      expect(
        await card.evaluate((node) => getComputedStyle(node, '::after').backgroundImage),
      ).toContain('from 50deg');
      await page.addStyleTag({
        content:
          '.bolerish-edge { position: absolute; } .bolerish-edge::after { background-image: none; }',
      });
      await expect(card).toHaveCSS('position', 'absolute');
      expect(await card.evaluate((node) => getComputedStyle(node, '::after').backgroundImage)).toBe(
        'none',
      );
    });
  }
}

test('range changes the outside fade with a stationary pointer and keeps the inside strength', async ({
  page,
}) => {
  await page.goto('/docs/styles/');
  await expect(page.getByRole('combobox', { name: 'Style', exact: true })).toHaveText('Raised');
  await page.goto('/docs/motion/');
  const example = page.getByRole('group', { name: 'Pointer lighting', exact: true });
  const card = example.getByRole('article');
  const range = page.getByRole('slider', { name: 'range', exact: true });
  await card.scrollIntoViewIfNeeded();
  await range.focus();
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing pointer lighting card');
  const strength = () => card.evaluate((node) => node.style.getPropertyValue('--edge-strength'));
  await page.mouse.move(box.x + box.width + 60, box.y + box.height / 2);
  await range.press('Home');
  await expect(range).toHaveAttribute('aria-valuenow', '40');
  await expect.poll(strength).toBe('0.000');
  await page.mouse.move(box.x + box.width + 20, box.y + box.height / 2);
  await expect.poll(async () => Number(await strength())).toBeGreaterThan(0);
  await page.mouse.move(box.x + box.width + 40, box.y + box.height / 2);
  await expect.poll(strength).toBe('0.000');
  await page.mouse.move(box.x + box.width + 60, box.y + box.height / 2);
  await range.press('End');
  await expect(range).toHaveAttribute('aria-valuenow', '1200');
  await expect.poll(async () => Number(await strength())).toBeGreaterThan(0.6);
  await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
  await range.press('Home');
  await expect.poll(strength).toBe('0.750');
  await range.press('End');
  await expect.poll(strength).toBe('0.750');
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(
    example.getByRole('region', { name: 'Pointer lighting code', exact: true }),
  ).toContainText('range: 1200');
});
