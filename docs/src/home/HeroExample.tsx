import { Card } from '@bolerish/ui/card';
import { Lighting } from '@bolerish/edge';
import { usePreferences } from '../settings/usePreferences.js';

export function HeroExample() {
  const { material } = usePreferences();
  return (
    <section className="hero-example" aria-label="Lighting example">
      <div className="hero-example-stage" aria-hidden="true">
        {['back', 'middle', 'front'].map((layer) => (
          <Lighting.Surface
            key={layer}
            material={material}
            color="var(--site-foreground)"
            intensity={1}
            className={`hero-example-surface hero-example-${layer}`}
            data-testid={layer === 'front' ? 'hero-surface' : undefined}
          >
            <Card className="hero-example-panel">
            <Lighting.Surface
              material={material}
              color="var(--site-foreground)"
              intensity={1}
              className="hero-example-orbit"
            />
            <span className="hero-example-line" />
            <span className="hero-example-line hero-example-line-short" />
            </Card>
          </Lighting.Surface>
        ))}
      </div>

    </section>
  );
}
