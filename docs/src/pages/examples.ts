export const firstSurface = `import { useLight, useSurface, type Light } from '@bolerish/wisp-react';

function App() {
  const light = useLight();
  return <Card light={light} />;
}

function Card({ light }: { light: Light }) {
  const surface = useSurface<HTMLElement>(light, {
    material: 'raised',
    theme: 'wisp',
  });
  return (
    <article ref={surface.ref} className={surface.className} style={{ ...surface.style, padding: 24, borderRadius: 12 }}>
      Project overview
    </article>
  );
}`;
export const inputSurface = `import { useSurface, type Light } from '@bolerish/wisp-react';

function Search({ light }: { light: Light }) {
  const surface = useSurface<HTMLLabelElement>(light, { material: 'recessed' });
  return (
    <label ref={surface.ref} className={surface.className} style={{ ...surface.style, display: 'grid', gap: 8, padding: 16, borderRadius: 12 }}>
      Search <input name="query" />
    </label>
  );
}`;
export const refreshSurface = `useEffect(() => {
  light.refresh();
}, [light, expanded]);`;
