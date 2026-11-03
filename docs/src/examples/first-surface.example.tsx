import { Lighting } from '@bolerish/edge';
import '@bolerish/edge/style.css';

export function FirstSurfaceExample() {
  return (
    <Lighting motion="system">
      <Lighting.Surface
        as="article"
        theme="wisp"
        style={{ padding: 24, marginBottom: 16 }}
      >
        Project overview
      </Lighting.Surface>
      <article>This element keeps its own appearance.</article>
    </Lighting>
  );
}
