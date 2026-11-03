import { test, expect } from '@playwright/test';

test('changes the real border direction and preserves input, portals and consumer positioning', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  expect(
    await page
      .locator('fieldset')
      .first()
      .evaluate((node) => getComputedStyle(node).borderTopWidth),
  ).toBe('0px');
  expect(
    await page
      .getByRole('button', { name: 'Mouse', exact: true })
      .evaluate((node) => getComputedStyle(node).fontSize),
  ).toBe('12px');
  const card = page.getByTestId('card');
  const box = await card.boundingBox();
  if (!box) throw new Error('missing card');
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
  const pseudo = await card.evaluate((node) => ({
    background: getComputedStyle(node, '::after').backgroundImage,
    pointer: getComputedStyle(node, '::after').pointerEvents,
    mask: getComputedStyle(node, '::after').maskComposite,
  }));
  expect(pseudo.background).toContain('conic-gradient');
  expect(pseudo.pointer).toBe('none');
  expect(pseudo.mask).toContain('exclude');
  const input = page.getByRole('textbox', { name: 'Search your workspace' });
  await input.fill('still my input');
  await input.evaluate((node: HTMLInputElement) =>
    node.setSelectionRange(2, 7),
  );
  await page.mouse.move(box.x + 2, box.y + 40);
  await expect(input).toBeFocused();
  await expect(input).toHaveValue('still my input');
  expect(
    await input.evaluate((node: HTMLInputElement) => [
      node.selectionStart,
      node.selectionEnd,
    ]),
  ).toEqual([2, 7]);
  await input.press('Tab');
  await expect(page.getByRole('button', { name: 'Open quick note' })).toBeFocused();
  await page.keyboard.press('Enter');
  const portal = page.getByTestId('portal');
  await expect(portal).toBeVisible();
  expect(await portal.evaluate((node) => getComputedStyle(node).position)).toBe(
    'fixed',
  );
  const note = page.getByRole('textbox', { name: 'Quick note' });
  await note.fill('portal input');
  await expect(note).toHaveValue('portal input');
  const portalBox = await portal.boundingBox();
  if (!portalBox) throw new Error('missing portal');
  await page.mouse.move(portalBox.x + 2, portalBox.y + portalBox.height / 2);
  await expect
    .poll(() =>
      portal.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('270.0deg');
  await page.getByRole('button', { name: 'Close note' }).click();
  await expect(portal).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('selects Wisp materials, handles static/auto modes and 500 surfaces', async ({
  page,
}) => {
  await page.goto('/');
  const card = page.getByTestId('card');
  await page.getByRole('button', { name: 'Static', exact: true }).click();
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await expect
    .poll(() =>
      page
        .getByTestId('input-surface')
        .evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('135.0deg');
  const raised = await card.evaluate((node) =>
    Number(node.style.getPropertyValue('--wisp-strength')),
  );
  await page.getByRole('button', { name: '03 Matte' }).click();
  await expect
    .poll(() =>
      card.evaluate((node) =>
        Number(node.style.getPropertyValue('--wisp-strength')),
      ),
    )
    .toBeCloseTo(raised * 0.3, 2);
  await page.getByRole('button', { name: '500', exact: true }).click();
  await expect(page.getByTestId('tile')).toHaveCount(500);
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('315.0deg');
  await page.getByRole('button', { name: 'Mouse', exact: true }).click();
  const box = await card.boundingBox();
  if (!box) throw new Error('missing card');
  await page.mouse.move(box.x + 2, box.y + box.height / 2);
  await expect
    .poll(() =>
      card.evaluate((node) => node.style.getPropertyValue('--wisp-angle')),
    )
    .toBe('270.0deg');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.emulateMedia({ forcedColors: 'active' });
  expect(
    await card.evaluate((node) => getComputedStyle(node, '::after').opacity),
  ).toBe('0');
});
