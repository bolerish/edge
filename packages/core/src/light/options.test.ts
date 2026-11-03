import { expect, it } from 'vitest';
import { normalizeLightOptions } from './options.js';

it('uses documented defaults and accepts both intensity boundaries', () => {
  expect(normalizeLightOptions({})).toEqual({ motion: 'system', radius: 480, intensity: 0.75, staticDirection: 315 });
  for (const intensity of [0, 1]) {
    expect(normalizeLightOptions({ motion: 'dynamic', radius: 1, intensity }))
      .toEqual({ motion: 'dynamic', radius: 1, intensity, staticDirection: 315 });
  }
});
it.each([0, -1, NaN, Infinity, -Infinity])('rejects invalid radius %s', (radius) => {
  expect(() => normalizeLightOptions({ radius })).toThrow(/radius/);
});
it.each([-0.1, 1.1, NaN, Infinity, -Infinity])('rejects invalid intensity %s', (intensity) => {
  expect(() => normalizeLightOptions({ intensity })).toThrow(/intensity/);
});
it('rejects unknown runtime modes', () => {
  // Exercise input from untyped JavaScript consumers.
  // @ts-expect-error Invalid motion is intentional.
  expect(() => normalizeLightOptions({ motion: 'unknown' })).toThrow(/motion/);
});

it.each([NaN, Infinity, -Infinity])('rejects invalid static direction %s', (staticDirection) => {
  expect(() => normalizeLightOptions({ staticDirection })).toThrow(/staticDirection/);
});
it('accepts random and explicit static directions', () => {
  expect(normalizeLightOptions({ staticDirection: 'random' }).staticDirection).toBe('random');
  expect(normalizeLightOptions({ staticDirection: 90 }).staticDirection).toBe(90);
});
