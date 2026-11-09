import { test, expect } from '@playwright/test';

for (const locale of ['', '/ko', '/es', '/zh', '/ja']) {
  test(`mobile header keeps its single row and controls inside the viewport: ${locale || 'en'}`, async ({
    page,
  }) => {
    for (const width of [320, 375, 760]) {
      await page.setViewportSize({ width, height: 812 });
      for (const path of ['/', '/docs/installation/']) {
        await page.goto(locale + path);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute(
          'href',
          'https://github.com/bolerish/edge',
        );
        const layout = await page.locator('.site-header').evaluate((header) => {
          const [brand, toggleOrNav] = header.children;
          const nav = header.querySelector('nav');
          const buttons = [...header.querySelectorAll('button, a[aria-label="GitHub"]')];
          if (!brand || !toggleOrNav || !nav) throw new Error('Missing header regions');
          const bounds = header.getBoundingClientRect();
          const brandBounds = brand.getBoundingClientRect();
          const navBounds = nav.getBoundingClientRect();
          const docs = nav.querySelector('a');
          const suffix = brand.querySelector('span');
          if (!docs || !suffix) throw new Error('Missing brand or Docs label');
          return {
            brandSize: getComputedStyle(brand).fontSize,
            docsSize: getComputedStyle(docs).fontSize,
            docsMuted: getComputedStyle(docs).color === getComputedStyle(suffix).color,
            brandBesideNav:
              brandBounds.right <= navBounds.left &&
              Math.abs(
                brandBounds.top + brandBounds.height / 2 - (navBounds.top + navBounds.height / 2),
              ) < 1,
            controlsContained: buttons.every((button) => {
              const rect = button.getBoundingClientRect();
              return (
                rect.left >= bounds.left &&
                rect.right <= bounds.right &&
                rect.top >= bounds.top &&
                rect.bottom <= bounds.bottom
              );
            }),
            navContained:
              navBounds.left >= bounds.left &&
              navBounds.right <= bounds.right &&
              navBounds.bottom <= bounds.bottom,
            buttonsDoNotOverlap: buttons.every((button, index) =>
              buttons.slice(index + 1).every((other) => {
                const a = button.getBoundingClientRect();
                const b = other.getBoundingClientRect();
                return (
                  a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top
                );
              }),
            ),
          };
        });
        const searchIcon = page
          .locator('.site-header button svg')
          .filter({ visible: true })
          .first();
        const searchBounds = await searchIcon.boundingBox();
        expect(searchBounds?.width).toBeGreaterThanOrEqual(16);
        expect(layout).toEqual({
          brandSize: '14px',
          docsSize: '12px',
          docsMuted: true,
          brandBesideNav: true,
          controlsContained: true,
          navContained: true,
          buttonsDoNotOverlap: true,
        });
      }
    }
  });
}
