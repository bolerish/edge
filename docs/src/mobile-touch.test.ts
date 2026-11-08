import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

for (const mode of ['dynamic', 'system', 'static', 'reduced'] as const) {
  test(`mobile touch respects ${mode} motion and restores resting lighting`, async ({
    page,
    context,
  }) => {
    await page.emulateMedia({ reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    await page.addInitScript(
      (motion) => {
        localStorage.setItem(
          'edge:preferences:v1',
          JSON.stringify({ motion, staticDirection: 315 }),
        );
      },
      mode === 'reduced' ? 'system' : mode,
    );
    await page.goto('/docs/motion/');
    const card = page
      .getByRole('group', { name: 'Compare motion', exact: true })
      .getByRole('article');
    await card.scrollIntoViewIfNeeded();
    await expect
      .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-strength')))
      .not.toBe('');
    const resting = await card.evaluate((node) => ({
      strength: node.style.getPropertyValue('--edge-strength'),
      angle: node.style.getPropertyValue('--edge-angle'),
    }));
    const box = await card.boundingBox();
    if (!box) throw new Error('Missing visible motion card');
    const session = await context.newCDPSession(page);
    const point = { x: box.x + 30, y: box.y + 30, id: 1 };
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    if (mode === 'static' || mode === 'reduced') {
      await page.evaluate(() => new Promise(requestAnimationFrame));
      await expect
        .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-angle')))
        .toBe(resting.angle);
    } else {
      await expect
        .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-angle')))
        .not.toBe(resting.angle);
      const angle = await card.evaluate((node) => node.style.getPropertyValue('--edge-angle'));
      await session.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ ...point, x: point.x + 24 }],
      });
      await expect
        .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-angle')))
        .not.toBe(angle);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await expect
      .poll(() =>
        card.evaluate((node) => ({
          strength: node.style.getPropertyValue('--edge-strength'),
          angle: node.style.getPropertyValue('--edge-angle'),
        })),
      )
      .toEqual(resting);
    await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
    if (mode !== 'static' && mode !== 'reduced') {
      await expect
        .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-angle')))
        .not.toBe(resting.angle);
    }
    await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await expect
      .poll(() =>
        card.evaluate((node) => ({
          strength: node.style.getPropertyValue('--edge-strength'),
          angle: node.style.getPropertyValue('--edge-angle'),
        })),
      )
      .toEqual(resting);
    await session.detach();
  });
}

test('native scrolling keeps touch lighting active until the finger is released', async ({
  page,
  context,
}) => {
  await page.goto('/docs/motion/');
  const card = page
    .getByRole('group', { name: 'Compare motion', exact: true })
    .getByRole('article');
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-strength')))
    .toBe('0.000');
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing motion card');
  const session = await context.newCDPSession(page);
  const initialScroll = await page.evaluate(() => scrollY);
  const point = { x: box.x + 30, y: box.y + 70, id: 1 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] });
  await expect
    .poll(() => card.evaluate((node) => Number(node.style.getPropertyValue('--edge-strength'))))
    .toBeGreaterThan(0);
  for (let step = 1; step <= 5; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ ...point, y: point.y - step * 20 }],
    });
  }
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(initialScroll);
  await expect
    .poll(() => card.evaluate((node) => Number(node.style.getPropertyValue('--edge-strength'))))
    .toBeGreaterThan(0);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [{ ...point, y: point.y - 110 }],
  });
  await expect
    .poll(() => card.evaluate((node) => Number(node.style.getPropertyValue('--edge-strength'))))
    .toBeGreaterThan(0);
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect
    .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-strength')))
    .toBe('0.000');
  await session.detach();
});

test('a held primary touch survives a second finger and ends on release', async ({
  page,
  context,
}) => {
  await page.goto('/docs/motion/');
  const card = page
    .getByRole('group', { name: 'Compare motion', exact: true })
    .getByRole('article');
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-strength')))
    .toBe('0.000');
  const box = await card.boundingBox();
  if (!box) throw new Error('Missing motion card');
  const session = await context.newCDPSession(page);
  const first = { x: box.x + 4, y: box.y + 4, id: 1 };
  const second = { x: box.x + box.width - 4, y: box.y + 4, id: 2 };
  await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [first] });
  await expect
    .poll(() => card.evaluate((node) => Number(node.style.getPropertyValue('--edge-strength'))))
    .toBeGreaterThan(0);
  const angle = await card.evaluate((node) => node.style.getPropertyValue('--edge-angle'));
  // Cross the long-press threshold while keeping the native gesture enabled.
  await page.waitForTimeout(600);
  await expect(card).toHaveCSS('--edge-angle', angle);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [first, second],
  });
  await page.evaluate(() => new Promise(requestAnimationFrame));
  await expect(card).toHaveCSS('--edge-angle', angle);
  await expect
    .poll(() => card.evaluate((node) => Number(node.style.getPropertyValue('--edge-strength'))))
    .toBeGreaterThan(0);
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect
    .poll(() => card.evaluate((node) => node.style.getPropertyValue('--edge-strength')))
    .toBe('0.000');
  await session.detach();
});
