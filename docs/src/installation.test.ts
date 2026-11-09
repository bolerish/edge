import { expect, test } from '@playwright/test';
import { installPrompt } from './shared/installation/install-prompt.js';

for (const width of [320, 375, 768, 1440]) {
  test(`installation panels remain readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/', '/docs/installation']) {
      await page.goto(route);
      await page.waitForTimeout(500);
      const installation = page.locator('.install-commands').first();
      const graphic = page.getByTestId('hero-surface');
      const before = route === '/' ? await graphic.boundingBox() : null;
      for (const tab of ['npm', 'Prompt']) {
        await installation.getByRole('tab', { name: tab, exact: true }).click();
        const block = installation
          .locator('[data-code-block]')
          .filter({
            has: page.getByRole('region', {
              name: tab === 'npm' ? 'npm code' : 'Installation prompt code',
              exact: true,
            }),
          });
        const toolbar = block.locator('> div').first();
        const label = toolbar.locator('span').first();
        await expect(label).toBeVisible();
        const button = toolbar.getByRole('button');
        await expect(button).toBeVisible();
        await expect
          .poll(async () => {
            const labelBox = await label.boundingBox();
            const buttonBox = await button.boundingBox();
            return !!labelBox && !!buttonBox && buttonBox.x > labelBox.x + labelBox.width;
          })
          .toBe(true);
        const region = block.getByRole('region');
        if (tab === 'Prompt') {
          expect((await region.textContent())?.replace(/\s/g, '')).toBe(
            installPrompt.replace(/\s/g, ''),
          );
          await page.keyboard.press('Tab');
          await region.focus();
          await expect(region).toBeFocused();
          expect(await region.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
          expect(await region.evaluate((el) => el.clientHeight)).toBeLessThanOrEqual(320);
          await page.keyboard.press('Control+End');
          await region.evaluate((el) => el.scrollTo(0, el.scrollHeight));
          expect(
            await region.evaluate((el) =>
              Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop),
            ),
          ).toBeLessThanOrEqual(1);
          if (width > 1000 && before) {
            expect((await graphic.boundingBox())!.y).toBeCloseTo(before.y, 0);
          }
        }
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        ).toBe(true);
      }
    }
  });
}
