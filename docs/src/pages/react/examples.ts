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
