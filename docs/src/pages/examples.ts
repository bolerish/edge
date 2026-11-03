export const firstSurface = `import * as stylex from '@stylexjs/stylex';
import { useLight, useSurface, type Light } from '@wisp-lighting/react';

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
    <article ref={surface.ref} {...stylex.props(surface.style, styles.card)}>
      Project overview
    </article>
  );
}

const styles = stylex.create({ card: { padding: 24, borderRadius: 12 } });`;
export const inputSurface = `import * as stylex from '@stylexjs/stylex';
import { useSurface, type Light } from '@wisp-lighting/react';

function Search({ light }: { light: Light }) {
  const surface = useSurface<HTMLLabelElement>(light, { material: 'recessed' });
  return (
    <label ref={surface.ref} {...stylex.props(surface.style, styles.field)}>
      Search <input name="query" />
    </label>
  );
}

const styles = stylex.create({
  field: { display: 'grid', gap: 8, padding: 16, borderRadius: 12 },
});`;
export const refreshSurface = `useEffect(() => {
  light.refresh();
}, [light, expanded]);`;
