# Wisp

Directional border lighting for the React components you own. Share one light across cards, buttons, input wrappers and same-document portals. Compose the UI with React and your preferred styling tool; Wisp handles pointer scheduling, geometry and decorative border output.

This is an unreleased React MVP. All workspace packages are private. Svelte, Solid and Vue adapters are not implemented yet. The DOM engine and compiled surface bindings are framework-independent.

```tsx
import { Lighting } from '@bolerish/edge';
import '@bolerish/edge/style.css';

function Area() {
  return (
    <Lighting motion="dynamic">
      <Lighting.Surface as="article" color="#e5edc8">
        Your lit card
      </Lighting.Surface>
      <article>This element keeps its own appearance.</article>
    </Lighting>
  );
}
```

`Lighting` shares one light without adding DOM. Only explicit `Lighting.Surface` descendants respond; nested owners create independent lights. A surface renders a div by default. Use `as` for another HTML tag, and pass normal attributes, events, className, style and refs to that host.

Motion accepts `dynamic`, `static` or `system` (the default). System respects device and reduced-motion preferences. The documentation demo opts into Dynamic. Choose raised, recessed or matte without changing your component’s base appearance. Set `color` and `intensity` through props; surface intensity multiplies shared light intensity.

For an existing component that already owns its host, `useLight` and `useSurface` remain available. Pass the callback ref returned by useSurface to your host; keep your existing className and style props. Edge applies and removes its own decoration. Hook decoration attaches on the client after hydration; Lighting.Surface also emits decorative classes and options in server markup. The decoration uses `::after` by default. Set `pseudoElement: 'before'` (or `<Lighting.Surface pseudoElement="before">`) to preserve an existing `::after`. Use a wrapper around native inputs or components that already use both pseudo-elements.

## Development

Use the versions in `.node-version` and `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

The site lives in `docs/`. Run `pnpm dev`, then open [documentation](http://localhost:4173/docs/) or the [dashboard example](http://localhost:4173/). Both use Bolerish UI; the dashboard connects real cards, fields and buttons to one light. Documentation and syntax-highlighted code are generated as static HTML. See [CONTRIBUTING.md](CONTRIBUTING.md) for checks and package boundaries.

## Rendering and limits

SSR/static rendering and client hydration are supported by the React adapter. Pointer frames do not update React state. System motion respects reduced motion; Dynamic follows the pointer, and Static uses fixed lighting. Lighting does not replace base borders, contrast or keyboard focus.

The effect approximates axis-aligned rectangular surfaces. Position-only layout changes may require `light.refresh()` after commit. The declarative owner exposes the same handle through an optional `ref`. Changing gradients still has browser rendering costs; no FPS or speedup is promised. Cross-document portals and rotated/perspective geometry are not supported.

MIT licensed.

## Package boundaries

- `@bolerish/edge-core`: framework-independent DOM engine and geometry.
- `@bolerish/edge-styles`: framework-independent `getSurfaceProps()` and compiled CSS; no React runtime required.
- `@bolerish/edge`: declarative React components and low-level hooks. It re-exports the shared CSS at its existing `style.css` path.
