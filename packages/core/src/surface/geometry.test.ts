import { describe, expect, it } from 'vitest';
import { getLighting, getStaticLighting } from './geometry.js';

const rect = { left: 100, top: 100, width: 100, height: 100 };
describe('CSS light directions', () => {
  it.each([
    [{ x: 150, y: 50 }, 0],
    [{ x: 250, y: 150 }, 90],
    [{ x: 150, y: 250 }, 180],
    [{ x: 50, y: 150 }, 270],
  ])('maps %o to %s degrees', (point, angle) => {
    expect(getLighting(rect, point, 400, 'raised').angle).toBe(angle);
    expect(getLighting(rect, point, 400, 'recessed').angle).toBe(
      (angle + 180) % 360,
    );
  });
  it('attenuates by distance to the surface, including corners', () => {
    expect(
      getLighting(rect, { x: 250, y: 150 }, 100, 'raised').strength,
    ).toBeCloseTo(0.25);
    expect(getLighting(rect, { x: 300, y: 150 }, 100, 'raised').strength).toBe(
      0,
    );
    expect(getLighting(rect, { x: 300, y: 300 }, 100, 'raised').strength).toBe(
      0,
    );
  });
  it('softens matte and suppresses directional ambiguity at the center', () => {
    const point = { x: 150, y: 100 };
    expect(getLighting(rect, point, 400, 'matte').strength).toBeCloseTo(
      getLighting(rect, point, 400, 'raised').strength * 0.3,
    );
    expect(getLighting(rect, { x: 150, y: 150 }, 400, 'raised')).toEqual({
      angle: 315,
      strength: 0,
    });
  });
});

it('attenuates vertically using the surface height and fades near the center', () => {
  const wide = { left: 0, top: 0, width: 200, height: 40 };
  expect(getLighting(wide, { x: 100, y: 90 }, 100, 'raised').strength).toBeCloseTo(0.25);
  expect(getLighting(rect, { x: 156, y: 150 }, 100, 'raised').strength).toBeCloseTo(0.5);
});

it.each([
  ['raised', 315, 0.7],
  ['recessed', 135, 0.7],
  ['matte', 315, 0.21],
] as const)('provides static lighting for %s', (edgeStyle, angle, strength) => {
  expect(getStaticLighting(edgeStyle).angle).toBe(angle);
  expect(getStaticLighting(edgeStyle).strength).toBeCloseTo(strength);
});
