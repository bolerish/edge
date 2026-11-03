// @vitest-environment node
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Lighting } from '../index.js';

it('renders plain host markup without adding a scope wrapper or leaking options', () => {
  expect(typeof window).toBe('undefined');
  const error = vi.spyOn(console, 'error');
  try {
    const html = renderToStaticMarkup(
      <Lighting motion="dynamic">
        <Lighting.Surface as="article" className="card" pseudoElement="before" edgeStyle="matte" theme="wisp" color="red" intensity={0.4}>
          Card
        </Lighting.Surface>
      </Lighting>,
    );
    expect(html).toMatch(/^<article /);
    expect(html).toContain('card');
    expect(html).toContain('--wisp-highlight:red');
    expect(html).toContain('--wisp-intensity:0.4');
    expect(html).not.toMatch(/ (edgeStyle|theme|color|intensity|motion|pseudoElement)=/);
    expect(html).not.toContain('--wisp-angle:');
    expect(error).not.toHaveBeenCalled();
  } finally {
    error.mockRestore();
  }
});
it('requires an explicit light owner for a declarative surface', () => {
  expect(() => renderToStaticMarkup(<Lighting.Surface />)).toThrow(/inside Lighting/);
});
it('rejects unknown motion values from JavaScript consumers', () => {
  // @ts-expect-error Invalid JavaScript input is intentional.
  expect(() => renderToStaticMarkup(<Lighting motion="unknown">Card</Lighting>)).toThrow(RangeError);
});

// Compile-time consumer contracts: native attributes and refs follow `as`.
<Lighting.Surface as="button" disabled onClick={(event) => { event.currentTarget.disabled = true; }} />;
<Lighting.Surface as="a" href="/docs/" />;
// @ts-expect-error A button does not accept an href.
<Lighting.Surface as="button" href="/docs/" />;
// @ts-expect-error A default div does not accept an href.
<Lighting.Surface href="/docs/" />;
// @ts-expect-error The optional Wisp theme has no recessed variant.
<Lighting.Surface theme="wisp" edgeStyle="recessed" />;

it('rejects invalid decoration slots during SSR', () => {
  expect(() => renderToStaticMarkup(
    <Lighting><Lighting.Surface pseudoElement={'invalid' as never} /></Lighting>,
  )).toThrow(RangeError);
});
