# @bolerish/edge

A little more alive. Connect your React components to one shared directional light.

Requires React 19. Install with your package manager:

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

Load the stylesheet once, before application and utility styles; a separate reset may load first. Edge preserves your background, text, padding and base border. Highlights use the host's text color and border radius by default.

`Lighting` adds no DOM. Only explicit surfaces respond. Choose `edgeStyle="raised"`, `"recessed"` or `"matte"`; motion defaults to `"system"` and respects reduced motion. Existing hosts can connect through `useLight` and the callback ref returned by `useSurface`.

Decoration uses `::after`; choose `pseudoElement="before"` if needed. Native inputs and hosts using both pseudo-elements need a wrapper. Preserve native focus indicators. Hook decoration attaches after hydration; `Lighting.Surface` also emits decorative classes during SSR.

See the [usage guide](https://github.com/bolerish/wisp#readme) for limits and the source documentation in the repository's `docs/` directory.

MIT licensed.
