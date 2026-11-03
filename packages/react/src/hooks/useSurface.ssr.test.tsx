// @vitest-environment node
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { useLight, useSurface } from '../index.js';

function Scene() {
  const light = useLight();
  const surface = useSurface<HTMLButtonElement>(light, {
    material: 'raised',
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
  function Card({ theme, material }: { theme?: 'wisp' | false; material?: 'raised' | 'matte' }) {
    const light = useLight();
    const surface = useSurface(light, { theme, material });
    return <article {...surface}>Card</article>;
  }
  const plain = renderToStaticMarkup(<Card />);
  const raised = renderToStaticMarkup(<Card theme="wisp" material="raised" />);
  const matte = renderToStaticMarkup(<Card theme="wisp" material="matte" />);
  expect(raised).not.toBe(plain);
  expect(matte).not.toBe(plain);
  expect(matte).not.toBe(raised);
  expect(renderToStaticMarkup(<Card theme="wisp" />)).toBe(raised);
  expect(renderToStaticMarkup(<Card theme={false} />)).toBe(plain);
});
it('rejects a light handle not created by useLight', () => {
  function Invalid() {
    // Untyped consumers can pass an arbitrary object at runtime.
    // @ts-expect-error Invalid handle is intentional.
    useSurface({ refresh() {} });
    return null;
  }
  expect(() => renderToStaticMarkup(<Invalid />)).toThrow(/returned by useLight/);
});
