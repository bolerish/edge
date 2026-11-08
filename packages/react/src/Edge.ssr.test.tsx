// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Edge } from './index.js';

it('renders plain host markup without adding a scope wrapper or leaking options', () => {
  expect(typeof window).toBe('undefined');
  const error = vi.spyOn(console, 'error');
  try {
    const html = renderToStaticMarkup(
      <Edge.Provider motion="dynamic">
        <Edge.Surface
          as="article"
          className="card"
          pseudoElement="before"
          edgeStyle="matte"
          color="red"
          intensity={0.4}
        >
          Card
        </Edge.Surface>
      </Edge.Provider>,
    );
    expect(html).toMatch(/^<article /);
    expect(html).toContain('card');
    expect(html).toContain('--edge-highlight:red');
    expect(html).toContain('--edge-intensity:0.4');
    expect(html).not.toMatch(/ (edgeStyle|theme|color|intensity|motion|pseudoElement)=/);
    expect(html).not.toContain('--edge-angle:');
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});
it('requires an explicit light owner for a declarative surface', () => {
  expect(() => renderToStaticMarkup(<Edge.Surface />)).toThrow(/inside Edge\.Provider/);
});
it('rejects unknown motion values from JavaScript consumers', () => {
  // @ts-expect-error Invalid JavaScript input is intentional.
  expect(() => renderToStaticMarkup(<Edge.Provider motion="unknown">Card</Edge.Provider>)).toThrow(
    RangeError,
  );
});

// Compile-time consumer contracts: native attributes and refs follow `as`.
<Edge.Surface
  as="button"
  disabled
  onClick={(event) => {
    event.currentTarget.disabled = true;
  }}
/>;
<Edge.Surface as="a" href="/docs/" />;
// @ts-expect-error A button does not accept an href.
<Edge.Surface as="button" href="/docs/" />;
// @ts-expect-error A default div does not accept an href.
<Edge.Surface href="/docs/" />;
// @ts-expect-error Theme presets are not part of the surface API.
<Edge.Surface theme="edge" />;

it('rejects invalid decoration slots during SSR', () => {
  expect(() =>
    renderToStaticMarkup(
      <Edge.Provider>
        <Edge.Surface pseudoElement={'invalid' as never} />
      </Edge.Provider>,
    ),
  ).toThrow(RangeError);
});
