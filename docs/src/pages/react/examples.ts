export const hookSurface = `const light = useLight();
const ref = useSurface<HTMLElement>(light);

<article ref={ref}>
  Your existing component
</article>`;
