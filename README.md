# Edge

A little more alive. Connect your React components to one shared directional light.

## Quick start

Requires React 18 or 19.

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

Load the stylesheet once, before application and utility styles; a separate reset may load first. Edge preserves your background, text, padding and base borders. Highlights use the host’s text color and border radius by default.

`Edge.Provider` adds no DOM. Only explicit surfaces respond; nested scopes are independent. Choose `edgeStyle="raised"`, `"recessed"` or `"matte"`. Motion accepts `"dynamic"`, `"static"` or `"system"` (the default, respecting reduced motion). Use `useSurface(options?)` inside the provider to connect existing hosts through its returned callback ref. For advanced ownership, `useLight` and `useSurface(light, options)` remain available.

## Rendering

`Edge.Provider` and `Edge.Surface` support CSR, SSR and build-time prerendering. `Edge.Surface` emits decoration classes and appearance variables on the server; geometry and lighting activate on the client. `useSurface` attaches decoration after hydration. Keep labels, focus and validation independent of lighting.

Node streaming SSR (`renderToPipeableStream`) and Web streaming SSR (`renderToReadableStream`) can render delayed Suspense surfaces under the same provider. For SSG with hydration, collect hydratable output after all content is ready. `renderToStaticMarkup` is for non-hydratable HTML; without client code, content remains available but lighting does not activate.

In Server Component frameworks, use Edge from a client module marked with `"use client"`. Isolated React 18/19 tests cover both streaming APIs and hydration of completed output, not every framework, deployed runtime or incomplete-stream selective hydration.

## Compatibility

SSR, static rendering and hydration are supported. Hook decoration attaches on the client; `Edge.Surface` also emits decorative classes during SSR. Dedicated Vue, Svelte and Solid adapters are not available.

Decoration uses `::after`; choose `pseudoElement="before"` if needed. Native inputs and hosts using both pseudo-elements need a wrapper. Keep native focus indicators and sufficient contrast.

Position or border-thickness changes without a size notification may require `light.refresh()`. Rotated or perspective geometry and cross-document portals are unsupported.

## Documentation and development

See the [documentation source](docs/src/pages) for usage and API details, and [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and checks.

Packages: `@bolerish/edge` (React), `@bolerish/edge-core` (DOM engine), and `@bolerish/edge-styles` (plain CSS and appearance bindings).

[MIT](LICENSE).
