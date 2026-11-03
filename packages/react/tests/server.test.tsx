// @vitest-environment node
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import * as stylex from '@stylexjs/stylex';
import { expect, it, vi } from 'vitest';
import { useLight, useSurface } from '@wisp-lighting/react';

function Scene() {
  const light=useLight();const surface=useSurface<HTMLButtonElement>(light,{material:'raised',theme:'wisp'});
  return <button ref={surface.ref} {...stylex.props(surface.style)}>Save</button>;
}
it('renders SSR and SSG markup without browser globals or render warnings',()=>{
  expect(typeof window).toBe('undefined');
  const error=vi.spyOn(console,'error');
  try {
    const html=renderToString(<Scene/>);
    expect(html).toContain('Save</button>');expect(html).toContain('class=');
    expect(html).not.toContain('--wisp-angle:');
    expect(renderToStaticMarkup(<Scene/>)).toBe(html);
    expect(error).not.toHaveBeenCalled();
  } finally {error.mockRestore();}
});
