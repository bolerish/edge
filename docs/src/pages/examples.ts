export const firstSurface = `import { Lighting } from '@bolerish/wisp-react';
import '@bolerish/wisp-react/style.css';

function App() {
  return (
    <Lighting tracking="on">
      <Lighting.Surface as="article" theme="wisp" style={{ padding: 24 }}>
        Project overview
      </Lighting.Surface>
      <article>This element keeps its own appearance.</article>
    </Lighting>
  );
}`;
export const inputSurface = `import { Lighting } from '@bolerish/wisp-react';

function Search() {
  return (
    <Lighting tracking="on">
      <Lighting.Surface
        as="label"
        material="recessed"
        style={{ display: 'grid', gap: 8, padding: 16, borderRadius: 12 }}
      >
        Search <input name="query" />
      </Lighting.Surface>
    </Lighting>
  );
}`;
export const hookSurface = `import { useLight, useSurface } from '@bolerish/wisp-react';

function Card() {
  const light = useLight({ mode: 'pointer' });
  const surface = useSurface<HTMLElement>(light, { color: 'white' });
  return (
    <article
      ref={surface.ref}
      className={surface.className}
      style={{ ...surface.style, padding: 24 }}
    >
      Your existing host
    </article>
  );
}`;
export const refreshSurface = `import { useEffect, useRef } from 'react';
import { Lighting, type Light } from '@bolerish/wisp-react';

function Area({ expanded }: { expanded: boolean }) {
  const light = useRef<Light>(null);
  useEffect(() => light.current?.refresh(), [expanded]);
  return (
    <Lighting ref={light}>
      <Lighting.Surface style={{ marginLeft: expanded ? 100 : 0 }}>
        Your content
      </Lighting.Surface>
    </Lighting>
  );
}`;
