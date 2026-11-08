# @bolerish/edge

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

Load the stylesheet once, before your application styles. Only marked surfaces respond; your colors, layout and interactions stay yours.

## Documentation

See the [guides and API reference](https://github.com/bolerish/wisp/tree/main/docs/src/pages) for styles, motion, integration and rendering.

## Contributing

See [CONTRIBUTING.md](https://github.com/bolerish/wisp/blob/main/CONTRIBUTING.md) for setup and checks.

## License

[MIT](https://github.com/bolerish/wisp/blob/main/LICENSE).
