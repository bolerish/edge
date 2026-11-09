# @bolerish/edge-styles

Plain CSS and framework-independent appearance bindings for Edge. Most React consumers should install [`@bolerish/edge`](https://www.npmjs.com/package/@bolerish/edge) instead.

```ts
import { getSurfaceProps } from '@bolerish/edge-styles';
import '@bolerish/edge-styles/style.css';

const { className, style } = getSurfaceProps({
  edgeStyle: 'raised',
  pseudoElement: 'after',
});
```

Apply the returned class and style bindings to your host using your framework's normal binding mechanism. Pair them with `@bolerish/edge-core` for interactive lighting; these bindings alone do not register a light or track pointers.

Load the stylesheet before application and utility styles; a separate reset may load first. Backgrounds, text, padding and base borders stay yours. Highlights default to the host's text color and radius. No styling compiler or style-injection provider is needed.

Decoration uses the selected `::before` or `::after`. Native inputs and hosts using both pseudo-elements need a wrapper. See the [repository](https://github.com/bolerish/edge) for ownership and integration contracts.

MIT licensed.
