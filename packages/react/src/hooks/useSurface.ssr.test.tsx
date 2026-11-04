// @vitest-environment node
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { useLight, useSurface } from '../index.js';

function Scene() {
  const light = useLight();
  const surface = useSurface<HTMLButtonElement>(light, {
    edgeStyle: 'raised',
    pseudoElement: 'before',
    theme: 'wisp',
  });
  return (
    <button ref={surface.ref} className={surface.className} style={surface.style}>
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
    expect(html).toContain('class=');
    expect(html).not.toContain('--wisp-angle:');
    expect(renderToStaticMarkup(<Scene />)).toBe(html);
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});

it('selects opt-in theme variants without theming unthemed hosts', () => {
  function Card({ theme, edgeStyle }: { theme?: 'wisp' | false; edgeStyle?: 'raised' | 'matte' }) {
    const light = useLight();
    const surface = useSurface(light, { theme, edgeStyle });
    return <article {...surface}>Card</article>;
  }
  const plain = renderToStaticMarkup(<Card />);
  const raised = renderToStaticMarkup(<Card theme="wisp" edgeStyle="raised" />);
  const matte = renderToStaticMarkup(<Card theme="wisp" edgeStyle="matte" />);
  expect(raised).not.toBe(plain);
  expect(matte).not.toBe(plain);
  expect(matte).not.toBe(raised);
  expect(renderToStaticMarkup(<Card theme="wisp" />)).toBe(raised);
  expect(renderToStaticMarkup(<Card theme={false} />)).toBe(plain);
});
it.each([{}, null, undefined])('rejects an invalid light handle %s', (handle) => {
  function Invalid() {
    // Untyped consumers can pass an arbitrary object at runtime.
    // @ts-expect-error Invalid handle is intentional.
    useSurface(handle);
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
