import { test, expect } from '@playwright/test';

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
  await page.getByRole('option', { name: 'spread', exact: true }).click();
  await move();
  await expect(surface).toHaveCSS('--edge-angle', '270.0deg');
  const range = page.getByRole('slider', { name: 'radius' });
  await range.focus();
  await range.press('ArrowRight');
  await expect(range).toHaveAttribute('aria-valuenow', '500');
  await page.reload();
  await expect(page.getByRole('combobox', { name: 'direction', exact: true })).toHaveText('spread');
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveAttribute(
    'aria-valuenow',
    '500',
  );
  await page.goto('/');
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'direction', exact: true })).toHaveCount(0);
  await page.goto('/docs/motion/');
  await expect(page.getByRole('combobox', { name: 'direction', exact: true })).toHaveText('spread');
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveAttribute(
    'aria-valuenow',
    '500',
  );
  await page
    .getByRole('group', { name: 'Compare motion', exact: true })
    .getByRole('tab', { name: 'Code', exact: true })
    .click();
  await expect(
    page.locator('pre').filter({ hasText: 'direction: "spread"' }).first(),
  ).toContainText('radius: 500');
});

for (const theme of ['light', 'dark'] as const) {
  for (const edgeStyle of ['raised', 'recessed', 'matte'] as const) {
    test(`${theme} ${edgeStyle}: gather faces the pointer and spread faces away`, async ({
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
              direction: 'gather',
              radius: 100,
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
      await page.getByRole('option', { name: 'spread', exact: true }).click();
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

test('radius changes the outside fade with a stationary pointer and keeps the inside strength', async ({
  page,
}) => {
  await page.goto('/docs/styles/');
  await expect(page.getByRole('combobox', { name: 'Style', exact: true })).toHaveText('Raised');
  await page.goto('/docs/motion/');
  const example = page.getByRole('group', { name: 'Pointer lighting', exact: true });
  const card = example.getByRole('article');
  const radius = page.getByRole('slider', { name: 'radius', exact: true });
  await card.scrollIntoViewIfNeeded();
  await radius.focus();
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing pointer lighting card');
  const strength = () => card.evaluate((node) => node.style.getPropertyValue('--edge-strength'));
  await page.mouse.move(box.x + box.width + 60, box.y + box.height / 2);
  await radius.press('Home');
  await expect(radius).toHaveAttribute('aria-valuenow', '40');
  await expect.poll(strength).toBe('0.000');
  await radius.press('End');
  await expect(radius).toHaveAttribute('aria-valuenow', '1200');
  await expect.poll(async () => Number(await strength())).toBeGreaterThan(0.6);
  await page.mouse.move(box.x + box.width - 10, box.y + box.height / 2);
  await radius.press('Home');
  await expect.poll(strength).toBe('0.750');
  await radius.press('End');
  await expect.poll(strength).toBe('0.750');
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(
    example.getByRole('region', { name: 'Pointer lighting code', exact: true }),
  ).toContainText('radius: 1200');
});
