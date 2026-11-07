# Edge

A little more alive. Connect your React components to one shared directional light.

## Quick start

Requires React 18 or 19.

```sh
npm install @bolerish/edge
```

```tsx
import { Lighting } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function Area() {
  return (
    <Lighting>
      <Lighting.Surface as="article">Your card</Lighting.Surface>
      <Lighting.Surface as="button" type="button">Save</Lighting.Surface>
    </Lighting>
  );
}
```

Load the stylesheet once, before application and utility styles; a separate reset may load first. Edge preserves your background, text, padding and base borders. Highlights use the host’s text color and border radius by default.

`Lighting` adds no DOM. Only explicit surfaces respond; nested scopes are independent. Choose `edgeStyle="raised"`, `"recessed"` or `"matte"`. Motion accepts `"dynamic"`, `"static"` or `"system"` (the default, respecting reduced motion). Use `useLight` and the callback ref returned by `useSurface` to connect existing hosts.

## Compatibility

SSR, static rendering and hydration are supported. Hook decoration attaches on the client; `Lighting.Surface` also emits decorative classes during SSR. Dedicated Vue, Svelte and Solid adapters are not available.

Decoration uses `::after`; choose `pseudoElement="before"` if needed. Native inputs and hosts using both pseudo-elements need a wrapper. Keep native focus indicators and sufficient contrast.

Position or border-thickness changes without a size notification may require `light.refresh()`. Rotated or perspective geometry and cross-document portals are unsupported.

## Documentation and development

See the [documentation source](docs/src/pages) for usage and API details, and [CONTRIBUTING.md](CONTRIBUTING.md) for local setup and checks.

Packages: `@bolerish/edge` (React), `@bolerish/edge-core` (DOM engine), and `@bolerish/edge-styles` (plain CSS and appearance bindings).

[MIT](LICENSE).
