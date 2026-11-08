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
  await page.getByRole('button', { name: 'spread', exact: true }).click();
  await move();
  await expect(surface).toHaveCSS('--edge-angle', '270.0deg');
  const range = page.getByRole('slider', { name: 'radius' });
  await range.focus();
  await range.press('ArrowRight');
  await expect(range).toHaveAttribute('aria-valuenow', '500');
  await page.reload();
  await expect(page.getByRole('button', { name: 'spread', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveAttribute(
    'aria-valuenow',
    '500',
  );
  await page.goto('/');
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveCount(0);
  await expect(page.getByRole('group', { name: 'direction', exact: true })).toHaveCount(0);
  await page.goto('/docs/motion/');
  await expect(page.getByRole('button', { name: 'spread', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('slider', { name: 'radius' })).toHaveAttribute(
    'aria-valuenow',
    '500',
  );
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(
    page.locator('pre').filter({ hasText: 'direction: "spread"' }).first(),
  ).toContainText('radius: 500');
});
