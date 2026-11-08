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

for (const locale of ['', '/ko', '/es', '/zh', '/ja']) {
  test(`cold font loading keeps text geometry and theme icon stable: ${locale || 'en'}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/fonts/*.woff2', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      await route.continue();
    });
    await page.addInitScript(() => {
      localStorage.setItem(
        'edge:preferences:v1',
        JSON.stringify({ theme: new URL(location.href).searchParams.get('theme') ?? 'light' }),
      );
      const frames: string[] = [];
      Object.assign(window, { visualFrames: frames, visualSamplingDone: false });
      let completeFrames = 0;
      function sample() {
        const heading = document.querySelector('h1');
        const icon = document.querySelector('[data-testid="theme-toggle"]');
        if (heading && icon) {
          const range = document.createRange();
          range.selectNodeContents(heading);
          const rect = range.getBoundingClientRect();
          frames.push(
            JSON.stringify({
              width: rect.width,
              height: rect.height,
              icons: [...icon.querySelectorAll('svg')].map((svg) => [
                svg.innerHTML,
                getComputedStyle(svg).color,
              ]),
            }),
          );
          if (document.readyState === 'complete') completeFrames++;
        }
        if (completeFrames < 90) requestAnimationFrame(sample);
        else Object.assign(window, { visualSamplingDone: true });
      }
      requestAnimationFrame(sample);
    });
    for (const theme of ['dark', 'light']) {
      for (const refresh of [false, true]) {
        if (refresh) await page.reload();
        else await page.goto(`${locale}/?theme=${theme}`);
        await page.waitForFunction(() => Reflect.get(window, 'visualSamplingDone'));
        const frames: string[] = await page.evaluate(() => Reflect.get(window, 'visualFrames'));
        expect(frames.length).toBeGreaterThan(90);
        expect([...new Set(frames)]).toHaveLength(1);
        const colors = await page
          .locator('[data-testid="theme-toggle"] svg')
          .evaluateAll((icons) => icons.map((icon) => getComputedStyle(icon).color));
        expect(colors).toHaveLength(2);
        expect(colors[theme === 'dark' ? 0 : 1]).toBe('rgba(0, 0, 0, 0)');
        expect(colors[theme === 'dark' ? 1 : 0]).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });
}
