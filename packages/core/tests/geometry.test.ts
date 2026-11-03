import { describe, expect, it } from 'vitest';
import { getLighting } from '../src/geometry.js';

const rect = { left: 100, top: 100, width: 100, height: 100 };
describe('CSS light directions', () => {
  it.each([
    [{ x: 150, y: 50 }, 0],
    [{ x: 250, y: 150 }, 90],
    [{ x: 150, y: 250 }, 180],
    [{ x: 50, y: 150 }, 270],
  ])('maps %o to %s degrees', (point, angle) => {
    expect(getLighting(rect, point, 400, 'raised').angle).toBe(angle);
    expect(getLighting(rect, point, 400, 'recessed').angle).toBe((angle + 180) % 360);
  });
  it('attenuates by distance to the surface, including corners', () => {
    expect(getLighting(rect, { x: 250, y: 150 }, 100, 'raised').strength).toBeCloseTo(0.25);
    expect(getLighting(rect, { x: 300, y: 150 }, 100, 'raised').strength).toBe(0);
    expect(getLighting(rect, { x: 300, y: 300 }, 100, 'raised').strength).toBe(0);
  });
  it('softens matte and suppresses directional ambiguity at the center', () => {
    const point = { x: 150, y: 100 };
    expect(getLighting(rect, point, 400, 'matte').strength).toBeCloseTo(getLighting(rect, point, 400, 'raised').strength * 0.3);
    expect(getLighting(rect, { x: 150, y: 150 }, 400, 'raised')).toEqual({ angle: 315, strength: 0 });
  });
});
