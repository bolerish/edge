import { expect, it } from 'vitest';
import { getSurfaceProps } from './index.js';

it('provides host bindings without requiring a framework or DOM', () => {
  expect('window' in globalThis).toBe(false);
  const props = getSurfaceProps();
  expect(props.className).toEqual(expect.any(String));
  expect(props.className).not.toBe('');
  expect(props.style['--wisp-highlight']).toBeUndefined();
  expect(props.style['--wisp-intensity']).toBeUndefined();
});
it('keeps the base appearance opt-in and selects the requested theme variant', () => {
  const plain = getSurfaceProps().className;
  const raised = getSurfaceProps({ theme: 'wisp', edgeStyle: 'raised' }).className;
  const matte = getSurfaceProps({ theme: 'wisp', edgeStyle: 'matte' }).className;
  expect(getSurfaceProps({ theme: false }).className).toBe(plain);
  expect(raised).not.toBe(plain);
  expect(matte).not.toBe(plain);
  expect(matte).not.toBe(raised);
  expect(getSurfaceProps({ theme: 'wisp' }).className).toBe(raised);
});
it('maps the requested highlight color to its CSS variable', () => {
  expect(getSurfaceProps({ color: 'red' }).style['--wisp-highlight']).toBe('red');
  expect(getSurfaceProps({ color: 'var(--brand)' }).style['--wisp-highlight']).toBe('var(--brand)');
});
it.each([
  [0, 0], [0.4, 0.4], [1, 1], [-1, 0], [2, 1],
  [NaN, undefined], [Infinity, undefined], [-Infinity, undefined],
])('normalizes intensity %s to %s', (intensity, expected) => {
  expect(getSurfaceProps({ intensity }).style['--wisp-intensity']).toBe(expected);
});

it('supports a separate shadow color and edge thickness', () => {
  const props = getSurfaceProps({ shadowColor: 'transparent', borderWidth: 2 });
  expect(props.style['--wisp-shadow']).toBe('transparent');
  expect(props.style['--wisp-border-width']).toBe('2px');
  expect(getSurfaceProps({ borderWidth: -1 }).style['--wisp-border-width']).toBe('0px');
  expect(getSurfaceProps({ borderWidth: Infinity }).style['--wisp-border-width']).toBeUndefined();
});

it('selects one decoration slot without changing the binding shape', () => {
  const after = getSurfaceProps();
  const before = getSurfaceProps({ pseudoElement: 'before' });
  expect(getSurfaceProps({ pseudoElement: 'after' })).toEqual(after);
  expect(Object.keys(before)).toEqual(['className', 'style']);
  expect(before.className).not.toBe(after.className);
  const themed = getSurfaceProps({ pseudoElement: 'before', theme: 'wisp' });
  expect(themed.className).not.toBe(before.className);
  expect(themed.className).not.toBe(getSurfaceProps({ theme: 'wisp' }).className);
});
it.each(['first-line', '', null, 0])('rejects invalid decoration slot %s', (pseudoElement) => {
  expect(() => getSurfaceProps({ pseudoElement: pseudoElement as never })).toThrow(new RangeError('Unknown surface pseudoElement'));
});
