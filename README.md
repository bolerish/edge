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

Load the stylesheet once, before your application styles. Only marked surfaces respond; your colors, layout and interactions stay yours.

## Direction and range

```tsx
<Edge.Provider direction="gather" radius={480}>
  <Edge.Surface>Your card</Edge.Surface>
</Edge.Provider>
```

`direction` defaults to `gather`, facing highlights toward the pointer. Use `spread`
for the opposite direction. Recessed surfaces keep their inverted response in either
mode. `radius` is the fade distance outside each surface in CSS pixels, defaults to
480, and must be positive and finite. These options affect pointer-driven lighting;
fixed lighting uses `staticDirection` instead.

## Documentation

See the [guides and API reference](docs/src/docs) for styles, motion, integration and rendering.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup and checks.

## License

[MIT](LICENSE).
