import { MotionExample } from './motion.example.js';
import { DecorationSlotExample } from './decoration-slot.example.js';
import { SharedLightExample } from './shared-light.example.js';
import { EdgeStylesExample } from './edge-styles.example.js';

export const sharedLightExample = {
  title: 'One light, your components',
  Component: SharedLightExample,
  code: `<Edge.Provider>
  <Edge.Surface>Example card</Edge.Surface>
  <Edge.Surface>Another example card</Edge.Surface>
</Edge.Provider>`,
};
export const edgeStylesExample = {
  title: 'Compare edge styles',
  Component: EdgeStylesExample,
  code: `const light = useLight();
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface}>
  Your component
</Card>`,
};

export const decorationSlotExample = {
  title: 'Keep existing pseudo-elements',
  Component: DecorationSlotExample,
  code: `import { Edge } from '@bolerish/edge';

<Edge.Provider>
  <Edge.Surface as="article" pseudoElement="before" className="existing-after">
    Your existing ::after stays intact.
  </Edge.Surface>
</Edge.Provider>`,
};

export const motionExample = { title: 'Compare motion', Component: MotionExample, code: `const light = useLight({ motion: __MOTION__, staticDirection: __STATIC_DIRECTION__ });
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface}>
  Your component
</Card>` };
