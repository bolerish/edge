# Wisp

Directional border lighting for the React components you own. Share one light across cards, buttons, input wrappers and same-document portals. Compose the UI with React and StyleX; Wisp handles pointer scheduling, geometry and decorative border output.

This is an unreleased React MVP. All workspace packages are private. Solid and Svelte adapters are not available yet.

```tsx
import * as stylex from '@stylexjs/stylex';
import { useLight, useSurface } from '@bolerish/wisp-react';
import '@bolerish/wisp-react/style.css';

function Card() {
  const light = useLight();
  const surface = useSurface<HTMLElement>(light, {
    material: 'raised',
    theme: 'wisp',
  });
  return (
    <article ref={surface.ref} {...stylex.props(surface.style)}>
      Your content
    </article>
  );
}
```

Create the light in a common owner and pass it to child surfaces to share it. Apply your StyleX styles after `surface.style` so your layout takes precedence. The Wisp theme offers Raised and Matte; an unthemed recessed material supports inset wrappers.

## Development

Use the versions in `.node-version` and `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The site lives in `docs/`. Run `pnpm dev`, then open [documentation](http://127.0.0.1:4173/docs/) or the [dashboard example](http://127.0.0.1:4173/). Both use Bolerish UI; the dashboard connects real cards, fields and buttons to one light. Documentation and syntax-highlighted code are generated as static HTML. See [CONTRIBUTING.md](CONTRIBUTING.md) for checks and package boundaries.

## Rendering and limits

SSR/static rendering and client hydration are supported by the React adapter. Pointer frames do not update React state. Auto mode respects reduced motion; explicit pointer mode opts into tracking, and static mode uses fixed lighting. Lighting does not replace base borders, contrast or keyboard focus.

The effect approximates axis-aligned rectangular surfaces. Position-only layout changes may require `light.refresh()` after commit. Changing gradients still has browser rendering costs; no FPS or speedup is promised. Cross-document portals and rotated/perspective geometry are not supported.

MIT licensed.
