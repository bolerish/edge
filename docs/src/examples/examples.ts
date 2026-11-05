import { MotionExample } from './motion.example.js';
import { DecorationSlotExample } from './decoration-slot.example.js';
import { SharedLightExample } from './shared-light.example.js';
import { EdgeStylesExample } from './edge-styles.example.js';

export const sharedLightExample = {
  title: 'One light, your components',
  Component: SharedLightExample,
  code: `<Lighting>
  <Lighting.Surface as="article" className="card">
    Project overview
  </Lighting.Surface>
  <Lighting.Surface as="button" type="button" onClick={saveProject}>
    Save project
  </Lighting.Surface>
  <Lighting.Surface as="label" edgeStyle="recessed">
    Project name
    <Input name="project-name" defaultValue="Website refresh" />
  </Lighting.Surface>
</Lighting>`,
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
  code: `const surface = getSurfaceProps({ pseudoElement: 'before' });
// Compose surface.className and surface.style with your existing host.
// The host's ::after remains available for its own decoration.`,
};

export const motionExample = { title: 'Compare motion', Component: MotionExample, code: `const light = useLight({ motion: __MOTION__, staticDirection: __STATIC_DIRECTION__ });
const surface = useSurface(light, { edgeStyle: __EDGE_STYLE__ });

<Card ref={surface.ref} className={surface.className} style={surface.style}>
  Your component
</Card>` };
