# @bolerish/edge

A little more alive. Connect your React components to one shared directional light.

## Quick start

Requires React 18 or 19.

```sh
npm install @bolerish/edge
```

```tsx
import { Edge } from '@bolerish/edge';

export function Area() {
  return (
    <Edge.Provider>
      <Edge.Surface as="article">Your card</Edge.Surface>
      <Edge.Surface as="button" type="button">
        Save
      </Edge.Surface>
    </Edge.Provider>
  );
}
```

React prepares the default styles automatically when a surface connects. For SSR, render `<Edge.Styles />` once before application styles; pass your request nonce with `<Edge.Styles nonce={nonce} />` when CSP requires it. Keep the same nonce during hydration. Existing `@bolerish/edge/style.css` imports remain supported. Only marked surfaces respond; your colors, layout and interactions stay yours.

## Documentation

See the [guides and API reference](https://edge.bolerish.com/docs/) for styles, motion, integration and rendering.

## Contributing

See [CONTRIBUTING.md](https://github.com/bolerish/edge/blob/main/CONTRIBUTING.md) for setup and checks.

## License

[MIT](https://github.com/bolerish/edge/blob/main/LICENSE).
