import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const routes = [
  '/',
  '/docs/',
  '/docs/react/',
  '/docs/react/usage/',
  '/docs/styles/',
  '/docs/accessibility/',
  '/docs/react/api/',
];
for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  for (const theme of ['light', 'dark'] as const) {
    test(`axe: ${viewport.width}px, ${theme} theme`, async ({ page }) => {
      test.setTimeout(120000);
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((theme) => {
        localStorage.setItem('wisp:preferences:v1', JSON.stringify({ theme }));
      }, theme);
      const reports = [];
      for (const route of routes) {
        await page.goto(route);
        await expect(page.getByRole('button', {
          name: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        })).toBeVisible();
        const result = await new AxeBuilder({ page })
          .withTags([
            'wcag2a',
            'wcag2aa',
            'wcag21a',
            'wcag21aa',
            'wcag22aa',
            'best-practice',
          ])
          .analyze();
        if (route === '/') {
          // Axe cannot infer text backgrounds through the decorative pseudo-elements.
          const contrasts = await page
            .locator(
              '.dashboard-card h3, .dashboard-card p, .activity-list span',
            )
            .evaluateAll((nodes) => {
              const canvas = document.createElement('canvas');
              canvas.width = canvas.height = 1;
              const context = canvas.getContext('2d')!;
              function luminance(color: string) {
                context.clearRect(0, 0, 1, 1);
                context.fillStyle = color;
                context.fillRect(0, 0, 1, 1);
                const rgb = Array.from(context.getImageData(0, 0, 1, 1).data)
                  .slice(0, 3)
                  .map((value) => {
                    const channel = value / 255;
                    return channel <= 0.04045
                      ? channel / 12.92
                      : ((channel + 0.055) / 1.055) ** 2.4;
                  });
                return rgb[0]! * 0.2126 + rgb[1]! * 0.7152 + rgb[2]! * 0.0722;
              }
              return nodes.map((node) => {
                const foreground = luminance(getComputedStyle(node).color);
                const background = luminance(
                  getComputedStyle(node.closest('.dashboard-card')!)
                    .backgroundColor,
                );
                return {
                  text: node.textContent,
                  ratio:
                    (Math.max(foreground, background) + 0.05) /
                    (Math.min(foreground, background) + 0.05),
                };
              });
            });
          expect(
            contrasts.every((sample) => sample.ratio >= 4.5),
            JSON.stringify(contrasts),
          ).toBe(true);
        }
        reports.push({
          route,
          violations: result.violations,
          incomplete: result.incomplete,
          passes: result.passes.map((item) => item.id),
        });
      }
      await mkdir('../.private/accessibility', { recursive: true });
      await writeFile(
        `../.private/accessibility/${viewport.width}-${theme}.json`,
        JSON.stringify(reports, null, 2),
      );
      expect(
        reports.flatMap((report) =>
          report.violations.map((violation) => ({
            route: report.route,
            id: violation.id,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              summary: node.failureSummary,
            })),
          })),
        ),
      ).toEqual([]);
      if (viewport.width === 1440) {
        await page.goto('/');
        await expect(page.getByRole('button', {
          name: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        })).toBeVisible();
        await page.screenshot({
          path: `../.private/home-${theme}.png`,
          fullPage: true,
        });
        await writeFile(
          `../.private/accessibility/home-${theme}.aria.txt`,
          await page.locator('body').ariaSnapshot(),
        );
      }
    });
  }
}
