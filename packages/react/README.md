# @bolerish/edge

A little more alive. Connect your React components to one shared directional light.

Requires React 18 or 19. Install with your package manager:

```sh
npm install @bolerish/edge
```

```tsx
import { Edge } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function Area() {
  return (
    <Edge.Provider>
      <Edge.Surface as="article">Your card</Edge.Surface>
      <Edge.Surface as="button" type="button">Save</Edge.Surface>
    </Edge.Provider>
  );
}
```

Load the stylesheet once, before application and utility styles; a separate reset may load first. Edge preserves your background, text, padding and base border. Highlights use the host's text color and border radius by default.

`Edge.Provider` adds no DOM. Only explicit surfaces respond. Choose `edgeStyle="raised"`, `"recessed"` or `"matte"`; motion defaults to `"system"` and respects reduced motion. Existing hosts can call `useSurface(options?)` inside the provider and attach its callback ref. Use `useLight` with `useSurface(light, options)` only when managing a separate light explicitly.

Decoration uses `::after`; choose `pseudoElement="before"` if needed. Native inputs and hosts using both pseudo-elements need a wrapper. Preserve native focus indicators. Hook decoration attaches after hydration; `Edge.Surface` also emits decorative classes during SSR.

## Rendering

`Edge.Provider` and `Edge.Surface` support CSR, SSR and build-time prerendering. `Edge.Surface` emits decoration classes and appearance variables on the server; geometry and lighting activate on the client. `useSurface` attaches decoration after hydration. Keep labels, focus and validation independent of lighting.

Node streaming SSR (`renderToPipeableStream`) and Web streaming SSR (`renderToReadableStream`) can render delayed Suspense surfaces under the same provider. For SSG with hydration, collect hydratable output after all content is ready. `renderToStaticMarkup` is for non-hydratable HTML; without client code, content remains available but lighting does not activate.

In Server Component frameworks, use Edge from a client module marked with `"use client"`. Isolated React 18/19 tests cover both streaming APIs and hydration of completed output, not every framework, deployed runtime or incomplete-stream selective hydration.

See the [usage guide](https://github.com/bolerish/wisp#readme) for limits and the source documentation in the repository's `docs/` directory.

MIT licensed.
