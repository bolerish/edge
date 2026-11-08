import { expect, it } from 'vitest';
import { getSurfaceProps } from './index.js';

it('provides host bindings without requiring a framework or DOM', () => {
  expect('window' in globalThis).toBe(false);
  const props = getSurfaceProps();
  expect(props.className).toEqual(expect.any(String));
  expect(props.className).not.toBe('');
  expect(props.style['--edge-highlight']).toBeUndefined();
  expect(props.style['--edge-intensity']).toBeUndefined();
});
it('maps the requested highlight color to its CSS variable', () => {
  expect(getSurfaceProps({ color: 'red' }).style['--edge-highlight']).toBe('red');
  expect(getSurfaceProps({ color: 'var(--brand)' }).style['--edge-highlight']).toBe('var(--brand)');
});
it.each([
  [0, 0],
  [0.4, 0.4],
  [1, 1],
  [-1, 0],
  [2, 1],
  [NaN, undefined],
  [Infinity, undefined],
  [-Infinity, undefined],
])('normalizes intensity %s to %s', (intensity, expected) => {
  expect(getSurfaceProps({ intensity }).style['--edge-intensity']).toBe(expected);
});

it('supports a separate shadow color and edge thickness', () => {
  const props = getSurfaceProps({ shadowColor: 'transparent', borderWidth: 2 });
  expect(props.style['--edge-shadow']).toBe('transparent');
  expect(props.style['--edge-border-width']).toBe('2px');
  expect(getSurfaceProps({ borderWidth: -1 }).style['--edge-border-width']).toBe('0px');
  expect(getSurfaceProps({ borderWidth: Infinity }).style['--edge-border-width']).toBeUndefined();
});

it('selects one decoration slot without changing the binding shape', () => {
  const after = getSurfaceProps();
  const before = getSurfaceProps({ pseudoElement: 'before' });
  expect(getSurfaceProps({ pseudoElement: 'after' })).toEqual(after);
  expect(Object.keys(before)).toEqual(['className', 'style']);
  expect(before.className).not.toBe(after.className);
});
it.each(['first-line', '', null, 0])('rejects invalid decoration slot %s', (pseudoElement) => {
  expect(() => getSurfaceProps({ pseudoElement: pseudoElement as never })).toThrow(
    new RangeError('Unknown surface pseudoElement'),
  );
});
