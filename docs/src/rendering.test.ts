import { test, expect } from '@playwright/test';

declare global {
  interface Window {
    headingFrames: string[];
    headingSamplingDone: boolean;
  }
}

for (const width of [390, 1440]) {
  test.describe(`viewport ${width}px`, () => {
    test.use({ viewport: { width, height: 844 } });
    test('heading typography stays stable from first painted frame through hydration and refresh', async ({
      page,
    }) => {
      await page.addInitScript(() => {
        window.headingFrames = [];
        window.headingSamplingDone = false;
        let count = 0;
        function sample() {
          const heading = document.querySelector('h1');
          if (heading) {
            const style = getComputedStyle(heading);
            window.headingFrames.push(
              [style.fontSize, style.fontFamily, style.fontWeight].join('|'),
            );
            if (document.readyState === 'complete') count++;
          }
          if (count < 120) requestAnimationFrame(sample);
          else window.headingSamplingDone = true;
        }
        requestAnimationFrame(sample);
      });
      for (const path of ['/', '/docs/']) {
        await page.goto(path);
        for (const refresh of [false, true]) {
          if (refresh) await page.reload();
          await page.waitForFunction(() => window.headingSamplingDone);
          const frames = await page.evaluate(() => window.headingFrames);
          expect(frames.length).toBeGreaterThanOrEqual(120);
          expect([...new Set(frames)]).toHaveLength(1);
          let expectedSize = '24px';
          if (path === '/') expectedSize = width === 390 ? '30px' : '44px';
          expect(frames[0]?.startsWith(`${expectedSize}|`)).toBe(true);
        }
      }
    });
  });
}
