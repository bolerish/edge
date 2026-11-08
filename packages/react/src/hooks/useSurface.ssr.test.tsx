// @vitest-environment node
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Edge, useLight, useSurface } from '../index.js';

function Scene() {
  const light = useLight();
  const surface = useSurface<HTMLButtonElement>(light, {
    edgeStyle: 'raised',
    pseudoElement: 'before',
  });
  return (
    <button ref={surface}>
      Save
    </button>
  );
}
it('renders SSR and SSG markup without browser globals or render warnings', () => {
  expect(typeof window).toBe('undefined');
  const error = vi.spyOn(console, 'error');
  try {
    const html = renderToString(<Scene />);
    expect(html).toContain('Save</button>');
    expect(html).not.toContain('class=');
    expect(html).not.toContain('--wisp-angle:');
    expect(renderToStaticMarkup(<Scene />)).toBe(html);
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});

it.each([{}, null, undefined])('rejects an invalid light handle %s', (handle) => {
  function Invalid() {
    // Untyped consumers can pass an arbitrary object at runtime.
    // @ts-expect-error Invalid handle is intentional.
    useSurface(handle, {});
    return null;
  }
  expect(() => renderToStaticMarkup(<Invalid />)).toThrow(/returned by useLight/);
});

it('validates hook decoration options during SSR', () => {
  function Invalid() {
    const light = useLight();
    useSurface(light, { pseudoElement: 'invalid' as never });
    return null;
  }
  expect(() => renderToStaticMarkup(<Invalid />)).toThrow(RangeError);
});

it('requires a provider for context-based surfaces', () => {
  function Host() { useSurface(); return <button />; }
  expect(() => renderToStaticMarkup(<Host />)).toThrow(/Edge.Provider/);
  expect(renderToStaticMarkup(<Edge.Provider><Host /></Edge.Provider>)).toBe('<button></button>');
});

it.each([null, { refresh() {} }, 42])('rejects malformed explicit handles inside a provider: %s', (handle) => {
  function Host() {
    // @ts-expect-error Runtime validation of malformed explicit handles.
    useSurface(handle, {});
    return null;
  }
  expect(() => renderToStaticMarkup(<Edge.Provider><Host /></Edge.Provider>)).toThrow(/returned by useLight/);
});

it.each([null, { refresh() {} }, 42])('rejects a malformed single-argument handle: %s', (handle) => {
  function Host() {
    // @ts-expect-error Runtime validation of malformed handles.
    useSurface(handle);
    return null;
  }
  expect(() => renderToStaticMarkup(<Edge.Provider><Host /></Edge.Provider>)).toThrow(/returned by useLight/);
});
