import { expect, it } from 'vitest';
import { normalizeLightOptions } from './options.js';

it('uses documented defaults and accepts both intensity boundaries', () => {
  expect(normalizeLightOptions({})).toEqual({
    motion: 'system',
    range: 480,
    intensity: 0.75,
    staticDirection: 315,
    direction: 'toward',
  });
  for (const intensity of [0, 1]) {
    expect(normalizeLightOptions({ motion: 'dynamic', range: 1, intensity })).toEqual({
      motion: 'dynamic',
      range: 1,
      intensity,
      staticDirection: 315,
      direction: 'toward',
    });
  }
});
it.each([0, -1, NaN, Infinity, -Infinity])('rejects invalid range %s', (range) => {
  expect(() => normalizeLightOptions({ range })).toThrow(/range/);
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

it('accepts away', () => {
  expect(normalizeLightOptions({ direction: 'away' }).direction).toBe('away');
});
it.each(['gather', 'spread', 'unknown'])(
  'rejects invalid direction %s from JavaScript',
  (direction) => {
    // @ts-expect-error Exercise untyped consumers.
    expect(() => normalizeLightOptions({ direction })).toThrow(/direction/);
  },
);
