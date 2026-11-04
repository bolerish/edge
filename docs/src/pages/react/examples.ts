export const hookSurface = `import { useLight, useSurface } from '@bolerish/edge';

function Card() {
  const light = useLight();
  const surface = useSurface<HTMLElement>(light);
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
import { Lighting, type Light } from '@bolerish/edge';

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
