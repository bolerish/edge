import { MotionExample } from './motion.example.js';
import { DecorationSlotExample } from './decoration-slot.example.js';
import decorationSlotSource from './decoration-slot.example.tsx?raw';
import { FirstSurfaceExample } from './first-surface.example.js';
import firstSurfaceSource from './first-surface.example.tsx?raw';
import { SharedLightExample } from './shared-light.example.js';
import sharedLightSource from './shared-light.example.tsx?raw';
import { EdgeStylesExample } from './edge-styles.example.js';

export const firstSurfaceExample = {
  title: 'Your first surface',
  Component: FirstSurfaceExample,
  code: firstSurfaceSource,
};
export const sharedLightExample = {
  title: 'One light, your components',
  Component: SharedLightExample,
  code: sharedLightSource,
};
export const edgeStylesExample = {
  title: 'Compare edge styles',
  Component: EdgeStylesExample,
  code: `const edgeStyles = ['raised', 'recessed', 'matte'];

const light = useLight();
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface.ref} className={surface.className} style={surface.style}>
  Your component
</Card>`,
};

export const decorationSlotExample = {
  title: 'Keep existing pseudo-elements',
  Component: DecorationSlotExample,
  code: decorationSlotSource,
};

export const motionExample = { title: 'Compare motion', Component: MotionExample, code: `const light = useLight({ motion: __MOTION__, staticDirection: __STATIC_DIRECTION__ });
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface.ref} className={surface.className} style={surface.style}>
  Your component
</Card>` };
