# @bolerish/edge-core

Framework-independent DOM engine for shared directional lighting. Most React consumers should install [`@bolerish/edge`](https://www.npmjs.com/package/@bolerish/edge) instead.

```ts
import { createLight } from '@bolerish/edge-core';

const light = createLight({ motion: 'system' });
const unmount = light.mount(element.ownerDocument);
const surface = light.register(element, 'raised');

// After application-controlled position changes:
light.refresh();

// When the host and its owner are removed:
surface.destroy();
unmount();
```

Use `@bolerish/edge-styles` separately for decorative CSS and appearance bindings. The engine owns pointer scheduling, geometry and output variables. It does not add React or a styling runtime.

See the [repository](https://github.com/bolerish/wisp) for supported geometry, cleanup and integration contracts.

MIT licensed.
